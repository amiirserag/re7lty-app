import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  x: number;
  y: number;
  active?: boolean;
  onClick?: () => void;
}

export function Hotspot({ x, y, active, onClick }: Props) {
  return (
    <motion.button
      className={`hotspot ${active ? "active" : ""}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.9 }}
      aria-label="Hotspot detail"
    >
      {!active && <span className="hotspot-pulse" />}
      <Plus size={16} strokeWidth={1.75} />
    </motion.button>
  );
}
