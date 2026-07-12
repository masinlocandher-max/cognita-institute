import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const FOUNDER_IMAGE = "https://media.base44.com/images/public/6a4eddeaf17a430019587b35/3653ed958_IMG_7778.jpg";

const CORE_TEAM = [
  {
    icon: BookOpenCheck,
    role: "Academic Affairs",
    initials: "AA",
    responsibility: "Curriculum, lesson standards, and academic coordination.",
  },
  {
    icon: ClipboardList,
    role: "Admissions and Registrar",
    initials: "AR",
    responsibility: "Applicant intake, learner records, and enrollment coordination.",
  },
  {
    icon: Headphones,
    role: "Learner Support",
    initials: "LS",
    responsibility: "Onboarding, account assistance, and learner concerns.",
  },
  {
    icon: ShieldCheck,
    role: "Quality Assurance",
    initials: "QA",
    responsibility: "Assessment controls, portfolio review, and standards protection.",
  },
];

export default function FounderPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-20">
      <div className="mb-10 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Leadership and core operations</p>
        <h2 className="section-title text-2xl font-bold md:text-4xl">
          THE FOUNDER IS NOT BUILDING COGNITA ALONE
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
          Cognita is being structured around four essential operating functions. Individual names and official portraits will be published only after appointment, consent, and role verification.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-glow overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-1 xl:grid-cols-5">
            <div className="relative md:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="aspect-[4/5] overflow-hidden border-b border-cyan-500/10 md:h-full md:border-b-0 md:border-r lg:aspect-[16/10] lg:border-b lg:border-r-0 xl:aspect-auto xl:h-full xl:border-b-0 xl:border-r">
                <img
                  src={FOUNDER_IMAGE}
                  alt="Francine Marie Bautista"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 md:col-span-3 md:p-8 lg:col-span-1 xl:col-span-3">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-400">Founder · Institutional Lead</p>
              <h3 className="mb-3 text-xl font-bold md:text-2xl">Francine Marie Bautista</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Cognita was founded by Francine Marie Bautista, a creative director, strategist, trainer, and AI learning designer who believes AI education should produce real skill, not empty certificates.
              </p>
              <Link
                to="/about"
                className="btn-glow inline-flex items-center gap-2 self-start rounded-lg px-6 py-3 text-sm font-semibold"
              >
                Learn More About Cognita
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CORE_TEAM.map(({ icon: Icon, role, initials, responsibility }) => (
            <article key={role} className="apple-card flex min-h-[15rem] flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/[0.07] text-lg font-semibold tracking-[-0.03em] text-sky-200">
                  {initials}
                </div>
                <Icon size={22} className="text-sky-300/75" />
              </div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/65">Core operating team</p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-white">{role}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{responsibility}</p>
              <p className="mt-auto pt-5 text-[11px] leading-5 text-slate-500">Official employee name and portrait pending verification.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}