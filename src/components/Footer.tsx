import React, { useState } from 'react';
import { useStore, AppTab } from '../context/StoreContext';
import { 
  Flame, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Globe
} from 'lucide-react';

const getSocialIcon = (iconName?: string, platform?: string) => {
  const p = (iconName || platform || '').toLowerCase();
  if (p.includes('insta')) return Instagram;
  if (p.includes('face')) return Facebook;
  if (p.includes('twit') || p.includes('x')) return Twitter;
  if (p.includes('yout')) return Youtube;
  if (p.includes('link')) return Linkedin;
  return Globe;
};

export const Footer: React.FC = () => {
  const { adminSettings, aboutContent, footerConfig, setActiveTab } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const effectiveFooter = footerConfig || {
    brandName: adminSettings.brandName,
    brandDescription: 'Artisanal small-batch single malt whiskies, cask-strength bourbons, alpine gins, and aged rums crafted with unhurried devotion to copper pot distillation.',
    showNewsletter: true,
    newsletterHeading: 'Receive First-Access to Limited Single Cask Allocations',
    newsletterSubheading: 'Join our private membership ledger to receive advance tasting notes, invitations to master distiller classes, and instant 10% off your inaugural order.',
    newsletterButtonText: 'Subscribe 10% Off',
    newsletterPromoCode: 'UNITY10',
    newsletterDiscountText: '10% off your inaugural order',
    columns: [
      {
        id: 'col-1',
        title: 'Spirits Vault',
        links: [
          { id: 'link-1', label: 'Single Malt Whiskies', tab: 'products' },
          { id: 'link-2', label: 'Cask Strength Bourbons', tab: 'products' },
          { id: 'link-3', label: 'Botanical Vapour Gins', tab: 'products' },
          { id: 'link-4', label: 'French Cognac Finish Rums', tab: 'products' },
          { id: 'link-5', label: 'Rare Vintage Reserves (25-Yr)', tab: 'products' }
        ]
      },
      {
        id: 'col-2',
        title: 'Distillery & Lore',
        links: [
          { id: 'link-6', label: 'Copper Pot Alchemy', tab: 'about' },
          { id: 'link-7', label: 'Meet the Master Distillers', tab: 'about' },
          { id: 'link-8', label: 'Tasting Notes & Mixology', tab: 'blog' },
          { id: 'link-9', label: 'Unity Cask Club Rewards', tab: 'account' },
          { id: 'link-10', label: 'Distillery Admin Portal', tab: 'admin', isExternal: false }
        ]
      }
    ],
    showContactInfo: true,
    contactAddress: aboutContent.distilleryAddress || '1788 High Glen Road, Speyside Valley, Highlands AB38 9RX',
    contactHours: aboutContent.distilleryHours || 'Tasting Room: Wed-Sun 11:00 AM – 8:00 PM EST',
    contactPhone: adminSettings.contactPhone || '+1 (800) 555-UNITY',
    contactEmail: adminSettings.contactEmail || 'vault@zookasunityspirits.com',
    showComplianceBadges: true,
    complianceBadges: [
      '21+ Legal Compliance',
      '256-Bit SSL Encrypted'
    ],
    copyrightText: `© ${new Date().getFullYear()} ${adminSettings.brandName}. All Rights Reserved. Please enjoy our spirits responsibly. Adult signature required upon delivery.`,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com', iconName: 'Instagram', visible: true },
      { platform: 'Facebook', url: 'https://facebook.com', iconName: 'Facebook', visible: true },
      { platform: 'Twitter', url: 'https://twitter.com', iconName: 'Twitter', visible: true },
      { platform: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube', visible: true }
    ]
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim().includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const handleLinkClick = (tab?: AppTab, url?: string, isExternal?: boolean) => {
    if (url && isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (tab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-300">
      {/* Newsletter & Club Invite */}
      {effectiveFooter.showNewsletter !== false && (
        <div className="border-b border-stone-800/80 bg-gradient-to-b from-stone-900/50 to-stone-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 border border-amber-700/30 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  The Distiller’s Private Circle
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {effectiveFooter.newsletterHeading || 'Receive First-Access to Limited Single Cask Allocations'}
                </h3>
                <p className="mt-2 text-sm text-stone-400 max-w-xl">
                  {effectiveFooter.newsletterSubheading || 'Join our private membership ledger to receive advance tasting notes, invitations to master distiller classes, and instant 10% off your inaugural order.'}
                </p>
              </div>

              <div className="lg:col-span-5">
                {subscribed ? (
                  <div className="flex items-center gap-3 p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Welcome to the Fellowship!</p>
                      <p className="text-xs text-amber-200/80">
                        Use code <strong className="text-white bg-amber-900/60 px-1.5 py-0.5 rounded">{effectiveFooter.newsletterPromoCode || 'UNITY10'}</strong> at checkout for {effectiveFooter.newsletterDiscountText || '10% off'}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your private email..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 px-4 py-3 text-sm bg-stone-900 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer"
                    >
                      {effectiveFooter.newsletterButtonText || 'Subscribe 10% Off'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links & Distillery Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center border border-amber-400/40">
                <Flame className="w-5 h-5 text-stone-950" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-stone-100 uppercase">
                {effectiveFooter.brandName || adminSettings.brandName}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {effectiveFooter.brandDescription || 'Artisanal small-batch single malt whiskies, cask-strength bourbons, alpine gins, and aged rums crafted with unhurried devotion to copper pot distillation.'}
            </p>

            {/* Compliance Badges */}
            {effectiveFooter.showComplianceBadges !== false && (effectiveFooter.complianceBadges || []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {effectiveFooter.complianceBadges.map((badge, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Social Icons */}
            {(effectiveFooter.socialLinks || []).filter(s => s.visible !== false).length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {effectiveFooter.socialLinks.filter(s => s.visible !== false).map((social, idx) => {
                  const SIcon = getSocialIcon(social.iconName, social.platform);
                  return (
                    <a
                      key={idx}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-amber-950/30 text-stone-400 hover:text-amber-400 flex items-center justify-center transition"
                      title={social.platform}
                    >
                      <SIcon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Navigation Columns */}
          {(effectiveFooter.columns || []).map((col) => (
            <div key={col.id || col.title}>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-200 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                {(col.links || []).map((link) => (
                  <li key={link.id || link.label}>
                    <button 
                      onClick={() => handleLinkClick(link.tab, link.url, link.isExternal)} 
                      className="hover:text-amber-400 transition flex items-center gap-1 cursor-pointer text-left"
                    >
                      <span>{link.label}</span>
                      {link.isExternal && <ExternalLink className="w-3 h-3 text-stone-500" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Distillery Location & Hours */}
          {effectiveFooter.showContactInfo !== false && (
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-200 mb-4">
                Distillery & Bond
              </h4>
              <ul className="space-y-3 text-xs text-stone-400">
                {effectiveFooter.contactAddress && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{effectiveFooter.contactAddress}</span>
                  </li>
                )}
                {effectiveFooter.contactHours && (
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{effectiveFooter.contactHours}</span>
                  </li>
                )}
                {effectiveFooter.contactPhone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{effectiveFooter.contactPhone}</span>
                  </li>
                )}
                {effectiveFooter.contactEmail && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{effectiveFooter.contactEmail}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Legal Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="text-center md:text-left">
            {effectiveFooter.copyrightText || `© ${new Date().getFullYear()} ${adminSettings.brandName}. All Rights Reserved. Please enjoy our spirits responsibly. Adult signature required upon delivery.`}
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>21+ Verification Mandated</span>
            <span>•</span>
            <span>Direct-to-Consumer Craft Shipping</span>
            <span>•</span>
            <span>Real-time Cask Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
