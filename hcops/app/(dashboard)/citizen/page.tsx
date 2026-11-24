"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertCircle, Car, UserX, Award, Search,
  ArrowRight, Phone, Shield, FileText, Clock,
} from "lucide-react";
import { StaggerParent, StaggerChild } from "@/components/ui/ScrollReveal";

const services = [
  {
    title:       "Report a Crime",
    description: "Report theft, assault, fraud, domestic violence or any criminal activity.",
    icon:        AlertCircle,
    href:        "/citizen/report",
    badge:       "badge-red",
    badgeText:   "Available",
    iconBg:      "bg-red-50 text-red-600",
  },
  {
    title:       "Traffic Incident",
    description: "Report traffic accidents, violations, drunk driving or road hazards.",
    icon:        Car,
    href:        "/citizen/traffic",
    badge:       "badge-blue",
    badgeText:   "Available",
    iconBg:      "bg-blue-50 text-blue-600",
  },
  {
    title:       "Missing Person",
    description: "Report a missing person or provide information about a missing case.",
    icon:        UserX,
    href:        "/citizen/missing",
    badge:       "badge-yellow",
    badgeText:   "Available",
    iconBg:      "bg-orange-50 text-orange-600",
  },
  {
    title:       "Nominate an Officer",
    description: "Recognise exceptional police officers for outstanding community service.",
    icon:        Award,
    href:        "/citizen/nomination",
    badge:       "badge-green",
    badgeText:   "Available",
    iconBg:      "bg-green-50 text-green-600",
  },
  {
    title:       "Track Your Report",
    description: "Check the current status of a previously submitted report using your reference number.",
    icon:        Search,
    href:        "/citizen/track",
    badge:       "badge-blue",
    badgeText:   "Available",
    iconBg:      "bg-purple-50 text-purple-600",
  },
];

const steps = [
  { icon: FileText, title: "Submit",   desc: "Fill in the report form with accurate details." },
  { icon: Clock,    title: "Review",   desc: "Officers review and register your report."       },
  { icon: Shield,   title: "Assigned", desc: "Case is assigned to the appropriate officer."    },
  { icon: Search,   title: "Track",    desc: "Track progress using your reference number."     },
];

export default function CitizenDashboard() {
  return (
    <div className="space-y-6 pb-8">

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] p-6 text-white shadow-xl"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium mb-1">Hossana City Police Station</p>
          <h2 className="text-2xl font-extrabold leading-tight">Citizen Services</h2>
          <p className="text-blue-100 text-sm mt-2 max-w-md">
            Report incidents, track your cases, and connect with Hossana Police — safely and securely.
          </p>
          {/* Emergency */}
          <div className="flex items-center gap-2 mt-4 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 w-fit">
            <Phone size={16} className="shrink-0" />
            <span className="text-sm font-bold">Emergency Hotline:</span>
            <span className="text-xl font-extrabold tracking-widest">911</span>
          </div>
        </div>
      </motion.div>

      {/* Service cards */}
      <div>
        <h3 className="text-sm font-bold text-[var(--navy)] mb-3 uppercase tracking-wide">Available Services</h3>
        <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <StaggerChild key={s.href}>
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 16px 32px -8px rgba(0,0,0,0.15)" }}
                className="card p-5 flex flex-col h-full"
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.iconBg}`}>
                    <s.icon size={22} />
                  </div>
                  <span className={`badge ${s.badge} text-[11px]`}>{s.badgeText}</span>
                </div>

                {/* Text */}
                <h4 className="text-sm font-bold text-[var(--navy)] mb-1.5">{s.title}</h4>
                <p className="text-xs text-[var(--slate)] leading-relaxed flex-1">{s.description}</p>

                {/* CTA */}
                <Link
                  href={s.href}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-[var(--green)] text-[var(--green)] text-sm font-semibold hover:bg-[var(--green)] hover:text-white transition-all"
                >
                  Access Service <ArrowRight size={15} />
                </Link>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>

      {/* How it works */}
      <div>
        <h3 className="text-sm font-bold text-[var(--navy)] mb-3 uppercase tracking-wide">How It Works</h3>
        <div className="card p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--green-light)] flex items-center justify-center">
                    <step.icon size={20} className="text-[var(--green)]" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--green)] text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm font-bold text-[var(--navy)] mb-1">{step.title}</p>
                <p className="text-xs text-[var(--slate)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="card p-4 border-l-4 border-[var(--green)] bg-[var(--green-light)]/30">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-[var(--green)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[var(--navy)]">Your Privacy is Protected</p>
            <p className="text-xs text-[var(--slate)] mt-0.5 leading-relaxed">
              You may submit reports anonymously. Personal details are only shared with authorised officers.
              Investigation details, evidence, and officer information are never shown in public tracking.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
