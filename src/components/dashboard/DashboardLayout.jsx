import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, Users, BookOpen, FileText, Award,
  ClipboardList, Settings, LogOut, Menu, X, ChevronDown,
  GraduationCap, UserCheck, DollarSign, BarChart3, Layers, BookMarked, ExternalLink, Smartphone,
  Receipt, RefreshCcw, Handshake, UserPlus, Clock, CreditCard,
  Megaphone, HelpCircle, MessageSquare, BarChart
} from "lucide-react";

const ADMIN_LINKS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart },
  { label: "Applications", path: "/dashboard/applications", icon: ClipboardList },
  { label: "Teacher Apps", path: "/dashboard/teacher-applications", icon: GraduationCap },
  { label: "Students", path: "/dashboard/students", icon: Users },
  { label: "Batches", path: "/dashboard/batches", icon: GraduationCap },
  { label: "Tracks", path: "/dashboard/tracks", icon: Layers },
  { label: "Lessons", path: "/dashboard/lessons", icon: BookMarked },
  { label: "Quizzes", path: "/dashboard/quizzes", icon: HelpCircle },
  { label: "Facilitators", path: "/dashboard/facilitators", icon: UserCheck },
  { label: "Submissions", path: "/dashboard/submissions", icon: FileText },
  { label: "Certificates", path: "/dashboard/certificates", icon: Award },
  { label: "Announcements", path: "/dashboard/announcements", icon: Megaphone },
  { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
  { label: "Payments", path: "/dashboard/payments", icon: DollarSign },
  { label: "Invoices", path: "/dashboard/invoices", icon: FileText },
  { label: "Receipts", path: "/dashboard/receipts", icon: Receipt },
  { label: "Refunds", path: "/dashboard/refunds", icon: RefreshCcw },
  { label: "Partners", path: "/dashboard/partners", icon: Handshake },
  { label: "Leads", path: "/dashboard/leads", icon: UserPlus },
  { label: "Waitlist", path: "/dashboard/waitlist", icon: Clock },
  { label: "Play Store", path: "/dashboard/playstore", icon: Smartphone },
];

const FACILITATOR_LINKS = [
  { label: "Overview", path: "/facilitator", icon: LayoutDashboard },
  { label: "Students", path: "/facilitator/students", icon: Users },
  { label: "Submissions", path: "/facilitator/submissions", icon: FileText },
  { label: "Messages", path: "/facilitator/messages", icon: MessageSquare },
];

const STUDENT_LINKS = [
  { label: "Dashboard", path: "/student", icon: LayoutDashboard },
  { label: "Program", path: "/student/program", icon: BookOpen },
  { label: "Portfolio", path: "/student/portfolio", icon: FileText },
  { label: "Certificate", path: "/student/certificate", icon: Award },
  { label: "Announcements", path: "/student/announcements", icon: Megaphone },
  { label: "Messages", path: "/student/messages", icon: MessageSquare },
  { label: "Payments", path: "/student/payments", icon: CreditCard },
];

export default function DashboardLayout({ role, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const links = role === "admin" ? ADMIN_LINKS : role === "facilitator" ? FACILITATOR_LINKS : STUDENT_LINKS;

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border/50 transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="font-heading font-bold text-sm">Cognita</span>
            </Link>
            <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="px-3 py-2">
            <div className="px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {role === "admin" ? "Admin Panel" : role === "facilitator" ? "Facilitator" : "Student"}
              </p>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {links.map(l => {
              const active = location.pathname === l.path;
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <l.icon size={16} />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border/50">
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-72">
        <header className="h-14 border-b border-border/50 flex items-center px-4 md:px-8 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
          <button className="md:hidden mr-4 text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <ExternalLink size={12} /> Back to Website
          </Link>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}