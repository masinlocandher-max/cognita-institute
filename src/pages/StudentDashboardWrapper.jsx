import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function StudentDashboardWrapper() {
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      try {
        const u = await base44.auth.me();
        const students = await base44.entities.Student.filter({ email: u.email }).catch(() => []);
        if (students.length > 0) {
          // Check enrollment agreement — redirect if not signed (unless already on the agreement page)
          if (!students[0].enrollment_agreement_signed && location.pathname !== "/student/enrollment-agreement") {
            setRedirect("/student/enrollment-agreement");
            setLoading(false);
            return;
          }
          setUser(u);
          setLoading(false);
        } else {
          setRedirect("/apply");
          setLoading(false);
        }
      } catch {
        setRedirect("/login"); setLoading(false);
      }
    };
    check();
  }, []);

  if (loading) return <div className="fixed inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;
  if (redirect) return <Navigate to={redirect} replace />;

  return <DashboardLayout role="student" user={user} />;
}