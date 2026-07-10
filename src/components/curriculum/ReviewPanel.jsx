import React, { useState, useEffect } from "react";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import RubricScorer from "@/components/curriculum/RubricScorer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getRubricRecommendation } from "@/lib/curriculum-utils";

const EMPTY_SCORES = {
  completeness: null,
  relevance: null,
  usability: null,
  clarity: null,
  judgment: null,
  ethics: null,
  reflection: null,
};

export default function ReviewPanel({ submission, studentName, studentTrack, lesson, onReview, reviewing }) {
  const [feedback, setFeedback] = useState("");
  const [revisionInstructions, setRevisionInstructions] = useState("");
  const [rubricScores, setRubricScores] = useState(EMPTY_SCORES);
  const [portfolioReady, setPortfolioReady] = useState(false);

  useEffect(() => {
    if (submission) {
      setFeedback(submission.feedback || "");
      setRevisionInstructions(submission.revision_instructions || "");
      setPortfolioReady(submission.is_portfolio_item || false);
      setRubricScores({
        completeness: submission.rubric_completeness ?? null,
        relevance: submission.rubric_relevance ?? null,
        usability: submission.rubric_usability ?? null,
        clarity: submission.rubric_clarity ?? null,
        judgment: submission.rubric_judgment ?? null,
        ethics: submission.rubric_ethics ?? null,
        reflection: submission.rubric_reflection ?? null,
      });
    }
  }, [submission]);

  const handleReview = (decision) => {
    onReview(decision, {
      feedback: feedback.trim(),
      revision_instructions: revisionInstructions.trim(),
      rubric_scores: rubricScores,
      portfolio_ready: portfolioReady,
    });
  };

  if (!submission) return null;

  return (
    <div className="space-y-5">
      {/* Student info */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Student</p>
          <p className="text-sm font-medium">{studentName}</p>
          <p className="text-xs text-muted-foreground">{studentTrack}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Week</p>
          <p className="text-sm font-medium">Week {submission.week_number}</p>
          <p className="text-xs text-muted-foreground">{submission.title}</p>
        </div>
      </div>

      {/* Submission content */}
      {submission.content && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Submission</p>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-sm text-foreground/80 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {submission.content}
          </div>
        </div>
      )}

      {/* Process note */}
      {submission.process_note && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Process Note</p>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-sm text-foreground/70 whitespace-pre-wrap">
            {submission.process_note}
          </div>
        </div>
      )}

      {/* Reflection */}
      {submission.reflection && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Reflection</p>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-sm text-foreground/70 whitespace-pre-wrap">
            {submission.reflection}
          </div>
        </div>
      )}

      {/* Files */}
      {submission.file_urls?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Files</p>
          <div className="space-y-1">
            {submission.file_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline block truncate">
                {url.split("/").pop()}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Rubric from curriculum */}
      {lesson && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-2">Rubric</p>
          <div className="space-y-1.5 text-xs">
            <p className="text-foreground/80"><span className="font-semibold text-emerald-400">Pass:</span> {lesson.rubric.pass}</p>
            <p className="text-foreground/80"><span className="font-semibold text-orange-400">Revise:</span> {lesson.rubric.needsRevision}</p>
            <p className="text-foreground/80"><span className="font-semibold text-red-400">Fail:</span> {lesson.rubric.failed}</p>
          </div>
        </div>
      )}

      {/* Rubric scorer */}
      <RubricScorer scores={rubricScores} onChange={setRubricScores} />

      {/* Feedback */}
      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Feedback
        </Label>
        <Textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={3}
          className="bg-secondary border-border text-sm"
          placeholder="Write general feedback for the student..."
        />
      </div>

      {/* Revision instructions */}
      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
          Revision Instructions
        </Label>
        <Textarea
          value={revisionInstructions}
          onChange={e => setRevisionInstructions(e.target.value)}
          rows={3}
          className="bg-secondary border-border text-sm"
          placeholder="Specific instructions on what to revise..."
        />
      </div>

      {/* Portfolio toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <button
          type="button"
          onClick={() => setPortfolioReady(!portfolioReady)}
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            portfolioReady
              ? "bg-emerald-500/20 border-emerald-500/40"
              : "bg-secondary border-border/50"
          }`}
        >
          {portfolioReady && <CheckCircle size={14} className="text-emerald-400" />}
        </button>
        <span className="text-sm">Mark as portfolio-ready</span>
      </label>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          size="sm"
          onClick={() => handleReview("Passed")}
          disabled={reviewing}
          className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
        >
          {reviewing ? <Loader2 size={14} className="animate-spin" /> : "Pass"}
        </Button>
        <Button
          size="sm"
          onClick={() => handleReview("Needs Revision")}
          disabled={reviewing}
          className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/20"
        >
          Request Revision
        </Button>
        <Button
          size="sm"
          onClick={() => handleReview("Failed")}
          disabled={reviewing}
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
        >
          Fail
        </Button>
      </div>
    </div>
  );
}