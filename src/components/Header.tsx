import React, { useState, useEffect } from 'react';
import { Sun, Search, Heart, ShoppingBag, User, Menu, X, Phone, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenCart, onOpenSearch }) => {
  const { cartTotalCount, wishlist, currentUser, isAdmin, signOut, signInWithGoogle, settings } = useSolar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = isScrolled || currentView !== 'home';

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isSolid
            ? 'bg-white py-4 shadow-sm border-b border-[var(--line)]'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="flex items-center gap-2 group focus:outline-none z-50">
            <Sun className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-colors duration-500 ${isSolid ? 'text-[var(--ink)]' : 'text-white'}`} strokeWidth={1.5} />
            <span className={`text-xl sm:text-2xl lg:text-[28px] font-medium tracking-tight transition-colors duration-500 ${isSolid ? 'text-[var(--ink)]' : 'text-white'}`}>
              dojech
            </span>
          </button>

          {/* Centered Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-10 text-sm font-medium transition-colors duration-500 ${isSolid ? 'text-[var(--sage)]' : 'text-white/80'}`}>
            {currentView === 'admin' ? (
              <div className="flex items-center gap-4 bg-[var(--ink)] text-white px-4 py-1.5 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--sun)]">Admin Mode</span>
                <button onClick={() => onNavigate('home')} className="text-[10px] font-bold uppercase tracking-wider hover:text-[var(--sun)] transition-colors">
                  Exit to Store
                </button>
              </div>
            ) : (
              ['Home', 'Shop', 'Categories', 'About', 'Contact'].map((view) => (
                <button
                  key={view}
                  onClick={() => onNavigate(view.toLowerCase())}
                  className={`hover:${isSolid ? 'text-[var(--ink)]' : 'text-white'} transition-colors relative`}
                >
                  {view}
                </button>
              ))
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 z-50">
            <button onClick={onOpenSearch} className={`hidden sm:block p-2 transition-colors ${isSolid ? 'text-[var(--sage)] hover:text-[var(--ink)]' : 'text-white/80 hover:text-white'}`}>
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button onClick={() => onNavigate('wishlist')} className={`hidden sm:block relative p-2 transition-colors ${isSolid ? 'text-[var(--sage)] hover:text-[var(--ink)]' : 'text-white/80 hover:text-white'}`}>
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[var(--terracotta)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={onOpenCart} className={`relative p-2 transition-colors flex items-center gap-1.5 ${isSolid ? 'text-[var(--sage)] hover:text-[var(--ink)]' : 'text-white/80 hover:text-white'}`}>
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartTotalCount > 0 && (
                <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${isSolid ? 'bg-[var(--ink)] text-white' : 'bg-white text-[var(--ink)]'}`}>
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* PROMINENT LOGIN / ACCOUNT BUTTON (Always visible on Desktop) */}
            <div className="relative hidden sm:block ml-2">
              <button 
                onClick={() => currentUser ? setUserDropdownOpen(!userDropdownOpen) : signInWithGoogle()} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-xs font-bold ${
                  isSolid 
                    ? 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)]' 
                    : 'bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-[var(--ink)]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{currentUser ? 'Account' : 'Login'}</span>
                {currentUser && <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-1" />}
              </button>

              <AnimatePresence>
                {userDropdownOpen && currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-60 bg-white rounded-lg shadow-xl border border-[var(--line)] py-1 z-50 overflow-hidden"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 bg-[var(--paper)] border-b border-[var(--line)]">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--sage)]">Signed in as</p>
                      <p className="text-xs font-bold text-[var(--ink)] truncate">{currentUser.displayName || currentUser.email}</p>
                    </div>

                    <button onClick={() => { onNavigate('account'); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper)] flex items-center gap-2">
                      <User className="w-4 h-4 text-[var(--copper)]" /> My Account
                    </button>
                    {isAdmin && (
                      <button onClick={() => { onNavigate('admin'); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper)] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[var(--copper)]" /> Admin Dashboard
                      </button>
                    )}
                    <div className="border-t border-[var(--line)] mt-1 pt-1">
                      <button onClick={() => { signOut(); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-bold uppercase tracking-wider">Sign Out</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => onNavigate('shop')}
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isSolid 
                  ? 'bg-[var(--ink)] text-white hover:bg-black' 
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black'
              }`}
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className={`lg:hidden p-2 transition-colors ml-1 ${isSolid ? 'text-[var(--ink)]' : 'text-white'}`}
            >
              <Menu className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* IMMERSIVE FULL-SCREEN MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[#0B0C10] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sun className="w-6 h-6 text-white" strokeWidth={1.5} />
                <span className="text-xl font-medium tracking-tight text-white">dojech</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/70 hover:text-white bg-white/5 rounded-full">
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-12">
              <div className="flex flex-col space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Menu</span>
                {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((view, idx) => (
                  <motion.button 
                    key={view}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                    onClick={() => { onNavigate(view.toLowerCase()); setMobileMenuOpen(false); }} 
                    className="text-4xl sm:text-5xl font-light text-white text-left hover:text-[var(--sun)] hover:italic transition-all duration-300 tracking-tighter"
                  >
                    {view}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Quick Actions</span>
                
                <button onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-[var(--sun)]" />
                    <span className="text-white text-sm font-medium">Search Products</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </button>

                <button onClick={() => { onNavigate('wishlist'); setMobileMenuOpen(false); }} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-[var(--sun)]" />
                    <span className="text-white text-sm font-medium">Saved Wishlist ({wishlist.length})</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </button>

                <button onClick={() => { onNavigate('account'); setMobileMenuOpen(false); }} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[var(--sun)]" />
                    <span className="text-white text-sm font-medium">{currentUser ? 'My Account' : 'Sign In'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </button>

                {isAdmin && (
                  <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }} className="bg-[var(--sun)]/10 border border-[var(--sun)]/30 rounded-xl p-5 flex items-center justify-between hover:bg-[var(--sun)]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[var(--sun)]" />
                      <span className="text-[var(--sun)] text-sm font-medium">Admin Dashboard</span>
                    </div>
                  </button>
                )}

                <div className="pt-8">
                   <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-full py-4 bg-white text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                     <Phone className="w-4 h-4" /> Chat on WhatsApp
                   </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};