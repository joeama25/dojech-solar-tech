import React, { useState } from 'react';
import { SolarProvider, useSolar } from './context/SolarContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartModal } from './components/CartModal';
import { SearchModal } from './components/SearchModal';
import { WishlistPage } from './components/WishlistPage';
import { AccountPage } from './components/AccountPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PolicyPage } from './components/PolicyPage'; // Ensure this file is created
import { Product, Category } from './types';
import { ArrowRight, Phone } from 'lucide-react';

function MainApp() {
  const { categories } = useSolar();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string | undefined>(undefined);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavigate = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.categoryId) {
      setFilterCategoryId(params.categoryId);
      setCurrentView('shop');
      return;
    }
    setCurrentView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* 1. HIDE THE STOREFRONT HEADER IF IN ADMIN VIEW */}
      {currentView !== 'admin' && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* 2. REMOVE TOP PADDING FOR ADMIN VIEW */}
      <main className={`flex-1 ${currentView !== 'home' && currentView !== 'admin' ? 'pt-20 sm:pt-32' : ''}`}>
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategoryId={filterCategoryId}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'categories' && (
          <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Catalog Taxonomy
                </span>
                <h1 className="text-3xl font-extrabold text-[#0B192C]">
                  All Solar Product Categories
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  Select a category to view specialized technical equipment with guaranteed specifications
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => handleNavigate('shop', { categoryId: cat.id })}
                    className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#0B192C] group-hover:text-amber-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        <span>Explore Range</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentView('shop')}
            onSelectProduct={handleSelectProduct}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'account' && <AccountPage />}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}

        {/* --- LEGAL PAGES --- */}
        {currentView === 'privacy' && (
          <PolicyPage 
            title="Privacy Policy" 
            subtitle="Data Protection & Usage" 
            onBack={() => handleNavigate('home')}
          >
            <p className="text-sm sm:text-base font-medium text-slate-700 mb-8">Last Updated: October 2024</p>
            
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">At Dojech Solar Tech, we collect information to provide better services to our customers. We collect information in the following ways:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><strong>Information you give us:</strong> When you place an order via WhatsApp checkout or our website, we collect your name, phone number, delivery address, and email address.</li>
              <li><strong>Transaction Information:</strong> Details about the products you purchase, payment status, and delivery instructions.</li>
              <li><strong>Automatically collected information:</strong> We may collect basic analytics data such as your IP address, browser type, and pages visited to improve our site experience.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Fulfill your orders and arrange delivery through our logistics partners.</li>
              <li>Communicate with you regarding order confirmations, technical support, and warranty claims.</li>
              <li>Send promotional offers and updates (you can opt out at any time).</li>
              <li>Improve our website and product offerings.</li>
            </ul>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">3. Data Sharing & Security</h2>
            <p className="leading-relaxed mb-6">We do not sell, trade, or rent your personal information to third parties. We only share information with trusted third parties (like delivery logistics) to fulfill your order. We implement industry-standard security measures to protect your data.</p>
          </PolicyPage>
        )}

        {currentView === 'terms' && (
          <PolicyPage 
            title="Terms of Service" 
            subtitle="Usage Guidelines" 
            onBack={() => handleNavigate('home')}
          >
            <p className="text-sm sm:text-base font-medium text-slate-700 mb-8">Last Updated: October 2024</p>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">1. Acceptance of Terms</h2>
            <p className="leading-relaxed mb-6">By accessing and using the Dojech Solar Tech website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to abide by these terms, please do not use our services.</p>
            
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">2. Product Information & Pricing</h2>
            <p className="leading-relaxed mb-4">While we strive for absolute accuracy, all product specifications, images, and technical data are subject to change without notice. Prices for our products are subject to change without notice.</p>
            <p className="leading-relaxed mb-6">We reserve the right to modify or discontinue any product at any time. All prices are listed in Nigerian Naira (₦) and are exclusive of delivery fees unless explicitly stated.</p>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">3. Orders & Delivery</h2>
            <p className="leading-relaxed mb-6">Your order is an offer to buy, which we may accept or decline. Delivery timelines are estimates and may vary based on your location and logistics availability. Delivery fees are arranged and communicated separately by our logistics team upon order confirmation.</p>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">4. Limitation of Liability</h2>
            <p className="leading-relaxed mb-6">Dojech Solar Tech shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products, including but not limited to loss of power, data, or profits.</p>
          </PolicyPage>
        )}

        {currentView === 'warranty' && (
          <PolicyPage 
            title="Product Warranty" 
            subtitle="Guarantees & Coverage" 
            onBack={() => handleNavigate('home')}
          >
            <p className="text-sm sm:text-base font-medium text-slate-700 mb-8">Last Updated: October 2024</p>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">Standard Manufacturer Coverage</h2>
            <p className="leading-relaxed mb-4">At Dojech, we only sell Tier-1 equipment. Your purchase is backed by comprehensive manufacturer warranties:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><strong>Solar Panels:</strong> 25-year performance warranty (guaranteeing a specific power output) and a 10-year physical defect warranty.</li>
              <li><strong>Inverters & Hybrid Systems:</strong> 5-year standard manufacturer defect warranty.</li>
              <li><strong>LiFePO4 Batteries:</strong> 5 to 10-year warranty depending on the specific brand and cycle life rating.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">What is Not Covered</h2>
            <p className="leading-relaxed mb-4">Warranties are strictly voided under the following conditions:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Physical damage, corrosion, or breakage caused by improper handling, installation, or accidents.</li>
              <li>Unauthorized modifications, repairs, or tampering with the equipment's seals.</li>
              <li>Installation performed by uncertified third-party engineers that violates our technical guidelines.</li>
              <li>Damage caused by extreme natural events (lightning strikes, severe flooding, fire).</li>
            </ul>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">How to File a Claim</h2>
            <p className="leading-relaxed mb-6">To initiate a warranty claim, please contact our support team via WhatsApp with your order reference number, proof of purchase, and a detailed description (and photos if possible) of the issue. Our engineers will assess the equipment and process the claim with the manufacturer.</p>
          </PolicyPage>
        )}

        {currentView === 'admin' && <AdminDashboard onNavigate={handleNavigate}/>}
      </main>

      {/* Global Footer */}
      {currentView !== 'admin' && <Footer onNavigate={handleNavigate} />}

      {/* Cart & Checkout Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Global Search Popup */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <SolarProvider>
      <MainApp />
    </SolarProvider>
  );
}