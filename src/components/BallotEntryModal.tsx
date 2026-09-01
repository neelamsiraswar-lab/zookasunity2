import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';
import { BallotAllocation, Address } from '../types';
import {
  X,
  Crown,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ticket,
  Wine,
  Flame,
  ArrowRight,
  Copy,
  Check,
  Building,
  MapPin,
  Lock
} from 'lucide-react';

interface BallotEntryModalProps {
  allocation: BallotAllocation;
  onClose: () => void;
}

export const BallotEntryModal: React.FC<BallotEntryModalProps> = ({ allocation, onClose }) => {
  const {
    customer,
    isCustomerLoggedIn,
    openAuthModal,
    registerBallotEntry,
    getUserBallotEntries,
    setActiveTab,
    adminSettings
  } = useStore();

  const userEntries = getUserBallotEntries();
  const existingEntry = userEntries.find(e => e.allocationId === allocation.id);

  const [bottlesRequested, setBottlesRequested] = useState<number>(1);
  const [preferredSerials, setPreferredSerials] = useState<string>('');
  const [collectorNotes, setCollectorNotes] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customer.addresses?.[0]?.id || ''
  );
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    ticketNumber?: string;
    entrantNumber?: number;
  } | null>(existingEntry ? { ticketNumber: existingEntry.ticketNumber, entrantNumber: existingEntry.entrantNumber } : null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);

  const maxAllowed = allocation.maxBottlesPerEntrant || 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isCustomerLoggedIn) {
      openAuthModal('login');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please confirm you are of legal drinking age and accept the allocation draw terms.');
      return;
    }

    // Parse preferred bottle serial numbers if any
    let parsedSerials: number[] = [];
    if (preferredSerials.trim()) {
      parsedSerials = preferredSerials
        .split(',')
        .map(s => parseInt(s.trim().replace(/#/g, ''), 10))
        .filter(n => !isNaN(n) && n > 0 && n <= allocation.totalBottlesAvailable);
    }

    const selectedAddr = customer.addresses?.find(a => a.id === selectedAddressId) || customer.addresses?.[0];

    setIsSubmitting(true);
    try {
      const result = await registerBallotEntry({
        allocationId: allocation.id,
        bottlesRequested,
        preferredBottleNumbers: parsedSerials,
        collectorNotes,
        shippingAddress: selectedAddr
      });

      if (result.success && result.entry) {
        setSubmissionResult({
          ticketNumber: result.entry.ticketNumber,
          entrantNumber: result.entry.entrantNumber
        });
      } else {
        setErrorMessage(result.error || 'Failed to register your ballot entry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred while registering for the draw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = (ticket: string) => {
    navigator.clipboard?.writeText(ticket);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto"
      id="ballot-entry-modal-overlay"
    >
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        id="ballot-entry-modal"
      >
        {/* Modal Header Banner */}
        <div className="relative bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-6 border-b border-amber-900/40">
          <button
            onClick={onClose}
            id="close-ballot-entry-modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Limited Edition Spirit Ballot Registration</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-100">
            {allocation.title}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {allocation.editionName} • Cask Yield: {allocation.totalBottlesAvailable} Bottles
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* If already submitted / just submitted */}
          {submissionResult ? (
            <div className="text-center py-6 space-y-6" id="ballot-success-view">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                  Entry Confirmed & Bonded
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-stone-100">
                  You Are Registered In The Draw
                </h3>
                <p className="text-stone-300 text-sm max-w-md mx-auto mt-2">
                  Your ticket has been recorded in the bonded distillery ledger. If selected on draw day, you will be notified with a 72-hour window to complete your allocation acquisition.
                </p>
              </div>

              {/* Ticket Card */}
              <div className="max-w-md mx-auto p-5 bg-stone-950/80 border border-amber-500/30 rounded-xl text-left relative overflow-hidden shadow-inner">
                <div className="flex justify-between items-start border-b border-stone-800 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                      Ballot Reference Ticket
                    </span>
                    <span className="font-mono text-lg font-bold text-amber-400 tracking-wider">
                      {submissionResult.ticketNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => submissionResult.ticketNumber && handleCopyTicket(submissionResult.ticketNumber)}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1 bg-amber-950/40 border border-amber-600/30 rounded transition"
                  >
                    {copiedTicket ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">Collector</span>
                    <span className="text-stone-200 font-medium">{customer.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Entrant Index</span>
                    <span className="text-stone-200 font-medium">#{submissionResult.entrantNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Draw Date</span>
                    <span className="text-amber-300 font-medium">
                      {new Date(allocation.drawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Bottle Price</span>
                    <span className="text-stone-200 font-medium">{formatPrice(allocation.bottlePrice, adminSettings.currencySymbol)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('account');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View in My Account</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-6" id="ballot-entry-form">
              {/* Spirit Summary Row */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                <img
                  src={allocation.imageUrl}
                  alt={allocation.productName}
                  className="w-20 h-24 object-cover rounded-lg border border-stone-800 shrink-0 self-center sm:self-start"
                />
                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-semibold uppercase tracking-wider">{allocation.spiritCategory}</span>
                    <span className="font-cinzel text-base font-bold text-amber-400">{formatPrice(allocation.bottlePrice, adminSettings.currencySymbol)} / bottle</span>
                  </div>
                  <h4 className="text-stone-200 font-semibold text-sm">{allocation.productName}</h4>
                  <p className="text-stone-400 line-clamp-2">{allocation.description}</p>
                  <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-stone-300">
                    <span><strong className="text-stone-400">ABV:</strong> {allocation.abvPercent}%</span>
                    <span><strong className="text-stone-400">Cask:</strong> {allocation.caskType}</span>
                    <span><strong className="text-stone-400">Total Yield:</strong> {allocation.totalBottlesAvailable} bottles</span>
                  </div>
                </div>
              </div>

              {/* Login Banner if guest */}
              {!isCustomerLoggedIn && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="text-xs">
                      <p className="text-stone-200 font-medium">Distillery Account Required for Ballot Verification</p>
                      <p className="text-stone-400">Please sign in or register to connect your collector credentials.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-semibold tracking-wide whitespace-nowrap transition cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Collector Details & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Bottles Requested
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={bottlesRequested}
                      onChange={(e) => setBottlesRequested(parseInt(e.target.value, 10))}
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:border-amber-500 focus:outline-none"
                    >
                      {Array.from({ length: maxAllowed }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Bottle' : 'Bottles'} ({formatPrice(num * allocation.bottlePrice, adminSettings.currencySymbol)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Maximum {maxAllowed} bottle{maxAllowed > 1 ? 's' : ''} per collector household.
                  </span>
                </div>

                {/* Preferred Serial Numbers */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Preferred Bottle Serial (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #007, #077, #100"
                    value={preferredSerials}
                    onChange={(e) => setPreferredSerials(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Subject to draw availability (1 to {allocation.totalBottlesAvailable}).
                  </span>
                </div>
              </div>

              {/* Shipping Address Selection */}
              {isCustomerLoggedIn && customer.addresses && customer.addresses.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Delivery Address for Allocation
                  </label>
                  <div className="space-y-2">
                    {customer.addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          selectedAddressId === addr.id
                            ? 'bg-amber-950/30 border-amber-600/40 text-stone-200'
                            : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-amber-500 focus:ring-amber-500/20"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-stone-200 block">{addr.fullName}</span>
                          <span>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Collector Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Collector Tasting & Cellaring Intent (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share your spirits collection history or cellaring intent..."
                  value={collectorNotes}
                  onChange={(e) => setCollectorNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-stone-200 placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Compliance & Verification Checkbox */}
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="ballot-terms-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span className="text-xs text-stone-300">
                    I certify that I am <strong>21 years of age or older</strong> and agree to the <em>Small-Batch Ballot Terms & Conditions</em>. I understand that winning tickets must be claimed and purchased within <strong>72 hours</strong> of the official draw notification.
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-ballot-entry-btn"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition flex items-center gap-2 ${
                    isSubmitting
                      ? 'bg-amber-700 text-stone-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-lg shadow-amber-950/50 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Securing Entry...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Confirm Ballot Entry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
