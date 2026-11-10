import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  TrendingDown,
  ChevronDown,
  Star
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { HeroCarousel } from './HeroCarousel';
import { TrustSection } from './TrustSection';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { FAQS } from '../data/initialData';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart: () => void;
}

// --- 3D TILT CATEGORY CARD COMPONENT ---
const CategoryCard = ({ cat, index, onNavigate }: { cat: any, index: number, onNavigate: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      style={{ perspective: 1000 }}
      className="group cursor-pointer flex flex-col"
      onClick={() => onNavigate('shop', { categoryId: cat.id })}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full relative"
      >
        <div className="w-full aspect-[4/3] bg-transparent flex items-center justify-center overflow-hidden mb-4 sm:mb-5 relative rounded-2xl">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{ transform: "translateZ(50px)" }}
          />
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: "translateZ(30px)" }}>
             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[var(--ink)] flex items-center justify-center bg-[var(--ink)] text-white shadow-xl">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 -rotate-45" />
             </div>
          </div>
        </div>
        <div className="border-t border-[var(--line)] pt-3 sm:pt-4" style={{ transform: "translateZ(20px)" }}>
          <h3 className="font-bold text-lg sm:text-xl text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors tracking-tight">
            {cat.name}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--sage)] mt-1.5 line-clamp-2 leading-relaxed">
            {cat.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onOpenCart
}) => {
  const { products, categories, heroSlides, testimonials } = useSolar();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Only take the first 4 bestsellers
  const bestsellingProducts = products.filter(p => p.isBestseller).slice(0, 4);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const handleScroll = () => {
    window.requestAnimationFrame(() => {
      if (!carouselRef.current) return;
      const { scrollLeft, children } = carouselRef.current;
      if (children.length === 0) return;

      let activeIdx = 0;
      let minDist = Infinity;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const dist = Math.abs(child.offsetLeft - scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          activeIdx = i;
        }
      }
      setActiveIndex(activeIdx);
    });
  };

  return (
    <div className="bg-[var(--paper)] overflow-x-hidden w-full">
      <HeroCarousel slides={heroSlides} onNavigate={onNavigate} />

      {/* 2. Product Categories Section (3D Tilt) */}
      <section className="py-12 sm:py-24 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16"
        >
          <div className="max-w-3xl">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-3 sm:mb-4">
              Explore The Range
            </span>
            <h2 className="text-[2.25rem] leading-[1] sm:text-6xl md:text-7xl lg:text-[85px] font-black uppercase tracking-tighter text-[var(--ink)] sm:leading-[0.9]">
              Engineered <br className="hidden sm:block"/> Solutions.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="group flex items-center gap-3 text-xs font-bold text-[var(--ink)] uppercase tracking-widest pb-2 border-b border-[var(--ink)] hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors self-start md:self-auto"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {categories.slice(0, 4).map((cat, index) => (
            <CategoryCard key={cat.id} cat={cat} index={index} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* 3. Featured / Bestselling Products Section (STAGGERED FLOATING GRID) */}
      <section className="py-16 sm:py-32 bg-[var(--forest)] text-white overflow-hidden relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-20"
          >
            <div className="max-w-3xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--sun)] block mb-3 sm:mb-4">
                Top Rated Hardware
              </span>
              <h2 className="text-[2.25rem] leading-[1] sm:text-6xl md:text-7xl lg:text-[85px] font-black uppercase tracking-tighter sm:leading-[0.9]">
                Bestsellers.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="px-5 py-2.5 sm:px-8 sm:py-4 border border-white/30 text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-[var(--forest)] transition-colors self-start md:self-auto"
            >
              View Full Catalog
            </button>
          </motion.div>

          {/* RESPONSIVE LAYOUT: Carousel on Mobile, Staggered Grid on Desktop */}
          <div className="relative">
            
            {/* The Track / Grid */}
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="
                flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
                lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:snap-none lg:pb-0 lg:pt-0
              "
            >
              {bestsellingProducts.map((prod, index) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                  // The stagger effect: even items (0, 2) go up, odd items (1, 3) go down
                  className={`
                    snap-start shrink-0 w-[80vw] sm:w-[45vw]
                    lg:w-auto lg:shrink
                    ${index % 2 === 0 ? 'lg:-translate-y-8' : 'lg:translate-y-8'}
                  `}
                >
                  {/* Hover Lift & Glow Effect */}
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
                    className="h-full relative group/card"
                  >
                    {/* Glow behind the card */}
                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-3xl" />
                    
                    <div className="relative z-10 h-full">
                      <ProductCard product={prod} onSelect={onSelectProduct} />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Scroll Indicator Lines */}
            <div className="flex justify-center gap-1.5 mt-2 lg:hidden">
              {bestsellingProducts.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-8 bg-white' : 'w-4 bg-white/20'
                  }`} 
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      <TrustSection />

      {/* 5. Educational: Why Choose Solar Section */}
      <section className="py-12 sm:py-24 bg-[var(--paper)] text-[var(--ink)] relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-3 sm:mb-4">
              Smarter Power Independence
            </span>
            <h2 className="text-[2.25rem] leading-[1] sm:text-6xl font-black uppercase tracking-tighter mb-6 sm:mb-8">
              Why Switch <br/> to Solar?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--sage)] leading-relaxed max-w-md">
              Stop pouring hard-earned money into generator maintenance and unpredictable tariffs.
              Invest once in clean, silent, reliable energy that works round the clock.
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {[
              { num: '01', icon: TrendingDown, title: 'Reduced Bills', desc: 'Slash your recurring monthly energy expenditure by up to 85% by generating your own free electricity.' },
              { num: '02', icon: Zap, title: 'Zero Noise', desc: 'Enjoy seamless zero-second automatic switchover during grid cuts. No loud generator fumes or diesel stress.' },
              { num: '03', icon: ShieldCheck, title: '25-Year Asset', desc: 'Solar panels appreciate your property value and deliver dependable electrical output guaranteed by warranties.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group border-b border-[var(--line)] pb-4 sm:pb-6 flex items-start gap-4 sm:gap-6"
              >
                <span className="text-[10px] sm:text-xs font-mono text-[var(--terracotta)] pt-1 shrink-0">({item.num})</span>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold uppercase tracking-tight group-hover:text-[var(--terracotta)] transition-colors">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--sage)] mt-1.5 sm:mt-2 leading-relaxed max-w-md">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="py-12 sm:py-24 bg-[#0B0C10] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mb-8 sm:mb-16"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--sun)] block mb-3 sm:mb-4">
              Verified Nigerian Clients
            </span>
            <h2 className="text-[2.25rem] leading-[1] sm:text-6xl md:text-7xl lg:text-[85px] font-black uppercase tracking-tighter sm:leading-[0.9]">
              Client <br className="hidden sm:block"/> Stories.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col justify-between border-t border-white/20 pt-4 sm:pt-6"
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex gap-1 text-[var(--sun)]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[var(--sun)]" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-lg lg:text-xl font-light leading-snug">"{t.review}"</p>
                </div>

                <div className="mt-6 sm:mt-8">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">{t.name}</h4>
                  <p className="text-[10px] sm:text-xs text-white/50 mt-0.5 sm:mt-1">{t.location}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--terracotta)] mt-1.5 sm:mt-2">{t.solarInstalled}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-12 sm:py-24 bg-[var(--paper)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mb-8 sm:mb-16"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--terracotta)] block mb-3 sm:mb-4">
              Got Questions?
            </span>
            <h2 className="text-[2.25rem] leading-[1] sm:text-6xl font-black uppercase tracking-tighter">
              FAQs.
            </h2>
          </motion.div>

          <div className="border-t border-[var(--ink)]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-[var(--line)]"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-5 sm:py-6 text-left flex items-start justify-between gap-4 sm:gap-6 group"
                  >
                    <span className="text-sm sm:text-xl lg:text-2xl font-bold uppercase tracking-tight text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 sm:mt-1 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[var(--terracotta)]' : 'text-[var(--sage)]'
                      }`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5 sm:pb-6' : 'max-h-0'}`}>
                    <p className="text-xs sm:text-sm lg:text-base text-[var(--sage)] leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};