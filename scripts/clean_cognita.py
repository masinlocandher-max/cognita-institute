#!/usr/bin/env python3
"""Apply the verified first-pass cleanup to the extracted Cognita app."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

ROUTES = [
    ("PublicLayout", "@/components/public/PublicLayout"),
    ("Home", "@/pages/Home"), ("About", "@/pages/About"),
    ("Program", "@/pages/Program"), ("Tracks", "@/pages/Tracks"),
    ("Faq", "@/pages/Faq"), ("Apply", "@/pages/Apply"),
    ("Verify", "@/pages/Verify"), ("Privacy", "@/pages/Privacy"),
    ("Terms", "@/pages/Terms"), ("Contact", "@/pages/Contact"),
    ("Partner", "@/pages/Partner"), ("Waitlist", "@/pages/Waitlist"),
    ("Teach", "@/pages/Teach"), ("Login", "@/pages/Login"),
    ("Register", "@/pages/Register"),
    ("ForgotPassword", "@/pages/ForgotPassword"),
    ("ResetPassword", "@/pages/ResetPassword"),
    ("AdminDashboardWrapper", "@/pages/AdminDashboardWrapper"),
    ("FacilitatorDashboardWrapper", "@/pages/FacilitatorDashboardWrapper"),
    ("StudentDashboardWrapper", "@/pages/StudentDashboardWrapper"),
    ("AdminOverview", "@/pages/admin/AdminOverview"),
    ("AdminApplications", "@/pages/admin/AdminApplications"),
    ("AdminStudents", "@/pages/admin/AdminStudents"),
    ("AdminBatches", "@/pages/admin/AdminBatches"),
    ("AdminFacilitators", "@/pages/admin/AdminFacilitators"),
    ("AdminSubmissions", "@/pages/admin/AdminSubmissions"),
    ("AdminCertificates", "@/pages/admin/AdminCertificates"),
    ("AdminTracks", "@/pages/admin/AdminTracks"),
    ("AdminLessons", "@/pages/admin/AdminLessons"),
    ("AdminPlayStore", "@/pages/admin/AdminPlayStore"),
    ("AdminAnnouncements", "@/pages/admin/AdminAnnouncements"),
    ("AdminQuizzes", "@/pages/admin/AdminQuizzes"),
    ("AdminMessages", "@/pages/admin/AdminMessages"),
    ("AdminTeacherApplications", "@/pages/admin/AdminTeacherApplications"),
    ("AdminAnalytics", "@/pages/admin/AdminAnalytics"),
    ("AdminPayments", "@/pages/admin/AdminPayments"),
    ("AdminInvoices", "@/pages/admin/AdminInvoices"),
    ("AdminReceipts", "@/pages/admin/AdminReceipts"),
    ("AdminRefunds", "@/pages/admin/AdminRefunds"),
    ("AdminPartnerInquiries", "@/pages/admin/AdminPartnerInquiries"),
    ("AdminLeads", "@/pages/admin/AdminLeads"),
    ("AdminWaitlist", "@/pages/admin/AdminWaitlist"),
    ("StudentDashboard", "@/pages/student/StudentDashboard"),
    ("StudentProgram", "@/pages/student/StudentProgram"),
    ("StudentLesson", "@/pages/student/StudentLesson"),
    ("StudentPortfolio", "@/pages/student/StudentPortfolio"),
    ("StudentCertificate", "@/pages/student/StudentCertificate"),
    ("StudentPayments", "@/pages/student/StudentPayments"),
    ("StudentAnnouncements", "@/pages/student/StudentAnnouncements"),
    ("StudentMessages", "@/pages/student/StudentMessages"),
    ("StudentQuiz", "@/pages/student/StudentQuiz"),
    ("StudentEnrollmentAgreement", "@/pages/student/StudentEnrollmentAgreement"),
    ("FacilitatorOverview", "@/pages/facilitator/FacilitatorOverview"),
    ("FacilitatorStudents", "@/pages/facilitator/FacilitatorStudents"),
    ("FacilitatorSubmissions", "@/pages/facilitator/FacilitatorSubmissions"),
    ("FacilitatorMessages", "@/pages/facilitator/FacilitatorMessages"),
]


def clean_package() -> None:
    path = ROOT / "package.json"
    data = json.loads(path.read_text())
    data.get("dependencies", {}).pop("react-quill", None)
    path.write_text(json.dumps(data, indent=2) + "\n")


def clean_css() -> None:
    path = ROOT / "src/index.css"
    text = path.read_text()
    font_import = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');"
    text = text.replace(font_import + "\n", "").lstrip("\n")
    path.write_text(font_import + "\n\n" + text)


def write_typecheck_config() -> None:
    config = {
        "compilerOptions": {
            "baseUrl": ".", "paths": {"@/*": ["./src/*"]},
            "jsx": "react-jsx", "module": "esnext",
            "moduleResolution": "bundler", "lib": ["esnext", "dom"],
            "target": "esnext", "checkJs": False, "skipLibCheck": True,
            "allowSyntheticDefaultImports": True, "esModuleInterop": True,
            "resolveJsonModule": True, "types": [], "allowJs": True,
            "noEmit": True,
        },
        "include": ["src/**/*"],
        "exclude": ["node_modules", "dist", "src/vite-plugins"],
    }
    (ROOT / "jsconfig.json").write_text(json.dumps(config, indent=2) + "\n")


def split_routes() -> None:
    path = ROOT / "src/App.jsx"
    text = path.read_text()
    if "Route-level code splitting" in text:
        return

    text = "import { lazy, Suspense } from 'react';\n" + text
    start = text.index("// Public pages")
    end = text.index("const AuthenticatedApp")
    lazy_lines = [
        "// Route-level code splitting keeps the landing page light and loads",
        "// dashboards and role-specific tools only when they are opened.",
    ]
    lazy_lines.extend(
        f"const {name} = lazy(() => import('{module}'));" for name, module in ROUTES
    )
    lazy_lines.extend([
        "",
        "const RouteLoadingFallback = () => (",
        "  <div className=\"fixed inset-0 flex items-center justify-center bg-background\" role=\"status\" aria-live=\"polite\">",
        "    <div className=\"w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin\" />",
        "    <span className=\"sr-only\">Loading page</span>",
        "  </div>",
        ");",
        "",
    ])
    text = text[:start] + "\n".join(lazy_lines) + "\n" + text[end:]
    text = text.replace(
        "const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();",
        "const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();",
    )
    text = text.replace("  return (\n    <Routes>", "  return (\n    <Suspense fallback={<RouteLoadingFallback />}>\n      <Routes>")
    text = text.replace(
        '      <Route path="*" element={<PageNotFound />} />\n    </Routes>\n  );',
        '      <Route path="*" element={<PageNotFound />} />\n      </Routes>\n    </Suspense>\n  );',
    )
    path.write_text(text)


def main() -> None:
    clean_package()
    clean_css()
    write_typecheck_config()
    split_routes()
    print("Applied Cognita cleanup.")


if __name__ == "__main__":
    main()
