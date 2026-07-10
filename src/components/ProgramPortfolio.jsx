import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import ProgramIcon from "@/components/ProgramIcon";
import { PROGRAM_PORTFOLIO } from "@/lib/program-portfolio";

export default function ProgramPortfolio({ detailed = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
      {PROGRAM_PORTFOLIO.map((program) => (
        <article key={program.id} id={program.id} className="apple-card group p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="apple-icon-tile">
              <ProgramIcon name={program.icon} size={28} className="text-sky-300" />
            </div>
            <span className="apple-status-pill">{program.availability}</span>
          </div>

          <p className="apple-eyebrow mt-7">{program.eyebrow}</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-[-0.035em] text-white">
            {program.name}
          </h3>
          <p className="mt-4 text-sm md:text-base leading-7 text-slate-300/80">
            {detailed ? program.explanation : program.description}
          </p>

          {detailed && (
            <>
              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Best suited for</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{program.audience}</p>
              </div>

              <ul className="mt-6 space-y-3">
                {program.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300/85">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                      <Check size={12} />
                    </span>
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Link
            to={program.actionPath}
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition group-hover:text-sky-200"
          >
            {program.actionLabel}
            <ArrowUpRight size={15} />
          </Link>
        </article>
      ))}
    </div>
  );
}
