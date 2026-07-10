import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Award, CheckCircle, Circle, ShieldAlert, Eye, Ban } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import CertificateTemplate from "@/components/CertificateTemplate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { computeCertificateEligibility, getCertificateRequirements } from "@/lib/curriculum-utils";
import { generateCertificateSerial, getNextSequence, getTrackCode } from "@/lib/business-utils";

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueOpen, setIssueOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", serial_number: "" });
  const [eligibility, setEligibility] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [revokeCert, setRevokeCert] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const [c, s, b, subs] = await Promise.all([
      base44.entities.Certificate.list("-created_date", 100),
      base44.entities.Student.list("-created_date", 200),
      base44.entities.Batch.list("-created_date", 50),
      base44.entities.Submission.list("-created_date", 500),
    ]);
    setCerts(c);
    setStudents(s);
    setBatches(b);
    setSubmissions(subs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const generateSerial = () => {
    const student = students.find(s => s.id === form.student_id);
    if (!student) return "";
    const batch = batches.find(b => b.id === student.batch_id);
    const year = new Date().getFullYear();
    const batchCode = batch?.batch_code || "B000";
    const trackCode = getTrackCode(student.track);
    const seq = getNextSequence(certs, "COG-CERT", year, batchCode);
    return generateCertificateSerial(year, batchCode, trackCode, seq);
  };

  const checkEligibility = async (studentId) => {
    setEligibility(null);
    if (!studentId) return;
    setCheckingEligibility(true);
    try {
      const studentSubs = await base44.entities.Submission.filter({ student_id: studentId });
      const student = students.find(s => s.id === studentId);
      const certStatus = student ? computeCertificateEligibility(studentSubs) : "Not Eligible";
      const reqs = getCertificateRequirements(studentSubs);
      setEligibility({ eligible: certStatus === "Ready for Review", certStatus, requirements: reqs });
    } catch {
      setEligibility(null);
    }
    setCheckingEligibility(false);
  };

  const handleApprove = async (studentId) => {
    await base44.entities.Student.update(studentId, { certificate_status: "Approved" });
    toast({ title: "Student approved for certificate" });
    load();
  };

  const handleIssue = async () => {
    const student = students.find(s => s.id === form.student_id);
    const batch = batches.find(b => b.id === student?.batch_id);
    if (!student) return;

    if (!eligibility?.eligible) {
      toast({ title: "Cannot issue certificate", description: "Student has not met all eligibility requirements.", variant: "destructive" });
      return;
    }

    const serial = form.serial_number || generateSerial();
    const admin = await base44.auth.me();

    await base44.entities.Certificate.create({
      student_id: student.id,
      student_name: student.full_name,
      serial_number: serial,
      track: student.track,
      track_code: getTrackCode(student.track),
      batch_name: batch?.name || "Unknown",
      batch_number: batch?.id || "",
      issued_date: new Date().toISOString().split("T")[0],
      issued_by: admin?.full_name || "Admin",
      title: "Certificate of Practical AI Competency",
      status: "Issued",
    });
    await base44.entities.Student.update(student.id, { certificate_status: "Issued", certificate_id: serial });
    toast({ title: `Certificate issued to ${student.full_name}`, description: serial });
    setIssueOpen(false);
    setForm({ student_id: "", serial_number: "" });
    setEligibility(null);
    load();
  };

  const handleRevoke = async () => {
    if (!revokeCert || !revokeReason.trim()) return;
    await base44.entities.Certificate.update(revokeCert.id, { status: "Revoked", revoked_reason: revokeReason.trim() });
    await base44.entities.Student.update(revokeCert.student_id, { certificate_status: "Not Eligible" });
    toast({ title: `Certificate ${revokeCert.serial_number} revoked` });
    setRevokeCert(null);
    setRevokeReason("");
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  const readyStudents = students.filter(s => {
    const studentSubs = submissions.filter(sub => sub.student_id === s.id);
    const status = computeCertificateEligibility(studentSubs);
    return (status === "Ready for Review" || s.certificate_status === "Approved") && s.certificate_status !== "Issued";
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">Issue, preview, and revoke certificates.</p>
        </div>
        <Button onClick={() => { setForm({ student_id: "", serial_number: "" }); setEligibility(null); setIssueOpen(true); }} className="bg-amber-500 text-black hover:bg-amber-400 text-sm">
          <Award size={14} className="mr-2" /> Issue Certificate
        </Button>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
        <div className="flex items-start gap-2">
          <ShieldAlert size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-400/90">
            Certificates can only be issued to students who have passed all 10 weekly outputs including the capstone. Serial numbers are auto-generated as COG-CERT-[YEAR]-[BATCH]-[TRACKCODE]-[0001]. Every certificate includes a QR verification code.
          </p>
        </div>
      </div>

      {readyStudents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Ready for Certificate Review</h2>
          <div className="space-y-2">
            {readyStudents.map(student => {
              const studentSubs = submissions.filter(sub => sub.student_id === student.id);
              const passedCount = studentSubs.filter(s => s.status === "Passed").length;
              const batch = batches.find(b => b.id === student.batch_id);
              return (
                <div key={student.id} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{student.full_name}</p>
                    <p className="text-xs text-muted-foreground">{student.track} · {batch?.name || "No batch"} · {passedCount}/10 passed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={student.certificate_status} />
                    {student.certificate_status === "Ready for Review" && (
                      <Button size="sm" onClick={() => handleApprove(student.id)} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20 text-xs">Approve</Button>
                    )}
                    <Button size="sm" onClick={() => { setForm({ student_id: student.id, serial_number: generateSerial() }); checkEligibility(student.id); setIssueOpen(true); }} className="bg-amber-500 text-black hover:bg-amber-400 text-xs">Issue</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50"><h2 className="text-sm font-semibold">All Certificates</h2></div>
        {certs.length === 0 ? (
          <div className="p-8 md:p-12 text-center text-muted-foreground text-sm">No certificates yet.</div>
        ) : (
          <div className="divide-y divide-border/30">
            {certs.map(c => (
              <div key={c.id} className="px-4 md:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{c.student_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.serial_number}</p>
                  <p className="text-xs text-muted-foreground">{c.track} · {c.batch_name} · {c.issued_date}</p>
                  {c.status === "Revoked" && c.revoked_reason && (
                    <p className="text-xs text-red-400 mt-1">Revoked: {c.revoked_reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={c.status} />
                  <Button size="sm" variant="outline" onClick={() => setPreviewCert(c)} className="text-xs border-border h-8 px-2">
                    <Eye size={12} className="mr-1" /> Preview
                  </Button>
                  {c.status === "Issued" && (
                    <Button size="sm" variant="outline" onClick={() => { setRevokeCert(c); setRevokeReason(""); }} className="text-xs text-red-400 border-red-500/20 hover:bg-red-500/5 h-8 px-2">
                      <Ban size={12} className="mr-1" /> Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Issue dialog */}
      <Dialog open={issueOpen} onOpenChange={(open) => { setIssueOpen(open); if (!open) setEligibility(null); }}>
        <DialogContent className="max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Issue Certificate</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs text-muted-foreground">Student</Label>
              <Select value={form.student_id} onValueChange={v => { setForm(f => ({ ...f, student_id: v })); checkEligibility(v); }}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.filter(s => s.certificate_status !== "Issued").map(s => <SelectItem key={s.id} value={s.id}>{s.full_name} - {s.track}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {checkingEligibility && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Checking eligibility...</div>}

            {eligibility && (
              <div className={`rounded-lg border p-4 ${eligibility.eligible ? "border-emerald-500/20 bg-emerald-500/5" : "border-destructive/20 bg-destructive/5"}`}>
                <div className="flex items-center gap-2 mb-3">
                  {eligibility.eligible ? <CheckCircle size={16} className="text-emerald-400" /> : <ShieldAlert size={16} className="text-destructive" />}
                  <p className={`text-sm font-medium ${eligibility.eligible ? "text-emerald-400" : "text-destructive"}`}>{eligibility.eligible ? "Eligible for Certification" : eligibility.certStatus}</p>
                </div>
                <div className="space-y-2">
                  {eligibility.requirements.map((req, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {req.done ? <CheckCircle size={12} className="text-emerald-400" /> : <Circle size={12} className="text-muted-foreground" />}
                        <span className={req.done ? "text-foreground" : "text-muted-foreground"}>{req.label}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">{req.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {eligibility?.eligible && form.serial_number && (
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-1">Certificate Preview</p>
                <p className="text-xs font-mono">{form.serial_number}</p>
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground">Serial Number (auto-generated)</Label>
              <Input value={form.serial_number} onChange={e => setForm(f => ({ ...f, serial_number: e.target.value }))} className="bg-secondary border-border font-mono" />
            </div>
            <Button onClick={handleIssue} disabled={!form.student_id || !eligibility?.eligible} className="w-full bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40">
              {eligibility?.eligible ? "Issue Certificate" : "Requirements Not Met"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!previewCert} onOpenChange={() => setPreviewCert(null)}>
        <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Certificate Preview</DialogTitle></DialogHeader>
          <div className="mt-2">
            <CertificateTemplate certificate={previewCert} preview />
          </div>
        </DialogContent>
      </Dialog>

      {/* Revoke dialog */}
      <Dialog open={!!revokeCert} onOpenChange={() => setRevokeCert(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader><DialogTitle>Revoke Certificate</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400">
              <p>Serial: <span className="font-mono">{revokeCert?.serial_number}</span></p>
              <p>Student: {revokeCert?.student_name}</p>
              <p className="mt-2">This will mark the certificate as revoked. The record will not be deleted. Public verification will show "Certificate Revoked" with the reason.</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Reason for Revocation *</Label>
              <Textarea value={revokeReason} onChange={e => setRevokeReason(e.target.value)} rows={3} className="bg-secondary border-border" placeholder="e.g., Plagiarism discovered in capstone submission..." />
            </div>
            <Button onClick={handleRevoke} disabled={!revokeReason.trim()} className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20">
              <Ban size={14} className="mr-2" /> Revoke Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}