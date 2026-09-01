import React, { useState, useEffect } from 'react';
import { useStore, AppTab, normalizeFooterConfig } from '../../context/StoreContext';
import { FooterCustomizationConfig, FooterColumn, FooterLink } from '../../types';
import { initialFooterConfig } from '../../data/initialData';
import { 
  Flame, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check, 
  Sliders, 
  Layers, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  PanelBottom
} from 'lucide-react';

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

export const FooterCustomizer: React.FC = () => {
  const { footerConfig, updateFooterConfig, adminSettings, aboutContent } = useStore();
  const [formData, setFormData] = useState<FooterCustomizationConfig>(() => normalizeFooterConfig(footerConfig || initialFooterConfig));
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (footerConfig) {
      setFormData(normalizeFooterConfig(footerConfig));
    }
  }, [footerConfig]);

  const handleSave = () => {
    updateFooterConfig(formData);
    setSaveStatus('Footer configuration saved to Google Cloud Firestore!');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleReset = () => {
    if (confirm('Reset footer & newsletter configurations to distillery factory defaults?')) {
      const normalized = normalizeFooterConfig(initialFooterConfig);
      setFormData(normalized);
      updateFooterConfig(normalized);
      setSaveStatus('Reset to default footer configuration.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Column management
  const addColumn = () => {
    const newCol: FooterColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      visible: true,
      links: [
        { id: `link-${Date.now()}-1`, label: 'Custom Spirits Link', tab: 'products' }
      ]
    };
    setFormData(prev => ({
      ...prev,
      columns: [...(prev.columns || []), newCol]
    }));
  };

  const toggleColumnVisibility = (colIndex: number) => {
    setFormData(prev => {
      const nextCols = [...(prev.columns || [])];
      if (nextCols[colIndex]) {
        const currentVis = nextCols[colIndex].visible !== false;
        nextCols[colIndex] = {
          ...nextCols[colIndex],
          visible: !currentVis
        };
      }
      return { ...prev, columns: nextCols };
    });
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const cols = formData.columns || [];
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === cols.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setFormData(prev => {
      const nextCols = [...(prev.columns || [])];
      const temp = nextCols[index];
      nextCols[index] = nextCols[targetIndex];
      nextCols[targetIndex] = temp;
      return { ...prev, columns: nextCols };
    });
  };

  const removeColumn = (colIndex: number) => {
    setFormData(prev => ({
      ...prev,
      columns: (prev.columns || []).filter((_, i) => i !== colIndex)
    }));
  };

  const updateColumnTitle = (colIndex: number, title: string) => {
    setFormData(prev => {
      const nextCols = [...(prev.columns || [])];
      if (nextCols[colIndex]) {
        nextCols[colIndex] = { ...nextCols[colIndex], title };
      }
      return { ...prev, columns: nextCols };
    });
  };

  const addLinkToColumn = (colIndex: number) => {
    const newLink: FooterLink = {
      id: `link-${Date.now()}`,
      label: 'New Navigation Link',
      tab: 'products'
    };
    setFormData(prev => {
      const nextCols = [...(prev.columns || [])];
      if (nextCols[colIndex]) {
        nextCols[colIndex] = {
          ...nextCols[colIndex],
          links: [...(nextCols[colIndex].links || []), newLink]
        };
      }
      return { ...prev, columns: nextCols };
    });
  };

  const updateLinkInColumn = (colIndex: number, linkIndex: number, updates: Partial<FooterLink>) => {
    setFormData(prev => {
      const nextCols = [...(prev.columns || [])];
      if (nextCols[colIndex]) {
        const nextLinks = [...(nextCols[colIndex].links || [])];
        if (nextLinks[linkIndex]) {
          nextLinks[linkIndex] = { ...nextLinks[linkIndex], ...updates };
          nextCols[colIndex] = { ...nextCols[colIndex], links: nextLinks };
        }
      }
      return { ...prev, columns: nextCols };
    });
  };

  const removeLinkFromColumn = (colIndex: number, linkIndex: number) => {
    setFormData(prev => {
      const nextCols = [...(prev.columns || [])];
      if (nextCols[colIndex]) {
        nextCols[colIndex] = {
          ...nextCols[colIndex],
          links: (nextCols[colIndex].links || []).filter((_, i) => i !== linkIndex)
        };
      }
      return { ...prev, columns: nextCols };
    });
  };

  // Compliance badges management
  const addComplianceBadge = () => {
    setFormData(prev => ({
      ...prev,
      complianceBadges: [...(prev.complianceBadges || []), 'Direct Distillery Verification']
    }));
  };

  const updateComplianceBadge = (index: number, text: string) => {
    setFormData(prev => {
      const next = [...(prev.complianceBadges || [])];
      next[index] = text;
      return { ...prev, complianceBadges: next };
    });
  };

  const removeComplianceBadge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      complianceBadges: (prev.complianceBadges || []).filter((_, i) => i !== index)
    }));
  };

  // Social Links management
  const updateSocialLink = (index: number, updates: { url?: string; visible?: boolean }) => {
    setFormData(prev => {
      const nextSocial = [...(prev.socialLinks || [])];
      if (nextSocial[index]) {
        nextSocial[index] = { ...nextSocial[index], ...updates };
      }
      return { ...prev, socialLinks: nextSocial };
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-amber-400">
            <PanelBottom className="w-4 h-4" />
            <span>Footer & Newsletter CMS</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100 mt-1">
            Global Footer & Newsletter Customizer
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl">
            Configure the newsletter membership ledger, footer link columns, distillery hours, contact coordinates, compliance badges, and social media channels.
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
            <span>Live Footer Preview</span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">Simulated Render</span>
        </div>

        <div className="border border-stone-800 rounded-xl overflow-hidden shadow-2xl bg-stone-950 text-xs text-stone-300">
          {/* Simulated Newsletter */}
          {formData.showNewsletter !== false && (
            <div className="p-6 bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border-b border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  The Distiller’s Private Circle
                </span>
                <h4 className="font-serif font-bold text-stone-100 text-sm mt-0.5">
                  {formData.newsletterHeading || 'Receive First-Access to Limited Single Cask Allocations'}
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {formData.newsletterSubheading || 'Join our private membership ledger to receive advance tasting notes.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-stone-900 border border-stone-700 text-stone-500 rounded-lg text-[11px]">
                  user@cellar.com
                </span>
                <span className="px-4 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-lg text-[11px]">
                  {formData.newsletterButtonText || 'Subscribe 10% Off'}
                </span>
              </div>
            </div>
          )}

          {/* Simulated Columns Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-stone-950">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <strong className="font-cinzel text-stone-100 font-bold">{formData.brandName || adminSettings.brandName}</strong>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-3">
                {formData.brandDescription}
              </p>
            </div>

            {(formData.columns || []).filter(col => col.visible !== false).map((col) => (
              <div key={col.id} className="space-y-1.5">
                <h5 className="font-serif font-bold text-stone-200 text-xs uppercase tracking-wider">{col.title}</h5>
                <ul className="space-y-1 text-[11px] text-stone-400">
                  {(col.links || []).map(l => (
                    <li key={l.id} className="hover:text-amber-400">
                      {l.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {(formData.columns || []).filter(col => col.visible !== false).length === 0 && (
              <div className="md:col-span-2 p-4 bg-stone-900/60 border border-dashed border-stone-800 rounded-xl text-center text-xs text-stone-500 italic">
                All navigation columns are currently disabled/hidden.
              </div>
            )}

            {formData.showContactInfo && (
              <div className="space-y-1.5">
                <h5 className="font-serif font-bold text-stone-200 text-xs uppercase tracking-wider">Distillery Coordinates</h5>
                <p className="text-[11px] text-stone-400">{formData.contactAddress}</p>
                <p className="text-[11px] text-amber-400/90">{formData.contactHours}</p>
                <p className="text-[11px] text-stone-300">{formData.contactPhone}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Newsletter & Brand Summary */}
        <div className="space-y-6">
          {/* Card 1: Newsletter & Private Circle */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Newsletter & Membership Club Module</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showNewsletter !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showNewsletter: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.showNewsletter !== false && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Newsletter Main Heading</label>
                  <input
                    type="text"
                    value={formData.newsletterHeading}
                    onChange={(e) => setFormData(prev => ({ ...prev, newsletterHeading: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Receive First-Access to Limited Single Cask Allocations"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Subheading & Perks Description</label>
                  <textarea
                    rows={2}
                    value={formData.newsletterSubheading}
                    onChange={(e) => setFormData(prev => ({ ...prev, newsletterSubheading: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Join our private membership ledger to receive advance tasting notes..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Button CTA Text</label>
                    <input
                      type="text"
                      value={formData.newsletterButtonText}
                      onChange={(e) => setFormData(prev => ({ ...prev, newsletterButtonText: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                      placeholder="Subscribe 10% Off"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Promo Discount Code</label>
                    <input
                      type="text"
                      value={formData.newsletterPromoCode || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, newsletterPromoCode: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs uppercase"
                      placeholder="UNITY10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Discount Perk Text</label>
                    <input
                      type="text"
                      value={formData.newsletterDiscountText || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, newsletterDiscountText: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
                      placeholder="10% off your inaugural order"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Distillery Description & Compliance Badges */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Brand Lore & Trust Badges</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Footer Brand Description</label>
                <textarea
                  rows={3}
                  value={formData.brandDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandDescription: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Artisanal small-batch single malt whiskies..."
                />
              </div>

              {/* Compliance Badges Builder */}
              <div className="pt-2 border-t border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-300">Trust & Compliance Badges</span>
                  <button
                    type="button"
                    onClick={addComplianceBadge}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Badge</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.complianceBadges || []).map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => updateComplianceBadge(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-200"
                        placeholder="e.g. 21+ Legal Compliance"
                      />
                      <button
                        type="button"
                        onClick={() => removeComplianceBadge(idx)}
                        className="p-1.5 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-stone-800 space-y-2">
                <span className="text-xs font-semibold text-stone-300 block">Social Media Channels</span>
                <div className="space-y-2">
                  {(formData.socialLinks || []).map((soc, sIdx) => (
                    <div key={soc.platform} className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center gap-2">
                      <strong className="text-xs text-stone-300 w-20 truncate">{soc.platform}</strong>
                      <input
                        type="url"
                        value={soc.url}
                        onChange={(e) => updateSocialLink(sIdx, { url: e.target.value })}
                        className="flex-1 px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200"
                        placeholder={`https://${soc.platform.toLowerCase()}.com/...`}
                      />
                      <label className="flex items-center gap-1.5 text-[11px] text-stone-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={soc.visible !== false}
                          onChange={(e) => updateSocialLink(sIdx, { visible: e.target.checked })}
                          className="accent-amber-500 rounded"
                        />
                        <span>Show</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Footer Columns Builder & Location Contact */}
        <div className="space-y-6">
          {/* Card 3: Footer Navigation Columns */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Navigation Columns ({(formData.columns || []).length})</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Organize links under custom column categories.
                </p>
              </div>

              <button
                type="button"
                onClick={addColumn}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column</span>
              </button>
            </div>

            <div className="space-y-4">
              {(formData.columns || []).map((col, colIndex) => {
                const isVisible = col.visible !== false;
                return (
                  <div 
                    key={col.id} 
                    className={`p-4 bg-stone-950 border rounded-xl space-y-3 transition ${
                      isVisible 
                        ? 'border-stone-800' 
                        : 'border-stone-800/60 bg-stone-950/60 opacity-85 border-dashed'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        {/* Reorder Buttons */}
                        <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => moveColumn(colIndex, 'up')}
                            disabled={colIndex === 0}
                            className="p-1 text-stone-400 hover:text-amber-400 disabled:opacity-30 disabled:hover:text-stone-400 transition"
                            title="Move column left/up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveColumn(colIndex, 'down')}
                            disabled={colIndex === (formData.columns || []).length - 1}
                            className="p-1 text-stone-400 hover:text-amber-400 disabled:opacity-30 disabled:hover:text-stone-400 transition"
                            title="Move column right/down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          Col #{colIndex + 1}
                        </span>

                        {/* Visibility Status Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isVisible 
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60' 
                            : 'bg-stone-900 text-stone-400 border border-stone-800'
                        }`}>
                          {isVisible ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-stone-500" />}
                          <span>{isVisible ? 'Visible on Store' : 'Disabled (Hidden)'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Enable/Disable Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleColumnVisibility(colIndex)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                            isVisible
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                          }`}
                          title={isVisible ? 'Click to disable column' : 'Click to enable column'}
                        >
                          {isVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Enabled</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeColumn(colIndex)}
                          title="Delete Column"
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {!isVisible && (
                      <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2">
                        <EyeOff className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span>This entire column is <strong>disabled</strong> and will not be displayed on the storefront footer.</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Column Title</label>
                      <input
                        type="text"
                        value={col.title}
                        onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                        className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                        placeholder="Column Heading"
                      />
                    </div>

                    {/* Links in Column */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-semibold">
                        <span>Column Links ({(col.links || []).length})</span>
                        <button
                          type="button"
                          onClick={() => addLinkToColumn(colIndex)}
                          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Link</span>
                        </button>
                      </div>

                      {(col.links || []).map((link, linkIndex) => (
                        <div key={link.id} className="p-2 bg-stone-900/90 rounded-lg border border-stone-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-5">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => updateLinkInColumn(colIndex, linkIndex, { label: e.target.value })}
                              className="w-full px-2.5 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200 focus:border-amber-500 focus:outline-none"
                              placeholder="Link Title"
                            />
                          </div>

                          <div className="sm:col-span-5">
                            <select
                              value={link.tab || 'products'}
                              onChange={(e) => updateLinkInColumn(colIndex, linkIndex, { tab: e.target.value as AppTab })}
                              className="w-full px-2.5 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200 focus:border-amber-500 focus:outline-none"
                            >
                              {AVAILABLE_TABS.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-2 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => removeLinkFromColumn(colIndex, linkIndex)}
                              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                              title="Remove Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: Distillery Coordinates & Legal */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Distillery Coordinates & Legal Notice</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showContactInfo !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, showContactInfo: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.showContactInfo && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={formData.contactAddress || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactAddress: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs"
                    placeholder="1788 High Glen Road, Speyside Valley..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Tasting Hours & Cellar Schedule</label>
                  <input
                    type="text"
                    value={formData.contactHours || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactHours: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs"
                    placeholder="Wed-Sun 11:00 AM – 8:00 PM EST"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs"
                      placeholder="+1 (800) 555-UNITY"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs"
                      placeholder="vault@zookasunityspirits.com"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-stone-800">
              <label className="block text-xs font-semibold text-stone-400 mb-1">Copyright Disclaimer Text</label>
              <textarea
                rows={2}
                value={formData.copyrightText || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, copyrightText: e.target.value }))}
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs"
                placeholder="© 2026 Zookas Unity Spirits. All Rights Reserved..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
