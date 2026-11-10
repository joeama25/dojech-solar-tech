import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { HeroSlide } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroCarouselProps {
  slides: HeroSlide[];
  onNavigate: (view: string, params?: any) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, onNavigate }) => {
  const activeSlides = slides.filter(s => s.isActive);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  if (activeSlides.length === 0) return null;
  const slide = activeSlides[current];

  return (
    <div className="relative w-full h-[100dvh] sm:h-screen min-h-[550px] sm:min-h-[600px] bg-black overflow-hidden">
      
      {/* Background Images with Zoom Animation */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={current}
            src={slide.image}
            alt={slide.heading}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        
        {/* UPDATED OVERLAY: Stronger gradient on the left to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent sm:from-black/80 sm:via-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Cinematic Content Panel */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            // Constrain the max-width so it doesn't stretch too far on huge monitors
            className="max-w-3xl lg:max-w-4xl pt-16 sm:pt-20 pb-20 sm:pb-0"
          >
            {/* Elegant Subtitle */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mb-4 sm:mb-6"
            >
              <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] text-white/90 uppercase">
                {slide.accentBadge || 'Premium Solar Solutions'}
              </span>
            </motion.div>

            {/* Heading: Toned down from 110px to 90px on desktop for better wrapping */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-[2.75rem] leading-[1.05] sm:text-6xl sm:leading-[1.1] md:text-7xl lg:text-[85px] lg:leading-[1.05] font-light text-white tracking-tighter mb-6 sm:mb-8"
            >
              {slide.heading.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 0 ? 'font-medium' : 'italic font-light'}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>

            {/* Subtext Layout - Grouped closer together for a unified block */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 max-w-2xl"
            >
              <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-md">
                {slide.description}
              </p>

              {/* Sleek Pill Button */}
              <button
                onClick={() => onNavigate(slide.ctaLink || 'shop')}
                className="group flex items-center gap-3 sm:gap-4 bg-white text-black pl-5 sm:pl-6 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all hover:bg-gray-100 hover:scale-105 w-fit shrink-0"
              >
                <span>{slide.ctaText || 'Explore Systems'}</span>
                <div className="bg-black text-white rounded-full p-2 sm:p-2.5 group-hover:scale-110 transition-transform">
                   <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Bottom Bar */}
        <div className="absolute bottom-6 sm:bottom-10 left-5 sm:left-8 lg:left-12 right-5 sm:right-8 lg:right-12 flex flex-col-reverse sm:flex-row sm:items-center justify-between text-white/60 text-[10px] sm:text-xs font-mono uppercase tracking-widest gap-6 sm:gap-4">
            
            {/* Left Side Info */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
              <span>Available for work</span>
            </div>
            
            {/* Right Side Arrows & Counter */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">AD 2024</span>
                <span className="text-white font-bold">0{current + 1} <span className="text-white/50">/</span> 0{activeSlides.length}</span>
              </div>
              
              {/* The Manual Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};