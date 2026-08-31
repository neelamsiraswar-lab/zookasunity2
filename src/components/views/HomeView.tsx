import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomeCarousel } from '../HomeCarousel';
import { ChronologyHeritageSection } from '../ChronologyHeritageSection';
import { GuidingPrinciplesSection } from '../GuidingPrinciplesSection';
import { 
  Flame, 
  Sparkles, 
  Wine, 
  Award, 
  ShieldCheck, 
  PackageCheck, 
  ArrowRight, 
  Star, 
  Clock, 
  ChevronRight,
  TrendingUp,
  GlassWater,
  Building2,
  Quote
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { 
    homeContent, 
    products, 
    setActiveTab, 
    setSelectedCategory, 
    setActiveProductModal, 
    addToCart 
  } = useStore();

  // Limited release countdown timer simulation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 18,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const featuredSpirits = products.filter(p => p.featured).slice(0, 4);
  const spotlightSpirit = products[0] || featuredSpirits[0];

  return (
    <div className="space-y-20 pb-16 w-full max-w-full overflow-x-hidden">
      {/* Interactive Hero Carousel */}
      <HomeCarousel />

      {/* Limited Cask Spotlight with Live Allocation Countdown */}
      {spotlightSpirit && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-600/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Spirit Image Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-950/80 bg-stone-950">
                    <img
                      src={spotlightSpirit.images[0]}
                      alt={spotlightSpirit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500 text-stone-950 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                    Master Distiller's Private Cask
                  </div>
                </div>
              </div>

              {/* Spirit Description & Countdown */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                    <Flame className="w-4 h-4" />
                    <span>Current Active Allocation Release</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
                    {spotlightSpirit.name}
                  </h2>
                  <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                    {spotlightSpirit.description}
                  </p>
                </div>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Proof / ABV</span>
                    <strong className="text-sm text-amber-400 font-serif">{spotlightSpirit.abv} ({spotlightSpirit.proof}°)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Cask Lot</span>
                    <strong className="text-xs text-stone-200 block truncate">{spotlightSpirit.caskNumber}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Remaining</span>
                    <strong className="text-xs text-emerald-400 block">{spotlightSpirit.stockQuantity} Bottles Left</strong>
                  </div>
                </div>

                {/* Allocation Timer */}
                <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-200 block">
                        Cask Allocation Window Closes In:
                      </span>
                      <span className="text-[11px] text-stone-400">Insured member reservation window</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm font-bold text-amber-400">
                    <span className="px-2.5 py-1 bg-stone-900 rounded-lg border border-stone-700">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span>:</span>
                    <span className="px-2.5 py-1 bg-stone-900 rounded-lg border border-stone-700">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span>:</span>
                    <span className="px-2.5 py-1 bg-stone-900 rounded-lg border border-stone-700">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                {/* Pricing & Add */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl font-bold text-amber-400">
                        ${spotlightSpirit.salePrice ?? spotlightSpirit.price}
                      </span>
                      {spotlightSpirit.salePrice && (
                        <span className="text-sm text-stone-500 line-through">
                          ${spotlightSpirit.price}
                        </span>
                      )}
                      <span className="text-xs text-stone-400">/ {spotlightSpirit.bottleSize}</span>
                    </div>
                    <span className="text-[11px] text-amber-400/90 font-medium">Includes Custom Wax-Seal Gift Box</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setActiveProductModal(spotlightSpirit)}
                      className="flex-1 sm:flex-initial px-5 py-3 text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-xl transition"
                    >
                      View Tasting Notes
                    </button>
                    <button
                      onClick={() => addToCart(spotlightSpirit, 1)}
                      className="flex-1 sm:flex-initial px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                    >
                      Reserve Bottle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Spirits Catalog Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Curated Vault Releases
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Featured Artisanal Spirits
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition cursor-pointer self-start sm:self-auto"
          >
            <span>View All Spirits ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards: Horizontal Swipe Track on Mobile & Tab, 4-col Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 pt-1 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {featuredSpirits.map((spirit) => {
            const unitPrice = spirit.salePrice ?? spirit.price;
            return (
              <div
                key={spirit.id}
                className="w-[260px] sm:w-[300px] shrink-0 snap-start lg:w-auto group flex flex-col rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/30"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[3/4] bg-stone-950 overflow-hidden cursor-pointer" onClick={() => setActiveProductModal(spirit)}>
                  <img
                    src={spirit.images[0]}
                    alt={spirit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {spirit.isLimitedRelease && (
                      <span className="px-2.5 py-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider rounded-md shadow">
                        Limited Release
                      </span>
                    )}
                    {spirit.salePrice && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md">
                        Special Price
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-stone-950/80 backdrop-blur-sm text-stone-300 text-[10px] font-mono rounded border border-stone-700">
                    {spirit.abv} • {spirit.proof}°
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 block">
                      {spirit.category}
                    </span>
                    <h3
                      onClick={() => setActiveProductModal(spirit)}
                      className="font-serif text-base font-bold text-stone-100 hover:text-amber-400 transition cursor-pointer line-clamp-2 mt-1"
                    >
                      {spirit.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 italic">
                      "{spirit.tagline}"
                    </p>

                    {/* Tasting Aroma Pills */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {spirit.tastingNotes.aroma.slice(0, 2).map((note, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700/60">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg font-bold text-amber-400">
                          ${unitPrice}
                        </span>
                        {spirit.salePrice && (
                          <span className="text-xs text-stone-500 line-through">
                            ${spirit.price}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {spirit.stockQuantity} in stock
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(spirit, 1)}
                      className="px-3.5 py-2 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-bold rounded-lg transition border border-stone-700 hover:border-transparent active:scale-95 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chronology & Distillation Heritage */}
      <ChronologyHeritageSection />

      {/* Guiding Principles: Mission, Vision & Core Values */}
      <GuidingPrinciplesSection />

      {/* Brand Value Pillars (Responsive Horizontal on Mobile & Tablet, 4-col Grid on Desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 pt-1 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {homeContent.features.map((feat, idx) => (
            <div
              key={idx}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start lg:w-auto p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-700/40 transition space-y-3 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-600/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                {feat.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Master Distiller Philosophy Quote */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-stone-900 border border-stone-800 p-8 sm:p-14 text-center space-y-6 overflow-hidden">
          <Quote className="w-12 h-12 text-amber-500/20 mx-auto" />
          <p className="font-serif text-xl sm:text-2xl text-stone-200 leading-relaxed italic max-w-3xl mx-auto">
            {homeContent.distillerQuote}
          </p>
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              {homeContent.distillerQuoteAuthor}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
