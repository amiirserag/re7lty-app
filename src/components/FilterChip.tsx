import { LayoutGroup, motion } from "framer-motion";
import { haptic } from "../core/motion";
import type { FilterId } from "../data/cars";

export function FilterChip({
  label,
  active,
  onClick,
  layoutGroup = "filters",
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  layoutGroup?: string;
}) {
  return (
    <motion.button
      type="button"
      className={`filter-chip pressable ${active ? "active" : ""}`}
      onClick={() => {
        haptic("selection");
        onClick?.();
      }}
      whileTap={{ scale: 0.96 }}
    >
      {active && (
        <motion.span
          layoutId={`${layoutGroup}-indicator`}
          className="indicator"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {label}
    </motion.button>
  );
}

export function FilterRow({
  filters,
  active,
  onChange,
  getLabel,
}: {
  filters: readonly string[];
  active: string;
  onChange: (f: FilterId) => void;
  getLabel?: (f: string) => string;
}) {
  return (
    <LayoutGroup id="filter-row">
      <div className="chips-row">
        {filters.map((f) => (
          <FilterChip
            key={f}
            label={getLabel ? getLabel(f) : f}
            active={active === f}
            onClick={() => onChange(f as FilterId)}
          />
        ))}
      </div>
    </LayoutGroup>
  );
}
