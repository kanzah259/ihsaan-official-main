-- IHSAAN Opportunities Tracker
-- Run this migration in Supabase SQL Editor once to set up the tracker.
-- Opportunities are then added through the website's member submission form.

create type public.tracker_member_role as enum ('member', 'editor', 'admin');
create type public.opportunity_status as enum ('pending', 'approved', 'rejected', 'expired');

create table public.tracker_members (
  email text primary key check (email = lower(email)),
  role public.tracker_member_role not null default 'member',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 160),
  organisation_name text not null check (char_length(organisation_name) between 2 and 160),
  opportunity_type text not null check (opportunity_type in ('Internship', 'Graduate role', 'Scholarship', 'Apprenticeship', 'Full-time', 'Part-time', 'Freelance', 'Volunteering', 'Programme', 'Other')),
  industry text not null check (char_length(industry) between 2 and 120),
  location text not null check (char_length(location) between 2 and 120),
  work_location_type text not null check (work_location_type in ('On-site', 'Hybrid', 'Remote')),
  remuneration text not null check (remuneration in ('Paid', 'Stipend provided', 'Unpaid')),
  application_url text not null check (application_url ~* '^https?://'),
  description text not null check (char_length(description) between 20 and 4000),
  deadline date,
  status public.opportunity_status not null default 'pending',
  submitted_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index opportunities_public_listing_idx on public.opportunities (status, created_at desc);
create index opportunities_submitted_by_idx on public.opportunities (submitted_by);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tracker_members_set_updated_at
before update on public.tracker_members
for each row execute function public.set_updated_at();

create trigger opportunities_set_updated_at
before update on public.opportunities
for each row execute function public.set_updated_at();

create or replace function public.current_tracker_role()
returns public.tracker_member_role
language sql
stable
security definer
set search_path = public
as $$
  with current_email as (
    select lower(coalesce(auth.jwt() ->> 'email', '')) as email
  )
  select coalesce(
    (
      select member.role
      from public.tracker_members member
      join current_email on current_email.email = member.email
      where member.active = true
      limit 1
    ),
    case
      when (select email from current_email) like '%@fosis.org.uk'
      then 'member'::public.tracker_member_role
    end
  );
$$;

create or replace function public.is_tracker_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_tracker_role() in ('editor', 'admin'), false);
$$;

alter table public.tracker_members enable row level security;
alter table public.opportunities enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.opportunities to anon, authenticated;
grant insert, update, delete on public.opportunities to authenticated;
grant execute on function public.current_tracker_role() to authenticated;
grant execute on function public.is_tracker_editor() to authenticated;

create policy "Public can read approved opportunities"
on public.opportunities for select
to anon, authenticated
using (
  status = 'approved'
  or submitted_by = auth.uid()
  or public.is_tracker_editor()
);

create policy "Approved members can submit opportunities"
on public.opportunities for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and status = 'pending'
  and public.current_tracker_role() is not null
);

create policy "Editors can manage opportunities"
on public.opportunities for update
to authenticated
using (public.is_tracker_editor())
with check (public.is_tracker_editor());

create policy "Editors can delete opportunities"
on public.opportunities for delete
to authenticated
using (public.is_tracker_editor());
