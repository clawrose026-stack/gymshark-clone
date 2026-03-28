import { createClient } from '@supabase/supabase-js'

// Gymshark Clone E-Commerce Database
// Separate from The Big 14 and other apps
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yzcufmbgcjhgswcdjhfb.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__7X8rKLz-Vo4_Tryy7FnWg_zXXfsr92'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
})

// Database types (for TypeScript)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          avatar_url: string | null
          loyalty_points: number
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          phone?: string
          avatar_url?: string
        }
      }
      products: {
        Row: {
          id: string
          sku: string
          name: string
          slug: string
          description: string | null
          base_price: number
          compare_at_price: number | null
          is_active: boolean
          is_featured: boolean
          created_at: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          variant_name: string
          size: string | null
          color: string | null
          price_adjustment: number
          stock_quantity: number
          is_active: boolean
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          unit_price: number
          added_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: string
          payment_status: string
          fulfillment_status: string
          subtotal: number
          shipping_total: number
          tax_total: number
          total: number
          shipping_address: object
          created_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          product_name: string
          variant_name: string | null
          sku: string
          quantity: number
          unit_price: number
          total_price: number
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          address_type: string
          is_default: boolean
          first_name: string
          last_name: string
          street_address: string
          apartment_suite: string | null
          city: string
          state_province: string | null
          postal_code: string
          country: string
          phone: string | null
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          name: string
          is_default: boolean
          created_at: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          wishlist_id: string
          product_id: string
          variant_id: string | null
          added_at: string
        }
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id: string | null
          rating: number
          title: string | null
          review_text: string | null
          is_verified_purchase: boolean
          status: string
          created_at: string
        }
      }
    }
  }
}

// Helper functions

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) throw error
  return data
}

export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(*),
      images:product_images(*)
    `)
    .eq('category.slug', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(10)
  
  if (error) throw error
  return data
}

export async function getOrCreateCart(userId?: string, sessionId?: string) {
  let query = supabase.from('carts').select('*')
  
  if (userId) {
    query = query.eq('user_id', userId)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  }
  
  const { data: existingCart } = await query.single()
  
  if (existingCart) {
    return existingCart
  }
  
  // Create new cart
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({ user_id: userId, session_id: sessionId })
    .select()
    .single()
  
  if (error) throw error
  return newCart
}

export async function getCartItems(cartId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*),
      variant:product_variants(*)
    `)
    .eq('cart_id', cartId)
  
  if (error) throw error
  return data
}

export async function addToCart(
  cartId: string,
  productId: string,
  variantId: string | null,
  quantity: number,
  unitPrice: number
) {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      unit_price: unitPrice
    }, {
      onConflict: 'cart_id,variant_id'
    })
    .select()
  
  if (error) throw error
  return data
}

export async function createOrder(orderData: {
  user_id?: string
  guest_email?: string
  shipping_address: object
  billing_address?: object
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  items: Array<{
    product_id: string
    variant_id: string | null
    product_name: string
    variant_name: string | null
    sku: string
    quantity: number
    unit_price: number
  }>
}) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.user_id,
      guest_email: orderData.guest_email,
      shipping_address: orderData.shipping_address,
      billing_address: orderData.billing_address,
      subtotal: orderData.subtotal,
      shipping_total: orderData.shipping_total,
      tax_total: orderData.tax_total,
      total: orderData.total,
      status: 'pending',
      payment_status: 'pending'
    })
    .select()
    .single()
  
  if (orderError) throw orderError
  
  // Insert order items
  const orderItems = orderData.items.map(item => ({
    ...item,
    order_id: order.id,
    total_price: item.quantity * item.unit_price
  }))
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) throw itemsError
  
  return order
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getUserAddresses(userId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getUserWishlist(userId: string) {
  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single()
  
  if (wishlistError && wishlistError.code !== 'PGRST116') throw wishlistError
  
  if (!wishlist) {
    // Create default wishlist
    const { data: newWishlist, error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, name: 'My Wishlist', is_default: true })
      .select()
      .single()
    
    if (error) throw error
    return newWishlist
  }
  
  // Get wishlist items
  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('wishlist_id', wishlist.id)
  
  if (error) throw error
  return { ...wishlist, items: data }
}

export async function addToWishlist(wishlistId: string, productId: string, variantId?: string) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert({
      wishlist_id: wishlistId,
      product_id: productId,
      variant_id: variantId || null
    })
    .select()
  
  if (error) throw error
  return data
}

export async function submitProductReview(reviewData: {
  product_id: string
  user_id: string
  order_id?: string
  rating: number
  title?: string
  review_text?: string
  is_verified_purchase?: boolean
}) {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      ...reviewData,
      status: 'pending'
    })
    .select()
  
  if (error) throw error
  return data
}
