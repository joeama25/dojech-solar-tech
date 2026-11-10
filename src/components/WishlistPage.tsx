import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { Product } from '../types';
import { motion } from 'motion/react';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string) => void;
  onOpenCart: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, onNavigate, onOpenCart }) => {
  const { wishlist, products, toggleWishlist, addToCart } = useSolar();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[var(--paper)] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 border-b border-[var(--line)] pb-6"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] block mb-2">Saved Items</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">Your Wishlist ({wishlistedProducts.length})</h1>
          </div>
          <button onClick={() => onNavigate('shop')} className="text-xs font-bold text-[var(--copper)] hover:underline flex items-center gap-1 uppercase tracking-wider">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-[var(--line)] p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[var(--paper)] text-[var(--sage)] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[var(--ink)]">Your wishlist is empty</h2>
            <p className="text-xs text-[var(--sage)]">Explore our solar panels, inverters, and batteries.</p>
            <button onClick={() => onNavigate('shop')} className="px-6 py-3 bg-[var(--ink)] text-[var(--paper)] font-bold text-[10px] uppercase tracking-wider rounded-md hover:bg-[var(--forest)] transition-colors">
              Explore Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlistedProducts.map(prod => (
              <motion.div 
                key={prod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-white rounded-lg border border-[var(--line)] p-3 sm:p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-[var(--paper)] rounded-md p-3 flex items-center justify-center overflow-hidden mb-3">
                  <img 
                    src={prod.images[0]} alt={prod.name} 
                    className="w-full h-full object-contain mix-blend-multiply cursor-pointer" 
                    onClick={() => onSelectProduct(prod)} 
                  />
                  <button 
                    onClick={() => toggleWishlist(prod.id)} 
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-[var(--sage)] hover:text-[var(--terracotta)] rounded-full shadow-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-[var(--copper)] uppercase tracking-wider">{prod.brand}</span>
                  <h3 onClick={() => onSelectProduct(prod)} className="font-bold text-xs sm:text-sm text-[var(--ink)] line-clamp-2 cursor-pointer hover:text-[var(--copper)] transition-colors mt-0.5">
                    {prod.name}
                  </h3>
                  <div className="text-xs font-bold text-[var(--ink)] mt-1.5 tabular-nums">₦{prod.price.toLocaleString()}</div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] mt-3">
                  <button 
                    onClick={() => { addToCart(prod, 1); onOpenCart(); }} 
                    className="w-full py-2 bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--copper)] font-bold text-[9px] uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};