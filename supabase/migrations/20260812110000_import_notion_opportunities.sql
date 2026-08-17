-- One-time import of the 20 listings currently published in the IHSAAN Notion tracker.
-- Run this only after 20260812100000_add_opportunity_detail_fields.sql.
-- These are normal editable rows. They can be updated or deleted in the tracker workspace.

alter table public.opportunities
  drop constraint if exists opportunities_work_location_type_check,
  drop constraint if exists opportunities_remuneration_check;

alter table public.opportunities
  add constraint opportunities_work_location_type_check check (work_location_type in ('On-site', 'Hybrid', 'Remote', 'Not specified')),
  add constraint opportunities_remuneration_check check (remuneration in ('Paid', 'Stipend provided', 'Unpaid', 'Not specified'));

insert into public.opportunities (
  title, organisation_name, opportunity_type, industry, location, work_location_type,
  remuneration, application_url, description, about_organisation, salary, deadline,
  requirements, application_process, status
) values
(
  $$Convert Care Officer$$, $$East London Mosque$$, $$Other$$, $$Charity/Non-Profit$$, $$London$$, $$On-site$$,
  $$Paid$$, $$https://www.eastlondonmosque.org.uk/blog/job-vacancy-convert-care-officer$$,
  $$Support people who are interested in, or new to, Islam through pastoral care and educational outreach. The role includes community support and may involve evenings and weekends.$$,
  $$London’s largest, busiest and oldest mosque and Islamic centre.$$,
  $$£26,918.06 pro rata per annum$$, NULL,
  $$Experience in a similar role, strong communication skills, and a sound understanding of Islamic teachings and practices. References and DBS clearance are required.$$,
  NULL, $$approved$$
),
(
  $$Digital Social Media Intern$$, $$Mercy Mission$$, $$Internship$$, $$Media$$, $$Not specified$$, $$Not specified$$,
  $$Paid$$, $$https://www.linkedin.com/posts/unique-intern-opportunity-at-zeteo-ugcPost-7475836190760349697-g7Gz/$$,
  $$Paid social media internship with Mercy Mission. See the original listing for current responsibilities and application details.$$,
  NULL, NULL, NULL, NULL, $$Apply through the linked listing.$$ , $$approved$$
),
(
  $$Editorial & Production Intern$$, $$Mercy Mission$$, $$Internship$$, $$Journalism, Policy & Public Affairs$$, $$Not specified$$, $$Not specified$$,
  $$Paid$$, $$https://www.linkedin.com/posts/unique-intern-opportunity-at-zeteo-ugcPost-7475836190760349697-g7Gz/$$,
  $$Paid editorial and production internship with Mercy Mission. See the original listing for current responsibilities and application details.$$,
  NULL, NULL, NULL, NULL, $$Apply through the linked listing.$$ , $$approved$$
),
(
  $$Policy Advisor$$, $$The Royal Society$$, $$Full-time$$, $$Policy$$, $$London$$, $$On-site$$,
  $$Paid$$, NULL,
  $$Policy Adviser role in the People and Planet team, contributing to science-policy work on the environment and helping advise UK, European, and international decision-makers.$$,
  $$The Royal Society is the UK’s national academy of sciences.$$,
  $$£36,300–£42,000$$, $$2026-05-25$$::date,
  $$A policy-focused background and interest in environmental and science-policy work.$$,
  $$Refer to the original Royal Society vacancy for current application information.$$ , $$approved$$
),
(
  $$Quran Teacher$$, $$German Method$$, $$Part-time$$, $$Education$$, $$Online$$, $$Remote$$,
  $$Paid$$, $$https://de.germanmethod.com/application$$,
  $$Teach Qur’an reading to English-speaking students in a clear, engaging, and structured way.$$,
  $$German Method provides Qur’an-reading education.$$,
  $$£11–£13 per hour$$, NULL,
  $$Good Arabic pronunciation, clear spoken English, communication skills, professionalism, and an interest in teaching. Experience teaching Arabic reading is desirable.$$,
  $$Submit the application form, followed by one 30-minute interview.$$ , $$approved$$
),
(
  $$Head of Employer Engagement$$, $$Aziz Foundation$$, $$Full-time$$, $$Charity/Non-Profit$$, $$Not specified$$, $$On-site$$,
  $$Paid$$, $$https://www.charityjob.co.uk/jobs?&jobId=1066689$$,
  $$Lead employer partnerships, sector networks, and graduate pathways across journalism, law, arts, public policy, and tech/AI.$$,
  $$The Aziz Foundation supports British Muslim communities through scholarships, employer engagement, and charitable initiatives.$$,
  NULL, NULL,
  $$At least five years of relevant experience, employer engagement or partnership-management experience, strong communication, and commitment to equity and supporting underrepresented communities.$$,
  $$Upload a CV and supporting statement tailored to the essential and desirable criteria.$$ , $$approved$$
),
(
  $$Paralegal$$, $$Wahed$$, $$Full-time$$, $$Law$$, $$Not specified$$, $$On-site$$,
  $$Not specified$$, $$https://jobs.lever.co/wahed.com/37d6bb1e-9ca9-4705-8a3c-2d10932762cd$$,
  $$Support a private-client legal team working on wills, inheritance-tax planning, probate, trusts, Court of Protection work, and Shariah-compliant Islamic wills.$$,
  $$I Will Solicitors Ltd is a Wahed subsidiary specialising in private-client legal work and regulated by the Solicitors Regulation Authority.$$,
  NULL, NULL,
  $$Law degree, postgraduate diploma, CILEx qualification, or a demonstrated ambition to pursue private-client law. Prior solicitor-firm experience, interest in Shariah law, attention to detail, and strong organisational skills are desirable.$$,
  $$Apply through the linked Wahed vacancy.$$ , $$approved$$
),
(
  $$Islamic Property Finance Masterclass$$, $$Islamic Finance Capacity and Advisory Bureau$$, $$Programme$$, $$Finance$$, $$Online$$, $$Remote$$,
  $$Not specified$$, $$https://www.linkedin.com/posts/najibalaswad_property-islamicfinance-uk-ugcPost-7452504606087041024-BDgX/$$,
  $$Four-week Islamic property-finance masterclass led by Najib Al Aswad, CEO of IFCAB.$$,
  NULL, NULL, NULL,
  NULL,
  $$Register interest through the linked form. The programme schedule was Thursdays, 6:30–8pm BST with a live Q&A.$$ , $$approved$$
),
(
  $$Video Editor$$, $$Yaqeen$$, $$Part-time$$, $$Media$$, $$Not specified$$, $$Remote$$,
  $$Paid$$, NULL,
  $$Part-time remote video-editing opportunity with Yaqeen. Check Yaqeen’s current careers information for the latest details.$$ ,
  $$Yaqeen is a nonprofit Islamic research organisation.$$ , NULL, NULL, NULL, NULL, $$approved$$
),
(
  $$Technical Product Manager$$, $$Yaqeen$$, $$Full-time$$, $$Technology$$, $$Not specified$$, $$Remote$$,
  $$Paid$$, $$https://ats.rippling.com/en-GB/yaqeencareers/jobs/ea34d7b8-61b7-473d-a0c0-873dc7f72824$$,
  $$Own the strategy and roadmap for core data products, metrics, data workflows, and AI/ML-enabled product experiences.$$,
  $$Yaqeen is a nonprofit that creates Islamic research and guidance in accessible, creative formats.$$,
  NULL, NULL,
  $$Five or more years of professional experience, including three years in product management for data, analytics, or platform products. SQL, data-governance, experimentation, and technical product experience are required.$$,
  $$Submit a CV and cover letter through the linked application.$$ , $$approved$$
),
(
  $$Senior Communications and Public Affairs Manager$$, $$Aziz Foundation$$, $$Full-time$$, $$Public Affairs$$, $$London$$, $$On-site$$,
  $$Paid$$, $$http://linkedin.com/posts/we-are-growing-our-team-we-are-seeking-a-ugcPost-7453446425247477760-W0Kh$$,
  $$Lead communications and public-affairs strategy, external relationships, social media, reputation, and promotion of the Foundation’s programmes.$$,
  $$The Aziz Foundation supports scholarships, grants, arts and culture, community work, and research.$$,
  $$£35,000–£40,000$$, NULL,
  $$At least three years of communications or public-relations experience, mainstream-media or political engagement, social-media and website-management experience, and strong written communication.$$,
  $$Upload a CV and role-specific supporting statement through CharityJob.$$ , $$approved$$
),
(
  $$Engineering Manager$$, $$StrideUp$$, $$Full-time$$, $$Finance & Start-ups$$, $$Not specified$$, $$Not specified$$,
  $$Paid$$, $$https://uk.linkedin.com/jobs/view/engineering-manager-at-strideup-4393515323$$,
  $$Lead the engineering strategy, roadmap, standards, and a team of UK-based engineers and offshore contractors at a values-driven property-finance company.$$,
  $$StrideUp provides Shariah-compliant property finance and is expanding beyond its initial home-finance offering.$$,
  NULL, NULL,
  $$Experience managing engineering teams; technical depth in JavaScript/TypeScript, Java/Kotlin, cloud infrastructure, security, CI/CD, and AI-assisted development; strong commercial and stakeholder-management skills.$$,
  $$Apply through LinkedIn.$$ , $$approved$$
),
(
  $$Finance Officer$$, $$Yaseen Youth$$, $$Part-time$$, $$Finance$$, $$London$$, $$On-site$$,
  $$Paid$$, $$https://www.yaseenyouth.org/jobs/finance-officer/$$,
  $$Support day-to-day finance operations, bookkeeping, reporting, cash management, compliance, payroll, and financial administration for Yaseen Youth Development.$$,
  $$Yaseen Youth Development is a community-focused organisation.$$,
  $$£30,000–£35,000 FTE; £18,000–£21,000 pro rata$$, NULL,
  $$AAT qualification or progress toward it, finance or bookkeeping experience, accounting-software experience, attention to detail, and strong organisational skills.$$,
  $$Apply with a cover letter and CV.$$ , $$approved$$
),
(
  $$Muslim Content Creator$$, $$YAZ360DIGITAL$$, $$Other$$, $$Media$$, $$Not specified$$, $$Not specified$$,
  $$Unpaid$$, $$https://talents.studysmarter.co.uk/companies/yaz360digital/muslim-content-creator-wanted-commission-based-11304605/$$,
  $$Create short-form social content and help shape the brand for a Muslim community and travel-activity platform. The early-stage role may develop into a partnership opportunity.$$,
  $$YAZ360DIGITAL is building a Muslim community and travel-activity platform.$$,
  $$Volunteer initially; travel and food expenses covered during activities and trips$$, NULL,
  $$Content-creation and video-editing experience, a portfolio, social-media awareness, personal content tools, and alignment with the project’s community mission.$$,
  $$Send a short introduction, links to previous work, and an example of a Muslim creator or trend you follow.$$ , $$approved$$
),
(
  $$Madrasah Female Hifdh Teacher$$, $$Green Lane Masjid$$, $$Part-time$$, $$Education$$, $$Birmingham$$, $$On-site$$,
  $$Not specified$$, $$https://greenlanemasjid.org/website-vacancy-application-form/?job_title=Madrasah%20Hifdh%20Teacher$$,
  $$Part-time Hifdh teaching role at Green Lane Masjid and Community Centre, for 12.5 hours per week.$$ ,
  $$Green Lane Masjid and Community Centre is a Birmingham mosque and community institution with education, outreach, welfare, youth, and humanitarian work.$$ ,
  NULL, NULL,
  $$See the linked role information for the current requirements.$$ ,
  $$Complete the linked vacancy application form.$$ , $$approved$$
),
(
  $$Social Media Manager$$, $$Islamic Finance Guru$$, $$Full-time$$, $$Media$$, $$London$$, $$Hybrid$$,
  $$Not specified$$, NULL,
  $$Own and grow Islamic Finance Guru’s presence across Instagram, TikTok, YouTube Shorts, and LinkedIn, covering content creation, trend research, conversion, community management, and analytics.$$ ,
  $$IslamicFinanceGuru is an Islamic fintech and financial-education platform serving a global Muslim audience.$$ ,
  $$Competitive salary$$, NULL,
  $$Experience managing social accounts, strong short-form writing, analytics confidence, understanding of platform performance, and an interest in Islamic or personal finance.$$ ,
  $$Submit a CV, covering letter or short video, portfolio, and the requested written content task through the original listing.$$ , $$approved$$
),
(
  $$Head of Marketing$$, $$Quran Foundation$$, $$Full-time$$, $$Marketing$$, $$Not specified$$, $$Not specified$$,
  $$Not specified$$, $$https://quran.foundation/careers/head-of-marketing$$,
  $$Lead the marketing vision and execution for Quran.Foundation’s global Quranic ecosystem, spanning strategy, growth, content distribution, PR, brand stewardship, and team leadership.$$ ,
  $$Quran.Foundation supports Quran.com, QuranReflect, and related products that help people connect with the Quran.$$ ,
  NULL, NULL,
  $$Seven to ten years of marketing or communications experience, digital-marketing and campaign experience, leadership, strong writing, and sensitivity to Islam-aligned messaging.$$ ,
  $$Send a CV, the strategic-snapshot exercise, and compensation requirements as instructed on the role page.$$ , $$approved$$
),
(
  $$Operations & Communications Officer$$, $$Quranic Tarbiyah$$, $$Other$$, $$Marketing & Media$$, $$Bolton$$, $$Hybrid$$,
  $$Paid$$, $$https://quranictarbiyah.com/join-the-team/$$,
  $$Support the day-to-day operations, communications, outreach, programmes, events, and administration of Quranic Tarbiyah.$$ ,
  $$Quranic Tarbiyah is a Life With Allah initiative helping educators nurture a Quran-centred generation.$$ ,
  $$Negotiable based on skills and experience$$, NULL,
  $$Strong organisation, time management, written and verbal communication, independence, attention to detail, and alignment with QT’s mission and values.$$ ,
  $$Apply through the linked team page.$$ , $$approved$$
),
(
  $$Coaching Programme$$, $$CIRCL$$, $$Programme$$, $$Other$$, $$Online$$, $$Remote$$,
  $$Unpaid$$, $$https://www.linkedin.com/posts/aminabegum6_circl-inclusive-leadership-coaching-development-activity-7398631503980552192-Gt3-$$,
  $$A fully funded coaching and leadership programme with a recognised certificate and practical coaching development alongside professionals from leading organisations.$$ ,
  $$CIRCL offers inclusive leadership and coaching development.$$ ,
  $$Fully funded$$, NULL, NULL,
  $$Apply through LinkedIn; applications are accepted year-round according to the original listing.$$ , $$approved$$
),
(
  $$Ambassador$$, $$Ihya Publications$$, $$Volunteering$$, $$Charity/Non-Profit & Start-ups$$, $$United Kingdom$$, $$Hybrid$$,
  $$Unpaid$$, NULL,
  $$Volunteer ambassador role supporting awareness and branch development for Ihya Publications, with an expected commitment of around three to five hours each month.$$ ,
  $$Ihya Publications empowers Muslim youth to think critically, engage independently, and contribute informed perspectives on contemporary issues.$$ ,
  NULL, NULL,
  $$Applicants must be 18 or over, enrolled at university, and able to commit three to five hours per month.$$ ,
  $$Email the organisation with your personal details and why you would be a good fit.$$ , $$approved$$
);
