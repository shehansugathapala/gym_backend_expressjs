-- ============================================================================
-- GYM MANAGEMENT SYSTEM - PostgreSQL Schema
-- ============================================================================
-- This schema defines the complete database structure for a Gym Management
-- System backend (Node.js + Express + PostgreSQL).
--
-- Usage: psql -d sample_db -f sql/schema.sql
-- ============================================================================

-- ============================================================================
-- CLEAN UP: Drop existing tables in reverse dependency order
-- ============================================================================

DROP TABLE IF EXISTS workout_plans CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- ============================================================================
-- UTILITY: Trigger function for automatic updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TABLE: users
-- ============================================================================
-- Central user management table for all system users (admins, trainers, members).
-- Stores authentication credentials and basic user information.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('admin', 'trainer', 'member')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups (used in authentication)
CREATE INDEX idx_users_email ON users(email);

-- Trigger for automatic updated_at
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- TABLE: members
-- ============================================================================
-- Extended profile information for gym members. Links to users via user_id.
-- Contains personal details, contact info, and membership metadata.

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    address TEXT,
    emergency_contact VARCHAR(100),
    profile_image_url TEXT,
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user_id lookups
CREATE INDEX idx_members_user_id ON members(user_id);

-- Trigger for automatic updated_at
CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- TABLE: trainers
-- ============================================================================
-- Extended profile information for gym trainers. Links to users via user_id.
-- Stores trainer-specific information like specialization and bio.

CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    bio TEXT,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for automatic updated_at
CREATE TRIGGER trg_trainers_updated_at
BEFORE UPDATE ON trainers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- TABLE: plans
-- ============================================================================
-- Membership plan offerings. Defines pricing tiers and durations available
-- to members for subscription purchases.

CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    duration_days INT NOT NULL CHECK (duration_days > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for automatic updated_at
CREATE TRIGGER trg_plans_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- TABLE: subscriptions
-- ============================================================================
-- Member subscriptions to plans. Tracks which plan each member is subscribed
-- to, the subscription period, and the current status.

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for frequent queries
CREATE INDEX idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Trigger for automatic updated_at
CREATE TRIGGER trg_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- TABLE: payments
-- ============================================================================
-- Payment records for member subscriptions. Tracks all financial transactions
-- including payment method, amount, and status.

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    subscription_id INT NOT NULL REFERENCES subscriptions(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'cash'
        CHECK (payment_method IN ('cash', 'card', 'online')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('paid', 'pending', 'failed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for payment tracking and reporting
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_payments_status ON payments(status);


-- ============================================================================
-- TABLE: attendance
-- ============================================================================
-- Member gym attendance log. Records check-in and check-out times for
-- capacity management and attendance tracking.

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    check_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for attendance queries and reporting
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_check_in ON attendance(check_in);


-- ============================================================================
-- TABLE: workout_plans
-- ============================================================================
-- Rule-based workout plans generated for members based on goal, fitness level,
-- and available training days. Plan is stored as JSONB for flexible structure.

CREATE TABLE IF NOT EXISTS workout_plans (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    goal VARCHAR(30) NOT NULL
        CHECK (goal IN ('lose_weight', 'build_muscle', 'stay_fit', 'endurance')),
    level VARCHAR(20) NOT NULL
        CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    days_per_week INT NOT NULL CHECK (days_per_week BETWEEN 2 AND 6),
    plan JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workout_plans_member_id ON workout_plans(member_id);


-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert admin user
-- NOTE: password_hash should be bcrypt hashed in production.
-- Example bcrypt hash for 'admin123': $2b$10$...
INSERT INTO users (full_name, email, password_hash, role, status)
VALUES (
    'Admin User',
    'admin@gym.com',
    '$2b$10$placeholder_bcrypt_hash_should_be_replaced_in_production',
    'admin',
    'active'
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample membership plans
INSERT INTO plans (name, description, price, duration_days, is_active)
VALUES
    ('Monthly Basic', 'Access to gym facilities during business hours', 29.99, 30, TRUE),
    ('Quarterly Pro', 'Extended access with 24/7 gym facilities', 79.99, 90, TRUE),
    ('Annual Elite', 'Premium membership with trainer consultations and priority support', 249.99, 365, TRUE)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
