import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Lock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import LessonDetail from "@/components/curriculum/LessonDetail";
import SubmissionForm from "@/components/curriculum/SubmissionForm";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { getWeekLesson, isWeekUnlocked, getWeekStatus, mergeLessonOverride } from "@/lib/curriculum-utils";
import { useToast } from "@/components/ui/use-toast";

export default function StudentLesson() {
  const { week } = useParams();
  const weekNum = parseInt(week);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [lessonOverride, setLessonOverride] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const user = await base44.auth.me();
    const students = await base44.entities.Student.filter({ email: user.email });
    if (students.length > 0) {
      setStudent(students[0]);
      const [subs, lessons] = await Promise.all([
        base44.entities.Submission.filter({ student_id: students[0].id }),
        base44.entities.Lesson.filter({ week_number: weekNum }),
      ]);
      setSubmissions(subs);
      // Find override: track-specific first, then foundation
      const trackMatch = lessons.find(l => l.track === students[0].track);
      const foundationMatch = lessons.find(l => !l.track);
      setLessonOverride(trackMatch || foundationMatch || null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [weekNum]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  if (!student) return <div className="text-center py-20 text-muted-foreground">Not enrolled yet.</div>;

  const staticLesson = getWeekLesson(weekNum, student.track);
  if (!staticLesson) {
    return <div className="text-center py-20 text-muted-foreground">Lesson not found.</div>;
  }

  const lesson = mergeLessonOverride(staticLesson, lessonOverride);
  const unlocked = isWeekUnlocked(weekNum, submissions) && !lesson.isLocked;
  const status = getWeekStatus(weekNum, submissions);
  const submission = submissions.find(s => s.week_number === weekNum);
  const isPassed = status === "Passed";
  const needsRevision = status === "Needs Revision";
  const canSubmit = unlocked && !isPassed;

  const handleSubmit = async ({ content, process_note, reflection, files }) => {
    setSubmitting(true);
    try {
      const fileUrls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        fileUrls.push(file_url);
      }

      if (submission) {
        await base44.entities.Submission.update(submission.id, {
          content,
          process_note,
          reflection,
          file_urls: fileUrls.length > 0 ? fileUrls : submission.file_urls,
          status: "Submitted",
          revision_count: needsRevision ? (submission.revision_count || 0) + 1 : submission.revision_count,
        });
      } else {
        await base44.entities.Submission.create({
          student_id: student.id,
          week_number: weekNum,
          title: lesson.requiredOutput,
          track: student.track,
          content,
          process_note,
          reflection,
          file_urls: fileUrls,
          status: "Submitted",
          portfolio_category: lesson.portfolioCategory,
        });
      }

      toast({ title: `Week ${weekNum} output submitted` });
      await load();
    } catch (err) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div>
      {/* Back link */}
      <Link to="/student/program" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft size={14} /> Back to Program
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-border/50 bg-secondary/30 text-muted-foreground">
              {lesson.phase}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Week {weekNum}</span>
            <StatusBadge status={status} />
          </div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">{lesson.title}</h1>
        </div>
      </div>

      {/* Locked message */}
      {!unlocked && (
        <div className="rounded-xl border border-border/50 bg-card p-8 text-center mb-6">
          <Lock size={32} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-heading font-bold mb-2">This Week is Locked</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {lesson.isLocked
              ? "This lesson has been locked by the academy. Please contact your facilitator."
              : "Complete and submit the previous week's output to unlock Week " + weekNum + "."}
          </p>
          <Button
            onClick={() => navigate("/student/program")}
            className="mt-4 bg-cyan-500 text-black hover:bg-cyan-400"
          >
            Back to Program
          </Button>
        </div>
      )}

      {/* Passed banner */}
      {isPassed && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-400" />
            <p className="text-sm font-medium text-emerald-400">This output has been reviewed and passed.</p>
          </div>
          {submission?.is_portfolio_item && (
            <p className="text-xs text-muted-foreground mt-1 ml-7">Added to your portfolio as {lesson.portfolioCategory}.</p>
          )}
        </div>
      )}

      {/* Lesson content */}
      {unlocked && (
        <>
          <div className="rounded-xl border border-border/50 bg-card p-5 md:p-6 mb-6">
            <LessonDetail lesson={lesson} />
          </div>

          {/* Feedback from facilitator */}
          {submission?.feedback && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-cyan-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">Facilitator Feedback</p>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{submission.feedback}</p>
            </div>
          )}

          {/* Revision instructions */}
          {submission?.revision_instructions && (
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-orange-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">Revision Instructions</p>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{submission.revision_instructions}</p>
            </div>
          )}

          {/* Submission form */}
          {canSubmit && (
            <div className="rounded-xl border border-border/50 bg-card p-5 md:p-6">
              <h2 className="text-sm font-semibold mb-4">
                {needsRevision ? "Resubmit Output" : "Submit Your Output"}
              </h2>
              {needsRevision && (
                <p className="text-xs text-orange-400 mb-4">
                  Your previous submission needs revision. Update your work and resubmit.
                </p>
              )}
              <SubmissionForm
                existing={submission}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}