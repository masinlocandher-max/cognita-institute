import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { CURRICULUM } from "@/lib/curriculum";

const phaseColors = {
  "AI Foundation": "border-cyan-500/20 from-cyan-500/5",
  "Specialization Track": "border-blue-500/20 from-blue-500/5",
  "Final Review": "border-amber-500/20 from-amber-500/5",
};

const phaseBadge = {
  "AI Foundation": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Specialization Track": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Final Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function Program() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-20 pb-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">The Program</p>
          <h1 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight mb-6">
            THE 10-WEEK
            <br />
            <span className="text-cyan-400">LEARNING PATH</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            The Cognita program is divided into three phases: AI Foundation (Weeks 1-4), Specialization Track (Weeks 5-9), and Capstone (Week 10). Every week requires a real output reviewed by a facilitator. Weeks unlock progressively — you can't skip ahead.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-20">
        <div className="space-y-4">
          {CURRICULUM.filter((w, i, arr) => arr.findIndex(x => x.week === w.week) === i).map((w) => (
            <div
              key={w.week}
              className={`card-glow rounded-xl border bg-gradient-to-r to-transparent p-5 md:p-6 ${phaseColors[w.phase]}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center border border-cyan-500/20">
                    <span className="text-sm font-mono font-bold text-cyan-400">{String(w.week).padStart(2, "0")}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${phaseBadge[w.phase]}`}>
                      {w.phase}
                    </span>
                    {w.track && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400">
                        Track-specific
                      </span>
                    )}
                    {w.week > 1 && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Lock size={10} /> Progressive unlock
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-lg font-heading font-semibold mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{w.lessonOverview}</p>
                  <div className="p-3 rounded-lg bg-background/40 border border-border/30">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/70 mb-1">Required Output</p>
                    <p className="text-sm text-foreground/90">{w.requiredOutput}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/50 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-16 text-center">
          <h2 className="text-2xl font-heading font-bold mb-3">Ready for structured AI training?</h2>
          <p className="text-muted-foreground mb-6">Applications are reviewed individually.</p>
          <Link to="/apply" className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg">
            APPLY FOR THE NEXT BATCH <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}