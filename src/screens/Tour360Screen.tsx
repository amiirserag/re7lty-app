import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Hotspot } from "../components/Cards";
import { MediaHero } from "../components/MediaHero";
import { PrimaryCTA, StatusBar, TopIconButton } from "../components/ui";
import { haptic } from "../core/motion";
import { useAppState } from "../store/AppState";

export function Tour360Screen() {
  const { selectedCarId, getCar, goBack, t } = useAppState();
  const car = getCar(selectedCarId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [angleIndex, setAngleIndex] = useState(0);

  if (!car) return null;
  const active = car.hotspots.find((h) => h.id === activeId);
  const angle = car.angles[angleIndex % car.angles.length];

  return (
    <div className="screen pack-tour">
      <StatusBar />
      <div className="tour-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={car.tourVideo && angleIndex === 0 ? "tour-film" : angle.id}
            className="tour-media"
            initial={{ opacity: 0.35, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 40) {
                haptic("selection");
                setActiveId(null);
                setAngleIndex((i) =>
                  info.offset.x < 0
                    ? (i + 1) % car.angles.length
                    : (i - 1 + car.angles.length) % car.angles.length,
                );
              }
            }}
          >
            <MediaHero
              image={angle.image || car.tourImage}
              video={angleIndex === 0 ? car.tourVideo || car.heroVideo : undefined}
              alt={`${car.name} ${angle.label}`}
            />
          </motion.div>
        </AnimatePresence>
        <div className="vignette" />
        {car.hotspots.map((h) => (
          <Hotspot
            key={h.id}
            x={h.x}
            y={h.y}
            active={activeId === h.id}
            onClick={() => {
              haptic("light");
              setActiveId((id) => (id === h.id ? null : h.id));
            }}
          />
        ))}
      </div>

      <div className="tour-top pack">
        <TopIconButton variant="accent" aria-label="Back" onClick={goBack}>
          <ArrowLeft size={16} />
        </TopIconButton>
        <div className="center">
          <div className="label">{t("home.tourCar")}</div>
          <h1>{car.name}</h1>
          <div className="sub">{car.badge ?? t("common.limitedEdition")}</div>
          <div className="red-rule center" />
        </div>
        <div className="hud-col tiny">
          <span>{car.engine.split(" ").pop()}</span>
          <span>{car.engine}</span>
          <span>{car.horsepower} HP</span>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="hotspot-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 60) setActiveId(null);
            }}
          >
            <h4>{active.title}</h4>
            <div className="sub">{active.subtitle}</div>
            <p>{active.body}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tour-cta pack">
        <PrimaryCTA
          fullWidth
          onClick={() => {
            haptic("selection");
            setAngleIndex((i) => (i + 1) % car.angles.length);
            setActiveId(null);
          }}
        >
          {t("tour.rotate")}
        </PrimaryCTA>
        <div className="pager">
          {car.angles.map((a, i) => (
            <button
              key={a.id}
              type="button"
              className={i === angleIndex % car.angles.length ? "on" : ""}
              onClick={() => setAngleIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
