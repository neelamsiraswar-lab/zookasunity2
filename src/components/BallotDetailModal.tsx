import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';
import { BallotAllocation } from '../types';
import {
  X,
  Crown,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Flame,
  Wine,
  Building,
  Award,
  Layers,
  ArrowRight,
  Ticket
} from 'lucide-react';
import { BallotEntryModal } from './BallotEntryModal';

interface BallotDetailModalProps {
  allocation: BallotAllocation;
  onClose: () => void;
}

export const BallotDetailModal: React.FC<BallotDetailModalProps> = ({ allocation, onClose }) => {
  const {
    customer,
    isCustomerLoggedIn,
    getUserBallotEntries,
    claimBallotAllocation,
    setActiveTab,
    ballotEntries,
    adminSettings
  } = useStore();

  const [isEntryModalOpen, setIsEntryModalOpen] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  const userEntries = getUserBallotEntries();
  const userEntry = userEntries.find(e => e.allocationId === allocation.id);

  const allocationEntries = ballotEntries.filter(e => e.allocationId === allocation.id);
  const totalEntrantsCount = Math.max(allocation.totalEntrants, allocationEntries.length);
  const oversubscribedRatio = (totalEntrantsCount / Math.max(1, allocation.totalBottlesAvailable)).toFixed(1);

  const handleClaim = async () => {
    if (!userEntry || userEntry.status !== 'selected_winner') return;
    setIsClaiming(true);
    try {
      const res = await claimBallotAllocation(userEntry.id);
      if (res.success) {
        setClaimSuccess(true);
      }
    } catch (e) {
      console.error('Claim error:', e);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
        id="ballot-detail-modal-overlay"
      >
        <div 
          className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
          id="ballot-detail-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-950/80 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Hero Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-stone-950 border-b border-stone-800">
            <div className="md:col-span-5 relative h-72 md:h-auto min-h-[300px] overflow-hidden bg-stone-950 flex items-center justify-center p-6">
              <img
                src={allocation.imageUrl}
                alt={allocation.productName}
                className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-lg">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{allocation.editionName}</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{allocation.spiritCategory} • Vintage {allocation.distillationYear}</span>
                </div>
                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-100 leading-tight">
                  {allocation.title}
                </h1>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  {allocation.description}
                </p>
              </div>

              {/* Quick Spec Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-800/80 text-center">
                <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">ABV Proof</span>
                  <span className="text-xs font-semibold text-stone-200">{allocation.abvPercent}% ABV</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Maturation</span>
                  <span className="text-xs font-semibold text-stone-200">{allocation.ageStatement}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Bottle Size</span>
                  <span className="text-xs font-semibold text-stone-200">{allocation.bottleSize}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Allocation Price</span>
                  <span className="text-xs font-bold text-amber-400">{formatPrice(allocation.bottlePrice, adminSettings.currencySymbol)}</span>
                </div>
              </div>

              {/* Status & CTA Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Official Draw Schedule</span>
                  <span className="text-xs font-medium text-stone-200 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{new Date(allocation.drawDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                </div>

                {userEntry ? (
                  userEntry.status === 'selected_winner' ? (
                    <button
                      onClick={handleClaim}
                      disabled={isClaiming || claimSuccess}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                    >
                      {claimSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Allocation Claimed!</span>
                        </>
                      ) : isClaiming ? (
                        <span>Securing Bottles...</span>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          <span>Claim Winning Allocation ({formatPrice(userEntry.bottlesRequested * allocation.bottlePrice, adminSettings.currencySymbol)})</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-amber-400" />
                      <span>Registered Ticket: <strong>{userEntry.ticketNumber}</strong></span>
                    </div>
                  )
                ) : allocation.status === 'open' ? (
                  <button
                    onClick={() => setIsEntryModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Enter Ballot Allocation</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-stone-800 text-stone-400 text-xs font-medium uppercase tracking-wider">
                    {allocation.status === 'drawing_completed' ? 'Draw Completed' : 'Ballot Closed'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Modal Body Details */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Live Demand & Ledger Stats */}
            <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950/40 border border-amber-600/30 flex items-center justify-center text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Registered Entrants</span>
                  <span className="font-cinzel text-lg font-bold text-stone-100">{totalEntrantsCount} Collectors</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950/40 border border-amber-600/30 flex items-center justify-center text-amber-400">
                  <Wine className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Single-Cask Yield</span>
                  <span className="font-cinzel text-lg font-bold text-stone-100">{allocation.totalBottlesAvailable} Bottles</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950/40 border border-amber-600/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Collector Demand</span>
                  <span className="font-cinzel text-lg font-bold text-amber-400">{oversubscribedRatio}x Oversubscribed</span>
                </div>
              </div>
            </div>

            {/* In-Depth Spirit Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Provenance & Mash Bill */}
              <div className="space-y-4 p-5 rounded-xl bg-stone-950/40 border border-stone-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Grain Mash Bill & Distillation</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-800">
                    <span className="text-stone-400">Mash Bill Ratio</span>
                    <span className="text-stone-200 font-medium">{allocation.mashBill}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-800">
                    <span className="text-stone-400">Cask Maturation</span>
                    <span className="text-stone-200 font-medium">{allocation.caskType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-800">
                    <span className="text-stone-400">Distillation Vintage</span>
                    <span className="text-stone-200 font-medium">{allocation.distillationYear}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-800">
                    <span className="text-stone-400">Max Per Collector</span>
                    <span className="text-stone-200 font-medium">{allocation.maxBottlesPerEntrant} Bottle(s)</span>
                  </div>
                </div>
              </div>

              {/* Master Distiller Tasting Profile */}
              <div className="space-y-4 p-5 rounded-xl bg-stone-950/40 border border-stone-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Master Distiller Tasting Notes</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {allocation.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-stone-900 border border-amber-600/30 text-stone-200 text-xs font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed italic pt-2">
                  "Selected directly from our private cellar vault, this single cask exhibits exceptional depth, unfiltered viscosity, and profound oak extraction."
                </p>
              </div>
            </div>

            {/* Collector Draw Security & Assurance */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-stone-950 via-amber-950/20 to-stone-950 border border-stone-800 flex items-center gap-4 text-xs text-stone-300">
              <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <strong className="text-stone-200 block text-sm font-semibold">Bonded Cellar Authenticity Guarantee</strong>
                <span>Every allocated bottle is hand-numbered, wax-dipped at the stillhouse, and registered with a permanent certificate of provenance. Insured courier dispatch included.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Entry Modal if opened */}
      {isEntryModalOpen && (
        <BallotEntryModal
          allocation={allocation}
          onClose={() => setIsEntryModalOpen(false)}
        />
      )}
    </>
  );
};
