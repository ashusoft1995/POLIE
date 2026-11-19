"use client";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

/* ── Social icon SVGs ─────────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
      <path d="M21.8 2.15L1.4 10.2c-1.3.52-1.29 1.26-.23 1.58l5.17 1.62 2 6.17c.26.74.13 1.03.9 1.03.59 0 .85-.27 1.17-.59l2.84-2.76 5.9 4.35c1.08.6 1.86.29 2.13-.99l3.86-18.19c.4-1.6-.6-2.33-1.34-1.27z" />
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12z" />
    </svg>
  );
}

const socials = [
  { label: "Facebook",  href: "https://facebook.com",  icon: FacebookIcon,  color: "hover:bg-blue-600" },
  { label: "Telegram",  href: "https://t.me",          icon: TelegramIcon,  color: "hover:bg-sky-500"  },
  { label: "X / Twitter", href: "https://x.com",       icon: TwitterXIcon,  color: "hover:bg-slate-700" },
  { label: "YouTube",   href: "https://youtube.com",   icon: YoutubeIcon,   color: "hover:bg-red-600"  },
];

export default function DashboardFooter() {
  return (
    <footer className="w-full bg-[#0F172A] text-white mt-auto">
      {/* ── Green accent top bar ───────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-[var(--green)] via-[var(--yellow)] to-[var(--pink)]" />

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/images/hossana-logo.svg" alt="Hossana Police" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <p className="text-sm font-extrabold leading-tight">Hossana City Police</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Online Station</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Serving Hossana City and Hadiya Zone with professionalism and integrity.
            </p>

            {/* Quick contact */}
            <div className="space-y-2">
              <a href="mailto:hossannapolice@gmail.com"
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-[var(--green)] transition-colors">
                <Mail size={12} className="text-[var(--green)]" />
                hossannapolice@gmail.com
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Phone size={12} className="text-red-400" />
                <span className="font-bold text-red-400">911</span>
                <span className="text-slate-500">Emergency</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin size={12} className="text-yellow-400" />
                Hossana City Centre, Hadiya Zone
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              {["Dashboard", "Cases", "Officers", "Reports", "Settings"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-slate-400 hover:text-[var(--green)] transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--green)] opacity-50" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Citizen Services */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">Citizen Services</h4>
            <ul className="space-y-2">
              {["Report Crime", "Track Report", "Missing Persons", "Anonymous Tips", "Citizen Portal"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-slate-400 hover:text-[var(--yellow)] transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--yellow)] opacity-50" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency & Social */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">Connect</h4>
            
            {/* Social icons */}
            <div className="flex items-center gap-2 mb-4">
              {socials.map(({ label, href, icon: Icon, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-slate-300 ${color} hover:text-white hover:border-transparent transition-all`}>
                  <Icon />
                </a>
              ))}
            </div>

            {/* Emergency card */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">Emergency Hotline</p>
              <p className="text-2xl font-black text-red-400 tracking-widest">911</p>
              <p className="text-[9px] text-slate-500">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="max-w-[1920px] mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-600">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center sm:justify-start">
              <span className="text-slate-500">© 2024 Hossana City Police Station</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <span className="text-slate-600">Hadiya Zone, SNNPR, Ethiopia</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
              <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-0.5">
                Privacy <ExternalLink size={8} />
              </a>
              <span className="text-slate-700">·</span>
              <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-0.5">
                Terms <ExternalLink size={8} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

