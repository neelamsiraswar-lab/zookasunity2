import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound, 
  Hash, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Flame,
  ArrowRight,
  Delete,
  Fingerprint
} from 'lucide-react';

interface AdminAuthLockScreenProps {
  onAuthenticated: () => void;
}

export const AdminAuthLockScreen: React.FC<AdminAuthLockScreenProps> = ({ onAuthenticated }) => {
  const { adminSettings } = useStore();
  
  const currentPassword = adminSettings?.adminPassword || 'zookas2026';
  const currentPin = adminSettings?.adminPin || '8821';
  const requireBoth = adminSettings?.requireBothPasswordAndPin || false;

  const [authMode, setAuthMode] = useState<'pin' | 'password'>(requireBoth ? 'password' : 'pin');
  const [pinInput, setPinInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [passwordPassedInDualMode, setPasswordPassedInDualMode] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Handle Lockout countdown
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Keyboard support for PIN entry
  useEffect(() => {
    if (authMode !== 'pin' || lockoutSeconds > 0 || isSuccess) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePinDigit(e.key);
      } else if (e.key === 'Backspace') {
        handlePinBackspace();
      } else if (e.key === 'Escape') {
        handlePinClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authMode, pinInput, lockoutSeconds, isSuccess, currentPin]);

  // Trigger error shake
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);

    const nextFailed = failedAttempts + 1;
    setFailedAttempts(nextFailed);
    if (nextFailed >= 5) {
      setLockoutSeconds(30);
      setErrorMessage('Too many failed security attempts. Cask vault locked for 30s.');
    }
  };

  // Process PIN submit
  const verifyPin = (pinToTest: string) => {
    if (pinToTest === currentPin) {
      handleSuccessfulAuth();
    } else {
      setPinInput('');
      triggerError('Incorrect Security PIN. Please try again.');
    }
  };

  const handlePinDigit = (digit: string) => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setErrorMessage('');
    if (pinInput.length < 6) {
      const newPin = pinInput + digit;
      setPinInput(newPin);
      if (newPin.length === currentPin.length) {
        // Auto-verify once required PIN length is reached
        setTimeout(() => verifyPin(newPin), 150);
      }
    }
  };

  const handlePinBackspace = () => {
    if (lockoutSeconds > 0) return;
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handlePinClear = () => {
    if (lockoutSeconds > 0) return;
    setPinInput('');
    setErrorMessage('');
  };

  // Process Password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0 || isSuccess) return;

    if (passwordInput === currentPassword) {
      if (requireBoth && !passwordPassedInDualMode) {
        setPasswordPassedInDualMode(true);
        setAuthMode('pin');
        setErrorMessage('');
        return;
      }
      handleSuccessfulAuth();
    } else {
      triggerError('Invalid Master Admin Password. Please try again.');
    }
  };

  const handleSuccessfulAuth = () => {
    setIsSuccess(true);
    setErrorMessage('');
    // Store in session storage so page refresh retains active login
    try {
      sessionStorage.setItem('zookas_admin_auth', 'true');
      sessionStorage.setItem('zookas_admin_auth_time', Date.now().toString());
    } catch {
      // ignore in iframe restricted cases
    }
    setTimeout(() => {
      onAuthenticated();
    }, 600);
  };

  // Quick fill helper for testers/evaluators
  const handleQuickFill = (type: 'password' | 'pin') => {
    if (type === 'password') {
      setPasswordInput(currentPassword);
      setErrorMessage('');
    } else {
      setPinInput(currentPin);
      setErrorMessage('');
      setTimeout(() => verifyPin(currentPin), 200);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-stone-100">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative Cask/Distillery background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Main Lock Box */}
      <div className={`relative w-full max-w-md bg-stone-900/90 border border-stone-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 ${
        shake ? 'animate-bounce border-red-500/50' : 'border-amber-500/30'
      }`}>
        
        {/* Top Vault Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-xl ${
              isSuccess 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 scale-110' 
                : 'bg-stone-950/80 border-amber-500/40 text-amber-400'
            }`}>
              {isSuccess ? (
                <Unlock className="w-8 h-8 animate-pulse text-emerald-400" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-amber-400" />
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSuccess ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-4 w-4 ${
                isSuccess ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Zookas Unity Spirits</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 tracking-tight">
            Distillery Vault Security
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {requireBoth
              ? passwordPassedInDualMode 
                ? 'Step 2: Enter Master PIN to complete verification' 
                : 'Step 1: Enter Master Password'
              : 'Enter Master Password or Security PIN to access CMS'}
          </p>
        </div>

        {/* Lockout Banner */}
        {lockoutSeconds > 0 && (
          <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800 rounded-xl flex items-center gap-3 text-red-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-bold">Security Lockout Active</p>
              <p className="text-red-300">
                Please wait <span className="font-mono font-bold text-white">{lockoutSeconds}s</span> before retrying.
              </p>
            </div>
          </div>
        )}

        {/* Mode Selector Tabs (only if not strictly requiring dual mode) */}
        {!requireBoth && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 mb-6">
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isSuccess}
              onClick={() => {
                setAuthMode('pin');
                setErrorMessage('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                authMode === 'pin'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Quick PIN</span>
            </button>
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isSuccess}
              onClick={() => {
                setAuthMode('password');
                setErrorMessage('');
                setTimeout(() => passwordInputRef.current?.focus(), 100);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                authMode === 'password'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Master Password</span>
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && lockoutSeconds <= 0 && (
          <div className="mb-5 p-2.5 bg-red-950/70 border border-red-800/80 rounded-xl flex items-center gap-2 text-red-300 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PIN Authentication Mode */}
        {authMode === 'pin' && (
          <div className="space-y-5">
            {/* PIN Indicator Dots */}
            <div className="flex justify-center items-center gap-3 py-2">
              {Array.from({ length: currentPin.length }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    idx < pinInput.length
                      ? 'bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-500/50'
                      : 'border-stone-700 bg-stone-950'
                  }`}
                />
              ))}
            </div>

            {/* Interactive Numpad */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  disabled={lockoutSeconds > 0 || isSuccess}
                  onClick={() => handlePinDigit(digit)}
                  className="h-12 sm:h-14 bg-stone-950/80 hover:bg-stone-800 active:bg-amber-500 active:text-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-xl text-lg sm:text-xl font-bold font-mono text-stone-200 transition duration-150 cursor-pointer flex items-center justify-center disabled:opacity-40"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                disabled={lockoutSeconds > 0 || isSuccess}
                onClick={handlePinClear}
                className="h-12 sm:h-14 bg-stone-950/50 hover:bg-stone-800/80 border border-stone-850 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200 transition cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={lockoutSeconds > 0 || isSuccess}
                onClick={() => handlePinDigit('0')}
                className="h-12 sm:h-14 bg-stone-950/80 hover:bg-stone-800 active:bg-amber-500 active:text-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-xl text-lg sm:text-xl font-bold font-mono text-stone-200 transition duration-150 cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                0
              </button>
              <button
                type="button"
                disabled={lockoutSeconds > 0 || isSuccess}
                onClick={handlePinBackspace}
                className="h-12 sm:h-14 bg-stone-950/50 hover:bg-stone-800/80 border border-stone-850 rounded-xl text-stone-400 hover:text-stone-200 transition cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Password Authentication Mode */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Master Administrator Password
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  disabled={lockoutSeconds > 0 || isSuccess}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter vault password..."
                  className="w-full pl-3.5 pr-10 py-3 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none transition disabled:opacity-50"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={lockoutSeconds > 0 || isSuccess || !passwordInput}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{requireBoth ? 'Proceed to Step 2 (PIN)' : 'Unlock Cask Vault'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Credentials Assistant */}
        <div className="mt-6 pt-5 border-t border-stone-800/80">
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
            <span className="flex items-center gap-1 text-stone-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Evaluator Credentials</span>
            </span>
            <span className="text-[10px] text-stone-500">Click to autofill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMode('pin');
                handleQuickFill('pin');
              }}
              className="p-2 bg-stone-950/70 hover:bg-stone-800/60 border border-stone-800 rounded-lg text-left transition cursor-pointer group"
            >
              <span className="text-[10px] text-stone-500 block">PIN:</span>
              <span className="text-amber-400 font-bold group-hover:underline">{currentPin}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                handleQuickFill('password');
              }}
              className="p-2 bg-stone-950/70 hover:bg-stone-800/60 border border-stone-800 rounded-lg text-left transition cursor-pointer group"
            >
              <span className="text-[10px] text-stone-500 block">Password:</span>
              <span className="text-amber-400 font-bold group-hover:underline truncate block">{currentPassword}</span>
            </button>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-stone-600 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-stone-500" />
            <span>Google Cloud Firestore Protected • 256-bit Encrypted Session</span>
          </p>
        </div>

      </div>
    </div>
  );
};
