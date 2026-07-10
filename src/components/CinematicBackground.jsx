import React from "react";

export default function CinematicBackground({ children, className = "", grid = true }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02050e] via-[#050a1a] to-[#081226]" />
      
      {/* Starfield */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 15%, rgba(0,174,255,0.4), transparent),
            radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.25), transparent),
            radial-gradient(1px 1px at 40% 25%, rgba(0,174,255,0.3), transparent),
            radial-gradient(1px 1px at 55% 65%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 70% 20%, rgba(0,174,255,0.35), transparent),
            radial-gradient(1px 1px at 85% 50%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 15% 75%, rgba(0,174,255,0.25), transparent),
            radial-gradient(1px 1px at 45% 85%, rgba(255,255,255,0.15), transparent),
            radial-gradient(1px 1px at 65% 35%, rgba(0,174,255,0.3), transparent),
            radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.2), transparent),
            radial-gradient(2px 2px at 30% 60%, rgba(0,174,255,0.15), transparent),
            radial-gradient(1px 1px at 75% 90%, rgba(255,255,255,0.15), transparent),
            radial-gradient(1px 1px at 5% 50%, rgba(0,174,255,0.2), transparent),
            radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.2), transparent)
          `,
        }}
      />

      {/* Central glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid floor */}
      {grid && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,174,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,174,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: "perspective(400px) rotateX(60deg)",
            transformOrigin: "center bottom",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 80%)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}