import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PrimaryCTA({
  children,
  fullWidth,
  className = "",
  onClick,
  disabled,
  type = "button",
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`cta-primary pressable ${className}`}
      style={fullWidth ? { width: "100%" } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({
  children,
  fullWidth,
  className = "",
  onClick,
  disabled,
  type = "button",
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`cta-secondary pressable ${className}`}
      style={fullWidth ? { width: "100%" } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
