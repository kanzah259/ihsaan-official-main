-- Optional structured details for the public opportunity detail view.
-- Existing listings remain valid; these fields are only shown when supplied.

alter table public.opportunities
  add column if not exists about_organisation text,
  add column if not exists salary text,
  add column if not exists requirements text,
  add column if not exists application_process text;

alter table public.opportunities
  drop constraint if exists opportunities_salary_check,
  drop constraint if exists opportunities_about_organisation_check,
  drop constraint if exists opportunities_requirements_check,
  drop constraint if exists opportunities_application_process_check;

alter table public.opportunities
  add constraint opportunities_salary_check check (salary is null or char_length(salary) <= 240),
  add constraint opportunities_about_organisation_check check (about_organisation is null or char_length(about_organisation) <= 4000),
  add constraint opportunities_requirements_check check (requirements is null or char_length(requirements) <= 4000),
  add constraint opportunities_application_process_check check (application_process is null or char_length(application_process) <= 4000);
