import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { products } = useSolar();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-32">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-[var(--ink)]/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative bg-white rounded-lg border border-[var(--line)] max-w-2xl w-full shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[var(--line)]">
              <Search className="w-5 h-5 text-[var(--copper)] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 text-sm text-[var(--ink)] placeholder-[var(--sage)] focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[var(--sage)] hover:text-[var(--ink)]">
                  <X className="w-5 h-5" />
                </button>
              )}
              <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-[var(--sage)] hover:text-[var(--ink)] bg-[var(--paper)] rounded">
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              {query.trim() === '' ? (
                <div className="text-center py-10 text-xs font-semibold text-[var(--sage)]">
                  Type to search for inverters, panels, and batteries.
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-10 text-xs font-semibold text-[var(--sage)]">
                  No products match "{query}".
                </div>
              ) : (
                results.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => { onSelectProduct(prod); onClose(); }}
                    className="flex items-center gap-4 p-3 rounded-md hover:bg-[var(--paper)] cursor-pointer transition-colors border border-transparent hover:border-[var(--line)]"
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-contain bg-[var(--paper)] rounded" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-[var(--copper)] uppercase tracking-wider">{prod.brand}</span>
                      <h4 className="text-xs font-bold text-[var(--ink)] truncate">{prod.name}</h4>
                      <p className="text-xs font-bold text-[var(--ink)] tabular-nums mt-0.5">₦{prod.price.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--line)]" />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};