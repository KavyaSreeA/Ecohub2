-- Seed data for static reference tables
-- This file populates tables with data that was previously hardcoded

-- =============================================
-- ENERGY SOURCES
-- =============================================
INSERT INTO energy_sources (id, name, icon, description, capacity, growth, image_url, display_order) VALUES
('energy-source-1', 'Solar Power', '☀️', 'Harness the power of the sun', '500 MW', '+15%', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', 1),
('energy-source-2', 'Wind Energy', '💨', 'Clean energy from wind turbines', '350 MW', '+22%', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80', 2),
('energy-source-3', 'Hydroelectric', '💧', 'Power from flowing water', '800 MW', '+8%', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80', 3),
('energy-source-4', 'Geothermal', '🌋', 'Earth\'s natural heat', '150 MW', '+12%', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 4);

-- =============================================
-- ENERGY PROJECTS
-- =============================================
INSERT INTO energy_projects (id, name, type, location, capacity, status, completion_date, image_url, display_order) VALUES
('energy-project-1', 'Desert Sun Solar Farm', 'solar', 'Nevada, USA', '250 MW', 'operational', '2023-06-15', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', 1),
('energy-project-2', 'Coastal Wind Project', 'wind', 'Denmark', '180 MW', 'construction', '2024-08-01', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80', 2),
('energy-project-3', 'Mountain Hydro Station', 'hydro', 'Norway', '400 MW', 'operational', '2022-03-20', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80', 3),
('energy-project-4', 'Urban Solar Initiative', 'solar', 'Tokyo, Japan', '75 MW', 'planning', '2025-01-15', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', 4);

-- =============================================
-- ENERGY COMPANIES
-- =============================================
INSERT INTO energy_companies (id, energy_source_name, company_name, description, address, phone, email, website, founded, employees, image_url) VALUES
('energy-company-1', 'Solar Power', 'SunBright Energy Solutions', 'Leading provider of residential and commercial solar panel installations. We help homes and businesses harness the power of the sun with cutting-edge photovoltaic technology.', '123 Solar Avenue, Bangalore, Karnataka 560001', '+91 80 4567 8901', 'contact@sunbright.energy', 'www.sunbright.energy', '2015', '500+', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'),
('energy-company-2', 'Wind Energy', 'WindForce Renewables', 'Pioneering wind energy solutions across India. Our wind farms generate clean electricity for millions of households while creating sustainable jobs.', '456 Wind Mill Road, Chennai, Tamil Nadu 600001', '+91 44 5678 9012', 'info@windforce.in', 'www.windforce.in', '2012', '750+', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80'),
('energy-company-3', 'Hydroelectric', 'HydroPower India Ltd.', 'Harnessing the power of water to generate sustainable electricity. Our hydroelectric plants provide reliable, renewable energy to communities across the nation.', '789 Dam View Road, Dehradun, Uttarakhand 248001', '+91 135 234 5678', 'contact@hydropowerindia.com', 'www.hydropowerindia.com', '2008', '1200+', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80'),
('energy-company-4', 'Geothermal', 'GeoTherm Energy Systems', 'Tapping into Earth\'s natural heat for sustainable power generation. Our geothermal plants provide consistent, clean energy regardless of weather conditions.', '321 Thermal Springs Lane, Pune, Maharashtra 411001', '+91 20 6789 0123', 'hello@geotherm.energy', 'www.geotherm.energy', '2018', '300+', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80');

-- =============================================
-- TRANSPORT ROUTES
-- =============================================
INSERT INTO transport_routes (id, name, type, from_location, to_location, duration, co2_saved, frequency, display_order) VALUES
('route-1', 'Downtown Express', 'bus', 'Central Station', 'Business District', '25 min', '2.5 kg', 'Every 10 min', 1),
('route-2', 'Green Line Metro', 'metro', 'Airport', 'City Center', '35 min', '4.2 kg', 'Every 5 min', 2),
('route-3', 'Bike Share Route', 'bike', 'University', 'Tech Park', '20 min', '3.0 kg', 'On-demand', 3),
('route-4', 'Electric Shuttle', 'shuttle', 'Mall', 'Residential Area', '15 min', '1.8 kg', 'Every 15 min', 4);

-- =============================================
-- WASTE CATEGORIES
-- =============================================
INSERT INTO waste_categories (id, name, icon, count, display_order) VALUES
('waste-cat-1', 'Paper & Cardboard', '📄', 156, 1),
('waste-cat-2', 'Metals', '🔧', 89, 2),
('waste-cat-3', 'Plastics', '♻️', 234, 3),
('waste-cat-4', 'Electronics', '📱', 67, 4),
('waste-cat-5', 'Organic', '🌿', 178, 5),
('waste-cat-6', 'Glass', '🫙', 92, 6);

-- =============================================
-- SEED CAMPAIGNS (if not already in campaigns table)
-- =============================================
INSERT INTO campaigns (id, title, description, category, image_url, goal_amount, raised_amount, start_date, organizer_id, status) VALUES
('campaign-1', 'Save the Amazon Rainforest', 'Protect 1 million acres of rainforest', 'forest', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', 100000, 75000, '2024-01-01', 'admin-001', 'active'),
('campaign-2', 'Ocean Cleanup Initiative', 'Remove plastic from Pacific Ocean', 'ocean', 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400', 50000, 32000, '2024-01-01', 'admin-001', 'active'),
('campaign-3', 'Wildlife Corridor Project', 'Create safe passages for wildlife migration', 'wildlife', 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400', 75000, 45000, '2024-01-01', 'admin-001', 'active'),
('campaign-4', 'Coral Reef Restoration', 'Restore damaged coral ecosystems', 'ocean', 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400', 60000, 28000, '2024-01-01', 'admin-001', 'active')
ON DUPLICATE KEY UPDATE title=title;

-- =============================================
-- SEED EVENTS (if not already in events table)
-- =============================================
INSERT INTO events (id, title, description, event_type, image_url, event_date, location, max_participants, current_participants, organizer_id, status) VALUES
('event-1', 'Beach Cleanup Day', 'Join us for a community beach cleanup event', 'cleanup', 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400', '2024-02-15 09:00:00', 'Santa Monica Beach', 150, 0, 'admin-001', 'upcoming'),
('event-2', 'Tree Planting Marathon', 'Help us plant 1000 trees in one day', 'plantation', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', '2024-02-20 08:00:00', 'Central Park', 200, 0, 'admin-001', 'upcoming'),
('event-3', 'Wildlife Photography Workshop', 'Learn wildlife photography techniques', 'workshop', 'https://images.unsplash.com/photo-1504173010664-32509aeebb62?w=400', '2024-03-01 10:00:00', 'Yellowstone', 50, 0, 'admin-001', 'upcoming')
ON DUPLICATE KEY UPDATE title=title;

-- =============================================
-- SEED FORUM POSTS (if not already in forum_posts table)
-- =============================================
INSERT INTO forum_posts (id, title, content, author_id, category, likes_count, comments_count, status) VALUES
('forum-post-1', 'Tips for reducing plastic usage', 'Here are my top 10 tips for reducing plastic in daily life...', 'admin-001', 'tips', 45, 12, 'approved'),
('forum-post-2', 'Local conservation groups in Seattle', 'Looking for volunteers to join our weekend cleanup initiatives!', 'admin-001', 'general', 23, 8, 'approved'),
('forum-post-3', 'Success story: Community garden', 'Our neighborhood transformed an abandoned lot into a thriving community garden!', 'admin-001', 'general', 67, 24, 'approved')
ON DUPLICATE KEY UPDATE title=title;
