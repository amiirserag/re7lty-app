import { Heart, Plus, Star } from "lucide-react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useState } from "react";
import { haptic, MotionTokens } from "../core/motion";
import type { Car } from "../data/cars";
import { formatPrice } from "../data/cars";

export function Hotspot({
  x,
  y,
  active,
  onClick,
}: {
  x: number;
  y: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className={`hotspot ${active ? "active" : ""}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.9 }}
      aria-label="Hotspot detail"
    >
      {!active && <span className="hotspot-pulse" />}
      <Plus size={15} strokeWidth={1.75} />
    </motion.button>
  );
}

export function FavoriteButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      className="icon-btn"
      aria-label="Favorite"
      onClick={() => {
        haptic("light");
        onToggle();
      }}
      animate={{ scale: active ? [0.85, 1.18, 1] : 1 }}
      transition={{ duration: 0.35 }}
    >
      <Heart
        size={16}
        fill={active ? "var(--accent)" : "none"}
        color={active ? "var(--accent)" : "white"}
      />
    </motion.button>
  );
}

export function CarHeroCard({
  car,
  favorited,
  onOpen,
  onToggleFavorite,
}: {
  car: Car;
  favorited?: boolean;
  onOpen?: () => void;
  onToggleFavorite?: () => void;
}) {
  return (
    <motion.article
      className="car-hero-card pressable"
      whileTap={{ scale: 0.975 }}
      transition={MotionTokens.cardSpring}
      onClick={onOpen}
      layout
    >
      <img src={car.heroImage} alt={`${car.brand} ${car.name}`} loading="lazy" />
      <div className="overlay">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              {car.brand} · {car.companyName}
            </div>
            <div className="name">{car.name}</div>
          </div>
          <button
            type="button"
            className="icon-btn"
            style={{ width: 32, height: 32 }}
            onClick={(e) => {
              e.stopPropagation();
              haptic("light");
              onToggleFavorite?.();
            }}
          >
            <Heart
              size={14}
              fill={favorited ? "var(--accent)" : "none"}
              color={favorited ? "var(--accent)" : "white"}
            />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          <span>{car.city}</span>
          <span style={{ color: "white", fontWeight: 600 }}>
            {formatPrice(car.pricePerDay)}{" "}
            <span style={{ color: "var(--accent)" }}>/ DAY</span>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function CarListCard({
  car,
  onOpen,
}: {
  car: Car;
  onOpen?: () => void;
}) {
  return <IOSCarCard car={car} onOpen={onOpen} />;
}

/** iOS archive `CarCard` layout — meta left, artwork right, yellow arrow CTA. */
export function IOSCarCard({
  car,
  favorited,
  onOpen,
  onToggleFavorite,
}: {
  car: Car;
  favorited?: boolean;
  onOpen?: () => void;
  onToggleFavorite?: () => void;
}) {
  return (
    <motion.button
      type="button"
      className="ios-car-card pressable"
      whileTap={{ scale: 0.985 }}
      onClick={onOpen}
      layout
    >
      <div className="ios-car-meta">
        {car.reviews > 0 ? (
          <span className="ios-car-rating">
            <Star size={11} fill="currentColor" /> {car.rating.toFixed(1)}
          </span>
        ) : (
          <span className="ios-car-rating">Verified fleet</span>
        )}
        <span className="ios-car-brand">{car.brand}</span>
        <span className="ios-car-model">{car.modelLine || car.name}</span>
        <div className="ios-car-price">
          {car.priceType === "on_request" ? (
            <strong>Price on request</strong>
          ) : (
            <>
              <strong>{formatPrice(car.pricePerDay)}</strong>
              <span>1 Day Rental</span>
            </>
          )}
        </div>
      </div>
      <div className="ios-car-art">
        <img src={car.heroImage} alt="" loading="lazy" />
        {onToggleFavorite && (
          <button
            type="button"
            className="ios-car-fav pressable"
            aria-label="Favorite"
            onClick={(e) => {
              e.stopPropagation();
              haptic("light");
              onToggleFavorite();
            }}
          >
            <Heart size={16} fill={favorited ? "currentColor" : "none"} />
          </button>
        )}
        <span className="ios-car-arrow" aria-hidden>
          →
        </span>
      </div>
    </motion.button>
  );
}

export function BookingSummaryCard({
  rows,
  title = "Price breakdown",
}: {
  rows: Array<{ label: string; value: string; emphasize?: boolean }>;
  title?: string;
}) {
  return (
    <div className="booking-summary">
      <div className="eyebrow" style={{ marginBottom: 4 }}>
        {title}
      </div>
      <div className="red-rule" />
      {rows.map((row) => (
        <div key={row.label} className={`row ${row.emphasize ? "total" : ""}`}>
          <span className={row.emphasize ? undefined : undefined} style={{ color: row.emphasize ? undefined : "var(--text-secondary)" }}>
            {row.label}
          </span>
          <motion.span key={row.value} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
            {row.value}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

export function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec-item">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const dragControls = useDragControls();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="sheet-backdrop"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onClose();
            }}
          >
            <div
              className="sheet-handle"
              onPointerDown={(e) => dragControls.start(e)}
              style={{ touchAction: "none" }}
            />
            {title && (
              <h3 className="text-display" style={{ fontSize: 18, marginBottom: 16 }}>
                {title}
              </h3>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  // simple mount animation via motion
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onAnimationStart={() => setDisplay(value)}
    >
      {display.toLocaleString("en-EG")}
    </motion.span>
  );
}
