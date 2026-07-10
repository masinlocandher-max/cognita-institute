import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ALL_TRACKS } from "@/lib/business-utils";

export default function Waitlist() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_track: "",
    reason_for_interest: "",
    preferred_batch: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      toast({ title: "Please fill in your name and email", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.Waitlist.create({
        ...form,
        status: "New",
      });

      // Also create a lead
      await base44.entities.Lead.create({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        interest_type: "Join Waitlist",
        preferred_track: form.preferred_track || "Not Sure Yet",
        message: form.reason_for_interest,
        source_page: "Waitlist Page",
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
        <h1 className="text-2xl font-heading font-bold mb-3">You're on the Waitlist</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your interest in Cognita. We'll notify you when applications open for the next batch.
          Every Cognita student is reviewed individually — being on the waitlist means you'll be first to know.
        </p>
        <Button onClick={() => { setSubmitted(false); setForm({ full_name: "", email: "", phone: "", preferred_track: "", reason_for_interest: "", preferred_batch: "" }); }} variant="outline" className="border-border">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="max-w-3xl mx-auto px-5 sm:px-6 pt-20 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Waitlist</p>
        <h1 className="section-title text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight mb-6">
          JOIN THE
          <br />
          <span className="text-cyan-400">WAITLIST</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Applications may be closed, but you can still secure your spot. Join the waitlist and be the first to know when the next batch opens.
        </p>
      </section>

      <section className="max-w-xl mx-auto px-5 sm:px-6 pb-20">
        <div className="card-glow rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Full Name *</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="bg-secondary border-border" required />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary border-border" required />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Phone Number</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Preferred Track</Label>
              <Select value={form.preferred_track} onValueChange={v => setForm(f => ({ ...f, preferred_track: v }))}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select track" /></SelectTrigger>
                <SelectContent>
                  {ALL_TRACKS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Preferred Batch</Label>
              <Input value={form.preferred_batch} onChange={e => setForm(f => ({ ...f, preferred_batch: e.target.value }))} className="bg-secondary border-border" placeholder="e.g., Batch 002, Q1 2027" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Why are you interested in Cognita?</Label>
              <Textarea value={form.reason_for_interest} onChange={e => setForm(f => ({ ...f, reason_for_interest: e.target.value }))} rows={4} className="bg-secondary border-border" placeholder="Tell us about your goals..." />
            </div>
            <Button type="submit" disabled={submitting} className="w-full btn-glow h-11">
              {submitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <ArrowRight size={16} className="mr-2" />}
              Join the Waitlist
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}