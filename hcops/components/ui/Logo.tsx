"use client";
import Image from "next/image";

interface LogoProps {
  size?: number;        // px
  showText?: boolean;
  textColor?: string;
  className?: string;
  layout?: "row" | "col"; // row = icon+text side by side, col = stacked
}

export default function Logo({
  size = 48,
  showText = true,
  className = "",
  layout = "row",
}: LogoProps) {
  return (
    <div
      className={`flex items-center ${
        layout === "col" ? "flex-col gap-2" : "flex-row gap-3"
      } ${className}`}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <Image
          src="/images/hossana-logo.svg"
          alt="Hossana Police Station Logo"
          width={size}
          height={size}
          className="object-contain drop-shadow-md"
          priority
        />
      </div>

      {showText && (
        <div className={layout === "col" ? "text-center" : ""}>
          <p
            className="font-extrabold leading-tight text-white"
            style={{ fontSize: Math.max(size * 0.28, 11) }}
          >
            Hossana City Police
          </p>
          <p
            className="uppercase tracking-widest text-blue-200 leading-tight"
            style={{ fontSize: Math.max(size * 0.17, 8) }}
          >
            Station Management
          </p>
        </div>
      )}
    </div>
  );
}

/* Favicon / tiny icon only */
export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/images/hossana-logo.svg"
      alt="Hossana Police"
      width={size}
      height={size}
      className="object-contain"
      priority
    />
  );
}

