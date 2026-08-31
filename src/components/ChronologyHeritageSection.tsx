import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HeritageMilestone } from '../types';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  Award, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Wine,
  Calendar,
  Compass,
  SlidersHorizontal,
  LayoutList,
  Sparkle,
  History,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Info,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ChronologyHeritageSection: React.FC = () => {
  const { homeContent, setActiveTab, setSelectedCategory } = useStore();
  const heritageConfig = homeContent.heritageChronology;

  if (!heritageConfig || !heritageConfig.showSection || !heritageConfig.milestones || heritageConfig.milestones.length === 0) {
    return null;
  }

  const milestones = heritageConfig.milestones;
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'vertical' | 'spotlight' | 'grid'>('vertical');
  const [activeModalMilestone, setActiveModalMilestone] = useState<HeritageMilestone | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const currentMilestone: HeritageMilestone = milestones[selectedIdx] || milestones[0];

  const handleNext = () => {
    setSelectedIdx((prev) => (prev + 1) % milestones.length);
  };

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev - 1 + milestones.length) % milestones.length);
  };

  const scrollToMilestone = (id: string) => {
    const el = document.getElementById(`milestone-node-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section 
      id="chronology-distillation-heritage"
      aria-label="Distillery Chronology & Distillation Heritage"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 w-full max-w-full overflow-hidden"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-6 relative z-10">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/70 border border-amber-500/30 shadow-md">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{heritageConfig.sectionBadge || 'Chronology & Heritage'}</span>
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 tracking-tight leading-tight">
            {heritageConfig.sectionTitle || 'Chronology & Distillation Heritage'}
          </h2>

          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            {heritageConfig.sectionSubtitle || 'Traced through five generations of unhurried distillation, hand-hammered Scottish copper stills, and rare Iberian sherry hogsheads.'}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 self-start md:self-auto shrink-0 shadow-xl">
          <button
            onClick={() => setViewMode('vertical')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'vertical'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Vertical Timeline</span>
          </button>

          <button
            onClick={() => setViewMode('spotlight')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'spotlight'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Epoch Explorer</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Archive Grid</span>
          </button>
        </div>
      </div>

      {/* QUICK ERA JUMP BAR (Visible on Vertical view) */}
      {viewMode === 'vertical' && (
        <div className="p-3 sm:p-4 rounded-2xl bg-stone-900/70 border border-stone-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 relative z-10 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider pl-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Jump to Era:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {milestones.map((m, idx) => (
              <button
                key={m.id || idx}
                onClick={() => scrollToMilestone(m.id || String(idx))}
                className="px-3 py-1.5 rounded-xl bg-stone-950/80 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{m.year}</span>
                <span className="text-[10px] text-stone-400 font-sans hidden sm:inline">• {m.tag || m.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PRIMARY VIEW: VERTICAL CHRONOLOGICAL TIMELINE                         */}
      {/* ========================================================================= */}
      {viewMode === 'vertical' && (
        <div className="relative z-10 py-4 max-w-5xl mx-auto">
          {/* Vertical Spine Line */}
          {/* Mobile/Tablet: Left-aligned at 1.75rem. Desktop: Centered at 50% */}
          <div className="absolute top-2 bottom-6 left-6 sm:left-7 lg:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-amber-500 via-amber-600/70 to-amber-800/30 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.25)] z-0" />

          {/* Timeline Nodes - 50% more compact vertical spacing */}
          <div className="space-y-6 sm:space-y-8 relative">
            {milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={milestone.id || idx}
                  id={`milestone-node-${milestone.id || idx}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative flex flex-col lg:flex-row items-start lg:items-center group"
                >
                  {/* Central Spine Compact Glowing Year Node */}
                  <div className="absolute left-6 sm:left-7 lg:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                        isHovered
                          ? 'bg-amber-500 border-stone-950 text-stone-950 scale-110 shadow-amber-500/50'
                          : 'bg-stone-950 border-amber-500/80 text-amber-400 shadow-amber-950/60'
                      }`}
                    >
                      <span className="font-serif font-black text-[10px] sm:text-xs tracking-tight">
                        {milestone.year}
                      </span>
                    </div>

                    {/* Small subtle pulse */}
                    <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping pointer-events-none opacity-30" />
                  </div>

                  {/* Desktop Layout: Alternating Left & Right Cards (Constrained to 50% compact footprint) */}
                  <div
                    className={`w-full pl-12 sm:pl-16 lg:pl-0 ${
                      isEven
                        ? 'lg:pr-8 lg:w-1/2 lg:mr-auto flex lg:justify-end'
                        : 'lg:pl-8 lg:w-1/2 lg:ml-auto flex lg:justify-start'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="w-full max-w-sm sm:max-w-md rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 p-3.5 sm:p-4 space-y-3 transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/40 relative overflow-hidden backdrop-blur-sm"
                    >
                      {/* Subtle Ambient Hover Glow */}
                      <div className="absolute -right-12 -top-12 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition duration-500 pointer-events-none" />

                      {/* Header row: Epoch badge, Tag, Year */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                          Epoch {idx + 1} • {milestone.year}
                        </span>

                        {milestone.tag && (
                          <span className="px-2 py-0.5 rounded-full bg-stone-950 text-stone-300 border border-stone-700 text-[9px] font-bold uppercase tracking-wider truncate max-w-[140px]">
                            {milestone.tag}
                          </span>
                        )}
                      </div>

                      {/* Compact Image Banner */}
                      <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:h-28 bg-stone-950 border border-stone-800 group/img shadow-inner">
                        <img
                          src={milestone.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'}
                          alt={milestone.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 filter brightness-[0.88]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                        {/* Year Overlay */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-stone-950/90 border border-amber-500/40 rounded-lg backdrop-blur-sm">
                          <span className="font-serif text-xs font-bold text-amber-400">
                            {milestone.year}
                          </span>
                        </div>

                        {/* Quick View trigger */}
                        <button
                          type="button"
                          onClick={() => setActiveModalMilestone(milestone)}
                          className="absolute top-2 right-2 p-1.5 bg-stone-950/80 hover:bg-amber-500 text-stone-300 hover:text-stone-950 rounded-lg border border-stone-700 backdrop-blur-sm transition cursor-pointer"
                          title="Expand Dossier"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-base font-bold text-stone-100 group-hover:text-amber-300 transition leading-snug line-clamp-1">
                          {milestone.title}
                        </h3>
                        <p className="text-[11px] font-medium text-amber-400/90 font-serif italic truncate">
                          {milestone.subtitle}
                        </p>
                      </div>

                      {/* Narrative Description (Compact 2-line clamp) */}
                      <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed font-light line-clamp-2">
                        {milestone.description}
                      </p>

                      {/* Technical Specs & Cooperage Metrics (Compact) */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        {milestone.statLabel && milestone.statValue && (
                          <div className="p-2 rounded-lg bg-stone-950/90 border border-stone-800 text-left">
                            <span className="text-[9px] text-stone-500 uppercase tracking-wider block font-semibold truncate">
                              {milestone.statLabel}
                            </span>
                            <span className="font-serif text-xs font-bold text-amber-400 block truncate mt-0.5">
                              {milestone.statValue}
                            </span>
                          </div>
                        )}

                        {milestone.caskType && (
                          <div className="p-2 rounded-lg bg-stone-950/90 border border-stone-800 text-left">
                            <span className="text-[9px] text-stone-500 uppercase tracking-wider block font-semibold truncate">
                              Cooperage
                            </span>
                            <span className="text-[11px] text-stone-200 block truncate mt-0.5 font-medium">
                              {milestone.caskType}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Card Footer */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveModalMilestone(milestone)}
                          className="px-2.5 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-[11px] font-semibold border border-stone-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3 h-3 text-amber-400" />
                          <span>Dossier</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('products');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-[11px] font-bold transition shadow shadow-amber-500/10 flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Destination Anchor */}
          <div className="text-center pt-8 relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-[11px] shadow-lg">
              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
              <span>Continuing into the Next Century of Pure Distillation Artistry</span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span>Read Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECONDARY VIEW: SPOTLIGHT INTERACTIVE EPOCH SCRUBBER                   */}
      {/* ========================================================================= */}
      {viewMode === 'spotlight' && (
        <div className="space-y-8 relative z-10">
          {/* Horizontal Year Timeline Scrubber */}
          <div className="p-4 sm:p-6 rounded-2xl bg-stone-900/80 border border-stone-800/90 backdrop-blur-md shadow-xl overflow-x-auto scrollbar-thin">
            <div className="flex items-center justify-between min-w-[550px] relative">
              {/* Connecting Track Line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-800/40 via-amber-500/60 to-amber-800/40 z-0" />

              {milestones.map((m, idx) => {
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={m.id || idx}
                    onClick={() => setSelectedIdx(idx)}
                    className="group relative z-10 flex flex-col items-center gap-2.5 focus:outline-none transition cursor-pointer"
                  >
                    {/* Node Dot */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-amber-500 border-amber-300 scale-125 shadow-lg shadow-amber-500/50'
                          : 'bg-stone-950 border-stone-700 group-hover:border-amber-500/60 group-hover:scale-110'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-stone-950' : 'bg-stone-500 group-hover:bg-amber-400'
                        }`}
                      />
                    </div>

                    {/* Year Label Pill */}
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-extrabold scale-105'
                          : 'bg-stone-950/90 text-stone-400 border-stone-800 group-hover:text-amber-300 group-hover:border-stone-700'
                      }`}
                    >
                      {m.year}
                    </span>

                    {/* Milestone Short Tag */}
                    <span className="text-[10px] text-stone-400 max-w-[80px] text-center truncate hidden sm:block">
                      {m.tag || m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Card Showcase */}
          <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 border border-amber-600/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Top Right Stepper Buttons */}
            <div className="flex items-center justify-between pb-6 border-b border-stone-800/80">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-amber-400 font-bold tracking-wider uppercase">
                  Epoch {selectedIdx + 1} of {milestones.length}
                </span>
                {currentMilestone.tag && (
                  <span className="px-2.5 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-600/40 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {currentMilestone.tag}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  id="heritage-prev-btn"
                  aria-label="Previous Milestone"
                  className="p-2 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-stone-800 transition active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  id="heritage-next-btn"
                  aria-label="Next Milestone"
                  className="p-2 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-stone-800 transition active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Showcase Layout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMilestone.id || selectedIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6"
              >
                {/* Visual Image Frame */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-stone-950 border border-amber-600/30 shadow-2xl group">
                    <img
                      src={currentMilestone.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80'}
                      alt={currentMilestone.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                    {/* Prominent Year Stamp Overlay */}
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-stone-950/90 border border-amber-500/50 rounded-xl backdrop-blur-md">
                      <span className="font-serif text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                        {currentMilestone.year}
                      </span>
                    </div>

                    {/* Cask Type Badge at Bottom */}
                    {currentMilestone.caskType && (
                      <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-stone-950/90 border border-stone-700/80 backdrop-blur-md flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Oak / Distillate Specification</span>
                          <span className="text-xs font-bold text-stone-200 truncate block">{currentMilestone.caskType}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Narrative Details & Distillation Stats */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-mono text-amber-400/90 uppercase tracking-wider block mb-1">
                      Distillation Heritage Milestone • {currentMilestone.year}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-100 leading-snug">
                      {currentMilestone.title}
                    </h3>
                    <p className="text-sm font-semibold text-amber-300/90 mt-1">
                      {currentMilestone.subtitle}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
                    {currentMilestone.description}
                  </p>

                  {/* Spec Highlight Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentMilestone.statLabel && currentMilestone.statValue && (
                      <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                          {currentMilestone.statLabel}
                        </span>
                        <strong className="font-serif text-base text-amber-400 block mt-0.5">
                          {currentMilestone.statValue}
                        </strong>
                      </div>
                    )}

                    {currentMilestone.caskType && (
                      <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                          Cooperage & Maturation
                        </span>
                        <strong className="text-xs text-stone-200 block truncate mt-0.5">
                          {currentMilestone.caskType}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Footer CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('about');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Read Full Heritage Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('products');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Explore Resulting Spirits
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TERTIARY VIEW: COMPLETE ARCHIVE GRID                                   */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={m.id || idx}
                className="rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-amber-950/40 group"
              >
                {/* Image & Year Badge */}
                <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
                  <img
                    src={m.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80'}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-[0.8]"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-stone-950/90 border border-amber-500/50 rounded-lg">
                    <span className="font-serif text-base font-bold text-amber-400">{m.year}</span>
                  </div>

                  {m.tag && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-950/90 text-amber-300 border border-amber-700/50 rounded text-[9px] font-bold uppercase tracking-wider">
                      {m.tag}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-400 transition">
                      {m.title}
                    </h3>
                    <p className="text-xs font-medium text-amber-300/80">
                      {m.subtitle}
                    </p>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 mt-2">
                      {m.description}
                    </p>
                  </div>

                  {/* Spec Footer */}
                  <div className="pt-3 border-t border-stone-800/80 space-y-2">
                    {m.statLabel && m.statValue && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">{m.statLabel}:</span>
                        <span className="font-mono text-amber-400 font-bold">{m.statValue}</span>
                      </div>
                    )}
                    {m.caskType && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Cooperage:</span>
                        <span className="text-stone-300 truncate max-w-[160px] text-right font-medium">{m.caskType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED ARCHIVAL DOSSIER MODAL                                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-stone-900 border border-amber-600/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalMilestone(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-950 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-8">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-mono font-bold">
                    YEAR {activeModalMilestone.year}
                  </span>
                  {activeModalMilestone.tag && (
                    <span className="px-2.5 py-1 bg-stone-950 text-stone-300 border border-stone-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {activeModalMilestone.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {activeModalMilestone.title}
                </h3>
                <p className="text-sm font-semibold text-amber-400 font-serif italic">
                  {activeModalMilestone.subtitle}
                </p>
              </div>

              {/* Photo Frame */}
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
                <img
                  src={activeModalMilestone.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeModalMilestone.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold block">
                  Distillery Archival Record
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {activeModalMilestone.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeModalMilestone.statLabel && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                      {activeModalMilestone.statLabel}
                    </span>
                    <strong className="font-serif text-sm text-amber-400 block mt-0.5">
                      {activeModalMilestone.statValue}
                    </strong>
                  </div>
                )}

                {activeModalMilestone.caskType && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                      Cooperage & Cask Type
                    </span>
                    <strong className="text-xs text-stone-200 block truncate mt-0.5">
                      {activeModalMilestone.caskType}
                    </strong>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setActiveModalMilestone(null)}
                  className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl text-xs font-semibold transition"
                >
                  Close Dossier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalMilestone(null);
                    setActiveTab('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  Browse Era Expressions
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
