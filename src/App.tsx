import { useState, useEffect, useRef } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

// Auth types
interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

// SVG Icon Components
const IconHome = (_props: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

const IconSearch = (_props: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
)

const IconCart = (_props: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
)

const IconUser = (_props: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

const IconArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
)

const IconHeart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
)

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const IconApple = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const IconUserForm = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

// Profile Page Icons
const IconGift = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"></polyline>
    <rect x="2" y="7" width="20" height="5"></rect>
    <line x1="12" y1="22" x2="12" y2="7"></line>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
)

const IconCreditCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
)

const IconTranslate = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <path d="M12 5v14M5 5l14 14M19 5L5 19"></path>
  </svg>
)

const IconPalette = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"></path>
    <path d="M12 6a6 6 0 0 1 6 6"></path>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
)

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
)

const IconHeadphones = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
  </svg>
)

const IconHandshake = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 19.5 9 21l-6-6 2.5-1.5"></path>
    <path d="m13.5 19.5 2.5 1.5 6-6-2.5-1.5"></path>
    <path d="M9 15a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2"></path>
    <path d="M12 11.5V7"></path>
    <path d="m16 8 3-3-2-2-3 3"></path>
    <path d="m8 8-3-3 2-2 3 3"></path>
  </svg>
)

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
)

const IconPackage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"></path>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
    <path d="m3.3 7 8.7 5 8.7-5"></path>
    <path d="M12 22V12"></path>
  </svg>
)

const IconTruck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3"></path>
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path>
    <path d="M14 17h1"></path>
    <circle cx="7.5" cy="17.5" r="2.5"></circle>
    <circle cx="17.5" cy="17.5" r="2.5"></circle>
  </svg>
)

const IconMapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const IconCheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

// Order Confirmation Component
const OrderConfirmation = ({ total, onContinueShopping, onViewOrderStatus }: { 
  total: number; 
  onContinueShopping: () => void;
  onViewOrderStatus: () => void;
}) => (
  <div className="checkout-step slide-in order-confirmation">
    <div className="confirmation-icon">✓</div>
    <h3 className="step-title">Order Confirmed!</h3>
    <p className="confirmation-message">
      Thank you for your purchase. Your order has been received and is being processed.
    </p>
    <div className="confirmation-total-box">
      <span className="confirmation-total-label">Order Total</span>
      <span className="confirmation-total-amount">R{total.toFixed(2)}</span>
    </div>
    <p className="confirmation-email-notice">
      A confirmation email has been sent to your email address.
    </p>
    <div className="confirmation-actions">
      <button 
        className="btn btn-primary btn-full"
        onClick={onContinueShopping}
      >
        Continue Shopping
      </button>
      <button 
        className="btn btn-outline btn-full"
        onClick={onViewOrderStatus}
      >
        Order Status
      </button>
    </div>
  </div>
)

// Order Status Timeline Component
const OrderStatusTimeline = ({ status }: { status: string }) => {
  const milestones = [
    { id: 'placed', label: 'Order Placed', icon: <IconCheckCircle /> },
    { id: 'confirmed', label: 'Payment Confirmed', icon: <IconCreditCard /> },
    { id: 'processing', label: 'Processing', icon: <IconPackage /> },
    { id: 'shipped', label: 'Shipped', icon: <IconTruck /> },
    { id: 'delivered', label: 'Delivered', icon: <IconMapPin /> },
  ]
  
  const currentIndex = milestones.findIndex(m => m.id === status)
  
  return (
    <div className="order-timeline">
      {milestones.map((milestone, index) => (
        <div 
          key={milestone.id} 
          className={`timeline-item ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''}`}
        >
          <div className="timeline-icon">{milestone.icon}</div>
          <div className="timeline-content">
            <span className="timeline-label">{milestone.label}</span>
            {index === currentIndex && <span className="timeline-status">Current</span>}
          </div>
          {index < milestones.length - 1 && <div className="timeline-line" />}
        </div>
      ))}
    </div>
  )
}

// Payment Method Icons
// Database types
interface Product {
  id: string
  name: string
  slug: string
  base_price: number
  category_id: string
  description: string | null
  is_active: boolean
  is_featured: boolean
  image: string
  category?: { name: string; slug: string }
  variants?: ProductVariant[]
}

interface ProductVariant {
  id: string
  product_id: string
  sku: string
  variant_name: string
  size: string | null
  color: string | null
  stock_quantity: number
  price_adjustment: number
}

// Hero products (static)
const heroProducts = [
  { id: 1, title: 'NEW DROPS', subtitle: 'APEX COLLECTION', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop' },
  { id: 2, title: 'BESTSELLERS', subtitle: 'LEGACY SERIES', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop' },
  { id: 3, title: 'SEAMLESS', subtitle: 'SECOND SKIN FEEL', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1000&fit=crop' },
]

// Default sizes if no variants
const defaultSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

function App() {
  const [currentPage, setCurrentPage] = useState('splash')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [cart, setCart] = useState<{product: Product, size: string, quantity: number}[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Auth state
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [signupError, setSignupError] = useState('')
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'ZA'
  })
  
  // Order status state - used for viewing specific order details
  const [_selectedOrder, _setSelectedOrder] = useState<any>(null)
  
  // Store order total for confirmation screen (before cart is cleared)
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState<number>(0)
  
  // Check for payment success on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const paymentStatus = urlParams.get('payment')
    const orderRef = urlParams.get('ref')
    
    if (paymentStatus === 'success' && orderRef) {
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname)
      // Update order status to paid and get order details
      supabase.from('orders').update({ status: 'paid' }).eq('order_reference', orderRef).select().single().then(({ data }) => {
        // Store the order total for display
        if (data) {
          setConfirmedOrderTotal(data.total_amount)
        }
        // Clear cart after storing total
        setCart([])
        // Show order confirmation
        setCheckoutStep(3)
        setCurrentPage('checkout')
      })
    }
  }, [])
  const [_savedAddress] = useState({
    street: '14 10th Street, Greymont',
    city: 'Johannesburg',
    postalCode: '2195',
    country: 'ZA'
  })
  const [_showAddressForm, _setShowAddressForm] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  
  // Google Maps state
  const [mapCenter, setMapCenter] = useState({ lat: -26.2041, lng: 28.0473 }) // Johannesburg
  const [markerPosition, setMarkerPosition] = useState({ lat: -26.2041, lng: 28.0473 })
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  // Check auth session on mount
  useEffect(() => {
    checkSession()
    fetchProducts()
    
    // Set up auth state change listener for session persistence
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          })
          // Persist session to localStorage (no expiration - stays until logout)
          localStorage.setItem('gymshark-session', JSON.stringify({
            user: session.user,
            timestamp: Date.now()
          }))
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem('gymshark-session')
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          })
          // Update stored session with refreshed token
          localStorage.setItem('gymshark-session', JSON.stringify({
            user: session.user,
            timestamp: Date.now()
          }))
        }
      }
    )
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      // FIRST: Restore from localStorage immediately for fast UI
      const storedSession = localStorage.getItem('gymshark-session')
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession)
          if (parsed.user) {
            console.log('Restoring session from localStorage:', parsed.user.email)
            setUser({
              id: parsed.user.id,
              email: parsed.user.email || '',
            })
          }
        } catch (e) {
          localStorage.removeItem('gymshark-session')
        }
      }
      
      // THEN: Verify with Supabase (this runs in background)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        console.log('Supabase session verified:', session.user.email)
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        })
        // Update stored session
        localStorage.setItem('gymshark-session', JSON.stringify({
          user: session.user,
          timestamp: Date.now()
        }))
      } else if (!storedSession) {
        // Only clear user if no localStorage AND no Supabase session
        console.log('No session found anywhere')
        setUser(null)
      }
    } catch (error) {
      console.error('Session error:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })
      
      if (error) throw error
      
      if (data.user && data.session) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
        }
        setUser(userData)
        
        // Persist to localStorage (no expiration - stays until logout)
        localStorage.setItem('gymshark-session', JSON.stringify({
          user: data.user,
          timestamp: Date.now()
        }))
        
        setCurrentPage('home')
        setLoginEmail('')
        setLoginPassword('')
      }
    } catch (error: any) {
      setLoginError(error.message || 'Login failed')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError('')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: profileData.email,
        password: profileData.password,
        options: {
          data: {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
          }
        }
      })
      
      if (error) throw error
      
      if (data.user && data.session) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: profileData.email,
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            password_hash: 'supabase-auth',
          })
        
        if (profileError) console.error('Profile error:', profileError)
        
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
        }
        setUser(userData)
        
        // Persist to localStorage (no expiration - stays until logout)
        localStorage.setItem('gymshark-session', JSON.stringify({
          user: data.user,
          timestamp: Date.now()
        }))
        
        setCurrentPage('home')
        setProfileData({ firstName: '', lastName: '', email: '', password: '' })
      }
    } catch (error: any) {
      setSignupError(error.message || 'Signup failed')
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setCart([])
      // Clear localStorage on logout
      localStorage.removeItem('gymshark-session')
      setCurrentPage('home')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Add default images based on category
      const productsWithImages = (data || []).map((p: Product) => ({
        ...p,
        image: getProductImage(p.category?.slug || p.slug)
      }))
      
      setProducts(productsWithImages)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductImage = (slug: string) => {
    const images: Record<string, string> = {
      'apex-tank': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=800&fit=crop',
      'legacy-stringer': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop',
      'vital-seamless': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop',
      'men-tanks': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=800&fit=crop',
      'men-stringers': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop',
      'women-seamless': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop',
    }
    return images[slug] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop'
  }

  const addToCart = (product: typeof products[0], size: string) => {
    const existingItem = cart.find(item => item.product.id === product.id && item.size === size)
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id && item.size === size 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, size, quantity: 1 }])
    }
    setCurrentPage('home')
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(index)
    } else {
      const newCart = [...cart]
      newCart[index].quantity = newQuantity
      setCart(newCart)
    }
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.base_price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  // SPLASH PAGE
  if (currentPage === 'splash') {
    // If already logged in, skip splash and go to store
    if (user) {
      setCurrentPage('home')
      return null
    }
    return (
      <div className="page splash-page">
        <div className="splash-fullscreen">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1200&fit=crop" 
            alt="Gymshark Athlete" 
            className="splash-full-image"
          />
          
          {/* Exit Button */}
          <button className="splash-exit-btn" onClick={() => setCurrentPage('home')}>
            <IconClose />
          </button>
          
          {/* Logo */}
          <div className="splash-logo-overlay">
            <h1 className="splash-logo-text">GYMSHARK</h1>
          </div>
          
          {/* Buttons on top of image */}
          <div className="splash-actions-overlay">
            <button className="btn btn-primary btn-glass" onClick={() => setCurrentPage('createAccount')}>
              CREATE ACCOUNT
            </button>
            <button className="btn btn-link btn-link-white" onClick={() => setCurrentPage('login')}>
              LOG IN
            </button>
          </div>
        </div>
      </div>
    )
  }

  // CREATE ACCOUNT PAGE
  if (currentPage === 'createAccount') {
    // Redirect to home if already logged in
    if (user) {
      setCurrentPage('home')
      return null
    }
    return (
      <div className="page create-account-page">
        <header className="create-header slim-board">
          <button className="icon-btn" onClick={() => setCurrentPage('splash')}>
            <IconArrowLeft />
          </button>
          <h2 className="create-title">CREATE ACCOUNT</h2>
          <div className="icon-btn-placeholder"></div>
        </header>

        <form onSubmit={handleSignup} className="create-form slim-board">
          {signupError && (
            <div className="auth-error" style={{ marginBottom: '16px' }}>{signupError}</div>
          )}
          
          {/* Social Login */}
          <div className="social-login-section">
            <p className="social-login-title">CREATE ACCOUNT WITH</p>
            <div className="social-login-buttons">
              <button type="button" className="social-btn google-btn">
                <IconGoogle />
                <span>Gmail</span>
              </button>
              <button type="button" className="social-btn apple-btn">
                <IconApple />
                <span>Apple</span>
              </button>
            </div>
            <div className="divider">
              <span>or</span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3 className="form-section-title">CREATE YOUR ACCOUNT</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">FIRST NAME</label>
                <div className="form-input-wrapper">
                  <IconUserForm />
                  <input 
                    type="text" 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    placeholder="John" 
                    required 
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">SURNAME</label>
                <div className="form-input-wrapper">
                  <IconUserForm />
                  <input 
                    type="text" 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    placeholder="Doe" 
                    required 
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <div className="form-input-wrapper">
                <IconMail />
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="john.doe@example.com" 
                  required 
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <div className="form-input-wrapper">
                <IconLock />
                <input 
                  type="password" 
                  value={profileData.password}
                  onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                  placeholder="Min 8 characters" 
                  required 
                  minLength={8}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
            </label>
            
            <button type="submit" className="btn btn-primary btn-full">
              {authLoading ? 'Creating Account...' : 'CREATE ACCOUNT'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ONBOARDING PAGE
  if (currentPage === 'onboarding') {
    return (
      <div className="page onboarding-page">
        <div className="onboarding-content slim-board">
          <h2 className="onboarding-header">YOU'RE ON THE WAITLIST</h2>
          
          <ul className="onboarding-list">
            <li className="onboarding-item">
              <span className="bullet"><IconCheck /></span>
              <span>EARLY ACCESS TO NEW DROPS</span>
            </li>
            <li className="onboarding-item">
              <span className="bullet"><IconCheck /></span>
              <span>EXCLUSIVE MEMBER PRICING</span>
            </li>
            <li className="onboarding-item">
              <span className="bullet"><IconCheck /></span>
              <span>FREE RETURNS & EXCHANGES</span>
            </li>
          </ul>

          <div className="onboarding-hero">
            <img 
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=500&fit=crop" 
              alt="Athletes"
              className="onboarding-image"
            />
          </div>
        </div>

        <div className="onboarding-footer slim-board">
          <button className="btn btn-primary btn-full" onClick={() => setCurrentPage('home')}>
            NEXT
          </button>
        </div>
      </div>
    )
  }

  // HOME PAGE (EDITORIAL FEED)
  if (currentPage === 'home') {
    return (
      <div className="page home-page">
        <header className="home-header slim-board">
          <h1 className="home-logo">GYMSHARK</h1>
          <button className="icon-btn" onClick={() => setCurrentPage('search')}>
            <IconSearch />
          </button>
        </header>

        <div className="hero-feed">
          {heroProducts.map((hero) => (
            <div key={hero.id} className="hero-card slim-board" onClick={() => setCurrentPage('search')}>
              <img src={hero.image} alt={hero.title} className="hero-image" />
              <div className="hero-overlay">
                <p className="hero-subtitle">{hero.subtitle}</p>
                <h2 className="hero-title">{hero.title}</h2>
              </div>
            </div>
          ))}
        </div>

        <nav className="bottom-nav">
          <button className="nav-item active" onClick={() => setCurrentPage('home')}>
            <IconHome active />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('search')}>
            <IconSearch />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('cart')}>
            <IconCart />
            {getCartCount() > 0 && <span className="nav-badge">{getCartCount()}</span>}
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('profile')}>
            <IconUser />
          </button>
        </nav>
      </div>
    )
  }

  // SEARCH & GRID PAGE
  if (currentPage === 'search') {
    return (
      <div className="page search-page">
        <header className="search-header slim-board">
          <button className="icon-btn" onClick={() => setCurrentPage('home')}>
            <IconArrowLeft />
          </button>
          <div className="search-bar">
            <IconSearch />
            <input type="text" placeholder="SEARCH" className="search-input" />
          </div>
        </header>

        <div className="products-grid slim-board">
          {loading ? (
            <div className="loading-products">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            products.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => {
                  setSelectedProduct(product)
                  setCurrentPage('product')
                }}
              >
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-img" />
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category?.name || 'APPAREL'}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.base_price} USD</p>
                </div>
              </div>
            ))
          )}
        </div>

        <nav className="bottom-nav">
          <button className="nav-item" onClick={() => setCurrentPage('home')}>
            <IconHome />
          </button>
          <button className="nav-item active" onClick={() => setCurrentPage('search')}>
            <IconSearch active />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('cart')}>
            <IconCart />
            {getCartCount() > 0 && <span className="nav-badge">{getCartCount()}</span>}
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('profile')}>
            <IconUser />
          </button>
        </nav>
      </div>
    )
  }

  // PRODUCT DETAIL PAGE
  if (currentPage === 'product' && selectedProduct) {
    return (
      <div className="page product-page">
        <header className="product-header slim-board">
          <button className="icon-btn" onClick={() => setCurrentPage('search')}>
            <IconArrowLeft />
          </button>
          <button className="icon-btn">
            <IconHeart />
          </button>
        </header>

        <div className="product-carousel slim-board">
          <img src={selectedProduct.image} alt={selectedProduct.name} className="product-detail-img" />
        </div>

        <div className="product-details slim-board">
          <p className="product-detail-category">{selectedProduct.category?.name || 'APPAREL'}</p>
          <h2 className="product-detail-name">{selectedProduct.name}</h2>
          <p className="product-detail-price">${selectedProduct.base_price} USD</p>

          <div className="size-section">
            <p className="size-label">SELECT SIZE</p>
            <div className="size-grid">
              {(selectedProduct.variants && selectedProduct.variants.length > 0 
                ? selectedProduct.variants.filter(v => v.size).map(v => v.size) 
                : defaultSizes
              )?.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size || 'M')}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-section">
            <p className="feedback-label">HOW DOES IT FIT?</p>
            <div className="fit-bar">
              <span className="fit-label">TOO SMALL</span>
              <div className="fit-track">
                <div className="fit-indicator" style={{ left: '60%' }}></div>
              </div>
              <span className="fit-label">TOO LARGE</span>
            </div>
          </div>
        </div>

        <div className="product-footer slim-board">
          <button 
            className="btn btn-primary btn-full"
            onClick={() => addToCart(selectedProduct, selectedSize || 'M')}
            disabled={!selectedSize}
          >
            {selectedSize ? 'ADD TO BAG' : 'SELECT SIZE'}
          </button>
        </div>
      </div>
    )
  }

  // CART PAGE
  if (currentPage === 'cart') {
    return (
      <div className="page cart-page">
        <header className="cart-header slim-board">
          <button className="icon-btn" onClick={() => setCurrentPage('home')}>
            <IconArrowLeft />
          </button>
          <h2 className="cart-title">YOUR BAG ({getCartCount()})</h2>
          <div className="icon-btn-placeholder"></div>
        </header>

        {getCartCount() === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <IconCart />
            </div>
            <p className="empty-cart-text">YOUR BAG IS EMPTY</p>
            <p className="empty-cart-subtext">Items added to your bag will appear here</p>
            <button className="btn btn-primary" onClick={() => setCurrentPage('search')}>
              SHOP NOW
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items slim-board">
              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <button className="cart-item-remove" onClick={() => removeFromCart(idx)}>
                        <IconClose />
                      </button>
                    </div>
                    <p className="cart-item-meta">{(typeof item.product.category === 'string' ? item.product.category : item.product.category?.name) || 'APPAREL'} / SIZE {item.size}</p>
                    <p className="cart-item-price">${item.product.base_price} USD</p>
                    
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="item-total">
                        ${(item.product.base_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary slim-board">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)} USD</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-free">FREE</span>
              </div>
              <div className="summary-row total-row">
                <span>TOTAL</span>
                <span className="total-amount">${getCartTotal().toFixed(2)} USD</span>
              </div>
            </div>

            <div className="cart-actions slim-board">
              <button 
                className="btn btn-primary btn-full checkout-btn"
                onClick={() => {
                  if (!user) {
                    setCurrentPage('login')
                  } else {
                    setCurrentPage('checkout')
                  }
                }}
              >
                CHECKOUT
              </button>
              <button className="btn btn-outline btn-full" onClick={() => setCurrentPage('search')}>
                CONTINUE SHOPPING
              </button>
            </div>
          </>
        )}

        <nav className="bottom-nav">
          <button className="nav-item" onClick={() => setCurrentPage('home')}>
            <IconHome />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('search')}>
            <IconSearch />
          </button>
          <button className="nav-item active" onClick={() => setCurrentPage('cart')}>
            <IconCart />
            {getCartCount() > 0 && <span className="nav-badge">{getCartCount()}</span>}
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('profile')}>
            <IconUser />
          </button>
        </nav>
      </div>
    )
  }

  // LOGIN PAGE
  if (currentPage === 'login') {
    // Redirect to home if already logged in
    if (user) {
      setCurrentPage('home')
      return null
    }
    return (
      <div className="page login-page">
        <div className="login-container">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Welcome back! Please enter your details.</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleLogin}>
            {loginError && (
              <div className="auth-error">{loginError}</div>
            )}
            
            <div className="login-field">
              <label className="login-label">Email</label>
              <input 
                type="email" 
                className="login-input" 
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <input 
                type="password" 
                className="login-input" 
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <a href="#" className="forgot-password">Forgot password</a>

            <button type="submit" className="btn-login">
              {authLoading ? 'Loading...' : 'Login'}
            </button>

            <div className="social-login-row">
              <button type="button" className="btn-social-login btn-google" onClick={() => setCurrentPage('home')}>
                <IconGoogle />
                <span>Google</span>
              </button>
              <button type="button" className="btn-social-login btn-apple" onClick={() => setCurrentPage('home')}>
                <IconApple />
                <span>Apple</span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="login-footer">
            Don't have an account? <button className="signup-link" onClick={() => setCurrentPage('createAccount')}>Sign up for free</button>
          </p>
        </div>
      </div>
    )
  }

  // CHECKOUT PAGE
  if (currentPage === 'checkout') {
    // Redirect to login if not authenticated
    if (!user) {
      setCurrentPage('login')
      return null
    }

    // Modern Yoco Payment Integration using Checkout API
    const handlePayNow = async () => {
      setProcessingPayment(true);
      
      // DEBUG LOGGING
      console.log('=== PAYMENT DEBUG START ===');
      
      try {
        const orderRef = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const amount = getCartTotal() * 1.15;
        const amountInCents = Math.round(amount * 100);
        
        console.log('1. Order Ref:', orderRef);
        console.log('2. Amount (R):', amount);
        console.log('3. Amount (cents):', amountInCents);
        console.log('4. User:', user?.id, user?.email);
        
        // Call our serverless function to create Yoco checkout
        console.log('5. Calling API...');
        
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInCents,
            currency: 'ZAR',
            reference: orderRef,
            metadata: {
              userId: user.id,
              email: user.email,
              items: cart.length.toString()
            }
          })
        });
        
        console.log('6. API Response Status:', response.status);
        console.log('7. API Response OK:', response.ok);
        
        const responseText = await response.text();
        console.log('8. API Response Text:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('9. Parsed Data:', data);
        } catch (e) {
          console.error('9. JSON Parse Error - Raw response:', responseText);
          // If response is not JSON, it's likely a server error
          throw new Error(responseText.includes('server error') 
            ? 'Server error. Please try again.' 
            : 'Invalid response from server: ' + responseText.slice(0, 100));
        }
        
        if (!response.ok) {
          console.error('10. API Error:', data?.error || data?.message || 'Unknown error');
          throw new Error(data?.error || data?.message || `Server error: ${response.status}`);
        }
        
        if (!data.redirectUrl) {
          console.error('10. No redirectUrl in response');
          throw new Error('No redirect URL received');
        }
        
        console.log('10. Redirect URL:', data.redirectUrl);
        
        // Save pending order before redirect
        console.log('11. Saving order to database...');
        const { error: dbError } = await supabase.from('orders').insert({
          user_id: user.id,
          order_reference: orderRef,
          total_amount: amount,
          shipping_address: shippingAddress,
          payment_method: 'card',
          status: 'pending'
        });
        
        if (dbError) {
          console.error('12. Database Error:', dbError);
        } else {
          console.log('12. Order saved successfully');
        }
        
        // Store order ref for success page
        localStorage.setItem('pending-order-ref', orderRef);
        
        console.log('13. Redirecting to Yoco...');
        console.log('=== PAYMENT DEBUG END ===');
        
        // Redirect to Yoco hosted checkout
        window.location.href = data.redirectUrl;
        
      } catch (error: any) {
        console.error('=== PAYMENT ERROR ===');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        console.error('=== END ERROR ===');
        
        setProcessingPayment(false);
        alert('Payment failed: ' + (error.message || 'Please try again'));
      }
    };

    const StepIndicator = () => (
      <div className="checkout-stepper">
        <div className={`step ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">{checkoutStep > 1 ? '✓' : '1'}</div>
          <span className="step-label">Delivery</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${checkoutStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Review & Pay</span>
        </div>
      </div>
    )

    return (
      <div className="page checkout-page">
        {/* Header */}
        <header className="checkout-header">
          <button 
            className="icon-btn"
            onClick={() => {
              if (checkoutStep > 1) {
                setCheckoutStep(checkoutStep - 1)
              } else {
                setCurrentPage('cart')
              }
            }}
          >
            <IconArrowLeft />
          </button>
          <h2 className="checkout-title">CHECKOUT</h2>
          <div className="icon-btn-placeholder"></div>
        </header>

        {/* Step Indicator - Hidden on confirmation screen */}
        {checkoutStep !== 3 && <StepIndicator />}

        {/* Step Content */}
        <div className="checkout-content">
          {/* STEP 1: DELIVERY */}
          {checkoutStep === 1 && (
            <div className="checkout-step slide-in">
              <h3 className="step-title">Delivery Address</h3>
              
              {/* Google Map */}
              <div className="map-container">
                <div 
                  ref={(el) => {
                    if (el && !mapRef.current) {
                      const map = new google.maps.Map(el, {
                        center: mapCenter,
                        zoom: 15,
                        disableDefaultUI: true,
                        zoomControl: true,
                      })
                      
                      const marker = new google.maps.Marker({
                        position: markerPosition,
                        map: map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                      })
                      
                      // Store references
                      mapRef.current = map
                      markerRef.current = marker
                      
                      // Update position when marker is dragged
                      marker.addListener('dragend', () => {
                        const position = marker.getPosition()
                        if (position) {
                          setMarkerPosition({
                            lat: position.lat(),
                            lng: position.lng()
                          })
                        }
                      })
                    }
                  }}
                  style={{ width: '100%', height: '200px', borderRadius: '12px' }}
                />
                
                <button 
                  className="btn-current-location"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        const pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        }
                        setMapCenter(pos)
                        setMarkerPosition(pos)
                        
                        // Update map and marker
                        if (mapRef.current) {
                          mapRef.current.panTo(pos)
                          mapRef.current.setZoom(17)
                        }
                        if (markerRef.current) {
                          markerRef.current.setPosition(pos)
                          markerRef.current.setAnimation(google.maps.Animation.DROP)
                        }
                        
                        // Reverse geocode to get address
                        const geocoder = new google.maps.Geocoder()
                        geocoder.geocode({ location: pos }, (results, status) => {
                          if (status === 'OK' && results && results[0]) {
                            const address = results[0]
                            const components = address.address_components
                            
                            // Street: combine street_number + route
                            const streetNumber = components.find(c => 
                              c.types.includes('street_number')
                            )?.long_name || ''
                            const streetRoute = components.find(c => 
                              c.types.includes('route')
                            )?.long_name || ''
                            const street = `${streetNumber} ${streetRoute}`.trim()
                            
                            // City: check sublocality first, then locality
                            const city = components.find(c => 
                              c.types.includes('sublocality') || c.types.includes('locality')
                            )?.long_name || ''
                            
                            const postalCode = components.find(c => 
                              c.types.includes('postal_code')
                            )?.long_name || ''
                            
                            setShippingAddress({
                              street: street,
                              city: city,
                              postalCode: postalCode,
                              country: 'ZA'
                            })
                            setSearchQuery(address.formatted_address)
                          }
                        })
                      })
                    }
                  }}
                >
                  Use My Location
                </button>
              </div>

              {/* Address Search */}
              <div className="address-search">
                <label>Search Address</label>
                <input
                  ref={(el) => {
                    if (el && !autocomplete) {
                      const auto = new google.maps.places.Autocomplete(el, {
                        types: ['address'],
                        componentRestrictions: { country: 'za' }
                      })
                      
                      auto.addListener('place_changed', () => {
                        const place = auto.getPlace()
                        if (place.geometry && place.geometry.location) {
                          const lat = place.geometry.location.lat()
                          const lng = place.geometry.location.lng()
                          
                          setMapCenter({ lat, lng })
                          setMarkerPosition({ lat, lng })
                          setSearchQuery(place.formatted_address || '')
                          
                          // Update map view and marker position
                          if (mapRef.current) {
                            mapRef.current.panTo({ lat, lng })
                            mapRef.current.setZoom(17)
                          }
                          if (markerRef.current) {
                            markerRef.current.setPosition({ lat, lng })
                          }
                          
                          // Extract address components properly
                          const components = place.address_components || []
                          
                          // Street: combine street_number + route
                          const streetNumber = components.find(c => 
                            c.types.includes('street_number')
                          )?.long_name || ''
                          const streetRoute = components.find(c => 
                            c.types.includes('route')
                          )?.long_name || ''
                          const street = `${streetNumber} ${streetRoute}`.trim()
                          
                          // City: check sublocality first (like Northcliff), then locality
                          const city = components.find(c => 
                            c.types.includes('sublocality') || c.types.includes('locality')
                          )?.long_name || ''
                          
                          // Postal code
                          const postalCode = components.find(c => 
                            c.types.includes('postal_code')
                          )?.long_name || ''
                          
                          setShippingAddress({
                            street: street,
                            city: city,
                            postalCode: postalCode,
                            country: 'ZA'
                          })
                        }
                      })
                      
                      setAutocomplete(auto)
                    }
                  }}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your address..."
                  className="address-search-input"
                />
              </div>

              {/* Selected Address Display */}
              {(shippingAddress.street) && (
                <div className="selected-address-card">
                  <div className="address-icon">📍</div>
                  <div className="address-details">
                    <p className="address-street">{shippingAddress.street}</p>
                    <p className="address-city">
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              )}

              <button 
                className="btn btn-primary btn-full"
                disabled={!shippingAddress.street}
                onClick={() => {
                  if (shippingAddress.street && shippingAddress.city) {
                    setCheckoutStep(2)
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}

          {/* STEP 2: REVIEW & PAY */}
          {checkoutStep === 2 && (
            <div className="checkout-step slide-in">
              <h3 className="step-title">Review Order</h3>

              {/* Order Items */}
              <div className="review-items">
                {cart.map((item, idx) => (
                  <div key={idx} className="review-item">
                    <img src={item.product.image} alt={item.product.name} className="review-item-img" />
                    <div className="review-item-details">
                      <h4>{item.product.name}</h4>
                      <p>Size: {item.size}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span className="review-item-price">R{(item.product.base_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Address Summary */}
              <div className="review-section">
                <h4>Shipping to</h4>
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
              </div>

              {/* Price Breakdown */}
              <div className="review-section price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>R{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span className="shipping-free">FREE</span>
                </div>
                <div className="price-row">
                  <span>Tax (15%)</span>
                  <span>R{(getCartTotal() * 0.15).toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>R{(getCartTotal() * 1.15).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ORDER CONFIRMATION - Not part of steps */}
          {checkoutStep === 3 && (
            <div className="order-confirmation-full">
              <OrderConfirmation 
                total={confirmedOrderTotal || getCartTotal() * 1.15}
                onContinueShopping={() => {
                  setCart([])
                  setCheckoutStep(1)
                  setCurrentPage('home')
                }}
                onViewOrderStatus={() => {
                  setCart([])
                  setCheckoutStep(1)
                  setCurrentPage('orders')
                }}
              />
            </div>
          )}
        </div>

        {/* Fixed Bottom Pay Button - Step 2 */}
        {checkoutStep === 2 && (
          <div className="checkout-footer">
            <button 
              className="btn btn-primary btn-full pay-now-btn"
              onClick={handlePayNow}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <span className="spinner"></span>
              ) : (
                <>Pay now (R{(getCartTotal() * 1.15).toFixed(2)})</>
              )}
            </button>
          </div>
        )}
      </div>
    )
  }

  // PROFILE PAGE
  if (currentPage === 'profile') {
    // If not logged in, show login prompt
    if (!user) {
      return (
        <div className="page profile-page">
          <div className="profile-header">
            <div className="profile-avatar" style={{ background: '#F2F2F2' }}>
              <IconUser />
            </div>
            <h1 className="profile-name">Guest</h1>
            <p className="profile-email">Sign in to access your profile</p>
            <button className="btn-edit-profile" onClick={() => setCurrentPage('login')}>
              Sign In
            </button>
          </div>
          
          <nav className="bottom-nav">
            <button className="nav-item" onClick={() => setCurrentPage('home')}>
              <IconHome />
            </button>
            <button className="nav-item" onClick={() => setCurrentPage('search')}>
              <IconSearch />
            </button>
            <button className="nav-item" onClick={() => setCurrentPage('cart')}>
              <IconCart />
              {getCartCount() > 0 && <span className="nav-badge">{getCartCount()}</span>}
            </button>
            <button className="nav-item active" onClick={() => setCurrentPage('profile')}>
              <IconUser />
            </button>
          </nav>
        </div>
      )
    }

    return (
      <div className="page profile-page">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={`https://ui-avatars.com/api/?name=${user.email?.charAt(0) || 'U'}&background=20C997&color=fff`} alt="Profile" />
          </div>
          <h1 className="profile-name">{user.email?.split('@')[0] || 'User'}</h1>
          <p className="profile-email">{user.email}</p>
          <button className="btn-edit-profile" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {/* Orders Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">My Orders</h2>
          <div className="profile-list">
            <div className="profile-list-item" onClick={() => setCurrentPage('orders')}>
              <div className="profile-list-icon">
                <IconPackage />
              </div>
              <span className="profile-list-label">View Orders</span>
              <IconChevronRight />
            </div>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">Payment info</h2>
          <div className="profile-list">
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconGift />
              </div>
              <span className="profile-list-label">Loyalty points</span>
              <IconChevronRight />
            </div>
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconCreditCard />
              </div>
              <span className="profile-list-label">Payment methods</span>
              <IconChevronRight />
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">Settings</h2>
          <div className="profile-list">
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconTranslate />
              </div>
              <span className="profile-list-label">Language</span>
              <span className="profile-list-value">English</span>
              <IconChevronRight />
            </div>
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconPalette />
              </div>
              <span className="profile-list-label">Theme</span>
              <span className="profile-list-value">Light</span>
              <IconChevronRight />
            </div>
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconBell />
              </div>
              <span className="profile-list-label">Notifications</span>
              <span className="profile-list-value">Enabled</span>
              <IconChevronRight />
            </div>
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconHeadphones />
              </div>
              <span className="profile-list-label">Contact support</span>
              <IconChevronRight />
            </div>
          </div>
        </div>

        {/* Property Management Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">Manage your Property</h2>
          <div className="profile-list">
            <div className="profile-list-item">
              <div className="profile-list-icon">
                <IconHandshake />
              </div>
              <span className="profile-list-label">List your property</span>
              <IconChevronRight />
            </div>
          </div>
        </div>

        <nav className="bottom-nav">
          <button className="nav-item" onClick={() => setCurrentPage('home')}>
            <IconHome />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('search')}>
            <IconSearch />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('cart')}>
            <IconCart />
            {getCartCount() > 0 && <span className="nav-badge">{getCartCount()}</span>}
          </button>
          <button className="nav-item active" onClick={() => setCurrentPage('profile')}>
            <IconUser />
          </button>
        </nav>
      </div>
    )
  }

  // ORDERS PAGE
  if (currentPage === 'orders') {
    const [orders, setOrders] = useState<any[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    
    useEffect(() => {
      const fetchOrders = async () => {
        if (!user) return
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (!error && data) {
          setOrders(data)
        }
        setLoadingOrders(false)
      }
      fetchOrders()
    }, [user])
    
    return (
      <div className="page orders-page">
        <header className="page-header">
          <button className="back-btn" onClick={() => setCurrentPage('profile')}>
            <IconArrowLeft />
          </button>
          <h1 className="page-title">My Orders</h1>
        </header>

        <div className="orders-list">
          {loadingOrders ? (
            <div className="orders-loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <p>No orders yet</p>
              <button className="btn btn-primary" onClick={() => setCurrentPage('home')}>
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="order-card" 
                onClick={() => {
                  _setSelectedOrder(order)
                  setCurrentPage('order-status')
                }}
              >
                <div className="order-header">
                  <span className="order-id">#{order.order_reference}</span>
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-ZA', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className={`order-status-badge ${order.status}`}>
                  {order.status}
                </div>
                <div className="order-footer">
                  <span className="order-items">
                    {order.items?.length || 1} item{order.items?.length !== 1 ? 's' : ''}
                  </span>
                  <span className="order-total">R{order.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <nav className="bottom-nav">
          <button className="nav-item" onClick={() => setCurrentPage('home')}>
            <IconHome />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('search')}>
            <IconSearch />
          </button>
          <button className="nav-item" onClick={() => setCurrentPage('cart')}>
            <IconCart />
            {getCartCount() > 0 && <span className="nav-badge">{getCartCount()}</span>}
          </button>
          <button className="nav-item active" onClick={() => setCurrentPage('profile')}>
            <IconUser />
          </button>
        </nav>
      </div>
    )
  }

  // ORDER STATUS PAGE
  if (currentPage === 'order-status') {
    const order = _selectedOrder || {
      order_reference: 'N/A',
      created_at: new Date().toISOString(),
      total_amount: 0,
      status: 'pending'
    }
    
    return (
      <div className="page order-status-page">
        <header className="page-header">
          <button className="back-btn" onClick={() => setCurrentPage('orders')}>
            <IconArrowLeft />
          </button>
          <h1 className="page-title">Order Status</h1>
        </header>

        <div className="order-status-content">
          <div className="order-info-card">
            <div className="order-info-header">
              <span className="order-info-id">Order #{order.order_reference}</span>
              <span className="order-info-date">
                Placed on {new Date(order.created_at).toLocaleDateString('en-ZA', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="order-info-total">
              <span>Total</span>
              <span className="total-amount">R{order.total_amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="timeline-container">
            <h3 className="timeline-title">Order Progress</h3>
            <OrderStatusTimeline status={order.status} />
          </div>

          <div className="order-status-actions">
            <button 
              className="btn btn-primary btn-full"
              onClick={() => setCurrentPage('home')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
