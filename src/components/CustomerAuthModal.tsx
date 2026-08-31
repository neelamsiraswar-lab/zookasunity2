import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
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
  Flame,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalInitialTab, 
    loginCustomer, 
    registerCustomer, 
    demoCustomersList,
    switchCustomerAccount
  } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'demo'>('login');
  
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

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab);
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

  const handleSelectDemo = (customerId: string) => {
    setLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      switchCustomerAccount(customerId);
      setLoading(false);
      closeAuthModal();
    }, 200);
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
            <button
              onClick={() => { setActiveTab('demo'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Demo Patrons
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
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
                      placeholder="e.g. arthur.sterling@casksociety.com"
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

                {/* Quick One-Click Demo Logins */}
                <div className="pt-4 border-t border-stone-800">
                  <p className="text-xs text-stone-400 font-semibold mb-2.5 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Quick 1-Click Demo Profiles:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {demoCustomersList.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setLoginEmail(d.email);
                          handleSelectDemo(d.id);
                        }}
                        className="p-2 bg-stone-950/70 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 rounded-xl text-left transition group"
                      >
                        <div className="font-semibold text-xs text-stone-200 group-hover:text-amber-400 truncate">
                          {d.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate">{d.loyaltyTier}</div>
                      </button>
                    ))}
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
              </form>
            )}

            {/* TAB 3: DEMO PATRONS */}
            {activeTab === 'demo' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-400">
                  Select a pre-configured spirits patron profile to test small-batch purchasing, saved multi-address shipping, and order history:
                </p>

                <div className="space-y-2.5">
                  {demoCustomersList.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 bg-stone-950 border border-stone-800 hover:border-amber-500/60 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={d.avatar}
                          alt={d.name}
                          className="w-11 h-11 rounded-xl object-cover border border-amber-500/30"
                        />
                        <div>
                          <div className="font-serif font-bold text-sm text-stone-100 flex items-center gap-2">
                            {d.name}
                            <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800/80 rounded-full font-sans font-semibold">
                              {d.loyaltyTier}
                            </span>
                          </div>
                          <div className="text-xs text-stone-400">{d.email}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {d.addresses.length} saved addresses • Joined {d.dateJoined}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectDemo(d.id)}
                        className="px-4 py-2 bg-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 text-stone-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        Sign In as {d.name.split(' ')[0]}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
    </AnimatePresence>
  );
};
