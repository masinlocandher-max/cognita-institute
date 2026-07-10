import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, FileText, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AGREEMENT_SECTIONS = [
  {
    title: "Program Structure",
    body: "I understand that the Cognita AI Academy is a 10-week structured program with weekly required outputs. I commit to submitting outputs for 10 consecutive weeks starting from my batch start date.",
  },
  {
    title: "Output-Based Certification",
    body: "I understand that certificates are not automatic and are not issued based on attendance. Certificates are issued only after all 10 weekly outputs are submitted, reviewed, and passed by a human facilitator, including the final capstone.",
  },
  {
    title: "Facilitator Review",
    body: "I understand that every submission will be reviewed by a facilitator who may provide feedback, request revisions, or mark outputs as failed. I agree to incorporate feedback and resubmit when required.",
  },
  {
    title: "Academic Integrity",
    body: "I confirm that all submitted work will be my own. I will use AI as a tool but will not submit unedited AI output as my work. Plagiarism or fake work may result in removal from the program without refund.",
  },
  {
    title: "Tuition and Refunds",
    body: "I understand that tuition fees are due as per my invoice. Refund requests are handled on a case-by-case basis and must be submitted before my batch start date.",
  },
  {
    title: "Progress and Participation",
    body: "I understand that failure to submit weekly outputs may result in my progress status being marked as 'At Risk' or 'Removed'. I commit to active participation throughout the 10-week program.",
  },
  {
    title: "Data Privacy",
    body: "I consent to Cognita Institute storing my application data, submission content, and progress records for the purpose of program administration and certification verification.",
  },
];

export default function StudentEnrollmentAgreement() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      const students = await base44.entities.Student.filter({ email: user.email });
      if (students.length > 0) {
        setStudent(students[0]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  if (!student) {
    return <div className="text-center py-20 text-muted-foreground">Not enrolled yet.</div>;
  }

  if (student.enrollment_agreement_signed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold mb-2">Enrollment Agreement Signed</h1>
          <p className="text-sm text-muted-foreground mb-6">Your enrollment agreement has been signed. You're ready to begin your Cognita journey.</p>
          <Button onClick={() => navigate("/student")} className="bg-cyan-500 text-black hover:bg-cyan-400">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSign = async () => {
    setSigning(true);
    try {
      await base44.entities.Student.update(student.id, { enrollment_agreement_signed: true });
      toast({ title: "Enrollment agreement signed" });
      navigate("/student");
    } catch (err) {
      toast({ title: "Failed to sign", description: err.message, variant: "destructive" });
    }
    setSigning(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} className="text-cyan-400" />
        <h1 className="text-xl md:text-2xl font-heading font-bold">Enrollment Agreement</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Please review and sign the enrollment agreement to activate your student dashboard.</p>

      <div className="space-y-3 mb-6">
        {AGREEMENT_SECTIONS.map((section, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-sm font-semibold">{section.title}</h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 mb-6">
        <div className="flex items-start gap-3">
          <Checkbox checked={agreed} onCheckedChange={v => setAgreed(v)} className="mt-0.5" />
          <p className="text-sm text-foreground/80">
            I have read and understood all sections of this enrollment agreement. I agree to all terms and conditions stated above.
          </p>
        </div>
      </div>

      <Button onClick={handleSign} disabled={!agreed || signing} className="w-full bg-cyan-500 text-black hover:bg-cyan-400 h-12">
        {signing ? <Loader2 size={16} className="animate-spin" /> : <><ShieldCheck size={16} className="mr-2" /> Sign Enrollment Agreement</>}
      </Button>
    </div>
  );
}