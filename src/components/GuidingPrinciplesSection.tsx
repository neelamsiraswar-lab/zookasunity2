import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { CoreValueItem } from '../types';
import { 
  Flame, 
  Clock, 
  Leaf, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  Wine, 
  Droplet, 
  Compass, 
  Eye, 
  Layers, 
  Globe, 
  Building2, 
  Target, 
  Quote, 
  CheckCircle2, 
  Maximize2, 
  X, 
  ArrowRight,
  Sparkle,
  ChevronLeft,
  ChevronRight,
  Hand
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Icon resolver helper for dynamic CMS icons
export const renderPrincipleIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName?.toLowerCase()) {
    case 'flame':
    case 'fire':
      return <Flame className={className} />;
    case 'clock':
    case 'time':
    case 'history':
      return <Clock className={className} />;
    case 'leaf':
    case 'eco':
    case 'nature':
      return <Leaf className={className} />;
    case 'award':
    case 'trophy':
    case 'medal':
      return <Award className={className} />;
    case 'shieldcheck':
    case 'shield':
    case 'security':
      return <ShieldCheck className={className} />;
    case 'hearthandshake':
    case 'heart':
    case 'handshake':
    case 'fellowship':
      return <HeartHandshake className={className} />;
    case 'sparkles':
    case 'sparkle':
    case 'magic':
      return <Sparkles className={className} />;
    case 'wine':
    case 'glass':
    case 'cask':
      return <Wine className={className} />;
    case 'droplet':
    case 'water':
      return <Droplet className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'eye':
      return <Eye className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'building2':
    case 'distillery':
      return <Building2 className={className} />;
    case 'target':
      return <Target className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export const GuidingPrinciplesSection: React.FC = () => {
  const { homeContent, setActiveTab } = useStore();
  const config = homeContent.guidingPrinciples;

  const [activeValueModal, setActiveValueModal] = useState<CoreValueItem | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'mission' | 'vision' | 'values'>('all');

  // Horizontal scroll container references for mobile / tablet navigation
  const heroCardsScrollRef = useRef<HTMLDivElement>(null);
  const valuesScrollRef = useRef<HTMLDivElement>(null);

  if (!config || config.showSection === false) {
    return null;
  }

  const values = config.values || [];

  const scrollHero = (direction: 'left' | 'right') => {
    if (heroCardsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      heroCardsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollValues = (direction: 'left' | 'right') => {
    if (valuesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      valuesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="guiding-principles-section"
      aria-label="Distillery Guiding Principles, Mission, Vision and Core Values"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 sm:space-y-12 overflow-hidden w-full max-w-full"
    >
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-6 relative z-10">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/70 border border-amber-500/30 shadow-md">
              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.sectionBadge || 'Guiding Principles'}</span>
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-stone-100 tracking-tight leading-tight">
            {config.sectionTitle || 'Guiding Principles: Mission, Vision & Core Values'}
          </h2>

          <p className="text-xs sm:text-base text-stone-300 font-light leading-relaxed">
            {config.sectionSubtitle || 'The unyielding standards and spiritual ethos that govern every drop distilled, barrel charred, and bottle hand-sealed at Zookas Unity Spirits.'}
          </p>
        </div>

        {/* Filter Navigation Tabs (Horizontal scrollable on mobile) */}
        <div className="flex items-center gap-1.5 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 self-start md:self-auto shrink-0 shadow-xl overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTabFilter === 'all'
                ? 'bg-amber-500 text-stone-950 shadow font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            All Pillars
          </button>
          <button
            onClick={() => setActiveTabFilter('mission')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTabFilter === 'mission'
                ? 'bg-amber-500 text-stone-950 shadow font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            Mission
          </button>
          <button
            onClick={() => setActiveTabFilter('vision')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTabFilter === 'vision'
                ? 'bg-amber-500 text-stone-950 shadow font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            Vision
          </button>
          <button
            onClick={() => setActiveTabFilter('values')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTabFilter === 'values'
                ? 'bg-amber-500 text-stone-950 shadow font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            Core Values ({values.length})
          </button>
        </div>
      </div>

      {/* DUAL MISSION & VISION HERO CARDS (Horizontal swipe on mobile & tab, Grid on desktop) */}
      {(activeTabFilter === 'all' || activeTabFilter === 'mission' || activeTabFilter === 'vision') && (
        <div className="space-y-3">
          {/* Mobile/Tablet Swipe Hint & Arrows */}
          {activeTabFilter === 'all' && (
            <div className="flex lg:hidden items-center justify-between text-xs text-stone-400 px-1">
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                <Hand className="w-3.5 h-3.5 animate-pulse" />
                <span>Swipe horizontally or use arrows</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollHero('left')}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 active:scale-95 transition"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollHero('right')}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 active:scale-95 transition"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Container: Horizontal snap track on mobile/tablet, 2-column grid on desktop */}
          <div
            ref={heroCardsScrollRef}
            className={`
              ${activeTabFilter === 'all' 
                ? 'flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-3 pt-1 lg:grid lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:pb-0' 
                : 'grid grid-cols-1 gap-8'}
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            `}
          >
            {/* 1. MISSION CARD */}
            {(activeTabFilter === 'all' || activeTabFilter === 'mission') && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`
                  relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/20 border border-stone-800 hover:border-amber-500/40 p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-2xl flex flex-col justify-between overflow-hidden group transition-all
                  ${activeTabFilter === 'all' ? 'w-[86vw] sm:w-[500px] md:w-[600px] shrink-0 snap-center lg:w-auto' : 'w-full'}
                `}
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div className="space-y-4 sm:space-y-5 relative z-10">
                  {/* Badge & Top Meta */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      <span>{config.missionBadge || 'Our Sacred Calling'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-stone-400 tracking-wider">
                      EST. 1884 CREED
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    {config.missionTitle || 'The Mission'}
                  </h3>

                  {/* Narrative Statement */}
                  <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                    {config.missionStatement || 'To unite the world’s most revered distillation traditions through uncompromising artisanal craftsmanship, honoring natural mountain terroirs, ancestral copper alchemy, and patient wood maturation to create extraordinary spirits that elevate human connection and celebration.'}
                  </p>

                  {/* Quote Callout */}
                  {config.missionHighlightQuote && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/80 border border-amber-600/20 flex items-start gap-3 shadow-inner">
                      <Quote className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic leading-relaxed">
                        {config.missionHighlightQuote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Image Showcase & Action */}
                <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-stone-950 border border-amber-500/30 shrink-0">
                      <img
                        src={config.missionImage || 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=600&q=80'}
                        alt="The Mission"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">Pure Distillation Alchemy</span>
                      <span className="text-[10px] sm:text-[11px] text-stone-400">Copper Swan Stills & Spring Water</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition shrink-0 cursor-pointer"
                  >
                    <span>Read Full Heritage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. VISION CARD */}
            {(activeTabFilter === 'all' || activeTabFilter === 'vision') && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`
                  relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/20 border border-stone-800 hover:border-amber-500/40 p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-2xl flex flex-col justify-between overflow-hidden group transition-all
                  ${activeTabFilter === 'all' ? 'w-[86vw] sm:w-[500px] md:w-[600px] shrink-0 snap-center lg:w-auto' : 'w-full'}
                `}
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-600/10 transition-colors" />

                <div className="space-y-4 sm:space-y-5 relative z-10">
                  {/* Badge & Top Meta */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>{config.visionBadge || 'Our Century Horizon'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-stone-400 tracking-wider">
                      2026 – 2126 VISION
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    {config.visionTitle || 'The Vision'}
                  </h3>

                  {/* Narrative Statement */}
                  <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                    {config.visionStatement || 'To lead the global renaissance of independent craft distillation by championing zero-compromise quality, regenerative agricultural alliances, heirloom grain revival, and perpetual solera aging for generations of discerning connoisseurs across the globe.'}
                  </p>

                  {/* Quote Callout */}
                  {config.visionHighlightQuote && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/80 border border-amber-600/20 flex items-start gap-3 shadow-inner">
                      <Quote className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic leading-relaxed">
                        {config.visionHighlightQuote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Image Showcase & Action */}
                <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-stone-950 border border-amber-500/30 shrink-0">
                      <img
                        src={config.visionImage || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=600&q=80'}
                        alt="The Vision"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">Generational Cask Solera</span>
                      <span className="text-[10px] sm:text-[11px] text-stone-400">Aging for Decades in Microclimates</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition shrink-0 cursor-pointer"
                  >
                    <span>Explore Vault Spirits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* CORE VALUES SECTION (Horizontal swipe on mobile & tablet, 3-column grid on desktop) */}
      {(activeTabFilter === 'all' || activeTabFilter === 'values') && (
        <div className="space-y-4 pt-2">
          {/* Values Section Sub-heading & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-800/60 pb-3">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>{config.valuesTitle || 'Pillars of Distillation Craft'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                {config.valuesSubtitle || 'Six fundamental convictions that guide our masters from mountain spring to sealed crystal bottle.'}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs font-mono text-amber-400/90 font-bold">
                {values.length} Core Convictions
              </span>

              {/* Mobile/Tablet Horizontal Scroll Buttons */}
              <div className="flex lg:hidden items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollValues('left')}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 active:scale-95 transition"
                  aria-label="Scroll core values left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollValues('right')}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 active:scale-95 transition"
                  aria-label="Scroll core values right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Values Track: Horizontal Snap Carousel on Mobile & Tablet, Bento Grid on Desktop */}
          <div
            ref={valuesScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 pb-4 pt-1 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {values.map((val, idx) => (
              <motion.div
                key={val.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setActiveValueModal(val)}
                className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 snap-start lg:w-auto group relative p-5 sm:p-6 rounded-2xl bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-950/30 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                {/* Header: Icon & Tag */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300 shadow-md">
                      {renderPrincipleIcon(val.icon, "w-5 h-5 sm:w-6 sm:h-6")}
                    </div>
                    {val.tag && (
                      <span className="px-2.5 py-1 bg-stone-950 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {val.tag}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-base sm:text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                    {val.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                    {val.description}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors">
                  <span className="flex items-center gap-1 font-medium text-amber-400/80">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Standard #{idx + 1}</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <Maximize2 className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CORE VALUE DEEP DIVE MODAL */}
      <AnimatePresence>
        {activeValueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-stone-900 border border-amber-600/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveValueModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-950 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Icon & Tag */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  {renderPrincipleIcon(activeValueModal.icon, "w-7 h-7")}
                </div>
                <div>
                  {activeValueModal.tag && (
                    <span className="px-2.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                      {activeValueModal.tag}
                    </span>
                  )}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                    {activeValueModal.title}
                  </h3>
                </div>
              </div>

              {/* Value Full Narrative */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                  Foundational Distillation Mandate
                </span>
                <p className="text-sm text-stone-200 leading-relaxed">
                  {activeValueModal.description}
                </p>
              </div>

              {/* Guiding Pledge */}
              <div className="space-y-2 text-xs text-stone-400">
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Enforced across every single cask batch and bottle release.</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Guarded continuously by Master Distillers & Head Coopers.</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveValueModal(null)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow transition cursor-pointer"
                >
                  Close Pillar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

