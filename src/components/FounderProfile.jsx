import React from "react";
import EmployeeCard from "@/components/EmployeeCard";

const FOUNDER_IMAGE = "https://media.base44.com/images/public/6a4eddeaf17a430019587b35/3653ed958_IMG_7778.jpg";

const HIGHLIGHTS = [
  "Founder of Cognita Institute of Artificial Intelligence",
  "Pioneer Trainer",
  "Creative Director and Brand Strategist",
  "PR and Communications Practitioner",
  "Photography and Visual Storytelling Background",
  "Education and Training Experience",
  "AI Learning Systems Designer",
  "Portfolio-Based Learning Advocate",
];

const FUTURE_ROLES = [
  { name: "Facilitator", role: "Faculty", department: "Academics" },
  { name: "Admissions Coordinator", role: "Admissions", department: "Operations" },
  { name: "Program Manager", role: "Programs", department: "Operations" },
  { name: "Student Success Lead", role: "Student Support", department: "Academics" },
  { name: "Curriculum Reviewer", role: "Curriculum", department: "Academics" },
];

export default function FounderProfile() {
  return (
    <div className="space-y-12 md:space-y-20">
      {/* Section header */}
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Leadership</p>
        <h2 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
          FOUNDER-LED,
          <br />
          <span className="text-cyan-400">STANDARDS-DRIVEN</span>
        </h2>
      </div>

      {/* Founder profile card */}
      <div className="card-glow rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Portrait */}
          <div className="md:col-span-2 relative">
            <div className="aspect-[4/5] md:aspect-auto md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-cyan-500/10">
              <img
                src={FOUNDER_IMAGE}
                alt="Francine Marie Bautista"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02050e] via-transparent to-transparent md:bg-gradient-to-r" />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-3 p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-3">Founder · Pioneer Trainer</p>
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">Francine Marie Bautista</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-1">
              Founder, Cognita Institute of Artificial Intelligence
            </p>
            <p className="text-sm text-muted-foreground mb-4">Pioneer Trainer</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/70 font-medium mb-6">
              Creative Director · Strategist · AI Learning Designer · Trainer
            </p>

            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Francine Marie Bautista is a creative director, strategist, trainer, storyteller, branding consultant, and founder of Cognita Institute of Artificial Intelligence. Her work sits at the intersection of communications, technology, education, culture, identity, and practical skill-building.
              </p>
              <p>
                As Cognita's Founder and Pioneer Trainer, she designed the academy to move beyond passive AI learning. Her approach focuses on practical execution, guided outputs, portfolio proof, and human judgment. Cognita was built for learners who do not simply want to watch lessons, but want to produce real work using AI with clarity, confidence, and responsibility.
              </p>
              <p>
                Francine brings together her background in teaching, training, creative strategy, branding, public relations, storytelling, and digital systems to make AI education more accessible, structured, and useful for real-world work.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Key Highlights</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HIGHLIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 shadow-[0_0_6px_rgba(0,174,255,0.6)]" />
                    <span className="text-xs text-foreground/80">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="mt-8 relative pl-6 border-l-2 border-cyan-500/30">
              <p className="text-base md:text-lg font-heading italic text-foreground/90 leading-relaxed">
                "AI should not make people passive. It should make them sharper, clearer, and more capable."
              </p>
            </div>

            {/* Signature */}
            <p className="mt-6 text-sm font-heading italic text-muted-foreground">
              With love, FMB
            </p>
          </div>
        </div>
      </div>

      {/* Team structure preview */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">The Team</p>
        <h3 className="text-xl md:text-2xl font-heading font-bold mb-2">Growing with intention</h3>
        <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
          Cognita is building a team of facilitators, coordinators, and reviewers who uphold the academy standard. These roles will be filled as the institute grows.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <EmployeeCard
            photo={FOUNDER_IMAGE}
            name="Francine Marie Bautista"
            role="Founder and Pioneer Trainer"
            department="Leadership"
            tags={["Creative Direction", "AI Learning Design", "Training"]}
          />
          {FUTURE_ROLES.map((r, i) => (
            <EmployeeCard
              key={i}
              name={r.name}
              role={r.role}
              department={r.department}
              comingSoon
            />
          ))}
        </div>
      </div>
    </div>
  );
}