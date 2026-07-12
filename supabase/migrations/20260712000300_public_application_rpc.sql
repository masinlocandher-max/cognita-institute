-- Atomic public application intake called only from the protected Edge Function.

create or replace function public.submit_public_application(
  p_full_name text,
  p_email text,
  p_phone text,
  p_location text,
  p_program_slug text,
  p_track_slug text,
  p_occupation text,
  p_ai_skill_level smallint,
  p_tech_skill_level smallint,
  p_available_hours integer,
  p_why_apply text,
  p_production_goals text,
  p_terms_version text,
  p_privacy_version text,
  p_source_page text,
  p_user_agent text default null,
  p_ip_hash text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  application_id uuid,
  application_number text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_program_id uuid;
  v_track_id uuid;
  v_application public.applications%rowtype;
begin
  if nullif(btrim(p_full_name), '') is null then
    raise exception using errcode = '22023', message = 'FULL_NAME_REQUIRED';
  end if;

  if nullif(btrim(p_email), '') is null or position('@' in p_email) < 2 then
    raise exception using errcode = '22023', message = 'VALID_EMAIL_REQUIRED';
  end if;

  if nullif(btrim(p_why_apply), '') is null then
    raise exception using errcode = '22023', message = 'APPLICATION_REASON_REQUIRED';
  end if;

  if nullif(btrim(p_terms_version), '') is null or nullif(btrim(p_privacy_version), '') is null then
    raise exception using errcode = '22023', message = 'CONSENT_VERSIONS_REQUIRED';
  end if;

  select id
  into v_program_id
  from public.programs
  where slug = p_program_slug
    and is_published = true
  limit 1;

  if v_program_id is null then
    raise exception using errcode = '22023', message = 'PROGRAM_NOT_AVAILABLE';
  end if;

  if nullif(btrim(p_track_slug), '') is not null then
    select id
    into v_track_id
    from public.program_tracks
    where program_id = v_program_id
      and slug = p_track_slug
      and is_active = true
    limit 1;

    if v_track_id is null then
      raise exception using errcode = '22023', message = 'TRACK_NOT_AVAILABLE';
    end if;
  end if;

  if exists (
    select 1
    from public.applications a
    where lower(a.email) = lower(btrim(p_email))
      and a.program_id = v_program_id
      and a.submitted_at >= now() - interval '24 hours'
      and a.status not in ('withdrawn', 'declined')
  ) then
    raise exception using errcode = 'P0001', message = 'RECENT_APPLICATION_EXISTS';
  end if;

  insert into public.applications (
    program_id,
    track_id,
    full_name,
    email,
    phone,
    location,
    occupation,
    ai_skill_level,
    tech_skill_level,
    available_hours,
    why_apply,
    production_goals,
    source_page,
    metadata
  )
  values (
    v_program_id,
    v_track_id,
    btrim(p_full_name),
    lower(btrim(p_email)),
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_location), ''),
    nullif(btrim(p_occupation), ''),
    p_ai_skill_level,
    p_tech_skill_level,
    p_available_hours,
    btrim(p_why_apply),
    nullif(btrim(p_production_goals), ''),
    coalesce(nullif(btrim(p_source_page), ''), 'Cognita application form'),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_application;

  insert into public.consent_records (
    application_id,
    email,
    consent_type,
    policy_version,
    accepted,
    accepted_at,
    source_page,
    ip_hash,
    user_agent
  )
  values
    (
      v_application.id,
      v_application.email,
      'terms_of_use',
      btrim(p_terms_version),
      true,
      v_application.submitted_at,
      v_application.source_page,
      p_ip_hash,
      p_user_agent
    ),
    (
      v_application.id,
      v_application.email,
      'privacy_policy',
      btrim(p_privacy_version),
      true,
      v_application.submitted_at,
      v_application.source_page,
      p_ip_hash,
      p_user_agent
    );

  return query
  select v_application.id, v_application.application_number, v_application.submitted_at;
end;
$$;

revoke all on function public.submit_public_application(
  text, text, text, text, text, text, text, smallint, smallint, integer,
  text, text, text, text, text, text, text, jsonb
) from public, anon, authenticated;

grant execute on function public.submit_public_application(
  text, text, text, text, text, text, text, smallint, smallint, integer,
  text, text, text, text, text, text, text, jsonb
) to service_role;
