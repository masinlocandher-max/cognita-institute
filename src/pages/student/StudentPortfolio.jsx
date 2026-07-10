import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertTriangle, FileText, ExternalLink, CheckCircle } from "lucide-react";
import EmptyState from "@/components/curriculum/EmptyState";
import PortfolioProgress from "@/components/curriculum/PortfolioProgress";
import { getCurriculumForTrack, getPortfolioByCategory } from "@/lib/curriculum-utils";

export default function StudentPortfolio() {
  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      const students = await base44.entities.Student.filter({ email: user.email });
      if (students.length > 0) {
        setStudent(students[0]);
        const subs = await base44.entities.Submission.filter({ student_id: students[0].id });
        setSubmissions(subs);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  if (!student) {
    return <EmptyState icon={AlertTriangle} title="Not enrolled yet" description="You haven't been enrolled as a student yet." />;
  }

  const curriculum = getCurriculumForTrack(student.track);
  const grouped = getPortfolioByCategory(submissions);
  const portfolioItems = Object.values(grouped).flat();
  const allPassed = submissions.filter(s => s.status === "Passed");

  // Find missing portfolio categories
  const missingCategories = curriculum
    .map(w => w.portfolioCategory)
    .filter((cat, i, arr) => arr.indexOf(cat) === i)
    .filter(cat => !grouped[cat] || grouped[cat].length === 0);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-heading font-bold mb-2">Portfolio</h1>
      <p className="text-sm text-muted-foreground mb-6">Outputs that have been reviewed and passed are added to your portfolio.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Portfolio progress */}
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <PortfolioProgress submissions={submissions} />
        </div>

        {/* Portfolio items list */}
        <div className="lg:col-span-2">
          {portfolioItems.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No portfolio items yet"
              description="Complete and pass weekly outputs to build your portfolio. Passed outputs that are marked portfolio-ready will appear here."
            />
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
                    <p className="text-sm font-semibold">{category}</p>
                    <span className="text-[11px] text-muted-foreground font-mono">{items.length} item{items.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {items.map(item => {
                      const weekData = curriculum.find(w => w.week === item.week_number);
                      return (
                        <div key={item.id} className="px-5 py-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">Week {item.week_number} · {weekData?.phase}</p>
                            </div>
                            <span className="inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                              Passed
                            </span>
                          </div>
                          {item.content && (
                            <p className="text-sm text-foreground/70 whitespace-pre-wrap line-clamp-3">{item.content}</p>
                          )}
                          {item.file_urls?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.file_urls.map((url, i) => (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                                >
                                  <ExternalLink size={10} />
                                  {url.split("/").pop()}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Missing items */}
      {missingCategories.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <p className="text-sm font-semibold mb-3">Missing Portfolio Categories</p>
          <div className="flex flex-wrap gap-2">
            {missingCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/30 bg-secondary/20 text-xs text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}