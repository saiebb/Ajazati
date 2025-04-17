-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'manager');
CREATE TYPE vacation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'system');
CREATE TYPE language_type AS ENUM ('en', 'ar');

-- Users table is defined in migration file 20250416000000_auth_and_roles.sql
-- Removed to avoid conflicts

-- Create vacation_types table
CREATE TABLE IF NOT EXISTS vacation_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vacations table
CREATE TABLE IF NOT EXISTS vacations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vacation_type_id INTEGER REFERENCES vacation_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status vacation_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    vacation_id UUID REFERENCES vacations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme theme_type DEFAULT 'system',
    language language_type DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    calendar_sync_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vacations_user_id ON vacations(user_id);
CREATE INDEX IF NOT EXISTS idx_vacations_status ON vacations(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON users FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Vacation types policies
CREATE POLICY "Anyone can view vacation types"
    ON vacation_types FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can manage vacation types"
    ON vacation_types FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Vacations policies
CREATE POLICY "Users can view their own vacations"
    ON vacations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vacations"
    ON vacations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending vacations"
    ON vacations FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Managers can view department vacations"
    ON vacations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users u1
        JOIN users u2 ON u1.department = u2.department
        WHERE u1.id = auth.uid() 
        AND u1.role = 'manager'
        AND u2.id = vacations.user_id
    ));

CREATE POLICY "Managers can approve department vacations"
    ON vacations FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM users u1
        JOIN users u2 ON u1.department = u2.department
        WHERE u1.id = auth.uid() 
        AND u1.role = 'manager'
        AND u2.id = vacations.user_id
    ));

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS trigger AS $$
BEGIN
    INSERT INTO users (id, email)
    VALUES (new.id, new.email);

    INSERT INTO user_preferences (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_auth_user_created();

-- Insert initial vacation types
INSERT INTO vacation_types (name, color) VALUES
    ('Regular', '#4CAF50'),
    ('Sick', '#FF8A65'),
    ('Personal', '#9C27B0'),
    ('Casual', '#ADD8E6')
ON CONFLICT DO NOTHING;