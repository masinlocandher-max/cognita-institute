import React from "react";

const SIZES = {
  sm: { title: "text-lg", subtitle: "text-[7px]", dot: "w-1 h-1 -top-1", line: "w-12", gap: "mb-1" },
  md: { title: "text-2xl md:text-3xl", subtitle: "text-[9px] md:text-[10px]", dot: "w-1.5 h-1.5 -top-1.5", line: "w-20 md:w-24", gap: "mb-1.5" },
  lg: { title: "text-4xl md:text-6xl lg:text-7xl", subtitle: "text-xs md:text-sm", dot: "w-2 h-2 -top-2 md:-top-3", line: "w-28 md:w-44", gap: "mb-2 md:mb-3" },
};

export default function BrandLockup({ size = "md", className = "" }) {
  const s = SIZES[size] || SIZES.md;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${s.title} font-heading font-bold tracking-[0.12em] text-white leading-none`}>
        COGN<span className="relative inline-block">
          <span className={`absolute left-1/2 -translate-x-1/2 ${s.dot} rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,174,255,0.9)]`} />
          I
        </span>TA
      </div>
      <div className={`${s.gap} h-px ${s.line} bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-[0_0_6px_rgba(0,174,255,0.3)]`} />
      <p className={`${s.subtitle} font-medium tracking-[0.45em] text-white/60 uppercase`}>Institute of AI</p>
    </div>
  );
}