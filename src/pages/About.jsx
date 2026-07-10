import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Zap } from "lucide-react";
import FounderProfile from "@/components/FounderProfile";

export default function About() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-20 pb-12 md:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">About Cognita</p>
          <h1 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight mb-6">
            THE COGNITA
            <br />
            <span className="text-cyan-400">STANDARD</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Cognita Institute of Artificial Intelligence was founded on a simple belief: the AI education space is flooded with certificate mills and passive video courses. We chose a different path — one where every student is accepted through application, trained through structured outputs, and certified only when real competence is demonstrated.
          </p>
        </div>
      </section>

      <section className="border-t border-border/50 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", text: "To produce AI-competent professionals who can demonstrate real capability, not just certificate ownership. We measure success by what our students can do, not what they've watched." },
              { icon: Eye, title: "Our Vision", text: "A world where AI literacy is proven through verified outputs and real-world application — where employers and clients trust AI credentials because they represent genuine skill." },
              { icon: Zap, title: "Our Method", text: "Selective admissions. Structured 10-week programs. Weekly output requirements. Human facilitator review. Portfolio building. Capstone defense. Manual certification." },
            ].map((item, i) => (
              <div key={i} className="card-glow p-6 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-2xl md:text-3xl font-heading font-bold mb-8">What Cognita is not</h2>
          <div className="space-y-4">
            {[
              "We are not a course marketplace. You cannot browse and buy.",
              "We are not a certificate factory. Completion is not automatic.",
              "We are not a passive video platform. Every week requires real output.",
              "We are not open enrollment. Admission is selective.",
              "We are not self-paced. You progress with your batch, on schedule.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <span className="text-destructive text-sm font-mono mt-0.5">✕</span>
                <p className="text-sm text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Founder Profile */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-20">
        <FounderProfile />
      </section>

      <section className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            If this resonates with you, we'd love to review your application.
          </p>
          <Link to="/apply" className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg">
            APPLY FOR THE NEXT BATCH <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}