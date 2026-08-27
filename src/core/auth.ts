/**
 * Auth provider abstraction.
 *
 * - LocalAuthProvider (default): accounts live in localStorage, passwords are
 *   hashed with SubtleCrypto SHA-256 + a per-user random salt. Google/Apple
 *   buttons create/sign into a SIMULATED local account keyed by provider so
 *   the whole flow works with no backend configured.
 * - SupabaseAuthProvider: enabled only when VITE_SUPABASE_URL and
 *   VITE_SUPABASE_ANON_KEY are both set. Email/password + real OAuth via
 *   supabase.auth, plus best-effort sync of bookings/favorites/profile up to
 *   Supabase tables (localStorage stays the source of truth offline).
 */
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { Booking } from "../data/cars";

export type AuthProviderId = "email" | "google" | "apple";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: AuthProviderId;
}

/** Error codes map 1:1 to i18n keys `auth.error.<code>`. */
export type AuthErrorCode =
  | "invalidCredentials"
  | "emailInUse"
  | "weakPassword"
  | "missingFields"
  | "confirmEmail"
  | "emailNotConfirmed"
  | "invalidEmail"
  | "generic";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
    this.code = code;
  }
}

export interface SyncPayload {
  bookings: Booking[];
  favorites: string[];
  profile: {
    name: string;
    email: string;
    phone: string;
    city: string;
    memberSince: string;
    membership: string;
  };
}

export interface AuthProvider {
  readonly kind: "local" | "supabase";
  getSession(): Promise<AuthUser | null>;
  signUp(email: string, password: string, name: string): Promise<AuthUser>;
  signIn(email: string, password: string): Promise<AuthUser>;
  /**
   * Returns the user in local mode. In Supabase mode this triggers a
   * full-page OAuth redirect and resolves to null; the session is picked up
   * by getSession/onAuthChange after the browser returns.
   */
  signInWithOAuth(provider: "google" | "apple"): Promise<AuthUser | null>;
  signOut(): Promise<void>;
  onAuthChange?(cb: (user: AuthUser | null) => void): () => void;
  /** Best-effort, non-blocking upload of app state. No-op in local mode. */
  syncUp?(user: AuthUser, payload: SyncPayload): Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Local provider                                                      */
/* ------------------------------------------------------------------ */

const ACCOUNTS_KEY = "re7lety.auth.accounts.v1";
const SESSION_KEY = "re7lety.auth.session.v1";

interface LocalAccount {
  id: string;
  email: string;
  name: string;
  provider: AuthProviderId;
  /** Only present for email/password accounts. */
  salt?: string;
  passwordHash?: string;
}

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function toAuthUser(a: LocalAccount): AuthUser {
  return { id: a.id, email: a.email, name: a.name, provider: a.provider };
}

export class LocalAuthProvider implements AuthProvider {
  readonly kind = "local" as const;

  private loadAccounts(): LocalAccount[] {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? (JSON.parse(raw) as LocalAccount[]) : [];
    } catch {
      return [];
    }
  }

  private saveAccounts(accounts: LocalAccount[]) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  async getSession(): Promise<AuthUser | null> {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    const account = this.loadAccounts().find((a) => a.id === id);
    return account ? toAuthUser(account) : null;
  }

  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password || !name.trim()) throw new AuthError("missingFields");
    if (password.length < 6) throw new AuthError("weakPassword");
    const accounts = this.loadAccounts();
    if (accounts.some((a) => a.email === normalized && a.provider === "email"))
      throw new AuthError("emailInUse");
    const salt = randomHex(16);
    const account: LocalAccount = {
      id: `local-${randomHex(8)}`,
      email: normalized,
      name: name.trim(),
      provider: "email",
      salt,
      passwordHash: await sha256Hex(salt + password),
    };
    this.saveAccounts([...accounts, account]);
    localStorage.setItem(SESSION_KEY, account.id);
    return toAuthUser(account);
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) throw new AuthError("missingFields");
    const account = this.loadAccounts().find(
      (a) => a.email === normalized && a.provider === "email",
    );
    if (!account || !account.salt || !account.passwordHash)
      throw new AuthError("invalidCredentials");
    const hash = await sha256Hex(account.salt + password);
    if (hash !== account.passwordHash) throw new AuthError("invalidCredentials");
    localStorage.setItem(SESSION_KEY, account.id);
    return toAuthUser(account);
  }

  /**
   * SIMULATED OAuth: with no backend there is no real Google/Apple handshake,
   * so we create (or reuse) one local account per provider. Swapping in
   * SupabaseAuthProvider turns these buttons into real OAuth.
   */
  async signInWithOAuth(provider: "google" | "apple"): Promise<AuthUser | null> {
    const accounts = this.loadAccounts();
    let account = accounts.find((a) => a.provider === provider);
    if (!account) {
      account = {
        id: `local-${provider}-${randomHex(8)}`,
        email: `${provider}.user@re7lety.local`,
        name: provider === "google" ? "Google User" : "Apple User",
        provider,
      };
      this.saveAccounts([...accounts, account]);
    }
    localStorage.setItem(SESSION_KEY, account.id);
    return toAuthUser(account);
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  }
}

/* ------------------------------------------------------------------ */
/* Supabase provider                                                   */
/* ------------------------------------------------------------------ */

function supabaseUserToAuthUser(u: User): AuthUser {
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const rawProvider = (u.app_metadata?.provider as string | undefined) ?? "email";
  const provider: AuthProviderId =
    rawProvider === "google" || rawProvider === "apple" ? rawProvider : "email";
  return {
    id: u.id,
    email: u.email ?? "",
    name:
      (typeof meta.name === "string" && meta.name) ||
      (typeof meta.full_name === "string" && meta.full_name) ||
      (u.email ?? "").split("@")[0],
    provider,
  };
}

export class SupabaseAuthProvider implements AuthProvider {
  readonly kind = "supabase" as const;
  private client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }

  async getSession(): Promise<AuthUser | null> {
    const { data } = await this.client.auth.getSession();
    return data.session?.user ? supabaseUserToAuthUser(data.session.user) : null;
  }

  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    if (!email.trim() || !password || !name.trim()) throw new AuthError("missingFields");
    const { data, error } = await this.client.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw mapSupabaseError(error.message);
    if (!data.user) throw new AuthError("generic");
    // Confirm-email is on: user row exists but there is no session yet.
    // Treat that as "check your inbox", not as a signed-in state.
    if (!data.session) throw new AuthError("confirmEmail");
    return supabaseUserToAuthUser(data.user);
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    if (!email.trim() || !password) throw new AuthError("missingFields");
    const { data, error } = await this.client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw mapSupabaseError(error.message);
    return supabaseUserToAuthUser(data.user);
  }

  async signInWithOAuth(provider: "google" | "apple"): Promise<AuthUser | null> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw mapSupabaseError(error.message);
    // The browser is being redirected to the OAuth consent screen.
    return null;
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  onAuthChange(cb: (user: AuthUser | null) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      cb(session?.user ? supabaseUserToAuthUser(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  }

  /** See supabase/schema.sql for the tables this writes to. */
  async syncUp(user: AuthUser, payload: SyncPayload): Promise<void> {
    try {
      await Promise.all([
        this.client.from("profiles").upsert({
          user_id: user.id,
          name: payload.profile.name,
          email: payload.profile.email,
          phone: payload.profile.phone,
          city: payload.profile.city,
          member_since: payload.profile.memberSince,
          membership: payload.profile.membership,
          updated_at: new Date().toISOString(),
        }),
        this.client.from("favorites").upsert(
          payload.favorites.map((carId) => ({ user_id: user.id, car_id: carId })),
          { onConflict: "user_id,car_id" },
        ),
        this.client.from("bookings").upsert(
          payload.bookings.map((b) => ({
            id: b.id,
            user_id: user.id,
            reference: b.reference,
            car_id: b.carId,
            status: b.status,
            start_date: b.startDate,
            end_date: b.endDate,
            pickup_location: b.pickupLocation,
            return_location: b.returnLocation,
            delivery_requested: b.deliveryRequested,
            delivery_address: b.deliveryAddress,
            renter_name: b.renterName,
            renter_phone: b.renterPhone,
            renter_email: b.renterEmail,
            total: b.total,
            created_at: b.createdAt,
          })),
          { onConflict: "id" },
        ),
      ]);
    } catch {
      // Best-effort by design: localStorage remains the source of truth.
    }
  }
}

function mapSupabaseError(message: string): AuthError {
  const m = message.toLowerCase();
  if (m.includes("email not confirmed")) return new AuthError("emailNotConfirmed", message);
  if (m.includes("email address") && m.includes("invalid"))
    return new AuthError("invalidEmail", message);
  if (m.includes("invalid login credentials")) return new AuthError("invalidCredentials", message);
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already"))
    return new AuthError("emailInUse", message);
  if (m.includes("password")) return new AuthError("weakPassword", message);
  return new AuthError("generic", message);
}

/* ------------------------------------------------------------------ */
/* Factory                                                             */
/* ------------------------------------------------------------------ */

export function createAuthProvider(): AuthProvider {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (url && anonKey) return new SupabaseAuthProvider(url, anonKey);
  return new LocalAuthProvider();
}
