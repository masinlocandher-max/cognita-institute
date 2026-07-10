import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { AlertCircle, Ban, Calendar, Hash, Loader2, Search, ShieldCheck, User } from "lucide-react";
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
      setSearch((current) => ({ ...current, serial_number: serialFromUrl }));
      window.setTimeout(() => doVerify(serialFromUrl), 300);
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

      const certificates = await base44.entities.Certificate.filter(query);
      const validCertificates = certificates.filter((certificate) => certificate.status === "Issued" || certificate.status === "Revoked");
      if (validCertificates.length > 0) {
        setResult(validCertificates[0]);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleVerify = (event) => {
    event.preventDefault();
    doVerify();
  };

  return (
    <div className="apple-surface min-h-screen px-5 pb-24 pt-24 sm:px-6 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 max-w-2xl">
          <p className="apple-eyebrow">Cognita Assessment and Credentialing</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Verify a Cognita credential
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">
            This registry confirms whether a Cognita Certificate of Completion was issued through the official assessment and credentialing process.
          </p>
        </div>

        <form onSubmit={handleVerify} className="apple-card mb-10 space-y-5 p-6 md:p-9">
          <div>
            <Label className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <Hash size={13} /> Certificate serial number
            </Label>
            <Input
              value={search.serial_number}
              onChange={(event) => setSearch((current) => ({ ...current, serial_number: event.target.value }))}
              placeholder="Example: COG-CERT-2026-B001-CRE-0001"
              className="border-white/10 bg-white/[0.035] font-mono"
            />
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <User size={13} /> Learner name
            </Label>
            <Input
              value={search.student_name}
              onChange={(event) => setSearch((current) => ({ ...current, student_name: event.target.value }))}
              placeholder="Full name shown on the credential"
              className="border-white/10 bg-white/[0.035]"
            />
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={13} /> Cohort or batch
            </Label>
            <Input
              value={search.batch}
              onChange={(event) => setSearch((current) => ({ ...current, batch: event.target.value }))}
              placeholder="Example: Cognita Pilot Batch 001"
              className="border-white/10 bg-white/[0.035]"
            />
          </div>

          <Button type="submit" disabled={searching} className="apple-button-primary h-12 w-full border-0 text-sm font-semibold text-slate-950 hover:text-slate-950">
            {searching ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Search size={16} className="mr-2" />}
            Verify credential
          </Button>
        </form>

        {result && result.status === "Issued" && (
          <div className="apple-card border-emerald-300/20 p-7 md:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.07]">
                <ShieldCheck size={24} className="text-emerald-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-200">Credential verified</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">This record exists in the official Cognita credential registry and is currently valid.</p>
              </div>
            </div>

            <div className="mt-7 divide-y divide-white/[0.07]">
              {[
                { label: "Learner name", value: result.student_name },
                { label: "Track completed", value: result.track },
                { label: "Cohort or batch", value: result.batch_name },
                { label: "Date issued", value: result.issued_date },
                { label: "Serial number", value: result.serial_number },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-200 sm:text-right">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/12 bg-amber-300/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-200/80">Credentialing note</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {result.verification_note || "This Certificate of Completion was issued after the required work and completion evidence were reviewed. It is not a degree, diploma, or automatic attendance certificate."}
              </p>
            </div>
          </div>
        )}

        {result && result.status === "Revoked" && (
          <div className="apple-card border-red-300/20 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300/15 bg-red-300/[0.07]">
              <Ban size={24} className="text-red-300" />
            </div>
            <p className="mt-5 text-xl font-semibold text-red-200">Credential revoked</p>
            <p className="mt-2 text-sm text-slate-400">Serial number: <span className="font-mono">{result.serial_number}</span></p>
            {result.revoked_reason && (
              <div className="mt-6 rounded-2xl border border-red-300/12 bg-red-300/[0.04] p-4 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-200/80">Reason</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{result.revoked_reason}</p>
              </div>
            )}
          </div>
        )}

        {notFound && (
          <div className="apple-card border-red-300/15 p-8 text-center">
            <AlertCircle size={30} className="mx-auto text-red-300" />
            <p className="mt-4 font-semibold text-white">No matching credential found</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Check the spelling and serial number. A missing result does not by itself prove that a document is fraudulent, so contact Cognita when further confirmation is needed.</p>
          </div>
        )}

        {!searched && !result && (
          <p className="text-center text-xs leading-6 text-slate-500">
            Cognita credentials represent reviewed completion evidence, not attendance alone.
          </p>
        )}
      </div>
    </div>
  );
}
