-- ═══════════════════════════════════════
-- سيرتي | Sirati — Supabase Schema
-- ═══════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ─────────────────────────────────────
create table public.profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null unique,
  name_ar         text,
  name_en         text,
  phone           text,
  avatar_url      text,
  title_ar        text,
  title_en        text,
  summary_ar      text,
  summary_en      text,
  city            text,
  country         text default 'Saudi Arabia',
  linkedin        text,
  portfolio_url   text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, name_ar, name_en)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Work Experience ───────────────────────────────
create table public.work_experience (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  company_ar      text,
  company_en      text,
  role_ar         text not null,
  role_en         text,
  start_date      date not null,
  end_date        date,
  is_current      boolean default false,
  description_ar  text,
  description_en  text,
  sort_order      int default 0,
  created_at      timestamptz default now()
);

-- ── Education ─────────────────────────────────────
create table public.education (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  institution     text not null,
  degree_ar       text,
  degree_en       text,
  field_ar        text,
  field_en        text,
  start_year      int,
  end_year        int,
  gpa             text,
  created_at      timestamptz default now()
);

-- ── Certifications ────────────────────────────────
create table public.certifications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  issuer          text,
  issue_date      date,
  expiry_date     date,
  credential_url  text,
  created_at      timestamptz default now()
);

-- ── Skills ────────────────────────────────────────
create type skill_level as enum ('beginner', 'intermediate', 'advanced', 'expert');

create table public.skills (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  level           skill_level,
  category        text,  -- 'programming', 'design', 'management', etc.
  created_at      timestamptz default now()
);

-- ── Languages ─────────────────────────────────────
create type language_level as enum ('elementary', 'limited', 'professional', 'full', 'native');

create table public.languages (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  language        text not null,
  proficiency     language_level,
  created_at      timestamptz default now()
);

-- ── Generated CVs ─────────────────────────────────
create type cv_language as enum ('ar', 'en', 'both');
create type cv_tone as enum ('formal', 'creative', 'technical');

create table public.generated_cvs (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  job_title       text not null,
  job_description text not null,
  language        cv_language default 'ar',
  tone            cv_tone default 'formal',
  content_json    jsonb not null,
  cover_letter    text,
  match_score     int check (match_score between 0 and 100),
  pdf_url         text,
  template_id     text default 'modern-01',
  created_at      timestamptz default now()
);

-- ── Row Level Security ────────────────────────────
alter table public.profiles        enable row level security;
alter table public.work_experience enable row level security;
alter table public.education       enable row level security;
alter table public.certifications  enable row level security;
alter table public.skills          enable row level security;
alter table public.languages       enable row level security;
alter table public.generated_cvs   enable row level security;

-- RLS Policies
do $$
declare
  tables text[] := array['profiles', 'work_experience', 'education', 'certifications', 'skills', 'languages', 'generated_cvs'];
  t text;
begin
  foreach t in array tables loop
    execute format('create policy "%s_own" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t, t);
  end loop;
end $$;

-- ── Indexes ───────────────────────────────────────
create index idx_profiles_user_id        on public.profiles(user_id);
create index idx_experience_user_id      on public.work_experience(user_id);
create index idx_education_user_id       on public.education(user_id);
create index idx_certifications_user_id  on public.certifications(user_id);
create index idx_skills_user_id          on public.skills(user_id);
create index idx_languages_user_id       on public.languages(user_id);
create index idx_cvs_user_id             on public.generated_cvs(user_id);
create index idx_cvs_created_at          on public.generated_cvs(created_at desc);

-- ── Updated at trigger ────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
