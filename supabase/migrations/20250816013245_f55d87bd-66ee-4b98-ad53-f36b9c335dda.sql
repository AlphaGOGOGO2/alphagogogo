
-- 1) Harden ai_services RLS: remove permissive write, keep public read of active rows
alter table public.ai_services enable row level security;

-- Drop any overly permissive policies if they exist
drop policy if exists "Allow all operations on ai_services" on public.ai_services;

-- Ensure a public read-only policy exists for active rows
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='ai_services' and policyname='Anyone can view active services'
  ) then
    create policy "Anyone can view active services"
      on public.ai_services
      for select
      using (is_active = true);
  end if;
end$$;

-- Explicitly deny public writes by having no insert/update/delete policies for anon/authenticated
-- (Writes will be performed only by Edge Functions using the service role)

-- 2) Restrict blog_tags and blog_post_tags to service-role-only writes

alter table public.blog_tags enable row level security;
alter table public.blog_post_tags enable row level security;

-- Remove permissive or authenticated-write policies if present
drop policy if exists "insert_blog_tags" on public.blog_tags;
drop policy if exists "select_blog_tags" on public.blog_tags;
drop policy if exists "insert_blog_post_tags" on public.blog_post_tags;
drop policy if exists "select_blog_post_tags" on public.blog_post_tags;

-- Public read may not be necessary; keep tags access internal.
-- If you need public read later, add a read-only policy with appropriate filters.

-- Create restrictive policies that effectively block anon/authenticated users
-- (No SELECT/INSERT/UPDATE/DELETE policies for public roles)
-- Edge Functions with service role bypass RLS.

-- 3) Add admin login attempts table for server-side rate limiting

create table if not exists public.admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  attempted_at timestamptz not null default now()
);

-- Enable RLS and block all user access (service role only)
alter table public.admin_login_attempts enable row level security;

-- Create restrictive policies (no public access)
create policy if not exists "No direct user access to admin login attempts"
  on public.admin_login_attempts
  for all
  using (false)
  with check (false);

-- Helpful index for pruning/counts
create index if not exists idx_admin_login_attempts_ip_time
  on public.admin_login_attempts (ip_address, attempted_at desc);

