import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { CarouselSlide } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Pause, 
  Play, 
  Flame,
  Award,
  Compass,
  Wine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeCarousel: React.FC = () => {
  const { homeContent, setActiveTab } = useStore();
  
  // Default fallback if carouselSlides is empty
  const defaultSlides: CarouselSlide[] = [
    {
      id: 'slide-default-1',
      heading: homeContent.heroHeading || 'Pure Artisanal Craft. Bottled with Uncompromising Passion.',
      subtitle: homeContent.heroSubheading || 'Small-batch single malt whiskies, cask-strength bourbons, wild botanical gins, and rare reserve spirits.',
      image: homeContent.heroBgImage || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=85',
      badge: homeContent.heroBadgeText || '⭐ Double Gold San Francisco 2025 Winner',
      ctaText: homeContent.heroCtaText || 'Explore Spirits Vault',
      ctaAction: 'shop'
    }
  ];

  const slides: CarouselSlide[] = (homeContent.carouselSlides && homeContent.carouselSlides.length > 0)
    ? homeContent.carouselSlides
    : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);

  const SLIDE_DURATION = 6500; // ms

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  // Autoplay and progress bar interval
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const progressStep = 100 / (SLIDE_DURATION / 100);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + progressStep;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, handleNext]);

  // Reset current index if out of bounds (e.g. after slide deletion in CMS)
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [slides.length, currentIndex]);

  // Touch gesture handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex] || slides[0];

  const handleCtaClick = (action?: 'shop' | 'about' | 'blog' | 'reserve') => {
    if (action === 'about') {
      setActiveTab('about');
    } else if (action === 'blog') {
      setActiveTab('blog');
    } else {
      setActiveTab('products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Slide Animation Variants
  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 120 : -120,
      scale: 1.02
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 }
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -120 : 120,
      scale: 0.98,
      transition: {
        opacity: { duration: 0.4 }
      }
    })
  };

  return (
    <section 
      id="home-hero-carousel"
      aria-label="Artisanal Spirits Showcase Carousel"
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-stone-800 bg-stone-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides with AnimatePresence */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide.id || currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.heading}
              className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105 transition-transform duration-[8000ms] ease-out transform"
            />
            {/* Atmospheric lighting & vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-stone-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Slide Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 flex flex-col justify-center min-h-[88vh]">
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id || currentIndex}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Badge */}
              {currentSlide.badge && (
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/40 shadow-lg shadow-amber-950/60 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{currentSlide.badge}</span>
                  </span>
                </div>
              )}

              {/* Heading */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-lg">
                {currentSlide.heading}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-stone-100/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
                {currentSlide.subtitle}
              </p>

              {/* CTA Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => handleCtaClick(currentSlide.ctaAction)}
                  id="carousel-primary-cta"
                  className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:shadow-amber-500/40"
                >
                  <span>{currentSlide.ctaText || 'Explore Spirits Vault'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  id="carousel-secondary-cta"
                  className="w-full sm:w-auto px-7 py-4 bg-stone-900/80 hover:bg-stone-850 text-stone-200 border border-stone-700/80 hover:border-amber-500/60 font-semibold text-xs sm:text-sm rounded-xl transition backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Our Copper Pot Heritage</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Bottom Control Deck: Dots, Progress, Counter, Pause Toggle */}
        <div className="pt-6 max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 backdrop-blur-md">
            {/* Left: Slide Counter & Pause Toggle */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-amber-400/90 tracking-wider">
                {String(currentIndex + 1).padStart(2, '0')} <span className="text-stone-600">/</span> {String(slides.length).padStart(2, '0')}
              </span>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? 'Resume Auto-slide' : 'Pause Auto-slide'}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition"
                aria-label={isPaused ? 'Resume Carousel' : 'Pause Carousel'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Center: Slide Indicators / Progress Trackers */}
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id || idx}
                    onClick={() => goToSlide(idx)}
                    className="group relative h-2.5 rounded-full transition-all duration-300 focus:outline-none"
                    style={{ width: isActive ? '48px' : '16px' }}
                    aria-label={`Go to slide ${idx + 1}: ${slide.heading}`}
                  >
                    <div className="absolute inset-0 rounded-full bg-stone-800 group-hover:bg-stone-700 transition" />
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-amber-500"
                        style={{ width: isPaused ? '100%' : `${progress}%` }}
                        transition={{ ease: 'linear' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Manual Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                id="carousel-prev-btn"
                aria-label="Previous Slide"
                className="p-2 rounded-xl bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-stone-800 hover:border-amber-500 transition active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                id="carousel-next-btn"
                aria-label="Next Slide"
                className="p-2 rounded-xl bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-stone-800 hover:border-amber-500 transition active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-center border-t border-stone-800/80 mt-6">
            <div className="p-2.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 block">100%</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Small-Batch Copper Pot</span>
            </div>
            <div className="p-2.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 block">250 L</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Rare Sherry Hogsheads</span>
            </div>
            <div className="p-2.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 block">98 Pts</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Double Gold Winner</span>
            </div>
            <div className="p-2.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 block">21+</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Certified Direct Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Side Arrow Navigation for Desktop Viewports */}
      <div className="hidden lg:block">
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-950/60 hover:bg-amber-500 text-stone-300 hover:text-stone-950 border border-stone-700/60 hover:border-amber-500 backdrop-blur-md flex items-center justify-center transition-all shadow-xl active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-950/60 hover:bg-amber-500 text-stone-300 hover:text-stone-950 border border-stone-700/60 hover:border-amber-500 backdrop-blur-md flex items-center justify-center transition-all shadow-xl active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
