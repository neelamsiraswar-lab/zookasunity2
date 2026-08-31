import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AgeGateModal: React.FC = () => {
  const { ageVerified, setAgeVerified, adminSettings } = useStore();
  const [birthYear, setBirthYear] = useState<string>('2000');
  const [birthMonth, setBirthMonth] = useState<string>('01');
  const [birthDay, setBirthDay] = useState<string>('01');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (ageVerified || !adminSettings.ageGateRequired) {
    return null;
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
    const today = new Date();
    let age = today.getFullYear() - enteredDate.getFullYear();
    const m = today.getMonth() - enteredDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < enteredDate.getDate())) {
      age--;
    }

    if (age >= 21) {
      setAgeVerified(true);
    } else {
      setErrorMessage('You must be 21 years of age or older to enter Zookas Unity Spirits.');
    }
  };

  const handleQuickConfirm = () => {
    setAgeVerified(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg overflow-hidden border border-amber-500/30 rounded-2xl bg-stone-900 shadow-2xl shadow-amber-950/50"
        >
          {/* Header Accent */}
          <div className="h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800" />

          <div className="p-8 text-center sm:p-10">
            {/* Logo Emblem */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full border border-amber-500/40 bg-stone-800/80 shadow-inner">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>

            <span className="inline-block px-3 py-1 mb-3 text-xs tracking-widest uppercase font-semibold text-amber-400 bg-amber-950/60 border border-amber-700/40 rounded-full">
              Legal Age Verification
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              Welcome to Zookas Unity Spirits
            </h2>

            <p className="mt-3 text-sm text-stone-300 leading-relaxed max-w-md mx-auto">
              We craft rare, small-batch artisanal spirits. You must be of legal drinking age in your country to explore our catalog and store.
            </p>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 mt-4 text-xs text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div className="text-left">
                <label className="block mb-1.5 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Verify Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    id="age-month"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-stone-800 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const m = String(i + 1).padStart(2, '0');
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      return (
                        <option key={m} value={m}>
                          {monthNames[i]}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    id="age-day"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-stone-800 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: 31 }, (_, i) => {
                      const d = String(i + 1).padStart(2, '0');
                      return (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    id="age-year"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-stone-800 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: 90 }, (_, i) => {
                      const y = 2026 - 18 - i;
                      return (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span>Remember my verification</span>
                </label>
                <span className="text-stone-500">21+ Only</span>
              </div>

              <div className="pt-3 space-y-2.5">
                <button
                  type="submit"
                  id="btn-verify-age"
                  className="w-full py-3.5 px-6 font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-stone-950" />
                  <span>I AM 21 YEARS OF AGE OR OLDER</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickConfirm}
                  className="w-full py-2.5 px-4 text-xs font-medium text-amber-400 hover:text-amber-300 bg-stone-800/60 hover:bg-stone-800 border border-stone-700 rounded-lg transition"
                >
                  Express Verification (Legal Drinker)
                </button>
              </div>
            </form>

            <p className="mt-5 text-xs text-stone-400 leading-normal">
              By entering, you agree to our Terms of Service & Privacy Policy. Zookas Unity Spirits advocates responsible drinking.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
