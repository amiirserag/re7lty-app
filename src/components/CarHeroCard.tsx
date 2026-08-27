import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Car } from "../data/cars";
import { formatPrice } from "../data/cars";

interface Props {
  car: Car;
  favorited?: boolean;
  onOpen?: () => void;
  onToggleFavorite?: () => void;
}

export function CarHeroCard({ car, favorited, onOpen, onToggleFavorite }: Props) {
  return (
    <motion.article
      className="car-hero-card pressable"
      whileTap={{ scale: 0.985 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen?.();
      }}
    >
      <img src={car.heroImage} alt={`${car.brand} ${car.name}`} loading="lazy" />
      <div className="overlay">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              {car.brand} · {car.category}
            </div>
            <div className="name">{car.name}</div>
          </div>
          <button
            type="button"
            className="icon-btn sm"
            style={{ width: 32, height: 32 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            aria-label="Toggle favorite"
          >
            <Heart
              size={14}
              fill={favorited ? "var(--accent)" : "none"}
              color={favorited ? "var(--accent)" : "white"}
            />
          </button>
        </div>
        <div className="meta">
          <span>{car.city}</span>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>
            {formatPrice(car.pricePerDay)}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/day</span>
          </span>
        </div>
      </div>
    </motion.article>
  );
}
