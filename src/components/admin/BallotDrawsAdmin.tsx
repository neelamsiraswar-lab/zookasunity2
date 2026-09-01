import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BallotAllocation, BallotEntry, BallotStatus, SpiritCategory } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Crown,
  Sparkles,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Flame,
  Wine,
  Ticket,
  Save,
  RotateCcw,
  Layers,
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { CloudImageUploader } from '../CloudImageUploader';

export const BallotDrawsAdmin: React.FC = () => {
  const {
    ballotAllocations,
    ballotEntries,
    drawBallotLottery,
    saveBallotAllocation,
    deleteBallotAllocation,
    products,
    adminSettings
  } = useStore();

  const [selectedAllocationId, setSelectedAllocationId] = useState<string>(
    ballotAllocations[0]?.id || ''
  );
  const [allocationModalOpen, setAllocationModalOpen] = useState<boolean>(false);
  const [editingAllocId, setEditingAllocId] = useState<string | null>(null);
  const [entrantSearch, setEntrantSearch] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawNotification, setDrawNotification] = useState<string | null>(null);

  // Form State for Allocation
  const [allocForm, setAllocForm] = useState<BallotAllocation>({
    id: '',
    title: 'Single Cask Bourbon Reserve 1999',
    editionName: 'Cellar Vault Series #04',
    spiritCategory: 'Bourbon',
    productName: '1999 High-Rye Cask Strength Bourbon',
    linkedProductId: products[0]?.id || '',
    bottlePrice: 380,
    totalBottlesAvailable: 120,
    bottlesRemaining: 120,
    maxBottlesPerEntrant: 1,
    mashBill: '75% Heritage Corn, 21% Rye, 4% Malted Barley',
    caskType: 'Charred American Oak Tier 4',
    abvPercent: 57.8,
    ageStatement: '25 Years',
    bottleSize: '750ml',
    distillationYear: 1999,
    registrationStartDate: new Date().toISOString(),
    registrationEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
    description: 'A quarter-century in single charred oak. Unfiltered, rich, and dense.',
    tastingNotes: ['Pipe Tobacco', 'Dark Demerara', 'Toasted Pecan', 'Leather'],
    totalEntrants: 0,
    totalBottlesRequested: 0
  });

  const [tastingNotesInput, setTastingNotesInput] = useState<string>(
    allocForm.tastingNotes.join(', ')
  );

  const activeAllocation = ballotAllocations.find(a => a.id === selectedAllocationId) || ballotAllocations[0];
  const activeEntries = ballotEntries.filter(e => e.allocationId === (activeAllocation?.id || ''));

  const filteredEntrants = activeEntries.filter(e => {
    if (!entrantSearch.trim()) return true;
    const q = entrantSearch.toLowerCase();
    return (
      e.ticketNumber.toLowerCase().includes(q) ||
      e.customerName.toLowerCase().includes(q) ||
      e.customerEmail.toLowerCase().includes(q) ||
      e.status.toLowerCase().includes(q)
    );
  });

  // Top Metrics
  const totalAllocations = ballotAllocations.length;
  const totalEntrantsCount = ballotEntries.length;
  const totalWinnersCount = ballotEntries.filter(e => e.status === 'selected_winner' || e.status === 'claimed_paid').length;
  const totalClaimedCount = ballotEntries.filter(e => e.status === 'claimed_paid').length;

  const handleOpenAdd = () => {
    setEditingAllocId(null);
    const newId = `alloc-${Date.now()}`;
    setAllocForm({
      id: newId,
      title: 'Small Batch Single Cask Release',
      editionName: `Distillery Allocation #${ballotAllocations.length + 1}`,
      spiritCategory: 'Bourbon',
      productName: 'Cask Strength Single Barrel Reserve',
      linkedProductId: products[0]?.id || '',
      bottlePrice: 275,
      totalBottlesAvailable: 150,
      bottlesRemaining: 150,
      maxBottlesPerEntrant: 1,
      mashBill: '70% Corn, 20% Rye, 10% Barley',
      caskType: 'First-Fill Toasted White Oak',
      abvPercent: 54.2,
      ageStatement: '14 Years',
      bottleSize: '750ml',
      distillationYear: 2012,
      registrationStartDate: new Date().toISOString(),
      registrationEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      drawDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80',
      description: 'Extracted directly from the center tier of Rickhouse B.',
      tastingNotes: ['Caramelised Sugar', 'Toasted Oak', 'Vanilla Bean', 'Cinnamon'],
      totalEntrants: 0,
      totalBottlesRequested: 0
    });
    setTastingNotesInput('Caramelised Sugar, Toasted Oak, Vanilla Bean, Cinnamon');
    setAllocationModalOpen(true);
  };

  const handleOpenEdit = (alloc: BallotAllocation) => {
    setEditingAllocId(alloc.id);
    setAllocForm({ ...alloc });
    setTastingNotesInput((alloc.tastingNotes || []).join(', '));
    setAllocationModalOpen(true);
  };

  const handleSaveAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const notes = tastingNotesInput.split(',').map(s => s.trim()).filter(Boolean);
    const updated: BallotAllocation = {
      ...allocForm,
      tastingNotes: notes.length > 0 ? notes : ['Charred Oak', 'Rich Toffee']
    };
    await saveBallotAllocation(updated);
    setAllocationModalOpen(false);
    setSelectedAllocationId(updated.id);
    setDrawNotification(`Allocation release "${updated.title}" successfully saved!`);
    setTimeout(() => setDrawNotification(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this ballot allocation and all associated entrant registrations?')) {
      await deleteBallotAllocation(id);
      setDrawNotification('Ballot allocation removed.');
      setTimeout(() => setDrawNotification(null), 3000);
    }
  };

  const handleExecuteDraw = async (allocationId: string) => {
    if (!confirm('Execute Fair Cryptographic Ballot Draw now? This will randomly select winners, assign serial numbers, and open the 72-hour claim window.')) {
      return;
    }

    setIsDrawing(true);
    try {
      const res = await drawBallotLottery(allocationId);
      if (res.success) {
        setDrawNotification(`Ballot Lottery Complete! ${res.winnersSelected} collectors have been selected as winners and assigned certified bottle numbers.`);
      } else {
        setDrawNotification('No registered entrants available to draw.');
      }
    } catch (e: any) {
      setDrawNotification(`Draw execution failed: ${e?.message || 'Error'}`);
    } finally {
      setIsDrawing(false);
      setTimeout(() => setDrawNotification(null), 6000);
    }
  };

  return (
    <div className="space-y-8" id="admin-ballot-draws-manager">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Rare Spirit Allocations & Ballots
            </span>
            <span className="text-xs text-stone-500 font-mono">Lottery & Bonded Dispatch</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100 mt-1">
            Ballot Draws & Collector Allocations
          </h2>
          <p className="text-xs text-stone-400">
            Create limited single-cask lotteries, manage entrant registration pools, and execute verified fair draws.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Rare Allocation</span>
        </button>
      </div>

      {/* Notification Toast */}
      {drawNotification && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{drawNotification}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 uppercase font-semibold block">Total Allocations</span>
          <strong className="font-cinzel text-2xl font-bold text-amber-400">{totalAllocations}</strong>
          <span className="text-[11px] text-stone-500 block">Single-Cask Releases</span>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 uppercase font-semibold block">Collector Entrants</span>
          <strong className="font-cinzel text-2xl font-bold text-stone-100">{totalEntrantsCount}</strong>
          <span className="text-[11px] text-stone-500 block">Registered Tickets in Pool</span>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 uppercase font-semibold block">Selected Winners</span>
          <strong className="font-cinzel text-2xl font-bold text-emerald-400">{totalWinnersCount}</strong>
          <span className="text-[11px] text-stone-500 block">Lottery Winners Awarded</span>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 uppercase font-semibold block">Claimed & Paid</span>
          <strong className="font-cinzel text-2xl font-bold text-amber-300">{totalClaimedCount}</strong>
          <span className="text-[11px] text-stone-500 block">Bottles Dispatched</span>
        </div>
      </div>

      {/* Allocations Management Table */}
      <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-cinzel text-base font-bold text-stone-100 flex items-center gap-2">
            <Wine className="w-4 h-4 text-amber-400" />
            <span>Active Spirit Allocations ({ballotAllocations.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] font-bold border-b border-stone-800">
              <tr>
                <th className="p-4">Spirit & Edition</th>
                <th className="p-4">Category / Cask</th>
                <th className="p-4">Price</th>
                <th className="p-4">Demand / Yield</th>
                <th className="p-4">Draw Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {ballotAllocations.map(alloc => {
                const entrants = ballotEntries.filter(e => e.allocationId === alloc.id).length;
                const ratio = (entrants / Math.max(1, alloc.totalBottlesAvailable)).toFixed(1);
                const isSelected = activeAllocation?.id === alloc.id;

                return (
                  <tr
                    key={alloc.id}
                    onClick={() => setSelectedAllocationId(alloc.id)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-amber-950/20 border-l-4 border-l-amber-500'
                        : 'hover:bg-stone-800/40'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={alloc.imageUrl}
                          alt={alloc.productName}
                          className="w-10 h-12 object-cover rounded-lg border border-stone-800 shrink-0"
                        />
                        <div>
                          <strong className="text-stone-100 font-semibold block">{alloc.title}</strong>
                          <span className="text-[11px] text-amber-400/90">{alloc.editionName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-stone-200 font-medium block">{alloc.spiritCategory}</span>
                      <span className="text-[11px] text-stone-400">{alloc.caskType}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-cinzel text-sm font-bold text-amber-400">{formatPrice(alloc.bottlePrice, adminSettings.currencySymbol)}</span>
                      <span className="text-[10px] text-stone-500 block">Max {alloc.maxBottlesPerEntrant}/user</span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="text-stone-200 font-semibold">{entrants} entrants / {alloc.totalBottlesAvailable} yield</span>
                        <span className="text-[10px] text-amber-400 block font-medium">({ratio}x Oversubscribed)</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-stone-300">{new Date(alloc.drawDate).toLocaleDateString()}</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        alloc.status === 'open'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : alloc.status === 'upcoming'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : alloc.status === 'drawing_completed'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}>
                        {alloc.status === 'drawing_completed' ? 'Draw Complete' : alloc.status}
                      </span>
                    </td>

                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {alloc.status === 'open' && (
                          <button
                            onClick={() => handleExecuteDraw(alloc.id)}
                            disabled={isDrawing}
                            title="Execute Fair Randomized Draw Now"
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(alloc)}
                          title="Edit Allocation Specs"
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(alloc.id)}
                          title="Delete Allocation"
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Allocation Entrants Registry */}
      {activeAllocation && (
        <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                <h3 className="font-cinzel text-base font-bold text-stone-100">
                  Entrant Ledger: {activeAllocation.title}
                </h3>
              </div>
              <span className="text-xs text-stone-400">
                {activeEntries.length} registered collectors competing for {activeAllocation.totalBottlesAvailable} bottles
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by ticket, name, status..."
                  value={entrantSearch}
                  onChange={(e) => setEntrantSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-lg text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {activeAllocation.status === 'open' && (
                <button
                  onClick={() => handleExecuteDraw(activeAllocation.id)}
                  disabled={isDrawing || activeEntries.length === 0}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-1.5 shadow whitespace-nowrap cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Execute Draw</span>
                </button>
              )}
            </div>
          </div>

          {filteredEntrants.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              No registered entrants found for this allocation release.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950/60 text-stone-400 uppercase text-[10px] font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-3">Ticket #</th>
                    <th className="p-3">Collector</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Requested</th>
                    <th className="p-3">Preferred Serial</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned Bottle #</th>
                    <th className="p-3">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredEntrants.map(ent => (
                    <tr key={ent.id} className="hover:bg-stone-800/30">
                      <td className="p-3 font-mono font-bold text-amber-400">
                        {ent.ticketNumber}
                      </td>
                      <td className="p-3">
                        <strong className="text-stone-200 block">{ent.customerName}</strong>
                        <span className="text-[11px] text-stone-500">{ent.customerEmail}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-stone-950 text-stone-300 border border-stone-800 rounded text-[10px] font-semibold">
                          {ent.loyaltyTier}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-stone-200">
                        {ent.bottlesRequested} bottle(s)
                      </td>
                      <td className="p-3 text-stone-400">
                        {ent.preferredBottleNumbers && ent.preferredBottleNumbers.length > 0
                          ? `#${ent.preferredBottleNumbers.join(', #')}`
                          : 'Any Serial'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ent.status === 'selected_winner'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : ent.status === 'claimed_paid'
                            ? 'bg-stone-800 text-stone-300'
                            : ent.status === 'waitlisted'
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'bg-stone-950 text-stone-400'
                        }`}>
                          {ent.status === 'selected_winner' ? 'Selected Winner' : ent.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {ent.assignedBottleNumbers?.join(', ') || '—'}
                      </td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {new Date(ent.registeredAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Allocation Modal */}
      {allocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-stone-100 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>{editingAllocId ? 'Edit Rare Ballot Allocation' : 'Create Rare Ballot Allocation'}</span>
              </h3>
              <button onClick={() => setAllocationModalOpen(false)} className="text-stone-400 hover:text-stone-100">✕</button>
            </div>

            <form onSubmit={handleSaveAllocation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Allocation Title</label>
                  <input
                    type="text"
                    required
                    value={allocForm.title}
                    onChange={(e) => setAllocForm({ ...allocForm, title: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Edition Series Name</label>
                  <input
                    type="text"
                    required
                    value={allocForm.editionName}
                    onChange={(e) => setAllocForm({ ...allocForm, editionName: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Spirit Category</label>
                  <select
                    value={allocForm.spiritCategory}
                    onChange={(e) => setAllocForm({ ...allocForm, spiritCategory: e.target.value as SpiritCategory })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Bourbon">Bourbon</option>
                    <option value="Rye">Rye</option>
                    <option value="Single Malt">Single Malt</option>
                    <option value="Botanical Gin">Botanical Gin</option>
                    <option value="Rum">Rum</option>
                    <option value="Agave">Agave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Bottle Price ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={allocForm.bottlePrice}
                    onChange={(e) => setAllocForm({ ...allocForm, bottlePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Total Single-Cask Yield</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={allocForm.totalBottlesAvailable}
                    onChange={(e) => setAllocForm({ ...allocForm, totalBottlesAvailable: parseInt(e.target.value, 10) || 0, bottlesRemaining: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">ABV %</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={allocForm.abvPercent}
                    onChange={(e) => setAllocForm({ ...allocForm, abvPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Age Statement</label>
                  <input
                    type="text"
                    required
                    value={allocForm.ageStatement}
                    onChange={(e) => setAllocForm({ ...allocForm, ageStatement: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Distillation Year</label>
                  <input
                    type="number"
                    required
                    value={allocForm.distillationYear}
                    onChange={(e) => setAllocForm({ ...allocForm, distillationYear: parseInt(e.target.value, 10) || 2020 })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Cask Type</label>
                  <input
                    type="text"
                    required
                    value={allocForm.caskType}
                    onChange={(e) => setAllocForm({ ...allocForm, caskType: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Mash Bill</label>
                  <input
                    type="text"
                    required
                    value={allocForm.mashBill}
                    onChange={(e) => setAllocForm({ ...allocForm, mashBill: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image selector */}
              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase">Spirit Bottle Image URL</label>
                <CloudImageUploader
                  currentImageUrl={allocForm.imageUrl}
                  onImageUploaded={(url) => setAllocForm({ ...allocForm, imageUrl: url })}
                  label="Allocation Showcase Image"
                  aspectRatio="3:4"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase">Tasting Notes (comma-separated)</label>
                <input
                  type="text"
                  value={tastingNotesInput}
                  onChange={(e) => setTastingNotesInput(e.target.value)}
                  placeholder="e.g. Dark Demerara, Pipe Tobacco, Toasted Pecan, Honeycomb"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase">Allocation Narrative Description</label>
                <textarea
                  rows={2}
                  required
                  value={allocForm.description}
                  onChange={(e) => setAllocForm({ ...allocForm, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setAllocationModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition"
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
