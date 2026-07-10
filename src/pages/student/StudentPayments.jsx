import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, FileText, CheckCircle, AlertCircle, ShieldCheck, CreditCard } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PAYMENT_METHODS, formatCurrency } from "@/lib/business-utils";
import EmptyState from "@/components/curriculum/EmptyState";

export default function StudentPayments() {
  const [student, setStudent] = useState(null);
  const [application, setApplication] = useState(null);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ payment_method: "Bank Transfer", payment_reference: "" });
  const [proofUrl, setProofUrl] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    const user = await base44.auth.me();

    // Check for student record
    const students = await base44.entities.Student.filter({ email: user.email });
    if (students.length > 0) {
      const s = students[0];
      setStudent(s);
      const [pays, invs, recs] = await Promise.all([
        base44.entities.Payment.filter({ student_id: s.id }),
        base44.entities.Invoice.filter({ student_id: s.id }),
        base44.entities.Receipt.filter({ student_id: s.id }),
      ]);
      setPayments(pays);
      setInvoices(invs);
      setReceipts(recs);
    } else {
      // Check for accepted application
      const apps = await base44.entities.Application.filter({ email: user.email });
      const accepted = apps.find(a => a.status === "Accepted" || a.status === "Enrolled");
      if (accepted) {
        setApplication(accepted);
        const [pays, invs] = await Promise.all([
          base44.entities.Payment.filter({ student_email: user.email }),
          base44.entities.Invoice.filter({ student_email: user.email }),
        ]);
        setPayments(pays);
        setInvoices(invs);
        const recs = accepted.status === "Enrolled" ? await base44.entities.Receipt.filter({ student_email: user.email }) : [];
        setReceipts(recs);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUploadProof = async (paymentId, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      await base44.entities.Payment.update(paymentId, {
        payment_proof_url: file_uri,
        payment_status: "Payment Submitted",
        date_submitted: new Date().toISOString(),
        payment_method: paymentForm.payment_method,
        payment_reference: paymentForm.payment_reference,
      });
      toast({ title: "Payment proof uploaded", description: "An admin will review your payment shortly." });
      setPaymentForm({ payment_method: "Bank Transfer", payment_reference: "" });
      setProofUrl(null);
      load();
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const viewProof = async (fileUri) => {
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 300 });
      window.open(signed_url, "_blank");
    } catch (err) {
      toast({ title: "Could not load file", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  // Don't show payment section to rejected applicants
  if (!student && !application) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No payment records"
        description="Payment records become available after your application is accepted."
      />
    );
  }

  const name = student?.full_name || application?.full_name || "Student";
  const track = student?.track || application?.preferred_track || "";

  // Enrollment checklist
  const checklist = [
    { label: "Application submitted", done: true },
    { label: "Application accepted", done: !!application || !!student },
    { label: "Enrollment agreement", done: student?.enrollment_agreement_signed || !!student },
    { label: "Payment confirmed", done: student?.payment_status === "Payment Confirmed" || student?.payment_status === "Payment Waived" || payments.some(p => p.payment_status === "Payment Confirmed" || p.payment_status === "Payment Waived") },
    { label: "Enrolled in batch", done: !!student },
  ];

  const pendingPayment = payments.find(p => ["Payment Pending", "Payment Submitted", "Payment Failed", "Balance Due"].includes(p.payment_status));
  const confirmedReceipt = receipts[0];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-heading font-bold mb-1">Payments & Enrollment</h1>
      <p className="text-xs text-muted-foreground mb-6">{name} · {track}</p>

      {/* Enrollment checklist */}
      <div className="rounded-xl border border-border/50 bg-card p-5 mb-6">
        <h2 className="text-sm font-semibold mb-4">Enrollment Checklist</h2>
        <div className="space-y-3">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.done ? <CheckCircle size={16} className="text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />}
              <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice */}
      {invoices.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold">Invoice</h2>
          </div>
          {invoices.map(inv => (
            <div key={inv.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-mono text-xs">{inv.invoice_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tuition</span>
                <span className="font-mono">{formatCurrency(inv.tuition_fee)}</span>
              </div>
              {inv.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount ({inv.discount_type})</span>
                  <span className="font-mono text-purple-400">-{formatCurrency(inv.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-border/30 pt-2">
                <span className="font-semibold">Total Due</span>
                <span className="font-mono font-bold">{formatCurrency(inv.total_amount_due)}</span>
              </div>
              {inv.due_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span>{inv.due_date}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={inv.payment_status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment instructions + proof upload */}
      {pendingPayment && (
        <div className="rounded-xl border border-border/50 bg-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold">Payment Instructions</h2>
          </div>

          {pendingPayment.payment_status === "Payment Submitted" ? (
            <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-sm text-yellow-400">
              Your payment proof has been submitted and is pending admin review. You will be notified once confirmed.
            </div>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 mb-4 text-sm">
                <p className="text-muted-foreground mb-2">Amount Due: <span className="font-mono font-bold text-foreground">{formatCurrency(pendingPayment.amount_due)}</span></p>
                <p className="text-xs text-muted-foreground">Please make your payment via bank transfer or GCash, then upload your payment proof below.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5">Payment Method</Label>
                  <Select value={paymentForm.payment_method} onValueChange={v => setPaymentForm(f => ({ ...f, payment_method: v }))}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5">Payment Reference Number</Label>
                  <Input value={paymentForm.payment_reference} onChange={e => setPaymentForm(f => ({ ...f, payment_reference: e.target.value }))} placeholder="Transaction ID / Reference No." className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5">Upload Payment Proof</Label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => handleUploadProof(pendingPayment.id, e.target.files?.[0])}
                    disabled={uploading || !paymentForm.payment_reference}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500/10 file:text-cyan-400 file:text-xs file:font-medium hover:file:bg-cyan-500/20 cursor-pointer disabled:opacity-40"
                  />
                  {uploading && <p className="text-xs text-muted-foreground mt-1"><Loader2 size={12} className="animate-spin inline mr-1" /> Uploading...</p>}
                </div>
              </div>
            </>
          )}

          {pendingPayment.payment_proof_url && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Uploaded Proof</p>
              <Button size="sm" variant="outline" onClick={() => viewProof(pendingPayment.payment_proof_url)} className="text-xs border-border">
                <FileText size={12} className="mr-1" /> View Payment Proof
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Receipt / Payment Confirmation Record */}
      {confirmedReceipt ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-400">Payment Confirmation Record</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Receipt Number</span><span className="font-mono text-xs">{confirmedReceipt.receipt_number}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="font-mono font-bold text-emerald-400">{formatCurrency(confirmedReceipt.amount_paid)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span>{confirmedReceipt.payment_method}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date Paid</span><span>{confirmedReceipt.date_paid}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Confirmed By</span><span>{confirmedReceipt.confirmed_by}</span></div>
          </div>
        </div>
      ) : !pendingPayment && invoices.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No payment records yet"
          description="Your invoice and payment instructions will appear here once your application is accepted and an invoice is created."
        />
      )}

      {/* Payment status summary */}
      {payments.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Payment Status</h2>
          {payments.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm">{formatCurrency(p.amount_due)} due</p>
                {p.balance_due > 0 && <p className="text-xs text-orange-400">Balance: {formatCurrency(p.balance_due)}</p>}
              </div>
              <StatusBadge status={p.payment_status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}