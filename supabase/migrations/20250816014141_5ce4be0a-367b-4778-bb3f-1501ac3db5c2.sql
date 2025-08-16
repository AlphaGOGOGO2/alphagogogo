-- Privacy hardening for visit_logs
alter table public.visit_logs enable row level security;

-- Remove existing permissive policy (public INSERT)
drop policy if exists "Allow visit recording for all roles" on public.visit_logs;

-- Deny all direct user access; service role (Edge Functions) bypasses RLS
create policy if not exists "No direct user access to visit logs"
  on public.visit_logs
  for all
  using (false)
  with check (false);

-- Optional helpful index for admin stats (already query by visited_at)
create index if not exists idx_visit_logs_visited_at on public.visit_logs (visited_at desc);
