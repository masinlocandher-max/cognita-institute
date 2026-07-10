import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ACTIVE_TRACKS } from "@/lib/curriculum";
import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function Apply() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", location: "",
    preferred_track: "", occupation: "",
    ai_skill_level: 5, tech_skill_level: 5, available_hours: 10,
    why_apply: "", production_goals: "",
    understands_no_auto_cert: false, agrees_to_submit_weekly: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.understands_no_auto_cert || !form.agrees_to_submit_weekly) {
      setError("You must confirm both program statements to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      const existing = await base44.entities.Application.filter({ email: form.email });
      if (existing.length > 0) {
        const existingApplication = existing[0];
        if (existingApplication.status === "Enrolled") {
          setError("You are already enrolled. Please sign in to access your student portal.");
        } else if (existingApplication.status === "Accepted") {
          setError("Your application has already been accepted. Please check your email for enrollment instructions.");
        } else if (existingApplication.status === "Rejected") {
          setError("A previous application with this email was not accepted. Please contact the Admissions Office for clarification.");
        } else {
          setError("You already have an application under review. The Admissions Office will contact you when a decision is available.");
        }
        return;
      }

      await base44.entities.Application.create({
        ...form,
        status: "Pending Review",
      });
      setSubmitted(true);
    } catch {
      setError("The application could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="apple-surface flex min-h-[76vh] items-center justify-center px-5 py-24 sm:px-6">
        <div className="apple-card max-w-lg p-8 text-center md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/[0.07]">
            <CheckCircle size={30} className="text-sky-300" />
          </div>
          <p className="apple-eyebrow mt-7">Cognita Professional Programs</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Application submitted</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Your application to the 10-Week Professional AI Program has been received. The Admissions Office reviews applications before enrollment and will send the decision by email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-surface min-h-screen px-5 pb-24 pt-24 sm:px-6 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 max-w-2xl">
          <p className="apple-eyebrow">Cognita Professional Programs</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Apply to the 10-Week Professional AI Program
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            This is Cognita's guided cohort pathway. Applications are reviewed before enrollment because the program requires weekly output submission, facilitator feedback, and active participation.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-sky-300/12 bg-sky-300/[0.04] p-5">
          <ShieldCheck size={19} className="mt-0.5 flex-shrink-0 text-sky-300" />
          <p className="text-sm leading-6 text-slate-300/80">
            Applying does not guarantee acceptance. Cognita evaluates readiness, availability, goals, and the applicant's ability to complete the program requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="apple-card space-y-7 p-6 md:p-9">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label className="mb-2 text-xs text-slate-400">Full legal name *</Label>
              <Input required value={form.full_name} onChange={(event) => handleChange("full_name", event.target.value)} className="border-white/10 bg-white/[0.035]" />
            </div>
            <div>
              <Label className="mb-2 text-xs text-slate-400">Email address *</Label>
              <Input required type="email" value={form.email} onChange={(event) => handleChange("email", event.target.value)} className="border-white/10 bg-white/[0.035]" />
            </div>
            <div>
              <Label className="mb-2 text-xs text-slate-400">Phone number *</Label>
              <Input required value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} className="border-white/10 bg-white/[0.035]" />
            </div>
            <div>
              <Label className="mb-2 text-xs text-slate-400">Location *</Label>
              <Input required value={form.location} onChange={(event) => handleChange("location", event.target.value)} className="border-white/10 bg-white/[0.035]" />
            </div>
          </div>

          <div>
            <Label className="mb-2 text-xs text-slate-400">Preferred specialization track *</Label>
            <Select value={form.preferred_track} onValueChange={(value) => handleChange("preferred_track", value)}>
              <SelectTrigger className="border-white/10 bg-white/[0.035]">
                <SelectValue placeholder="Select a track" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_TRACKS.map((track) => <SelectItem key={track} value={track}>{track}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 text-xs text-slate-400">Current occupation or student status *</Label>
            <Input
              required
              value={form.occupation}
              onChange={(event) => handleChange("occupation", event.target.value)}
              placeholder="Example: Graphic designer, virtual assistant, college student"
              className="border-white/10 bg-white/[0.035]"
            />
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <div>
              <Label className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>Current AI skill level</span>
                <span className="font-mono text-sky-300">{form.ai_skill_level}/10</span>
              </Label>
              <Slider value={[form.ai_skill_level]} onValueChange={(value) => handleChange("ai_skill_level", value[0])} min={1} max={10} step={1} />
            </div>
            <div>
              <Label className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>Current technology skill level</span>
                <span className="font-mono text-sky-300">{form.tech_skill_level}/10</span>
              </Label>
              <Slider value={[form.tech_skill_level]} onValueChange={(value) => handleChange("tech_skill_level", value[0])} min={1} max={10} step={1} />
            </div>
          </div>

          <div>
            <Label className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Available study time each week</span>
              <span className="font-mono text-sky-300">{form.available_hours} hours</span>
            </Label>
            <Slider value={[form.available_hours]} onValueChange={(value) => handleChange("available_hours", value[0])} min={1} max={40} step={1} />
          </div>

          <div>
            <Label className="mb-2 text-xs text-slate-400">Why are you applying to this program? *</Label>
            <Textarea
              required
              value={form.why_apply}
              onChange={(event) => handleChange("why_apply", event.target.value)}
              rows={5}
              placeholder="Explain your motivation, current needs, and why guided training is appropriate for you."
              className="border-white/10 bg-white/[0.035]"
            />
          </div>

          <div>
            <Label className="mb-2 text-xs text-slate-400">What do you want to produce after 10 weeks? *</Label>
            <Textarea
              required
              value={form.production_goals}
              onChange={(event) => handleChange("production_goals", event.target.value)}
              rows={4}
              placeholder="Describe the practical output, portfolio, workflow, or project you want to complete."
              className="border-white/10 bg-white/[0.035]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4">
              <Checkbox checked={form.understands_no_auto_cert} onCheckedChange={(value) => handleChange("understands_no_auto_cert", value)} className="mt-0.5" />
              <p className="text-sm leading-6 text-slate-400">
                I understand that the Certificate of Completion is not automatic. Eligibility depends on completing the required work and passing the final review.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4">
              <Checkbox checked={form.agrees_to_submit_weekly} onCheckedChange={(value) => handleChange("agrees_to_submit_weekly", value)} className="mt-0.5" />
              <p className="text-sm leading-6 text-slate-400">
                I understand that this is a guided cohort program and agree to complete weekly outputs during the 10-week training period.
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="apple-button-primary h-12 w-full border-0 text-sm font-semibold text-slate-950 hover:text-slate-950">
            {submitting ? <Loader2 size={17} className="animate-spin" /> : "Submit application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
