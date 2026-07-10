import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import EmptyState from "@/components/curriculum/EmptyState";
import { getCurriculumForTrack } from "@/lib/curriculum-utils";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Library,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function StudentLibrary() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Resources");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const user = await base44.auth.me();
        const students = await base44.entities.Student.filter({ email: user.email });
        setStudent(students[0] || null);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  const curriculum = useMemo(
    () => (student ? getCurriculumForTrack(student.track) : []),
    [student]
  );

  const programResources = useMemo(
    () => curriculum.map((week) => ({
      id: `week-${week.week}`,
      title: week.title,
      category: week.phase,
      description: week.learningObjective,
      meta: `Week ${week.week} · ${week.requiredOutput}`,
      path: `/student/lesson/${week.week}`,
    })),
    [curriculum]
  );

  const institutionalResources = [
    {
      id: "academic-policy",
      title: "Academic and Assessment Standards",
      category: "Institutional Guide",
      description: "Review Cognita's output-based learning, facilitator review, revision, and certificate requirements.",
      meta: "Program policy",
      path: "/program",
    },
    {
      id: "privacy",
      title: "Student Privacy Notice",
      category: "Institutional Guide",
      description: "Understand how personal information and learner records are handled within Cognita.",
      meta: "Privacy and records",
      path: "/privacy",
    },
    {
      id: "terms",
      title: "Learner Terms and Conditions",
      category: "Institutional Guide",
      description: "Read the rules governing enrollment, acceptable use, learning activities, and platform access.",
      meta: "Learner responsibilities",
      path: "/terms",
    },
  ];

  const allResources = [...programResources, ...institutionalResources];
  const categories = ["All Resources", ...new Set(allResources.map((resource) => resource.category))];
  const filteredResources = allResources.filter((resource) => {
    const matchesCategory = category === "All Resources" || resource.category === category;
    const searchText = `${resource.title} ${resource.description} ${resource.meta}`.toLowerCase();
    return matchesCategory && searchText.includes(query.trim().toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (!student) {
    return (
      <EmptyState
        icon={Library}
        title="Library access is not active yet"
        description="The Learning Resource Center becomes available after your student enrollment record is created."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-400/70">Academic Support</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-heading font-bold">Learning Resource Center</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Access your program guides, lesson references, institutional policies, and verified learning materials.
        </p>
      </div>

      <section className="corporate-panel rounded-xl p-5 md:p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor="library-search" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Search the resource center
            </label>
            <div className="relative mt-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="library-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by topic, lesson, or output"
                className="h-11 w-full rounded-lg border border-border bg-background/70 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="library-category" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Collection
            </label>
            <select
              id="library-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 h-11 min-w-56 rounded-lg border border-border bg-background/70 px-3 text-sm outline-none transition focus:border-sky-400/50"
            >
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Resource Catalogue</h2>
            <span className="text-xs text-muted-foreground">{filteredResources.length} item{filteredResources.length === 1 ? "" : "s"}</span>
          </div>

          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={resource.path}
                className="corporate-panel group flex items-start gap-4 rounded-xl p-5 transition hover:border-sky-400/30"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-sky-400/15 bg-sky-400/7">
                  {resource.category === "Institutional Guide"
                    ? <ShieldCheck size={18} className="text-sky-300" />
                    : <BookOpen size={18} className="text-sky-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-sky-200">{resource.title}</h3>
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-sky-400/65">{resource.category}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{resource.meta}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-sky-300">
                      Open resource <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {filteredResources.length === 0 && (
              <div className="corporate-panel rounded-xl p-10 text-center">
                <FileText size={24} className="mx-auto text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">No matching resources</p>
                <p className="mt-1 text-xs text-muted-foreground">Try a different search term or collection.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="corporate-panel rounded-xl p-5">
            <div className="flex items-center gap-2">
              <Library size={16} className="text-sky-300" />
              <h2 className="text-sm font-semibold">Library Access</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Enrolled learner</p>
                <p className="mt-1 font-medium">{student.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Program track</p>
                <p className="mt-1 font-medium">{student.track}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current access</p>
                <p className="mt-1 font-medium">Week {student.current_week || 1} resources</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-5">
            <h2 className="text-sm font-semibold text-amber-200">Resource Use Policy</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Materials are for enrolled learners and must be used responsibly. Do not redistribute restricted resources or present AI-generated work as independently verified research.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
