import React from 'react';
import { 
  Flame, 
  Wine, 
  Crown, 
  ShoppingBag, 
  User, 
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TabType } from '../types';
import { formatPrice } from '../utils/currency';

interface BottomNavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSearch?: () => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch
}) => {
  const { cart, setIsCartOpen, adminSettings } = useStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const navItems: Array<{
    id: TabType | 'cart';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
    isCartAction?: boolean;
  }> = [
    {
      id: 'home',
      label: 'Home',
      icon: Flame
    },
    {
      id: 'products',
      label: 'Vault',
      icon: Wine
    },
    {
      id: 'allocations',
      label: 'Allocations',
      icon: Crown,
      badge: 'Live',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      id: 'cart',
      label: 'Cask Cart',
      icon: ShoppingBag,
      badge: totalCartItems > 0 ? totalCartItems : undefined,
      badgeColor: 'bg-amber-500 text-stone-950 font-bold',
      isCartAction: true
    },
    {
      id: 'account',
      label: 'Account',
      icon: User
    }
  ];

  return (
    <nav 
      id="mobile-bottom-navigation-bar"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/90 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      {/* Live Mini Cart Bar on top of bottom bar if cart has items */}
      {totalCartItems > 0 && activeTab !== 'checkout' && (
        <div 
          onClick={() => setIsCartOpen(true)}
          className="mx-3 -mt-3.5 mb-1 px-3 py-1.5 bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-950/90 border border-amber-500/40 rounded-xl flex items-center justify-between shadow-lg cursor-pointer transform active:scale-[0.98] transition-transform"
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

      {/* Main 5-Item Tab Grid */}
      <div className="grid grid-cols-5 items-center justify-around px-1 pt-1.5 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isCartAction && activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              type="button"
              onClick={() => {
                if (item.isCartAction) {
                  setIsCartOpen(true);
                } else {
                  setActiveTab(item.id as TabType);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 group touch-manipulation cursor-pointer ${
                isActive 
                  ? 'text-amber-400 font-semibold' 
                  : 'text-stone-400 hover:text-stone-200 active:scale-95'
              }`}
            >
              {/* Active Indicator Top Glow Dot */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b] animate-fade-in" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <div 
                  className={`p-1 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-amber-500/15 text-amber-400' 
                      : 'group-hover:bg-stone-900 text-stone-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge Overlay */}
                {item.badge !== undefined && (
                  <span 
                    className={`absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center shadow-md border ${
                      item.badgeColor || 'bg-amber-500 text-stone-950 border-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span 
                className={`text-[10px] mt-0.5 tracking-tight transition-colors whitespace-nowrap ${
                  isActive ? 'font-bold text-amber-400' : 'text-stone-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
