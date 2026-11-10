import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, Filter, X, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { useSolar } from '../context/SolarContext';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';

interface ShopPageProps {
  initialCategoryId?: string;
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (category: Category) => void;
}

// CUSTOM DROPDOWN COMPONENT
const CustomSelect = ({ options, value, onChange }: { options: {label: string, value: string}[], value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--line)] rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--ink)] hover:border-[var(--ink)] transition-colors min-w-[140px] justify-between"
      >
        {selectedOption?.label || 'Select'}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-[var(--line)] rounded-md shadow-xl z-50 overflow-hidden"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[var(--paper)] transition-colors ${value === opt.value ? 'text-[var(--terracotta)] bg-[var(--paper)]' : 'text-[var(--ink)]'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategoryId, onSelectProduct }) => {
  const { products, categories } = useSolar();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(3500000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return list.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (inStockOnly && !p.inStock) return false;
        if (p.price > priceRange) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          if (!matchName && !matchBrand) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, inStockOnly, priceRange, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setPriceRange(3500000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low-High', value: 'price-low' },
    { label: 'Price: High-Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' }
  ];

  const FilterContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-6">
        <span className="font-black text-xl uppercase tracking-tighter text-[var(--ink)] flex items-center gap-2">
          Filters
        </span>
        <div className="flex items-center gap-4">
          <button onClick={resetFilters} className="text-[10px] text-[var(--terracotta)] hover:underline font-bold uppercase tracking-wider">Reset</button>
          <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1 text-[var(--sage)] hover:text-[var(--ink)] bg-[var(--paper)] rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sage)] mb-4">Categories</h4>
          <div className="space-y-3 text-sm font-medium">
            <button onClick={() => setSelectedCategory('all')} className={`flex items-center justify-between w-full text-left transition-colors group ${selectedCategory === 'all' ? 'text-[var(--terracotta)] font-bold' : 'text-[var(--ink)] hover:text-[var(--copper)]'}`}>
              <span>All Categories</span>
              {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center justify-between w-full text-left transition-colors group ${selectedCategory === cat.id ? 'text-[var(--terracotta)] font-bold' : 'text-[var(--ink)] hover:text-[var(--copper)]'}`}>
                <span>{cat.name}</span>
                {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--line)]">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-4">
            <span className="font-bold text-[var(--sage)]">Max Price</span>
            <span className="font-bold text-[var(--ink)] tabular-nums">₦{priceRange.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="50000" 
            max="3500000" 
            step="50000" 
            value={priceRange} 
            onChange={e => setPriceRange(Number(e.target.value))} 
            className="w-full accent-[var(--ink)]" 
          />
        </div>

        <div className="pt-6 border-t border-[var(--line)]">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sage)] mb-4">Brand</h4>
          <div className="space-y-3 text-sm font-medium max-h-56 overflow-y-auto pr-2 custom-scrollbar">
            <button onClick={() => setSelectedBrand('all')} className={`flex items-center justify-between w-full text-left transition-colors group ${selectedBrand === 'all' ? 'text-[var(--terracotta)] font-bold' : 'text-[var(--ink)] hover:text-[var(--copper)]'}`}>
              <span>All Brands</span>
              {selectedBrand === 'all' && <Check className="w-3.5 h-3.5" />}
            </button>
            {brands.map(brand => (
              <button key={brand} onClick={() => setSelectedBrand(brand)} className={`flex items-center justify-between w-full text-left transition-colors group ${selectedBrand === brand ? 'text-[var(--terracotta)] font-bold' : 'text-[var(--ink)] hover:text-[var(--copper)]'}`}>
                <span>{brand}</span>
                {selectedBrand === brand && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-[var(--line)] bg-white">
        <button 
          onClick={() => setMobileFilterOpen(false)}
          className="w-full py-4 bg-[var(--ink)] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[var(--terracotta)] transition-colors flex items-center justify-center gap-2"
        >
          Show {filteredProducts.length} Results
        </button>
      </div>
    </div>
  );

  return (
    // REDUCED TOP PADDING FROM pt-32 TO pt-6
    <div className="bg-[var(--paper)] min-h-screen pt-6 sm:pt-10 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Page Title - Tightened margins */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-[var(--line)] pb-6 sm:pb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-2">Catalog</span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-[var(--ink)]">Solar Hardware</h1>
            <p className="text-xs sm:text-sm text-[var(--sage)] mt-2">Showing {filteredProducts.length} verified products</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-[var(--sage)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search inverters, panels..."
              className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-[var(--line)] rounded-full focus:ring-1 focus:ring-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Mobile Filter Toggle & Sort Row */}
          <div className="lg:hidden flex items-center justify-between pb-4">
            <button onClick={() => setMobileFilterOpen(true)} className="px-4 py-2.5 bg-white border border-[var(--line)] rounded-full text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
            <CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} />
          </div>

          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 h-[calc(100vh-8rem)]">
              <FilterContent />
            </div>
          </div>

          {/* Mobile Slide-out Drawer Filter */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <div className="lg:hidden fixed inset-0 z-[70] flex">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setMobileFilterOpen(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative w-[85%] max-w-sm h-full bg-white p-6 flex flex-col shadow-2xl"
                >
                  <FilterContent />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Product Listing Area */}
          <div className="lg:col-span-3">
            
            {/* Desktop Sort Header */}
            <div className="hidden lg:flex items-center justify-between border-b border-[var(--line)] pb-4 mb-8">
              <span className="text-sm text-[var(--sage)]">Showing <strong className="text-[var(--ink)]">{filteredProducts.length}</strong> results</span>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sage)]">Sort By:</span>
                <CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-32">
                <h3 className="text-2xl font-black text-[var(--ink)] uppercase">No products found</h3>
                <button onClick={resetFilters} className="mt-4 text-xs font-bold text-[var(--terracotta)] uppercase tracking-wider hover:underline">Clear Filters</button>
              </div>
            ) : (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              >
                {filteredProducts.map(product => (
                  <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <ProductCard product={product} onSelect={onSelectProduct} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};