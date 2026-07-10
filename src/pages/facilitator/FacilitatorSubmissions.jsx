import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, FileText } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ReviewPanel from "@/components/curriculum/ReviewPanel";
import EmptyState from "@/components/curriculum/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getWeekLesson, computeStudentUpdates } from "@/lib/curriculum-utils";

export default function FacilitatorSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const load = async () => {
    const user = await base44.auth.me();
    const facs = await base44.entities.Facilitator.filter({ email: user.email });
    if (facs.length > 0) {
      const allStudents = await base44.entities.Student.filter({ facilitator_id: facs[0].id });
      setStudents(allStudents);
      const studentIds = new Set(allStudents.map(s => s.id));
      const allSubs = await base44.entities.Submission.list("-created_date", 200);
      const filtered = allSubs.filter(s => studentIds.has(s.student_id));
      setSubmissions(filtered);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getStudent = (id) => students.find(s => s.id === id);
  const getStudentName = (id) => getStudent(id)?.full_name || "Unknown";

  const handleReview = async (decision, reviewData) => {
    setReviewing(true);
    try {
      const { feedback, revision_instructions, rubric_scores, portfolio_ready } = reviewData;

      await base44.entities.Submission.update(selected.id, {
        status: decision,
        feedback,
        revision_instructions,
        reviewed_by: (await base44.auth.me()).email,
        reviewed_date: new Date().toISOString(),
        is_portfolio_item: decision === "Passed" && portfolio_ready,
        rubric_completeness: rubric_scores.completeness,
        rubric_relevance: rubric_scores.relevance,
        rubric_usability: rubric_scores.usability,
        rubric_clarity: rubric_scores.clarity,
        rubric_judgment: rubric_scores.judgment,
        rubric_ethics: rubric_scores.ethics,
        rubric_reflection: rubric_scores.reflection,
        revision_count: decision === "Needs Revision" ? (selected.revision_count || 0) + 1 : selected.revision_count,
      });

      // Reload student's submissions and update their status
      const studentSubs = await base44.entities.Submission.filter({ student_id: selected.student_id });
      const student = getStudent(selected.student_id);
      if (student) {
        const updates = computeStudentUpdates(student, studentSubs);
        if (Object.keys(updates).length > 0) {
          await base44.entities.Student.update(student.id, updates);
        }
      }

      toast({ title: `Submission marked as ${decision}` });
      setSelected(null);
      load();
    } catch (err) {
      toast({ title: "Review failed", description: err.message, variant: "destructive" });
    }
    setReviewing(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  const filteredSubs = filter === "all"
    ? submissions.filter(s => s.status !== "Not Started")
    : submissions.filter(s => s.status === filter && s.status !== "Not Started");

  const pendingCount = submissions.filter(s => s.status === "Submitted").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">Student Submissions</h1>
          {pendingCount > 0 && (
            <p className="text-xs text-yellow-400 mt-1">{pendingCount} submission{pendingCount > 1 ? "s" : ""} awaiting review</p>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
        {["all", "Submitted", "Needs Revision", "Passed", "Failed"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {filteredSubs.length === 0 ? (
        <EmptyState icon={FileText} title="No submissions to review" description="Student submissions will appear here once they submit their weekly outputs." />
      ) : (
        <div className="space-y-2">
          {filteredSubs.map(s => {
            const student = getStudent(s.student_id);
            return (
              <div
                key={s.id}
                className="rounded-xl border border-border/50 bg-card px-4 md:px-5 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => setSelected(s)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-mono font-bold">{String(s.week_number).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {getStudentName(s.student_id)} · Week {s.week_number} · {student?.track || ""}
                    </p>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <ReviewPanel
                submission={selected}
                studentName={getStudentName(selected.student_id)}
                studentTrack={getStudent(selected.student_id)?.track}
                lesson={getWeekLesson(selected.week_number, getStudent(selected.student_id)?.track)}
                onReview={handleReview}
                reviewing={reviewing}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}