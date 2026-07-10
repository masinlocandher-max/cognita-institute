import React from "react";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <FileText size={20} className="text-cyan-400" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Legal</p>
      </div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Terms of Use</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Acceptance of Terms</h2>
          <p>By applying to, enrolling in, or using any service provided by Cognita Institute of Artificial Intelligence ("Cognita", "we", "our", "us"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the app or apply to the program.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Selective Academy</h2>
          <p>Cognita is a selective AI academy. Submitting an application does not guarantee acceptance. All applications are reviewed individually by our admissions team. Decisions regarding acceptance, waitlisting, or rejection are final and at the sole discretion of Cognita.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Enrollment</h2>
          <p>Enrollment is subject to application review and approval. Only accepted applicants who complete the enrollment process — including batch and track assignment — gain access to the learning dashboard. Enrollment is not automatic upon acceptance.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Certificates Are Not Automatic</h2>
          <p>Certificates at Cognita are never issued automatically. A Certificate of Practical AI Competency is issued only after all of the following conditions are met:</p>
          <ul className="space-y-2 ml-1 mt-3">
            {[
              "All 10 required weekly outputs are submitted",
              "All 10 required weekly outputs are reviewed and passed by a facilitator",
              "The capstone (Week 10) is passed",
              "The portfolio is complete",
              "An admin approves the final certification review",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Student Responsibilities</h2>
          <p className="mb-3">As a student, you are responsible for:</p>
          <ul className="space-y-2 ml-1">
            {[
              "Completing and submitting all required weekly outputs",
              "Engaging with facilitator feedback and making requested revisions",
              "Using AI tools ethically and responsibly",
              "Submitting original work that reflects your own understanding and effort",
              "Not submitting plagiarized, fake, or harmful content",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Revisions and Review</h2>
          <p>Cognita facilitators may request revisions to any submitted output. Students are expected to address feedback and resubmit in a timely manner. Facilitator decisions on pass, revision, or fail are based on demonstrated competence, not effort alone.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Removal From Program</h2>
          <p>Cognita reserves the right to remove students from a batch for any of the following reasons:</p>
          <ul className="space-y-2 ml-1 mt-3">
            {[
              "Inactivity or failure to submit weekly outputs without communication",
              "Dishonest behavior, including submitting plagiarized or fake work",
              "Violation of these Terms of Use",
              "Disruptive or harmful conduct toward facilitators or other students",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Ethical AI Use</h2>
          <p>Students are responsible for the ethical use of AI tools. This includes being transparent about AI assistance, verifying AI-generated content for accuracy, and not using AI to deceive, harm, or mislead. Cognita reserves the right to review and act on violations of ethical AI use.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Program Changes</h2>
          <p>Cognita may update the program structure, curriculum, schedule, requirements, or policies at any time. We will make reasonable efforts to notify enrolled students of significant changes. Continued participation in the program after changes are made constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Contact</h2>
          <p>For any questions about these Terms of Use, please contact:</p>
          <div className="mt-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-sm font-medium">Cognita Institute of Artificial Intelligence</p>
            <p className="text-sm text-cyan-400">support@cognita.ai</p>
          </div>
        </section>
      </div>
    </div>
  );
}