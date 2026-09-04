import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/currency';
import { Address } from '../../types';
import { 
  User, 
  Package, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Wine, 
  Mail,
  Phone,
  Calendar,
  Sparkles,
  LogOut,
  LogIn,
  ArrowRight,
  Ticket,
  Crown,
  Clock,
  ExternalLink
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    customer,
    isCustomerLoggedIn,
    openAuthModal,
    logoutCustomer,
    updateCustomerProfile,
    customerOrders,
    setActiveInvoiceOrder,
    addCustomerAddress,
    deleteCustomerAddress,
    setDefaultAddress,
    addToCart,
    setActiveTab,
    getUserBallotEntries,
    claimBallotAllocation,
    ballotAllocations,
    adminSettings
  } = useStore();

  const userBallots = getUserBallotEntries();
  const [activeAccountSubTab, setActiveAccountSubTab] = useState<'orders' | 'ballots' | 'profile' | 'addresses'>('orders');
  const [claimingEntryId, setClaimingEntryId] = useState<string | null>(null);
  const [newAddrModal, setNewAddrModal] = useState<boolean>(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    fullName: customer.name,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: customer.phone,
    isDefault: false
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddr.street && newAddr.city) {
      addCustomerAddress(newAddr);
      setNewAddrModal(false);
      setNewAddr({
        fullName: customer.name,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: customer.phone,
        isDefault: false
      });
    }
  };

  // Customer Lifetime Volume
  const lifetimeVolume = useMemo(() => {
    return customerOrders.reduce((sum, o) => sum + o.total, 0);
  }, [customerOrders]);

  // If customer is currently logged out, display high-contrast Patron Portal sign-in
  if (!isCustomerLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 w-full max-w-full overflow-x-hidden">
        <div className="rounded-3xl bg-stone-900 border border-amber-600/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Wine className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Cellar Society Patron Access
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              Patron Account Portal
            </h1>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Sign in to manage your artisanal cask allocations, track active dispatch shipments, and review official invoices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-x-hidden">
      {/* Header Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-600/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-amber-500 text-stone-950 rounded-lg shadow">
              <User className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Distillery Patron Account
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-0.5">
              {customer.name}
            </h1>
            <p className="text-xs text-stone-400 mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400/80" /> Member Since {customer.dateJoined}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> {customer.email}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Account Stats & Sign Out */}
        <div className="flex flex-wrap items-center gap-3 text-center">
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 min-w-28">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Vault Orders</span>
            <strong className="text-xl font-serif text-amber-400">{customerOrders.length}</strong>
            <span className="text-[10px] text-stone-500 block">Total Dispatches</span>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 min-w-28">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Account Volume</span>
            <strong className="text-xl font-serif text-stone-100">
              {formatPrice(customerOrders.length > 0 ? (customer.totalSpent > 0 ? customer.totalSpent : lifetimeVolume) : 0, adminSettings.currencySymbol)}
            </strong>
            <span className="text-[10px] text-stone-500 block">Lifetime Reserved</span>
          </div>
          <button
            onClick={logoutCustomer}
            className="p-4 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 text-xs font-semibold flex flex-col items-center justify-center transition gap-1 min-w-24"
            title="Sign out of account"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
        {[
          { id: 'orders', label: `Order History (${customerOrders.length})`, icon: Package },
          { id: 'ballots', label: `Allocations & Ballot Tickets (${userBallots.length})`, icon: Ticket },
          { id: 'addresses', label: 'Saved Address Book', icon: MapPin },
          { id: 'profile', label: 'Taste Preferences & Alerts', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAccountSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAccountSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Ballot Tickets & Allocations */}
      {activeAccountSubTab === 'ballots' && (
        <div className="space-y-6" id="account-ballots-tab">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-stone-100">
                Your Registered Ballot Allocations
              </h3>
              <p className="text-xs text-stone-400">
                Track lottery entries, claim winning allocations within the 72-hour window, and view bonded bottle certifications.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('allocations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Browse Open Draws</span>
            </button>
          </div>

          {userBallots.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <Ticket className="w-12 h-12 text-stone-600 mx-auto" />
              <h3 className="font-cinzel text-lg font-bold text-stone-200">No Ballot Registrations Found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                You haven't entered any limited edition spirit draws yet. Enter our open ballots to secure allocations of ultra-rare single cask expressions.
              </p>
              <button
                onClick={() => { setActiveTab('allocations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
              >
                View Open Rare Spirit Draws
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBallots.map((entry) => {
                const isWinner = entry.status === 'selected_winner';
                const isClaimed = entry.status === 'claimed_paid';
                const alloc = ballotAllocations.find(a => a.id === entry.allocationId);

                return (
                  <div
                    key={entry.id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl ${
                      isWinner
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-950/30'
                        : isClaimed
                        ? 'bg-stone-900/90 border-stone-700'
                        : 'bg-stone-900/60 border-stone-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-amber-400" />
                          <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                            {entry.ticketNumber}
                          </span>
                        </div>
                        <h4 className="font-cinzel text-base font-bold text-stone-100 mt-1">
                          {entry.productName}
                        </h4>
                        <span className="text-xs text-stone-400 block">{entry.allocationTitle}</span>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isWinner
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : isClaimed
                          ? 'bg-stone-800 text-stone-300 border border-stone-700'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isWinner ? 'Winner Selected!' : isClaimed ? 'Allocated & Paid' : 'Entry Active in Pool'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-950/60 text-xs border border-stone-800/80">
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Bottles</span>
                        <span className="text-stone-200 font-semibold">{entry.bottlesRequested} bottle(s)</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Total Allocation</span>
                        <span className="text-amber-400 font-semibold">{formatPrice(entry.bottlePrice * entry.bottlesRequested, adminSettings.currencySymbol)}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Registered On</span>
                        <span className="text-stone-300">{new Date(entry.registeredAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Entrant Number</span>
                        <span className="text-stone-300">#{entry.entrantNumber}</span>
                      </div>
                    </div>

                    {entry.assignedBottleNumbers && entry.assignedBottleNumbers.length > 0 && (
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center justify-between">
                        <span className="text-stone-300">Official Assigned Bottle:</span>
                        <strong className="text-emerald-400 font-mono font-bold text-sm">
                          {entry.assignedBottleNumbers.join(', ')}
                        </strong>
                      </div>
                    )}

                    {isWinner && (
                      <div className="space-y-2 pt-2">
                        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                          <Crown className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Congratulations! Your ticket was selected in the fair draw. Complete checkout to secure dispatch.</span>
                        </div>
                        <button
                          onClick={async () => {
                            setClaimingEntryId(entry.id);
                            try {
                              await claimBallotAllocation(entry.id);
                            } finally {
                              setClaimingEntryId(null);
                            }
                          }}
                          disabled={claimingEntryId === entry.id}
                          className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                        >
                          {claimingEntryId === entry.id ? (
                            <span>Claiming & Generating Order...</span>
                          ) : (
                            <>
                              <Crown className="w-4 h-4" />
                              <span>Claim & Purchase Allocation ({formatPrice(entry.bottlePrice * entry.bottlesRequested, adminSettings.currencySymbol)})</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders Management */}
      {activeAccountSubTab === 'orders' && (
        <div className="space-y-6">
          {customerOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <Package className="w-12 h-12 text-stone-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-200">No Orders in Vault Yet</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Explore our catalog of hand-distilled single casks and place your first reservation.
              </p>
              <button
                onClick={() => { setActiveTab('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
              >
                Browse Spirits Vault
              </button>
            </div>
          ) : (
            customerOrders.map((order) => {
              // Status progression
              const statusSteps = ['Distillery Packing', 'Batch Sealed', 'Dispatched', 'Delivered'];
              const currentStepIdx = statusSteps.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6 shadow-lg"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-stone-100">{order.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download Invoice</span>
                      </button>
                      <span className="font-serif text-lg font-bold text-amber-400">
                        {formatPrice(order.total, adminSettings.currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Order Milestone Timeline */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {statusSteps.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div key={step} className="space-y-1.5">
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${
                                  isDone
                                    ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold'
                                    : 'bg-stone-950 border-stone-700 text-stone-600'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                            </div>
                            <span
                              className={`text-[11px] font-medium block leading-tight ${
                                isCurrent
                                  ? 'text-amber-400 font-bold'
                                  : isDone
                                  ? 'text-stone-200'
                                  : 'text-stone-600'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {order.trackingNumber && (
                      <p className="text-[11px] text-stone-400 mt-4 text-center bg-stone-950 p-2 rounded-lg border border-stone-800">
                        Carrier Tracking: <strong className="text-amber-400 font-mono">{order.trackingNumber}</strong> via {order.carrier}
                      </p>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-stone-850 pt-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-700"
                          />
                          <div>
                            <p className="font-bold text-stone-200">{item.product.name}</p>
                            <p className="text-stone-400">
                              Qty: {item.quantity} • Cask: {item.product.caskNumber}
                            </p>
                            {item.customEngraving && (
                              <p className="text-amber-400/90 italic text-[11px]">
                                Engraved: "{item.customEngraving}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-stone-200">
                            {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity, adminSettings.currencySymbol)}
                          </span>
                          <button
                            onClick={() => addToCart(item.product, 1)}
                            className="px-2.5 py-1 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 text-[11px] font-medium rounded transition"
                          >
                            Re-Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Profile & Preferences */}
      {activeAccountSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flavor Preferences */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Personalized Cask Match</span>
              <h3 className="font-serif text-xl font-bold text-stone-100 mt-1">Spirit Flavor Preferences</h3>
              <p className="text-xs text-stone-400 mt-1">
                Select the flavor profiles you love. Our distillers use this for private allocation recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Single Malt Whisky',
                'Cask Strength Bourbon',
                'Pedro Ximénez Sherry Finish',
                'Heavy Char Oak',
                'Smoky Highland Peat',
                'Botanical Alpine Gin',
                'Pot Still Dark Rum',
                'Wild Oaxacan Tobalá Mezcal',
                'High Proof Cask Strength',
                'Triple-Filtered Vodka'
              ].map((pref) => {
                const isSelected = (customer.spiritPreferences || []).includes(pref);
                return (
                  <button
                    key={pref}
                    onClick={() => {
                      const currentPrefs = customer.spiritPreferences || [];
                      const updated = isSelected
                        ? currentPrefs.filter(p => p !== pref)
                        : [...currentPrefs, pref];
                      updateCustomerProfile({ spiritPreferences: updated });
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border border-amber-400'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications & Security */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Account Security</span>
              <h3 className="font-serif text-xl font-bold text-stone-100 mt-1">Communication & Alerts</h3>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                <div>
                  <p className="font-bold text-stone-200">Email Cask Allocation Alerts</p>
                  <p className="text-stone-400 text-[11px]">Receive notification 24 hours before public drop</p>
                </div>
                <input
                  type="checkbox"
                  checked={customer.emailNotifications}
                  onChange={(e) => updateCustomerProfile({ emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                <div>
                  <p className="font-bold text-stone-200">SMS Out-for-Delivery Alerts</p>
                  <p className="text-stone-400 text-[11px]">Direct SMS dispatch tracking with adult signature notice</p>
                </div>
                <input
                  type="checkbox"
                  checked={customer.smsNotifications}
                  onChange={(e) => updateCustomerProfile({ smsNotifications: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeAccountSubTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">Delivery Address Book</h3>
              <p className="text-xs text-stone-400">Insured spirits delivery requires an adult signature.</p>
            </div>
            <button
              onClick={() => setNewAddrModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200 text-sm">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-700 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-stone-300 pt-1">{addr.street}</p>
                  <p className="text-stone-400">{addr.city}, {addr.state} {addr.zipCode}</p>
                  <p className="text-stone-500">{addr.country} • Phone: {addr.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-amber-400 hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                  {customer.addresses.length > 1 && (
                    <button
                      onClick={() => deleteCustomerAddress(addr.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* New Address Modal */}
          {newAddrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h4 className="font-serif text-lg font-bold text-stone-100">Add New Delivery Location</h4>
                  <button onClick={() => setNewAddrModal(false)} className="text-stone-400">✕</button>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 742 Amber Cask Blvd"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-stone-400 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newAddr.zipCode}
                        onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                        className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Phone Number (Required for 21+ Courier)</label>
                    <input
                      type="tel"
                      required
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setNewAddrModal(false)}
                      className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 text-stone-950 font-bold rounded-lg"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
