import { motion } from "framer-motion";
import { useEffect } from "react";
import { MediaHero } from "../components/MediaHero";
import { StatusBar } from "../components/ui";
import { MotionTokens } from "../core/motion";
import { BRAND_MEDIA } from "../data/cars";
import { useAppState } from "../store/AppState";

export function SplashScreen() {
  const { completeSplash, t } = useAppState();
  const hasFilm = Boolean(BRAND_MEDIA.intro);

  useEffect(() => {
    const t = window.setTimeout(completeSplash, hasFilm ? 2400 : 1650);
    return () => window.clearTimeout(t);
  }, [completeSplash, hasFilm]);

  return (
    <div className="screen splash pack-splash">
      <MediaHero
        className="splash-media"
        video={BRAND_MEDIA.intro}
        image={BRAND_MEDIA.poster}
        alt=""
      />
      <div className="grid-bg" />
      <div className="red-flare" />
      <div className="splash-floor" />
      <StatusBar />

      <div className="hud-col splash-hud-left">
        <span>V12</span>
        <span>6.5 L</span>
        <span>825 HP</span>
      </div>
      <div className="hud-col splash-hud-right">
        <span>RWD</span>
        <span>0 - 100</span>
        <span>2.6 s</span>
      </div>

      <motion.div
        className="splash-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: MotionTokens.cinematic, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="r7-mark pack">
          <span className="r">R</span>
          <span className="seven">7</span>
        </div>
        <div className="splash-brand tracked recording-wordmark">
          re<span className="seven">7</span>lty
        </div>
        <div className="splash-progress under-logo">
          <motion.span
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>

      <div className="splash-tag bottom">{t("splash.tag")}</div>
    </div>
  );
}
