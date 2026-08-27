import type { ReactNode } from "react";
import { MotionTokens } from "../core/motion";
import { motion } from "framer-motion";
import { Capacitor } from "@capacitor/core";

interface IconProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  variant?: "default" | "ghost" | "accent";
}

export function TopIconButton({
  children,
  className = "",
  onClick,
  variant = "default",
  ...rest
}: IconProps) {
  return (
    <button
      className={`icon-btn pressable ${variant} ${className}`}
      type="button"
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

interface CtaProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  solid?: boolean;
  "data-testid"?: string;
}

export function PrimaryCTA({
  children,
  fullWidth,
  className = "",
  onClick,
  disabled,
  solid,
  ...rest
}: CtaProps) {
  return (
    <button
      className={`cta-primary pressable ${solid ? "solid" : ""} ${className}`}
      style={fullWidth ? { width: "100%" } : undefined}
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  fullWidth,
  className = "",
  onClick,
  disabled,
  ...rest
}: CtaProps) {
  return (
    <button
      className={`cta-secondary pressable ${className}`}
      style={fullWidth ? { width: "100%" } : undefined}
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

interface RingProps {
  value: number;
  unit: string;
  label: string;
  sublabel: string;
  progress?: number;
}

export function StatRing({ value, unit, label, sublabel, progress = 0.78 }: RingProps) {
  const size = 150;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div>
      <div className="stat-ring">
        <svg viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: MotionTokens.cinematic, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: "drop-shadow(0 0 8px var(--accent))" }}
          />
        </svg>
        <div className="stat-ring-center">
          <div className="stat-ring-value">{value}</div>
          <div className="stat-ring-unit">{unit}</div>
        </div>
      </div>
      <div className="stat-ring-meta">
        <div className="label">{label}</div>
        <div className="sub">{sublabel}</div>
      </div>
    </div>
  );
}

export function BrandMark({ size = 15 }: { size?: number }) {
  return (
    <div className="brand-wordmark" style={{ fontSize: size }}>
      Re<span className="seven">7</span>lty
    </div>
  );
}

export function StatusBar() {
  if (Capacitor.isNativePlatform()) return null;
  return (
    <div className="status-bar" aria-hidden>
      <span>9:41</span>
      <div className="status-bar-icons">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="3" width="3" height="9" rx="0.5" opacity="0.35" />
          <rect x="4.5" y="2" width="3" height="10" rx="0.5" opacity="0.55" />
          <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" opacity="0.75" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 3.2c1.8 0 3.4.7 4.6 1.9l1.2-1.2A8.1 8.1 0 0 0 8 1 8.1 8.1 0 0 0 2.2 3.9l1.2 1.2A6.5 6.5 0 0 1 8 3.2Z" />
          <path d="M8 6.4c1 0 1.9.4 2.6 1.1l1.2-1.2A5.2 5.2 0 0 0 8 4.8 5.2 5.2 0 0 0 4.2 6.3l1.2 1.2A3.6 3.6 0 0 1 8 6.4Z" />
          <circle cx="8" cy="10.2" r="1.3" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" strokeOpacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="white" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="white" fillOpacity="0.45" />
        </svg>
      </div>
    </div>
  );
}
