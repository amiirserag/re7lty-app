import { LayoutGroup, motion } from "framer-motion";
import { CalendarDays, Compass, Heart, House, UserRound } from "lucide-react";
import { haptic } from "../core/motion";
import type { StringKey } from "../core/i18n";
import { useAppState, type TabId } from "../store/AppState";

const ITEMS: Array<{ id: TabId; labelKey: StringKey; Icon: typeof House }> = [
  { id: "home", labelKey: "nav.home", Icon: House },
  { id: "explore", labelKey: "nav.explore", Icon: Compass },
  { id: "bookings", labelKey: "nav.bookings", Icon: CalendarDays },
  { id: "favorites", labelKey: "nav.favorites", Icon: Heart },
  { id: "profile", labelKey: "nav.profile", Icon: UserRound },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  const { t } = useAppState();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <LayoutGroup id="tab-indicator">
        {ITEMS.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav-item pressable ${active === id ? "active" : ""}`}
            onClick={() => {
              haptic("selection");
              onChange(id);
            }}
          >
            {active === id && (
              <motion.span
                layoutId="active-tab"
                className="tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon size={18} strokeWidth={active === id ? 2.2 : 1.6} />
            <span>{t(labelKey)}</span>
          </button>
        ))}
      </LayoutGroup>
    </nav>
  );
}
