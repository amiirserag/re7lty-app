import { useState } from "react";
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Heart,
  Settings2,
  Share,
  Star,
  Users,
  Waypoints,
} from "lucide-react";
import { PrimaryCTA, TopIconButton } from "../components/ui";
import { formatPrice } from "../data/cars";
import { haptic } from "../core/motion";
import { useAppState } from "../store/AppState";

/** Detail — recording-era layout (LIMITED EDITION, specs, BOOK NOW). */
export function CarDetailScreen() {
  const {
    selectedCarId,
    getCar,
    favorites,
    toggleFavorite,
    openBooking,
    goBack,
    t,
  } = useAppState();
  const car = getCar(selectedCarId);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!car) return null;

  const liked = favorites.includes(car.id);
  const photos = car.gallery.length > 0 ? car.gallery : [car.heroImage, car.detailImage].filter(Boolean);
  const specs = [
    { Icon: Gauge, label: "TOP SPEED", value: `${car.topSpeed} Km/h` },
    { Icon: Settings2, label: "ENGINE", value: car.engine },
    { Icon: Waypoints, label: "DRIVETRAIN", value: car.drivetrain },
    { Icon: Gauge, label: "0-100 KM/H", value: car.acceleration },
    { Icon: Users, label: "SEATS", value: `${car.seats}` },
    { Icon: Fuel, label: "FUEL", value: car.fuel },
  ];

  return (
    <div className="screen ios-detail recording-detail">
      <div className="ios-detail-scroll">
        <header className="ios-detail-head">
          <TopIconButton aria-label="Back" onClick={goBack}>
            <ArrowLeft size={16} />
          </TopIconButton>
          <span className="ios-wordmark recording-wordmark" aria-label="re7lty">
            re<span>7</span>lty
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <TopIconButton
              aria-label="Favorite"
              onClick={() => {
                haptic("light");
                toggleFavorite(car.id);
              }}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </TopIconButton>
            <TopIconButton aria-label="Share">
              <Share size={16} />
            </TopIconButton>
          </div>
        </header>

        <div className="ios-detail-hero">
          <img src={photos[photoIndex] ?? car.heroImage} alt={car.name} />
          <div className="ios-detail-hero-fade" />
          {photos.length > 1 && (
            <div className="ios-detail-dots">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === photoIndex ? "on" : ""}
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setPhotoIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="ios-detail-title">
          <div className="recording-limited">{(car.badge ?? t("common.limitedEdition")).toUpperCase()}</div>
          <div className="red-rule" />
          <h1>{car.name}</h1>
          <div className="ios-rent-row" style={{ marginTop: 10 }}>
            <div>
              {car.priceType === "on_request" ? (
                <strong>Contact office</strong>
              ) : (
                <>
                  <strong>{formatPrice(car.pricePerDay)}</strong>
                  <span style={{ color: "var(--accent)" }}> / DAY</span>
                </>
              )}
            </div>
            {car.reviews > 0 && (
              <span className="ios-detail-rating">
                <Star size={14} fill="currentColor" /> {car.rating.toFixed(1)} ({car.reviews})
              </span>
            )}
          </div>
        </div>

        <div className="ios-spec-grid">
          {specs.map(({ Icon, label, value }) => (
            <div key={label} className="ios-spec-cell">
              <div className="ios-spec-icon" style={{ color: "var(--accent)" }}>
                <Icon size={17} strokeWidth={1.8} />
              </div>
              <span className="lab">{label}</span>
              <strong className="val">{value}</strong>
            </div>
          ))}
        </div>

        <p className="ios-detail-desc">{car.description}</p>
      </div>

      <div className="ios-booking-bar">
        <PrimaryCTA
          fullWidth
          className="ios-book-cta"
          onClick={() => {
            haptic("light");
            openBooking(car.id);
          }}
          disabled={car.priceType === "on_request"}
        >
          {car.priceType === "on_request" ? "CONTACT OFFICE" : "BOOK NOW"}
        </PrimaryCTA>
      </div>
    </div>
  );
}
