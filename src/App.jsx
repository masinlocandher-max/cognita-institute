import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public pages
import PublicLayout from '@/components/public/PublicLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Program from '@/pages/Program';
import Tracks from '@/pages/Tracks';
import Faq from '@/pages/Faq';
import Apply from '@/pages/Apply';
import Verify from '@/pages/Verify';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';
import Partner from '@/pages/Partner';
import Waitlist from '@/pages/Waitlist';
import Teach from '@/pages/Teach';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Dashboard wrappers
import AdminDashboardWrapper from '@/pages/AdminDashboardWrapper';
import FacilitatorDashboardWrapper from '@/pages/FacilitatorDashboardWrapper';
import StudentDashboardWrapper from '@/pages/StudentDashboardWrapper';

// Admin pages
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminBatches from '@/pages/admin/AdminBatches';
import AdminFacilitators from '@/pages/admin/AdminFacilitators';
import AdminSubmissions from '@/pages/admin/AdminSubmissions';
import AdminCertificates from '@/pages/admin/AdminCertificates';
import AdminTracks from '@/pages/admin/AdminTracks';
import AdminLessons from '@/pages/admin/AdminLessons';
import AdminPlayStore from '@/pages/admin/AdminPlayStore';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminQuizzes from '@/pages/admin/AdminQuizzes';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminTeacherApplications from '@/pages/admin/AdminTeacherApplications';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminInvoices from '@/pages/admin/AdminInvoices';
import AdminReceipts from '@/pages/admin/AdminReceipts';
import AdminRefunds from '@/pages/admin/AdminRefunds';
import AdminPartnerInquiries from '@/pages/admin/AdminPartnerInquiries';
import AdminLeads from '@/pages/admin/AdminLeads';
import AdminWaitlist from '@/pages/admin/AdminWaitlist';

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentProgram from '@/pages/student/StudentProgram';
import StudentLesson from '@/pages/student/StudentLesson';
import StudentPortfolio from '@/pages/student/StudentPortfolio';
import StudentCertificate from '@/pages/student/StudentCertificate';
import StudentPayments from '@/pages/student/StudentPayments';
import StudentAnnouncements from '@/pages/student/StudentAnnouncements';
import StudentMessages from '@/pages/student/StudentMessages';
import StudentQuiz from '@/pages/student/StudentQuiz';
import StudentEnrollmentAgreement from '@/pages/student/StudentEnrollmentAgreement';

// Facilitator pages
import FacilitatorOverview from '@/pages/facilitator/FacilitatorOverview';
import FacilitatorStudents from '@/pages/facilitator/FacilitatorStudents';
import FacilitatorSubmissions from '@/pages/facilitator/FacilitatorSubmissions';
import FacilitatorMessages from '@/pages/facilitator/FacilitatorMessages';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/program" element={<Program />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/teach" element={<Teach />} />
      </Route>

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected: Admin */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminDashboardWrapper />}>
          <Route path="/dashboard" element={<AdminOverview />} />
          <Route path="/dashboard/analytics" element={<AdminAnalytics />} />
          <Route path="/dashboard/applications" element={<AdminApplications />} />
          <Route path="/dashboard/teacher-applications" element={<AdminTeacherApplications />} />
          <Route path="/dashboard/students" element={<AdminStudents />} />
          <Route path="/dashboard/batches" element={<AdminBatches />} />
          <Route path="/dashboard/facilitators" element={<AdminFacilitators />} />
          <Route path="/dashboard/submissions" element={<AdminSubmissions />} />
          <Route path="/dashboard/certificates" element={<AdminCertificates />} />
          <Route path="/dashboard/tracks" element={<AdminTracks />} />
          <Route path="/dashboard/lessons" element={<AdminLessons />} />
          <Route path="/dashboard/quizzes" element={<AdminQuizzes />} />
          <Route path="/dashboard/announcements" element={<AdminAnnouncements />} />
          <Route path="/dashboard/messages" element={<AdminMessages />} />
          <Route path="/dashboard/playstore" element={<AdminPlayStore />} />
          <Route path="/dashboard/payments" element={<AdminPayments />} />
          <Route path="/dashboard/invoices" element={<AdminInvoices />} />
          <Route path="/dashboard/receipts" element={<AdminReceipts />} />
          <Route path="/dashboard/refunds" element={<AdminRefunds />} />
          <Route path="/dashboard/partners" element={<AdminPartnerInquiries />} />
          <Route path="/dashboard/leads" element={<AdminLeads />} />
          <Route path="/dashboard/waitlist" element={<AdminWaitlist />} />
        </Route>

        {/* Protected: Facilitator */}
        <Route element={<FacilitatorDashboardWrapper />}>
          <Route path="/facilitator" element={<FacilitatorOverview />} />
          <Route path="/facilitator/students" element={<FacilitatorStudents />} />
          <Route path="/facilitator/submissions" element={<FacilitatorSubmissions />} />
          <Route path="/facilitator/messages" element={<FacilitatorMessages />} />
        </Route>

        {/* Protected: Student */}
        <Route element={<StudentDashboardWrapper />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/program" element={<StudentProgram />} />
          <Route path="/student/lesson/:week" element={<StudentLesson />} />
          <Route path="/student/portfolio" element={<StudentPortfolio />} />
          <Route path="/student/certificate" element={<StudentCertificate />} />
          <Route path="/student/payments" element={<StudentPayments />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
          <Route path="/student/messages" element={<StudentMessages />} />
          <Route path="/student/quiz/:week" element={<StudentQuiz />} />
          <Route path="/student/enrollment-agreement" element={<StudentEnrollmentAgreement />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App