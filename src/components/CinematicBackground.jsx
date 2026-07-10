import React from "react";

export default function CinematicBackground({ children, className = "", grid = true }) {
  return (
    <div className={`relative isolate overflow-hidden bg-[#02050e] ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,174,255,0.13),transparent_28%),radial-gradient(circle_at_16%_38%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_84%_46%,rgba(124,58,237,0.08),transparent_28%),linear-gradient(180deg,#02050e_0%,#050a1a_58%,#081226_100%)]" />

      <div
        className="star-layer absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 7% 12%, rgba(255,255,255,0.95), transparent),
            radial-gradient(1.5px 1.5px at 18% 34%, rgba(56,189,248,0.95), transparent),
            radial-gradient(1px 1px at 28% 78%, rgba(255,255,255,0.80), transparent),
            radial-gradient(2px 2px at 39% 22%, rgba(125,211,252,0.85), transparent),
            radial-gradient(1px 1px at 48% 58%, rgba(255,255,255,0.78), transparent),
            radial-gradient(1.5px 1.5px at 60% 14%, rgba(56,189,248,0.95), transparent),
            radial-gradient(1px 1px at 72% 72%, rgba(255,255,255,0.82), transparent),
            radial-gradient(2px 2px at 82% 30%, rgba(125,211,252,0.82), transparent),
            radial-gradient(1px 1px at 91% 66%, rgba(255,255,255,0.88), transparent),
            radial-gradient(1px 1px at 13% 88%, rgba(56,189,248,0.72), transparent),
            radial-gradient(1.5px 1.5px at 53% 89%, rgba(255,255,255,0.72), transparent),
            radial-gradient(1px 1px at 96% 9%, rgba(56,189,248,0.86), transparent)
          `,
          backgroundSize: "260px 260px, 320px 320px, 380px 380px, 440px 440px, 500px 500px, 560px 560px, 620px 620px, 680px 680px, 740px 740px, 800px 800px, 860px 860px, 920px 920px",
          animation: "star-drift 80s linear infinite, star-twinkle 7s ease-in-out infinite",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0 49.6%, rgba(56,189,248,0.07) 50%, transparent 50.4%),
            linear-gradient(transparent 0 49.6%, rgba(56,189,248,0.06) 50%, transparent 50.4%)
          `,
          backgroundSize: "230px 230px",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 78%)",
        }}
      />

      <div className="nebula-layer absolute top-[8%] left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" style={{ animation: "nebula-breathe 12s ease-in-out infinite" }} />
      <div className="nebula-layer absolute -left-36 top-[45%] w-96 h-96 rounded-full bg-blue-700/10 blur-[120px] pointer-events-none" style={{ animation: "nebula-breathe 15s ease-in-out infinite reverse" }} />
      <div className="nebula-layer absolute -right-40 top-[30%] w-[28rem] h-[28rem] rounded-full bg-violet-700/8 blur-[140px] pointer-events-none" style={{ animation: "nebula-breathe 17s ease-in-out infinite" }} />

      <div className="absolute left-1/2 top-[18%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-sky-400/8 pointer-events-none" />
      <div className="absolute left-1/2 top-[22%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full border border-sky-300/6 pointer-events-none" />

      {grid && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[38%] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,174,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,174,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "54px 54px",
            transform: "perspective(420px) rotateX(61deg)",
            transformOrigin: "center bottom",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.78), transparent 82%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.78), transparent 82%)",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
