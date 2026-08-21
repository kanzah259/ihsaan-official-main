-- Run once in Supabase SQL Editor after the original tracker migration.
-- An application link is helpful but not required for every opportunity.

alter table public.opportunities
  alter column application_url drop not null;
