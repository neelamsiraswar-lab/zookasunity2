import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ArrowRight, 
  Globe, 
  Sparkles, 
  Lock, 
  RefreshCw,
  Mail,
  UserCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface GoogleDomainAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryGoogleAuth?: () => void;
  detectedDomain?: string;
  projectId?: string;
  consoleUrl?: string;
}

export const GoogleDomainAuthModal: React.FC<GoogleDomainAuthModalProps> = ({
  isOpen,
  onClose,
  onRetryGoogleAuth,
  detectedDomain,
  projectId = 'commanding-path-sxctm',
  consoleUrl = 'https://console.firebase.google.com/project/commanding-path-sxctm/authentication/settings'
}) => {
  const { loginWithGoogleDirect } = useStore();
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  const [directError, setDirectError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHost = detectedDomain || (typeof window !== 'undefined' ? window.location.hostname : 'zookasunityspirits.in');
  const targetDomain = 'zookasunityspirits.in';
  const wwwTargetDomain = 'www.zookasunityspirits.in';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(text);
    setTimeout(() => setCopiedDomain(null), 2500);
  };

  const handleDirectGoogleLogin = async (email: string, name?: string) => {
    setDirectError(null);
    setIsSubmittingDirect(true);
    try {
      const res = await loginWithGoogleDirect(email, name);
      if (res.success) {
        onClose();
      } else {
        setDirectError(res.error || 'Failed to authenticate patron profile.');
      }
    } catch (e: any) {
      setDirectError(e?.message || 'Unexpected login error.');
    } finally {
      setIsSubmittingDirect(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-stone-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Stripe */}
        <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-stone-800/80 bg-stone-950/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Firebase OAuth Security
                </span>
                <span className="text-xs text-stone-400">Error: auth/unauthorized-domain</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                Authorize <span className="text-amber-400">zookasunityspirits.in</span> for Google Sign-In
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-lg">
                Google blocks OAuth from unlisted web domains for project <code className="text-amber-300 bg-stone-950 px-1.5 py-0.5 rounded font-mono">{projectId}</code>. Add your domain to the authorized list in Firebase to enable popup sign-ins.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 rounded-xl transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: DIRECT FIREBASE LINK & DOMAINS */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
              <div>
                <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Step 1: Open Firebase Auth Settings</span>
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Click below to open the exact settings page in Firebase Console:
                </p>
              </div>

              <a
                href={consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex-shrink-0"
              >
                <span>Open Firebase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* DOMAINS TO ADD */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                Domains to add to "Authorized domains" list:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Primary target domain */}
                <div className="flex items-center justify-between p-3 bg-stone-900 border border-amber-500/40 rounded-xl">
                  <div>
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">Primary Brand Domain</span>
                    <span className="font-mono text-sm text-stone-100 font-bold">{targetDomain}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(targetDomain)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedDomain === targetDomain ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* WWW subdomain */}
                <div className="flex items-center justify-between p-3 bg-stone-900 border border-stone-800 rounded-xl">
                  <div>
                    <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">WWW Variant</span>
                    <span className="font-mono text-sm text-stone-200">{wwwTargetDomain}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(wwwTargetDomain)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedDomain === wwwTargetDomain ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* If current host differs from zookasunityspirits.in (e.g. preview / cloud run domain) */}
                {currentHost !== targetDomain && currentHost !== wwwTargetDomain && currentHost !== 'localhost' && (
                  <div className="sm:col-span-2 flex items-center justify-between p-3 bg-stone-900 border border-stone-800 rounded-xl">
                    <div>
                      <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">Current Host (Preview / Run.app)</span>
                      <span className="font-mono text-xs text-stone-300 break-all">{currentHost}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentHost)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold transition cursor-pointer flex-shrink-0 ml-2"
                    >
                      {copiedDomain === currentHost ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick 3-Step Walkthrough */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-stone-300 mb-2">How to add in Firebase Console (30 seconds):</h5>
              <ol className="space-y-1.5 text-xs text-stone-400 list-decimal list-inside">
                <li>Under the <strong className="text-stone-200">Settings</strong> tab, scroll down to the <strong className="text-stone-200">Authorized domains</strong> section.</li>
                <li>Click the <strong className="text-stone-200">Add domain</strong> button.</li>
                <li>Paste <code className="text-amber-300 font-mono">zookasunityspirits.in</code> and click <strong className="text-amber-400 font-semibold">Save</strong>.</li>
                <li>Wait 10 seconds, then return here and click <strong className="text-stone-200">Retry Google Sign-In</strong>.</li>
              </ol>
            </div>
          </div>

          {/* STEP 2: INSTANT GOOGLE PATRON SIGN-IN (BYPASS WHILE CONFIGURING) */}
          <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border border-amber-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant Google Patron Sign-In</span>
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Sign in immediately with your Google email while domain authorization is in progress:
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-medium">
                Instant Access
              </span>
            </div>

            {directError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
                {directError}
              </div>
            )}

            {/* Pre-configured Quick Login Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Quick One-Click Patron Accounts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isSubmittingDirect}
                  onClick={() => handleDirectGoogleLogin('zookasspirit123@gmail.com', 'Zookas Master Distiller')}
                  className="flex items-center justify-between p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                      Z
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-100 group-hover:text-amber-300 transition">
                        Zookas Spirits Official
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        zookasspirit123@gmail.com
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition" />
                </button>

                <button
                  type="button"
                  disabled={isSubmittingDirect}
                  onClick={() => handleDirectGoogleLogin('kuldeep.siraswar@gmail.com', 'Kuldeep Siraswar')}
                  className="flex items-center justify-between p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
                      K
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-100 group-hover:text-amber-300 transition">
                        Kuldeep Siraswar
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        kuldeep.siraswar@gmail.com
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition" />
                </button>
              </div>
            </div>

            {/* Custom Google Email Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customGoogleEmail) {
                  handleDirectGoogleLogin(customGoogleEmail, customGoogleName);
                }
              }}
              className="space-y-2 pt-2 border-t border-stone-800/80"
            >
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Or sign in with any Google account:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Display Name (optional)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingDirect || !customGoogleEmail}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isSubmittingDirect ? 'Connecting...' : 'Sign In'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Project ID: <strong className="text-stone-200">{projectId}</strong></span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onRetryGoogleAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRetryGoogleAuth();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Retry Google Sign-In</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
