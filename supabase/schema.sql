-- Anila Merovci portfolio: case studies + media.
-- Run once in Supabase → SQL Editor → New query → Run. Running it again does no harm.

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null default '',
  industry    text not null default '',
  client      text not null default '',
  year        text not null default '',
  experience  text not null default '',
  live_url    text,
  cover       jsonb not null default '{}'::jsonb,   -- { ph, src, alt }
  cover_video jsonb,                                -- { src, poster }
  sections    jsonb not null default '[]'::jsonb,   -- the case-study blocks, in order
  sort_order  integer not null default 0,
  featured    boolean not null default true,    -- show on the home page
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Only the site's server (service-role key) reads and writes this table.
-- With row level security on and no policies, the public keys can do nothing.
alter table public.projects enable row level security;

-- Media bucket: anyone can view the files, only the server can upload.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

-- Added later: safe to run on an existing table.
alter table public.projects add column if not exists featured boolean not null default true;
