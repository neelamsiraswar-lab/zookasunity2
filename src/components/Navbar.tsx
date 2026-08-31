import React, { useState } from 'react';
import { useStore, AppTab } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  User, 
  Flame,
  BookOpen,
  Wine,
  Building2,
  Cloud,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  ChevronDown,
  Compass,
  Crown,
  GlassWater,
  ArrowRight
} from 'lucide-react';

const getHeaderIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Wine': return Wine;
    case 'Building2': return Building2;
    case 'BookOpen': return BookOpen;
    case 'User': return User;
    case 'Sparkles': return Sparkles;
    case 'ShieldCheck': return ShieldCheck;
    case 'Compass': return Compass;
    case 'Crown': return Crown;
    case 'GlassWater': return GlassWater;
    case 'Flame':
    default:
      return Flame;
  }
};

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    homeContent,
    adminSettings,
    headerConfig,
    customer,
    isCustomerLoggedIn,
    openAuthModal,
    logoutCustomer,
    switchCustomerAccount,
    demoCustomersList,
    cloudSyncStatus,
    lastSyncedAt,
    forceCloudResync,
    isCloudSeeding
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showCloudPopover, setShowCloudPopover] = useState<boolean>(false);
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);

  const effectiveHeader = headerConfig || {
    brandName: adminSettings.brandName,
    brandTagline: 'Artisanal Distillery',
    logoIcon: 'Flame',
    stickyHeader: true,
    showAnnouncementBar: true,
    announcementText: homeContent.announcementText || 'Complimentary shipping on single cask allocations over $200 with code SPIRIT200',
    navItems: [
      { id: 'nav-1', label: 'Home', tab: 'home', iconName: 'Flame', visible: true },
      { id: 'nav-2', label: 'Spirits Store', tab: 'products', iconName: 'Wine', visible: true, badge: 'New Batch', badgeColor: 'amber' },
      { id: 'nav-3', label: 'Our Story', tab: 'about', iconName: 'Building2', visible: true },
      { id: 'nav-4', label: 'Tasting Journal', tab: 'blog', iconName: 'BookOpen', visible: true },
      { id: 'nav-5', label: 'My Account', tab: 'account', iconName: 'User', visible: true }
    ],
    showSearchBar: true,
    searchPlaceholder: 'Search spirits, casks, distillers...',
    showCloudStatus: true,
    showCustomerAccount: true,
    showAdminButton: true,
    adminButtonText: 'Admin CMS',
    showCartButton: true
  };

  const visibleNavItems = (effectiveHeader.navItems || []).filter(item => item.visible !== false);
  const BrandIcon = getHeaderIcon(effectiveHeader.logoIcon);

  const handleNavClick = (tab: AppTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`${effectiveHeader.stickyHeader !== false ? 'sticky top-0' : 'relative'} z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80`}>
      {/* Top Promotional Bar */}
      {effectiveHeader.showAnnouncementBar && (
        <div 
          className="py-1.5 px-4 text-center transition-all cursor-pointer select-none"
          style={{
            backgroundColor: effectiveHeader.announcementBgColor || '#451a03',
            color: effectiveHeader.announcementTextColor || '#fde68a'
          }}
          onClick={() => {
            if (effectiveHeader.announcementTab) {
              handleNavClick(effectiveHeader.announcementTab);
            }
          }}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-90" />
            <span className="truncate">{effectiveHeader.announcementText || homeContent.announcementText}</span>
            {effectiveHeader.announcementLinkText && (
              <span className="inline-flex items-center gap-1 font-bold underline ml-1 hover:opacity-80">
                <span>{effectiveHeader.announcementLinkText}</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
            id="brand-logo-button"
          >
            {effectiveHeader.logoImageUrl ? (
              <img 
                src={effectiveHeader.logoImageUrl} 
                alt={effectiveHeader.brandName || adminSettings.brandName} 
                className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 shadow-lg shadow-amber-950/50 group-hover:scale-105 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-950/50 border border-amber-400/40 group-hover:scale-105 transition">
                <BrandIcon className="w-5 h-5 text-stone-950" />
              </div>
            )}
            <div>
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-stone-100 uppercase block leading-tight">
                {effectiveHeader.brandName || adminSettings.brandName}
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest text-amber-400/90 uppercase font-medium">
                {effectiveHeader.brandTagline || 'Artisanal Distillery'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {visibleNavItems.map((link) => {
              const Icon = getHeaderIcon(link.iconName);
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.id || link.tab}
                  onClick={() => handleNavClick(link.tab)}
                  id={`nav-link-${link.tab}`}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                    isActive
                      ? 'text-amber-400 bg-amber-950/40 border border-amber-600/30'
                      : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      link.badgeColor === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : link.badgeColor === 'red'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input on Desktop */}
            {effectiveHeader.showSearchBar !== false && (
              <div className="relative hidden md:block w-44 xl:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  id="nav-search-input"
                  placeholder={effectiveHeader.searchPlaceholder || "Search spirits, casks..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'products' && e.target.value.trim().length > 0) {
                      setActiveTab('products');
                    }
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-900/90 border border-stone-700/80 rounded-full text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Google Cloud Real-Time Sync Status Indicator */}
            {effectiveHeader.showCloudStatus !== false && (
              <div className="relative">
                <button
                  onClick={() => setShowCloudPopover(!showCloudPopover)}
                  className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                    cloudSyncStatus === 'connected'
                      ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/40'
                      : cloudSyncStatus === 'syncing'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
                      : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                  title="Google Cloud Realtime Sync Status"
                  id="nav-cloud-status-btn"
                >
                  <div className="relative flex items-center justify-center">
                    <Cloud className="w-3.5 h-3.5" />
                    <span
                      className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                        cloudSyncStatus === 'connected'
                          ? 'bg-emerald-400 animate-ping'
                          : cloudSyncStatus === 'syncing'
                          ? 'bg-amber-400 animate-spin'
                          : 'bg-stone-500'
                      }`}
                    />
                  </div>
                  <span className="hidden xl:inline">
                    {cloudSyncStatus === 'connected' ? 'Cloud Live' : cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Cloud Standby'}
                  </span>
                </button>

                {/* Cloud Sync Popover */}
                {showCloudPopover && (
                  <div className="absolute right-0 mt-2 w-72 p-4 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl z-50 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-2 text-stone-200 font-semibold">
                        <Database className="w-4 h-4 text-amber-400" />
                        <span>Google Cloud Sync</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cloudSyncStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {cloudSyncStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-stone-400 space-y-1 text-[11px]">
                      <p className="flex justify-between">
                        <span>Database:</span>
                        <strong className="text-stone-200">Cloud Firestore</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Media Store:</span>
                        <strong className="text-stone-200">Cloud Storage</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>CRUD Realtime:</span>
                        <strong className="text-emerald-400">Active (Bidirectional)</strong>
                      </p>
                      {lastSyncedAt && (
                        <p className="flex justify-between">
                          <span>Last Synced:</span>
                          <span className="text-stone-300">{lastSyncedAt.toLocaleTimeString()}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={async () => {
                        await forceCloudResync();
                        setShowCloudPopover(false);
                      }}
                      disabled={isCloudSeeding}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCloudSeeding ? 'animate-spin' : ''}`} />
                      <span>{isCloudSeeding ? 'Syncing to Cloud...' : 'Force Cloud Resync'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Customer Account Button & Dropdown */}
            {effectiveHeader.showCustomerAccount !== false && (
              <>
                {isCustomerLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:border-amber-500 hover:text-amber-300 transition cursor-pointer"
                      title="Customer Account Menu"
                      id="nav-account-btn"
                    >
                      <img
                        src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={customer.name}
                        className="w-4 h-4 rounded-full object-cover border border-amber-500/40"
                      />
                      <span className="font-medium text-stone-200 hidden xl:inline">{customer.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-stone-400" />
                    </button>

                    {showAccountMenu && (
                      <div className="absolute right-0 mt-2 w-64 p-3 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl z-50 text-xs space-y-2.5">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-800">
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-9 h-9 rounded-xl object-cover border border-amber-500/30"
                          />
                          <div className="overflow-hidden">
                            <div className="font-serif font-bold text-stone-100 truncate">{customer.name}</div>
                            <div className="text-[11px] text-amber-400/90 truncate">{customer.email}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setShowAccountMenu(false);
                            handleNavClick('account');
                          }}
                          className="w-full px-3 py-2 text-left text-stone-200 hover:bg-stone-800 rounded-xl transition flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span>Cellar Profile & Orders</span>
                        </button>

                        {/* Switch Account Quick Presets */}
                        <div className="pt-2 border-t border-stone-800">
                          <p className="text-[10px] text-stone-400 font-semibold mb-1.5 uppercase tracking-wider">
                            Switch Demo Account:
                          </p>
                          <div className="space-y-1">
                            {demoCustomersList.map((d) => (
                              <button
                                key={d.id}
                                onClick={() => {
                                  switchCustomerAccount(d.id);
                                  setShowAccountMenu(false);
                                }}
                                className={`w-full px-2 py-1.5 rounded-lg text-left text-[11px] flex items-center justify-between transition ${
                                  customer.id === d.id ? 'bg-amber-500/10 text-amber-300 font-semibold' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                                }`}
                              >
                                <span className="truncate">{d.name}</span>
                                {customer.id === d.id && <span className="text-[9px] text-amber-400 font-bold">Active</span>}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            setShowAccountMenu(false);
                            await logoutCustomer();
                          }}
                          className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-950/40 rounded-xl transition flex items-center gap-2 border-t border-stone-800 pt-2"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 text-xs font-semibold transition cursor-pointer"
                    id="nav-login-btn"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </>
            )}

            {/* Admin Switcher */}
            {effectiveHeader.showAdminButton !== false && (
              <button
                onClick={() => handleNavClick('admin')}
                id="nav-admin-button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-amber-400 border border-amber-500/30'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{effectiveHeader.adminButtonText || 'Admin CMS'}</span>
              </button>
            )}

            {/* Shopping Cart Drawer Trigger */}
            {effectiveHeader.showCartButton !== false && (
              <button
                onClick={() => setIsCartOpen(true)}
                id="nav-cart-trigger"
                className="relative p-2.5 rounded-xl bg-stone-900 border border-stone-700/80 hover:border-amber-500 text-stone-200 hover:text-amber-400 transition cursor-pointer"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center justify-center shadow-md animate-pulse-subtle">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {effectiveHeader.showSearchBar !== false && (
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder={effectiveHeader.searchPlaceholder || "Search spirits, casks, distillers..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'products' && e.target.value.trim().length > 0) {
                    setActiveTab('products');
                  }
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950/98 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {visibleNavItems.map((link) => {
            const Icon = getHeaderIcon(link.iconName);
            const isActive = activeTab === link.tab;
            return (
              <button
                key={link.id || link.tab}
                onClick={() => handleNavClick(link.tab)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition ${
                  isActive
                    ? 'text-amber-400 bg-amber-950/50 border border-amber-700/40'
                    : 'text-stone-300 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            {effectiveHeader.showCustomerAccount !== false && (
              <>
                {isCustomerLoggedIn ? (
                  <div className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-stone-200 font-semibold">
                        {customer.name}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        await logoutCustomer();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs px-2.5 py-1 text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to Cellar Account
                  </button>
                )}
              </>
            )}

            {effectiveHeader.showAdminButton !== false && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-xs py-2 bg-stone-800 text-amber-400 border border-amber-500/30 font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {effectiveHeader.adminButtonText || 'Distillery Admin Panel'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
