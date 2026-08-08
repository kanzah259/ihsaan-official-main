-- Run once in Supabase SQL Editor after the original tracker migration.
-- Authorised tracker contributors publish directly to the public tracker.

drop policy if exists "Approved members can submit opportunities" on public.opportunities;
drop policy if exists "Contributors can publish opportunities" on public.opportunities;

create policy "Contributors can publish opportunities"
on public.opportunities for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and status = 'approved'
  and public.current_tracker_role() is not null
);
