import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PARTNER_TYPES, PARTNER_PROGRAMS } from "@/lib/business-utils";

export default function Partner() {
  const [form, setForm] = useState({
    organization_name: "",
    organization_type: "",
    contact_person: "",
    email: "",
    phone: "",
    location: "",
    interested_program: "",
    estimated_participants: "",
    preferred_schedule: "",
    message: "",
  });
  const [proposalFile, setProposalFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.organization_name || !form.organization_type || !form.contact_person || !form.email || !form.interested_program) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let proposal_url = undefined;
      if (proposalFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: proposalFile });
        proposal_url = file_url;
      }

      await base44.entities.PartnerInquiry.create({
        ...form,
        estimated_participants: form.estimated_participants ? parseInt(form.estimated_participants) : undefined,
        proposal_url,
        status: "New",
      });

      setSubmitted(true);
    } catch (err) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-20 pb-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-cyan-400" />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-3">Inquiry Received</h1>
        <p className="text-muted-foreground mb-8">Thank you for your interest in partnering with Cognita. Our team will review your inquiry and reach out within 2-3 business days.</p>
        <Button onClick={() => { setSubmitted(false); setForm({ organization_name: "", organization_type: "", contact_person: "", email: "", phone: "", location: "", interested_program: "", estimated_participants: "", preferred_schedule: "", message: "" }); }} variant="outline" className="border-border">
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-20 pb-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Partnerships</p>
          <h1 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight mb-6">
            Bring Practical AI Training
            <br />
            <span className="text-cyan-400">to Your Institution</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Cognita partners with schools, organizations, and communities to deliver output-based AI learning programs built around real skills, guided practice, and verified results.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PARTNER_TYPES.map(type => (
            <div key={type} className="card-glow rounded-xl p-4 flex items-center gap-2">
              <Building2 size={16} className="text-cyan-400 flex-shrink-0" />
              <span className="text-xs font-medium">{type}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Programs We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PARTNER_PROGRAMS.map(program => (
            <div key={program} className="card-glow rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-medium">{program}</span>
              <ArrowRight size={14} className="text-cyan-400/50" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-5 sm:px-6 pb-20">
        <div className="card-glow rounded-xl p-6 md:p-8">
          <h2 className="text-lg font-heading font-semibold mb-6">Partner Inquiry Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Organization Name *</Label>
                <Input value={form.organization_name} onChange={e => setForm(f => ({ ...f, organization_name: e.target.value }))} className="bg-secondary border-border" required />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Organization Type *</Label>
                <Select value={form.organization_type} onValueChange={v => setForm(f => ({ ...f, organization_type: v }))}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {PARTNER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Contact Person *</Label>
                <Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} className="bg-secondary border-border" required />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary border-border" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Phone Number</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Location</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="bg-secondary border-border" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Interested Program *</Label>
                <Select value={form.interested_program} onValueChange={v => setForm(f => ({ ...f, interested_program: v }))}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {PARTNER_PROGRAMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5">Estimated Participants</Label>
                <Input type="number" value={form.estimated_participants} onChange={e => setForm(f => ({ ...f, estimated_participants: e.target.value }))} className="bg-secondary border-border" placeholder="e.g., 30" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Preferred Schedule</Label>
              <Input value={form.preferred_schedule} onChange={e => setForm(f => ({ ...f, preferred_schedule: e.target.value }))} className="bg-secondary border-border" placeholder="e.g., Q3 2026, Weekends, etc." />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Message</Label>
              <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className="bg-secondary border-border" placeholder="Tell us about your goals and how we can help..." />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Upload Proposal or Letter (optional)</Label>
              <input
                type="file"
                accept="image/*,application/pdf,.doc,.docx"
                onChange={e => setProposalFile(e.target.files?.[0])}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500/10 file:text-cyan-400 file:text-xs file:font-medium hover:file:bg-cyan-500/20 cursor-pointer"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full btn-glow h-11">
              {submitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <ArrowRight size={16} className="mr-2" />}
              Submit Partnership Inquiry
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}