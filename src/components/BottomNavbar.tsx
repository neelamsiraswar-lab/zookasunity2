import React from 'react';
import { 
  Flame, 
  Wine, 
  Crown, 
  ShoppingBag, 
  User, 
  ShieldCheck,
  Search,
  BookOpen,
  Building2,
  Sparkles,
  Compass,
  GlassWater
} from 'lucide-react';
import { useStore, normalizeBottomNavbarConfig } from '../context/StoreContext';
import { AppTab, BottomNavAccentColor, BottomNavItem } from '../types';
import { initialBottomNavbarConfig } from '../data/initialData';
import { formatPrice } from '../utils/currency';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Wine,
  Crown,
  ShoppingBag,
  User,
  ShieldCheck,
  Search,
  BookOpen,
  Building2,
  Sparkles,
  Compass,
  GlassWater
};

interface BottomNavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenSearch?: () => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch
}) => {
  const { 
    cart, 
    setIsCartOpen, 
    adminSettings, 
    bottomNavbarConfig,
    ballotAllocations 
  } = useStore();

  const config = normalizeBottomNavbarConfig(bottomNavbarConfig || initialBottomNavbarConfig);

  // If disabled by admin CMS, do not render
  if (!config.enabled || config.visibilityMode === 'hidden') {
    return null;
  }

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const activeAllocationsCount = ballotAllocations.filter(a => a.status === 'open' || a.status === 'open_for_entries' || (a.status as string) === 'active').length;

  // Visibility class based on visibilityMode
  const visibilityClass = 
    config.visibilityMode === 'always' || config.visibilityMode === 'all_devices' ? 'block' :
    config.visibilityMode === 'mobile_and_tablet' ? 'lg:hidden block' :
    'md:hidden block';

  // Floating Margin class
  const marginWrapperClass = 
    config.designStyle === 'full_width_dock' || config.designStyle === 'minimal_flat' || config.floatingMargin === 'none'
      ? 'p-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]' :
    config.floatingMargin === 'small'
      ? 'px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]' :
    config.floatingMargin === 'large'
      ? 'px-4 pb-[max(1rem,env(safe-area-inset-bottom))]' :
      'px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]';

  // Backdrop Blur class
  const blurClass = 
    config.backdropBlur === 'none' ? 'backdrop-blur-none' :
    config.backdropBlur === 'sm' ? 'backdrop-blur-sm' :
    config.backdropBlur === 'md' ? 'backdrop-blur-md' :
    config.backdropBlur === 'lg' ? 'backdrop-blur-lg' :
    'backdrop-blur-xl';

  // Border Style classes
  const getBorderClasses = () => {
    switch (config.borderStyle) {
      case 'none':
        return 'border-0';
      case 'subtle':
        return 'border border-stone-800/80';
      case 'gold_glow':
        return 'border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'accent_border':
        return 'border-2 border-amber-500/60';
      case 'double_gold':
        return 'border border-amber-400/60 ring-1 ring-amber-600/40 shadow-xl';
      case 'charred_wood':
        return 'border border-stone-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]';
      default:
        return 'border border-stone-800';
    }
  };

  // Bar Container Styling by designStyle
  const getBarStyleClasses = () => {
    const border = getBorderClasses();
    switch (config.designStyle) {
      case 'floating_island':
      case 'compact_pill':
        return `rounded-2xl sm:rounded-3xl bg-stone-950/95 shadow-[0_15px_35px_rgba(0,0,0,0.85)] ${border} ${blurClass}`;
      case 'glass_capsule':
      case 'docked_glass':
        return `rounded-3xl bg-stone-900/70 shadow-2xl ${border} backdrop-blur-2xl`;
      case 'luxury_gold_accent':
      case 'royal_heritage':
        return `rounded-2xl bg-gradient-to-r from-amber-950/95 via-stone-950/95 to-amber-950/95 ${border} shadow-[0_0_25px_rgba(245,158,11,0.25)] ${blurClass}`;
      case 'minimal_flat':
      case 'minimal_amber':
      case 'luxury_obsidian':
        return `bg-stone-950/98 border-t border-stone-800/90 shadow-lg`;
      case 'full_width_dock':
      default:
        return `bg-stone-950/95 border-t border-stone-800/90 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] ${blurClass}`;
    }
  };

  // Accent Colors mapping
  const getAccentTextClass = (accent?: BottomNavAccentColor) => {
    switch (accent || config.accentColor) {
      case 'copper': return 'text-orange-400';
      case 'emerald': return 'text-emerald-400';
      case 'ruby': return 'text-rose-400';
      case 'gold': return 'text-yellow-300';
      case 'silver':
      case 'slate': return 'text-slate-200';
      case 'amber':
      default:
        return 'text-amber-400';
    }
  };

  const getAccentBgGlow = (accent?: BottomNavAccentColor) => {
    switch (accent || config.accentColor) {
      case 'copper': return 'bg-orange-500 shadow-[0_0_8px_#f97316]';
      case 'emerald': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
      case 'ruby': return 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
      case 'gold': return 'bg-yellow-400 shadow-[0_0_8px_#facc15]';
      case 'silver':
      case 'slate': return 'bg-slate-300 shadow-[0_0_8px_#cbd5e1]';
      case 'amber':
      default:
        return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
    }
  };

  const getBadgeClasses = (item: BottomNavItem) => {
    const color = item.badgeColor || 'amber';
    switch (color) {
      case 'ruby':
      case 'rose':
        return 'bg-rose-500 text-white border-rose-400';
      case 'emerald':
        return 'bg-emerald-600 text-emerald-50 border-emerald-400';
      case 'blue':
        return 'bg-blue-600 text-blue-50 border-blue-400';
      case 'gold':
        return 'bg-yellow-400 text-stone-950 font-black border-yellow-300';
      case 'obsidian':
        return 'bg-stone-900 text-stone-200 border-stone-700';
      case 'amber':
      default:
        return 'bg-amber-500 text-stone-950 font-bold border-amber-400';
    }
  };

  // Filter visible items
  const visibleItems = (config.items || []).filter(item => item.visible);

  return (
    <nav 
      id="mobile-bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 ${visibilityClass} transition-all duration-300`}
    >
      <div className={`max-w-xl mx-auto w-full ${marginWrapperClass}`}>
        
        {/* Floating Mini Cart Bar */}
        {config.showMiniCartBar && totalCartItems > 0 && activeTab !== 'checkout' && (
          <div 
            onClick={() => setIsCartOpen(true)}
            className="mb-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-950/90 border border-amber-500/40 rounded-xl flex items-center justify-between shadow-lg cursor-pointer transform active:scale-[0.98] transition-transform animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                {totalCartItems} {totalCartItems === 1 ? 'Bottle' : 'Bottles'} in Vault Cart
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <span>{formatPrice(cartSubtotal, adminSettings.currencySymbol)}</span>
              <span className="text-[10px] text-amber-400/80">View ›</span>
            </div>
          </div>
        )}

        {/* Bottom Bar Shell */}
        <div className={getBarStyleClasses()}>
          <div 
            className="grid items-center justify-around px-1 pt-1.5 pb-1"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, visibleItems.length)}, minmax(0, 1fr))` }}
          >
            {visibleItems.map((item) => {
              const IconComponent = ICON_MAP[item.iconName] || Flame;
              const isCart = item.tab === 'cart' || item.id === 'bn-cart';
              const isActive = !isCart && activeTab === item.tab;

              // Compute Badge Value
              let badgeContent: React.ReactNode = null;
              if (item.badgeType === 'cart_count') {
                if (totalCartItems > 0) badgeContent = totalCartItems;
              } else if (item.badgeType === 'allocations_count' || item.badgeType === 'live') {
                if (config.showAllocationsLivePill || activeAllocationsCount > 0) {
                  badgeContent = activeAllocationsCount > 0 ? `${activeAllocationsCount} Live` : 'Live';
                }
              } else if (item.badgeType === 'text' || item.badgeType === 'numeric') {
                badgeContent = item.badgeText || undefined;
              } else if (item.badgeType === 'dot') {
                badgeContent = '•';
              }

              return (
                <button
                  key={item.id}
                  id={`bottom-nav-${item.id}`}
                  type="button"
                  onClick={() => {
                    if (isCart) {
                      setIsCartOpen(true);
                    } else if (item.tab === 'search' && onOpenSearch) {
                      onOpenSearch();
                    } else if (item.tab !== 'search' && item.tab !== 'cart') {
                      setActiveTab(item.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 group touch-manipulation cursor-pointer ${
                    item.isCenterAction ? '-mt-3.5 scale-105' : ''
                  } ${
                    config.enableHapticGlow ? 'active:scale-95' : ''
                  } ${
                    isActive 
                      ? `${getAccentTextClass()} font-semibold` 
                      : 'text-stone-400 hover:text-stone-200'
                  } ${
                    isActive && config.activeIndicatorStyle === 'full_tab_highlight'
                      ? 'bg-amber-500/10 rounded-xl' : ''
                  }`}
                >
                  {/* Top Glow Bar Indicator */}
                  {isActive && (config.activeIndicatorStyle === 'top_glow_bar' || config.activeIndicatorStyle === 'under_line') && (
                    <span className={`absolute -top-1 w-6 h-1 rounded-full animate-fade-in ${getAccentBgGlow()}`} />
                  )}

                  {/* Pulsing Beacon Indicator */}
                  {isActive && config.activeIndicatorStyle === 'pulsing_beacon' && (
                    <span className="absolute inset-0 rounded-xl bg-amber-500/10 animate-ping pointer-events-none" />
                  )}

                  {/* Icon Container with Badge */}
                  <div className="relative flex items-center justify-center">
                    <div 
                      className={`transition-all duration-200 ${
                        item.isCenterAction
                          ? 'p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/40 border border-amber-300/80 ring-2 ring-stone-950' :
                        isActive && (config.activeIndicatorStyle === 'icon_pill_bg' || config.activeIndicatorStyle === 'soft_pill_bg')
                          ? `p-1.5 rounded-xl bg-amber-500/15 ${getAccentTextClass()} ring-1 ring-amber-500/40 shadow-sm` :
                        isActive
                          ? `p-1 rounded-xl bg-stone-900/60 ${getAccentTextClass()}` :
                          'p-1 rounded-xl group-hover:bg-stone-900 text-stone-400'
                      }`}
                    >
                      <IconComponent className={item.isCenterAction ? "w-5 h-5" : "w-5 h-5"} />
                    </div>

                    {/* Badge Overlay */}
                    {badgeContent !== null && badgeContent !== undefined && (
                      <span 
                        className={`absolute -top-1 -right-2.5 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center shadow-md border ${getBadgeClasses(item)}`}
                      >
                        {badgeContent}
                      </span>
                    )}
                  </div>

                  {/* Text Label */}
                  {config.showLabels && (
                    <span 
                      className={`text-[10px] mt-0.5 tracking-tight transition-colors whitespace-nowrap ${
                        item.isCenterAction ? 'font-bold text-amber-300' :
                        isActive ? `font-bold ${getAccentTextClass()}` : 'text-stone-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Subtle Dot Indicator */}
                  {isActive && (config.activeIndicatorStyle === 'subtle_dot' || config.activeIndicatorStyle === 'glow_dot' || config.activeIndicatorStyle === 'floating_pip') && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 shadow-sm ${getAccentBgGlow()}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
