import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ZookasOfficialCrest } from '../ZookasOfficialCrest';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Wine
} from 'lucide-react';

interface AuthViewProps {
  onAdminClick?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAdminClick }) => {
  const { 
    loginCustomer, 
    loginWithGoogle, 
    registerCustomer, 
    adminSettings,
    headerConfig,
    companyDetails,
    appLogoUrl,
    setAgeVerified,
    setActiveTab
  } = useStore();

  const effectiveLogoUrl = appLogoUrl || headerConfig?.logoImageUrl || companyDetails?.logoUrl || adminSettings?.companyLogo || adminSettings?.logoUrl;
  const effectiveBrandName = adminSettings?.brandName || headerConfig?.brandName || companyDetails?.companyName || 'ZOOKAS UNITY SPIRITS';
  const effectiveBrandTagline = adminSettings?.brandTagline || headerConfig?.brandTagline || companyDetails?.brandTagline || 'Est. 2026 • Artisanal Cask Bottling';

  const handleAdminCms = () => {
    if (onAdminClick) {
      onAdminClick();
    } else {
      setActiveTab('admin');
    }
  };

  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [regPreferences, setRegPreferences] = useState<string[]>([
    'Single Malt Whisky', 
    'Cask Strength Bourbon'
  ]);
  const [regAgeAgreed, setRegAgeAgreed] = useState<boolean>(true);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginCustomer(loginEmail, loginPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Unable to sign in. Please verify your email.');
      } else {
        setSuccessMessage('Welcome back! Loading your patron cellar...');
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setErrorMessage(res.error || 'Google sign-in was canceled or unavailable.');
      } else {
        setSuccessMessage('Successfully authenticated with Google! Entering cellar...');
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign-in error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please provide your full legal name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!regAgeAgreed) {
      setErrorMessage('You must confirm you are 21 years of age or older to create an account.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerCustomer({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        spiritPreferences: regPreferences
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
      } else {
        setSuccessMessage('Account created successfully! Welcome to Zookas Unity Spirits.');
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-amber-500 selection:text-stone-950">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-amber-600/10 blur-[130px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-900/10 blur-[100px] pointer-events-none -z-0" />

      {/* Top Brand Banner */}
      <header className="w-full pt-8 pb-4 px-4 flex flex-col items-center justify-center text-center relative z-10">
        <div className="mb-3 transform hover:scale-105 transition-transform duration-300 flex justify-center">
          {effectiveLogoUrl ? (
            <img 
              src={effectiveLogoUrl} 
              alt={effectiveBrandName}
              className="h-20 sm:h-24 w-auto max-w-[220px] object-contain rounded-2xl p-1.5 bg-stone-900/90 border border-amber-500/40 shadow-xl shadow-amber-950/60"
            />
          ) : (
            <ZookasOfficialCrest size={80} variant="gold" showText={false} />
          )}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 uppercase">
          {effectiveBrandName}
        </h1>
        <p className="text-[11px] sm:text-xs text-amber-500/90 tracking-[0.25em] uppercase font-semibold mt-1">
          {effectiveBrandTagline}
        </p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-3" />
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-xl mx-auto px-4 py-4 relative z-10 flex-1 flex flex-col justify-center">
        <div className="bg-stone-900/90 border border-stone-800 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
          
          {/* Card Header & Notice */}
          <div className="p-5 sm:p-6 pb-4 border-b border-stone-800/80 bg-stone-950/40 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Age Confirmed 21+ • Patron Society Access</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
              Patron Cellar Portal
            </h2>
            <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
              Please sign in or create your distillery patron account to enter the store, access member allocations, and manage orders.
            </p>
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={handleAdminCms}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 hover:text-amber-200 text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin CMS Login</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 bg-stone-950/80 p-1.5 border-b border-stone-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthTab('login'); setErrorMessage(''); }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                authTab === 'login'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthTab('register'); setErrorMessage(''); }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                authTab === 'register'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="m-4 mb-0 p-3.5 bg-red-950/50 border border-red-800/80 rounded-2xl text-xs text-red-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="m-4 mb-0 p-3.5 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl text-xs text-emerald-200 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-5 sm:p-7">
            {/* TAB 1: SIGN IN */}
            {authTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Patron Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="patron@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
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

                <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating Patron...
                    </span>
                  ) : (
                    <>
                      <span>Sign In & Enter Cellar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Social Login / Google Auth */}
                <div className="pt-3">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-800"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-stone-500 uppercase tracking-wider">Or continue with</span>
                    <div className="flex-grow border-t border-stone-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-stone-200 text-xs font-semibold transition flex items-center justify-center gap-2.5 shadow-sm hover:border-amber-500/40 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Direct Admin CMS Portal Button */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-800"></div>
                    <span className="flex-shrink mx-2.5 text-[10px] text-stone-500 uppercase tracking-wider">Staff & CMS Access</span>
                    <div className="flex-grow border-t border-stone-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdminCms}
                    className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800/90 border border-amber-500/40 hover:border-amber-500/70 rounded-xl text-amber-300 hover:text-amber-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Login to Admin CMS</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SIGN UP / REGISTER */}
            {authTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
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
                        placeholder="e.g. Eleanor Vance"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Mobile (Courier Signature Alerts)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 012-3456"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition"
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
                      placeholder="patron@domain.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition"
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
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Spirits & Cask Preferences:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {spiritOptions.map((opt) => {
                      const isSelected = regPreferences.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => togglePreference(opt)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
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
                  <input
                    type="checkbox"
                    id="regAgeConfirm"
                    checked={regAgeAgreed}
                    onChange={(e) => setRegAgeAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-amber-700 bg-stone-950 text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="regAgeConfirm" className="cursor-pointer">
                    I confirm I am 21 years of age or older and agree to verified courier signature requirements upon delivery.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      Creating Society Account...
                    </span>
                  ) : (
                    <>
                      <span>Complete Registration & Enter Cellar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Direct Admin CMS Portal Button */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-800"></div>
                    <span className="flex-shrink mx-2.5 text-[10px] text-stone-500 uppercase tracking-wider">Distillery Operations</span>
                    <div className="flex-grow border-t border-stone-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdminCms}
                    className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800/90 border border-amber-500/40 hover:border-amber-500/70 rounded-xl text-amber-300 hover:text-amber-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Login to Admin CMS</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Security Badges */}
          <div className="p-3.5 px-5 border-t border-stone-800/80 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Age Confirmed 21+ • Cloud Protected Session</span>
            </div>

            <button
              type="button"
              onClick={() => {
                // Allow re-verifying age if user wishes to test age gate flow
                setAgeVerified(false);
              }}
              className="text-stone-500 hover:text-stone-300 underline underline-offset-2 transition"
            >
              Re-open Age Verification
            </button>
          </div>
        </div>

        {/* Discreet Distillery Staff / Admin Sign In Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleAdminCms}
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-amber-300 transition cursor-pointer py-1.5 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Login to Admin CMS (Staff & Master Distiller Portal)</span>
          </button>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-4 text-center text-xs text-stone-500 relative z-10 border-t border-stone-900">
        <p>© 2026 Zookas Unity Spirits Co. All rights reserved. Adult Signature (21+) required for courier delivery.</p>
      </footer>
    </div>
  );
};
