import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import { MediaHero } from "../components/MediaHero";
import { BrandMark, SecondaryButton, StatusBar, TopIconButton } from "../components/ui";
import { haptic } from "../core/motion";
import { useAppState } from "../store/AppState";

/**
 * Home — cinematic showcase matching installed iPhone recording
 * (G-CLASS / gauge / MORE DETAIL / TOUR CAR / dash pagination).
 * Uses real featuredCars + local fleet media from AppState.
 */
export function HomeScreen() {
  const {
    featuredCars,
    showcaseIndex,
    nextShowcase,
    prevShowcase,
    setShowcaseIndex,
    openDetail,
    openTour,
    openLocationPicker,
    setActiveTab,
    t,
  } = useAppState();

  const cars = featuredCars.length > 0 ? featuredCars : [];
  const car = cars[showcaseIndex] ?? cars[0];
  if (!car) {
    return (
      <div className="tab-view pack-home recording-home">
        <StatusBar />
        <p className="ios-empty">No fleet available for this city.</p>
      </div>
    );
  }

  const engineFamily =
    (car.engine.match(/\b(V\d+|I\d+|W\d+|Electric|Hybrid)\b/i)?.[1] || car.engine.split(/\s+/)[0] || "").toUpperCase();
  const leftStats = [engineFamily, car.engine, `${car.horsepower} HP`];
  const rightStats = [car.drivetrain, "0-100", car.acceleration];

  return (
    <div className="tab-view pack-home recording-home">
      <div className="pack-car" aria-hidden>
        <MediaHero image={car.heroImage} video={car.heroVideo} alt="" />
      </div>
      <div className="vignette" />
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />

      <div className="home-topbar recording-topbar">
        <TopIconButton aria-label="Menu" onClick={openLocationPicker}>
          <Menu size={16} />
        </TopIconButton>
        <BrandMark />
        <TopIconButton
          aria-label="Search"
          onClick={() => {
            haptic("selection");
            setActiveTab("explore");
          }}
        >
          <Search size={16} />
        </TopIconButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          className="recording-home-body"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="home-title-block">
            <h1>{car.name}</h1>
            <div className="red-rule center" />
            <div className="sub">{(car.badge ?? t("common.limitedEdition")).toUpperCase()}</div>
          </div>

          <div className="pack-ring-row recording-ring-row">
            <div className="hud-col left recording-hud">
              {leftStats.map((row) => (
                <span key={row}>
                  <i className="hud-tick" />
                  {row}
                </span>
              ))}
            </div>

            <div className="home-ring-wrap">
              <div className="stat-ring recording-gauge">
                <svg viewBox="0 0 168 168" aria-hidden>
                  <circle
                    cx="84"
                    cy="84"
                    r="78"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2.5"
                    strokeDasharray={`${2 * Math.PI * 78 * 0.78} ${2 * Math.PI * 78}`}
                    strokeLinecap="round"
                    transform="rotate(-90 84 84)"
                  />
                  <circle
                    cx="84"
                    cy="84"
                    r="78"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2.5"
                    strokeDasharray={`${2 * Math.PI * 78 * Math.min(0.92, car.topSpeed / 320)} ${2 * Math.PI * 78}`}
                    strokeLinecap="round"
                    transform="rotate(-90 84 84)"
                    style={{ filter: "drop-shadow(0 0 8px var(--accent-glow))" }}
                  />
                </svg>
                <div className="stat-ring-center">
                  <div className="stat-ring-value">{car.topSpeed}</div>
                  <div className="stat-ring-unit">KM/H</div>
                </div>
              </div>
            </div>

            <div className="hud-col right recording-hud">
              {rightStats.map((row) => (
                <span key={row}>
                  <i className="hud-tick" />
                  {row}
                </span>
              ))}
            </div>
          </div>

          <div className="recording-meta">
            <div className="label">{t("common.topSpeed").toUpperCase()}</div>
            <div className="sub">{car.performanceLabel}</div>
          </div>

          <div className="pack-more">
            <SecondaryButton onClick={() => openDetail(car.id)}>
              {t("home.moreDetail").toUpperCase()}
            </SecondaryButton>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="pack-home-footer with-tab-pad recording-home-footer">
        <div className="pager recording-pager" role="tablist" aria-label="Fleet">
          {cars.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={i === showcaseIndex ? "on" : ""}
              aria-label={c.name}
              onClick={() => {
                haptic("selection");
                setShowcaseIndex(i);
              }}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="pack-tour-row">
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
          <button
            type="button"
            className="cta-primary pressable recording-tour"
            onClick={() => openTour(car.id)}
          >
            {t("home.tourCar").toUpperCase()}
          </button>
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
      </div>
    </div>
  );
}
