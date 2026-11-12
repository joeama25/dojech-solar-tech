import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, ChevronDown, Check, Building2 } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { motion, AnimatePresence } from 'motion/react';

// Custom Dropdown Component
const CustomSelect = ({ 
  options, 
  value, 
  onChange 
}: { 
  options: string[], 
  value: string, 
  onChange: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-4 py-3 text-sm text-[var(--ink)] flex items-center justify-between focus:outline-none focus:border-[var(--forest)] transition-colors"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-[var(--line)] rounded-md shadow-2xl overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                  value === opt 
                    ? 'bg-[var(--forest)]/5 text-[var(--forest)] font-bold' 
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                {opt}
                {value === opt && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings } = useSolar() as any;
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    energyNeed: 'Residential Home', 
    companyName: '',
    message: '' 
  });
  const [sent, setSent] = useState(false);

  // --- DYNAMIC PLACEHOLDER LOGIC ---
  const getCompanyPlaceholder = () => {
    switch (formData.energyNeed) {
      case 'Commercial Office':
        return 'e.g. Acme Corporate HQ';
      case 'Hospital / Clinic':
        return 'e.g. St. Mary\'s Medical Center';
      case 'Mini-Grid':
        return 'e.g. Greenfield Community';
      default:
        return 'e.g. Your Business Name';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the WhatsApp message, including company if applicable
    const companyText = formData.energyNeed !== 'Residential Home' && formData.companyName 
      ? `\nCompany: ${formData.companyName}` 
      : '';
      
    const msg = encodeURIComponent(
      `Hello Dojech Solar Tech!\n\nI have a solar consultation inquiry:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nTarget System: ${formData.energyNeed}${companyText}\nMessage: ${formData.message}`
    );
    
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
    setSent(true);
  };

  const systemOptions = [
    'Residential Home',
    'Commercial Office',
    'Hospital / Clinic',
    'Mini-Grid'
  ];

  return (
    <div className="bg-[var(--paper)] min-h-screen pt-6 pb-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)]">
          
          {/* Left Side: Contact Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--forest)] p-6 sm:p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--sun)] block mb-3 sm:mb-4">Get in touch</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 sm:mb-8">
                Let's <br/> Build.
              </h1>
              <p className="text-xs sm:text-base text-white/70 leading-relaxed max-w-md mb-8 sm:mb-12">
                Need sizing advice for an inverter, lithium battery pack, or turnkey solar installation? Chat directly with our engineers.
              </p>

              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--sun)] shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-0.5 sm:mb-1">Showroom</span>
                    <span className="text-xs sm:text-sm font-medium">{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--sun)] shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-0.5 sm:mb-1">Phone Lines</span>
                    <span className="text-xs sm:text-sm font-medium">{settings.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--sun)] shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-0.5 sm:mb-1">Email</span>
                    <span className="text-xs sm:text-sm font-medium">{settings.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 sm:p-12 lg:p-16 bg-white flex flex-col justify-center">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--forest)]/10 text-[var(--forest)] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--ink)] uppercase tracking-tighter mb-2 sm:mb-4">Inquiry Sent!</h3>
                <p className="text-xs sm:text-sm text-[var(--sage)]">Your message was directed to our WhatsApp line. An engineer will assist you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink)] uppercase tracking-tight mb-4 sm:mb-8">Request a Quote</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--sage)] block mb-1.5 sm:mb-2">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--forest)] transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--sage)] block mb-1.5 sm:mb-2">Phone Number *</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--forest)] transition-colors" placeholder="0803 123 4567" />
                  </div>
                </div>
                
                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--sage)] block mb-1.5 sm:mb-2">Target System</label>
                  <CustomSelect 
                    options={systemOptions} 
                    value={formData.energyNeed} 
                    onChange={(val) => setFormData({ ...formData, energyNeed: val })} 
                  />
                </div>

                {/* --- CONDITIONAL BUSINESS FIELD --- */}
                <AnimatePresence>
                  {formData.energyNeed !== 'Residential Home' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--sage)] block mb-1.5 sm:mb-2 mt-1">Company / Business Name *</label>
                      <div className="relative">
                        <Building2 className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          required={formData.energyNeed !== 'Residential Home'}
                          value={formData.companyName} 
                          onChange={e => setFormData({ ...formData, companyName: e.target.value })} 
                          className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-[var(--paper)] border border-[var(--line)] rounded-md text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--forest)] transition-colors" 
                          placeholder={getCompanyPlaceholder()} // <-- DYNAMIC PLACEHOLDER APPLIED HERE
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--sage)] block mb-1.5 sm:mb-2">Requirements</label>
                  <textarea rows={3} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-md px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--forest)] transition-colors resize-none" placeholder="List heavy appliances..." />
                </div>
                
                <button type="submit" className="w-full py-3.5 sm:py-4 bg-[var(--sun)] text-[var(--ink)] text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[var(--terracotta)] hover:text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2">
                  Send via WhatsApp <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};