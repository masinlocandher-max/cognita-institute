import React from "react";

const SIZES = {
  sm: {
    title: "text-lg",
    subtitle: "text-[7px]",
    dot: "w-1.5 h-1.5 -top-1.5",
    line: "w-14",
    gap: "mb-1",
  },
  md: {
    title: "text-2xl md:text-3xl",
    subtitle: "text-[9px] md:text-[10px]",
    dot: "w-2 h-2 -top-2",
    line: "w-24 md:w-28",
    gap: "mb-1.5",
  },
  lg: {
    title: "text-4xl md:text-6xl lg:text-7xl",
    subtitle: "text-xs md:text-sm",
    dot: "w-3 h-3 -top-3 md:w-3.5 md:h-3.5 md:-top-4",
    line: "w-36 md:w-56",
    gap: "mb-2 md:mb-3",
  },
};

export default function BrandLockup({ size = "md", className = "" }) {
  const s = SIZES[size] || SIZES.md;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`cognita-wordmark relative ${s.title} text-white leading-none drop-shadow-[0_0_16px_rgba(56,189,248,0.12)]`}
        aria-label="Cognita Institute of AI"
      >
        COGN
        <span className="relative inline-block">
          <span
            className={`absolute left-1/2 -translate-x-1/2 ${s.dot} rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.95)]`}
            aria-hidden="true"
          />
          I
        </span>
        TA
      </div>

      <div
        className={`${s.gap} h-px ${s.line} bg-gradient-to-r from-transparent via-sky-400/80 to-transparent shadow-[0_0_10px_rgba(56,189,248,0.45)]`}
        aria-hidden="true"
      />

      <p className={`cognita-submark ${s.subtitle} text-white/72`}>
        Institute of AI
      </p>
    </div>
  );
}
