import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ACTIVE_TRACKS } from "@/lib/curriculum";
import { CheckCircle, Loader2 } from "lucide-react";
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
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.understands_no_auto_cert || !form.agrees_to_submit_weekly) {
      setError("You must confirm both statements to proceed.");
      return;
    }
    setSubmitting(true);
    try {
      setCheckingEmail(true);
      const existing = await base44.entities.Application.filter({ email: form.email });
      setCheckingEmail(false);
      if (existing.length > 0) {
        const existingApp = existing[0];
        if (existingApp.status === "Enrolled") {
          setError("You are already enrolled as a student. Please sign in to access your dashboard.");
        } else if (existingApp.status === "Accepted") {
          setError("Your application has already been accepted. Please check your email for enrollment instructions.");
        } else if (existingApp.status === "Rejected") {
          setError("A previous application with this email was not accepted. Please contact us if you believe this is an error.");
        } else {
          setError("You already have an application under review. Our admissions team will contact you soon.");
        }
        setSubmitting(false);
        return;
      }
      await base44.entities.Application.create({
        ...form,
        status: "Pending Review",
      });
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5 sm:px-6">
        <div className="text-center max-w-md card-glow rounded-xl p-8">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-3">Application Submitted</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your application has been received. Cognita reviews applicants before enrollment. Our admissions team will contact you via email with a decision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-20 pb-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Application-Based Admission</p>
      <h1 className="text-2xl md:text-4xl font-heading font-bold mb-3">Apply for the Next Cognita Batch</h1>
      <p className="text-sm md:text-base text-muted-foreground mb-10">
        Cognita reviews applicants before enrollment. Application does not guarantee acceptance.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 card-glow rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Full Name *</Label>
            <Input required value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Email *</Label>
            <Input required type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Phone Number *</Label>
            <Input required value={form.phone} onChange={e => handleChange("phone", e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Location *</Label>
            <Input required value={form.location} onChange={e => handleChange("location", e.target.value)} className="bg-secondary border-border" />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5">Preferred Track *</Label>
          <Select value={form.preferred_track} onValueChange={v => handleChange("preferred_track", v)}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select a track" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVE_TRACKS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5">Current Occupation or Student Status *</Label>
          <Input required value={form.occupation} onChange={e => handleChange("occupation", e.target.value)} placeholder="e.g., Graphic designer, VA, College student" className="bg-secondary border-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
              <span>AI Skill Level</span>
              <span className="text-cyan-400 font-mono">{form.ai_skill_level}/10</span>
            </Label>
            <Slider value={[form.ai_skill_level]} onValueChange={v => handleChange("ai_skill_level", v[0])} min={1} max={10} step={1} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
              <span>Tech Skill Level</span>
              <span className="text-cyan-400 font-mono">{form.tech_skill_level}/10</span>
            </Label>
            <Slider value={[form.tech_skill_level]} onValueChange={v => handleChange("tech_skill_level", v[0])} min={1} max={10} step={1} />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
            <span>Available Hours Per Week</span>
            <span className="text-cyan-400 font-mono">{form.available_hours} hrs</span>
          </Label>
          <Slider value={[form.available_hours]} onValueChange={v => handleChange("available_hours", v[0])} min={1} max={40} step={1} />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5">Why do you want to join Cognita? *</Label>
          <Textarea required value={form.why_apply} onChange={e => handleChange("why_apply", e.target.value)} rows={4} placeholder="Tell us why you want to join..." className="bg-secondary border-border" />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5">What do you want to produce after 10 weeks? *</Label>
          <Textarea required value={form.production_goals} onChange={e => handleChange("production_goals", e.target.value)} rows={3} placeholder="Describe what you want to create or achieve..." className="bg-secondary border-border" />
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
            <Checkbox
              checked={form.understands_no_auto_cert}
              onCheckedChange={v => handleChange("understands_no_auto_cert", v)}
              className="mt-0.5"
            />
            <p className="text-sm text-muted-foreground">
              I understand that certificates at Cognita are not automatic. They are issued only after all weekly outputs are submitted, reviewed, and passed.
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
            <Checkbox
              checked={form.agrees_to_submit_weekly}
              onCheckedChange={v => handleChange("agrees_to_submit_weekly", v)}
              className="mt-0.5"
            />
            <p className="text-sm text-muted-foreground">
              I agree to submit weekly outputs for 10 consecutive weeks. I understand that failure to submit may result in removal from the program.
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting} className="btn-glow w-full h-12 text-sm font-semibold border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : "SUBMIT APPLICATION"}
        </Button>
      </form>
    </div>
  );
}