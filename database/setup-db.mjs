// Supabase Database Setup Script
// Run with: node database/setup-db.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

const tables = [
  // USERS
  {
    name: 'users',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      )
    `
  },
  {
    name: 'user_social_accounts',
    sql: `
      CREATE TABLE IF NOT EXISTS user_social_accounts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR(50) NOT NULL,
        provider_user_id VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(provider, provider_user_id)
      )
    `
  },
  // ADDRESSES
  {
    name: 'addresses',
    sql: `
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        address_type VARCHAR(20) DEFAULT 'shipping',
        is_default BOOLEAN DEFAULT FALSE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        street_address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(2) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  // PRODUCTS
  {
    name: 'categories',
    sql: `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        parent_id UUID REFERENCES categories(id),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  {
    name: 'products',
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sku VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category_id UUID REFERENCES categories(id),
        base_price DECIMAL(10, 2) NOT NULL,
        compare_at_price DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  {
    name: 'product_images',
    sql: `
      CREATE TABLE IF NOT EXISTS product_images (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        alt_text VARCHAR(255),
        sort_order INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  {
    name: 'product_variants',
    sql: `
      CREATE TABLE IF NOT EXISTS product_variants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        sku VARCHAR(100) UNIQUE NOT NULL,
        variant_name VARCHAR(100) NOT NULL,
        size VARCHAR(50),
        color VARCHAR(50),
        price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  // CART
  {
    name: 'carts',
    sql: `
      CREATE TABLE IF NOT EXISTS carts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  {
    name: 'cart_items',
    sql: `
      CREATE TABLE IF NOT EXISTS cart_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        variant_id UUID REFERENCES product_variants(id),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        unit_price DECIMAL(10, 2) NOT NULL,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  // ORDERS
  {
    name: 'orders',
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id),
        guest_email VARCHAR(255),
        status VARCHAR(30) DEFAULT 'pending',
        payment_status VARCHAR(30) DEFAULT 'pending',
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping_total DECIMAL(10, 2) DEFAULT 0.00,
        tax_total DECIMAL(10, 2) DEFAULT 0.00,
        total DECIMAL(10, 2) NOT NULL,
        shipping_address JSONB NOT NULL,
        tracking_number VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  {
    name: 'order_items',
    sql: `
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        variant_id UUID REFERENCES product_variants(id),
        product_name VARCHAR(255) NOT NULL,
        variant_name VARCHAR(100),
        sku VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  // PAYMENTS
  {
    name: 'payments',
    sql: `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        payment_method VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        status VARCHAR(30) DEFAULT 'pending',
        card_last_four VARCHAR(4),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  // WISHLIST
  {
    name: 'wishlists',
    sql: `
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) DEFAULT 'My Wishlist',
        is_default BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  {
    name: 'wishlist_items',
    sql: `
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        variant_id UUID REFERENCES product_variants(id),
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  },
  // REVIEWS
  {
    name: 'product_reviews',
    sql: `
      CREATE TABLE IF NOT EXISTS product_reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        review_text TEXT,
        is_verified_purchase BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  }
]

async function setupDatabase() {
  console.log('🚀 Setting up Gymshark E-Commerce Database...\n')
  
  for (const table of tables) {
    try {
      // Try to create table using raw SQL via Supabase RPC
      const { error } = await supabase.rpc('exec_sql', { 
        sql: table.sql 
      })
      
      if (error) {
        // If RPC doesn't exist, try alternative method
        console.log(`📋 Table: ${table.name}`)
        console.log(`SQL: ${table.sql}`)
        console.log('⚠️  Please run this SQL manually in Supabase SQL Editor\n')
      } else {
        console.log(`✅ Created table: ${table.name}`)
      }
    } catch (err) {
      console.log(`📋 Table: ${table.name}`)
      console.log('⚠️  Copy SQL to Supabase SQL Editor\n')
    }
  }
  
  console.log('\n📚 Manual Setup Instructions:')
  console.log('1. Go to: https://supabase.com/dashboard/project/yzcufmbgcjhgswcdjhfb/sql-editor')
  console.log('2. Click "New query"')
  console.log('3. Copy the SQL from database/setup.sql')
  console.log('4. Click "Run"')
}

setupDatabase()
