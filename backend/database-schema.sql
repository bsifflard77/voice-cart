-- VoiceCart Database Schema
-- PostgreSQL

-- Stores table: User-defined stores (Walmart, Sam's Club, etc.)
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table: Store-specific departments (Deli, Produce, etc.)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, name)
);

-- Items table: Shopping list items with history
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'picked_up', 'deleted')),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    picked_up_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_items_store_status ON items(store_id, status);
CREATE INDEX idx_items_department ON items(department_id);
CREATE INDEX idx_items_picked_up_at ON items(picked_up_at);
CREATE INDEX idx_departments_store ON departments(store_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data: Example stores
INSERT INTO stores (name) VALUES
    ('Walmart'),
    ('Sam''s Club'),
    ('Market Basket');

-- Seed data: Common departments for Walmart
INSERT INTO departments (store_id, name, display_order) VALUES
    (1, 'Produce', 1),
    (1, 'Deli', 2),
    (1, 'Bakery', 3),
    (1, 'Meat & Seafood', 4),
    (1, 'Dairy & Eggs', 5),
    (1, 'Frozen', 6),
    (1, 'Pantry & Dry Goods', 7),
    (1, 'Beverages', 8),
    (1, 'Snacks', 9),
    (1, 'Health & Beauty', 10),
    (1, 'Household', 11),
    (1, 'Other', 99);

-- Seed data: Common departments for Sam's Club
INSERT INTO departments (store_id, name, display_order) VALUES
    (2, 'Produce', 1),
    (2, 'Deli', 2),
    (2, 'Bakery', 3),
    (2, 'Meat & Seafood', 4),
    (2, 'Dairy & Eggs', 5),
    (2, 'Frozen', 6),
    (2, 'Pantry & Dry Goods', 7),
    (2, 'Beverages', 8),
    (2, 'Snacks', 9),
    (2, 'Health & Beauty', 10),
    (2, 'Household', 11),
    (2, 'Other', 99);

-- Seed data: Common departments for Market Basket
INSERT INTO departments (store_id, name, display_order) VALUES
    (3, 'Produce', 1),
    (3, 'Deli', 2),
    (3, 'Bakery', 3),
    (3, 'Meat & Seafood', 4),
    (3, 'Dairy & Eggs', 5),
    (3, 'Frozen', 6),
    (3, 'Pantry & Dry Goods', 7),
    (3, 'Beverages', 8),
    (3, 'Snacks', 9),
    (3, 'Health & Beauty', 10),
    (3, 'Household', 11),
    (3, 'Other', 99);