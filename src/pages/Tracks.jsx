import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Palette, Briefcase, Rocket, GraduationCap, Clock } from "lucide-react";

const TRACKS_DATA = [
  {
    icon: Palette,
    name: "AI for Creatives",
    tagline: "Design, content, and creative production with AI",
    who: "Designers, writers, content creators, marketers, artists, and creative professionals.",
    focus: [
      "AI-assisted content creation and ideation",
      "Visual design and image generation workflows",
      "Writing, copywriting, and editorial AI tools",
      "Creative portfolio development",
    ],
    accent: "text-cyan-400",
    badge: "bg-cyan-500/10 border-cyan-500/20",
    comingSoon: false,
  },
  {
    icon: Briefcase,
    name: "AI for Professionals & VAs",
    tagline: "Productivity, operations, and professional workflows",
    who: "Virtual assistants, operations staff, executive assistants, freelancers, and office professionals.",
    focus: [
      "Email, scheduling, and communication automation",
      "Document creation and data processing",
      "Client management and reporting workflows",
      "Professional systems and SOPs with AI",
    ],
    accent: "text-blue-400",
    badge: "bg-blue-500/10 border-blue-500/20",
    comingSoon: false,
  },
  {
    icon: Rocket,
    name: "AI for Entrepreneurs",
    tagline: "Business strategy, marketing, and startup tools",
    who: "Founders, small business owners, solopreneurs, and aspiring entrepreneurs.",
    focus: [
      "Market research and competitive analysis with AI",
      "Business plan and pitch deck generation",
      "Marketing automation and lead generation",
      "Revenue-generating AI workflows",
    ],
    accent: "text-emerald-400",
    badge: "bg-emerald-500/10 border-emerald-500/20",
    comingSoon: true,
  },
  {
    icon: GraduationCap,
    name: "AI for Students",
    tagline: "Academic productivity and research skills",
    who: "College students, graduate students, researchers, and academic professionals.",
    focus: [
      "Research assistance and literature review",
      "Academic writing and citation workflows",
      "Study systems and exam preparation",
      "Thesis and project development with AI",
    ],
    accent: "text-amber-400",
    badge: "bg-amber-500/10 border-amber-500/20",
    comingSoon: true,
  },
];

export default function Tracks() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-20 pb-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Specialization Tracks</p>
          <h1 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight mb-6">
            CHOOSE YOUR
            <br />
            <span className="text-cyan-400">TRACK</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            After completing the 4-week AI Foundation, students enter their specialization track for Weeks 5-9. Each track focuses on applied AI skills relevant to your field. Two tracks are currently active for the pilot batch.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TRACKS_DATA.map((t, i) => (
            <div key={i} className={`card-glow rounded-xl p-6 ${t.comingSoon ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl border ${t.badge} flex items-center justify-center`}>
                  <t.icon size={24} className={t.accent} />
                </div>
                {t.comingSoon && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border border-border/50 bg-background/50 text-muted-foreground">
                    <Clock size={10} /> Coming Soon
                  </span>
                )}
              </div>
              <h3 className="text-xl font-heading font-bold mb-1">{t.name}</h3>
              <p className={`text-sm ${t.accent} mb-4`}>{t.tagline}</p>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Who it's for</p>
                <p className="text-sm text-foreground/80">{t.who}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Focus Areas</p>
                <ul className="space-y-1.5">
                  {t.focus.map((f, j) => (
                    <li key={j} className="text-sm text-foreground/70 flex items-start gap-2">
                      <span className={`${t.accent} mt-1.5 flex-shrink-0`}>·</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-muted-foreground mb-6">Track preference is indicated during application. Final assignment is confirmed upon enrollment.</p>
          <Link to="/apply" className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg">
            APPLY FOR THE NEXT BATCH <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}