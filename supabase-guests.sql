create table if not exists public.guests (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamp with time zone default now() not null
);

alter table public.guests enable row level security;

create policy "Guests can read"
on public.guests
for select
using (true);

create policy "Guests can insert"
on public.guests
for insert
with check (true);

create policy "Guests can delete"
on public.guests
for delete
using (true);
