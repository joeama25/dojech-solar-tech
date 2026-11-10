import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSolar } from '../context/SolarContext';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSolar();

  return (
    <footer className="bg-black text-white pt-16 pb-8 sm:pt-24 sm:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Massive Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 sm:pb-12 mb-10 sm:mb-12 gap-6 sm:gap-8">
          <div>
            <h2 className="text-[20vw] sm:text-[10vw] lg:text-[140px] font-black uppercase tracking-tighter leading-[0.8] text-white">
              DOJECH<span className="text-[var(--sun)]">.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-2">
             <p className="text-xs sm:text-sm text-white/50 max-w-xs leading-relaxed">
              Premium solar marketplace for genuine Tier-1 panels and long-life storage.
             </p>
             <button onClick={() => onNavigate('contact')} className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--sun)] hover:text-white transition-colors flex items-center gap-2 mt-2 sm:mt-4">
                Get in touch <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 mb-12 sm:mb-20">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4 sm:mb-6">Explore</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm font-medium">
              {['shop', 'categories', 'about', 'contact'].map(link => (
                <li key={link}>
                  <button onClick={() => onNavigate(link)} className="hover:text-[var(--sun)] transition-colors capitalize">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4 sm:mb-6">Company</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[var(--sun)] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[var(--sun)] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('warranty')} className="hover:text-[var(--sun)] transition-colors">
                  Product Warranty
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4 sm:mb-6">Contact</h4>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/70">
              <p className="max-w-sm">{settings.address}</p>
              <p>{settings.phone}</p>
              <p className="text-[var(--sun)]">{settings.email}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[9px] sm:text-[10px] uppercase tracking-widest text-white/30 pt-6 border-t border-white/10">
          <p>© {new Date().getFullYear()} Dojech Solar Tech.</p>
          <p>Engineered for the future.</p>
        </div>
      </div>
    </footer>
  );
};