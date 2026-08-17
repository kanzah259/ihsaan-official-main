-- Run once in Supabase SQL Editor after the original tracker migration.
-- A short description is allowed so contributors can add listings quickly.

alter table public.opportunities
  drop constraint if exists opportunities_description_check;

alter table public.opportunities
  add constraint opportunities_description_check
  check (char_length(description) between 1 and 4000);
