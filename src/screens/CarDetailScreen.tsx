import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  Heart,
  Settings2,
  Star,
  Users,
  Waypoints,
} from "lucide-react";
import { PrimaryCTA, TopIconButton } from "../components/ui";
import { formatPrice } from "../data/cars";
import { haptic } from "../core/motion";
import { useAppState } from "../store/AppState";

/** Detail — matches iOS `CarDetailView` (hero, 6-spec grid, sticky Book Now). */
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
    { Icon: Gauge, label: "Max Speed", value: `${car.topSpeed} ${car.topSpeedUnit}` },
    { Icon: Settings2, label: "Engine", value: car.engine.split(" ").slice(0, 2).join(" ") },
    { Icon: Users, label: "Seats", value: `${car.seats} Seats` },
    { Icon: Settings2, label: "Transmission", value: car.transmission },
    { Icon: Fuel, label: "Fuel Type", value: car.fuel },
    { Icon: Waypoints, label: "Drivetrain", value: car.drivetrain },
  ];

  return (
    <div className="screen ios-detail">
      <div className="ios-detail-scroll">
        <header className="ios-detail-head">
          <TopIconButton aria-label="Back" onClick={goBack}>
            <ArrowLeft size={16} />
          </TopIconButton>
          <span className="ios-wordmark" aria-label="re7lety">
            re<span>7</span>lety
          </span>
          <TopIconButton aria-label="Book" onClick={() => openBooking(car.id)}>
            <Calendar size={16} />
          </TopIconButton>
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
          <button
            type="button"
            className="ios-detail-fav pressable"
            aria-label="Favorite"
            onClick={() => {
              haptic("light");
              toggleFavorite(car.id);
            }}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="ios-detail-title">
          <h1>{car.name}</h1>
          {car.reviews > 0 && (
            <span className="ios-detail-rating">
              <Star size={14} fill="currentColor" /> {car.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="ios-spec-grid">
          {specs.map(({ Icon, label, value }) => (
            <div key={label} className="ios-spec-cell">
              <div className="ios-spec-icon">
                <Icon size={17} strokeWidth={1.8} />
              </div>
              <span className="lab">{label}</span>
              <strong className="val">{value}</strong>
            </div>
          ))}
        </div>

        <div className="ios-rent-row">
          <span>Rent Price</span>
          <div>
            {car.priceType === "on_request" ? (
              <strong>Contact office</strong>
            ) : (
              <>
                <strong>{formatPrice(car.pricePerDay)}</strong>
                <span>/ 1 Day</span>
              </>
            )}
          </div>
        </div>

        <p className="ios-detail-desc">{car.description}</p>
      </div>

      <div className="ios-booking-bar">
        <div className="ios-booking-price">
          <small>RENT PRICE</small>
          <strong>
            {car.priceType === "on_request" ? "Price on request" : formatPrice(car.pricePerDay)}
          </strong>
        </div>
        <PrimaryCTA
          fullWidth
          solid
          className="ios-book-cta"
          onClick={() => openBooking(car.id)}
          disabled={car.priceType === "on_request"}
        >
          {car.priceType === "on_request" ? "Contact office for pricing" : t("detail.bookNow")}
        </PrimaryCTA>
      </div>
    </div>
  );
}
