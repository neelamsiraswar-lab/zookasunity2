import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { BallotAllocation, BallotStatus, SpiritCategory } from '../../types';
import {
  Crown,
  Sparkles,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  ArrowRight,
  Flame,
  Wine,
  Ticket,
  HelpCircle,
  Lock,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import { BallotEntryModal } from '../BallotEntryModal';
import { BallotDetailModal } from '../BallotDetailModal';
import { formatPrice } from '../../utils/currency';

export const AllocationsView: React.FC = () => {
  const {
    ballotAllocations,
    ballotEntries,
    customer,
    isCustomerLoggedIn,
    openAuthModal,
    getUserBallotEntries,
    claimBallotAllocation,
    setActiveTab,
    adminSettings
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedAllocationForEntry, setSelectedAllocationForEntry] = useState<BallotAllocation | null>(null);
  const [selectedAllocationForDetail, setSelectedAllocationForDetail] = useState<BallotAllocation | null>(null);
  const [claimingEntryId, setClaimingEntryId] = useState<string | null>(null);

  const userEntries = getUserBallotEntries();

  // Categories list
  const categories = ['All', 'Bourbon', 'Rye', 'Single Malt', 'Botanical Gin', 'Rum', 'Agave'];

  // Filtered allocations
  const filteredAllocations = useMemo(() => {
    return ballotAllocations.filter(alloc => {
      // Category filter
      if (selectedCategory !== 'All' && alloc.spiritCategory !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && alloc.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = alloc.title.toLowerCase().includes(q);
        const matchesProduct = alloc.productName.toLowerCase().includes(q);
        const matchesEdition = alloc.editionName.toLowerCase().includes(q);
        const matchesCask = alloc.caskType.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProduct && !matchesEdition && !matchesCask) {
          return false;
        }
      }
      return true;
    });
  }, [ballotAllocations, selectedCategory, statusFilter, searchQuery]);

  const handleClaim = async (entryId: string) => {
    setClaimingEntryId(entryId);
    try {
      await claimBallotAllocation(entryId);
    } catch (e) {
      console.error('Claim error:', e);
    } finally {
      setClaimingEntryId(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-widest shadow-lg shadow-amber-950/50">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Private Collector Allocations & Fair Ballot Draws</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight">
          Ultra-Rare Spirit Allocations
        </h1>
        <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Due to extreme single-cask rarity and limited yields, our most coveted expressions are released via authenticated ballot lotteries to guarantee fair, transparent collector access.
        </p>
      </div>

      {/* User's Active Ballot Registrations Banner (if any) */}
      {userEntries.length > 0 && (
        <div className="max-w-7xl mx-auto" id="user-active-ballots-section">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-600/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-stone-100">
                    Your Registered Ballot Tickets ({userEntries.length})
                  </h3>
                  <span className="text-xs text-stone-400">
                    Connected Collector Account: <strong>{customer.name}</strong> ({customer.loyaltyTier})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('account')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>View Full Collector Portfolio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userEntries.map(entry => {
                const isWinner = entry.status === 'selected_winner';
                const isClaimed = entry.status === 'claimed_paid';
                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between space-y-3 ${
                      isWinner
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                        : isClaimed
                        ? 'bg-stone-900/60 border-stone-700'
                        : 'bg-stone-950/80 border-stone-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                          Ticket: {entry.ticketNumber}
                        </span>
                        <h4 className="text-stone-200 font-semibold text-sm line-clamp-1 mt-0.5">
                          {entry.productName}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isWinner
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : isClaimed
                          ? 'bg-stone-800 text-stone-300'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isWinner ? 'Selected Winner!' : isClaimed ? 'Claimed & Paid' : 'In Draw Pool'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-stone-400">
                      <div className="flex justify-between">
                        <span>Requested:</span>
                        <span className="text-stone-200 font-medium">{entry.bottlesRequested} bottle(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allocation Price:</span>
                        <span className="text-stone-200 font-medium">{formatPrice(entry.bottlePrice * entry.bottlesRequested, adminSettings.currencySymbol)}</span>
                      </div>
                      {entry.assignedBottleNumbers && entry.assignedBottleNumbers.length > 0 && (
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>Assigned Bottle:</span>
                          <span>{entry.assignedBottleNumbers.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {isWinner && (
                      <button
                        onClick={() => handleClaim(entry.id)}
                        disabled={claimingEntryId === entry.id}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        {claimingEntryId === entry.id ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Crown className="w-3.5 h-3.5" />
                            <span>Claim Winning Bottle Now</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/80 border border-stone-800">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              id="ballot-search-input"
              placeholder="Search allocations, casks, vintage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-stone-950 border border-stone-700/80 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs text-stone-400 font-medium flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>Status:</span>
            </span>
            {[
              { label: 'All Releases', value: 'all' },
              { label: 'Open Draws', value: 'open' },
              { label: 'Coming Soon', value: 'upcoming' },
              { label: 'Completed Draws', value: 'drawing_completed' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-950/40'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Allocations Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredAllocations.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 rounded-2xl border border-stone-800 space-y-4">
            <Wine className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="font-cinzel text-xl font-bold text-stone-300">No Allocations Match Your Criteria</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Try adjusting your category or status filters to view other limited distillery releases.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAllocations.map(alloc => {
              const userEntryForAlloc = userEntries.find(e => e.allocationId === alloc.id);
              const isOpen = alloc.status === 'open';
              const isUpcoming = alloc.status === 'upcoming';
              const isDrawn = alloc.status === 'drawing_completed';
              const isSoldOut = alloc.status === 'sold_out';

              const entrantsCount = Math.max(alloc.totalEntrants, ballotEntries.filter(e => e.allocationId === alloc.id).length);
              const ratio = (entrantsCount / Math.max(1, alloc.totalBottlesAvailable)).toFixed(1);

              return (
                <div
                  key={alloc.id}
                  id={`ballot-card-${alloc.id}`}
                  className="group bg-stone-900/90 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Card Image Container */}
                  <div className="relative h-64 w-full bg-stone-950 overflow-hidden flex items-center justify-center p-6">
                    <img
                      src={alloc.imageUrl}
                      alt={alloc.productName}
                      className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 bg-stone-950/85 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-md">
                        {alloc.spiritCategory}
                      </span>
                      <span className="px-2.5 py-0.5 bg-stone-900/80 text-stone-300 text-[9px] font-semibold rounded">
                        Vintage {alloc.distillationYear}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isOpen && (
                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Ballot Open</span>
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          Coming Soon
                        </span>
                      )}
                      {isDrawn && (
                        <span className="px-2.5 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          Draw Closed
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="px-2.5 py-1 bg-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          Vault Sealed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                          {alloc.editionName}
                        </span>
                        <span className="font-cinzel text-lg font-bold text-amber-400">
                          {formatPrice(alloc.bottlePrice, adminSettings.currencySymbol)}
                        </span>
                      </div>

                      <h3 className="font-cinzel text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors leading-snug">
                        {alloc.title}
                      </h3>

                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {alloc.description}
                      </p>
                    </div>

                    {/* Specification Badges */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-800/80 text-center text-[11px]">
                      <div className="p-1.5 rounded bg-stone-950/60">
                        <span className="text-stone-500 block text-[9px] uppercase font-bold">ABV</span>
                        <span className="text-stone-200 font-semibold">{alloc.abvPercent}%</span>
                      </div>
                      <div className="p-1.5 rounded bg-stone-950/60">
                        <span className="text-stone-500 block text-[9px] uppercase font-bold">Age</span>
                        <span className="text-stone-200 font-semibold">{alloc.ageStatement}</span>
                      </div>
                      <div className="p-1.5 rounded bg-stone-950/60">
                        <span className="text-stone-500 block text-[9px] uppercase font-bold">Cask Yield</span>
                        <span className="text-stone-200 font-semibold">{alloc.totalBottlesAvailable} Btls</span>
                      </div>
                    </div>

                    {/* Demand & Live Meter */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <span>Entrant Demand</span>
                        </span>
                        <span className="text-amber-400 font-semibold">{entrantsCount} Entrants ({ratio}x)</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (entrantsCount / alloc.totalBottlesAvailable) * 50)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>Draw: {new Date(alloc.drawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </span>
                        <span>Max {alloc.maxBottlesPerEntrant} Btl/Collector</span>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-2 space-y-2">
                      {userEntryForAlloc ? (
                        <div className="space-y-2">
                          <div className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
                            userEntryForAlloc.status === 'selected_winner'
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                              : userEntryForAlloc.status === 'claimed_paid'
                              ? 'bg-stone-950 border-stone-700 text-stone-300'
                              : 'bg-amber-950/30 border-amber-600/30 text-amber-300'
                          }`}>
                            {userEntryForAlloc.status === 'selected_winner' ? (
                              <span>Winner Selected! Ticket {userEntryForAlloc.ticketNumber}</span>
                            ) : userEntryForAlloc.status === 'claimed_paid' ? (
                              <span>Allocated & Paid Direct</span>
                            ) : (
                              <span>Entered • Ticket {userEntryForAlloc.ticketNumber}</span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedAllocationForDetail(alloc)}
                            className="w-full py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition cursor-pointer"
                          >
                            View Details & Ticket Info
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedAllocationForDetail(alloc)}
                            className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition cursor-pointer"
                          >
                            Spirit Profile
                          </button>
                          <button
                            onClick={() => {
                              if (!isCustomerLoggedIn) {
                                openAuthModal('login');
                              } else {
                                setSelectedAllocationForEntry(alloc);
                              }
                            }}
                            disabled={!isOpen}
                            className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                              isOpen
                                ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md shadow-amber-950/50 cursor-pointer'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>{isOpen ? 'Enter Draw' : 'Closed'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How The Ballot System Works Section */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-stone-800/80">
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-100">
            How The Allocation Draw Works
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
            Ensuring every spirits connoisseur has an equal, bot-proof opportunity to acquire ultra-rare single cask releases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              1
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">Register Interest</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Browse open single-cask expressions and submit your entry with desired bottle quantities and preferred serial numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              2
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">Identity Verification</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every entrant is verified for legal drinking age and one entry per household to prevent scalping and secondary exploitation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              3
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">Fair Ballot Draw</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              On draw date, our cryptographically fair lottery engine selects winners and assigns unique bottle serial certifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              4
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">72-Hour Claim Window</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Selected collectors have 72 hours to complete purchase. Sealed bottles are dispatched with insured temperature-controlled courier delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Global Modals for Allocation Details and Entries */}
      {selectedAllocationForEntry && (
        <BallotEntryModal
          allocation={selectedAllocationForEntry}
          onClose={() => setSelectedAllocationForEntry(null)}
        />
      )}

      {selectedAllocationForDetail && (
        <BallotDetailModal
          allocation={selectedAllocationForDetail}
          onClose={() => setSelectedAllocationForDetail(null)}
        />
      )}
    </div>
  );
};
