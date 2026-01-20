-- EcoHub Database Schema
-- Multi-role authentication system with Users, Businesses, Communities, and Admins

-- =============================================
-- CREATE DATABASE IF NOT EXISTS
-- =============================================
CREATE DATABASE IF NOT EXISTS ecohub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecohub;

-- =============================================
-- USERS TABLE (Core authentication)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    phone VARCHAR(20),
    role ENUM('individual', 'business', 'community', 'admin') DEFAULT 'individual',
    status ENUM('active', 'suspended', 'pending_verification') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- =============================================
-- BUSINESS PROFILES (For business accounts)
-- =============================================
CREATE TABLE IF NOT EXISTS business_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_type ENUM('micro', 'small', 'medium', 'large') NOT NULL,
    gst_number VARCHAR(20),
    msme_registration VARCHAR(50),
    industry_sector VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    website VARCHAR(255),
    employee_count INT,
    annual_turnover DECIMAL(15, 2),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verification_notes TEXT,
    verified_at TIMESTAMP NULL,
    verified_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- COMMUNITY PROFILES (For NGOs, Groups)
-- =============================================
CREATE TABLE IF NOT EXISTS community_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    organization_name VARCHAR(255) NOT NULL,
    organization_type ENUM('ngo', 'trust', 'society', 'cooperative', 'other') NOT NULL,
    registration_number VARCHAR(100),
    focus_areas JSON, -- Array of focus areas: ['conservation', 'energy', 'waste', 'transport']
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    website VARCHAR(255),
    member_count INT,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verification_notes TEXT,
    verified_at TIMESTAMP NULL,
    verified_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- CONSERVATION CAMPAIGNS
-- =============================================
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('forest', 'ocean', 'wildlife', 'climate', 'pollution', 'other') NOT NULL,
    image_url VARCHAR(500),
    goal_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(255),
    organizer_id VARCHAR(36) NOT NULL,
    status ENUM('draft', 'pending_approval', 'active', 'completed', 'cancelled', 'rejected') DEFAULT 'draft',
    approval_notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- CONSERVATION EVENTS
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_type ENUM('cleanup', 'plantation', 'workshop', 'awareness', 'fundraiser', 'other') NOT NULL,
    image_url VARCHAR(500),
    event_date DATETIME NOT NULL,
    end_date DATETIME,
    location VARCHAR(255) NOT NULL,
    max_participants INT,
    current_participants INT DEFAULT 0,
    organizer_id VARCHAR(36) NOT NULL,
    campaign_id VARCHAR(36),
    status ENUM('draft', 'pending_approval', 'upcoming', 'ongoing', 'completed', 'cancelled', 'rejected') DEFAULT 'draft',
    approval_notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- EVENT REGISTRATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS event_registrations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('registered', 'attended', 'cancelled', 'no_show') DEFAULT 'registered',
    volunteer_hours DECIMAL(5, 2) DEFAULT 0,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP NULL,
    UNIQUE KEY unique_registration (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- FORUM POSTS
-- =============================================
CREATE TABLE IF NOT EXISTS forum_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    category ENUM('general', 'energy', 'waste', 'transport', 'conservation', 'tips', 'questions') DEFAULT 'general',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'approved',
    moderation_notes TEXT,
    moderated_by VARCHAR(36),
    moderated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- FORUM COMMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS forum_comments (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id VARCHAR(36),
    likes_count INT DEFAULT 0,
    status ENUM('visible', 'hidden', 'flagged') DEFAULT 'visible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES forum_comments(id) ON DELETE CASCADE
);

-- =============================================
-- ENERGY PROVIDERS (Business listings)
-- =============================================
CREATE TABLE IF NOT EXISTS energy_providers (
    id VARCHAR(36) PRIMARY KEY,
    business_id VARCHAR(36) NOT NULL,
    energy_type ENUM('solar', 'wind', 'hydro', 'geothermal', 'biomass') NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity_kw DECIMAL(12, 2),
    price_per_kwh DECIMAL(10, 4),
    service_areas JSON, -- Array of cities/regions
    certifications JSON, -- Array of certifications
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    status ENUM('pending', 'active', 'suspended', 'rejected') DEFAULT 'pending',
    approval_notes TEXT,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- WASTE LISTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS waste_listings (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('paper', 'metals', 'plastics', 'electronics', 'organic', 'glass', 'textiles', 'other') NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit ENUM('kg', 'tons', 'pieces', 'liters') DEFAULT 'kg',
    price_per_unit DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    images JSON, -- Array of image URLs
    available_from DATE,
    available_until DATE,
    status ENUM('draft', 'pending', 'active', 'sold', 'expired', 'rejected') DEFAULT 'pending',
    moderation_notes TEXT,
    moderated_by VARCHAR(36),
    moderated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- WASTE INQUIRIES (Buyer interest)
-- =============================================
CREATE TABLE IF NOT EXISTS waste_inquiries (
    id VARCHAR(36) PRIMARY KEY,
    listing_id VARCHAR(36) NOT NULL,
    buyer_id VARCHAR(36) NOT NULL,
    message TEXT,
    offered_price DECIMAL(10, 2),
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    FOREIGN KEY (listing_id) REFERENCES waste_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- TRANSPORT VEHICLES (For sharing/fleet)
-- =============================================
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    vehicle_type ENUM('e_bike', 'e_scooter', 'e_auto', 'e_car', 'bicycle', 'carpool') NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    registration_number VARCHAR(20),
    capacity INT DEFAULT 1, -- Number of passengers
    base_price DECIMAL(10, 2) NOT NULL,
    price_per_km DECIMAL(10, 2) NOT NULL,
    co2_reduction_percent DECIMAL(5, 2),
    images JSON,
    available BOOLEAN DEFAULT TRUE,
    location VARCHAR(255),
    status ENUM('pending', 'active', 'suspended', 'rejected') DEFAULT 'pending',
    verification_notes TEXT,
    verified_by VARCHAR(36),
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- RIDE BOOKINGS
-- =============================================
CREATE TABLE IF NOT EXISTS ride_bookings (
    id VARCHAR(36) PRIMARY KEY,
    rider_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    driver_id VARCHAR(36),
    pickup_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance_km DECIMAL(10, 2),
    estimated_fare DECIMAL(10, 2),
    final_fare DECIMAL(10, 2),
    co2_saved DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    rating DECIMAL(2, 1),
    review TEXT,
    FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- DONATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(36) PRIMARY KEY,
    donor_id VARCHAR(36),
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    campaign_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method ENUM('upi', 'card', 'netbanking', 'wallet') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_gateway_response JSON,
    anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- =============================================
-- USER ACTIVITY LOG (For analytics)
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'campaign', 'event', 'listing', 'ride', etc.
    entity_id VARCHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- ADMIN ACTIONS LOG
-- =============================================
CREATE TABLE IF NOT EXISTS admin_actions (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    action_type ENUM('approve', 'reject', 'suspend', 'activate', 'delete', 'modify', 'verify') NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'user', 'campaign', 'listing', 'event', etc.
    target_id VARCHAR(36) NOT NULL,
    reason TEXT,
    previous_state JSON,
    new_state JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'action_required') DEFAULT 'info',
    link VARCHAR(255),
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- USER IMPACT METRICS
-- =============================================
CREATE TABLE IF NOT EXISTS user_impact (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    total_co2_saved DECIMAL(12, 2) DEFAULT 0, -- in kg
    total_trees_planted INT DEFAULT 0,
    total_waste_exchanged DECIMAL(12, 2) DEFAULT 0, -- in kg
    total_rides_taken INT DEFAULT 0,
    total_events_attended INT DEFAULT 0,
    total_volunteer_hours DECIMAL(8, 2) DEFAULT 0,
    total_donations DECIMAL(12, 2) DEFAULT 0,
    eco_score INT DEFAULT 0, -- Gamification score
    badges JSON, -- Array of earned badges
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- ENERGY SOURCES (Static reference data)
-- =============================================
CREATE TABLE IF NOT EXISTS energy_sources (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    capacity VARCHAR(50),
    growth VARCHAR(20),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- ENERGY PROJECTS (Static reference data)
-- =============================================
CREATE TABLE IF NOT EXISTS energy_projects (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('solar', 'wind', 'hydro', 'geothermal', 'biomass') NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity VARCHAR(50),
    status ENUM('operational', 'construction', 'planning', 'completed') DEFAULT 'planning',
    completion_date DATE,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- ENERGY COMPANIES (Static reference data)
-- =============================================
CREATE TABLE IF NOT EXISTS energy_companies (
    id VARCHAR(36) PRIMARY KEY,
    energy_source_name VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    founded VARCHAR(20),
    employees VARCHAR(50),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TRANSPORT ROUTES (Static reference data)
-- =============================================
CREATE TABLE IF NOT EXISTS transport_routes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('bus', 'metro', 'bike', 'shuttle', 'carpool') NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    co2_saved VARCHAR(50),
    frequency VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- WASTE CATEGORIES (Static reference data)
-- =============================================
CREATE TABLE IF NOT EXISTS waste_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(10),
    count INT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_business_verification ON business_profiles(verification_status);
CREATE INDEX idx_community_verification ON community_profiles(verification_status);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_organizer ON campaigns(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_status ON forum_posts(status);
CREATE INDEX idx_waste_listings_status ON waste_listings(status);
CREATE INDEX idx_waste_listings_category ON waste_listings(category);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_ride_bookings_rider ON ride_bookings(rider_id);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read_status);
CREATE INDEX idx_energy_sources_order ON energy_sources(display_order);
CREATE INDEX idx_energy_projects_type ON energy_projects(type);
CREATE INDEX idx_energy_companies_source ON energy_companies(energy_source_name);
CREATE INDEX idx_transport_routes_type ON transport_routes(type);
CREATE INDEX idx_waste_categories_order ON waste_categories(display_order);

-- =============================================
-- SEED DEFAULT ADMIN USER
-- Password: Admin@123 (bcrypt hashed)
-- =============================================
INSERT INTO users (id, email, password_hash, name, role, status, email_verified)
VALUES (
    'admin-001',
    'admin@ecohub.com',
    '$2a$10$rIC/O4R4pJ8VB5B2X5JjOe1Y1Y9Y0Y9Y0Y9Y0Y9Y0Y9Y0Y9Y0Y9Y0', -- Replace with actual bcrypt hash
    'EcoHub Admin',
    'admin',
    'active',
    TRUE
);

-- Initialize admin's impact metrics
INSERT INTO user_impact (id, user_id)
VALUES ('impact-admin-001', 'admin-001');
