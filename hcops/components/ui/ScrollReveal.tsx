"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "fadeUp" | "fadeDown" | "slideLeft" | "slideRight" | "zoom" | "fade";

const EASE = "easeOut" as const;

const variants: Record<Variant, Variants> = {
  fadeUp:    { hidden: { opacity: 0, y: 36 },     visible: { opacity: 1, y: 0 } },
  fadeDown:  { hidden: { opacity: 0, y: -28 },    visible: { opacity: 1, y: 0 } },
  slideLeft: { hidden: { opacity: 0, x: -40 },    visible: { opacity: 1, x: 0 } },
  slideRight:{ hidden: { opacity: 0, x: 40 },     visible: { opacity: 1, x: 0 } },
  zoom:      { hidden: { opacity: 0, scale: 0.88 },visible: { opacity: 1, scale: 1 } },
  fade:      { hidden: { opacity: 0 },             visible: { opacity: 1 } },
};

interface Props {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
  margin = "-60px",
}: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Stagger parent / child
───────────────────────────────────────────── */
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

export function StaggerParent({
  children,
  className = "",
  margin = "-60px",
}: {
  children: ReactNode;
  className?: string;
  margin?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return <motion.div variants={staggerItem} className={className}>{children}</motion.div>;
}

/* ─────────────────────────────────────────────
   CountUp
───────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) { setValue(to); return; }
    const steps = 40;
    const inc = to / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= to) { clearInterval(id); setValue(to); }
      else setValue(Math.floor(cur));
    }, (duration * 1000) / steps);
    return () => clearInterval(id);
  }, [inView, to, duration, reduced]);

  return <span ref={ref}>{value}</span>;
}
