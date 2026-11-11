import React from 'react';
import { ShieldCheck, Award, Zap, ArrowRight } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  const { onNavigate } = useSolar() as any; 

  return (
    <div className="bg-[var(--paper)] min-h-screen overflow-hidden">
      
      {/* Massive Header */}
      <section className="pt-6 pb-10 sm:pt-20 sm:pb-24 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: "easeOut" }} // Slowed down to 1.2s
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-3 sm:mb-6">Our Mission</span>
          <h1 className="text-[2.5rem] leading-[1] sm:text-8xl lg:text-[120px] font-black uppercase tracking-tighter text-[var(--ink)] sm:leading-[0.85] max-w-5xl">
            Reliable,<br/> Modern &<br/> <span className="text-[var(--forest)]">Clean Energy.</span>
          </h1>
        </motion.div>
      </section>

      {/* Creative Image Section */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-6 sm:pb-32">
        <div className="relative w-full h-[40vh] sm:h-[60vh] rounded-3xl overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }} 
            whileInView={{ scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 2, ease: "easeOut" }} // Slower image zoom
            src="/images/hero_solar_farm_1793813489573.jpg" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 to-transparent" />
        </div>
        
        {/* Overlay Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }} // Added explicit 1s duration and longer delay
          className="relative -mt-20 ml-auto mr-0 w-[75%] max-w-[300px] sm:absolute sm:-bottom-12 sm:right-12 lg:right-24 sm:mx-0 sm:w-full sm:max-w-lg bg-[var(--sun)] p-5 sm:p-10 rounded-2xl shadow-xl"
        >
          <h2 className="text-base sm:text-3xl font-bold text-[var(--ink)] leading-tight mb-2 sm:mb-4">
            We are dedicated to ending erratic power outages across Nigeria.
          </h2>
          <p className="text-[11px] sm:text-sm text-[var(--ink)]/80 leading-relaxed mb-4 sm:mb-6">
            Dojech Solar Tech serves homes, clinics, schools, and commercial enterprises, providing them with the tools to achieve complete energy independence.
          </p>
          <button onClick={() => onNavigate?.('shop')} className="flex items-center gap-2 sm:gap-3 bg-[var(--ink)] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[var(--terracotta)] transition-colors">
            Explore Hardware <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </motion.div>
      </section>

      {/* Values Grid */}
      <section className="py-12 sm:py-24 bg-[var(--forest)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <h2 className="text-2xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-8 sm:mb-16">
            The Dojech Standard.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Award, title: 'Tier-1 Hardware', desc: 'Genuine Canadian Solar, Jinko Solar, Deye, and Felicity equipment. Zero counterfeits.' },
              { icon: Zap, title: 'Certified Engineers', desc: 'Licensed photovoltaic engineers ensuring correct grounding, surge suppression, and tilt.' },
              { icon: ShieldCheck, title: 'Direct Support', desc: 'From sizing to nationwide dispatch, our engineers are one WhatsApp click away.' }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }} // Slower grid entrance
                className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--copper)]/20 text-[var(--copper)] flex items-center justify-center mb-4 sm:mb-6">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};