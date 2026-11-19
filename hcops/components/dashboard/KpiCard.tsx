"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: LucideIcon;
  color?: "green" | "yellow" | "pink" | "blue";
  delay?: number;
}

const colorMap = {
  green:  { bg: "bg-green-100 dark:bg-green-900/30",  icon: "text-[var(--green)]",   ring: "ring-green-200 dark:ring-green-800" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: "text-[var(--yellow-dark)]", ring: "ring-yellow-200 dark:ring-yellow-800" },
  pink:   { bg: "bg-pink-100 dark:bg-pink-900/30",    icon: "text-[var(--pink)]",    ring: "ring-pink-200 dark:ring-pink-800" },
  blue:   { bg: "bg-blue-100 dark:bg-blue-900/30",    icon: "text-[var(--info)]",    ring: "ring-blue-200 dark:ring-blue-800" },
};

const trendMap = {
  up:      { icon: TrendingUp,   cls: "text-[var(--green)]" },
  down:    { icon: TrendingDown, cls: "text-red-500" },
  neutral: { icon: Minus,        cls: "text-[var(--slate)]" },
};

export default function KpiCard({
  label, value, trend, trendValue,
  icon: Icon, color = "green", delay = 0,
}: Props) {
  const c = colorMap[color];
  const tr = trendMap[trend];
  const TrendIcon = tr.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: .4, delay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: .2 } }}
      className="card p-5 cursor-default group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[var(--slate)] leading-tight uppercase tracking-wide">{label}</p>
          <p className="text-4xl font-extrabold text-[var(--navy)] mt-2 tabular-nums">{value}</p>
        </div>
        <div className={`p-3.5 rounded-2xl shrink-0 ring-1 ${c.bg} ${c.ring} group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={26} className={c.icon} />
        </div>
      </div>
      <div className={`flex items-center gap-1.5 mt-4 text-sm font-semibold ${tr.cls}`}>
        <TrendIcon size={15} />
        <span>{trendValue}</span>
      </div>
    </motion.div>
  );
}
