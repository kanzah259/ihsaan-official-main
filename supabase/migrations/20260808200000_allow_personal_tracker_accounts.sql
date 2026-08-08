-- Allow admins to manage trusted tracker accounts with personal email addresses.

drop policy if exists "Admins can add tracker members" on public.tracker_members;
drop policy if exists "Admins can update tracker members" on public.tracker_members;

create policy "Admins can add tracker members"
on public.tracker_members for insert
to authenticated
with check (public.current_tracker_role() = 'admin');

create policy "Admins can update tracker members"
on public.tracker_members for update
to authenticated
using (public.current_tracker_role() = 'admin')
with check (public.current_tracker_role() = 'admin');
