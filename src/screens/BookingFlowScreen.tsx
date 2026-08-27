import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { BookingSummaryCard } from "../components/Cards";
import { BrandMark, PrimaryCTA, SecondaryButton, StatusBar, TopIconButton } from "../components/ui";
import { daysBetween, formatPrice, todayISO, LOCATIONS } from "../data/cars";
import { haptic } from "../core/motion";
import { useAppState, type BookingStep } from "../store/AppState";
import type { StringKey } from "../core/i18n";

const STEP_KEYS: StringKey[] = [
  "booking.stepDates",
  "booking.stepPickup",
  "booking.stepDelivery",
  "booking.stepRenter",
  "booking.stepSummary",
];

export function BookingFlowScreen() {
  const {
    bookingDraft,
    updateBookingDraft,
    setBookingStep,
    confirmBooking,
    isRangeAvailable,
    getCar,
    goBack,
    goMain,
    lastBookingId,
    bookings,
    screen,
    selectedLocation,
    t,
  } = useAppState();

  if (screen === "booking-success") {
    const booking = bookings.find((b) => b.id === lastBookingId);
    const car = getCar(booking?.carId);
    return (
      <div className="screen success-screen">
        <div className="grid-bg" />
        <div className="red-flare" />
        <StatusBar />
        <motion.div
          className="success-icon"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          <Check size={28} />
        </motion.div>
        <div className="eyebrow">{t("booking.confirmed")}</div>
        <h1 className="text-display" style={{ fontSize: 28, margin: "10px 0 8px" }}>
          {t("booking.ready")}
        </h1>
        <div style={{ color: "var(--accent)", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 16 }}>
          {booking?.reference}
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55, marginBottom: 28 }}>
          {t("booking.reserved", {
            car: car ? `${car.brand} ${car.name}` : t("booking.yourCar"),
          })}
          {booking ? ` · ${booking.startDate} → ${booking.endDate}` : ""}.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          <PrimaryCTA fullWidth solid onClick={() => goMain("bookings")}>
            {t("booking.viewBooking")}
          </PrimaryCTA>
          <SecondaryButton fullWidth onClick={() => goMain("home")}>
            {t("booking.backHome")}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!bookingDraft) return null;
  const car = getCar(bookingDraft.carId);
  if (!car) return null;

  const days = daysBetween(bookingDraft.startDate, bookingDraft.endDate);
  const subtotal = days * car.pricePerDay;
  const deliveryFee = bookingDraft.deliveryRequested ? 450 : 0;
  const serviceFee = Math.round(subtotal * 0.05);
  const discount = days >= 4 ? Math.round(subtotal * 0.04) : 0;
  const deposit = Math.round(car.pricePerDay * 0.5);
  const total = subtotal + deliveryFee + serviceFee - discount;
  const zones = [
    ...new Set([
      ...car.pickupZones,
      ...selectedLocation.pickupZones,
      ...LOCATIONS.flatMap((l) => l.pickupZones),
    ]),
  ];

  const step = bookingDraft.step;
  const today = todayISO();
  const datesValid =
    bookingDraft.startDate >= today && bookingDraft.endDate >= bookingDraft.startDate;
  const rangeFree = isRangeAvailable(car.id, bookingDraft.startDate, bookingDraft.endDate);
  const deliveryOk =
    !bookingDraft.deliveryRequested || bookingDraft.deliveryAddress.trim().length > 0;
  const nameOk = bookingDraft.renterName.trim().length >= 2;
  const phoneOk = bookingDraft.renterPhone.replace(/\D/g, "").length >= 8;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingDraft.renterEmail.trim());
  const canNext =
    step < 4 &&
    (step !== 0 || (datesValid && rangeFree)) &&
    (step !== 2 || deliveryOk) &&
    (step !== 3 || (nameOk && phoneOk && emailOk));

  return (
    <div className="screen pack-booking-flow">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />
      <div className="screen-scroll">
        <div className="booking-screen pack">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <TopIconButton aria-label="Back" onClick={goBack}>
              <ArrowLeft size={16} />
            </TopIconButton>
            <BrandMark size={13} />
            <TopIconButton aria-label="Menu" onClick={() => goMain("home")}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>≡</span>
            </TopIconButton>
          </div>

          <div className="pack-booking-hero">
            <div>
              <div className="eyebrow">{t("booking.title")}</div>
              <h1>{car.name}</h1>
              <div className="red-rule" />
            </div>
            <img src={car.heroImage} alt="" />
          </div>

          <div className="step-rail">
            {STEP_KEYS.map((key, i) => (
              <span key={key} className={i <= step ? "on" : ""} />
            ))}
          </div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            {t("booking.step", { n: step + 1 })} · {t(STEP_KEYS[step])}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            {step === 0 && (
              <>
                <div className="field">
                  <label htmlFor="start">{t("booking.pickupDate")}</label>
                  <input
                    id="start"
                    type="date"
                    min={today}
                    value={bookingDraft.startDate}
                    onChange={(e) => updateBookingDraft({ startDate: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="end">{t("booking.returnDate")}</label>
                  <input
                    id="end"
                    type="date"
                    min={bookingDraft.startDate}
                    value={bookingDraft.endDate}
                    onChange={(e) => updateBookingDraft({ endDate: e.target.value })}
                  />
                </div>
                <motion.div
                  key={days}
                  initial={{ scale: 0.96, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    textAlign: "center",
                    letterSpacing: "0.28em",
                    fontFamily: "var(--font-display)",
                    marginTop: 8,
                  }}
                >
                  {t("booking.daysBig", { n: days })}
                </motion.div>
                {!rangeFree && (
                  <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 12 }}>
                    {t("booking.conflict", { car: car.name })}
                  </p>
                )}
              </>
            )}

            {step === 1 && (
              <div className="field">
                <label htmlFor="pickup">{t("booking.pickupLocation")}</label>
                <select
                  id="pickup"
                  value={bookingDraft.pickupLocation}
                  onChange={(e) => updateBookingDraft({ pickupLocation: e.target.value })}
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
                <label htmlFor="return" style={{ marginTop: 12 }}>
                  {t("booking.returnLocation")}
                </label>
                <select
                  id="return"
                  value={bookingDraft.returnLocation}
                  onChange={(e) => updateBookingDraft({ returnLocation: e.target.value })}
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="field">
                  <label>{t("booking.delivery")}</label>
                  <div className="seg">
                    <button
                      type="button"
                      className={!bookingDraft.deliveryRequested ? "on" : ""}
                      onClick={() => updateBookingDraft({ deliveryRequested: false })}
                    >
                      {t("booking.pickupOnly")}
                    </button>
                    <button
                      type="button"
                      className={bookingDraft.deliveryRequested ? "on" : ""}
                      disabled={!selectedLocation.deliveryAvailable}
                      onClick={() => updateBookingDraft({ deliveryRequested: true })}
                    >
                      {t("booking.deliver")}
                    </button>
                  </div>
                </div>
                {bookingDraft.deliveryRequested && (
                  <div className="field">
                    <label htmlFor="addr">{t("booking.deliveryAddress")}</label>
                    <textarea
                      id="addr"
                      value={bookingDraft.deliveryAddress}
                      onChange={(e) => updateBookingDraft({ deliveryAddress: e.target.value })}
                      placeholder={t("booking.deliveryPlaceholder")}
                    />
                  </div>
                )}
                {!selectedLocation.deliveryAvailable && (
                  <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                    {t("booking.deliveryUnavailable", { city: selectedLocation.name })}
                  </p>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div className="field">
                  <label htmlFor="name">{t("booking.fullName")}</label>
                  <input
                    id="name"
                    value={bookingDraft.renterName}
                    onChange={(e) => updateBookingDraft({ renterName: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">{t("booking.phone")}</label>
                  <input
                    id="phone"
                    value={bookingDraft.renterPhone}
                    onChange={(e) => updateBookingDraft({ renterPhone: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">{t("booking.email")}</label>
                  <input
                    id="email"
                    type="email"
                    value={bookingDraft.renterEmail}
                    onChange={(e) => updateBookingDraft({ renterEmail: e.target.value })}
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <BookingSummaryCard
                title={t("booking.priceBreakdown")}
                rows={[
                  { label: t("booking.duration"), value: t("booking.durationDays", { n: days }) },
                  { label: t("booking.baseRate"), value: formatPrice(subtotal) },
                  { label: t("booking.delivery"), value: formatPrice(deliveryFee) },
                  { label: t("booking.serviceFee"), value: formatPrice(serviceFee) },
                  { label: t("booking.discount"), value: discount ? `−${formatPrice(discount)}` : formatPrice(0) },
                  { label: t("booking.depositHold"), value: formatPrice(deposit) },
                  { label: t("booking.total"), value: formatPrice(total), emphasize: true },
                ]}
              />
            )}
          </motion.div>
        </div>
      </div>

      <div className="detail-cta-bar">
        {step > 0 && (
          <SecondaryButton onClick={() => setBookingStep((step - 1) as BookingStep)}>
            {t("common.back")}
          </SecondaryButton>
        )}
        {step < 4 ? (
          <PrimaryCTA
            fullWidth
            solid
            data-testid="booking-continue"
            disabled={!canNext}
            onClick={() => setBookingStep((step + 1) as BookingStep)}
          >
            {t("booking.continue")}
          </PrimaryCTA>
        ) : (
          <PrimaryCTA
            fullWidth
            solid
            data-testid="booking-confirm"
            disabled={!datesValid || !rangeFree}
            onClick={() => {
              haptic("success");
              confirmBooking();
            }}
          >
            {t("booking.confirm")}
          </PrimaryCTA>
        )}
      </div>
    </div>
  );
}
