import React, { useState, useEffect } from 'react';
import { useStore, AppTab, normalizeHeaderConfig } from '../../context/StoreContext';
import { HeaderCustomizationConfig, HeaderNavItem } from '../../types';
import { initialHeaderConfig } from '../../data/initialData';
import { CloudImageUploader } from '../CloudImageUploader';
import { 
  Flame, 
  Wine, 
  Building2, 
  BookOpen, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Crown, 
  GlassWater, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Eye, 
  Check, 
  Sliders, 
  Layers, 
  MoveUp, 
  MoveDown,
  LayoutTemplate,
  Cloud,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Flame', label: 'Flame (Distillery)', icon: Flame },
  { name: 'Wine', label: 'Wine / Spirits Bottle', icon: Wine },
  { name: 'Building2', label: 'Distillery Bondhouse', icon: Building2 },
  { name: 'BookOpen', label: 'Tasting Journal Book', icon: BookOpen },
  { name: 'User', label: 'Customer / Cellar Profile', icon: User },
  { name: 'Sparkles', label: 'Sparkles / Exclusive', icon: Sparkles },
  { name: 'ShieldCheck', label: 'Shield (Bonded & Certified)', icon: ShieldCheck },
  { name: 'Compass', label: 'Compass (Highland Terroir)', icon: Compass },
  { name: 'Crown', label: 'Crown (Royal Reserve)', icon: Crown },
  { name: 'GlassWater', label: 'Glass / Glencairn', icon: GlassWater }
];

const AVAILABLE_TABS: { value: AppTab; label: string }[] = [
  { value: 'home', label: 'Home Page' },
  { value: 'products', label: 'Spirits Store Catalog' },
  { value: 'allocations', label: 'Rare Allocations & Ballots' },
  { value: 'about', label: 'Our Story & Distillery' },
  { value: 'blog', label: 'Tasting Journal & Mixology' },
  { value: 'account', label: 'Customer Account / Vault' },
  { value: 'checkout', label: 'Checkout & Orders' },
  { value: 'admin', label: 'Admin CMS Management' }
];

const COLOR_PRESETS = [
  { name: 'Imperial Amber Dark', bg: '#451a03', text: '#fde68a' },
  { name: 'Charred Oak Black', bg: '#1c1917', text: '#d6d3d1' },
  { name: 'Emerald Cellar', bg: '#064e3b', text: '#a7f3d0' },
  { name: 'Royal Highland Navy', bg: '#172554', text: '#bfdbfe' },
  { name: 'Cask Bordeaux Red', bg: '#4c0519', text: '#fecdd3' }
];

export const HeaderCustomizer: React.FC = () => {
  const { headerConfig, updateHeaderConfig, adminSettings } = useStore();
  const [formData, setFormData] = useState<HeaderCustomizationConfig>(() => normalizeHeaderConfig(headerConfig || initialHeaderConfig));
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (headerConfig) {
      setFormData(normalizeHeaderConfig(headerConfig));
    }
  }, [headerConfig]);

  const handleSave = () => {
    updateHeaderConfig(formData);
    setSaveStatus('Header configuration saved to Google Cloud Firestore!');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleReset = () => {
    if (confirm('Reset header and navigation settings to factory distillery defaults?')) {
      const normalized = normalizeHeaderConfig(initialHeaderConfig);
      setFormData(normalized);
      updateHeaderConfig(normalized);
      setSaveStatus('Reset to default header settings.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const addNavItem = () => {
    const newItem: HeaderNavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      tab: 'products',
      iconName: 'Wine',
      visible: true
    };
    setFormData(prev => ({
      ...prev,
      navItems: [...(prev.navItems || []), newItem]
    }));
  };

  const updateNavItem = (index: number, updates: Partial<HeaderNavItem>) => {
    setFormData(prev => {
      const next = [...(prev.navItems || [])];
      next[index] = { ...next[index], ...updates };
      return { ...prev, navItems: next };
    });
  };

  const removeNavItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      navItems: (prev.navItems || []).filter((_, i) => i !== index)
    }));
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const navItems = formData.navItems || [];
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === navItems.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setFormData(prev => {
      const items = [...(prev.navItems || [])];
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return { ...prev, navItems: items };
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-amber-400">
            <LayoutTemplate className="w-4 h-4" />
            <span>Header & Navigation CMS</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100 mt-1">
            Global Header & Navigation Customizer
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl">
            Customize the brand title, logo icon/graphic, promo announcement ribbon, navigation menu items, and utility widgets. All changes save directly to Google Cloud Firestore and sync live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-stone-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save to Cloud</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveStatus && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Interactive Live Preview Box */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Live Header Preview</span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">Simulated Render</span>
        </div>

        <div className="border border-stone-800 rounded-xl overflow-hidden shadow-2xl bg-stone-950">
          {/* Simulated Announcement */}
          {formData.showAnnouncementBar && (
            <div 
              className="py-1.5 px-4 text-center text-xs font-medium flex items-center justify-center gap-2"
              style={{
                backgroundColor: formData.announcementBgColor || '#451a03',
                color: formData.announcementTextColor || '#fde68a'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{formData.announcementText || 'Special announcement banner'}</span>
              {formData.announcementLinkText && (
                <span className="font-bold underline ml-1">{formData.announcementLinkText} →</span>
              )}
            </div>
          )}

          {/* Simulated Main Header */}
          <div className="p-4 flex items-center justify-between gap-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              {formData.logoImageUrl ? (
                <img src={formData.logoImageUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-amber-500/40" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                  <Flame className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="font-cinzel text-sm font-bold text-stone-100 uppercase block">
                  {formData.brandName || adminSettings.brandName}
                </span>
                <span className="text-[9px] text-amber-400 uppercase tracking-widest block">
                  {formData.brandTagline || 'Artisanal Distillery'}
                </span>
              </div>
            </div>

            {/* Nav links preview */}
            <div className="hidden md:flex items-center gap-1.5">
              {(formData.navItems || []).filter(i => i.visible !== false).map((item) => (
                <span key={item.id} className="px-2.5 py-1 text-xs text-stone-300 bg-stone-900 rounded-lg flex items-center gap-1.5 border border-stone-800">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                      {item.badge}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Right icons preview */}
            <div className="flex items-center gap-2 text-xs">
              {formData.showSearchBar && (
                <span className="hidden sm:inline-block px-3 py-1 bg-stone-900 text-stone-500 border border-stone-800 rounded-full text-[11px]">
                  {formData.searchPlaceholder || 'Search spirits...'}
                </span>
              )}
              {formData.showCloudStatus && (
                <span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-[10px] flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  <span>Live</span>
                </span>
              )}
              {formData.showAdminButton && (
                <span className="px-2.5 py-1 bg-stone-800 text-amber-400 border border-amber-500/30 rounded-lg font-semibold text-[11px]">
                  {formData.adminButtonText || 'Admin CMS'}
                </span>
              )}
              {formData.showCartButton && (
                <span className="p-1.5 bg-stone-900 border border-stone-800 rounded-lg text-stone-300">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Brand Identity & Behavior */}
        <div className="space-y-6">
          {/* Card 1: Brand & Logo */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Brand Logo & Identity</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Brand Display Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Zookas Unity Spirits"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Brand Tagline / Subtitle</label>
                <input
                  type="text"
                  value={formData.brandTagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandTagline: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Artisanal Distillery"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Logo Icon Style</label>
                <select
                  value={formData.logoIcon}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoIcon: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <CloudImageUploader
                  label="Custom Brand Logo Image (Upload, Cloud & Media Drive)"
                  currentImageUrl={formData.logoImageUrl || ''}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, logoImageUrl: url }))}
                  folder="products"
                  helperText="Upload transparent PNG or pick from your Drive library. Leave empty to use geometric brand icon."
                  onClear={() => setFormData(prev => ({ ...prev, logoImageUrl: '' }))}
                />
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">Sticky Header Bar</span>
                  <span className="text-[10px] text-stone-500">Keep header locked at top during page scroll</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.stickyHeader !== false}
                    onChange={(e) => setFormData(prev => ({ ...prev, stickyHeader: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Promotional Announcement Ribbon */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Promotional Announcement Ribbon</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showAnnouncementBar}
                  onChange={(e) => setFormData(prev => ({ ...prev, showAnnouncementBar: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.showAnnouncementBar && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Announcement Message</label>
                  <input
                    type="text"
                    value={formData.announcementText}
                    onChange={(e) => setFormData(prev => ({ ...prev, announcementText: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Complimentary shipping on single cask allocations over $200..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Call-to-Action Link Text</label>
                    <input
                      type="text"
                      value={formData.announcementLinkText || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, announcementLinkText: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="Shop Allocations"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Destination Page</label>
                    <select
                      value={formData.announcementTab || 'products'}
                      onChange={(e) => setFormData(prev => ({ ...prev, announcementTab: e.target.value as AppTab }))}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      {AVAILABLE_TABS.map((tab) => (
                        <option key={tab.value} value={tab.value}>{tab.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color presets */}
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">Color Palette Preset</label>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          announcementBgColor: preset.bg,
                          announcementTextColor: preset.text
                        }))}
                        style={{ backgroundColor: preset.bg, color: preset.text }}
                        className="py-2 px-1 text-[10px] font-bold rounded-lg border border-stone-700 hover:scale-105 transition truncate text-center shadow"
                        title={preset.name}
                      >
                        {preset.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Utility & Header Widgets */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Utility Controls & Quick Actions</span>
            </h3>

            <div className="space-y-3">
              {/* Search Bar Switch */}
              <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">Catalog Search Bar</span>
                    <span className="text-[10px] text-stone-500">Live search spirits by cask and notes</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showSearchBar !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showSearchBar: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {formData.showSearchBar && (
                <div className="pl-3">
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Search Placeholder Text</label>
                  <input
                    type="text"
                    value={formData.searchPlaceholder || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, searchPlaceholder: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                    placeholder="Search spirits, casks, distillers..."
                  />
                </div>
              )}

              {/* Cloud Status */}
              <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2.5">
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">Google Cloud Status Pill</span>
                    <span className="text-[10px] text-stone-500">Display real-time Firestore sync monitor</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showCloudStatus !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showCloudStatus: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Customer Account */}
              <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">Customer Cellar Account Trigger</span>
                    <span className="text-[10px] text-stone-500">Sign-in and switch customer profiles</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showCustomerAccount !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showCustomerAccount: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Admin Button */}
              <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">Admin CMS Direct Button</span>
                    <span className="text-[10px] text-stone-500">Quick launcher for distillery staff</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showAdminButton !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showAdminButton: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {formData.showAdminButton && (
                <div className="pl-3">
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Admin Button Text</label>
                  <input
                    type="text"
                    value={formData.adminButtonText || 'Admin CMS'}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminButtonText: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                    placeholder="Admin CMS"
                  />
                </div>
              )}

              {/* Cart Drawer */}
              <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">Shopping Cart Drawer Trigger</span>
                    <span className="text-[10px] text-stone-500">Quick-view slideout allocation bag</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showCartButton !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showCartButton: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Navigation Menu Builder */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Main Navigation Links ({(formData.navItems || []).length})</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Re-order, rename, or assign badges and icons to top-level menu tabs.
                </p>
              </div>

              <button
                type="button"
                onClick={addNavItem}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Nav Link</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.navItems || []).map((item, index) => (
                <div key={item.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <strong className="text-xs text-stone-200">{item.label}</strong>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveNavItem(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 text-stone-400 hover:text-stone-100 disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveNavItem(index, 'down')}
                        disabled={index === formData.navItems.length - 1}
                        title="Move Down"
                        className="p-1 text-stone-400 hover:text-stone-100 disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNavItem(index)}
                        title="Delete Nav Link"
                        className="p-1 text-red-400 hover:text-red-300 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Navigation Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateNavItem(index, { label: e.target.value })}
                        className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200"
                        placeholder="Link Label"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Target Page</label>
                      <select
                        value={item.tab}
                        onChange={(e) => updateNavItem(index, { tab: e.target.value as AppTab })}
                        className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200"
                      >
                        {AVAILABLE_TABS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Icon Graphic</label>
                      <select
                        value={item.iconName || 'Wine'}
                        onChange={(e) => updateNavItem(index, { iconName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200"
                      >
                        {ICON_OPTIONS.map((ico) => (
                          <option key={ico.name} value={ico.name}>{ico.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Pill Badge (Optional)</label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => updateNavItem(index, { badge: e.target.value })}
                        className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200"
                        placeholder="e.g. New Batch, 25-Yr"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-900 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={item.visible !== false}
                        onChange={(e) => updateNavItem(index, { visible: e.target.checked })}
                        className="accent-amber-500 rounded"
                      />
                      <span>Show in Navigation Bar</span>
                    </label>

                    {item.badge && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-stone-400">Badge Color:</span>
                        {(['amber', 'emerald', 'red'] as const).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => updateNavItem(index, { badgeColor: color })}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                              item.badgeColor === color ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
