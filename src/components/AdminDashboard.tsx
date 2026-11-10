import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck, Package, Layers, ShoppingBag, MessageSquare, 
  Settings as SettingsIcon, Plus, Trash2, Edit, TrendingUp, X,
  Sliders, ChevronDown, Activity, Target, Search, Bell,
  Truck, ArrowLeft, TrendingDown, ChevronRight, Check, AlertTriangle,
  MapPin, Phone, Calendar, Clock, ExternalLink, DollarSign, PieChart,
  Image as ImageIcon, UploadCloud, Menu
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { Product, Category, HeroSlide, Order, WebsiteSettings, CustomerDetails, CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// --- CUSTOM DROPDOWN COMPONENT (Storefront Theme) ---
const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  className = "" 
}: { 
  options: { label: string, value: string }[], 
  value: string, 
  onChange: (val: string) => void,
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if(ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0B192C] hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#C29B57] transition-colors shadow-sm"
      >
        <span className="truncate">{selected?.label || 'Select...'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }} 
            className="absolute z-50 mt-1 w-full min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${value === opt.value ? 'text-[#C29B57] font-medium bg-[#C29B57]/5' : 'text-slate-600'}`}
              >
                <span className="truncate">{opt.label}</span>
                {value === opt.value && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const {
    products, categories, heroSlides, orders, testimonials, settings,
    saveProduct, deleteProduct, saveCategory, deleteCategory,
    saveHeroSlide, deleteHeroSlide, updateOrderStatus, saveSettings, deleteTestimonial, adminCreateOrder
  } = useSolar() as any;

  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'profit-loss' | 'products' | 'categories' | 'orders' | 'slides' | 'testimonials' | 'settings'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [editingSettings, setEditingSettings] = useState<WebsiteSettings>(settings);

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [newOrderCustomer, setNewOrderCustomer] = useState<CustomerDetails>({
    fullName: '', phone: '', email: '', address: '', city: '', state: '', notes: ''
  });
  const [newOrderItems, setNewOrderItems] = useState<CartItem[]>([]);
  const [createOrderError, setCreateOrderError] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Statistics
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
  const totalCost = totalRevenue * 0.6;
  const netProfit = totalRevenue - totalCost;
  const marginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';
  
  const totalItemsSold = orders.reduce((sum: number, o: any) => sum + o.items.reduce((s: number, i: any) => s + i.quantity, 0), 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const pendingOrders = orders.filter((o: any) => o.status === 'Pending Confirmation' || o.status === 'Awaiting Payment').length;
  const processingOrders = orders.filter((o: any) => o.status === 'Processing' || o.status === 'Payment Confirmed').length;
  const shippedOrders = orders.filter((o: any) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o: any) => o.status === 'Delivered').length;
  
  const totalOrders = orders.length || 1;
  const pendingPct = Math.round((pendingOrders / totalOrders) * 100) || 0;
  const processingPct = Math.round((processingOrders / totalOrders) * 100) || 0;
  const shippedPct = Math.round((shippedOrders / totalOrders) * 100) || 0;
  const deliveredPct = Math.round((deliveredOrders / totalOrders) * 100) || 0;

  const outOfStock = products.filter((p: any) => !p.inStock);
  const lowStock = products.filter((p: any) => p.inStock && p.stockQuantity < 10);
  const healthyStock = products.filter((p: any) => p.inStock && p.stockQuantity >= 10);

  const notifications = [];
  if (pendingOrders > 0) {
    notifications.push({
      id: 'pending-orders', title: 'Pending Orders', desc: `You have ${pendingOrders} order(s) pending confirmation or payment.`, time: 'Action Required', icon: ShoppingBag, color: 'text-amber-600', bgColor: 'bg-amber-100',
      action: () => { setActiveTab('orders'); setOrderFilter('Pending'); setShowNotifications(false); }
    });
  }
  if (outOfStock.length > 0) {
    notifications.push({
      id: 'out-of-stock', title: 'Out of Stock Alert', desc: `${outOfStock.length} product(s) are currently out of stock.`, time: 'Inventory Alert', icon: AlertTriangle, color: 'text-rose-600', bgColor: 'bg-rose-100',
      action: () => { setActiveTab('products'); setShowNotifications(false); }
    });
  }
  if (lowStock.length > 0) {
    notifications.push({
      id: 'low-stock', title: 'Low Stock Warning', desc: `${lowStock.length} product(s) have less than 10 items remaining.`, time: 'Inventory Alert', icon: Package, color: 'text-amber-600', bgColor: 'bg-amber-100',
      action: () => { setActiveTab('products'); setShowNotifications(false); }
    });
  }
  if (notifications.length === 0) {
    notifications.push({
      id: 'all-good', title: 'All caught up!', desc: 'No pending orders or inventory alerts.', time: 'System', icon: ShieldCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-100',
      action: () => setShowNotifications(false)
    });
  }

  const mainMenuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders / Tasks', icon: ShoppingBag, badge: pendingOrders > 0 ? pendingOrders : null },
    { id: 'progress', label: 'Progress', icon: Activity },
    { id: 'profit-loss', label: 'Profit & Loss', icon: Target },
  ];

  const catalogItems = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'slides', label: 'Hero Slides', icon: Sliders },
    { id: 'testimonials', label: 'Reviews', icon: MessageSquare },
  ];

  const orderStatusOptions = [
    { label: 'Pending Confirmation', value: 'Pending Confirmation' },
    { label: 'Awaiting Payment', value: 'Awaiting Payment' },
    { label: 'Payment Confirmed', value: 'Payment Confirmed' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
  ];

  // --- ENHANCED FILTERING LOGIC (Status + Search) ---
  const filteredOrders = orders.filter((o: any) => {
    // 1. Filter by selected tab
    const matchesTab = 
      orderFilter === 'All' ||
      (orderFilter === 'Pending' && (o.status === 'Pending Confirmation' || o.status === 'Awaiting Payment')) ||
      (orderFilter === 'Processing' && (o.status === 'Processing' || o.status === 'Payment Confirmed')) ||
      o.status === orderFilter;

    // 2. Filter by search query (name, phone, ref, status, email)
    if (!searchQuery.trim()) return matchesTab;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      o.customer.fullName.toLowerCase().includes(query) ||
      o.reference.toLowerCase().includes(query) ||
      o.customer.phone.includes(query) ||
      o.status.toLowerCase().includes(query) ||
      (o.customer.email && o.customer.email.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const chartPoints = orders.slice(0, 7).map((o: any, i: number) => {
    const x = (i / 6) * 100;
    const y = 100 - (Math.random() * 40 + 20);
    return `${x},${y}`;
  }).join(' L ');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'slide') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      setUploadError('Image is too large. Please upload an image smaller than 800KB.');
      return;
    }
    setUploadError('');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'product') {
        setEditingProduct(prev => ({ ...prev, images: [base64String] }));
      } else {
        setEditingSlide(prev => ({ ...prev, image: base64String }));
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!editingProduct && !editingSlide) {
      setUploadError('');
      setIsUploading(false);
    }
  }, [editingProduct, editingSlide]);

  const handleCreateOrder = async () => {
    setCreateOrderError('');
    if (newOrderItems.length === 0) {
      setCreateOrderError('Please add at least one product to the order.');
      return;
    }
    if (!newOrderCustomer.fullName || !newOrderCustomer.phone) {
      setCreateOrderError('Please fill in the customer name and phone number.');
      return;
    }
    
    try {
      await adminCreateOrder(newOrderCustomer, newOrderItems);
      setIsCreatingOrder(false);
    } catch (error) {
      setCreateOrderError('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans selection:bg-[#C29B57]/30 text-slate-600 flex">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-40 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2 text-slate-500 hover:text-[#0B192C] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-tight">Back to Store</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar space-y-8">
          <div>
            <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
            <div className="space-y-1">
              {mainMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeTab === item.id ? 'bg-[#0B192C] text-white font-medium shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B192C] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#C29B57]' : 'text-slate-400'}`} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === item.id ? 'bg-[#C29B57] text-white' : 'bg-slate-100 text-slate-600'}`}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Catalog</p>
            <div className="space-y-1">
              {catalogItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeTab === item.id ? 'bg-[#0B192C] text-white font-medium shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B192C] font-normal'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#C29B57]' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">System</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === 'settings' ? 'bg-[#0B192C] text-white font-medium shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B192C] font-normal'
                }`}
              >
                <SettingsIcon className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#C29B57]' : 'text-slate-400'}`} />
                Settings
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" 
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-[70] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
                <button onClick={() => { onNavigate?.('home'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-slate-500 hover:text-[#0B192C] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-tight">Back to Store</span>
                </button>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-[#0B192C]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8">
                <div>
                  <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
                  <div className="space-y-1">
                    {mainMenuItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          activeTab === item.id ? 'bg-[#0B192C] text-white font-medium shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B192C] font-normal'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#C29B57]' : 'text-slate-400'}`} />
                          {item.label}
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === item.id ? 'bg-[#C29B57] text-white' : 'bg-slate-100 text-slate-600'}`}>{item.badge}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Catalog</p>
                  <div className="space-y-1">
                    {catalogItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          activeTab === item.id ? 'bg-[#0B192C] text-white font-medium shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B192C] font-normal'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#C29B57]' : 'text-slate-400'}`} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">System</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        activeTab === 'settings' ? 'bg-[#0B192C] text-white font-medium shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B192C] font-normal'
                      }`}
                    >
                      <SettingsIcon className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#C29B57]' : 'text-slate-400'}`} />
                      Settings
                    </button>
                  </div>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="lg:ml-64 flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative w-96 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] focus:border-[#C29B57] transition-all placeholder:text-slate-400" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 ml-auto relative">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:text-[#0B192C] transition-colors rounded-full hover:bg-slate-50"
              >
                <Bell className="w-5 h-5" />
                {notifications[0].id !== 'all-good' && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="fixed top-[72px] left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h4 className="font-semibold text-[#0B192C] text-sm">Notifications</h4>
                        {notifications[0].id !== 'all-good' && (
                          <span className="text-[10px] bg-[#C29B57]/10 text-[#C29B57] px-2 py-0.5 rounded-full font-bold">
                            {notifications.length} Action(s) Needed
                          </span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={notif.action}
                            className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 items-start"
                          >
                            <div className={`p-2 rounded-full ${notif.bgColor} ${notif.color} shrink-0 mt-0.5`}>
                              <notif.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#0B192C] leading-tight">{notif.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{notif.desc}</p>
                              <p className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${notif.color}`}>{notif.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Dashboard Overview</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your store's performance and recent activity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] tabular-nums">₦{totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</p>
                    <Target className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">₦{netProfit.toLocaleString()}</h3>
                </div>
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] tabular-nums">{orders.length}</h3>
                </div>
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Products</p>
                    <Package className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] tabular-nums">{products.length}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-[#0B192C] text-sm">Sales Overview</h3>
                    <span className="text-xs font-medium text-slate-500">Last 7 Days</span>
                  </div>
                  <div className="relative h-40 sm:h-48 w-full">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C29B57" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#C29B57" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                      
                      <path d={`M 0,100 L ${chartPoints} L 100,100 Z`} fill="url(#gradient)" />
                      <path d={`M 0,80 L ${chartPoints}`} fill="none" stroke="#C29B57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="font-semibold text-[#0B192C] text-sm mb-4">Top Categories</h3>
                  <div className="space-y-4">
                    {categories.slice(0, 4).map((cat: any, i: number) => (
                      <div key={cat.id}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-600 font-medium">{cat.name}</span>
                          <span className="text-[#0B192C] font-semibold">{85 - (i * 15)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-[#0B192C] h-1.5 rounded-full" style={{ width: `${85 - (i * 15)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-[#0B192C] text-sm">Recent Transactions</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-medium text-[#C29B57] hover:text-[#a88142] flex items-center gap-1 transition-colors">View All <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 sm:px-5 font-semibold">Order</th>
                        <th className="py-3 px-4 sm:px-5 font-semibold">Customer</th>
                        <th className="py-3 px-4 sm:px-5 font-semibold">Amount</th>
                        <th className="py-3 px-4 sm:px-5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 4).map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 sm:px-5 font-medium text-[#0B192C] text-xs sm:text-sm">{ord.reference}</td>
                          <td className="py-3 px-4 sm:px-5 text-slate-600 text-xs sm:text-sm">{ord.customer.fullName}</td>
                          <td className="py-3 px-4 sm:px-5 font-medium text-[#0B192C] text-xs sm:text-sm tabular-nums">₦{ord.total.toLocaleString()}</td>
                          <td className="py-3 px-4 sm:px-5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${ord.status === 'Delivered' || ord.status === 'Payment Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{ord.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= PROGRESS TAB ================= */}
          {activeTab === 'progress' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Operational Progress</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Track fulfillment and inventory health.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="font-semibold text-[#0B192C] flex items-center gap-2"><Truck className="w-5 h-5 text-slate-400" /> Fulfillment Pipeline</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Total: {orders.length} Orders</span>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full flex overflow-hidden mb-6">
                  <div className="bg-slate-300 h-full" style={{ width: `${pendingPct}%` }} title={`Pending: ${pendingPct}%`} />
                  <div className="bg-slate-400 h-full" style={{ width: `${processingPct}%` }} title={`Processing: ${processingPct}%`} />
                  <div className="bg-[#C29B57] h-full" style={{ width: `${shippedPct}%` }} title={`Shipped: ${shippedPct}%`} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${deliveredPct}%` }} title={`Delivered: ${deliveredPct}%`} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-slate-300" /><span className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Pending</span></div>
                    <div className="flex items-end justify-between"><span className="text-lg sm:text-xl font-bold text-[#0B192C]">{pendingOrders}</span><span className="text-[10px] sm:text-xs font-medium text-slate-500">{pendingPct}%</span></div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-slate-400" /><span className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Processing</span></div>
                    <div className="flex items-end justify-between"><span className="text-lg sm:text-xl font-bold text-[#0B192C]">{processingOrders}</span><span className="text-[10px] sm:text-xs font-medium text-slate-500">{processingPct}%</span></div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-[#C29B57]" /><span className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">Shipped</span></div>
                    <div className="flex items-end justify-between"><span className="text-lg sm:text-xl font-bold text-[#0B192C]">{shippedOrders}</span><span className="text-[10px] sm:text-xs font-medium text-slate-500">{shippedPct}%</span></div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg border border-emerald-100 bg-emerald-50/50">
                    <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider">Delivered</span></div>
                    <div className="flex items-end justify-between"><span className="text-lg sm:text-xl font-bold text-emerald-700">{deliveredOrders}</span><span className="text-[10px] sm:text-xs font-medium text-emerald-600">{deliveredPct}%</span></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#0B192C] mb-4 text-base sm:text-lg">Inventory Health</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-emerald-200 rounded-xl shadow-sm p-4 sm:p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3"><Check className="w-5 h-5 text-emerald-600" /></div>
                    <h4 className="text-sm font-semibold text-emerald-700 mb-1">Healthy Stock</h4>
                    <div className="flex items-end gap-2"><span className="text-2xl sm:text-3xl font-bold text-[#0B192C]">{healthyStock.length}</span><span className="text-xs sm:text-sm font-medium text-slate-500 mb-1">items</span></div>
                  </div>
                  <div className="bg-white border border-amber-200 rounded-xl shadow-sm p-4 sm:p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-1">Low Stock (&lt; 10)</h4>
                    <div className="flex items-end gap-2"><span className="text-2xl sm:text-3xl font-bold text-[#0B192C]">{lowStock.length}</span><span className="text-xs sm:text-sm font-medium text-slate-500 mb-1">items</span></div>
                  </div>
                  <div className="bg-white border border-rose-200 rounded-xl shadow-sm p-4 sm:p-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3"><X className="w-5 h-5 text-rose-600" /></div>
                    <h4 className="text-sm font-semibold text-rose-700 mb-1">Out of Stock</h4>
                    <div className="flex items-end gap-2"><span className="text-2xl sm:text-3xl font-bold text-[#0B192C]">{outOfStock.length}</span><span className="text-xs sm:text-sm font-medium text-slate-500 mb-1">items</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= PROFIT & LOSS TAB ================= */}
          {activeTab === 'profit-loss' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Profit & Loss</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Financial overview and revenue breakdown.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-500"><TrendingUp className="w-4 h-4" /><p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Gross Revenue</p></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] tabular-nums">₦{totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-rose-500"><TrendingDown className="w-4 h-4" /><p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Cost of Goods (COGS)</p></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] tabular-nums">₦{totalCost.toLocaleString()}</h3>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600"><Target className="w-4 h-4" /><p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Net Profit ({marginPercent}%)</p></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">₦{netProfit.toLocaleString()}</h3>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="font-semibold text-[#0B192C] mb-6 flex items-center gap-2"><PieChart className="w-5 h-5 text-slate-400" /> Revenue Breakdown</h3>
                <div className="w-full h-8 flex rounded-lg overflow-hidden mb-4">
                  <div className="bg-rose-400 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: '60%' }}>COGS (60%)</div>
                  <div className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: '40%' }}>Profit (40%)</div>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>₦{totalCost.toLocaleString()}</span>
                  <span>₦{netProfit.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0"><DollarSign className="w-5 h-5" /></div>
                  <div><p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Average Order Value</p><h3 className="text-lg sm:text-xl font-bold text-[#0B192C] tabular-nums">₦{Math.round(averageOrderValue).toLocaleString()}</h3></div>
                </div>
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0"><Package className="w-5 h-5" /></div>
                  <div><p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Items Sold</p><h3 className="text-lg sm:text-xl font-bold text-[#0B192C] tabular-nums">{totalItemsSold}</h3></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Orders / Tasks</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage customer requests and fulfillments.</p>
                </div>
                <button 
                  onClick={() => {
                    setNewOrderCustomer({ fullName: '', phone: '', email: '', address: '', city: '', state: '', notes: '' });
                    setNewOrderItems([]);
                    setCreateOrderError('');
                    setIsCreatingOrder(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create Order
                </button>
              </div>

              <div className="border-b border-slate-200 flex gap-6 overflow-x-auto custom-scrollbar">
                {[
                  { label: 'All Orders', count: orders.length, value: 'All' },
                  { label: 'Pending', count: pendingOrders, value: 'Pending' },
                  { label: 'Processing', count: processingOrders, value: 'Processing' },
                  { label: 'Shipped', count: shippedOrders, value: 'Shipped' },
                  { label: 'Delivered', count: deliveredOrders, value: 'Delivered' },
                ].map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setOrderFilter(tab.value)}
                    className={`pb-3 text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-2 border-b-2 transition-colors ${orderFilter === tab.value ? 'border-[#C29B57] text-[#C29B57]' : 'border-transparent text-slate-500 hover:text-[#0B192C] hover:border-slate-300'}`}
                  >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${orderFilter === tab.value ? 'bg-[#C29B57]/10 text-[#C29B57]' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by name, phone, order no, status..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none pl-9 py-2 text-sm text-[#0B192C] focus:outline-none placeholder:text-slate-400" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1 transition-colors"><Sliders className="w-3.5 h-3.5" /> Sort</button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">No orders found for this search.</div>
                ) : (
                  filteredOrders.map((ord: any) => (
                    <div key={ord.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200 shrink-0">{ord.customer.fullName.charAt(0).toUpperCase()}</div>
                          <div>
                            <h3 className="text-sm font-semibold text-[#0B192C]">{ord.customer.fullName}</h3>
                            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3" /> {new Date(ord.createdAt).toLocaleDateString()} 
                              <Clock className="w-3 h-3 ml-1" /> {new Date(ord.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">Order no. {ord.reference}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Order Details</h4>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"><MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /><span>{ord.customer.address}, {ord.customer.city}</span></div>
                            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"><Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /><span>{ord.customer.phone}</span></div>
                            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                              <Package className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                              <div className="flex flex-col gap-1">{ord.items.map((item: any, idx: number) => <span key={idx}>{item.quantity}x {item.productName}</span>)}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Notes</h4>
                          <p className="text-xs text-slate-500 leading-relaxed italic">{ord.customer.notes || "No additional instructions provided."}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Estimated Bills</h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₦{ord.subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-amber-600">
                              <span>Delivery</span>
                              <span className="text-[10px] sm:text-xs font-medium text-right">Arranged by Logistics Team</span>
                            </div>
                            <div className="flex justify-between font-semibold text-[#0B192C] border-t border-slate-100 pt-2">
                              <span>Total (Excl. Delivery)</span>
                              <span>₦{ord.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 sm:mt-6 pt-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                          <CustomSelect 
                            options={orderStatusOptions}
                            value={ord.status}
                            onChange={(newStatus) => {
                              const isVerified = (newStatus === 'Pending Confirmation' || newStatus === 'Awaiting Payment') ? false : ord.paymentVerified;
                              updateOrderStatus(ord.id, newStatus as Order['status'], isVerified);
                            }}
                            className="w-full sm:w-[200px]"
                          />
                          <button
                            onClick={() => {
                              const newVerified = !ord.paymentVerified;
                              const newStatus = newVerified ? (ord.status === 'Pending Confirmation' || ord.status === 'Awaiting Payment' ? 'Payment Confirmed' : ord.status) : (ord.status === 'Payment Confirmed' ? 'Awaiting Payment' : ord.status);
                              updateOrderStatus(ord.id, newStatus as Order['status'], newVerified);
                            }}
                            className={`w-full sm:w-auto px-4 py-2 rounded-full text-xs font-medium transition-colors border ${ord.paymentVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-white text-[#0B192C] border-slate-300 hover:bg-slate-50'}`}
                          >
                            {ord.paymentVerified ? 'Payment Verified' : 'Verify Payment'}
                          </button>
                        </div>
                        <button onClick={() => setViewingOrder(ord)} className="text-xs font-medium text-[#C29B57] hover:text-[#a88142] flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start mt-2 sm:mt-0 transition-colors">
                          View Full Details <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ================= PRODUCTS TAB ================= */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Product Inventory</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your store's catalog</p>
                </div>
                <button onClick={() => setEditingProduct({ name: '', price: 250000, categoryId: categories[0]?.id || 'cat-panels', brand: 'Dojech', description: '', inStock: true, stockQuantity: 10, specs: {}, images: ['/src/assets/images/cat_solar_panels_1793813620282.jpg'] })} className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"><Plus className="w-4 h-4" /> Add Product</button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-[10px] sm:text-xs text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 sm:px-5 font-medium">Product</th>
                        <th className="py-3 px-4 sm:px-5 font-medium">Category</th>
                        <th className="py-3 px-4 sm:px-5 font-medium">Price</th>
                        <th className="py-3 px-4 sm:px-5 font-medium">Stock</th>
                        <th className="py-3 px-4 sm:px-5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 sm:px-5 flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-slate-50 rounded border border-slate-200 p-1" />
                            <span className="font-medium text-[#0B192C] text-xs sm:text-sm line-clamp-1 max-w-[120px] sm:max-w-[200px]">{p.name}</span>
                          </td>
                          <td className="py-3 px-4 sm:px-5 text-slate-500 text-xs sm:text-sm">{p.categoryName}</td>
                          <td className="py-3 px-4 sm:px-5 font-medium text-[#0B192C] text-xs sm:text-sm tabular-nums">₦{p.price.toLocaleString()}</td>
                          <td className="py-3 px-4 sm:px-5"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{p.inStock ? `${p.stockQuantity} In Stock` : 'Out'}</span></td>
                          <td className="py-3 px-4 sm:px-5 text-right space-x-1">
                            <button onClick={() => setEditingProduct(p)} className="p-1.5 text-slate-400 hover:text-[#0B192C] hover:bg-slate-100 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => { if(confirm('Delete?')) deleteProduct(p.id) }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= HERO SLIDES TAB ================= */}
          {activeTab === 'slides' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Hero Slides</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage homepage banners and promotions.</p>
                </div>
                <button onClick={() => setEditingSlide({ heading: 'Smart Solar for Every Nigerian Home', description: 'Dependable solar power backup engineered to withstand tough grid conditions.', ctaText: 'Explore', ctaLink: 'shop', image: '/src/assets/images/hero_solar_residential_1793813490504.jpg', order: heroSlides.length + 1, isActive: true, accentBadge: 'Clean Energy' })} className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"><Plus className="w-4 h-4" /> Add Slide</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {heroSlides.map((slide: any) => (
                  <div key={slide.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col group">
                    <div className="relative h-40 sm:h-48 bg-slate-100 border-b border-slate-200">
                      <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">Order: {slide.order}</div>
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div><h4 className="font-semibold text-base sm:text-lg text-[#0B192C] leading-tight">{slide.heading}</h4><p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-2">{slide.description}</p></div>
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                        <span className="text-[10px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">CTA: {slide.ctaText}</span>
                        <div className="space-x-3">
                          <button onClick={() => setEditingSlide(slide)} className="text-xs sm:text-sm font-medium text-slate-500 hover:text-[#0B192C] transition-colors">Edit</button>
                          <button onClick={() => { if(confirm('Delete slide?')) deleteHeroSlide(slide.id) }} className="text-xs sm:text-sm font-medium text-rose-500 hover:text-rose-700 transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= CATEGORIES TAB ================= */}
          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Categories</h1>
                <button onClick={() => setEditingCategory({ name: '', slug: '', description: '', image: '/src/assets/images/cat_solar_panels_1793813620282.jpg' })} className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"><Plus className="w-4 h-4" /> Add Category</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((c: any) => (
                  <div key={c.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors group">
                    <img src={c.image} alt={c.name} className="w-full h-32 object-contain bg-slate-50 rounded-lg mb-4 p-2 border border-slate-100" />
                    <h4 className="font-semibold text-[#0B192C] text-sm sm:text-base leading-tight">{c.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => setEditingCategory(c)} className="text-xs font-medium text-slate-500 hover:text-[#0B192C] transition-colors">Edit</button>
                      <button onClick={() => { if(confirm('Delete?')) deleteCategory(c.id) }} className="text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= TESTIMONIALS TAB ================= */}
          {activeTab === 'testimonials' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Customer Reviews</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {testimonials.map((t: any) => (
                  <div key={t.id} className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div><h4 className="font-semibold text-[#0B192C] text-sm sm:text-base leading-tight">{t.name}</h4><p className="text-xs text-slate-500 mt-0.5">{t.location}</p></div>
                        <span className="text-amber-500 font-semibold text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100">★ {t.rating}.0</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">"{t.review}"</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100">
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{t.solarInstalled}</span>
                      <button onClick={() => { if(confirm('Delete?')) deleteTestimonial(t.id) }} className="text-xs font-medium text-rose-500 hover:text-rose-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">Store Settings</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Configure WhatsApp integration, shipping, and business details.</p>
              </div>

              <div className="bg-white border border-slate-200 p-4 sm:p-8 rounded-xl shadow-sm space-y-8">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-[#0B192C] border-b border-slate-100 pb-3 mb-4">WhatsApp Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2">WhatsApp Number (Intl Format)</label><input type="text" value={editingSettings.whatsappNumber} onChange={e => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] focus:border-[#C29B57] transition-all placeholder:text-slate-400" placeholder="e.g. 2348031234567" /></div>
                    <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2">Display Phone</label><input type="text" value={editingSettings.displayWhatsapp} onChange={e => setEditingSettings({ ...editingSettings, displayWhatsapp: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] focus:border-[#C29B57] transition-all placeholder:text-slate-400" placeholder="e.g. +234 803 123 4567" /></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-medium text-[#0B192C] border-b border-slate-100 pb-3 mb-4">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2">Store Name</label><input type="text" value={editingSettings.companyName} onChange={e => setEditingSettings({ ...editingSettings, companyName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] focus:border-[#C29B57] transition-all" /></div>
                    <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2">Official Email</label><input type="email" value={editingSettings.email} onChange={e => setEditingSettings({ ...editingSettings, email: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] focus:border-[#C29B57] transition-all" /></div>
                    <div className="md:col-span-2"><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2">Business Address</label><input type="text" value={editingSettings.address} onChange={e => setEditingSettings({ ...editingSettings, address: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] focus:border-[#C29B57] transition-all" /></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => { 
                      saveSettings(editingSettings); 
                      setShowSavedToast(true); 
                      setTimeout(() => setShowSavedToast(false), 3000); 
                    }} 
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors shadow-sm"
                  >
                    Save Settings
                  </button>                
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {/* Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#0B192C]">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                <button onClick={() => setEditingProduct(null)} className="p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-[#0B192C] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Product Image</label>
                  {editingProduct.images?.[0] ? (
                    <div className="relative w-full h-40 sm:h-48 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group mb-2">
                      <img src={editingProduct.images[0]} alt="Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><button onClick={() => setEditingProduct({ ...editingProduct, images: [] })} className="p-2 bg-white text-rose-600 rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button></div>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${uploadError ? 'border-rose-300 bg-rose-50' : 'border-slate-300 hover:border-[#C29B57] hover:bg-[#C29B57]/5'}`}>
                      {isUploading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C29B57] mb-3" /> : <UploadCloud className={`w-8 h-8 mb-2 ${uploadError ? 'text-rose-400' : 'text-slate-400'}`} />}
                      <p className="text-xs sm:text-sm font-medium text-slate-700 text-center">Click to upload image</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 text-center mt-1">Max size: 800KB</p>
                      {uploadError && <p className="text-[10px] sm:text-xs text-rose-600 text-center mt-2 font-medium">{uploadError}</p>}
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'product')} className="hidden" />
                </div>

                <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Product Name</label><input type="text" value={editingProduct.name || ''} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Price (₦)</label><input type="number" value={editingProduct.price || 0} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                  <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Brand</label><input type="text" value={editingProduct.brand || ''} onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Category</label>
                    <CustomSelect options={categories.map((c: any) => ({ label: c.name, value: c.id }))} value={editingProduct.categoryId || categories[0]?.id || ''} onChange={(val) => setEditingProduct({ ...editingProduct, categoryId: val })} />
                  </div>
                  <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Stock Quantity</label><input type="number" value={editingProduct.stockQuantity || 0} onChange={e => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                </div>
                <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Description</label><textarea rows={3} value={editingProduct.description || ''} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] resize-none" /></div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700"><input type="checkbox" checked={editingProduct.inStock ?? true} onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} className="accent-[#C29B57] w-4 h-4 rounded border-slate-300" /> In Stock</label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700"><input type="checkbox" checked={editingProduct.isBestseller ?? false} onChange={e => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })} className="accent-[#C29B57] w-4 h-4 rounded border-slate-300" /> Bestseller</label>
                </div>
                <button onClick={() => { saveProduct(editingProduct); setEditingProduct(null); }} disabled={isUploading} className="w-full py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors mt-4 disabled:opacity-50 shadow-sm">Save Product</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Slide Modal */}
        {editingSlide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingSlide(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#0B192C]">{editingSlide.id ? 'Edit Slide' : 'New Slide'}</h3>
                <button onClick={() => setEditingSlide(null)} className="p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-[#0B192C] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 block mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Background Image</label>
                  {editingSlide.image ? (
                    <div className="relative w-full h-40 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group mb-2">
                      <img src={editingSlide.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><button onClick={() => setEditingSlide({ ...editingSlide, image: '' })} className="p-2 bg-white text-rose-600 rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button></div>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${uploadError ? 'border-rose-300 bg-rose-50' : 'border-slate-300 hover:border-[#C29B57] hover:bg-[#C29B57]/5'}`}>
                      {isUploading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C29B57] mb-3" /> : <UploadCloud className={`w-8 h-8 mb-2 ${uploadError ? 'text-rose-400' : 'text-slate-400'}`} />}
                      <p className="text-xs sm:text-sm font-medium text-slate-700 text-center">Click to upload image</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 text-center mt-1">Max size: 800KB</p>
                      {uploadError && <p className="text-[10px] sm:text-xs text-rose-600 text-center mt-2 font-medium">{uploadError}</p>}
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'slide')} className="hidden" />
                </div>

                <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Heading</label><input type="text" value={editingSlide.heading || ''} onChange={e => setEditingSlide({ ...editingSlide, heading: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Description</label><textarea rows={2} value={editingSlide.description || ''} onChange={e => setEditingSlide({ ...editingSlide, description: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57] resize-none" /></div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">CTA Text</label><input type="text" value={editingSlide.ctaText || ''} onChange={e => setEditingSlide({ ...editingSlide, ctaText: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                  <div><label className="text-xs sm:text-sm font-medium text-slate-700 block mb-1">Order</label><input type="number" value={editingSlide.order || 1} onChange={e => setEditingSlide({ ...editingSlide, order: Number(e.target.value) })} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0B192C] focus:outline-none focus:ring-1 focus:ring-[#C29B57]" /></div>
                </div>
                <button onClick={() => { saveHeroSlide(editingSlide); setEditingSlide(null); }} disabled={isUploading} className="w-full py-2.5 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors mt-4 disabled:opacity-50 shadow-sm">Save Slide</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Order Modal */}
        {isCreatingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreatingOrder(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white border border-slate-200 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
              
              {/* Left: Customer Details */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-slate-200">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0B192C]">Customer Details</h3>
                  <button onClick={() => setIsCreatingOrder(false)} className="md:hidden p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-[#0B192C]"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="space-y-4">
                  <div><label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label><input type="text" value={newOrderCustomer.fullName} onChange={e => setNewOrderCustomer({...newOrderCustomer, fullName: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57]" /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-slate-700 block mb-1">Phone</label><input type="text" value={newOrderCustomer.phone} onChange={e => setNewOrderCustomer({...newOrderCustomer, phone: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57]" /></div>
                    <div><label className="text-xs font-medium text-slate-700 block mb-1">Email (Optional)</label><input type="email" value={newOrderCustomer.email} onChange={e => setNewOrderCustomer({...newOrderCustomer, email: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57]" /></div>
                  </div>
                  <div><label className="text-xs font-medium text-slate-700 block mb-1">Address</label><input type="text" value={newOrderCustomer.address} onChange={e => setNewOrderCustomer({...newOrderCustomer, address: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57]" /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-slate-700 block mb-1">City</label><input type="text" value={newOrderCustomer.city} onChange={e => setNewOrderCustomer({...newOrderCustomer, city: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57]" /></div>
                    <div><label className="text-xs font-medium text-slate-700 block mb-1">State</label><input type="text" value={newOrderCustomer.state} onChange={e => setNewOrderCustomer({...newOrderCustomer, state: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57]" /></div>
                  </div>
                  <div><label className="text-xs font-medium text-slate-700 block mb-1">Notes</label><textarea rows={2} value={newOrderCustomer.notes} onChange={e => setNewOrderCustomer({...newOrderCustomer, notes: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B192C] focus:ring-1 focus:ring-[#C29B57] resize-none" /></div>
                </div>
              </div>

              {/* Right: Add Products */}
              <div className="flex-1 p-4 sm:p-6 bg-slate-50/50 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0B192C]">Add Products</h3>
                  <button onClick={() => setIsCreatingOrder(false)} className="hidden md:block p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-[#0B192C]"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 custom-scrollbar">
                  {products.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-contain shrink-0 bg-slate-50 rounded" />
                        <div><p className="text-xs font-semibold text-[#0B192C] line-clamp-1">{p.name}</p><p className="text-[10px] text-slate-500">₦{p.price.toLocaleString()}</p></div>
                      </div>
                      <button onClick={() => {
                        const existing = newOrderItems.find(i => i.product.id === p.id);
                        if (existing) setNewOrderItems(newOrderItems.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
                        else setNewOrderItems([...newOrderItems, { product: p, quantity: 1 }]);
                      }} className="p-1.5 bg-[#C29B57]/10 text-[#C29B57] rounded hover:bg-[#C29B57]/20 shrink-0 transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shrink-0">
                  <h4 className="text-xs font-bold text-[#0B192C] mb-2 uppercase tracking-wider">Order Summary</h4>
                  <div className="max-h-32 overflow-y-auto space-y-2 mb-3 custom-scrollbar">
                    {newOrderItems.length === 0 ? <p className="text-xs text-slate-500">No items selected.</p> : newOrderItems.map(item => (
                      <div key={item.product.id} className="flex justify-between text-xs"><span className="text-slate-600 truncate mr-2">{item.quantity}x {item.product.name}</span><span className="font-semibold text-[#0B192C] shrink-0">₦{(item.product.price * item.quantity).toLocaleString()}</span></div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-sm text-[#0B192C]"><span>Total:</span><span>₦{newOrderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}</span></div>
                  
                  {createOrderError && (
                    <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-md flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{createOrderError}</span>
                    </div>
                  )}

                  <button onClick={handleCreateOrder} className="w-full mt-4 py-2 bg-[#0B192C] text-white text-sm font-medium rounded-full hover:bg-black transition-colors shadow-sm">Create Order</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Full Order Details Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingOrder(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white border border-slate-200 w-full max-w-2xl rounded-xl shadow-2xl p-4 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <div><h3 className="text-lg sm:text-xl font-bold text-[#0B192C]">Order Details</h3><p className="text-xs sm:text-sm text-slate-500 mt-1">Ref: {viewingOrder.reference}</p></div>
                <button onClick={() => setViewingOrder(null)} className="p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-[#0B192C]"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Customer Info</h4>
                  <p className="text-sm font-semibold text-[#0B192C]">{viewingOrder.customer.fullName}</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">{viewingOrder.customer.phone}</p>
                  {viewingOrder.customer.email && <p className="text-xs sm:text-sm text-slate-600">{viewingOrder.customer.email}</p>}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">{viewingOrder.customer.address}</p>
                  <p className="text-xs sm:text-sm text-slate-600">{viewingOrder.customer.city}, {viewingOrder.customer.state}</p>
                </div>

                <div>
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Order Details</h4>
                   <p className="text-xs sm:text-sm text-slate-600">Date: <span className="font-medium text-[#0B192C]">{new Date(viewingOrder.createdAt).toLocaleString()}</span></p>
                   <p className="text-xs sm:text-sm text-slate-600 mt-1">Status: <span className="font-medium text-[#0B192C]">{viewingOrder.status}</span></p>
                   <p className="text-xs sm:text-sm text-slate-600 mt-1">Payment: <span className={`font-medium ${viewingOrder.paymentVerified ? 'text-emerald-600' : 'text-amber-600'}`}>{viewingOrder.paymentVerified ? 'Verified' : 'Pending'}</span></p>
                   {viewingOrder.customer.notes && <p className="text-xs sm:text-sm text-slate-600 mt-2 italic">"{viewingOrder.customer.notes}"</p>}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto mb-6">
                <table className="w-full text-left text-xs sm:text-sm min-w-[400px]">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Item</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-center">Qty</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-right">Price</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingOrder.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 flex items-center gap-2 sm:gap-3">
                           <img src={item.image} alt={item.productName} className="w-8 h-8 object-contain bg-slate-50 rounded shrink-0" />
                           <div><p className="font-semibold text-[#0B192C] line-clamp-1 max-w-[120px] sm:max-w-none">{item.productName}</p><p className="text-[10px] text-slate-500">{item.brand}</p></div>
                        </td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-center font-medium text-slate-700">{item.quantity}</td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-right text-slate-600 tabular-nums">₦{item.unitPrice.toLocaleString()}</td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-right font-semibold text-[#0B192C] tabular-nums">₦{item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="tabular-nums">₦{viewingOrder.subtotal.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-amber-600">
                    <span>Delivery Fee</span>
                    <span className="text-[10px] sm:text-xs font-medium text-right">Arranged by Logistics Team</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#0B192C] text-sm sm:text-base border-t border-slate-200 pt-2">
                    <span>Total (Excl. Delivery)</span>
                    <span className="tabular-nums">₦{viewingOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[200] bg-[#0B192C] border border-slate-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3"
          >
            <div className="bg-emerald-500 rounded-full p-1 shadow-lg shadow-emerald-500/30">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};