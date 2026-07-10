import React from "react";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Shield size={20} className="text-cyan-400" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Legal</p>
      </div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Overview</h2>
          <p>Cognita Institute of Artificial Intelligence ("Cognita", "we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Information We Collect</h2>
          <p className="mb-3">When you apply, enroll, or participate in a Cognita program, we may collect the following:</p>
          <ul className="space-y-2 ml-1">
            {[
              "Full name",
              "Email address",
              "Phone number",
              "Location",
              "Application details (preferred track, occupation, skill levels, goals)",
              "Learning progress and current week",
              "Submitted weekly outputs and responses",
              "Uploaded files or links",
              "Payment proof, if applicable",
              "Certificate information (name, track, batch, serial number, issued date)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">How We Use Your Data</h2>
          <p className="mb-3">Your information is used exclusively for operating the academy and supporting your learning journey:</p>
          <ul className="space-y-2 ml-1">
            {[
              "Application review and admissions decisions",
              "Student enrollment and batch assignment",
              "Learning dashboard access and curriculum delivery",
              "Progress tracking and weekly output monitoring",
              "Facilitator feedback and review",
              "Certificate verification and public lookup",
              "Support and communication",
              "Academy administration and quality assurance",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Data We Do Not Sell</h2>
          <p>Cognita does not sell, rent, or trade your personal data to third parties. Your information is used solely for the purposes described in this policy. We do not use your data for advertising or monetization.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Data Security</h2>
          <p>We take reasonable measures to protect your personal information from unauthorized access, alteration, or disclosure. Access to your data is limited to authorized academy staff and facilitators directly involved in your program.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Public Certificate Data</h2>
          <p>When a certificate is issued, limited verification information (student name, track, batch, issued date, and serial number) may be displayed publicly through our certificate verification page. This information is visible to anyone who searches for it, as it is intended for employer and institutional verification.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data. You may also ask questions about how your data is used. To exercise any of these rights, please contact us at the email below.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Contact Us</h2>
          <p>If you have any questions or concerns about your data or this Privacy Policy, please contact:</p>
          <div className="mt-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-sm font-medium">Cognita Institute of Artificial Intelligence</p>
            <p className="text-sm text-cyan-400">support@cognita.ai</p>
          </div>
        </section>
      </div>
    </div>
  );
}