import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CARS,
  FEATURED_IDS,
  LOCATIONS,
  daysBetween,
  makeReference,
  rangesOverlap,
  todayISO,
  type Booking,
  type Car,
  type FilterId,
  type LocationOption,
} from "../data/cars";
import { makeT, type Translate } from "../core/i18n";
import {
  AuthError,
  createAuthProvider,
  type AuthErrorCode,
  type AuthUser,
} from "../core/auth";

export type TabId = "home" | "explore" | "bookings" | "favorites" | "profile";

export type ScreenId =
  | "splash"
  | "onboarding"
  | "location"
  | "main"
  | "showcase"
  | "detail"
  | "tour"
  | "gallery"
  | "booking"
  | "booking-success"
  | "nightlife"
  | "office";

export type BookingStep = 0 | 1 | 2 | 3 | 4;

export interface NotificationPrefs {
  bookingUpdates: boolean;
  promotions: boolean;
  priceAlerts: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
}

export interface BookingDraft {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  deliveryRequested: boolean;
  deliveryAddress: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  step: BookingStep;
}

interface Persisted {
  onboardingDone: boolean;
  selectedLocationId: string;
  favorites: string[];
  bookings: Booking[];
  language: "en" | "ar";
  profile: AppStateValue["profile"];
  notifications: NotificationPrefs;
  paymentMethods: PaymentMethod[];
}

interface AppStateValue {
  cars: Car[];
  bookings: Booking[];
  favorites: string[];
  selectedLocationId: string;
  selectedLocation: LocationOption;
  filter: FilterId;
  officeFilter: string;
  sort: "featured" | "price-asc" | "price-desc" | "rating";
  searchQuery: string;
  activeTab: TabId;
  screen: ScreenId;
  selectedCarId: string | null;
  selectedCompanyId: string | null;
  showcaseIndex: number;
  bookingDraft: BookingDraft | null;
  lastBookingId: string | null;
  onboardingDone: boolean;
  language: "en" | "ar";
  t: Translate;
  galleryIndex: number;
  profile: {
    name: string;
    email: string;
    phone: string;
    city: string;
    memberSince: string;
    membership: string;
  };
  notifications: NotificationPrefs;
  paymentMethods: PaymentMethod[];
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthErrorCode | null; user: AuthUser | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthErrorCode | null; user: AuthUser | null }>;
  signInWithProvider: (provider: "google" | "apple") => Promise<{ error: AuthErrorCode | null; user: AuthUser | null }>;
  signOutUser: () => void;
  updateProfile: (partial: Partial<AppStateValue["profile"]>) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  setActiveTab: (tab: TabId) => void;
  setFilter: (f: FilterId) => void;
  setOfficeFilter: (id: string) => void;
  setSort: (s: AppStateValue["sort"]) => void;
  setSearchQuery: (q: string) => void;
  setLanguage: (l: "en" | "ar") => void;
  selectLocation: (id: string) => void;
  completeSplash: () => void;
  completeOnboarding: () => void;
  openLocationPicker: () => void;
  openNightlife: () => void;
  openShowcase: (carId?: string) => void;
  openDetail: (carId: string) => void;
  openOffice: (companyId: string) => void;
  openTour: (carId?: string) => void;
  openGallery: (index?: number) => void;
  openBooking: (carId?: string) => void;
  goBack: () => void;
  goMain: (tab?: TabId) => void;
  nextShowcase: () => void;
  prevShowcase: () => void;
  setShowcaseIndex: (i: number) => void;
  toggleFavorite: (carId: string) => void;
  updateBookingDraft: (partial: Partial<BookingDraft>) => void;
  setBookingStep: (step: BookingStep) => void;
  confirmBooking: () => void;
  isRangeAvailable: (carId: string, start: string, end: string) => boolean;
  getCar: (id: string | null | undefined) => Car | undefined;
  filteredCars: Car[];
  featuredCars: Car[];
  inventoryForLocation: Car[];
}

const STORAGE_KEY = "re7lety.v2";

/** Picked once at startup: Supabase when env vars are set, local otherwise. */
const authProvider = createAuthProvider();

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Move bookings through upcoming → active → completed based on today's date. */
function withDerivedStatuses(list: Booking[]): Booking[] {
  const today = todayISO();
  return list.map((b) => {
    if (b.status === "cancelled") return b;
    const status: Booking["status"] =
      b.endDate < today ? "completed" : b.startDate <= today ? "active" : "upcoming";
    return status === b.status ? b : { ...b, status };
  });
}

function loadPersisted(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Persisted;
  } catch {
    return {};
  }
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [saved] = useState(loadPersisted);
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [filter, setFilter] = useState<FilterId>("All");
  const [officeFilter, setOfficeFilter] = useState<string>("All");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [sort, setSort] = useState<AppStateValue["sort"]>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(
    saved.selectedLocationId ?? "cairo",
  );
  const [selectedCarId, setSelectedCarId] = useState<string | null>(FEATURED_IDS[0]);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(
    saved.favorites ?? ["g-class-night", "lc300"],
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    withDerivedStatuses(saved.bookings ?? []),
  );
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(saved.onboardingDone ?? false);
  const [language, setLanguage] = useState<"en" | "ar">(saved.language ?? "en");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [, setHistory] = useState<ScreenId[]>([]);
  const [profile, setProfile] = useState(
    saved.profile ?? {
      name: "Amir Hassan",
      email: "amir@re7lety.app",
      phone: "+20 100 555 0199",
      city: "Cairo",
      memberSince: "2025",
      membership: "Velocity Member",
    },
  );
  const [notifications, setNotifications] = useState<NotificationPrefs>(
    saved.notifications ?? { bookingUpdates: true, promotions: false, priceAlerts: true },
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    saved.paymentMethods ?? [{ id: "pm-seed-1", brand: "Visa", last4: "4242" }],
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  const applyUser = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (u) {
      // Fill profile name/email from the account only where still empty.
      setProfile((p) => ({
        ...p,
        name: p.name ? p.name : u.name,
        email: p.email ? p.email : u.email,
      }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void authProvider.getSession().then((u) => {
      if (!cancelled) applyUser(u);
    });
    // Supabase fires this after the OAuth redirect lands back on the app.
    const unsubscribe = authProvider.onAuthChange?.((u) => applyUser(u));
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [applyUser]);

  const runAuth = useCallback(
    async (
      action: () => Promise<AuthUser | null>,
    ): Promise<{ error: AuthErrorCode | null; user: AuthUser | null }> => {
      try {
        const u = await action();
        if (u) applyUser(u);
        return { error: null, user: u };
      } catch (e) {
        return { error: e instanceof AuthError ? e.code : "generic", user: null };
      }
    },
    [applyUser],
  );

  const signIn = useCallback(
    (email: string, password: string) => runAuth(() => authProvider.signIn(email, password)),
    [runAuth],
  );

  const signUp = useCallback(
    (email: string, password: string, name: string) =>
      runAuth(() => authProvider.signUp(email, password, name)),
    [runAuth],
  );

  const signInWithProvider = useCallback(
    (provider: "google" | "apple") => runAuth(() => authProvider.signInWithOAuth(provider)),
    [runAuth],
  );

  const signOutUser = useCallback(() => {
    void authProvider.signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    const payload: Persisted = {
      onboardingDone,
      selectedLocationId,
      favorites,
      bookings,
      language,
      profile,
      notifications,
      paymentMethods,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    onboardingDone,
    selectedLocationId,
    favorites,
    bookings,
    language,
    profile,
    notifications,
    paymentMethods,
  ]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Best-effort cloud sync (Supabase mode only); localStorage stays canonical.
  useEffect(() => {
    if (!user || !authProvider.syncUp) return;
    void authProvider.syncUp(user, { bookings, favorites, profile });
  }, [user, bookings, favorites, profile]);

  // Once per sign-in: pull down anything synced from another device/install
  // and merge it into local state (a fresh device/reinstall otherwise starts
  // empty even though the account has cloud data). Local rows win on id
  // conflicts; remote-only rows are added.
  const fetchedDownForUserId = useRef<string | null>(null);
  useEffect(() => {
    if (!user || !authProvider.fetchDown) return;
    if (fetchedDownForUserId.current === user.id) return;
    fetchedDownForUserId.current = user.id;
    void authProvider.fetchDown(user).then((remote) => {
      if (!remote) return;
      if (remote.favorites?.length) {
        setFavorites((prev) => Array.from(new Set([...prev, ...remote.favorites!])));
      }
      if (remote.bookings?.length) {
        setBookings((prev) => {
          const knownIds = new Set(prev.map((b) => b.id));
          const remoteOnly = remote.bookings!.filter((b) => !knownIds.has(b.id));
          return remoteOnly.length ? [...prev, ...remoteOnly] : prev;
        });
      }
      if (remote.profile) {
        setProfile((prev) => ({
          name: prev.name || remote.profile!.name,
          email: prev.email || remote.profile!.email,
          phone: prev.phone || remote.profile!.phone,
          city: prev.city || remote.profile!.city,
          memberSince: prev.memberSince || remote.profile!.memberSince,
          membership: prev.membership || remote.profile!.membership,
        }));
      }
    });
  }, [user]);

  const t = useMemo(() => makeT(language), [language]);

  const selectedLocation =
    LOCATIONS.find((l) => l.id === selectedLocationId) ?? LOCATIONS[0];

  const featuredCars = useMemo(() => {
    const byId = FEATURED_IDS.map((id) => CARS.find((c) => c.id === id)!).filter(Boolean);
    const inLoc = byId.filter(
      (c) =>
        c.nationwide ||
        c.city === selectedLocation.city ||
        c.locationId === selectedLocationId,
    );
    return inLoc.length >= 3 ? inLoc : byId;
  }, [selectedLocation.city, selectedLocationId]);

  const inventoryForLocation = useMemo(
    () =>
      CARS.filter(
        (c) =>
          c.nationwide ||
          c.city === selectedLocation.city ||
          c.locationId === selectedLocationId,
      ),
    [selectedLocation.city, selectedLocationId],
  );

  const filteredCars = useMemo(() => {
    let list = inventoryForLocation.filter((car) => {
      const catOk =
        filter === "All" ||
        car.category === filter ||
        (filter === "7 Seats" && car.seats >= 7);
      const officeOk = officeFilter === "All" || car.companyId === officeFilter;
      const q = searchQuery.trim().toLowerCase();
      const searchOk =
        !q ||
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.category.toLowerCase().includes(q) ||
        car.companyName.toLowerCase().includes(q) ||
        car.city.toLowerCase().includes(q) ||
        car.modelLine.toLowerCase().includes(q);
      return catOk && officeOk && searchOk && car.available;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.pricePerDay - b.pricePerDay;
      if (sort === "price-desc") return b.pricePerDay - a.pricePerDay;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
    return list;
  }, [inventoryForLocation, filter, officeFilter, searchQuery, sort]);

  const pushScreen = useCallback(
    (next: ScreenId) => {
      setHistory((h) => [...h, screen]);
      setScreen(next);
    },
    [screen],
  );

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) {
        setScreen("main");
        return h;
      }
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  }, []);

  const goMain = useCallback((tab?: TabId) => {
    if (tab) setActiveTab(tab);
    setHistory([]);
    setScreen("main");
  }, []);

  /** Recording-era flow: splash → cinematic Home (skip yellow onboarding). */
  const completeSplash = useCallback(() => {
    setOnboardingDone(true);
    if (!saved.selectedLocationId && !selectedLocationId) {
      setSelectedLocationId("cairo");
      const loc = LOCATIONS.find((l) => l.id === "cairo");
      if (loc) setProfile((p) => ({ ...p, city: loc.city }));
    }
    setHistory([]);
    setActiveTab("home");
    setScreen("main");
  }, [saved.selectedLocationId, selectedLocationId]);

  const completeOnboarding = useCallback(() => {
    setOnboardingDone(true);
    setScreen("location");
  }, []);

  const selectLocation = useCallback(
    (id: string) => {
      setSelectedLocationId(id);
      const loc = LOCATIONS.find((l) => l.id === id);
      if (loc) setProfile((p) => ({ ...p, city: loc.city }));
      // Featured list changes with the city; a stale index could point past its end.
      setShowcaseIndex(0);
      setHistory([]);
      setScreen("main");
      setActiveTab("home");
    },
    [],
  );

  const openLocationPicker = useCallback(() => pushScreen("location"), [pushScreen]);
  const openNightlife = useCallback(() => pushScreen("nightlife"), [pushScreen]);

  const openShowcase = useCallback(
    (carId?: string) => {
      if (carId) {
        const idx = featuredCars.findIndex((c) => c.id === carId);
        setShowcaseIndex(idx >= 0 ? idx : 0);
        setSelectedCarId(carId);
      } else {
        setSelectedCarId(featuredCars[showcaseIndex]?.id ?? CARS[0].id);
      }
      pushScreen("showcase");
    },
    [featuredCars, pushScreen, showcaseIndex],
  );

  const openDetail = useCallback(
    (carId: string) => {
      setSelectedCarId(carId);
      pushScreen("detail");
    },
    [pushScreen],
  );

  const openOffice = useCallback(
    (companyId: string) => {
      setSelectedCompanyId(companyId);
      pushScreen("office");
    },
    [pushScreen],
  );

  const openTour = useCallback(
    (carId?: string) => {
      if (carId) setSelectedCarId(carId);
      pushScreen("tour");
    },
    [pushScreen],
  );

  const openGallery = useCallback(
    (index = 0) => {
      setGalleryIndex(index);
      pushScreen("gallery");
    },
    [pushScreen],
  );

  const openBooking = useCallback(
    (carId?: string) => {
      const id = carId ?? selectedCarId ?? CARS[0].id;
      setSelectedCarId(id);
      const car = CARS.find((c) => c.id === id)!;
      setBookingDraft({
        carId: id,
        startDate: todayPlus(1),
        endDate: todayPlus(4),
        pickupLocation: car.pickupZones[0] ?? selectedLocation.pickupZones[0],
        returnLocation: car.pickupZones[0] ?? selectedLocation.pickupZones[0],
        deliveryRequested: false,
        deliveryAddress: "",
        renterName: profile.name,
        renterPhone: profile.phone,
        renterEmail: profile.email,
        step: 0,
      });
      pushScreen("booking");
    },
    [pushScreen, selectedCarId, selectedLocation.pickupZones, profile],
  );

  const nextShowcase = useCallback(() => {
    setShowcaseIndex((i) => {
      const next = (i + 1) % featuredCars.length;
      setSelectedCarId(featuredCars[next].id);
      return next;
    });
  }, [featuredCars]);

  const prevShowcase = useCallback(() => {
    setShowcaseIndex((i) => {
      const next = (i - 1 + featuredCars.length) % featuredCars.length;
      setSelectedCarId(featuredCars[next].id);
      return next;
    });
  }, [featuredCars]);

  const jumpShowcase = useCallback(
    (i: number) => {
      const idx = ((i % featuredCars.length) + featuredCars.length) % featuredCars.length;
      setShowcaseIndex(idx);
      setSelectedCarId(featuredCars[idx].id);
    },
    [featuredCars],
  );

  const toggleFavorite = useCallback((carId: string) => {
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId],
    );
  }, []);

  const updateProfile = useCallback((partial: Partial<AppStateValue["profile"]>) => {
    setProfile((p) => ({ ...p, ...partial }));
  }, []);

  const setNotificationPref = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setNotifications((n) => ({ ...n, [key]: value }));
  }, []);

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, "id">) => {
    setPaymentMethods((list) => [...list, { ...method, id: `pm-${Date.now()}` }]);
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setPaymentMethods((list) => list.filter((m) => m.id !== id));
  }, []);

  const isRangeAvailable = useCallback(
    (carId: string, start: string, end: string) =>
      !bookings.some(
        (b) =>
          b.carId === carId &&
          (b.status === "upcoming" || b.status === "active") &&
          rangesOverlap(start, end, b.startDate, b.endDate),
      ),
    [bookings],
  );

  const updateBookingDraft = useCallback((partial: Partial<BookingDraft>) => {
    setBookingDraft((d) => {
      if (!d) return d;
      const next = { ...d, ...partial };
      const today = todayISO();
      if (next.startDate < today) next.startDate = today;
      if (next.endDate < next.startDate) next.endDate = next.startDate;
      return next;
    });
  }, []);

  const setBookingStep = useCallback((step: BookingStep) => {
    setBookingDraft((d) => (d ? { ...d, step } : d));
  }, []);

  const confirmBooking = useCallback(() => {
    if (!bookingDraft) return;
    if (bookingDraft.startDate < todayISO()) return;
    if (!isRangeAvailable(bookingDraft.carId, bookingDraft.startDate, bookingDraft.endDate))
      return;
    const car = CARS.find((c) => c.id === bookingDraft.carId)!;
    const days = daysBetween(bookingDraft.startDate, bookingDraft.endDate);
    const subtotal = days * car.pricePerDay;
    const deliveryFee = bookingDraft.deliveryRequested ? 450 : 0;
    const serviceFee = Math.round(subtotal * 0.05);
    const discount = days >= 4 ? Math.round(subtotal * 0.04) : 0;
    const deposit = Math.round(car.pricePerDay * 0.5);
    const total = subtotal + deliveryFee + serviceFee - discount;
    const id = `bk-${Date.now()}`;
    const booking: Booking = {
      id,
      reference: makeReference(),
      carId: bookingDraft.carId,
      status: "upcoming",
      pickupLocation: bookingDraft.pickupLocation,
      returnLocation: bookingDraft.returnLocation,
      deliveryRequested: bookingDraft.deliveryRequested,
      deliveryAddress: bookingDraft.deliveryAddress,
      startDate: bookingDraft.startDate,
      endDate: bookingDraft.endDate,
      renterName: bookingDraft.renterName,
      renterPhone: bookingDraft.renterPhone,
      renterEmail: bookingDraft.renterEmail,
      subtotal,
      deliveryFee,
      serviceFee,
      discount,
      deposit,
      total,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBookings((b) => [booking, ...b]);
    setLastBookingId(id);
    setBookingDraft(null);
    setScreen("booking-success");
    setHistory([]);
  }, [bookingDraft, isRangeAvailable]);

  const getCar = useCallback((id: string | null | undefined) => CARS.find((c) => c.id === id), []);

  const value: AppStateValue = {
    cars: CARS,
    bookings,
    favorites,
    selectedLocationId,
    selectedLocation,
    filter,
    officeFilter,
    sort,
    searchQuery,
    activeTab,
    screen,
    selectedCarId,
    selectedCompanyId,
    showcaseIndex,
    bookingDraft,
    lastBookingId,
    onboardingDone,
    language,
    t,
    galleryIndex,
    profile,
    notifications,
    paymentMethods,
    user,
    signIn,
    signUp,
    signInWithProvider,
    signOutUser,
    updateProfile,
    setNotificationPref,
    addPaymentMethod,
    removePaymentMethod,
    setActiveTab,
    setFilter,
    setOfficeFilter,
    setSort,
    setSearchQuery,
    setLanguage,
    selectLocation,
    completeSplash,
    completeOnboarding,
    openLocationPicker,
    openNightlife,
    openShowcase,
    openDetail,
    openOffice,
    openTour,
    openGallery,
    openBooking,
    goBack,
    goMain,
    nextShowcase,
    prevShowcase,
    setShowcaseIndex: jumpShowcase,
    toggleFavorite,
    updateBookingDraft,
    setBookingStep,
    confirmBooking,
    isRangeAvailable,
    getCar,
    filteredCars,
    featuredCars,
    inventoryForLocation,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
