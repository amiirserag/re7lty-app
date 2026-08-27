import { motion } from "framer-motion";

interface Props {
  value: number;
  unit: string;
  label: string;
  sublabel: string;
  progress?: number; // 0-1
  color?: string;
}

export function StatRing({
  value,
  unit,
  label,
  sublabel,
  progress = 0.78,
  color = "var(--perf)",
}: Props) {
  const size = 148;
  const stroke = 3;
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
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
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
