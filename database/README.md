# Gymshark Clone E-Commerce Database

Complete PostgreSQL database schema for the Gymshark Clone e-commerce app.

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)
1. Create a new Supabase project (separate from The Big 14)
2. Go to SQL Editor
3. Copy and paste `schema.sql`
4. Run the script

### Option 2: Local PostgreSQL
```bash
psql -U postgres -d gymshark_ecommerce < schema.sql
```

## 📊 Database Structure

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | Customer accounts & profiles |
| `user_preferences` | App settings (language, theme, notifications) |
| `user_social_accounts` | Google/Apple login connections |
| `addresses` | Shipping & billing addresses |

### Product Catalog

| Table | Purpose |
|-------|---------|
| `categories` | Product categories (hierarchical) |
| `products` | Product information |
| `product_images` | Product photos |
| `product_variants` | Size/color variations |
| `tags` | Product tags for filtering |
| `product_tags` | Product-tag relationships |

### Shopping

| Table | Purpose |
|-------|---------|
| `carts` | Active shopping carts |
| `cart_items` | Items in cart |
| `wishlists` | User wishlists |
| `wishlist_items` | Products in wishlist |

### Orders

| Table | Purpose |
|-------|---------|
| `orders` | Order records |
| `order_items` | Line items per order |
| `order_status_history` | Order status changes |

### Payments

| Table | Purpose |
|-------|---------|
| `payments` | Payment transactions |
| `user_payment_methods` | Saved cards (Stripe) |
| `discount_codes` | Promo codes |
| `discount_code_usage` | Code redemption tracking |

### Reviews

| Table | Purpose |
|-------|---------|
| `product_reviews` | Customer reviews |

## 🔑 Key Features

### Automatic Triggers
- **Order Numbers**: Auto-generated format `GS-2024-000001`
- **Timestamps**: `updated_at` auto-updates on changes
- **Stock Management**: Inventory decrements on order

### Data Integrity
- UUID primary keys
- Foreign key constraints
- Check constraints (ratings 1-5, positive quantities)
- Unique constraints (emails, SKUs, slugs)

### Security
- Passwords stored as hashes only
- Social login IDs isolated
- Payment data uses provider tokens (Stripe)
- Only last 4 digits of cards stored locally

## 🌐 Supabase Connection

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📈 Row Level Security (RLS)

Enable RLS policies for security:

```sql
-- Users can only see their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Addresses policy
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses" 
ON addresses FOR ALL 
USING (auth.uid() = user_id);
```

## 🔗 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📊 Sample Queries

### Get product with variants
```sql
SELECT p.*, pv.size, pv.stock_quantity
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug = 'apex-tank';
```

### Get user's cart
```sql
SELECT ci.*, p.name, p.base_price, pv.variant_name
FROM cart_items ci
JOIN carts c ON ci.cart_id = c.id
JOIN products p ON ci.product_id = p.id
LEFT JOIN product_variants pv ON ci.variant_id = pv.id
WHERE c.user_id = 'user-uuid';
```

### Get order with items
```sql
SELECT o.*, 
       json_agg(json_build_object(
         'product_name', oi.product_name,
         'quantity', oi.quantity,
         'price', oi.unit_price
       )) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 'user-uuid'
GROUP BY o.id;
```

## 🚀 Next Steps

1. **Set up Supabase project** (separate from other apps)
2. **Run schema.sql** to create tables
3. **Enable RLS policies** for security
4. **Connect app** using Supabase client
5. **Set up Stripe** for payments
6. **Deploy webhooks** for order processing

## 📁 Files

- `schema.sql` - Complete database schema
- `seed.sql` - Sample data (optional)
- `migrations/` - Schema version control
