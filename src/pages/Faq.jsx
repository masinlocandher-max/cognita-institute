import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FAQ_DATA } from "@/lib/curriculum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div>
      <section className="max-w-3xl mx-auto px-5 sm:px-6 pt-20 pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">FAQ</p>
        <h1 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight mb-6">
          Frequently asked
          <br />
          <span className="text-muted-foreground">questions.</span>
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-6 pb-20">
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="card-glow rounded-xl px-5">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-muted-foreground mb-6">Have more questions? Apply and we'll be in touch.</p>
          <Link to="/apply" className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg">
            APPLY FOR THE NEXT BATCH <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}