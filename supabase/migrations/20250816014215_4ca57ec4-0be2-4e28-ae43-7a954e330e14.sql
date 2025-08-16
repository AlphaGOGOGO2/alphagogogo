-- Privacy hardening for visit_logs (retry without IF NOT EXISTS)
alter table public.visit_logs enable row level security;

drop policy if exists "Allow visit recording for all roles" on public.visit_logs;

create policy "No direct user access to visit logs"
  on public.visit_logs
  for all
  using (false)
  with check (false);

create index if not exists idx_visit_logs_visited_at on public.visit_logs (visited_at desc);
