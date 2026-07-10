import React, { useState } from "react";
import { Mail, Loader2, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CONCERN_TYPES = [
  "Application",
  "Enrollment",
  "Payment",
  "Learning Access",
  "Submission Issue",
  "Certificate Verification",
  "Technical Support",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({ full_name: "", email: "", concern_type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-3">Message Received</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for reaching out. Our team will review your message and respond to your email within 1-2 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Support</p>
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Contact & Support</h1>
      <p className="text-muted-foreground mb-8">
        Questions about your application, enrollment, or learning experience? We're here to help.
      </p>

      <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
          <Mail size={18} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email us directly</p>
          <p className="text-sm font-medium text-cyan-400">support@cognita.ai</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-name" className="text-xs text-muted-foreground mb-1.5">Full Name *</Label>
            <Input id="contact-name" required value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="contact-email" className="text-xs text-muted-foreground mb-1.5">Email *</Label>
            <Input id="contact-email" required type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} className="bg-secondary border-border" />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5">Concern Type *</Label>
          <Select value={form.concern_type} onValueChange={v => handleChange("concern_type", v)}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select a concern type" />
            </SelectTrigger>
            <SelectContent>
              {CONCERN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contact-message" className="text-xs text-muted-foreground mb-1.5">Message *</Label>
          <Textarea id="contact-message" required value={form.message} onChange={e => handleChange("message", e.target.value)} rows={5} className="bg-secondary border-border" placeholder="Describe your concern..." />
        </div>

        <Button type="submit" disabled={submitting} className="w-full bg-cyan-500 text-black hover:bg-cyan-400 h-12 text-sm font-semibold">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="mr-2" />}
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}