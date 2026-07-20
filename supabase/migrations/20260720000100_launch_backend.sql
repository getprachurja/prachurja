create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon;

create table if not exists private.api_credentials (
  id text primary key,
  token_digest bytea not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
revoke all on private.api_credentials from public, anon, authenticated;

create or replace function private.has_valid_app_secret()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.api_credentials
    where active
      and token_digest = extensions.digest(
        coalesce(
          (coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb ->> 'x-prachurja-app-key'),
          ''
        ),
        'sha256'
      )
  );
$$;
revoke execute on function private.has_valid_app_secret() from public, authenticated;
grant execute on function private.has_valid_app_secret() to anon;

create table if not exists public.assessment_requests (
  id text primary key,
  reference text not null unique,
  submitter_email text,
  name text not null,
  organisation text not null,
  email text not null,
  phone text not null,
  client_type text not null,
  state text not null,
  district text not null,
  address text not null,
  area text not null,
  unit text not null,
  ownership text not null,
  condition text not null,
  water text not null,
  vegetation text not null,
  objective text not null,
  timeline text not null,
  budget text not null,
  maintenance text not null,
  reporting text not null,
  message text not null default '',
  status text not null default 'New' check (status in ('New', 'Reviewing', 'Assessment scheduled', 'Closed')),
  internal_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_applications (
  id text primary key,
  reference text not null unique,
  pathway text not null,
  name text not null,
  organisation text not null,
  location text not null,
  contact text not null,
  capacity text not null,
  status text not null default 'New' check (status in ('New', 'Reviewing', 'Approved', 'Declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_members (
  id text primary key,
  email text not null unique,
  name text not null default '',
  organisation text not null default '',
  role text not null check (role in ('admin', 'client', 'partner', 'field')),
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_access_requests (
  id text primary key,
  email text not null unique,
  name text not null default '',
  organisation text not null default '',
  requested_role text not null check (requested_role in ('client', 'partner', 'field')),
  message text not null default '',
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nursery_inventory (
  id text primary key,
  owner_email text not null,
  batch_code text not null unique,
  species text not null,
  size text not null,
  available bigint not null default 0 check (available >= 0),
  status text not null default 'Review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.field_reports (
  id text primary key,
  reference text not null unique,
  reporter_email text not null,
  task_code text not null,
  project_name text not null,
  zone text not null,
  species text not null,
  quantity bigint not null check (quantity > 0),
  maintenance_note text not null default '',
  issue text not null default '',
  status text not null default 'Submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id text primary key,
  reference text not null unique,
  name text not null,
  organisation text not null,
  email text not null,
  phone text not null default '',
  subject text not null,
  message text not null,
  status text not null default 'New' check (status in ('New', 'In progress', 'Resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_by text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id text primary key,
  object_key text not null unique,
  filename text not null,
  content_type text not null,
  size bigint not null check (size > 0),
  alt_text text not null default '',
  uploaded_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.backend_health (
  id text primary key,
  checked_at timestamptz not null default now()
);
insert into public.backend_health (id) values ('ready') on conflict (id) do nothing;

create index if not exists assessment_requests_submitter_created_idx on public.assessment_requests (submitter_email, created_at desc);
create index if not exists assessment_requests_status_idx on public.assessment_requests (status);
create index if not exists partner_applications_contact_created_idx on public.partner_applications (contact, created_at desc);
create index if not exists partner_applications_status_idx on public.partner_applications (status);
create index if not exists portal_access_requests_status_created_idx on public.portal_access_requests (status, created_at desc);
create index if not exists portal_members_role_status_idx on public.portal_members (role, status);
create index if not exists nursery_inventory_owner_updated_idx on public.nursery_inventory (owner_email, updated_at desc);
create index if not exists field_reports_reporter_created_idx on public.field_reports (reporter_email, created_at desc);
create index if not exists contact_messages_status_created_idx on public.contact_messages (status, created_at desc);
create index if not exists media_assets_created_idx on public.media_assets (created_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'assessment_requests', 'partner_applications', 'portal_members', 'portal_access_requests',
    'nursery_inventory', 'field_reports', 'contact_messages', 'site_content', 'media_assets', 'backend_health'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists prachurja_server_access on public.%I', table_name);
    execute format(
      'create policy prachurja_server_access on public.%I for all to anon using ((select private.has_valid_app_secret())) with check ((select private.has_valid_app_secret()))',
      table_name
    );
    execute format('grant select, insert, update, delete on public.%I to anon', table_name);
    execute format('revoke all on public.%I from authenticated', table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('prachurja-media', 'prachurja-media', false, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
