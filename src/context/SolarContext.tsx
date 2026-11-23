import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, googleAuthProvider } from '../lib/firebase';
import {
  Product, Category, HeroSlide, Order, Testimonial, WebsiteSettings, CartItem, CustomerDetails
} from '../types';
import {
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_HERO_SLIDES, INITIAL_TESTIMONIALS, INITIAL_SETTINGS
} from '../data/initialData';

interface SolarContextType {
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  settings: WebsiteSettings;
  orders: Order[];
  loading: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createWhatsAppOrder: (customer: CustomerDetails) => Promise<{ order: Order; whatsappUrl: string }>;
  currentUser: FirebaseUser | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  saveCategory: (category: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveHeroSlide: (slide: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (slideId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], paymentVerified: boolean, notes?: string) => Promise<void>;
  saveSettings: (settings: WebsiteSettings) => Promise<void>;
  saveTestimonial: (testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  adminCreateOrder: (customer: CustomerDetails, items: CartItem[]) => Promise<void>;
}

const SolarContext = createContext<SolarContextType | undefined>(undefined);

// --- CRITICAL FIX: Helper to remove undefined values so Firestore NEVER crashes ---
const cleanUndefined = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

export const SolarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with initial data so the site NEVER looks broken to guests
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dojech_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('dojech_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => { localStorage.setItem('dojech_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('dojech_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      const email = user?.email?.toLowerCase() ?? '';
      const ADMIN_EMAILS = ['joeama25@gmail.com'];
      setIsAdmin(!!email && ADMIN_EMAILS.includes(email));
      if (!user) setOrders([]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubProducts: () => void;
    let unsubCategories: () => void;
    let unsubSlides: () => void;
    let unsubTestimonials: () => void;
    let unsubSettings: () => void;
    let unsubOrders: () => void;

    const initializeData = async () => {
      try {
        const prodRef = collection(db, 'products');
        const prodSnapshot = await getDocs(prodRef);
        
        // ONLY SEED IF THE DATABASE IS EMPTY AND THE USER IS AN ADMIN
        if (prodSnapshot.empty) {
          if (!isAdmin) {
            console.log('Database empty. Waiting for admin to log in to seed data.');
            setLoading(false);
          } else {
            console.log('Database empty and Admin logged in. Seeding initial data to Firestore...');
            const batch = writeBatch(db);
            INITIAL_PRODUCTS.forEach(p => batch.set(doc(db, 'products', p.id), p));
            INITIAL_CATEGORIES.forEach(c => batch.set(doc(db, 'categories', c.id), c));
            INITIAL_HERO_SLIDES.forEach(h => batch.set(doc(db, 'hero_slides', h.id), h));
            INITIAL_TESTIMONIALS.forEach(t => batch.set(doc(db, 'testimonials', t.id), t));
            batch.set(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
            await batch.commit();
            console.log('Database seeded successfully.');
          }
        }

        unsubProducts = onSnapshot(prodRef, (snap) => {
          if (!snap.empty) setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        }, (err) => console.warn("Firestore Products Error: Using local fallback.", err.message));

        unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
          if (!snap.empty) setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
        }, (err) => console.warn("Firestore Categories Error: Using local fallback.", err.message));

        unsubSlides = onSnapshot(collection(db, 'hero_slides'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as HeroSlide));
            list.sort((a, b) => (a.order || 0) - (b.order || 0));
            setHeroSlides(list);
          }
        }, (err) => console.warn("Firestore Slides Error: Using local fallback.", err.message));

        unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
          if (!snap.empty) setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
        }, (err) => console.warn("Firestore Testimonials Error: Using local fallback.", err.message));

        unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
          if (snap.exists()) setSettings(snap.data() as WebsiteSettings);
        }, (err) => console.warn("Firestore Settings Error: Using local fallback.", err.message));

        if (isAdmin) {
          unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(list);
          }, (err) => console.warn("Firestore Orders Error:", err.message));
        }

        setLoading(false);
      } catch (error) {
        console.warn("Failed to connect to Firestore. Using local data.", error);
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubCategories) unsubCategories();
      if (unsubSlides) unsubSlides();
      if (unsubTestimonials) unsubTestimonials();
      if (unsubSettings) unsubSettings();
      if (unsubOrders) unsubOrders();
    };
  }, [isAdmin]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { product, quantity }];
    });
  };
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };
  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.product.id !== productId));
  const clearCart = () => setCart([]);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };
  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const createWhatsAppOrder = async (customer: CustomerDetails) => {
    const reference = `DOJ-${Date.now().toString().slice(-6)}`;
    const subtotal = cartSubtotal;
    const total = subtotal;

    const orderData: Order = {
      id: `ord_${Date.now()}`,
      reference,
      userId: currentUser?.uid || 'guest',
      customer,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        image: item.product.images[0] || ''
      })),
      subtotal,
      deliveryFee: 0, 
      total,
      status: 'Pending Confirmation',
      paymentVerified: false,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'orders', orderData.id), cleanUndefined(orderData));
      setOrders(prev => [orderData, ...prev]);
    } catch (error) {
      console.warn("Could not save order to Firestore, saving locally.", error);
      const localOrders = JSON.parse(localStorage.getItem('dojech_orders') || '[]');
      localStorage.setItem('dojech_orders', JSON.stringify([orderData, ...localOrders]));
    }
    
    clearCart();

    const itemsList = orderData.items.map((item, idx) => `${idx + 1}. ${item.productName} x ${item.quantity} = ₦${item.subtotal.toLocaleString()}`).join('\n');
    
    const message = `Hello Dojech Solar Tech!\n\nI would like to place an order.\n\nORDER REF: ${reference}\n\nCUSTOMER DETAILS\nName: ${customer.fullName}\nPhone: ${customer.phone}\nDelivery Address: ${customer.address}, ${customer.city}, ${customer.state}\n${customer.notes ? `Additional Instructions: ${customer.notes}\n` : ''}\nORDER DETAILS\n${itemsList}\n\nSubtotal: ₦${subtotal.toLocaleString()}\n\n*Note: Delivery fee is NOT included. Please advise on delivery logistics and cost.*\n\nTotal (Excl. Delivery): ₦${total.toLocaleString()}\n\nPlease confirm product availability and provide payment instructions.\n\nThank you!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    return { order: orderData, whatsappUrl };
  };

  const adminCreateOrder = async (customer: CustomerDetails, items: CartItem[]) => {
    const reference = `DOJ-${Date.now().toString().slice(-6)}`;
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const total = subtotal;

    const orderData: Order = {
      id: `ord_${Date.now()}`,
      reference,
      userId: 'admin-created',
      customer,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        image: item.product.images[0] || ''
      })),
      subtotal,
      deliveryFee: 0,
      total,
      status: 'Pending Confirmation',
      paymentVerified: false,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'orders', orderData.id), cleanUndefined(orderData));
    setOrders(prev => [orderData, ...prev]); 
  };

  const signInWithGoogle = async () => { await signInWithPopup(auth, googleAuthProvider); };
  const signOut = async () => { await fbSignOut(auth); };

  const saveProduct = async (productData: Partial<Product>) => {
    const id = productData.id || `prod_${Date.now()}`;
    const fullProduct: Product = {
      id,
      name: productData.name || 'Solar Product',
      slug: productData.slug || (productData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: productData.categoryId || 'cat-panels',
      categoryName: categories.find(c => c.id === productData.categoryId)?.name || 'Solar Panels',
      brand: productData.brand || 'Dojech Solar Tech',
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      description: productData.description || '',
      shortDescription: productData.shortDescription || '',
      images: productData.images && productData.images.length > 0 ? productData.images : ['/images/cat_solar_panels_1793813620282.jpg'],
      inStock: productData.inStock ?? true,
      stockQuantity: Number(productData.stockQuantity) || 10,
      isFeatured: !!productData.isFeatured,
      isBestseller: !!productData.isBestseller,
      isNewArrival: !!productData.isNewArrival,
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      warranty: productData.warranty || '2-Year Standard Warranty',
      specs: productData.specs || {},
      createdAt: productData.createdAt || new Date().toISOString()
    };
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx >= 0) { const next = [...prev]; next[idx] = fullProduct; return next; }
      return [fullProduct, ...prev];
    });
    // Using cleanUndefined to prevent Firestore crashes
    await setDoc(doc(db, 'products', id), cleanUndefined(fullProduct));
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    await deleteDoc(doc(db, 'products', productId));
  };

  const saveCategory = async (catData: Partial<Category>) => {
    const id = catData.id || `cat_${Date.now()}`;
    const fullCat: Category = {
      id, name: catData.name || 'Category', slug: catData.slug || (catData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catData.description || '', image: catData.image || '/images/cat_solar_panels_1793813620282.jpg',
      productCount: products.filter(p => p.categoryId === id).length
    };
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx >= 0) { const next = [...prev]; next[idx] = fullCat; return next; }
      return [...prev, fullCat];
    });
    await setDoc(doc(db, 'categories', id), cleanUndefined(fullCat));
  };

  const deleteCategory = async (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    await deleteDoc(doc(db, 'categories', categoryId));
  };

  const saveHeroSlide = async (slideData: Partial<HeroSlide>) => {
    const id = slideData.id || `slide_${Date.now()}`;
    const fullSlide: HeroSlide = {
      id, heading: slideData.heading || 'Reliable Solar Energy', description: slideData.description || '',
      ctaText: slideData.ctaText || 'Shop Now', ctaLink: slideData.ctaLink || 'shop',
      image: slideData.image || '/images/hero_solar_residential_1793813490504.jpg',
      order: slideData.order || heroSlides.length + 1, isActive: slideData.isActive ?? true, accentBadge: slideData.accentBadge || 'Solar Technology'
    };
    setHeroSlides(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx >= 0) { const next = [...prev]; next[idx] = fullSlide; return next; }
      return [...prev, fullSlide];
    });
    await setDoc(doc(db, 'hero_slides', id), cleanUndefined(fullSlide));
  };

  const deleteHeroSlide = async (slideId: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== slideId));
    await deleteDoc(doc(db, 'hero_slides', slideId));
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], paymentVerified: boolean, notes?: string) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status, paymentVerified, internalNotes: notes !== undefined ? notes : ord.internalNotes } : ord));
    await updateDoc(doc(db, 'orders', orderId), cleanUndefined({ status, paymentVerified, ...(notes !== undefined ? { internalNotes: notes } : {}) }));
  };

  const saveSettings = async (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
    await setDoc(doc(db, 'settings', 'general'), cleanUndefined(newSettings));
  };

  const saveTestimonial = async (testData: Partial<Testimonial>) => {
    const id = testData.id || `test_${Date.now()}`;
    const fullTest: Testimonial = {
      id, name: testData.name || 'Verified Client', role: testData.role || 'Solar Customer', location: testData.location || 'Lagos, Nigeria',
      rating: testData.rating || 5, review: testData.review || '', solarInstalled: testData.solarInstalled || 'Solar System Installation',
      isApproved: testData.isApproved ?? true, avatarUrl: testData.avatarUrl
    };
    setTestimonials(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx >= 0) { const next = [...prev]; next[idx] = fullTest; return next; }
      return [...prev, fullTest];
    });
    await setDoc(doc(db, 'testimonials', id), cleanUndefined(fullTest));
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await deleteDoc(doc(db, 'testimonials', id));
  };

  return (
    <SolarContext.Provider
      value={{
        products, categories, heroSlides, testimonials, settings, orders, loading,
        cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal, cartTotalCount,
        wishlist, toggleWishlist, isInWishlist, createWhatsAppOrder,
        currentUser, isAdmin, signInWithGoogle, signOut, adminCreateOrder,
        saveProduct, deleteProduct, saveCategory, deleteCategory, saveHeroSlide, deleteHeroSlide, updateOrderStatus, saveSettings, saveTestimonial, deleteTestimonial
      }}
    >
      {children}
    </SolarContext.Provider>
  );
};

export const useSolar = () => {
  const context = useContext(SolarContext);
  if (!context) throw new Error('useSolar must be used within a SolarProvider');
  return context;
};