import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Award, ShieldCheck, CheckCircle, Circle } from "lucide-react";
import CertificateBadge from "@/components/curriculum/CertificateBadge";
import CertificateTemplate from "@/components/CertificateTemplate";
import { getEffectiveCertificateStatus, getCertificateRequirements } from "@/lib/curriculum-utils";

export default function StudentCertificate() {
  const [student, setStudent] = useState(null);
  const [cert, setCert] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      const students = await base44.entities.Student.filter({ email: user.email });
      if (students.length > 0) {
        const s = students[0];
        setStudent(s);
        const subs = await base44.entities.Submission.filter({ student_id: s.id });
        setSubmissions(subs);
        if (s.certificate_id) {
          const certs = await base44.entities.Certificate.filter({ serial_number: s.certificate_id });
          if (certs.length > 0) setCert(certs[0]);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  if (!student) return <div className="text-center py-20 text-muted-foreground">Not enrolled yet.</div>;

  const certStatus = getEffectiveCertificateStatus(student, submissions);
  const requirements = getCertificateRequirements(submissions);

  // If certificate is issued, show the certificate
  if (cert) {
    return (
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold mb-6">Your Certificate</h1>
        <CertificateTemplate certificate={cert} />
        <div className="mt-6 max-w-[800px] mx-auto p-4 rounded-lg border border-border/50 bg-card text-center">
          <p className="text-xs text-muted-foreground">
            <ShieldCheck size={14} className="inline mr-1.5 text-cyan-400" />
            Serial: <span className="font-mono">{cert.serial_number}</span> · Verify at our public verification page.
          </p>
        </div>
      </div>
    );
  }

  // Otherwise show eligibility status
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-heading font-bold mb-6">Certificate</h1>

      <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8 text-center mb-6">
        <Award size={40} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Certificate Not Yet Issued</h2>
        <div className="mb-4">
          <CertificateBadge status={certStatus} size="lg" />
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          Certificates are issued only after all 10 weekly outputs are submitted and passed, including the final capstone. An admin will manually review and issue your certificate.
        </p>
      </div>

      {/* Requirements */}
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <p className="text-sm font-semibold mb-4">Eligibility Requirements</p>
        <div className="space-y-3">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {req.done ? <CheckCircle size={16} className="text-emerald-400" /> : <Circle size={16} className="text-muted-foreground" />}
                <span className={`text-sm ${req.done ? "text-foreground" : "text-muted-foreground"}`}>{req.label}</span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">{req.value}</span>
            </div>
          ))}
        </div>

        {certStatus === "Ready for Review" && (
          <div className="mt-4 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-sm text-amber-400">
            All requirements met. Your portfolio is ready for review. An admin will review and issue your certificate.
          </div>
        )}
        {certStatus === "In Progress" && (
          <div className="mt-4 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-sm text-blue-400">
            You're making progress. Complete all requirements to become eligible for certificate review.
          </div>
        )}
        {certStatus === "Not Eligible" && (
          <div className="mt-4 p-3 rounded-lg border border-border/30 bg-secondary/30 text-sm text-muted-foreground">
            Your certificate is not eligible yet. Start submitting your weekly outputs to build eligibility.
          </div>
        )}
      </div>
    </div>
  );
}