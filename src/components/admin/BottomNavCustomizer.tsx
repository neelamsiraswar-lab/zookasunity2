import React, { useState, useEffect } from 'react';
import { useStore, AppTab, normalizeBottomNavbarConfig } from '../../context/StoreContext';
import { 
  BottomNavbarCustomizationConfig, 
  BottomNavItem, 
  BottomNavDesignStyle, 
  BottomNavActiveIndicator, 
  BottomNavAccentColor,
  BottomNavBadgeType 
} from '../../types';
import { initialBottomNavbarConfig } from '../../data/initialData';
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
  ShoppingBag, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Check, 
  Sliders, 
  Layers, 
  MoveUp, 
  MoveDown,
  LayoutTemplate,
  Smartphone,
  Sparkle,
  Palette,
  Bell,
  PanelBottom,
  CheckCircle2,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import { formatPrice } from '../../utils/currency';

const ICON_OPTIONS: Array<{ name: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { name: 'Flame', label: 'Flame (Heritage)', icon: Flame },
  { name: 'Wine', label: 'Wine / Spirits Bottle', icon: Wine },
  { name: 'Crown', label: 'Crown (Allocations)', icon: Crown },
  { name: 'ShoppingBag', label: 'Shopping Bag (Cask Cart)', icon: ShoppingBag },
  { name: 'User', label: 'Customer Account / Vault', icon: User },
  { name: 'Building2', label: 'Distillery Bondhouse', icon: Building2 },
  { name: 'BookOpen', label: 'Tasting Journal Book', icon: BookOpen },
  { name: 'Sparkles', label: 'Sparkles / Exclusive', icon: Sparkles },
  { name: 'ShieldCheck', label: 'Shield (Bonded & Certified)', icon: ShieldCheck },
  { name: 'Compass', label: 'Compass (Highland Terroir)', icon: Compass },
  { name: 'GlassWater', label: 'Glass / Glencairn', icon: GlassWater },
  { name: 'Search', label: 'Search Spirits', icon: Search }
];

const AVAILABLE_TABS: { value: AppTab | 'cart'; label: string }[] = [
  { value: 'home', label: 'Home Page' },
  { value: 'products', label: 'Spirits Vault Catalog' },
  { value: 'allocations', label: 'Rare Allocations & Ballots' },
  { value: 'cart', label: 'Cart Drawer (Trigger Drawer)' },
  { value: 'account', label: 'Customer Account / Cellar' },
  { value: 'about', label: 'Our Story & Distillery' },
  { value: 'blog', label: 'Tasting Journal & Mixology' },
  { value: 'checkout', label: 'Checkout & Orders' }
];

const DESIGN_PRESETS: Array<{
  id: BottomNavDesignStyle;
  label: string;
  desc: string;
  previewBg: string;
}> = [
  { 
    id: 'floating_island', 
    label: 'Floating Island Pill', 
    desc: 'Suspended pill dock with rounded corners and elevated ambient shadow.',
    previewBg: 'bg-stone-900/90 border-amber-500/40'
  },
  { 
    id: 'full_width_dock', 
    label: 'Full-Width Bonded Dock', 
    desc: 'Flush edge-to-edge classic bar with subtle top highlight.',
    previewBg: 'bg-stone-950 border-stone-800'
  },
  { 
    id: 'glass_capsule', 
    label: 'Frosted Glass Capsule', 
    desc: 'High-translucency glassmorphism with dynamic backdrop blur.',
    previewBg: 'bg-stone-900/60 border-stone-700/50 backdrop-blur-md'
  },
  { 
    id: 'minimal_flat', 
    label: 'Minimalist Charcoal', 
    desc: 'Low-profile dark metallic bar with zero distractions.',
    previewBg: 'bg-stone-950/95 border-stone-800/50'
  },
  { 
    id: 'luxury_gold_accent', 
    label: 'Royal Gold Reserve', 
    desc: 'Opulent gold borders and warm amber glow for luxury distilleries.',
    previewBg: 'bg-gradient-to-r from-amber-950/90 via-stone-950 to-amber-950/90 border-amber-500/60'
  }
];

const INDICATOR_STYLES: Array<{
  id: BottomNavActiveIndicator;
  label: string;
  desc: string;
}> = [
  { id: 'top_glow_bar', label: 'Top Glow Bar', desc: 'Glowing amber pill positioned at top edge of the active tab' },
  { id: 'subtle_dot', label: 'Subtle Dot', desc: 'Minimal glowing dot positioned below the icon' },
  { id: 'icon_pill_bg', label: 'Icon Pill Highlight', desc: 'Glowing rounded container wrapping the active icon' },
  { id: 'full_tab_highlight', label: 'Full Tab Background', desc: 'Soft tinted ambient background filling the active tab column' },
  { id: 'pulsing_beacon', label: 'Pulsing Aura', desc: 'Subtle rhythmic breathing pulse around active icon' }
];

const ACCENT_COLORS: Array<{
  id: BottomNavAccentColor;
  label: string;
  colorHex: string;
  borderClass: string;
  textClass: string;
}> = [
  { id: 'amber', label: 'Speyside Amber Gold', colorHex: '#f59e0b', borderClass: 'border-amber-500', textClass: 'text-amber-400' },
  { id: 'copper', label: 'Stillhouse Copper', colorHex: '#ea580c', borderClass: 'border-orange-500', textClass: 'text-orange-400' },
  { id: 'emerald', label: 'Highland Peat Emerald', colorHex: '#10b981', borderClass: 'border-emerald-500', textClass: 'text-emerald-400' },
  { id: 'ruby', label: 'Port Cask Ruby', colorHex: '#e11d48', borderClass: 'border-rose-500', textClass: 'text-rose-400' },
  { id: 'gold', label: 'Royal 24K Gold', colorHex: '#fbbf24', borderClass: 'border-yellow-400', textClass: 'text-yellow-300' },
  { id: 'silver', label: 'Platinum Distiller', colorHex: '#e2e8f0', borderClass: 'border-slate-300', textClass: 'text-slate-200' }
];

export const BottomNavCustomizer: React.FC = () => {
  const { bottomNavbarConfig, updateBottomNavbarConfig, adminSettings } = useStore();
  const [formData, setFormData] = useState<BottomNavbarCustomizationConfig>(() => 
    normalizeBottomNavbarConfig(bottomNavbarConfig || initialBottomNavbarConfig)
  );
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<string>('home');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (bottomNavbarConfig) {
      setFormData(normalizeBottomNavbarConfig(bottomNavbarConfig));
    }
  }, [bottomNavbarConfig]);

  const handleSave = () => {
    updateBottomNavbarConfig(formData);
    setSaveStatus('Bottom Navigation configuration saved to Google Cloud Firestore!');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleReset = () => {
    if (confirm('Reset bottom navigation bar configuration to factory distillery defaults?')) {
      const normalized = normalizeBottomNavbarConfig(initialBottomNavbarConfig);
      setFormData(normalized);
      updateBottomNavbarConfig(normalized);
      setSaveStatus('Reset to default bottom navigation settings.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const addItem = () => {
    const newItem: BottomNavItem = {
      id: `bn-${Date.now()}`,
      label: 'New Link',
      tab: 'products',
      iconName: 'Wine',
      visible: true,
      badgeType: 'none',
      badgeColor: 'amber',
      isCenterAction: false
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setEditingItemId(newItem.id);
  };

  const removeItem = (id: string) => {
    if (formData.items.length <= 2) {
      alert('The bottom navigation bar requires at least 2 items.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    if (editingItemId === id) setEditingItemId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.items.length) return;

    const updated = [...formData.items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setFormData(prev => ({ ...prev, items: updated }));
  };

  const updateItem = (id: string, partial: Partial<BottomNavItem>) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...partial } : item)
    }));
  };

  const getIconComponent = (iconName: string) => {
    const found = ICON_OPTIONS.find(i => i.name === iconName);
    return found ? found.icon : Flame;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PanelBottom className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                Bottom Navigation Bar CMS
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Live Mobile UI
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Customize layout styles, floating dock appearance, icon buttons, badges, and responsive visibility.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveStatus && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{saveStatus}</span>
        </div>
      )}

      {/* 2-Column Main Workspace: Controls (Left) & Real-Time Phone Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: General & Display Options */}
          <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif text-base font-bold text-stone-100">
                  Display & Behavior Rules
                </h4>
              </div>
              <span className="text-[11px] text-amber-400 font-mono">
                {formData.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Enable Toggle */}
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 text-amber-500 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">
                      Enable Bottom Navigation Bar
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Show mobile navigation bar across customer views.
                    </span>
                  </div>
                </label>
              </div>

              {/* Visibility Mode */}
              <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                <label className="text-xs font-bold text-stone-200 block">
                  Screen Visibility Mode
                </label>
                <select
                  value={formData.visibilityMode}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibilityMode: e.target.value as any }))}
                  className="w-full p-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value="mobile_only">Mobile Only (&lt; 768px - Recommended)</option>
                  <option value="mobile_and_tablet">Mobile & Tablet (&lt; 1024px)</option>
                  <option value="always">Always Visible (All Screen Sizes)</option>
                </select>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2.5 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showLabels}
                  onChange={(e) => setFormData(prev => ({ ...prev, showLabels: e.target.checked }))}
                  className="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700"
                />
                <span className="text-xs font-medium text-stone-300">Show Text Labels below Icons</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showMiniCartBar}
                  onChange={(e) => setFormData(prev => ({ ...prev, showMiniCartBar: e.target.checked }))}
                  className="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700"
                />
                <span className="text-xs font-medium text-stone-300">Show Floating Mini Cart Bar</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showAllocationsLivePill}
                  onChange={(e) => setFormData(prev => ({ ...prev, showAllocationsLivePill: e.target.checked }))}
                  className="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700"
                />
                <span className="text-xs font-medium text-stone-300">Show Live Status on Allocations</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableHapticGlow}
                  onChange={(e) => setFormData(prev => ({ ...prev, enableHapticGlow: e.target.checked }))}
                  className="w-4 h-4 text-amber-500 rounded bg-stone-900 border-stone-700"
                />
                <span className="text-xs font-medium text-stone-300">Enable Touch Feedback / Glow</span>
              </label>
            </div>
          </div>

          {/* Section 2: Visual Style & Design Presets */}
          <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif text-base font-bold text-stone-100">
                  Visual Design & Styling Presets
                </h4>
              </div>
            </div>

            {/* Design Style Card Picker */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-2">
                Bar Architecture & Design Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DESIGN_PRESETS.map((preset) => {
                  const isSelected = formData.designStyle === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, designStyle: preset.id }))}
                      className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 text-stone-100 shadow-md' 
                          : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                          {preset.label}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 leading-normal">
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color & Active Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Accent Color Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ACCENT_COLORS.map((col) => {
                    const isSelected = formData.accentColor === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, accentColor: col.id }))}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected 
                            ? 'bg-stone-950 border-amber-500 text-white ring-1 ring-amber-500/50' 
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: col.colorHex }}
                        />
                        <span className="text-[10px] font-medium truncate w-full">
                          {col.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Active Tab Indicator Effect
                </label>
                <select
                  value={formData.activeIndicatorStyle}
                  onChange={(e) => setFormData(prev => ({ ...prev, activeIndicatorStyle: e.target.value as any }))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                >
                  {INDICATOR_STYLES.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.label} ({ind.desc.split(' ')[0]}...)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  {INDICATOR_STYLES.find(i => i.id === formData.activeIndicatorStyle)?.desc}
                </p>
              </div>
            </div>

            {/* Edge Margins & Blur Fine-Tuning */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">
                  Floating Margin
                </label>
                <select
                  value={formData.floatingMargin || 'medium'}
                  onChange={(e) => setFormData(prev => ({ ...prev, floatingMargin: e.target.value as any }))}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (8px)</option>
                  <option value="medium">Medium (12px)</option>
                  <option value="large">Large (16px)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">
                  Backdrop Blur
                </label>
                <select
                  value={formData.backdropBlur || 'xl'}
                  onChange={(e) => setFormData(prev => ({ ...prev, backdropBlur: e.target.value as any }))}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                >
                  <option value="none">None</option>
                  <option value="sm">Subtle (sm)</option>
                  <option value="md">Medium (md)</option>
                  <option value="lg">Heavy (lg)</option>
                  <option value="xl">Ultra Frosted (xl)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">
                  Border Accent
                </label>
                <select
                  value={formData.borderStyle || 'gold_glow'}
                  onChange={(e) => setFormData(prev => ({ ...prev, borderStyle: e.target.value as any }))}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                >
                  <option value="none">No Border</option>
                  <option value="subtle">Subtle Dark Border</option>
                  <option value="gold_glow">Warm Amber Glow</option>
                  <option value="accent_border">Solid Theme Border</option>
                  <option value="double_gold">Dual Luxury Edge</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Navigation Tabs & Items List */}
          <div className="p-5 sm:p-6 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Navigation Items & Tab Actions
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    {formData.items.length} Items
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Reorder, rename, assign custom Lucide icons, configure live badges, or set a Center Action button.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tab Item</span>
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {formData.items.map((item, index) => {
                const IconComponent = getIconComponent(item.iconName);
                const isFirst = index === 0;
                const isLast = index === formData.items.length - 1;
                const isEditing = editingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all ${
                      item.visible 
                        ? 'bg-stone-950/80 border-stone-800' 
                        : 'bg-stone-950/40 border-stone-900 opacity-60'
                    } ${isEditing ? 'ring-1 ring-amber-500 border-amber-500/60' : ''}`}
                  >
                    {/* Collapsed Item Summary Bar */}
                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Move Up/Down Controls */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => moveItem(index, 'up')}
                            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-200 disabled:opacity-20 rounded transition"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => moveItem(index, 'down')}
                            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-200 disabled:opacity-20 rounded transition"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Icon & Label */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          item.isCenterAction 
                            ? 'bg-amber-500 text-stone-950 shadow-md' 
                            : 'bg-stone-900 border border-stone-800 text-amber-400'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-100 truncate">
                              {item.label}
                            </span>
                            {item.isCenterAction && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-bold uppercase">
                                Center Action
                              </span>
                            )}
                            {item.badgeType !== 'none' && (
                              <span className="px-1.5 py-0.2 bg-stone-800 text-stone-300 rounded text-[9px] font-mono">
                                Badge: {item.badgeType}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-500 block truncate">
                            Target Tab: <span className="text-stone-400 font-mono">{item.tab}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, { visible: !item.visible })}
                          title={item.visible ? 'Hide from navigation' : 'Show in navigation'}
                          className={`p-1.5 rounded-lg border transition ${
                            item.visible 
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                              : 'bg-stone-900 border-stone-800 text-stone-500'
                          }`}
                        >
                          {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingItemId(isEditing ? null : item.id)}
                          className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 rounded-lg text-xs font-semibold transition"
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          title="Delete Tab Item"
                          className="p-1.5 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Edit Form */}
                    {isEditing && (
                      <div className="p-4 border-t border-stone-800/80 bg-stone-900/40 rounded-b-2xl space-y-4 text-xs animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-stone-400 mb-1 font-bold">Display Label</label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateItem(item.id, { label: e.target.value })}
                              className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1 font-bold">Target App Tab</label>
                            <select
                              value={item.tab}
                              onChange={(e) => updateItem(item.id, { tab: e.target.value as any })}
                              className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                            >
                              {AVAILABLE_TABS.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1 font-bold">Icon</label>
                            <select
                              value={item.iconName}
                              onChange={(e) => updateItem(item.id, { iconName: e.target.value })}
                              className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                            >
                              {ICON_OPTIONS.map(ic => (
                                <option key={ic.name} value={ic.name}>{ic.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Badges & Center Action */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-800/60">
                          <div>
                            <label className="block text-stone-400 mb-1 font-bold">Badge Type</label>
                            <select
                              value={item.badgeType || 'none'}
                              onChange={(e) => updateItem(item.id, { badgeType: e.target.value as any })}
                              className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                            >
                              <option value="none">None (No Badge)</option>
                              <option value="cart_count">Live Cart Item Count</option>
                              <option value="live">Live Status ("Live")</option>
                              <option value="text">Custom Text</option>
                              <option value="numeric">Custom Number</option>
                              <option value="dot">Ambient Dot</option>
                            </select>
                          </div>

                          {item.badgeType === 'text' && (
                            <div>
                              <label className="block text-stone-400 mb-1 font-bold">Custom Badge Text</label>
                              <input
                                type="text"
                                value={item.badgeText || ''}
                                onChange={(e) => updateItem(item.id, { badgeText: e.target.value })}
                                placeholder="e.g. HOT, NEW"
                                className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-stone-400 mb-1 font-bold">Badge Color Tone</label>
                            <select
                              value={item.badgeColor || 'amber'}
                              onChange={(e) => updateItem(item.id, { badgeColor: e.target.value })}
                              className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                            >
                              <option value="amber">Amber Gold (Default)</option>
                              <option value="rose">Rose Red (Alert)</option>
                              <option value="emerald">Emerald Green (Live)</option>
                              <option value="blue">Highland Blue (Notice)</option>
                            </select>
                          </div>
                        </div>

                        {/* Center Action Toggle */}
                        <div className="pt-2">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isCenterAction || false}
                              onChange={(e) => updateItem(item.id, { isCenterAction: e.target.checked })}
                              className="w-4 h-4 text-amber-500 rounded bg-stone-950 border-stone-700"
                            />
                            <div>
                              <span className="text-xs font-bold text-stone-200">
                                Style as Elevated Center Hero Button
                              </span>
                              <span className="text-[10px] text-stone-400 block">
                                Highlights this tab with a prominent elevated circular badge (ideal for Allocations or Cart).
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Viewport & Design Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="p-5 bg-stone-900/95 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif text-base font-bold text-stone-100">
                  Live Interactive Mobile Preview
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Responsive View
              </span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Test interactions in real-time. Tap tabs below to preview active indicator effects, glowing badges, floating styles, and cart notifications.
            </p>

            {/* Mobile Device Frame Mockup */}
            <div className="relative mx-auto w-full max-w-sm rounded-[2.5rem] bg-stone-950 border-[6px] border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between aspect-[9/16] min-h-[520px]">
              
              {/* Phone Speaker & Camera Notch */}
              <div className="w-full flex items-center justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-24 h-4 bg-stone-900 rounded-full flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
                  <div className="w-8 h-1.5 rounded-full bg-stone-950" />
                </div>
              </div>

              {/* Mock App Header in Preview */}
              <div className="px-4 py-2 border-b border-stone-900 bg-stone-950/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="font-serif text-xs font-bold tracking-wider text-stone-200">
                    ZOOKAS UNITY
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-amber-300 font-mono">Vault Open</span>
                </div>
              </div>

              {/* Mock Viewport Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
                  {previewTab === 'home' && <Flame className="w-6 h-6" />}
                  {previewTab === 'products' && <Wine className="w-6 h-6" />}
                  {previewTab === 'allocations' && <Crown className="w-6 h-6" />}
                  {previewTab === 'cart' && <ShoppingBag className="w-6 h-6" />}
                  {previewTab === 'account' && <User className="w-6 h-6" />}
                  {previewTab === 'about' && <Building2 className="w-6 h-6" />}
                  {previewTab === 'blog' && <BookOpen className="w-6 h-6" />}
                  {previewTab === 'checkout' && <ShieldCheck className="w-6 h-6" />}
                </div>
                
                <h5 className="font-serif text-base font-bold text-stone-100 capitalize">
                  Active Screen: {previewTab}
                </h5>
                <p className="text-[11px] text-stone-400 max-w-[200px] leading-relaxed">
                  Tap any navigation item on the bottom bar below to test the active transition states.
                </p>

                <div className="px-3 py-1.5 bg-stone-900/80 rounded-xl border border-stone-800 text-[10px] text-amber-400/90 font-mono mt-2">
                  Design: <span className="text-stone-200">{formData.designStyle}</span>
                </div>
              </div>

              {/* Bottom Nav Mock Preview Container */}
              <div className={`shrink-0 z-10 w-full ${
                formData.floatingMargin === 'none' ? 'p-0 pb-2' :
                formData.floatingMargin === 'small' ? 'px-2 pb-3' :
                formData.floatingMargin === 'large' ? 'px-4 pb-4' : 'px-3 pb-3'
              }`}>
                {/* Optional Floating Mini Cart Bar */}
                {formData.showMiniCartBar && (
                  <div className="mb-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-950/90 border border-amber-500/40 rounded-xl flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wide">
                        3 Bottles in Cask Cart
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                      <span>{formatPrice(43500, adminSettings.currencySymbol)}</span>
                      <span className="text-[9px] text-amber-400/80">›</span>
                    </div>
                  </div>
                )}

                {/* Bottom Bar Shell */}
                <div 
                  className={`relative transition-all duration-300 ${
                    formData.designStyle === 'floating_island' 
                      ? 'rounded-2xl bg-stone-950/95 border border-amber-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl' :
                    formData.designStyle === 'glass_capsule'
                      ? 'rounded-3xl bg-stone-900/70 border border-stone-700/60 shadow-2xl backdrop-blur-2xl' :
                    formData.designStyle === 'luxury_gold_accent'
                      ? 'rounded-2xl bg-gradient-to-r from-amber-950/95 via-stone-950 to-amber-950/95 border border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                    formData.designStyle === 'minimal_flat'
                      ? 'bg-stone-950 border-t border-stone-800/80' :
                      'bg-stone-950/95 border-t border-stone-800 shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-around px-1 py-1.5">
                    {formData.items.filter(i => i.visible).map((item) => {
                      const Icon = getIconComponent(item.iconName);
                      const isActive = previewTab === item.tab;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreviewTab(item.tab)}
                          className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer group ${
                            item.isCenterAction ? 'scale-105 -mt-2' : ''
                          } ${
                            isActive 
                              ? 'text-amber-400 font-bold' 
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {/* Active Indicator Top Glow Bar */}
                          {isActive && formData.activeIndicatorStyle === 'top_glow_bar' && (
                            <span className="absolute -top-1 w-5 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]" />
                          )}

                          {/* Icon Container with Badge */}
                          <div className="relative flex items-center justify-center">
                            <div className={`p-1 rounded-xl transition-all ${
                              item.isCenterAction
                                ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 p-2 shadow-lg shadow-amber-500/30' :
                              isActive && formData.activeIndicatorStyle === 'icon_pill_bg'
                                ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' :
                              isActive
                                ? 'text-amber-400' : 'text-stone-400'
                            }`}>
                              <Icon className={item.isCenterAction ? "w-4 h-4" : "w-4 h-4"} />
                            </div>

                            {/* Badge */}
                            {item.badgeType !== 'none' && (
                              <span className={`absolute -top-1 -right-2 px-1 py-0.2 min-w-[14px] h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center shadow-md border ${
                                item.badgeColor === 'rose'
                                  ? 'bg-rose-600 text-white border-rose-400' :
                                item.badgeColor === 'emerald'
                                  ? 'bg-emerald-600 text-white border-emerald-400' :
                                item.badgeColor === 'blue'
                                  ? 'bg-blue-600 text-white border-blue-400' :
                                  'bg-amber-500 text-stone-950 border-amber-400'
                              }`}>
                                {item.badgeType === 'live' ? 'Live' :
                                 item.badgeType === 'cart_count' ? '3' :
                                 item.badgeType === 'text' ? (item.badgeText || '!') :
                                 item.badgeType === 'dot' ? '•' : '1'}
                              </span>
                            )}
                          </div>

                          {/* Text Label */}
                          {formData.showLabels && (
                            <span className={`text-[9px] mt-0.5 whitespace-nowrap transition-colors ${
                              item.isCenterAction ? 'font-bold text-amber-300' :
                              isActive ? 'font-bold text-amber-400' : 'text-stone-400'
                            }`}>
                              {item.label}
                            </span>
                          )}

                          {/* Subtle Bottom Dot Indicator */}
                          {isActive && formData.activeIndicatorStyle === 'subtle_dot' && (
                            <span className="w-1 h-1 bg-amber-400 rounded-full mt-0.5 shadow-[0_0_4px_#f59e0b]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom iPhone Home Indicator Pill */}
              <div className="w-full flex items-center justify-center pb-1.5 shrink-0">
                <div className="w-28 h-1 bg-stone-700 rounded-full" />
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Distillery Design Best Practice</span>
              </div>
              <p>
                The <strong>Floating Island Pill</strong> with <strong>Live Cart Bar</strong> is tuned for white-glove spirit collectors, allowing seamless transitions between the rare barrel vault and allocation drawings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
