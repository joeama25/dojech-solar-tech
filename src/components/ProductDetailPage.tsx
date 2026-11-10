import React, { useState } from 'react';
import { Star, ShieldCheck, Truck, Zap, Phone, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useSolar } from '../context/SolarContext';
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onSelectProduct, onOpenCart }) => {
  const { products, addToCart, wishlist, toggleWishlist, settings } = useSolar();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'warranty'>('specs');

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const whatsappEnquiryMessage = encodeURIComponent(
    `Hello Dojech Solar Tech!\n\nI would like to make an enquiry about:\nProduct: ${product.name}\nPrice: ₦${product.price.toLocaleString()}\nBrand: ${product.brand}\n\nCould you please confirm current stock and provide delivery timeline to my state?`
  );
  const whatsappEnquiryUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappEnquiryMessage}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--paper)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-[var(--sage)] mb-8">
          <button onClick={onBack} className="hover:text-[var(--ink)] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={onBack} className="hover:text-[var(--ink)] transition-colors">{product.categoryName || 'Shop'}</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--terracotta)] truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* Product Layout */}
        <div className="bg-white rounded-lg border border-[var(--line)] p-5 sm:p-8 lg:p-10 mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Images */}
            <div className="lg:col-span-7 space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                className="w-full aspect-[4/3] bg-[var(--paper)] rounded-lg border border-[var(--line)] flex items-center justify-center p-6 overflow-hidden"
              >
                <img src={selectedImage || product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </motion.div>

              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx} onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-md border-2 p-1 bg-[var(--paper)] overflow-hidden transition-all ${selectedImage === img ? 'border-[var(--copper)]' : 'border-[var(--line)] hover:border-[var(--sage)]'}`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--line)] text-center">
                <div className="p-3 bg-[var(--paper)] rounded-md border border-[var(--line)]/50">
                  <ShieldCheck className="w-5 h-5 text-[var(--copper)] mx-auto mb-1" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">Genuine</p>
                </div>
                <div className="p-3 bg-[var(--paper)] rounded-md border border-[var(--line)]/50">
                  <Truck className="w-5 h-5 text-[var(--copper)] mx-auto mb-1" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">Dispatch</p>
                </div>
                <div className="p-3 bg-[var(--paper)] rounded-md border border-[var(--line)]/50">
                  <Zap className="w-5 h-5 text-[var(--copper)] mx-auto mb-1" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">Warranty</p>
                </div>
              </div>
            </div>

            {/* Details & Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--copper)] mb-2">
                  <span>{product.brand}</span>
                  <span className={product.inStock ? 'text-[var(--forest)]' : 'text-[var(--sage)]'}>
                    {product.inStock ? 'In Stock' : 'Unavailable'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--ink)] leading-tight mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center text-[var(--sun)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[var(--sun)]' : 'text-[var(--line)]'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[var(--ink)]">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-[var(--sage)]">({product.reviewCount} reviews)</span>
                </div>

                <div className="p-5 bg-[var(--paper)] rounded-lg border border-[var(--line)] mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[var(--ink)] tabular-nums">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-[var(--sage)] line-through tabular-nums">₦{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--sage)] mt-1 uppercase tracking-wider">Inclusive of standard transit insurance</p>
                </div>

                <p className="text-sm text-[var(--sage)] leading-relaxed mb-6">
                  {product.shortDescription || product.description}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[var(--line)] rounded-md bg-white p-1">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-[var(--sage)] hover:text-[var(--copper)]">-</button>
                      <span className="px-4 text-sm font-bold text-[var(--ink)] tabular-nums">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-[var(--sage)] hover:text-[var(--copper)]">+</button>
                    </div>

                    <button onClick={() => toggleWishlist(product.id)} className={`w-12 h-12 rounded-md border border-[var(--line)] flex items-center justify-center transition-colors ${isWishlisted ? 'text-[var(--terracotta)] bg-[var(--terracotta)]/10 border-[var(--terracotta)]/30' : 'text-[var(--sage)] hover:bg-[var(--paper)]'}`}>
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[var(--terracotta)]' : ''}`} />
                    </button>
                  </div>

                  <button onClick={() => { addToCart(product, quantity); onOpenCart(); }} disabled={!product.inStock} className="w-full py-4 bg-[var(--ink)] hover:bg-[var(--copper)] text-[var(--paper)] font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>

                  <a href={whatsappEnquiryUrl} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-[var(--forest)] hover:bg-[#16211b] text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all">
                    <Phone className="w-4 h-4" /> Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-[var(--line)] p-6 sm:p-10 mb-16 shadow-sm">
          <div className="flex flex-wrap border-b border-[var(--line)] gap-6 mb-6">
            {['specs', 'desc', 'warranty'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-[var(--terracotta)] border-b-2 border-[var(--terracotta)]' : 'text-[var(--sage)] hover:text-[var(--ink)]'}`}>
                {tab === 'specs' ? 'Technical Specs' : tab === 'desc' ? 'Description' : 'Warranty'}
              </button>
            ))}
          </div>

          <div className="text-sm text-[var(--sage)] leading-relaxed">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="flex justify-between p-3.5 rounded-md bg-[var(--paper)] border border-[var(--line)]">
                      <span className="text-xs font-bold text-[var(--sage)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-xs font-bold text-[var(--ink)]">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab === 'desc' && <p>{product.description}</p>}
            {activeTab === 'warranty' && (
              <div className="flex items-start gap-3 p-5 bg-[var(--paper)] rounded-lg border border-[var(--line)]">
                <ShieldCheck className="w-6 h-6 text-[var(--forest)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">{product.warranty}</h4>
                  <p className="text-xs text-[var(--sage)]">All products bought through Dojech Solar Tech feature serialized warranty cards backed by direct authorized OEM service centers.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--ink)] uppercase tracking-wider">Related Hardware</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => <ProductCard key={rel.id} product={rel} onSelect={onSelectProduct} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};