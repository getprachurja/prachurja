alter table public.assessment_requests
add column if not exists nursery_items jsonb not null default '[]'::jsonb;

comment on column public.assessment_requests.nursery_items is
  'Server-validated snapshot of native nursery items attached to the assessment enquiry.';
