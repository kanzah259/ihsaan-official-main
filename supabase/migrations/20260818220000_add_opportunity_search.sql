-- Scalable public opportunity search.
-- Adds full-text and typo-tolerant indexes, then exposes a keyset-paginated RPC.

create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;

alter table public.opportunities
  add column if not exists search_document tsvector
  generated always as (
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(organisation_name, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(industry, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(location, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(opportunity_type, '')), 'C') ||
    setweight(to_tsvector('english'::regconfig, coalesce(work_location_type, '')), 'C') ||
    setweight(to_tsvector('english'::regconfig, coalesce(description, '')), 'D')
  ) stored,
  add column if not exists search_text text
  generated always as (
    lower(
      coalesce(title, '') || ' ' ||
      coalesce(organisation_name, '') || ' ' ||
      coalesce(industry, '') || ' ' ||
      coalesce(location, '') || ' ' ||
      coalesce(opportunity_type, '') || ' ' ||
      coalesce(work_location_type, '') || ' ' ||
      coalesce(description, '')
    )
  ) stored;

create index if not exists opportunities_search_document_idx
  on public.opportunities using gin (search_document);

create index if not exists opportunities_search_text_trgm_idx
  on public.opportunities using gin (search_text extensions.gin_trgm_ops);

create index if not exists opportunities_industry_trgm_idx
  on public.opportunities using gin (lower(industry) extensions.gin_trgm_ops);

create index if not exists opportunities_location_trgm_idx
  on public.opportunities using gin (lower(location) extensions.gin_trgm_ops);

create index if not exists opportunities_public_cursor_idx
  on public.opportunities (created_at desc, id desc)
  where status = 'approved';

create or replace function public.search_opportunities(
  p_query text default null,
  p_opportunity_type text default null,
  p_industry text default null,
  p_location text default null,
  p_work_location_type text default null,
  p_remuneration text default null,
  p_sort text default 'relevance',
  p_page_size integer default 24,
  p_cursor_rank double precision default null,
  p_cursor_created_at timestamptz default null,
  p_cursor_id uuid default null
)
returns table (
  id uuid,
  title text,
  organisation_name text,
  opportunity_type text,
  industry text,
  location text,
  work_location_type text,
  remuneration text,
  application_url text,
  description text,
  deadline date,
  created_at timestamptz,
  search_rank double precision,
  total_count bigint
)
language sql
stable
set search_path = public, extensions
as $$
  with search_terms as (
    select
      left(nullif(btrim(coalesce(p_query, '')), ''), 120) as query_text,
      least(greatest(coalesce(p_page_size, 24), 1), 50) as result_limit
  ),
  parsed_query as (
    select
      search_terms.*,
      case
        when query_text is null then null::tsquery
        else websearch_to_tsquery('english'::regconfig, query_text)
      end as text_query
    from search_terms
  ),
  match_state as (
    select
      parsed_query.*,
      case
        when parsed_query.query_text is null then false
        else exists (
          select 1
          from public.opportunities as exact_opportunity
          where exact_opportunity.status = 'approved'
            and (p_opportunity_type is null or exact_opportunity.opportunity_type = p_opportunity_type)
            and (p_industry is null or lower(exact_opportunity.industry) like '%' || lower(p_industry) || '%')
            and (p_location is null or lower(exact_opportunity.location) like '%' || lower(p_location) || '%')
            and (p_work_location_type is null or exact_opportunity.work_location_type = p_work_location_type)
            and (p_remuneration is null or exact_opportunity.remuneration = p_remuneration)
            and exact_opportunity.search_document @@ parsed_query.text_query
        )
      end as has_full_text_matches
    from parsed_query
  ),
  scored as (
    select
      opportunity.id,
      opportunity.title,
      opportunity.organisation_name,
      opportunity.opportunity_type,
      opportunity.industry,
      opportunity.location,
      opportunity.work_location_type,
      opportunity.remuneration,
      opportunity.application_url,
      opportunity.description,
      opportunity.deadline,
      opportunity.created_at,
      case
        when match_state.query_text is null then 0::double precision
        else (
          ts_rank_cd(opportunity.search_document, match_state.text_query, 32)::double precision +
          greatest(
            extensions.word_similarity(lower(match_state.query_text), lower(opportunity.title)),
            extensions.word_similarity(lower(match_state.query_text), opportunity.search_text)
          ) * 0.25
        )
      end as search_rank,
      match_state.query_text,
      match_state.result_limit
    from public.opportunities as opportunity
    cross join match_state
    where opportunity.status = 'approved'
      and (p_opportunity_type is null or opportunity.opportunity_type = p_opportunity_type)
      and (p_industry is null or lower(opportunity.industry) like '%' || lower(p_industry) || '%')
      and (p_location is null or lower(opportunity.location) like '%' || lower(p_location) || '%')
      and (p_work_location_type is null or opportunity.work_location_type = p_work_location_type)
      and (p_remuneration is null or opportunity.remuneration = p_remuneration)
      and (
        match_state.query_text is null
        or opportunity.search_document @@ match_state.text_query
        or (
          not match_state.has_full_text_matches
          and greatest(
            extensions.word_similarity(lower(match_state.query_text), lower(opportunity.title)),
            extensions.word_similarity(lower(match_state.query_text), opportunity.search_text)
          ) >= 0.55
        )
      )
  ),
  counted as (
    select scored.*, count(*) over () as total_count
    from scored
  ),
  cursor_page as (
    select counted.*
    from counted
    where p_cursor_id is null
      or (
        p_sort = 'relevance'
        and counted.query_text is not null
        and (
          counted.search_rank < p_cursor_rank
          or (
            counted.search_rank = p_cursor_rank
            and (counted.created_at, counted.id) < (p_cursor_created_at, p_cursor_id)
          )
        )
      )
      or (
        (p_sort <> 'relevance' or counted.query_text is null)
        and (counted.created_at, counted.id) < (p_cursor_created_at, p_cursor_id)
      )
    order by
      case
        when p_sort = 'relevance' and counted.query_text is not null
        then counted.search_rank
      end desc,
      counted.created_at desc,
      counted.id desc
    limit (select result_limit from parsed_query)
  )
  select
    cursor_page.id,
    cursor_page.title,
    cursor_page.organisation_name,
    cursor_page.opportunity_type,
    cursor_page.industry,
    cursor_page.location,
    cursor_page.work_location_type,
    cursor_page.remuneration,
    cursor_page.application_url,
    cursor_page.description,
    cursor_page.deadline,
    cursor_page.created_at,
    cursor_page.search_rank,
    cursor_page.total_count
  from cursor_page
  order by
    case
      when p_sort = 'relevance' and cursor_page.query_text is not null
      then cursor_page.search_rank
    end desc,
    cursor_page.created_at desc,
    cursor_page.id desc;
$$;

grant execute on function public.search_opportunities(
  text, text, text, text, text, text, text, integer, double precision, timestamptz, uuid
) to anon, authenticated;

comment on function public.search_opportunities(
  text, text, text, text, text, text, text, integer, double precision, timestamptz, uuid
) is 'Ranked, filtered and keyset-paginated search for approved opportunities.';
