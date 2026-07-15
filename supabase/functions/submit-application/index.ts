import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, isAllowedOrigin, jsonResponse } from "../_shared/cors.ts";

type ApplicationPayload = {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  program_slug?: string;
  track_slug?: string;
  preferred_track?: string;
  occupation?: string;
  ai_skill_level?: number;
  tech_skill_level?: number;
  available_hours?: number;
  why_apply?: string;
  production_goals?: string;
  accepts_terms?: boolean;
  accepts_privacy?: boolean;
  terms_version?: string;
  privacy_version?: string;
  source_page?: string;
  turnstile_token?: string;
};

const MAX_REQUEST_BYTES = 50_000;
const ADMISSIONS_EMAIL = Deno.env.get("COGNITA_ADMISSIONS_EMAIL") || "cognitainstituteofai@gmail.com";

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\u0000/g, "").slice(0, maxLength);
}

function normalizeEmail(value: unknown): string {
  return cleanText(value, 320).toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function numberInRange(value: unknown, minimum: number, maximum: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const integer = Math.round(value);
  return integer >= minimum && integer <= maximum ? integer : null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return true;
  if (!token) return false;

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });

  if (!response.ok) return false;
  const result = await response.json();
  return result?.success === true;
}

async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; providerMessageId?: string; error?: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("COGNITA_FROM_EMAIL");

  if (!apiKey || !from) {
    return { sent: false, error: "EMAIL_PROVIDER_NOT_CONFIGURED" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [input.to], subject: input.subject, html: input.html }),
    });

    const result = await response.json();
    if (!response.ok) {
      return { sent: false, error: result?.message || `EMAIL_HTTP_${response.status}` };
    }

    return { sent: true, providerMessageId: result?.id };
  } catch (error) {
    return { sent: false, error: error instanceof Error ? error.message : "EMAIL_SEND_FAILED" };
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return jsonResponse({ error: "Origin not allowed" }, 403, origin);
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  if (!isAllowedOrigin(origin)) {
    return jsonResponse({ error: "Origin not allowed" }, 403, origin);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Request is too large" }, 413, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Application intake is missing Supabase server configuration.");
    return jsonResponse({ error: "Applicant intake is temporarily unavailable" }, 503, origin);
  }

  let rawPayload: ApplicationPayload;
  try {
    rawPayload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON request" }, 400, origin);
  }

  const fullName = cleanText(rawPayload.full_name, 180);
  const email = normalizeEmail(rawPayload.email);
  const phone = cleanText(rawPayload.phone, 80);
  const location = cleanText(rawPayload.location, 180);
  const occupation = cleanText(rawPayload.occupation, 180);
  const whyApply = cleanText(rawPayload.why_apply, 5_000);
  const productionGoals = cleanText(rawPayload.production_goals, 5_000);
  const programSlug = slugify(cleanText(rawPayload.program_slug, 120) || "professional-programs");
  const trackSlug = slugify(
    cleanText(rawPayload.track_slug, 120) || cleanText(rawPayload.preferred_track, 120),
  );
  const termsVersion = cleanText(rawPayload.terms_version, 80);
  const privacyVersion = cleanText(rawPayload.privacy_version, 80);
  const sourcePage = cleanText(rawPayload.source_page, 180) || "Cognita application form";
  const aiSkillLevel = numberInRange(rawPayload.ai_skill_level, 1, 10);
  const techSkillLevel = numberInRange(rawPayload.tech_skill_level, 1, 10);
  const availableHours = numberInRange(rawPayload.available_hours, 1, 80);

  const validationErrors: string[] = [];
  if (fullName.length < 2) validationErrors.push("Full name is required");
  if (!isValidEmail(email)) validationErrors.push("A valid email address is required");
  if (!phone) validationErrors.push("Phone number is required");
  if (!location) validationErrors.push("Location is required");
  if (!occupation) validationErrors.push("Occupation or student status is required");
  if (!whyApply) validationErrors.push("Reason for applying is required");
  if (!productionGoals) validationErrors.push("Production goals are required");
  if (aiSkillLevel === null) validationErrors.push("AI skill level must be between 1 and 10");
  if (techSkillLevel === null) validationErrors.push("Technology skill level must be between 1 and 10");
  if (availableHours === null) validationErrors.push("Available study time is invalid");
  if (rawPayload.accepts_terms !== true || !termsVersion) validationErrors.push("Terms acceptance is required");
  if (rawPayload.accepts_privacy !== true || !privacyVersion) validationErrors.push("Privacy acknowledgment is required");

  if (validationErrors.length > 0) {
    return jsonResponse({ error: "Please review the application", fields: validationErrors }, 422, origin);
  }

  const remoteIp = request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  const turnstileValid = await verifyTurnstile(cleanText(rawPayload.turnstile_token, 4_000), remoteIp);
  if (!turnstileValid) {
    return jsonResponse({ error: "Verification failed. Please try again." }, 403, origin);
  }

  const ipSalt = Deno.env.get("IP_HASH_SALT");
  const ipHash = remoteIp && ipSalt ? await sha256(`${ipSalt}:${remoteIp}`) : null;
  const userAgent = cleanText(request.headers.get("user-agent"), 500);
  const requestId = crypto.randomUUID();

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Cognita-Request-Id": requestId } },
  });

  const { data, error } = await supabase.rpc("submit_public_application", {
    p_full_name: fullName,
    p_email: email,
    p_phone: phone,
    p_location: location,
    p_program_slug: programSlug,
    p_track_slug: trackSlug || null,
    p_occupation: occupation,
    p_ai_skill_level: aiSkillLevel,
    p_tech_skill_level: techSkillLevel,
    p_available_hours: availableHours,
    p_why_apply: whyApply,
    p_production_goals: productionGoals,
    p_terms_version: termsVersion,
    p_privacy_version: privacyVersion,
    p_source_page: sourcePage,
    p_user_agent: userAgent || null,
    p_ip_hash: ipHash,
    p_metadata: { request_id: requestId, origin },
  });

  if (error) {
    console.error("Application insert failed", { requestId, code: error.code, message: error.message });

    if (error.message.includes("RECENT_APPLICATION_EXISTS")) {
      return jsonResponse(
        { error: "A recent application already exists for this email and program." },
        409,
        origin,
      );
    }

    if (
      error.message.includes("PROGRAM_NOT_AVAILABLE") ||
      error.message.includes("TRACK_NOT_AVAILABLE") ||
      error.message.includes("REQUIRED")
    ) {
      return jsonResponse({ error: "Please review the selected program and application details." }, 422, origin);
    }

    return jsonResponse({ error: "We could not record the application. Please try again." }, 500, origin);
  }

  const application = Array.isArray(data) ? data[0] : data;
  const applicationNumber = application?.application_number as string;
  const submittedAt = application?.submitted_at as string;

  const applicantSubject = `Cognita application received: ${applicationNumber}`;
  const applicantHtml = `
    <p>Hello ${escapeHtml(fullName)},</p>
    <p>Our admissions team has received your application to Cognita Institute.</p>
    <p><strong>Application reference:</strong> ${escapeHtml(applicationNumber)}</p>
    <p>Your application will be reviewed manually. This confirmation is not an offer of admission, enrollment, or a request for payment.</p>
    <p>For questions, contact ${escapeHtml(ADMISSIONS_EMAIL)}.</p>
    <p>With love,<br>Cognita Institute</p>
  `;

  const admissionsSubject = `NEW COGNITA APPLICATION | ${applicationNumber} | ${fullName}`;
  const admissionsHtml = `
    <p>A new Cognita application has been recorded.</p>
    <p><strong>Reference:</strong> ${escapeHtml(applicationNumber)}</p>
    <p><strong>Applicant:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Program:</strong> ${escapeHtml(programSlug)}</p>
    <p><strong>Track:</strong> ${escapeHtml(trackSlug || "Not specified")}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    <p>Review the complete record inside the authorized Cognita admissions dashboard.</p>
  `;

  const emailJobs = [
    { recipient: email, template: "application_received", subject: applicantSubject, html: applicantHtml },
    { recipient: ADMISSIONS_EMAIL, template: "new_application_internal", subject: admissionsSubject, html: admissionsHtml },
  ];

  for (const job of emailJobs) {
    const { data: outboxRecord, error: outboxError } = await supabase
      .from("email_outbox")
      .insert({
        recipient: job.recipient,
        template_key: job.template,
        subject: job.subject,
        payload: { application_number: applicationNumber, request_id: requestId },
      })
      .select("id")
      .single();

    if (outboxError) {
      console.error("Email outbox insert failed", { requestId, message: outboxError.message });
      continue;
    }

    const delivery = await sendEmail({ to: job.recipient, subject: job.subject, html: job.html });
    await supabase
      .from("email_outbox")
      .update({
        status: delivery.sent ? "sent" : "failed",
        provider_message_id: delivery.providerMessageId || null,
        attempt_count: 1,
        last_error: delivery.error || null,
        sent_at: delivery.sent ? new Date().toISOString() : null,
      })
      .eq("id", outboxRecord.id);
  }

  await supabase.from("audit_log").insert({
    action: "application.submitted",
    table_name: "applications",
    record_id: applicationNumber,
    request_id: requestId,
    ip_hash: ipHash,
    after_data: { application_number: applicationNumber, program_slug: programSlug, track_slug: trackSlug || null },
  });

  return jsonResponse(
    {
      success: true,
      application_number: applicationNumber,
      submitted_at: submittedAt,
      message: "Application received for manual review.",
    },
    201,
    origin,
  );
});
