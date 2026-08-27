import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { MediaHero } from "../components/MediaHero";
import { BrandMark, PrimaryCTA, SecondaryButton, StatRing, StatusBar, TopIconButton } from "../components/ui";
import { formatPrice } from "../data/cars";
import { haptic } from "../core/motion";
import { useAppState } from "../store/AppState";

export function FeaturedShowcaseScreen() {
  const {
    featuredCars,
    showcaseIndex,
    nextShowcase,
    prevShowcase,
    openDetail,
    openTour,
    openBooking,
    goBack,
    t,
  } = useAppState();
  const car = featuredCars[showcaseIndex] ?? featuredCars[0];

  return (
    <div className="screen">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />
      <div className="home-topbar">
        <TopIconButton aria-label="Back" onClick={goBack}>
          <ArrowLeft size={16} />
        </TopIconButton>
        <BrandMark />
        <TopIconButton aria-label="Details" onClick={() => openDetail(car.id)}>
          <Search size={16} />
        </TopIconButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div className="home-title-block">
            <h1>{car.name}</h1>
            <div className="sub">{car.badge ?? t("common.limitedEdition")}</div>
            <div className="red-rule" style={{ margin: "10px auto" }} />
          </div>

          <div className="home-hud" style={{ position: "relative", top: 0, marginTop: 8 }}>
            <div className="hud-col">
              <span>{car.engine}</span>
              <span>{car.horsepower} HP</span>
              <span>{car.fuel}</span>
            </div>
            <div className="hud-col" style={{ textAlign: "right", alignItems: "flex-end" }}>
              <span>{car.drivetrain}</span>
              <span>0–100</span>
              <span>{car.acceleration}</span>
            </div>
          </div>

          <div className="home-ring-wrap">
            <StatRing
              value={car.topSpeed}
              unit={car.topSpeedUnit}
              label={t("common.topSpeed")}
              sublabel={car.performanceLabel}
              progress={Math.min(0.92, car.topSpeed / 340)}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: 10 }}>
            <SecondaryButton onClick={() => openDetail(car.id)}>
              {t("home.moreDetail")}
            </SecondaryButton>
          </div>

          <motion.div
            className="pack-car"
            style={{ flex: 1, position: "relative", marginTop: 8, minHeight: 180 }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <MediaHero image={car.heroImage} video={car.heroVideo} alt={car.name} />
            <div className="vignette" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: "calc(var(--safe-bottom) + 12px)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <TopIconButton
            aria-label="Previous"
            variant="accent"
            onClick={() => {
              haptic("selection");
              prevShowcase();
            }}
          >
            <ChevronLeft size={18} />
          </TopIconButton>
          <PrimaryCTA onClick={() => openTour(car.id)}>{t("home.tourCar")}</PrimaryCTA>
          <TopIconButton
            aria-label="Next"
            variant="accent"
            onClick={() => {
              haptic("selection");
              nextShowcase();
            }}
          >
            <ChevronRight size={18} />
          </TopIconButton>
        </div>
        <PrimaryCTA fullWidth solid onClick={() => openBooking(car.id)}>
          {t("showcase.book")} · {formatPrice(car.pricePerDay)}
        </PrimaryCTA>
      </div>
    </div>
  );
}
