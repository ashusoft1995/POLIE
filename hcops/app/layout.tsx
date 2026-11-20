import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hossana City Police Station",
  description: "Official Police Station Management System — Hossana City, Hadiya Zone",
  icons: { icon: "/images/hossana-logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        {/* Prevent dark mode flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("hcops-theme")||"light";var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var r=(t==="dark"||(t==="system"&&p))?"dark":"light";if(r==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
