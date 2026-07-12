// Migration template for the public Cognita application form.
// This sends applicant data only to the protected Supabase Edge Function.

import { requireSupabase } from "@/api/supabaseClient";

export async function submitCognitaApplication(application) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.functions.invoke("submit-application", {
    body: {
      ...application,
      program_slug: application.program_slug || "professional-programs",
      terms_version: application.terms_version,
      privacy_version: application.privacy_version,
      source_page: application.source_page || window.location.pathname,
    },
    headers: application.turnstile_token
      ? { "x-turnstile-token": application.turnstile_token }
      : undefined,
  });

  if (error) {
    const message = error.context?.body?.error || error.message || "Application submission failed";
    throw new Error(message);
  }

  if (!data?.success || !data?.application_number) {
    throw new Error("Cognita did not return an application reference. Please contact Admissions.");
  }

  return data;
}
