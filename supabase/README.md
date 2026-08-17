# IHSAAN Opportunities Tracker setup

## 1. Create the database safely

In the Supabase project, open **SQL Editor**, create a new query, paste the contents of
`supabase/migrations/20260808160000_create_opportunities_tracker.sql`, and run it once.

This creates the tracker tables and enables Row Level Security. It does not add any opportunities.

When updating the tracker interface, run any later migration in this folder in timestamp order. For the new opportunity detail view, run `20260812100000_add_opportunity_detail_fields.sql` and then `20260812110000_import_notion_opportunities.sql` after the existing tracker migrations.

## 2. Access roles

Any person who verifies a `@fosis.org.uk` email through the website can submit an opportunity as a member.
Use the `tracker_members` table only for people who need an elevated role, or for approved contributors without a FOSIS email.

In SQL Editor, run this with the administrator's email address:

```sql
insert into public.tracker_members (email, role)
values ('admin@example.com', 'admin')
on conflict (email) do update set role = 'admin', active = true;
```

Use `member` for people who may submit opportunities and `editor` for people who can review them.

## 3. Configure magic-link redirects

In **Authentication → URL Configuration**, set the production Site URL to the deployed site.
Add each development URL that will be used for testing to Redirect URLs, for example:

```text
http://localhost:4173
http://127.0.0.1:4173
https://ihsaan.network
```

## 4. Connect the website

From **Project → Connect**, copy the Project URL and **Publishable key** into
`scripts/supabase-config.js`.

Never put a database password, `sb_secret` key, or legacy `service_role` key in that file.
