import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CognitaIntroTransition() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <StarBackground />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.section
            key="intro"
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: "blur(14px)",
              transition: { duration: 1.1, ease: "easeInOut" },
            }}
          >
            <motion.div
              className="text-center px-6"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.h1
                className="relative text-5xl md:text-7xl font-serif tracking-[0.18em] font-semibold"
                initial={{ letterSpacing: "0.35em", opacity: 0 }}
                animate={{ letterSpacing: "0.18em", opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              >
                COGN
                <span className="relative inline-block">
                  I
                  <motion.span
                    className="absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_22px_#38bdf8]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  />
                </span>
                TA
              </motion.h1>

              <motion.div
                className="mx-auto mt-5 h-px max-w-xl bg-cyan-400 shadow-[0_0_18px_#38bdf8]"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
              />

              <motion.p
                className="mt-6 text-lg md:text-2xl tracking-[0.55em] text-white/90"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                INSTITUTE OF AI
              </motion.p>
            </motion.div>
          </motion.section>
        ) : (
          <motion.section
            key="hero"
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-center">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-5xl font-serif tracking-[0.2em] font-semibold">
                  COGNITA
                </h2>
                <div className="mx-auto mt-3 h-px max-w-xs bg-cyan-400 shadow-[0_0_16px_#38bdf8]" />
                <p className="mt-4 text-sm md:text-base tracking-[0.45em] text-white/80">
                  INSTITUTE OF AI
                </p>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-8xl font-black tracking-wide text-cyan-200 drop-shadow-[0_0_24px_rgba(56,189,248,0.9)]"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.9 }}
              >
                LEARN AI
                <br />
                THE RIGHT WAY
              </motion.h1>

              <motion.p
                className="mt-8 text-xl md:text-2xl text-white/90"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Not just theory. Real-world application.
              </motion.p>

              <motion.div
                className="mx-auto mt-10 grid max-w-xl gap-4 text-left text-lg md:text-xl text-white/90"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.8 }}
              >
                <FeatureItem text="One-on-One AI Coaching" />
                <FeatureItem text="Practical AI Modules" />
                <FeatureItem text="Output-Based Learning" />
                <FeatureItem text="Verified Certificate" />
              </motion.div>

              <motion.p
                className="mt-12 text-2xl md:text-3xl italic text-cyan-100"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Stop guessing.
                <br />
                Start using AI with confidence.
              </motion.p>

              <motion.div
                className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.45, duration: 0.8 }}
              >
                <Link to="/apply" className="rounded-2xl border border-cyan-300 px-8 py-4 text-sm font-bold tracking-[0.2em] text-white shadow-[0_0_22px_rgba(56,189,248,0.45)] transition hover:bg-cyan-300 hover:text-[#020817]">
                  APPLY FOR THE NEXT BATCH
                </Link>

                <Link to="/program" className="rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold tracking-[0.2em] text-white/80 transition hover:border-cyan-300 hover:text-cyan-200">
                  VIEW 10-WEEK PROGRAM
                </Link>
              </motion.div>

              <motion.p
                className="mt-8 text-sm uppercase tracking-[0.25em] text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.8 }}
              >
                Attendance does not earn certification. Outputs do.
              </motion.p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-cyan-300/15 bg-white/[0.03] px-5 py-4 backdrop-blur-sm">
      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_#38bdf8]" />
      <span>{text}</span>
    </div>
  );
}

function StarBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.35),transparent_35%),linear-gradient(180deg,#020817_0%,#061425_50%,#020817_100%)]" />

      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(147,197,253,0.95) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ x: [0, -30], y: [0, 20] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.16) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cyan-500/15 to-transparent" />
    </div>
  );
}