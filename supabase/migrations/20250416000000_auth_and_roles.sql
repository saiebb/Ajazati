-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
alter table auth.users enable row level security;

-- Create enum for user roles
create type public.user_role as enum ('admin', 'user', 'manager');

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
    department TEXT,
    total_vacation_days INTEGER DEFAULT 21,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create vacation_types table
CREATE TABLE IF NOT EXISTS public.vacation_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create vacations table
CREATE TABLE IF NOT EXISTS public.vacations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    vacation_type_id INTEGER REFERENCES public.vacation_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    vacation_id UUID REFERENCES public.vacations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    calendar_sync_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add some basic vacation types
INSERT INTO public.vacation_types (name, color) VALUES
('Regular', '#4CAF50'),
('Sick', '#FF8A65'),
('Personal', '#9C27B0'),
('Casual', '#ADD8E6')
ON CONFLICT DO NOTHING;

-- Add RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.users
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Vacations policies
CREATE POLICY "Users can view their own vacations"
    ON public.vacations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vacations"
    ON public.vacations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending vacations"
    ON public.vacations
    FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name, department, role)
  values (new.id, new.email, '', '', 'user');

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update existing vacation table RLS policies
create policy "Users can view their own vacations"
  on public.vacations for select
  using (auth.uid() = user_id);

create policy "Users can create their own vacations"
  on public.vacations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pending vacations"
  on public.vacations for update
  using (auth.uid() = user_id and status = 'pending');

create policy "Managers can view department vacations"
  on public.vacations for select
  using (
    exists (
      select 1 from public.users u1
      join public.users u2 on u1.department = u2.department
      where u1.id = auth.uid() 
      and u1.role = 'manager'
      and u2.id = vacations.user_id
    )
  );

create policy "Managers can approve department vacations"
  on public.vacations for update
  using (
    exists (
      select 1 from public.users u1
      join public.users u2 on u1.department = u2.department
      where u1.id = auth.uid() 
      and u1.role = 'manager'
      and u2.id = vacations.user_id
    )
  );

create policy "Admins can view all vacations"
  on public.vacations for select
  using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage all vacations"
  on public.vacations for all
  using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );