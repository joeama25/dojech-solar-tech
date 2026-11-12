import React, { useState, useEffect } from 'react';
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
import { PolicyPage } from './components/PolicyPage';
import { Product, Category } from './types';
import { ArrowRight, Phone } from 'lucide-react';

function MainApp() {
  const { categories } = useSolar();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string | undefined>(undefined);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- FIX 1: Initialize history & listen for browser/swipe back buttons ---
  useEffect(() => {
    // 1. Setup the initial history state if it's missing
    if (!window.history.state) {
      window.history.replaceState({ view: 'home' }, '', '/');
    }

    // 2. Listen for native back/forward/swipe events
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.categoryId) {
      setFilterCategoryId(params.categoryId);
      setCurrentView('shop');
      window.history.pushState({ view: 'shop' }, '', '/shop');
      return;
    }
    setCurrentView(view);
    window.history.pushState({ view }, '', `/${view}`);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.history.pushState({ view: 'product-detail' }, '', '/product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {currentView !== 'admin' && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

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
                {categories.map((cat: any) => (
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
            onBack={() => window.history.back()} // Use native history back
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

        {currentView === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentView === 'contact' && <ContactPage />}

        {/* --- LEGAL PAGES --- */}
        {currentView === 'privacy' && (
          <PolicyPage 
            title="Privacy Policy" 
            subtitle="Data Protection & Usage" 
            onBack={() => window.history.back()} 
          >
             <p className="text-sm sm:text-base font-medium text-slate-700 mb-8">Last Updated: October 2024</p>
             <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">1. Information We Collect</h2>
          </PolicyPage>
        )}

        {currentView === 'terms' && (
          <PolicyPage 
            title="Terms of Service" 
            subtitle="Usage Guidelines" 
            onBack={() => window.history.back()} 
          >
            <p className="text-sm sm:text-base font-medium text-slate-700 mb-8">Last Updated: October 2024</p>
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">1. Acceptance of Terms</h2>
          </PolicyPage>
        )}

        {currentView === 'warranty' && (
          <PolicyPage 
            title="Product Warranty" 
            subtitle="Guarantees & Coverage" 
            onBack={() => window.history.back()} 
          >
            <p className="text-sm sm:text-base font-medium text-slate-700 mb-8">Last Updated: October 2024</p>
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4 mt-8">Standard Manufacturer Coverage</h2>
          </PolicyPage>
        )}

        {currentView === 'admin' && <AdminDashboard onNavigate={handleNavigate}/>}
      </main>

      {currentView !== 'admin' && <Footer onNavigate={handleNavigate} />}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

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