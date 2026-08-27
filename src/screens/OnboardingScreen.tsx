import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MediaHero } from "../components/MediaHero";
import { BrandMark, PrimaryCTA, StatusBar } from "../components/ui";
import { BRAND_MEDIA } from "../data/cars";
import type { StringKey } from "../core/i18n";
import { useAppState } from "../store/AppState";

const SLIDES: Array<{
  kickerKey: StringKey;
  titleKey: StringKey;
  bodyKey: StringKey;
  image: string;
  video?: string;
  left: string[];
  right: string[];
}> = [
  {
    kickerKey: "onboarding.kicker1",
    titleKey: "onboarding.title1",
    bodyKey: "onboarding.body1",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80",
    video: BRAND_MEDIA.onboard[0],
    left: ["V12", "6.5L", "825 HP"],
    right: ["RWD", "0-100", "2.6 s"],
  },
  {
    kickerKey: "onboarding.kicker2",
    titleKey: "onboarding.title2",
    bodyKey: "onboarding.body2",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    video: BRAND_MEDIA.onboard[1],
    left: ["SUV", "VAN", "LUXURY"],
    right: ["SPORTS", "EV", "7 SEATS"],
  },
  {
    kickerKey: "onboarding.kicker3",
    titleKey: "onboarding.title3",
    bodyKey: "onboarding.body3",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80",
    video: BRAND_MEDIA.onboard[2],
    left: ["G-CLASS", "PATROL", "LC 300"],
    right: ["V-CLASS", "MACAN", "S 500"],
  },
];

export function OnboardingScreen() {
  const { completeOnboarding, t } = useAppState();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <div className="screen pack-onboard">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />

      <div className="pack-onboard-top">
        <BrandMark size={14} />
        <div className="pack-onboard-headline">
          <div className="kicker">{t(slide.kickerKey)}</div>
          <h1>{t(slide.titleKey)}</h1>
          <div className="red-rule center" />
          <p>{t(slide.bodyKey)}</p>
        </div>
      </div>

      <div className="pack-onboard-stage">
        <div className="hud-col left">
          {slide.left.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="hud-col right">
          {slide.right.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.video || slide.image}
            className="onboard-media"
            initial={{ opacity: 0, scale: 1.08, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <MediaHero image={slide.image} video={slide.video} alt="" />
          </motion.div>
        </AnimatePresence>
        <div className="vignette" />
      </div>

      <div className="pack-onboard-footer">
        <div className="onboarding-dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={i === index ? "active" : ""} />
          ))}
        </div>
        <PrimaryCTA
          fullWidth
          onClick={() => {
            if (last) completeOnboarding();
            else setIndex((i) => i + 1);
          }}
        >
          {last ? t("onboarding.getStarted") : t("onboarding.continue")}
        </PrimaryCTA>
      </div>
    </div>
  );
}
