-- Create notes table
create table public.notes (
  id bigint primary key generated always as identity,
  title text not null
);

-- Insert some sample data into the table
insert into public.notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

-- Enable row level security for notes table
alter table public.notes enable row level security;

-- Make the data in notes table publicly readable
create policy "public can read notes"
on public.notes
for select to anon
using (true);