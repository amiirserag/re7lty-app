import { useState } from "react";
import { Clock, MoonStar, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { BrandMark, StatusBar, TopIconButton } from "../components/ui";
import { FilterChip } from "../components/FilterChip";
import { CAIRO_CAFES, CAIRO_NIGHTLIFE, type NightlifeVenue } from "../data/nightlife";
import type { StringKey } from "../core/i18n";
import { useAppState } from "../store/AppState";

const SECTIONS: Array<{ id: string; labelKey: StringKey; venues: NightlifeVenue[] }> = [
  { id: "cafes", labelKey: "nightlife.cafes", venues: CAIRO_CAFES },
  { id: "nightlife", labelKey: "nightlife.lounges", venues: CAIRO_NIGHTLIFE },
];

function VenueCard({ venue, index }: { venue: NightlifeVenue; index: number }) {
  const { t } = useAppState();
  return (
    <motion.div
      className="nightlife-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="nightlife-card-top">
        <div className="nightlife-card-name">{venue.name}</div>
        <span className="nightlife-tag">{venue.category}</span>
      </div>
      <div className="nightlife-card-area">{venue.area}</div>
      <div className="nightlife-card-address">{venue.address}</div>
      <div className="nightlife-card-meta">
        <span>
          <Clock size={12} /> {venue.timings}
        </span>
        {venue.phone && (
          <span>
            <Phone size={12} /> {venue.phone}
          </span>
        )}
      </div>
      {(venue.open24h || venue.lateNight) && (
        <div className="nightlife-card-flags">
          {venue.open24h && <span className="pill">{t("nightlife.open24h")}</span>}
          {venue.lateNight && !venue.open24h && (
            <span className="pill">{t("nightlife.lateNight")}</span>
          )}
        </div>
      )}
      <div className="nightlife-card-source">{t("nightlife.source", { source: venue.source })}</div>
    </motion.div>
  );
}

export function NightlifeScreen() {
  const { goBack, t } = useAppState();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const section = SECTIONS.find((s) => s.id === activeSection) ?? SECTIONS[0];

  return (
    <div className="tab-view pack-explore">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />

      <div className="home-topbar">
        <TopIconButton aria-label="Back" onClick={goBack}>
          ←
        </TopIconButton>
        <BrandMark />
        <TopIconButton aria-label="Nightlife" variant="accent">
          <MoonStar size={16} />
        </TopIconButton>
      </div>

      <div style={{ padding: "18px 20px 0" }}>
        <h1 style={{ fontSize: 22 }}>{t("nightlife.title")}</h1>
        <p className="section-sub" style={{ marginTop: 4 }}>
          {t("nightlife.sub")}
        </p>
      </div>

      <div className="chips-row" style={{ padding: "14px 20px 0" }}>
        {SECTIONS.map((s) => (
          <FilterChip
            key={s.id}
            label={t(s.labelKey)}
            active={activeSection === s.id}
            onClick={() => setActiveSection(s.id)}
            layoutGroup="nightlife-sections"
          />
        ))}
      </div>

      <div className="screen-scroll with-tab-bar" style={{ padding: "14px 20px 40px", display: "flex", flexDirection: "column", gap: 12 }}>
        {section.venues.map((venue, i) => (
          <VenueCard key={venue.id} venue={venue} index={i} />
        ))}
      </div>
    </div>
  );
}
