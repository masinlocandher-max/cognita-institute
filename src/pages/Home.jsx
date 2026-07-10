import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCheck2,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import BrandLockup from "@/components/BrandLockup";
import CognitaIntroTransition from "@/components/CognitaIntroTransition";
import FounderPreview from "@/components/FounderPreview";
import ProgramPortfolio from "@/components/ProgramPortfolio";
import ProgramIcon from "@/components/ProgramIcon";
import { FLAGSHIP_PROGRAM } from "@/lib/program-portfolio";

const STATS = [
  { value: "4", label: "Professional learning pathways" },
  { value: "10", label: "Weeks in the flagship program" },
  { value: "Human", label: "Review for guided submissions" },
  { value: "Verified", label: "Completion before credentialing" },
];

const STANDARDS = [
  {
    icon: Layers3,
    title: "Structured learning",
    description: "Every pathway has a defined purpose, audience, delivery model, and completion standard.",
  },
  {
    icon: UsersRound,
    title: "Human-guided when promised",
    description: "Facilitator support is clearly separated from self-paced access so learners know what they are purchasing.",
  },
  {
    icon: FileCheck2,
    title: "Evidence before credentials",
    description: "Certificates and verified records depend on reviewed work and published completion requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Honest institutional positioning",
    description: "Cognita is presented as a private professional training institute offering non-degree programs.",
  },
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
    <div className="apple-surface">
      <section className="relative overflow-hidden px-5 pb-20 pt-24 sm:px-6 md:pb-28 md:pt-32">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[58rem] -translate-x-1/2 rounded-full bg-sky-400/[0.07] blur-[130px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div>
            <BrandLockup size="md" className="mb-10 items-start" />
            <p className="apple-eyebrow">Private professional AI training institute</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl md:text-7xl">
              Professional AI learning.
              <span className="block text-sky-300">Designed around proof.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300/75 md:text-xl md:leading-8">
              Cognita combines flexible learning, guided professional programs, evidence-based assessment, and institutional training within one credible education system.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/program"
                className="apple-button-primary gap-2 px-7 py-3.5 text-sm font-semibold"
              >
                Explore Cognita programs
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/apply"
                className="apple-button-secondary gap-2 px-7 py-3.5 text-sm font-medium"
              >
                Apply to the 10-week program
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
              {["Non-degree professional training", "Output-based learning", "Verified completion"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                    <Check size={11} />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="apple-hero-visual" aria-label="Cognita learning system overview">
            <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-400">
              <span>Cognita learning environment</span>
              <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1 text-emerald-200/80">System active</span>
            </div>

            <div className="apple-device-panel left-7 right-7 top-20 p-5 md:left-10 md:right-10 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/70">Flagship pathway</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">{FLAGSHIP_PROGRAM.name}</h2>
                  <p className="mt-2 text-sm text-slate-400">Under {FLAGSHIP_PROGRAM.parent}</p>
                </div>
                <div className="apple-icon-tile flex-shrink-0">
                  <ProgramIcon name="professional-programs" size={26} />
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-sky-400 to-cyan-200" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Foundation</span>
                <span>Specialization</span>
                <span>Capstone</span>
              </div>
            </div>

            <div className="apple-device-panel bottom-8 left-7 w-[58%] p-5 md:left-10">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Credential standard</p>
              <p className="mt-2 text-sm font-medium text-white">Review before issuance</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-200/80">
                <ShieldCheck size={14} />
                Evidence-based completion
              </div>
            </div>

            <div className="apple-device-panel bottom-8 right-7 w-[31%] p-5 text-center md:right-10">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-sky-300">4</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-500">Program pathways</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.065] bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 py-10 sm:px-6 md:grid-cols-4 md:py-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-3 py-4 text-center md:px-6">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500 md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="apple-eyebrow">One institute, four pathways</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white md:text-5xl">
            Choose the level of structure and support you actually need.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            The divisions are intentionally separated so self-paced access, guided training, assessment, and organizational delivery are never confused with one another.
          </p>
        </div>
        <ProgramPortfolio />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-28">
        <div className="apple-card grid gap-10 p-7 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
          <div>
            <p className="apple-eyebrow">Flagship guided offering</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white md:text-5xl">
              {FLAGSHIP_PROGRAM.name}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-300/75">
              {FLAGSHIP_PROGRAM.description}
            </p>
            <Link to="/program#flagship-program" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-sky-300">
              View the complete curriculum
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Weeks 1–4", "AI Foundation", "Core concepts, responsible use, prompting, research, and workflow fundamentals."],
              ["Weeks 5–9", "Specialization", "Track-specific practical work with progressive outputs and facilitator review."],
              ["Week 10", "Capstone", "A final applied project that demonstrates the learner's ability to use AI professionally."],
              ["Completion", "Credential review", "Portfolio evidence and program requirements are checked before a Certificate of Completion is issued."],
            ].map(([period, title, description]) => (
              <div key={title} className="rounded-2xl border border-white/[0.075] bg-white/[0.025] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/70">{period}</p>
                <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.065] bg-white/[0.012]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
          <div className="mb-12 max-w-3xl">
            <p className="apple-eyebrow">The Cognita standard</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white md:text-5xl">
              Credibility comes from clear promises and consistent operations.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {STANDARDS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="apple-card p-6 md:p-8">
                <div className="apple-icon-tile">
                  <Icon size={25} className="text-sky-300" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.025em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FounderPreview />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="apple-card p-8 text-center md:p-16">
          <p className="apple-eyebrow">Cognita Professional Programs</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-white md:text-5xl">
            Ready for guided, standards-based AI training?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Applications to the 10-Week Professional AI Program are reviewed individually before enrollment.
          </p>
          <Link to="/apply" className="apple-button-primary mt-8 gap-2 px-7 py-3.5 text-sm font-semibold">
            Apply to the next cohort
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
