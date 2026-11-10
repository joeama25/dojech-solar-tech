import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PolicyPageProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ title, subtitle, onBack, children }) => {
  return (
    <div className="min-h-screen bg-[var(--paper)] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[var(--ink)] uppercase tracking-widest hover:text-[var(--terracotta)] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-3">
            {subtitle}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-[var(--ink)] mb-12">
            {title}
          </h1>
          
          <div className="prose prose-slate max-w-none text-[var(--sage)]">
            {children}
          </div>
        </motion.div>

      </div>
    </div>
  );
};