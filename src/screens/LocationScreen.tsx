import { motion } from "framer-motion";
import { LOCATIONS } from "../data/cars";
import { haptic } from "../core/motion";
import { BrandMark, StatusBar } from "../components/ui";
import { useAppState } from "../store/AppState";

export function LocationScreen() {
  const { selectedLocationId, selectLocation, goBack, screen, t } = useAppState();
  const canBack = screen === "location";

  return (
    <div className="screen">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />
      <div className="screen-scroll">
        <div className="list-screen" style={{ paddingBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BrandMark />
            {canBack && (
              <button
                type="button"
                className="pressable"
                style={{ color: "var(--text-secondary)", fontSize: 12, letterSpacing: "0.12em" }}
                onClick={goBack}
              >
                {t("location.close")}
              </button>
            )}
          </div>
          <h1 style={{ marginTop: 18 }}>{t("location.title")}</h1>
          <div className="red-rule" />
          <p className="list-sub">{t("location.sub")}</p>
          <div className="location-grid">
            {LOCATIONS.map((loc) => {
              const selected = selectedLocationId === loc.id;
              return (
                <motion.button
                  key={loc.id}
                  type="button"
                  className={`location-card pressable ${selected ? "selected" : ""}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    haptic("selection");
                    selectLocation(loc.id);
                  }}
                >
                  <motion.img
                    src={loc.artwork}
                    alt={loc.name}
                    animate={{ scale: selected ? 1.04 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                  <div className="cap">
                    <div style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                      {loc.nameAr}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
