import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { email_type, entity_id, entity_data } = body;

    const svc = base44.asServiceRole;
    let to = '';
    let subject = '';
    let emailBody = '';

    if (email_type === 'application_submitted') {
      const app = entity_data;
      to = app.email;
      subject = 'Application Received — Cognita Institute';
      emailBody = `Dear ${app.full_name},\n\nThank you for applying to Cognita Institute. We have received your application for the ${app.preferred_track} track.\n\nOur admissions team will review your application and respond within 5-7 business days. Admission is selective and based on human review of your responses.\n\nYou can check your application status by signing in at cognita.app.\n\n— Cognita Institute Admissions`;
    }

    else if (email_type === 'application_accepted') {
      const app = entity_data;
      to = app.email;
      subject = 'Welcome to Cognita Institute — Application Accepted';
      emailBody = `Dear ${app.full_name},\n\nCongratulations! Your application to Cognita Institute has been accepted for the ${app.preferred_track} track.\n\nNext steps:\n1. Sign in to your student dashboard at cognita.app\n2. Review and sign your enrollment agreement\n3. Submit your tuition payment\n4. Access your Week 1 curriculum\n\nYour batch and facilitator will be assigned shortly. We look forward to your journey.\n\n— Cognita Institute`;
    }

    else if (email_type === 'application_waitlisted') {
      const app = entity_data;
      to = app.email;
      subject = 'Cognita Institute — Waitlist Update';
      emailBody = `Dear ${app.full_name},\n\nThank you for your interest in Cognita Institute. Your application has been placed on our waitlist for the ${app.preferred_track} track.\n\nWe will notify you if a seat becomes available in the current or upcoming batch. In the meantime, your application remains active.\n\n— Cognita Institute Admissions`;
    }

    else if (email_type === 'application_rejected') {
      const app = entity_data;
      to = app.email;
      subject = 'Cognita Institute — Application Update';
      emailBody = `Dear ${app.full_name},\n\nThank you for your interest in Cognita Institute. After careful review, we are unable to offer you a seat at this time.\n\nThis decision is not a reflection of your potential — our cohorts are small and selective. We encourage you to apply again for a future batch.\n\n— Cognita Institute Admissions`;
    }

    else if (email_type === 'application_status_changed') {
      const app = entity_data;
      const status = app.status;
      if (status === 'Accepted') {
        to = app.email;
        subject = 'Welcome to Cognita Institute — Application Accepted';
        emailBody = `Dear ${app.full_name},\n\nCongratulations! Your application to Cognita Institute has been accepted for the ${app.preferred_track} track.\n\nNext steps:\n1. Sign in to your student dashboard at cognita.app\n2. Review and sign your enrollment agreement\n3. Submit your tuition payment\n4. Access your Week 1 curriculum\n\nYour batch and facilitator will be assigned shortly. We look forward to your journey.\n\n— Cognita Institute`;
      } else if (status === 'Waitlisted') {
        to = app.email;
        subject = 'Cognita Institute — Waitlist Update';
        emailBody = `Dear ${app.full_name},\n\nThank you for your interest in Cognita Institute. Your application has been placed on our waitlist for the ${app.preferred_track} track.\n\nWe will notify you if a seat becomes available in the current or upcoming batch. In the meantime, your application remains active.\n\n— Cognita Institute Admissions`;
      } else if (status === 'Rejected') {
        to = app.email;
        subject = 'Cognita Institute — Application Update';
        emailBody = `Dear ${app.full_name},\n\nThank you for your interest in Cognita Institute. After careful review, we are unable to offer you a seat at this time.\n\nThis decision is not a reflection of your potential — our cohorts are small and selective. We encourage you to apply again for a future batch.\n\n— Cognita Institute Admissions`;
      } else if (status === 'Enrolled') {
        to = app.email;
        subject = 'You Are Enrolled — Cognita Institute';
        emailBody = `Dear ${app.full_name},\n\nYou have been officially enrolled in Cognita Institute. Welcome to the program!\n\nPlease complete your enrollment agreement and payment in your student dashboard to unlock your curriculum.\n\n— Cognita Institute`;
      } else {
        return Response.json({ skipped: true, reason: `status ${status} does not trigger email` });
      }
    }

    else if (email_type === 'submission_reviewed') {
      const sub = entity_data;
      const student = await svc.entities.Student.get(sub.student_id).catch(() => null);
      if (!student) return Response.json({ skipped: true, reason: 'student not found' });
      to = student.email;
      const statusLabel = sub.status === 'Passed' ? 'PASSED' : sub.status === 'Needs Revision' ? 'NEEDS REVISION' : 'FAILED';
      subject = `Week ${sub.week_number} Submission — ${statusLabel}`;
      const feedbackSection = sub.feedback ? `\n\nFacilitator Feedback:\n${sub.feedback}` : '';
      const revisionSection = sub.status === 'Needs Revision' && sub.revision_instructions ? `\n\nRevision Instructions:\n${sub.revision_instructions}` : '';
      emailBody = `Dear ${student.full_name},\n\nYour submission for Week ${sub.week_number} (${sub.title}) has been reviewed.\n\nStatus: ${statusLabel}${feedbackSection}${revisionSection}\n\nYou can view full details in your student dashboard at cognita.app.\n\n— Cognita Institute`;
    }

    else if (email_type === 'certificate_issued') {
      const cert = entity_data;
      const student = await svc.entities.Student.get(cert.student_id).catch(() => null);
      to = student ? student.email : '';
      if (!to) return Response.json({ skipped: true, reason: 'student email not found' });
      subject = 'Your Cognita Certificate Has Been Issued';
      emailBody = `Dear ${cert.student_name},\n\nCongratulations! Your Certificate of Practical AI Competency has been issued.\n\nCertificate Serial: ${cert.serial_number}\nTrack: ${cert.track}\nBatch: ${cert.batch_name}\n\nYour certificate can be publicly verified at cognita.app/verify using your serial number.\n\nThis certificate was issued based on completed and reviewed outputs, not attendance.\n\n— Cognita Institute`;
    }

    else if (email_type === 'payment_confirmed') {
      const pay = entity_data;
      to = pay.student_email;
      subject = 'Payment Confirmed — Cognita Institute';
      emailBody = `Dear ${pay.student_name},\n\nYour tuition payment has been confirmed.\n\nBatch: ${pay.batch_name}\nTrack: ${pay.track}\nAmount Paid: ${pay.amount_paid}\n\nYou now have full access to your curriculum. Welcome to the program.\n\n— Cognita Institute`;
    }

    else if (email_type === 'announcement_published') {
      const ann = entity_data;
      let students = [];
      if (ann.audience === 'All Students') {
        students = await svc.entities.Student.filter({ progress_status: { $ne: 'Removed' } }, '-created_date', 500);
      } else if (ann.audience === 'Specific Track' && ann.track) {
        students = await svc.entities.Student.filter({ track: ann.track, progress_status: { $ne: 'Removed' } }, '-created_date', 500);
      } else if (ann.audience === 'Specific Batch' && ann.batch_id) {
        students = await svc.entities.Student.filter({ batch_id: ann.batch_id, progress_status: { $ne: 'Removed' } }, '-created_date', 500);
      } else if (ann.audience === 'Facilitators') {
        students = await svc.entities.Facilitator.filter({ status: 'Active' }, '-created_date', 100);
      }
      const priorityLabel = ann.priority === 'Urgent' ? '[URGENT] ' : ann.priority === 'Important' ? '[Important] ' : '';
      const results = [];
      for (const s of students) {
        if (!s.email) continue;
        try {
          await svc.integrations.Core.SendEmail({
            to: s.email,
            subject: `${priorityLabel}${ann.title}`,
            body: `${ann.body}\n\n— Cognita Institute`,
          });
          results.push(s.email);
        } catch (e) { /* skip failed sends */ }
      }
      return Response.json({ sent_to: results.length, emails: results });
    }

    else if (email_type === 'teacher_app_submitted') {
      const ta = entity_data;
      to = ta.email;
      subject = 'Application Received — Cognita Educator Program';
      emailBody = `Dear ${ta.full_name},\n\nThank you for your interest in becoming a Cognita facilitator. We have received your application.\n\nOur team will review your qualifications and reach out within 7-10 business days regarding next steps, which may include an interview.\n\n— Cognita Institute`;
    }

    else {
      return Response.json({ error: `Unknown email_type: ${email_type}` }, { status: 400 });
    }

    if (!to) return Response.json({ skipped: true, reason: 'no recipient email' });

    try {
      await svc.integrations.Core.SendEmail({ to, subject, body: emailBody });
      return Response.json({ sent: true, to, email_type });
    } catch (sendErr) {
      return Response.json({ sent: false, to, email_type, reason: sendErr.message });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});