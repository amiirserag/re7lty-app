import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "default" | "ghost";
  size?: "md" | "sm";
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

export function TopIconButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
  ...rest
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      className={`icon-btn pressable ${variant} ${size} ${className}`}
      type="button"
      onClick={onClick}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
