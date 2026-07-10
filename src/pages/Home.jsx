import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import BrandLockup from "@/components/BrandLockup";
import CinematicBackground from "@/components/CinematicBackground";
import CognitaIntroTransition from "@/components/CognitaIntroTransition";
import FounderPreview from "@/components/FounderPreview";

const STATS = [
  { value: "10", label: "Week Program" },
  { value: "2", label: "Active Tracks" },
  { value: "100%", label: "Output-Based" },
  { value: "0", label: "Auto-Certificates" },
];

const FEATURES = [
  "One-on-One AI Coaching",
  "Practical AI Modules",
  "Output-Based Learning",
  "Verified Certificate",
];

const PILLARS = [
  { title: "Selective Admissions", desc: "Every student is screened and accepted based on commitment, goals, and readiness — not just payment." },
  { title: "Structured Curriculum", desc: "10 weeks of progressive learning with weekly required outputs. No skipping. No shortcuts." },
  { title: "Facilitator Review", desc: "Every submission is reviewed by a human facilitator who provides feedback, revisions, and pass decisions." },
  { title: "Verified Certification", desc: "Certificates are issued only after all outputs are completed and passed. Never automatic." },
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(() => {
    return typeof window !== "undefined" && !sessionStorage.getItem("cognita_intro_seen");
  });

  useEffect(() => {
    if (showIntro) {
      sessionStorage.setItem("cognita_intro_seen", "true");
    }
  }, [showIntro]);

  if (showIntro) {
    return <CognitaIntroTransition onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div>
      {/* Hero */}
      <CinematicBackground className="min-h-[92vh] flex items-center justify-center px-5 sm:px-6 pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <BrandLockup size="lg" className="mb-12" />

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-4 text-white">
            LEARN AI
            <br />
            <span className="text-cyan-400">THE RIGHT WAY</span>
          </h1>
          <p className="text-sm md:text-lg text-white/60 max-w-xl mx-auto mb-8">
            Not just theory. Real-world application.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8 max-w-md mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-white/70">
                <Check size={12} className="text-cyan-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <p className="text-sm md:text-base text-white/50 italic mb-8">
            Stop guessing. Start using AI with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link
              to="/apply"
              className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg w-full sm:w-auto justify-center"
            >
              APPLY FOR THE NEXT BATCH
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/program"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium rounded-lg border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/40 transition-all w-full sm:w-auto justify-center"
            >
              VIEW 10-WEEK PROGRAM
            </Link>
          </div>

          <p className="text-xs text-cyan-400/60 font-medium">
            Attendance does not earn certification. Outputs do.
          </p>
        </div>
      </CinematicBackground>

      {/* Stats */}
      <section className="border-y border-border/50 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-cyan-400">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Most AI academies sell certificates. Cognita builds competence.",
            "Attendance does not earn certification. Outputs do.",
            "Your portfolio is your proof.",
            "Every certificate must mean something.",
          ].map((line, i) => (
            <div key={i} className="card-glow flex items-start gap-3 p-5 rounded-xl">
              <div className="w-1 self-stretch bg-cyan-500/40 rounded-full flex-shrink-0" />
              <p className="text-base md:text-lg font-heading font-medium text-foreground/90 leading-relaxed">{line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Cognita Standard */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-16">
          <h2 className="section-title text-2xl md:text-4xl font-heading font-bold mb-4">
            THE COGNITA STANDARD
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Not a course marketplace. A standards-based academy. Every student goes through a structured process — application, acceptance, training, review, and verified certification.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {PILLARS.map((p, i) => (
            <div key={i} className="card-glow p-6 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Check size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-20">
          <h2 className="section-title text-2xl md:text-4xl font-heading font-bold text-center mb-10 md:mb-16">
            THE ACADEMY FLOW
          </h2>
          <div className="max-w-3xl mx-auto space-y-0">
            {[
              "You apply with your background and goals",
              "Admissions team reviews your application",
              "Accepted applicants confirm enrollment",
              "You're assigned to a batch and specialization track",
              "10 weeks of structured learning with weekly outputs",
              "Facilitators review every submission",
              "Build your portfolio with passed outputs",
              "Complete your capstone in Week 10",
              "Admin issues your verified certificate",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 py-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-xs font-mono font-semibold text-cyan-400">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="pt-1">
                  <p className="text-sm md:text-base text-foreground/90">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder preview */}
      <FounderPreview />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-28">
        <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-8 md:p-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
              Ready to earn your place?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              AI skill must be demonstrated, not claimed. If you're serious about building real AI competence, we want to hear from you.
            </p>
            <Link
              to="/apply"
              className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg"
            >
              APPLY FOR THE NEXT BATCH
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}