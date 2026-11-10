import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useSolar } from '../context/SolarContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, wishlist, toggleWishlist } = useSolar();
  const isWishlisted = wishlist.includes(product.id);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-[var(--paper)] rounded-xl border border-[var(--line)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[var(--copper)] h-full"
    >
      
      {/* Image Area */}
      <div onClick={() => onSelect(product)} className="relative w-full aspect-[4/3] bg-white cursor-pointer overflow-hidden p-4 sm:p-6 flex items-center justify-center shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-black bg-[var(--sun)] px-2 py-0.5 rounded-sm shadow-sm">
              Sale
            </span>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm text-[var(--sage)] hover:text-[var(--terracotta)] shadow-sm flex items-center justify-center transition-all"
        >
          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-[var(--terracotta)] text-[var(--terracotta)]' : ''}`} />
        </button>
      </div>

      {/* Info Area */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--copper)] truncate mr-2">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-[var(--sage)] shrink-0">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[var(--sun)] text-[var(--sun)]" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <h3 onClick={() => onSelect(product)} className="text-xs sm:text-base font-bold text-[var(--ink)] tracking-tight leading-snug cursor-pointer group-hover:text-[var(--copper)] transition-colors mb-3 sm:mb-4 line-clamp-2">
          {product.name}
        </h3>

        {/* Price & Cart Button Row */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 sm:pt-3 border-t border-[var(--line)]">
          <div className="flex flex-col min-w-0">
            <div className="text-sm sm:text-lg font-black text-[var(--ink)] tabular-nums truncate">
              ₦{product.price.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="text-[9px] sm:text-[10px] text-[var(--sage)] line-through tabular-nums truncate">
                ₦{product.originalPrice?.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={e => { e.stopPropagation(); addToCart(product, 1); }}
            disabled={!product.inStock}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--ink)] flex items-center justify-center text-white hover:bg-[var(--copper)] transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};