import React from 'react';
import { motion } from 'motion/react';

export const TrustSection: React.FC = () => {
  const benefits = [
    { 
      num: '01',
      title: 'Quality Solar Products', 
      desc: 'Tier-1 monocrystalline panels, smart inverters & grade-A LiFePO4 cells.',
    },
    { 
      num: '02',
      title: 'Reliable Energy', 
      desc: 'Zero blackout setups engineered for Nigerian grid realities and harsh climate.',
    },
    { 
      num: '03',
      title: 'Expert Support', 
      desc: 'Certified renewable energy engineers ready for sizing advice and technical audits.',
    },
    { 
      num: '04',
      title: 'WhatsApp Checkout', 
      desc: 'Direct instant order dispatch, live stock check, and personalized invoice.',
    },
  ];

  return (
    <section className="bg-[#0B0C10] py-20 sm:py-32 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Massive Editorial Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 sm:mb-24 gap-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter max-w-2xl leading-[0.9]"
          >
            The <span className="text-[var(--sun)]">Dojech</span> <br/> Standard.
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-sm sm:text-base text-white/50 leading-relaxed max-w-sm"
          >
            We don't just sell equipment. We engineer reliable, long-term energy independence backed by rigorous standards.
          </motion.p>
        </div>

        {/* Brutalist List Layout */}
        <div className="border-t border-white/10">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative border-b border-white/10 py-8 sm:py-12 flex flex-col sm:flex-row sm:items-center justify-between cursor-default hover:bg-white/[0.02] transition-colors px-4 sm:px-0"
            >
              <div className="flex items-center gap-6 sm:gap-12 w-full">
                <span className="text-sm font-mono text-[var(--sun)] tracking-widest hidden sm:block">
                  ({item.num})
                </span>
                
                <h3 className="text-2xl sm:text-4xl font-bold tracking-tight group-hover:text-[var(--sun)] transition-colors duration-300 w-full sm:w-1/2">
                  {item.title}
                </h3>
                
                {/* 
                  The Arrow div has been completely removed from here.
                  The description now naturally fills the remaining space.
                */}
                <p className="text-xs sm:text-sm text-white/40 group-hover:text-white/70 transition-colors duration-300 leading-relaxed max-w-md hidden md:block">
                  {item.desc}
                </p>
              </div>

              {/* Mobile Text */}
              <p className="text-xs text-white/40 mt-3 pl-0 sm:hidden block">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};