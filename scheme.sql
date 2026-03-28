-- ============================================
-- CORE TABLES (Using native PostgreSQL UUID)
-- ============================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
-- User Social Accounts
CREATE TABLE IF NOT EXISTS user_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);
-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) DEFAULT 'shipping',
    is_default BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    street_address VARCHAR(255) NOT NULL,
    apartment_suite VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id UUID REFERENCES categories(id),
    base_price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    weight_kg DECIMAL(8, 2),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    track_inventory BOOLEAN DEFAULT TRUE,
    low_stock_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    color_hex VARCHAR(7),
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Carts
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);
-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    guest_email VARCHAR(255),
    status VARCHAR(30) DEFAULT 'pending',
    payment_status VARCHAR(30) DEFAULT 'pending',
    fulfillment_status VARCHAR(30) DEFAULT 'unfulfilled',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_total DECIMAL(10, 2) DEFAULT 0.00,
    shipping_total DECIMAL(10, 2) DEFAULT 0.00,
    tax_total DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    shipping_method VARCHAR(100),
    shipping_carrier VARCHAR(50),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    customer_notes TEXT,
    internal_notes TEXT,
    is_gift BOOLEAN DEFAULT FALSE,
    gift_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100),
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    quantity_returned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_payment_id VARCHAR(255),
    provider_charge_id VARCHAR(255),
    status VARCHAR(30) DEFAULT 'pending',
    failure_message TEXT,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'My Wishlist',
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Wishlist Items
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Product Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
    year_str VARCHAR;
    sequence_num INTEGER;
    new_order_number VARCHAR;
BEGIN
    year_str := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)), 0) + 1
    INTO sequence_num FROM orders WHERE order_number LIKE 'GS-' || year_str || '-%';
    new_order_number := 'GS-' || year_str || '-' || LPAD(sequence_num::TEXT, 6, '0');
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();
-- Update stock on order
CREATE OR REPLACE FUNCTION decrement_variant_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.variant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_decrement_stock ON order_items;
CREATE TRIGGER trigger_decrement_stock AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION decrement_variant_stock();
-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Men', 'men', 'Men''s gym wear', 1),
('Women', 'women', 'Women''s gym wear', 2),
('Accessories', 'accessories', 'Gym accessories', 3)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id, sort_order) 
SELECT 'Tanks', 'men-tanks', id, 1 FROM categories WHERE slug = 'men'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id, sort_order) 
SELECT 'Stringers', 'men-stringers', id, 2 FROM categories WHERE slug = 'men'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id, sort_order) 
SELECT 'Shorts', 'men-shorts', id, 3 FROM categories WHERE slug = 'men'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id, sort_order) 
SELECT 'Seamless', 'women-seamless', id, 1 FROM categories WHERE slug = 'women'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (sku, name, slug, description, category_id, base_price, is_featured) 
SELECT 'GS-001', 'APEX TANK', 'apex-tank', 'Performance tank top for intense workouts', id, 45.00, TRUE FROM categories WHERE slug = 'men-tanks'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (sku, name, slug, description, category_id, base_price, is_featured) 
SELECT 'GS-002', 'LEGACY STRINGER', 'legacy-stringer', 'Classic stringer vest with modern fit', id, 38.00, TRUE FROM categories WHERE slug = 'men-stringers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (sku, name, slug, description, category_id, base_price, is_featured) 
SELECT 'GS-003', 'VITAL SEAMLESS', 'vital-seamless', 'Seamless compression wear', id, 52.00, TRUE FROM categories WHERE slug = 'women-seamless'
ON CONFLICT (slug) DO NOTHING;
-- Insert variants
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-001-S', 'Small', 'S', 50 FROM products p WHERE p.slug = 'apex-tank'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-001-M', 'Medium', 'M', 100 FROM products p WHERE p.slug = 'apex-tank'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-001-L', 'Large', 'L', 75 FROM products p WHERE p.slug = 'apex-tank'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-001-XL', 'X-Large', 'XL', 50 FROM products p WHERE p.slug = 'apex-tank'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-002-S', 'Small', 'S', 40 FROM products p WHERE p.slug = 'legacy-stringer'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-002-M', 'Medium', 'M', 80 FROM products p WHERE p.slug = 'legacy-stringer'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-002-L', 'Large', 'L', 60 FROM products p WHERE p.slug = 'legacy-stringer'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-003-XS', 'X-Small', 'XS', 30 FROM products p WHERE p.slug = 'vital-seamless'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-003-S', 'Small', 'S', 60 FROM products p WHERE p.slug = 'vital-seamless'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-003-M', 'Medium', 'M', 90 FROM products p WHERE p.slug = 'vital-seamless'
ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, variant_name, size, stock_quantity)
SELECT p.id, 'GS-003-L', 'Large', 'L', 70 FROM products p WHERE p.slug = 'vital-seamless'
ON CONFLICT (sku) DO NOTHING;