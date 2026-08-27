import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Menu, MessageCircle, Phone, Search, X } from "lucide-react";
import { BottomSheet } from "../components/Cards";
import { BrandMark, PrimaryCTA, SecondaryButton, StatusBar, TopIconButton } from "../components/ui";
import { formatPrice, type Booking } from "../data/cars";
import { haptic } from "../core/motion";
import { useAppState } from "../store/AppState";
import {
  DESTINATIONS,
  destinationLabel,
  generateItinerary,
  type Itinerary,
} from "../core/concierge";

export function FavoritesScreen() {
  const { cars, favorites, toggleFavorite, openDetail, openLocationPicker, setActiveTab, t } =
    useAppState();
  const saved = cars.filter((c) => favorites.includes(c.id));

  return (
    <div className="tab-view pack-fav">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />
      <div className="home-topbar">
        <TopIconButton aria-label="Menu" onClick={openLocationPicker}>
          <Menu size={16} />
        </TopIconButton>
        <BrandMark />
        <TopIconButton aria-label="Search" onClick={() => setActiveTab("explore")}>
          <Search size={16} />
        </TopIconButton>
      </div>

      <div className="screen-scroll with-tab-bar">
        <div className="pack-page-head">
          <h1>{t("fav.title")}</h1>
          <p>{t("fav.sub")}</p>
          <div className="red-rule center" />
        </div>

        <div className="pack-fav-list">
          {saved.map((car, i) => (
            <motion.button
              key={car.id}
              type="button"
              className="pack-fav-card pressable"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openDetail(car.id)}
            >
              <div className="info">
                <div className="brand">{car.brand}</div>
                <div className="model">{car.name}</div>
                <div className="spec">{car.engine}</div>
                <div className="red-rule" />
                <div className="price">
                  {formatPrice(car.pricePerDay)} <span>{t("common.perDay")}</span>
                </div>
              </div>
              <img src={car.heroImage} alt="" />
              <button
                type="button"
                className="fav-heart"
                aria-label="Unfavorite"
                onClick={(e) => {
                  e.stopPropagation();
                  haptic("light");
                  toggleFavorite(car.id);
                }}
              >
                ♥
              </button>
            </motion.button>
          ))}
          {saved.length === 0 && <div className="empty-state">{t("fav.empty")}</div>}
        </div>
      </div>
    </div>
  );
}

export function BookingsScreen() {
  const { bookings, getCar, openDetail, openLocationPicker, setActiveTab, language, t } =
    useAppState();
  const [seg, setSeg] = useState<"upcoming" | "past">("upcoming");
  const [planBooking, setPlanBooking] = useState<Booking | null>(null);
  const [destination, setDestination] = useState(DESTINATIONS[0].id);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [planError, setPlanError] = useState(false);
  const planCar = planBooking ? getCar(planBooking.carId) : undefined;
  const list = bookings.filter((b) =>
    seg === "upcoming"
      ? b.status === "upcoming" || b.status === "active"
      : b.status === "completed" || b.status === "cancelled",
  );

  return (
    <div className="tab-view pack-bookings">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />
      <div className="home-topbar">
        <TopIconButton aria-label="Menu" onClick={openLocationPicker}>
          <Menu size={16} />
        </TopIconButton>
        <BrandMark />
        <TopIconButton aria-label="Search" onClick={() => setActiveTab("explore")}>
          <Search size={16} />
        </TopIconButton>
      </div>

      <div className="screen-scroll with-tab-bar">
        <div className="pack-page-head">
          <h1>{t("bookings.title")}</h1>
          <div className="red-rule center" />
          <p>{t("bookings.sub")}</p>
        </div>

        <div className="seg pack">
          <button type="button" className={seg === "upcoming" ? "on" : ""} onClick={() => setSeg("upcoming")}>
            {t("bookings.upcoming")}
          </button>
          <button type="button" className={seg === "past" ? "on" : ""} onClick={() => setSeg("past")}>
            {t("bookings.past")}
          </button>
        </div>

        <div style={{ padding: "0 18px 24px" }}>
          {list.map((b, i) => {
            const car = getCar(b.carId);
            if (!car) return null;
            return (
              <motion.article
                key={b.id}
                className="pack-booking-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="row-top">
                  <div>
                    <div className="model">{car.name}</div>
                    <div className="sub">{car.badge ?? car.category}</div>
                    <div className="red-rule" />
                  </div>
                  <div className="badge-spec">{car.engine.split(" ").pop()}</div>
                </div>
                <div className="row-mid">
                  <div className="facts">
                    <div>
                      <span className="lab">{t("bookings.pickup")}</span>
                      <strong>{b.pickupLocation}</strong>
                    </div>
                    <div>
                      <span className="lab">{t("bookings.dates")}</span>
                      <strong>
                        {b.startDate} → {b.endDate}
                      </strong>
                    </div>
                    <div className="ref">
                      <span className="lab">{t("bookings.reference")}</span>
                      <strong>
                        {b.reference}{" "}
                        <button
                          type="button"
                          aria-label="Copy"
                          onClick={() => {
                            void navigator.clipboard?.writeText(b.reference);
                            haptic("selection");
                          }}
                        >
                          <Copy size={12} color="var(--accent)" />
                        </button>
                      </strong>
                    </div>
                  </div>
                  <img src={car.detailImage || car.heroImage} alt="" />
                </div>
                <div className="row-bot">
                  <span className="status">● {t(`status.${b.status}`)}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="view"
                      onClick={() => {
                        setPlanBooking(b);
                        setItinerary(null);
                        setPlanError(false);
                      }}
                    >
                      {t("concierge.action")}
                    </button>
                    <button type="button" className="view" onClick={() => openDetail(car.id)}>
                      {t("bookings.viewDetails")}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
          {list.length === 0 && (
            <div className="empty-state">
              {seg === "upcoming" ? t("bookings.emptyUpcoming") : t("bookings.emptyPast")}
            </div>
          )}
        </div>
      </div>

      <BottomSheet
        open={!!planBooking}
        onClose={() => {
          setPlanBooking(null);
          setItinerary(null);
          setPlanError(false);
        }}
        title={t("concierge.title")}
      >
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
          {t("concierge.intro")}
        </p>
        <div className="field">
          <label htmlFor="concierge-dest">{t("concierge.destination")}</label>
          <select
            id="concierge-dest"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setItinerary(null);
            }}
          >
            {DESTINATIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {destinationLabel(d.id, language)}
              </option>
            ))}
          </select>
        </div>
        <PrimaryCTA
          fullWidth
          solid
          onClick={() => {
            if (!planBooking || !planCar || generating) return;
            setGenerating(true);
            setPlanError(false);
            void generateItinerary({
              car: { name: planCar.name, type: planCar.category, seats: planCar.seats },
              startDate: planBooking.startDate,
              endDate: planBooking.endDate,
              from: planCar.city,
              to: destination,
              language,
            })
              .then((result) => setItinerary(result.itinerary))
              .catch(() => setPlanError(true))
              .finally(() => setGenerating(false));
          }}
        >
          {generating ? t("concierge.generating") : t("concierge.generate")}
        </PrimaryCTA>
        {planError && (
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 12 }}>
            {t("concierge.error")}
          </p>
        )}
        {itinerary && (
          <div style={{ marginTop: 18 }}>
            {itinerary.days.map((day) => (
              <div key={day.day} style={{ marginBottom: 16 }}>
                <div className="eyebrow">
                  {t("concierge.day", { n: day.day })} · {day.title}
                </div>
                <div className="red-rule" />
                {day.stops.map((stop) => (
                  <p
                    key={`${day.day}-${stop.time}-${stop.name}`}
                    style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5, margin: "8px 0 0" }}
                  >
                    {stop.time} · {stop.name}
                    {stop.note ? ` — ${stop.note}` : ""}
                  </p>
                ))}
              </div>
            ))}
            {itinerary.tips.length > 0 && (
              <div>
                <div className="eyebrow">{t("concierge.tips")}</div>
                <div className="red-rule" />
                {itinerary.tips.map((tip) => (
                  <p
                    key={tip}
                    style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5, margin: "8px 0 0" }}
                  >
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

type ProfileSheet = "personal" | "payment" | "notifications" | "help" | "auth" | null;
type AuthMode = "signin" | "signup";

export function ProfileScreen() {
  const {
    profile,
    notifications,
    paymentMethods,
    updateProfile,
    setNotificationPref,
    addPaymentMethod,
    removePaymentMethod,
    language,
    setLanguage,
    openShowcase,
    setActiveTab,
    user,
    signIn,
    signUp,
    signInWithProvider,
    signOutUser,
    t,
  } = useAppState();

  const [sheet, setSheet] = useState<ProfileSheet>(null);
  const [draft, setDraft] = useState(profile);
  const [newCardBrand, setNewCardBrand] = useState("Visa");
  const [newCardLast4, setNewCardLast4] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<
    | "invalidCredentials"
    | "emailInUse"
    | "weakPassword"
    | "missingFields"
    | "confirmEmail"
    | "emailNotConfirmed"
    | "invalidEmail"
    | "generic"
    | null
  >(null);
  const [authBusy, setAuthBusy] = useState(false);

  const closeAuthSheet = () => {
    setSheet(null);
    setAuthPassword("");
    setAuthError(null);
  };

  const submitAuth = async () => {
    setAuthBusy(true);
    setAuthError(null);
    const { error, user: next } =
      authMode === "signin"
        ? await signIn(authEmail.trim().toLowerCase(), authPassword)
        : await signUp(authEmail.trim().toLowerCase(), authPassword, authName.trim());
    setAuthBusy(false);
    if (error === "confirmEmail") {
      setAuthMode("signin");
      setAuthPassword("");
      setAuthError(error);
      return;
    }
    if (error) {
      setAuthError(error);
      return;
    }
    if (next) {
      haptic("success");
      closeAuthSheet();
    }
  };

  const submitOAuth = async (provider: "google" | "apple") => {
    setAuthBusy(true);
    setAuthError(null);
    const { error, user: next } = await signInWithProvider(provider);
    setAuthBusy(false);
    if (error) {
      setAuthError(error);
      return;
    }
    if (next) {
      haptic("success");
      closeAuthSheet();
    }
  };

  const rows: Array<{ label: string; value?: string; danger?: boolean; action: () => void }> = [
    {
      label: t("profile.personalInfo"),
      action: () => {
        setDraft(profile);
        setSheet("personal");
      },
    },
    {
      label: t("profile.paymentMethods"),
      value: t("profile.savedCount", { n: paymentMethods.length }),
      action: () => setSheet("payment"),
    },
    { label: t("profile.notifications"), action: () => setSheet("notifications") },
    {
      label: t("profile.language"),
      value: language === "en" ? "English" : "العربية",
      action: () => setLanguage(language === "en" ? "ar" : "en"),
    },
    { label: t("profile.help"), action: () => setSheet("help") },
    user
      ? {
          label: t("profile.logout"),
          value: user.email,
          danger: true,
          action: () => {
            haptic("light");
            signOutUser();
          },
        }
      : {
          label: t("auth.signIn"),
          action: () => {
            setAuthMode("signin");
            setAuthError(null);
            setSheet("auth");
          },
        },
  ];

  return (
    <div className="tab-view pack-profile">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />
      <div className="home-topbar">
        <TopIconButton aria-label="Menu" onClick={() => setActiveTab("home")}>
          <Menu size={16} />
        </TopIconButton>
        <BrandMark />
        <TopIconButton aria-label="Search" onClick={() => setActiveTab("explore")}>
          <Search size={16} />
        </TopIconButton>
      </div>

      <div className="screen-scroll with-tab-bar">
        <div className="pack-page-head">
          <h1>{t("profile.title")}</h1>
          <div className="red-rule center" />
        </div>

        <div className="pack-profile-hero">
          <div className="hud-col side">V12</div>
          <div className="avatar-xl">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="hud-col side">RWD</div>
        </div>
        <div className="pack-profile-name">{profile.name.split(" ")[0].toUpperCase()}</div>
        <div className="member-pill">
          <span className="seven">7</span> {profile.membership}
        </div>

        <div className="pack-profile-rows">
          {rows.map((row, i) => (
            <motion.button
              key={row.label}
              type="button"
              className={`pack-profile-row pressable ${row.danger ? "danger" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={row.action}
            >
              <span className="lab">{row.label}</span>
              {row.value && <span className="val">{row.value}</span>}
              <span className="chev">›</span>
            </motion.button>
          ))}
        </div>

        <div style={{ padding: "18px 18px 28px" }}>
          <PrimaryCTA fullWidth onClick={() => openShowcase()}>
            {t("profile.openShowcase")}
          </PrimaryCTA>
        </div>
      </div>

      <BottomSheet
        open={sheet === "personal"}
        onClose={() => setSheet(null)}
        title={t("profile.personalInfo")}
      >
        <div className="field">
          <label htmlFor="pf-name">{t("booking.fullName")}</label>
          <input
            id="pf-name"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-phone">{t("booking.phone")}</label>
          <input
            id="pf-phone"
            value={draft.phone}
            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-email">{t("booking.email")}</label>
          <input
            id="pf-email"
            type="email"
            value={draft.email}
            onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-city">{t("profile.city")}</label>
          <input
            id="pf-city"
            value={draft.city}
            onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
          />
        </div>
        <PrimaryCTA
          fullWidth
          solid
          onClick={() => {
            updateProfile(draft);
            haptic("success");
            setSheet(null);
          }}
        >
          {t("profile.saveChanges")}
        </PrimaryCTA>
      </BottomSheet>

      <BottomSheet
        open={sheet === "payment"}
        onClose={() => setSheet(null)}
        title={t("profile.paymentMethods")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {paymentMethods.map((m) => (
            <div
              key={m.id}
              className="booking-summary"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
              }}
            >
              <span>
                {m.brand} •••• {m.last4}
              </span>
              <button
                type="button"
                className="icon-btn"
                style={{ width: 32, height: 32 }}
                aria-label={t("profile.removeCard", { brand: m.brand, last4: m.last4 })}
                onClick={() => {
                  haptic("light");
                  removePaymentMethod(m.id);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {paymentMethods.length === 0 && (
            <div className="empty-state">{t("profile.noPayment")}</div>
          )}
        </div>
        <div className="field">
          <label htmlFor="pm-brand">{t("profile.cardBrand")}</label>
          <select
            id="pm-brand"
            value={newCardBrand}
            onChange={(e) => setNewCardBrand(e.target.value)}
          >
            <option>Visa</option>
            <option>Mastercard</option>
            <option>Meeza</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="pm-last4">{t("profile.last4")}</label>
          <input
            id="pm-last4"
            inputMode="numeric"
            maxLength={4}
            value={newCardLast4}
            onChange={(e) => setNewCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="0000"
          />
        </div>
        <PrimaryCTA
          fullWidth
          solid
          disabled={newCardLast4.length !== 4}
          onClick={() => {
            addPaymentMethod({ brand: newCardBrand, last4: newCardLast4 });
            setNewCardLast4("");
            haptic("success");
          }}
        >
          {t("profile.addCard")}
        </PrimaryCTA>
      </BottomSheet>

      <BottomSheet
        open={sheet === "notifications"}
        onClose={() => setSheet(null)}
        title={t("profile.notifications")}
      >
        {(
          [
            { key: "bookingUpdates", labelKey: "profile.bookingUpdates" },
            { key: "priceAlerts", labelKey: "profile.priceAlerts" },
            { key: "promotions", labelKey: "profile.promotions" },
          ] as const
        ).map((item) => (
          <div key={item.key} className="field">
            <label>{t(item.labelKey)}</label>
            <div className="seg">
              <button
                type="button"
                className={!notifications[item.key] ? "on" : ""}
                onClick={() => setNotificationPref(item.key, false)}
              >
                {t("profile.off")}
              </button>
              <button
                type="button"
                className={notifications[item.key] ? "on" : ""}
                onClick={() => setNotificationPref(item.key, true)}
              >
                {t("profile.on")}
              </button>
            </div>
          </div>
        ))}
      </BottomSheet>

      <BottomSheet
        open={sheet === "auth"}
        onClose={closeAuthSheet}
        title={authMode === "signin" ? t("auth.signIn") : t("auth.signUp")}
      >
        <div className="seg" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={authMode === "signin" ? "on" : ""}
            onClick={() => {
              setAuthMode("signin");
              setAuthError(null);
            }}
          >
            {t("auth.signIn")}
          </button>
          <button
            type="button"
            className={authMode === "signup" ? "on" : ""}
            onClick={() => {
              setAuthMode("signup");
              setAuthError(null);
            }}
          >
            {t("auth.signUp")}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitAuth();
          }}
        >
        {authMode === "signup" && (
          <div className="field">
            <label htmlFor="auth-name">{t("booking.fullName")}</label>
            <input
              id="auth-name"
              name="name"
              autoComplete="name"
              autoCapitalize="words"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="auth-email">{t("booking.email")}</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="auth-password">{t("auth.password")}</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={authMode === "signin" ? "current-password" : "new-password"}
            autoCapitalize="none"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />
        </div>

        {authError && (
          <p
            style={{
              color: authError === "confirmEmail" ? "var(--text-secondary)" : "var(--accent)",
              fontSize: 12,
              margin: "0 0 14px",
              lineHeight: 1.5,
            }}
          >
            {t(`auth.error.${authError}`)}
          </p>
        )}

        <PrimaryCTA fullWidth solid disabled={authBusy} onClick={() => void submitAuth()}>
          {authMode === "signin" ? t("auth.signIn") : t("auth.signUp")}
        </PrimaryCTA>
        </form>

        <div className="eyebrow" style={{ textAlign: "center", margin: "16px 0 12px" }}>
          {t("auth.or")}
        </div>
        <div className="red-rule center" style={{ marginBottom: 14 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SecondaryButton fullWidth disabled={authBusy} onClick={() => void submitOAuth("google")}>
            {t("auth.continueGoogle")}
          </SecondaryButton>
          <SecondaryButton fullWidth disabled={authBusy} onClick={() => void submitOAuth("apple")}>
            {t("auth.continueApple")}
          </SecondaryButton>
        </div>
      </BottomSheet>

      <BottomSheet
        open={sheet === "help"}
        onClose={() => setSheet(null)}
        title={t("profile.helpSheet")}
      >
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
          {t("profile.helpText")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SecondaryButton fullWidth onClick={() => window.location.assign("tel:+201005550199")}>
            <Phone size={14} /> {t("profile.callSupport")}
          </SecondaryButton>
          <SecondaryButton
            fullWidth
            onClick={() => window.open("https://wa.me/201005550199", "_blank", "noopener")}
          >
            <MessageCircle size={14} /> {t("profile.whatsapp")}
          </SecondaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}

export function GalleryScreen() {
  const { selectedCarId, getCar, galleryIndex, goBack } = useAppState();
  const car = getCar(selectedCarId);
  const [index, setIndex] = useState(galleryIndex);
  const [scale, setScale] = useState(1);
  if (!car) return null;
  const src = car.gallery[index % car.gallery.length];

  return (
    <div className="screen gallery-view">
      <StatusBar />
      <div style={{ position: "absolute", top: "calc(var(--safe-top) + 8px)", left: 16, zIndex: 5 }}>
        <button type="button" className="icon-btn" onClick={goBack} aria-label="Close gallery">
          ←
        </button>
      </div>
      <motion.img
        key={src}
        src={src}
        alt=""
        drag
        dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }}
        style={{ scale }}
        onDoubleClick={() => setScale((s) => (s > 1 ? 1 : 1.8))}
      />
      <div style={{ position: "absolute", bottom: 48, display: "flex", gap: 8 }}>
        {car.gallery.map((g, i) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setIndex(i);
              setScale(1);
            }}
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              background: i === index % car.gallery.length ? "var(--accent)" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
