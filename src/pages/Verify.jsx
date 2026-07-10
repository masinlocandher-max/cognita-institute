import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, ShieldCheck, AlertCircle, Loader2, User, Hash, Calendar, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Verify() {
  const [search, setSearch] = useState({ student_name: "", serial_number: "", batch: "" });
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serialFromUrl = urlParams.get("serial");
    if (serialFromUrl) {
      setSearch(s => ({ ...s, serial_number: serialFromUrl }));
      // Auto-search
      setTimeout(() => doVerify(serialFromUrl), 300);
    }
  }, []);

  const doVerify = async (serialOverride) => {
    const serial = serialOverride || search.serial_number.trim();
    const hasInput = search.student_name.trim() || serial || search.batch.trim();
    if (!hasInput) return;
    setSearching(true);
    setResult(null);
    setNotFound(false);
    setSearched(true);
    try {
      const query = {};
      if (serial) query.serial_number = serial;
      if (search.student_name.trim()) query.student_name = search.student_name.trim();
      if (search.batch.trim()) query.batch_name = search.batch.trim();

      const certs = await base44.entities.Certificate.filter(query);
      const validCerts = certs.filter(c => c.status === "Issued" || c.status === "Revoked");
      if (validCerts.length > 0) {
        setResult(validCerts[0]);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    doVerify();
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-20 pb-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Verification</p>
      <h1 className="text-2xl md:text-4xl font-heading font-bold mb-2">Certificate Verification</h1>
      <p className="text-muted-foreground mb-10">
        Verify the authenticity of a Cognita certificate. Enter any combination of the fields below to search.
      </p>

      <form onSubmit={handleVerify} className="space-y-4 mb-10">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Hash size={12} /> Certificate Serial Number
          </Label>
          <Input
            value={search.serial_number}
            onChange={e => setSearch(s => ({ ...s, serial_number: e.target.value }))}
            placeholder="e.g., COG-CERT-2026-B001-CRE-0001"
            className="bg-secondary border-border font-mono"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <User size={12} /> Student Name
          </Label>
          <Input
            value={search.student_name}
            onChange={e => setSearch(s => ({ ...s, student_name: e.target.value }))}
            placeholder="Full name as it appears on the certificate"
            className="bg-secondary border-border"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Calendar size={12} /> Batch
          </Label>
          <Input
            value={search.batch}
            onChange={e => setSearch(s => ({ ...s, batch: e.target.value }))}
            placeholder="e.g., Cognita Pilot Batch 001"
            className="bg-secondary border-border"
          />
        </div>
        <Button type="submit" disabled={searching} className="w-full bg-cyan-500 text-black hover:bg-cyan-400 h-11">
          {searching ? <Loader2 size={16} className="animate-spin mr-2" /> : <Search size={16} className="mr-2" />}
          Verify Certificate
        </Button>
      </form>

      {result && result.status === "Issued" && (
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <ShieldCheck size={24} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-400">Verified Certificate</p>
              <p className="text-xs text-muted-foreground">This certificate is authentic and valid.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Student Name", value: result.student_name },
              { label: "Track Completed", value: result.track },
              { label: "Batch", value: result.batch_name },
              { label: "Date Issued", value: result.issued_date },
              { label: "Certificate Serial Number", value: result.serial_number },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-right">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-400 font-medium mb-1">Verification Note</p>
            <p className="text-sm text-foreground/70">{result.verification_note || "This certificate was issued based on completed and reviewed outputs, not attendance."}</p>
          </div>
        </div>
      )}

      {result && result.status === "Revoked" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Ban size={24} className="text-red-400" />
          </div>
          <p className="text-lg font-semibold text-red-400 mb-2">Certificate Revoked</p>
          <p className="text-sm text-muted-foreground mb-4">
            Serial: <span className="font-mono">{result.serial_number}</span>
          </p>
          {result.revoked_reason && (
            <div className="mt-4 p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">Reason</p>
              <p className="text-sm text-foreground/70">{result.revoked_reason}</p>
            </div>
          )}
        </div>
      )}

      {notFound && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle size={32} className="text-destructive mx-auto mb-3" />
          <p className="font-medium mb-1">No Verified Certificate Found</p>
          <p className="text-sm text-muted-foreground">No verified certificate found. Please check the information entered.</p>
        </div>
      )}

      {!searched && !result && (
        <div className="text-center text-xs text-muted-foreground">
          <p>Every Cognita certificate represents verified competence — not attendance.</p>
        </div>
      )}
    </div>
  );
}