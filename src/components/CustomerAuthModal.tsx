import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { GoogleDomainAuthModal } from './GoogleDomainAuthModal';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Wine,
  Globe,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalInitialTab, 
    loginCustomer, 
    loginWithGoogle,
    registerCustomer
  } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('whisky2026');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPreferences, setRegPreferences] = useState<string[]>([
    'Single Malt Whisky', 
    'Cask Strength Bourbon'
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Domain modal state
  const [showDomainModal, setShowDomainModal] = useState<boolean>(false);
  const [domainErrorInfo, setDomainErrorInfo] = useState<{
    domain: string;
    consoleUrl?: string;
    projectId?: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab === 'register' ? 'register' : 'login');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isAuthModalOpen, authModalInitialTab]);

  if (!isAuthModalOpen) return null;

  const spiritOptions = [
    'Single Malt Whisky',
    'Cask Strength Bourbon',
    'Botanical Gin',
    'Artisanal Aged Rum',
    'Ancestral Mezcal',
    'High-Proof Ryes'
  ];

  const togglePreference = (pref: string) => {
    setRegPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginCustomer(loginEmail, loginPassword);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
      } else {
        setSuccessMsg('Welcome back to the Spirits Patron Society!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await registerCustomer({
        name: regName,
        email: regEmail,
        phone: regPhone,
        spiritPreferences: regPreferences
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Registration could not be completed.');
      } else {
        setSuccessMsg('Account registered successfully! Welcome to the society.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        if (res.isUnauthorizedDomain || res.errorCode === 'auth/unauthorized-domain' || res.error?.toLowerCase().includes('unauthorized domain')) {
          setDomainErrorInfo({
            domain: res.unauthorizedDomain || window.location.hostname || 'zookasunityspirits.in',
            consoleUrl: res.consoleSettingsUrl,
            projectId: res.projectId
          });
          setShowDomainModal(true);
        }
        setErrorMsg(res.error || 'Google sign-in was canceled or unavailable.');
      } else {
        setDomainErrorInfo(null);
        setSuccessMsg('Successfully authenticated with Google!');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-stone-100"
        >
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

          {/* Modal Header */}
          <div className="p-6 pb-4 flex items-start justify-between border-b border-stone-800/80 bg-stone-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Wine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-100">
                  Patron Cellar Portal
                </h3>
                <p className="text-xs text-stone-400">
                  Access small-batch allocations, saved addresses & order history
                </p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-stone-800 bg-stone-950/40 p-1.5 gap-1.5 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create Account
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="p-3.5 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
                {domainErrorInfo && (
                  <div className="pt-2 border-t border-red-900/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-300 font-mono">zookasunityspirits.in</span>
                    <button
                      type="button"
                      onClick={() => setShowDomainModal(true)}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      Fix Domain in Firebase
                    </button>
                  </div>
                )}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. patron@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Password
                    </label>
                    <span className="text-[11px] text-amber-400/80">Demo: enter any password</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-800"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-stone-500 uppercase tracking-wider">Or continue with</span>
                    <div className="flex-grow border-t border-stone-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-stone-200 text-xs font-semibold transition flex items-center justify-center gap-2.5 shadow-sm hover:border-amber-500/40 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-amber-500/70" />
                      <span>Domain: <strong className="text-stone-300 font-mono">zookasunityspirits.in</strong></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDomainModal(true)}
                      className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition cursor-pointer font-medium"
                    >
                      Domain Setup
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: CREATE ACCOUNT */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="Lord Arthur Sterling"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Mobile Number (For dispatch alerts)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 012-3456"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="arthur@domain.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2">
                    Select Your Spirits & Cask Preferences:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {spiritOptions.map((opt) => {
                      const isSelected = regPreferences.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => togglePreference(opt)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-[11px] text-amber-300/90 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    By registering, you confirm you are 21 years of age or older and agree to verified courier signature requirements upon delivery.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {loading ? 'Creating Society Account...' : 'Complete Registration & Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-800"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-stone-500 uppercase tracking-wider">Or register with</span>
                    <div className="flex-grow border-t border-stone-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-stone-200 text-xs font-semibold transition flex items-center justify-center gap-2.5 shadow-sm hover:border-amber-500/40 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                    </svg>
                    <span>Sign Up with Google</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-amber-500/70" />
                      <span>Domain: <strong className="text-stone-300 font-mono">zookasunityspirits.in</strong></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDomainModal(true)}
                      className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition cursor-pointer font-medium"
                    >
                      Domain Setup
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Modal Footer / Guest Option */}
          <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs text-stone-400">
            <span>Prefer to purchase without an account?</span>
            <button
              onClick={closeAuthModal}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
            >
              Continue as Guest
            </button>
          </div>
        </motion.div>
      </div>

      {/* Domain Authorization Fixer Modal */}
      <GoogleDomainAuthModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        onRetryGoogleAuth={handleGoogleSignIn}
        detectedDomain={domainErrorInfo?.domain}
        consoleUrl={domainErrorInfo?.consoleUrl}
        projectId={domainErrorInfo?.projectId}
      />
    </AnimatePresence>
  );
};
