import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FOUNDER_IMAGE = "https://media.base44.com/images/public/6a4eddeaf17a430019587b35/3653ed958_IMG_7778.jpg";

export default function FounderPreview() {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Leadership</p>
        <h2 className="section-title text-2xl md:text-4xl font-heading font-bold">
          MEET THE FOUNDER
        </h2>
      </div>

      <div className="card-glow rounded-2xl overflow-hidden max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 relative">
            <div className="aspect-[4/5] md:aspect-auto md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-cyan-500/10">
              <img
                src={FOUNDER_IMAGE}
                alt="Francine Marie Bautista"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-2">Founder · Pioneer Trainer</p>
            <h3 className="text-xl md:text-2xl font-heading font-bold mb-3">Francine Marie Bautista</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Cognita was founded by Francine Marie Bautista, a creative director, strategist, trainer, and AI learning designer who believes that AI education should produce real skill, not empty certificates.
            </p>
            <Link
              to="/about"
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg self-start"
            >
              Learn More About Cognita
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}