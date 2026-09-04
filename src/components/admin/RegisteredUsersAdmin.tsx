import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerUser, LoyaltyTier, Order } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  Copy,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  MapPin,
  ExternalLink,
  ChevronRight,
  Package,
  CheckCircle2,
  AlertCircle,
  Globe
} from 'lucide-react';

export const RegisteredUsersAdmin: React.FC = () => {
  const {
    registeredCustomers,
    saveCustomerByAdmin,
    deleteCustomerByAdmin,
    orders,
    adminSettings,
    forceCloudResync,
    setActiveInvoiceOrder
  } = useStore();

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [authFilter, setAuthFilter] = useState<'all' | 'google' | 'email'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | LoyaltyTier>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'spend_desc' | 'points_desc' | 'name_asc'>('date_desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal States
  const [inspectingUser, setInspectingUser] = useState<CustomerUser | null>(null);
  const [editingUser, setEditingUser] = useState<CustomerUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [userForm, setUserForm] = useState<Partial<CustomerUser>>({
    name: '',
    email: '',
    phone: '',
    loyaltyTier: 'Silver Cask',
    loyaltyPoints: 100,
    totalSpent: 0,
    authProvider: 'email',
    accountStatus: 'active',
    spiritPreferences: ['Single Malt Whisky', 'Cask Strength Bourbon'],
    adminNotes: ''
  });

  // Feedback Notification
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // KPIs
  const stats = useMemo(() => {
    const total = registeredCustomers.length;
    const googleCount = registeredCustomers.filter(u => u.authProvider === 'google' || !!u.googleUid).length;
    const emailCount = total - googleCount;
    const totalSpent = registeredCustomers.reduce((acc, u) => acc + (u.totalSpent || 0), 0);
    const totalPoints = registeredCustomers.reduce((acc, u) => acc + (u.loyaltyPoints || 0), 0);

    return {
      total,
      googleCount,
      emailCount,
      totalSpent,
      totalPoints
    };
  }, [registeredCustomers]);

  // Filter and Sort Customers
  const filteredCustomers = useMemo(() => {
    return registeredCustomers.filter(user => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.name?.toLowerCase().includes(q);
        const matchEmail = user.email?.toLowerCase().includes(q);
        const matchPhone = user.phone?.toLowerCase().includes(q);
        const matchGoogleUid = user.googleUid?.toLowerCase().includes(q);
        const matchNotes = user.adminNotes?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchGoogleUid && !matchNotes) {
          return false;
        }
      }

      // Auth Filter
      if (authFilter === 'google') {
        const isGoogle = user.authProvider === 'google' || !!user.googleUid;
        if (!isGoogle) return false;
      } else if (authFilter === 'email') {
        const isGoogle = user.authProvider === 'google' || !!user.googleUid;
        if (isGoogle) return false;
      }

      // Tier Filter
      if (tierFilter !== 'all') {
        if (user.loyaltyTier !== tierFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.dateJoined || 0).getTime() - new Date(a.dateJoined || 0).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.dateJoined || 0).getTime() - new Date(b.dateJoined || 0).getTime();
      }
      if (sortBy === 'spend_desc') {
        return (b.totalSpent || 0) - (a.totalSpent || 0);
      }
      if (sortBy === 'points_desc') {
        return (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0);
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [registeredCustomers, searchQuery, authFilter, tierFilter, sortBy]);

  // Find orders for a user
  const getUserOrders = (user: CustomerUser): Order[] => {
    const userEmail = user.email.toLowerCase();
    return orders.filter(
      o => (o.id !== 'ord-9921' && o.id !== 'ord-9840') && (
           o.customerId === user.id ||
           (o.customerEmail && o.customerEmail.toLowerCase() === userEmail) ||
           (o.customerName && o.customerName.toLowerCase() === user.name.toLowerCase()) ||
           o.shippingAddress?.fullName?.toLowerCase() === user.name.toLowerCase() ||
           o.payment?.transactionId?.includes(user.id) ||
           o.notes?.toLowerCase().includes(userEmail)
      )
    );
  };

  // Open Edit Modal
  const handleOpenEdit = (user: CustomerUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyaltyTier: user.loyaltyTier,
      loyaltyPoints: user.loyaltyPoints,
      totalSpent: user.totalSpent,
      authProvider: user.authProvider || 'email',
      accountStatus: user.accountStatus || 'active',
      spiritPreferences: user.spiritPreferences || [],
      adminNotes: user.adminNotes || ''
    });
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsAddingUser(true);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      loyaltyTier: 'Silver Cask',
      loyaltyPoints: 100,
      totalSpent: 0,
      authProvider: 'email',
      accountStatus: 'active',
      spiritPreferences: ['Single Malt Whisky', 'Cask Strength Bourbon'],
      adminNotes: ''
    });
  };

  // Save Patron (Add or Edit)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name?.trim()) {
      showToast('Patron name is required.');
      return;
    }
    if (!userForm.email?.trim() || !userForm.email.includes('@')) {
      showToast('Valid patron email is required.');
      return;
    }

    if (editingUser) {
      const updated: CustomerUser = {
        ...editingUser,
        name: userForm.name.trim(),
        email: userForm.email.trim().toLowerCase(),
        phone: userForm.phone?.trim() || editingUser.phone,
        loyaltyTier: (userForm.loyaltyTier as LoyaltyTier) || editingUser.loyaltyTier,
        loyaltyPoints: Number(userForm.loyaltyPoints) || 0,
        totalSpent: Number(userForm.totalSpent) || 0,
        authProvider: userForm.authProvider || editingUser.authProvider,
        accountStatus: userForm.accountStatus || editingUser.accountStatus,
        spiritPreferences: userForm.spiritPreferences || editingUser.spiritPreferences,
        adminNotes: userForm.adminNotes || ''
      };
      await saveCustomerByAdmin(updated);
      showToast(`Patron profile "${updated.name}" updated successfully.`);
      setEditingUser(null);
      if (inspectingUser?.id === updated.id) {
        setInspectingUser(updated);
      }
    } else if (isAddingUser) {
      const newUser: CustomerUser = {
        id: `cust-admin-${Date.now()}`,
        name: userForm.name.trim(),
        email: userForm.email.trim().toLowerCase(),
        phone: userForm.phone?.trim() || '+1 (555) 012-3456',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        loyaltyTier: (userForm.loyaltyTier as LoyaltyTier) || 'Silver Cask',
        loyaltyPoints: Number(userForm.loyaltyPoints) || 100,
        totalSpent: Number(userForm.totalSpent) || 0,
        dateJoined: new Date().toISOString().split('T')[0],
        emailNotifications: true,
        smsNotifications: false,
        addresses: [],
        spiritPreferences: userForm.spiritPreferences || ['Single Malt Whisky'],
        authProvider: userForm.authProvider || 'email',
        accountStatus: userForm.accountStatus || 'active',
        isEmailVerified: true,
        lastLoginAt: new Date().toISOString(),
        adminNotes: userForm.adminNotes || ''
      };
      await saveCustomerByAdmin(newUser);
      showToast(`New patron "${newUser.name}" registered successfully.`);
      setIsAddingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string) => {
    const user = registeredCustomers.find(u => u.id === id);
    await deleteCustomerByAdmin(id);
    setDeletingUserId(null);
    if (inspectingUser?.id === id) {
      setInspectingUser(null);
    }
    showToast(`Patron "${user?.name || id}" removed.`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Patron ID',
      'Name',
      'Email',
      'Phone Number',
      'Auth Provider',
      'Google UID',
      'Google Email',
      'Loyalty Tier',
      'Loyalty Points',
      'Total Spent ($)',
      'Date Joined',
      'Account Status',
      'Admin Notes'
    ];

    const rows = filteredCustomers.map(u => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.phone || ''}"`,
      `"${u.authProvider || 'email'}"`,
      `"${u.googleUid || ''}"`,
      `"${u.googleEmail || ''}"`,
      `"${u.loyaltyTier}"`,
      u.loyaltyPoints,
      (u.totalSpent / 100).toFixed(2),
      `"${u.dateJoined || ''}"`,
      `"${u.accountStatus || 'active'}"`,
      `"${(u.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zookas_registered_patrons_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Patrons directory exported to CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-amber-500 text-stone-950 text-sm font-semibold rounded-xl shadow-xl shadow-amber-500/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-stone-900 border border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Vault Patrons CMS
            </span>
            <span className="text-xs text-stone-400">
              • Real-Time Cloud Firestore Synchronized
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Registered Patrons & Member Directory
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            View full patron account profiles, phone contacts, email addresses, and Google OAuth credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => forceCloudResync().then(() => showToast('Database resynchronized.'))}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition border border-stone-700 cursor-pointer"
            title="Refresh from cloud database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Cloud</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition border border-stone-700 cursor-pointer"
            title="Export patron list to CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Patron</span>
          </button>
        </div>
      </div>

      {/* Google OAuth & Authorized Domain Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/20 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 mt-0.5">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-200">
                Google OAuth Authorized Domain:
              </span>
              <span className="font-mono text-xs text-amber-400 font-bold bg-stone-950 px-2 py-0.5 rounded border border-amber-500/30">
                zookasunityspirits.in
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400">
                Configured in App
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Google Auth requires <code className="text-amber-300 font-mono font-semibold">zookasunityspirits.in</code> and <code className="text-amber-300 font-mono font-semibold">www.zookasunityspirits.in</code> allowlisted in Firebase Console (Authentication &gt; Settings &gt; Authorized domains).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              navigator.clipboard.writeText('zookasunityspirits.in');
              showToast('Domain "zookasunityspirits.in" copied to clipboard.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 rounded-xl text-xs font-semibold border border-stone-700 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Domain</span>
          </button>

          <a
            href="https://console.firebase.google.com/project/commanding-path-sxctm/authentication/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <span>Open Firebase Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patrons */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-100">
            {stats.total}
          </p>
          <span className="text-[11px] text-stone-400">All registered vault accounts</span>
        </div>

        {/* Google Login Users */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Google Sign-In</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <p className="font-serif text-2xl font-bold text-amber-400">
            {stats.googleCount}
          </p>
          <span className="text-[11px] text-amber-400/80">
            {stats.total > 0 ? Math.round((stats.googleCount / stats.total) * 100) : 0}% of all patrons
          </span>
        </div>

        {/* Email Registered */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Email & Password</span>
            <Mail className="w-4 h-4 text-stone-300" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-100">
            {stats.emailCount}
          </p>
          <span className="text-[11px] text-stone-400">Direct registered accounts</span>
        </div>

        {/* Total Patron Spend */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Cumulative Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-400">
            {formatPrice(stats.totalSpent, adminSettings.currencySymbol)}
          </p>
          <span className="text-[11px] text-stone-400">Lifetime purchases</span>
        </div>

        {/* Total Loyalty Points */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Loyalty Points</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-400">
            {stats.totalPoints.toLocaleString()}
          </p>
          <span className="text-[11px] text-stone-400">Active member points</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email, Google UID..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Auth Method Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={authFilter}
              onChange={e => setAuthFilter(e.target.value as any)}
              aria-label="Filter by sign-in method"
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Auth Methods</option>
              <option value="google">Google Sign-In Only</option>
              <option value="email">Email / Direct Only</option>
            </select>
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as any)}
            aria-label="Filter by loyalty tier"
            className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Cellar Tiers</option>
            <option value="Master Distiller Circle">Master Distiller Circle</option>
            <option value="Gold Cask">Gold Cask</option>
            <option value="Silver Cask">Silver Cask</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="Sort registered patrons"
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="date_desc">Newest Joined</option>
              <option value="date_asc">Oldest Joined</option>
              <option value="spend_desc">Highest Spend</option>
              <option value="points_desc">Most Points</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                viewMode === 'table' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                viewMode === 'cards' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* User Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-400 px-1">
        <span>
          Showing <strong className="text-amber-400">{filteredCustomers.length}</strong> of{' '}
          <strong className="text-stone-300">{registeredCustomers.length}</strong> patrons
        </span>
        {searchQuery && (
          <span className="text-amber-400/90">
            Filtered by: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Main Content: Table or Cards */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <Users className="w-10 h-10 text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-300">No patrons match your criteria</h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            Try adjusting your search query or reset your authentication and tier filters to view registered users.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setAuthFilter('all');
              setTierFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/20 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-900 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-950/60">
                <th className="py-3.5 px-4">Patron Name & Photo</th>
                <th className="py-3.5 px-4">Contact (Email & Phone)</th>
                <th className="py-3.5 px-4">Auth Method & Google Data</th>
                <th className="py-3.5 px-4">Tier & Points</th>
                <th className="py-3.5 px-4">Orders & Spend</th>
                <th className="py-3.5 px-4">Date Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-xs">
              {filteredCustomers.map(user => {
                const isGoogle = user.authProvider === 'google' || !!user.googleUid;
                const userOrders = getUserOrders(user);

                return (
                  <tr key={user.id} className="hover:bg-stone-800/40 transition">
                    {/* Patron Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-stone-700 bg-stone-800"
                            onError={e => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {/* Badge on avatar */}
                          {isGoogle ? (
                            <span
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm p-0.5"
                              title="Google Authenticated"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                              </svg>
                            </span>
                          ) : (
                            <span
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-stone-700 flex items-center justify-center text-[9px] text-stone-300 shadow-sm"
                              title="Email Registered"
                            >
                              <Mail className="w-2.5 h-2.5 text-stone-200" />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-100">{user.name}</span>
                            {user.accountStatus === 'vip' && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 block font-mono">
                            ID: {user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <a
                            href={`mailto:${user.email}`}
                            className="text-stone-200 hover:text-amber-400 transition underline-offset-2 hover:underline"
                          >
                            {user.email}
                          </a>
                          <button
                            onClick={() => copyToClipboard(user.email, 'Email')}
                            className="text-stone-500 hover:text-stone-300 p-0.5"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{user.phone || 'No phone recorded'}</span>
                          {user.phone && (
                            <button
                              onClick={() => copyToClipboard(user.phone, 'Phone')}
                              className="text-stone-500 hover:text-stone-300 p-0.5"
                              title="Copy phone"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Auth Method & Google Login Data */}
                    <td className="py-3.5 px-4">
                      {isGoogle ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                            Google OAuth
                          </span>

                          {user.googleUid && (
                            <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                              <span>UID: {user.googleUid.slice(0, 10)}...</span>
                              <button
                                onClick={() => copyToClipboard(user.googleUid!, 'Google UID')}
                                className="text-stone-500 hover:text-stone-300"
                                title="Copy full Google UID"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}

                          {user.isEmailVerified && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                              <ShieldCheck className="w-3 h-3" />
                              Google Verified
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[11px] font-medium">
                            <Mail className="w-3 h-3 text-stone-400" />
                            Email & Password
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            Direct Registration
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Loyalty Tier & Points */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          user.loyaltyTier === 'Master Distiller Circle'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : user.loyaltyTier === 'Gold Cask'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-stone-700/50 text-stone-300 border border-stone-600'
                        }`}>
                          {user.loyaltyTier}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                          <Award className="w-3.5 h-3.5" />
                          <span className="font-semibold">{user.loyaltyPoints.toLocaleString()} pts</span>
                        </div>
                      </div>
                    </td>

                    {/* Orders & Spend */}
                    <td className="py-3.5 px-4">
                      <div>
                        <strong className="text-stone-100 font-semibold block">
                          {formatPrice(user.totalSpent, adminSettings.currencySymbol)}
                        </strong>
                        <span className="text-[11px] text-stone-400">
                          {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'} placed
                        </span>
                      </div>
                    </td>

                    {/* Date Registered & Last Active */}
                    <td className="py-3.5 px-4 text-stone-400">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs text-stone-300">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          <span>{user.dateJoined || '2024'}</span>
                        </div>
                        {user.lastLoginAt && (
                          <div className="flex items-center gap-1 text-[10px] text-stone-500">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Active: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingUser(user)}
                          className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
                          title="View complete patron dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
                          title="Edit patron details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUserId(user.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition"
                          title="Remove patron"
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
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(user => {
            const isGoogle = user.authProvider === 'google' || !!user.googleUid;
            const userOrders = getUserOrders(user);

            return (
              <div
                key={user.id}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition flex flex-col justify-between space-y-4 shadow-md"
              >
                <div>
                  {/* Top Bar with Avatar and Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border border-stone-700 bg-stone-800"
                        />
                        {isGoogle && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 shadow">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-stone-100 text-base">{user.name}</h4>
                        <span className="text-[11px] text-stone-400 font-mono">ID: {user.id}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.loyaltyTier === 'Master Distiller Circle'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : user.loyaltyTier === 'Gold Cask'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-stone-800 text-stone-300 border border-stone-700'
                    }`}>
                      {user.loyaltyTier}
                    </span>
                  </div>

                  {/* Auth Indicator */}
                  <div className="mb-3">
                    {isGoogle ? (
                      <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                            Google Authenticated
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        </div>
                        {user.googleUid && (
                          <div className="text-[10px] font-mono text-stone-400 flex items-center justify-between">
                            <span>UID: {user.googleUid.slice(0, 16)}...</span>
                            <button
                              onClick={() => copyToClipboard(user.googleUid!, 'Google UID')}
                              className="text-stone-400 hover:text-stone-200"
                            >
                              <Copy className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs text-stone-400">
                        <span className="flex items-center gap-1.5 text-stone-300">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          Email & Password Registration
                        </span>
                        <span className="text-[10px] text-stone-500">Direct</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-1.5 text-xs text-stone-300 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-stone-200 font-medium">{user.email}</span>
                        <button
                          onClick={() => copyToClipboard(user.email, 'Email')}
                          className="text-stone-500 hover:text-stone-300"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        Phone
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-stone-200">{user.phone || 'N/A'}</span>
                        {user.phone && (
                          <button
                            onClick={() => copyToClipboard(user.phone, 'Phone')}
                            className="text-stone-500 hover:text-stone-300"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spend and Points Pill */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase tracking-wider">Total Spent</span>
                      <strong className="text-emerald-400 font-semibold font-serif text-sm">
                        {formatPrice(user.totalSpent, adminSettings.currencySymbol)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase tracking-wider">Loyalty Points</span>
                      <strong className="text-amber-400 font-semibold font-serif text-sm">
                        {user.loyaltyPoints.toLocaleString()} pts
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500">
                    Joined {user.dateJoined || '2024'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectingUser(user)}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 rounded-lg transition border border-amber-500/20"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="p-1 text-stone-400 hover:text-stone-200"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingUserId(user.id)}
                      className="p-1 text-stone-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: COMPLETE PATRON DOSSIER INSPECTOR */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header with Avatar and Name */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-800 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={inspectingUser.avatar}
                  alt={inspectingUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30 bg-stone-800 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-stone-100">
                      {inspectingUser.name}
                    </h3>
                    {inspectingUser.accountStatus === 'vip' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        VIP Patron
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Internal Identifier: {inspectingUser.id}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                    inspectingUser.loyaltyTier === 'Master Distiller Circle'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : inspectingUser.loyaltyTier === 'Gold Cask'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}>
                    {inspectingUser.loyaltyTier} • {inspectingUser.loyaltyPoints.toLocaleString()} Points
                  </span>
                </div>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="text-stone-400 hover:text-stone-200 p-1.5 rounded-xl hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Authentication Dossier (Highlighted) */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  Authentication Provider & Google Identity
                </span>

                {inspectingUser.authProvider === 'google' || inspectingUser.googleUid ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Google OAuth Linked
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-400 border border-stone-700">
                    Direct Email / Password
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400 block uppercase">Auth Method</span>
                  <span className="font-semibold text-stone-200">
                    {inspectingUser.authProvider === 'google' || inspectingUser.googleUid
                      ? 'Google Sign-In (google.com)'
                      : 'Email & Password'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400 block uppercase">Email Verification</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {inspectingUser.isEmailVerified !== false ? 'Verified Primary Email' : 'Unverified'}
                  </span>
                </div>

                {inspectingUser.googleUid && (
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800/80 sm:col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase">Google Subject Identifier (UID)</span>
                    <div className="flex items-center justify-between font-mono text-xs text-amber-400 mt-0.5">
                      <span>{inspectingUser.googleUid}</span>
                      <button
                        onClick={() => copyToClipboard(inspectingUser.googleUid!, 'Google UID')}
                        className="text-stone-400 hover:text-stone-200 flex items-center gap-1 text-[11px]"
                      >
                        <Copy className="w-3 h-3" />
                        Copy UID
                      </button>
                    </div>
                  </div>
                )}

                {inspectingUser.googleEmail && inspectingUser.googleEmail !== inspectingUser.email && (
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800/80 sm:col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase">Google Account Email</span>
                    <span className="font-semibold text-stone-200">{inspectingUser.googleEmail}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400 block uppercase">Registration Date</span>
                  <span className="font-semibold text-stone-200">{inspectingUser.dateJoined || '2024-01-01'}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800/80">
                  <span className="text-[10px] text-stone-400 block uppercase">Last Activity Session</span>
                  <span className="font-semibold text-stone-200">
                    {inspectingUser.lastLoginAt ? new Date(inspectingUser.lastLoginAt).toLocaleString() : 'Active Session'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Notifications */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Direct Contact & Notification Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Primary Phone</span>
                    <strong className="text-stone-100 font-semibold">{inspectingUser.phone || 'Not recorded'}</strong>
                  </div>
                  {inspectingUser.phone && (
                    <button
                      onClick={() => copyToClipboard(inspectingUser.phone, 'Phone')}
                      className="p-1.5 text-stone-400 hover:text-stone-200"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Email Address</span>
                    <strong className="text-stone-100 font-semibold">{inspectingUser.email}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inspectingUser.email, 'Email')}
                    className="p-1.5 text-stone-400 hover:text-stone-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-400">Newsletter & Release Dispatches</span>
                  <span className={`font-semibold ${inspectingUser.emailNotifications ? 'text-emerald-400' : 'text-stone-500'}`}>
                    {inspectingUser.emailNotifications ? 'Opted In' : 'Opted Out'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-400">Urgent SMS Cask Dispatch Alerts</span>
                  <span className={`font-semibold ${inspectingUser.smsNotifications ? 'text-emerald-400' : 'text-stone-500'}`}>
                    {inspectingUser.smsNotifications ? 'Opted In' : 'Opted Out'}
                  </span>
                </div>
              </div>
            </div>

            {/* Spirit Preferences */}
            {inspectingUser.spiritPreferences && inspectingUser.spiritPreferences.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Artisanal Spirit Preferences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inspectingUser.spiritPreferences.map((pref, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Shipping Addresses */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                <span>Vault Delivery Addresses ({inspectingUser.addresses?.length || 0})</span>
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
              </h4>

              {inspectingUser.addresses && inspectingUser.addresses.length > 0 ? (
                <div className="space-y-2">
                  {inspectingUser.addresses.map((addr, idx) => (
                    <div
                      key={addr.id || idx}
                      className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-stone-100 font-semibold">{addr.fullName}</strong>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.2 text-[9px] rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-stone-300 mt-1">{addr.street}</p>
                        <p className="text-stone-400">
                          {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                        </p>
                        <p className="text-stone-500 text-[11px] mt-0.5">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic p-3 rounded-xl bg-stone-950 border border-stone-800">
                  No saved shipping addresses on file for this patron yet.
                </p>
              )}
            </div>

            {/* Admin Notes */}
            {inspectingUser.adminNotes && (
              <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/20 space-y-1 text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                  Distillery Cellar Master Notes
                </span>
                <p className="text-stone-300 italic">{inspectingUser.adminNotes}</p>
              </div>
            )}

            {/* Orders Placed by Patron */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                <span>Associated Order History ({getUserOrders(inspectingUser).length})</span>
                <Package className="w-3.5 h-3.5 text-stone-400" />
              </h4>

              {getUserOrders(inspectingUser).length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getUserOrders(inspectingUser).map(ord => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 font-semibold">{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 font-medium">
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-stone-500 text-[11px]">
                          {new Date(ord.date).toLocaleDateString()} • {ord.items.length} items
                        </span>
                      </div>

                      <div className="text-right">
                        <strong className="text-stone-100 block font-serif">
                          {formatPrice(ord.total, adminSettings.currencySymbol)}
                        </strong>
                        <button
                          onClick={() => {
                            setActiveInvoiceOrder(ord);
                            setInspectingUser(null);
                          }}
                          className="text-[11px] text-amber-400 hover:underline"
                        >
                          View Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic p-3 rounded-xl bg-stone-950 border border-stone-800">
                  No orders recorded for this patron profile yet.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const toEdit = inspectingUser;
                  setInspectingUser(null);
                  handleOpenEdit(toEdit);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Patron Details</span>
              </button>

              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PATRON */}
      {(editingUser || isAddingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveUser}
            className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-stone-100">
                {editingUser ? `Edit Patron: ${editingUser.name}` : 'Register New Patron'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setIsAddingUser(false);
                }}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Lord Arthur Sterling"
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="e.g. arthur@casksociety.com"
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Phone Number</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 392-8812"
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Auth Method Selection */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Authentication Type</label>
                <select
                  value={userForm.authProvider}
                  onChange={e => setUserForm({ ...userForm, authProvider: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="email">Standard Email & Password Registration</option>
                  <option value="google">Google OAuth Sign-In (google.com)</option>
                  <option value="guest">Guest Vault Pass</option>
                </select>
              </div>

              {/* Loyalty Tier & Points */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold block">Loyalty Tier</label>
                  <select
                    value={userForm.loyaltyTier}
                    onChange={e => setUserForm({ ...userForm, loyaltyTier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Silver Cask">Silver Cask</option>
                    <option value="Gold Cask">Gold Cask</option>
                    <option value="Master Distiller Circle">Master Distiller Circle</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold block">Loyalty Points</label>
                  <input
                    type="number"
                    value={userForm.loyaltyPoints}
                    onChange={e => setUserForm({ ...userForm, loyaltyPoints: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Total Spent */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Lifetime Spent (Cents, e.g. 215000 = $2,150.00)</label>
                <input
                  type="number"
                  value={userForm.totalSpent}
                  onChange={e => setUserForm({ ...userForm, totalSpent: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Account Status */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Account Status</label>
                <select
                  value={userForm.accountStatus}
                  onChange={e => setUserForm({ ...userForm, accountStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="active">Active Cellar Member</option>
                  <option value="vip">VIP Founding Connoisseur</option>
                  <option value="suspended">Suspended / Inactive</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div className="space-y-1">
                <label className="text-stone-400 font-semibold block">Admin & Sommelier Notes</label>
                <textarea
                  rows={3}
                  value={userForm.adminNotes}
                  onChange={e => setUserForm({ ...userForm, adminNotes: e.target.value })}
                  placeholder="Special allocations, cellar locker preferences, concierge notes..."
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setIsAddingUser(false);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Patron</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deletingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-stone-100">Remove Registered Patron</h3>
            </div>
            <p className="text-xs text-stone-400">
              Are you sure you want to remove this patron from the registry? This action will remove the account from Firestore.
            </p>
            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingUserId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deletingUserId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
