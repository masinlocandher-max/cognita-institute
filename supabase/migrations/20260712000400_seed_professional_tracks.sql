-- Seed current tracks used by the existing Cognita application form.

with professional_program as (
  select id
  from public.programs
  where slug = 'professional-programs'
  limit 1
)
insert into public.program_tracks (
  program_id,
  name,
  slug,
  description,
  is_active,
  display_order
)
select
  professional_program.id,
  track.name,
  track.slug,
  track.description,
  true,
  track.display_order
from professional_program
cross join (
  values
    (
      'AI for Creatives',
      'ai-for-creatives',
      'AI-assisted design, content creation, visual storytelling, and creative workflows.',
      1
    ),
    (
      'AI for Professionals and Virtual Assistants',
      'ai-for-professionals-and-virtual-assistants',
      'AI-powered productivity systems, client communication, documentation, and professional workflows.',
      2
    ),
    (
      'AI for Entrepreneurs',
      'ai-for-entrepreneurs',
      'AI for business strategy, research, operations, marketing, and growth systems.',
      3
    ),
    (
      'AI for Students',
      'ai-for-students',
      'AI literacy, research, study workflows, academic writing, and critical thinking.',
      4
    )
) as track(name, slug, description, display_order)
on conflict (program_id, slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  updated_at = now();
