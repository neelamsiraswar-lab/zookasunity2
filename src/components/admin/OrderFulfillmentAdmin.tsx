import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, CartItem } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Truck,
  Search,
  Filter,
  Package,
  Box,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  User,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Wine,
  ShieldCheck,
  Crown,
  Sparkles,
  FileText,
  Layers,
  Calendar,
  Gift,
  ExternalLink,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

export const OrderFulfillmentAdmin: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrderTracking,
    adminSettings,
    setActiveInvoiceOrder,
    registeredCustomers
  } = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'total_desc' | 'name_asc'>('date_desc');
  const [viewMode, setViewMode] = useState<'orders' | 'product_manifest'>('orders');

  // Expanded order card states (all open by default for visibility)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Feedback notifications
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local editing states for tracking / carrier per order to allow instant typing before sync
  const [orderDrafts, setOrderDrafts] = useState<Record<string, { tracking: string; carrier: string; status: OrderStatus }>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied to clipboard: ${text.slice(0, 32)}${text.length > 32 ? '...' : ''}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Toggle order expansion
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: prev[orderId] === undefined ? false : !prev[orderId]
    }));
  };

  const isOrderExpanded = (orderId: string) => {
    // Default to true (expanded)
    return expandedOrders[orderId] !== false;
  };

  // Quick Tracking Number Generator
  const generateNewTrackingNumber = (orderId: string) => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const trackingNo = `ZUS-EXP-${randomDigits}`;
    const currentCarrier = orderDrafts[orderId]?.carrier || orders.find(o => o.id === orderId)?.carrier || 'Spirits Express Priority Courier';
    
    setOrderDrafts(prev => ({
      ...prev,
      [orderId]: {
        tracking: trackingNo,
        carrier: currentCarrier,
        status: prev[orderId]?.status || orders.find(o => o.id === orderId)?.status || 'Dispatched'
      }
    }));

    updateOrderTracking(orderId, trackingNo, currentCarrier);
    showToast(`Assigned tracking number ${trackingNo}`);
  };

  // Counts for status filters
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      packing: orders.filter(o => o.status === 'Distillery Packing').length,
      sealed: orders.filter(o => o.status === 'Batch Sealed').length,
      dispatched: orders.filter(o => o.status === 'Dispatched').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      totalRevenue: orders.reduce((acc, o) => acc + (o.total || 0), 0)
    };
  }, [orders]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter(ord => {
        // Status filter
        if (statusFilter !== 'all' && ord.status !== statusFilter) {
          return false;
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();

        // Customer details check
        const customerName = (ord.customerName || ord.shippingAddress?.fullName || '').toLowerCase();
        const customerEmail = (ord.customerEmail || '').toLowerCase();
        const customerPhone = (ord.customerPhone || ord.shippingAddress?.phone || '').toLowerCase();
        const city = (ord.shippingAddress?.city || '').toLowerCase();
        const state = (ord.shippingAddress?.state || '').toLowerCase();
        const orderNum = (ord.orderNumber || '').toLowerCase();
        const tracking = (ord.trackingNumber || '').toLowerCase();

        // Products check
        const hasProductMatch = ord.items?.some(it => 
          it.product.name.toLowerCase().includes(q) ||
          it.product.category.toLowerCase().includes(q) ||
          (it.customEngraving && it.customEngraving.toLowerCase().includes(q))
        );

        return (
          customerName.includes(q) ||
          customerEmail.includes(q) ||
          customerPhone.includes(q) ||
          city.includes(q) ||
          state.includes(q) ||
          orderNum.includes(q) ||
          tracking.includes(q) ||
          hasProductMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'total_desc') {
          return b.total - a.total;
        }
        if (sortBy === 'name_asc') {
          const nameA = (a.customerName || a.shippingAddress?.fullName || '').toLowerCase();
          const nameB = (b.customerName || b.shippingAddress?.fullName || '').toLowerCase();
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [orders, statusFilter, searchQuery, sortBy]);

  // Product-wise Aggregation: Group all ordered products across orders
  const productManifest = useMemo(() => {
    interface ProductOrderAllocation {
      orderId: string;
      orderNumber: string;
      orderDate: string;
      orderStatus: OrderStatus;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      shippingCity: string;
      shippingCountry: string;
      quantity: number;
      giftBox: boolean;
      customEngraving?: string;
    }

    interface AggregatedProduct {
      productId: string;
      productName: string;
      category: string;
      price: number;
      image: string;
      abv: string;
      bottleSize: string;
      totalBottlesOrdered: number;
      totalOrdersCount: number;
      allocations: ProductOrderAllocation[];
    }

    const map: Record<string, AggregatedProduct> = {};

    orders.forEach(ord => {
      ord.items?.forEach(item => {
        const prod = item.product;
        if (!map[prod.id]) {
          map[prod.id] = {
            productId: prod.id,
            productName: prod.name,
            category: prod.category,
            price: prod.price,
            image: prod.images?.[0] || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
            abv: prod.abv,
            bottleSize: prod.bottleSize || '750 ml',
            totalBottlesOrdered: 0,
            totalOrdersCount: 0,
            allocations: []
          };
        }

        map[prod.id].totalBottlesOrdered += item.quantity;
        map[prod.id].totalOrdersCount += 1;
        map[prod.id].allocations.push({
          orderId: ord.id,
          orderNumber: ord.orderNumber,
          orderDate: ord.date,
          orderStatus: ord.status,
          customerName: ord.customerName || ord.shippingAddress?.fullName || 'Distinguished Patron',
          customerEmail: ord.customerEmail || 'collector@cellar.com',
          customerPhone: ord.customerPhone || ord.shippingAddress?.phone || 'N/A',
          shippingCity: `${ord.shippingAddress?.city || ''}, ${ord.shippingAddress?.state || ''}`,
          shippingCountry: ord.shippingAddress?.country || '',
          quantity: item.quantity,
          giftBox: item.giftBox,
          customEngraving: item.customEngraving
        });
      });
    });

    return Object.values(map).sort((a, b) => b.totalBottlesOrdered - a.totalBottlesOrdered);
  }, [orders]);

  // Helper to find customer registered record if any
  const getCustomerTier = (email?: string, name?: string) => {
    if (!email && !name) return 'Valued Patron';
    const found = registeredCustomers.find(
      c => (email && c.email.toLowerCase() === email.toLowerCase()) || (name && c.name.toLowerCase() === name.toLowerCase())
    );
    return found?.loyaltyTier || 'Private Client';
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Distillery Packing':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/40 ring-amber-500/20';
      case 'Batch Sealed':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/40 ring-blue-500/20';
      case 'Dispatched':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/40 ring-purple-500/20';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 ring-emerald-500/20';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-stone-900 border border-amber-500 text-amber-200 text-xs flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Quick Metric Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Customer Orders & Dispatch Center
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Review detailed customer shipping profiles, itemized spirits packing lists, courier assignments, and warehouse fulfillment stages.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              viewMode === 'orders'
                ? 'bg-amber-500 text-stone-950 shadow font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Orders & Customer Details</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('product_manifest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              viewMode === 'product_manifest'
                ? 'bg-amber-500 text-stone-950 shadow font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Product-Wise Packing Manifest</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 bg-stone-900/90 border border-stone-800 rounded-xl">
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Total Orders</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-serif font-bold text-stone-100">{statusCounts.all}</span>
            <span className="text-[10px] text-stone-400">records</span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-900/90 border border-amber-900/40 rounded-xl">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">Distillery Packing</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-serif font-bold text-amber-400">{statusCounts.packing}</span>
            <span className="text-[10px] text-stone-400">pending</span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-900/90 border border-blue-900/40 rounded-xl">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Batch Sealed</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-serif font-bold text-blue-300">{statusCounts.sealed}</span>
            <span className="text-[10px] text-stone-400">stamped</span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-900/90 border border-purple-900/40 rounded-xl">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Dispatched</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-serif font-bold text-purple-300">{statusCounts.dispatched}</span>
            <span className="text-[10px] text-stone-400">in transit</span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-900/90 border border-emerald-900/40 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Total Fulfilled Value</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-serif font-bold text-emerald-300">
              {formatPrice(statusCounts.totalRevenue, adminSettings.currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-900/70 p-3 rounded-xl border border-stone-800">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone, city, order #, or spirit name..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Distillery Packing')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              statusFilter === 'Distillery Packing'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            Packing ({statusCounts.packing})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Batch Sealed')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              statusFilter === 'Batch Sealed'
                ? 'bg-blue-500 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            Sealed ({statusCounts.sealed})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Dispatched')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              statusFilter === 'Dispatched'
                ? 'bg-purple-500 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            Dispatched ({statusCounts.dispatched})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Delivered')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              statusFilter === 'Delivered'
                ? 'bg-emerald-500 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            Delivered ({statusCounts.delivered})
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-stone-950 border border-stone-700 text-stone-300 text-xs rounded-lg px-2.5 py-1.5 focus:border-amber-500 cursor-pointer"
          >
            <option value="date_desc">Newest Orders First</option>
            <option value="date_asc">Oldest Orders First</option>
            <option value="total_desc">Highest Value Total</option>
            <option value="name_asc">Customer Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: BY ORDER (CUSTOMER DETAILS + PRODUCT LIST WISE)                    */}
      {/* ========================================================================= */}
      {viewMode === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-stone-900/50 border border-stone-800 rounded-2xl space-y-3">
              <Package className="w-10 h-10 text-stone-600 mx-auto" />
              <h4 className="text-stone-300 font-semibold text-sm">No Orders Found</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No orders match your current search query or status filter. Try clearing filters or searching with different keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredOrders.map(ord => {
              const expanded = isOrderExpanded(ord.id);
              const customerName = ord.customerName || ord.shippingAddress?.fullName || 'Distinguished Patron';
              const customerEmail = ord.customerEmail || 'collector@cellar.com';
              const customerPhone = ord.customerPhone || ord.shippingAddress?.phone || 'No phone recorded';
              const loyaltyTier = getCustomerTier(ord.customerEmail, ord.customerName);
              const totalBottles = ord.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

              // Draft states for tracking & carrier
              const draftTracking = orderDrafts[ord.id]?.tracking !== undefined ? orderDrafts[ord.id].tracking : ord.trackingNumber;
              const draftCarrier = orderDrafts[ord.id]?.carrier !== undefined ? orderDrafts[ord.id].carrier : ord.carrier;
              const draftStatus = orderDrafts[ord.id]?.status !== undefined ? orderDrafts[ord.id].status : ord.status;

              return (
                <div
                  key={ord.id}
                  className="rounded-2xl bg-stone-900 border border-stone-800 shadow-xl overflow-hidden transition-all"
                >
                  {/* ORDER CARD HEADER */}
                  <div className="p-4 sm:p-5 bg-stone-950/60 border-b border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      {/* Order Number Badge */}
                      <span className="font-mono text-sm sm:text-base font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {ord.orderNumber}
                      </span>

                      {/* Status Badge */}
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ring-1 ${getStatusBadgeStyle(ord.status)}`}>
                        {ord.status}
                      </span>

                      {/* Date & Time */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        <span>
                          {new Date(ord.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-stone-600">•</span>
                        <span>
                          {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Bottles Count Badge */}
                      <span className="text-[11px] font-medium text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                        {totalBottles} {totalBottles === 1 ? 'Bottle' : 'Bottles'}
                      </span>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Order Total */}
                      <div className="text-right mr-1 sm:mr-2">
                        <span className="text-[10px] text-stone-500 uppercase block leading-tight">Order Total</span>
                        <span className="font-serif font-bold text-stone-100 text-base sm:text-lg">
                          {formatPrice(ord.total, adminSettings.currencySymbol)}
                        </span>
                      </div>

                      {/* Invoice Button */}
                      <button
                        type="button"
                        onClick={() => setActiveInvoiceOrder(ord)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition cursor-pointer border border-stone-700"
                        title="View and print official distillery invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Official</span> Invoice
                      </button>

                      {/* Expand / Collapse Button */}
                      <button
                        type="button"
                        onClick={() => toggleOrderExpand(ord.id)}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 rounded-lg transition cursor-pointer"
                        title={expanded ? 'Collapse order details' : 'Expand order details'}
                      >
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED CONTENT BODY */}
                  {expanded && (
                    <div className="p-4 sm:p-6 space-y-6">
                      {/* ================================================================= */}
                      {/* 1. CUSTOMER DETAILS & SHIPPING DESTINATION PROFILE                */}
                      {/* ================================================================= */}
                      <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-4 sm:p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-serif font-bold text-sm">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-stone-100 text-sm">
                                  {customerName}
                                </h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 flex items-center gap-1">
                                  <Crown className="w-3 h-3 text-amber-400" />
                                  <span>{loyaltyTier}</span>
                                </span>
                              </div>
                              <span className="text-[11px] text-stone-500">
                                Patron & Recipient Profile
                              </span>
                            </div>
                          </div>

                          {/* Quick copy shipping address */}
                          <button
                            type="button"
                            onClick={() => {
                              const fullAddr = `${customerName}\n${ord.shippingAddress?.street || ''}\n${ord.shippingAddress?.city || ''}, ${ord.shippingAddress?.state || ''} ${ord.shippingAddress?.zipCode || ''}\n${ord.shippingAddress?.country || ''}\nPhone: ${customerPhone}`;
                              copyToClipboard(fullAddr, `addr-${ord.id}`);
                            }}
                            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700/60 self-start sm:self-auto"
                          >
                            {copiedKey === `addr-${ord.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Address Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Full Shipping Label</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Customer Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Contact Channels */}
                          <div className="space-y-2 p-3 bg-stone-900/60 border border-stone-800/60 rounded-lg">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                              Contact Details
                            </span>
                            <div className="space-y-1.5 text-stone-300">
                              <div className="flex items-center gap-2 group">
                                <Mail className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0" />
                                <a
                                  href={`mailto:${customerEmail}`}
                                  className="truncate hover:text-amber-300 transition"
                                  title={customerEmail}
                                >
                                  {customerEmail}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(customerEmail, `email-${ord.id}`)}
                                  className="text-stone-500 hover:text-stone-300 ml-auto"
                                  title="Copy Email"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2 group">
                                <Phone className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0" />
                                <a
                                  href={`tel:${customerPhone}`}
                                  className="truncate hover:text-amber-300 transition"
                                >
                                  {customerPhone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(customerPhone, `phone-${ord.id}`)}
                                  className="text-stone-500 hover:text-stone-300 ml-auto"
                                  title="Copy Phone"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Destination */}
                          <div className="space-y-2 p-3 bg-stone-900/60 border border-stone-800/60 rounded-lg">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                              Delivery Destination
                            </span>
                            <div className="flex items-start gap-2 text-stone-300">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                              <div className="space-y-0.5 leading-relaxed">
                                <div className="font-semibold text-stone-100">{ord.shippingAddress?.fullName || customerName}</div>
                                <div>{ord.shippingAddress?.street}</div>
                                <div>
                                  {ord.shippingAddress?.city}, {ord.shippingAddress?.state} {ord.shippingAddress?.zipCode}
                                </div>
                                <div className="text-stone-400 font-medium">{ord.shippingAddress?.country}</div>
                              </div>
                            </div>
                          </div>

                          {/* Payment & Collector Insights */}
                          <div className="space-y-2 p-3 bg-stone-900/60 border border-stone-800/60 rounded-lg">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                              Payment & Security
                            </span>
                            <div className="space-y-1 text-stone-300">
                              <div className="flex items-center justify-between">
                                <span className="text-stone-500">Method:</span>
                                <span className="font-medium text-stone-200">
                                  {ord.payment?.cardBrand || 'Secured Card'} (•••• {ord.payment?.cardLast4 || '8821'})
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-stone-500">Loyalty Earned:</span>
                                <span className="text-amber-400 font-mono font-bold">
                                  +{ord.loyaltyPointsEarned || 0} pts
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-stone-500">Age Verification:</span>
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>21+ Verified</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Customer Notes / Delivery Instructions */}
                        {ord.notes && (
                          <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-lg flex items-start gap-2 text-xs">
                            <FileText className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-bold text-amber-300">Customer Packaging Instructions: </span>
                              <span className="text-stone-300">{ord.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ================================================================= */}
                      {/* 2. ORDERS PRODUCT LIST WISE                                       */}
                      {/* ================================================================= */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                          <div className="flex items-center gap-2">
                            <Wine className="w-4 h-4 text-amber-400" />
                            <h4 className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
                              Spirits & Products Ordered ({ord.items?.length || 0} Line Items • {totalBottles} Total Bottles)
                            </h4>
                          </div>
                          <span className="text-[11px] text-stone-500">
                            Warehouse Packing Checklist
                          </span>
                        </div>

                        {/* Itemized Table / Cards */}
                        <div className="rounded-xl border border-stone-800 overflow-hidden divide-y divide-stone-800 bg-stone-950">
                          {ord.items?.map((item, idx) => {
                            const prod = item.product;
                            const lineTotal = (prod.price || 0) * item.quantity;

                            return (
                              <div
                                key={`${prod.id}-${idx}`}
                                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-900/40 transition"
                              >
                                {/* Product Info with Thumbnail */}
                                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                  <img
                                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=150&q=80'}
                                    alt={prod.name}
                                    className="w-14 h-14 object-cover rounded-lg border border-stone-700 shrink-0 bg-stone-900"
                                  />
                                  <div className="min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-serif font-bold text-stone-100 text-sm">
                                        {prod.name}
                                      </span>
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                                        {prod.category}
                                      </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                                      {prod.abv && <span>ABV: <strong className="text-stone-200">{prod.abv}</strong></span>}
                                      {prod.bottleSize && <span>Size: <strong className="text-stone-200">{prod.bottleSize}</strong></span>}
                                      {prod.caskNumber && <span>Cask: <strong className="text-amber-400 font-mono">{prod.caskNumber}</strong></span>}
                                    </div>

                                    {/* Packaging Add-ons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                      {item.giftBox && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                                          <Gift className="w-3 h-3 text-amber-400" />
                                          <span>Artisanal Cedar Gift Box Included</span>
                                        </span>
                                      )}
                                      {item.customEngraving && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
                                          <Sparkles className="w-3 h-3 text-amber-400" />
                                          <span>Engraved: "{item.customEngraving}"</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Price & Quantity Breakdown */}
                                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                                  {/* Unit Price */}
                                  <div className="text-left sm:text-right">
                                    <span className="text-[10px] text-stone-500 block uppercase">Unit Price</span>
                                    <span className="text-xs text-stone-300 font-mono">
                                      {formatPrice(prod.price, adminSettings.currencySymbol)}
                                    </span>
                                  </div>

                                  {/* Quantity Badge */}
                                  <div className="text-center">
                                    <span className="text-[10px] text-stone-500 block uppercase">Quantity</span>
                                    <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold text-xs rounded-lg border border-amber-500/40">
                                      × {item.quantity} {item.quantity === 1 ? 'Bottle' : 'Bottles'}
                                    </span>
                                  </div>

                                  {/* Line Total */}
                                  <div className="text-right min-w-[70px]">
                                    <span className="text-[10px] text-stone-500 block uppercase">Subtotal</span>
                                    <span className="font-serif font-bold text-stone-100 text-sm">
                                      {formatPrice(lineTotal, adminSettings.currencySymbol)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ================================================================= */}
                      {/* 3. WAREHOUSE FULFILLMENT STAGE & COURIER DISPATCH CONTROLS        */}
                      {/* ================================================================= */}
                      <div className="p-4 sm:p-5 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-amber-400" />
                            <h4 className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
                              Warehouse Fulfillment Controls & Courier Assignment
                            </h4>
                          </div>
                          <span className="text-[11px] text-stone-500">
                            Real-Time Patron Notification & Tracking Sync
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                          {/* Fulfillment Status Select */}
                          <div className="space-y-1.5">
                            <label className="block text-stone-400 font-medium">
                              Fulfillment Stage
                            </label>
                            <select
                              value={draftStatus}
                              onChange={e => {
                                const newStatus = e.target.value as OrderStatus;
                                setOrderDrafts(prev => ({
                                  ...prev,
                                  [ord.id]: {
                                    tracking: draftTracking,
                                    carrier: draftCarrier,
                                    status: newStatus
                                  }
                                }));
                                updateOrderStatus(ord.id, newStatus);
                                showToast(`Order ${ord.orderNumber} stage updated to: ${newStatus}`);
                              }}
                              className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-200 font-semibold focus:border-amber-500 cursor-pointer"
                            >
                              <option value="Distillery Packing">Distillery Packing (Cellar Pull)</option>
                              <option value="Batch Sealed">Batch Sealed (Wax & Stamped)</option>
                              <option value="Dispatched">Dispatched (Courier Transit)</option>
                              <option value="Delivered">Delivered (Completed)</option>
                            </select>
                          </div>

                          {/* Tracking Number Input */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-stone-400 font-medium">Tracking Number</label>
                              <button
                                type="button"
                                onClick={() => generateNewTrackingNumber(ord.id)}
                                className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer hover:underline"
                              >
                                Auto-Generate
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={draftTracking}
                                onChange={e => {
                                  const val = e.target.value;
                                  setOrderDrafts(prev => ({
                                    ...prev,
                                    [ord.id]: {
                                      tracking: val,
                                      carrier: draftCarrier,
                                      status: draftStatus
                                    }
                                  }));
                                }}
                                onBlur={() => {
                                  updateOrderTracking(ord.id, draftTracking, draftCarrier);
                                }}
                                placeholder="e.g. ZUS-EXP-99214081"
                                className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-200 font-mono focus:border-amber-500 pr-8"
                              />
                              {draftTracking && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(draftTracking, `track-${ord.id}`)}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                                  title="Copy Tracking Number"
                                >
                                  {copiedKey === `track-${ord.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Courier Service Input */}
                          <div className="space-y-1.5">
                            <label className="block text-stone-400 font-medium">Courier Service Carrier</label>
                            <input
                              type="text"
                              value={draftCarrier}
                              onChange={e => {
                                const val = e.target.value;
                                setOrderDrafts(prev => ({
                                  ...prev,
                                  [ord.id]: {
                                    tracking: draftTracking,
                                    carrier: val,
                                    status: draftStatus
                                  }
                                }));
                              }}
                              onBlur={() => {
                                updateOrderTracking(ord.id, draftTracking, draftCarrier);
                              }}
                              placeholder="e.g. Spirits Express Priority Courier (Adult 21+ Required)"
                              className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-200 focus:border-amber-500"
                            />
                          </div>
                        </div>

                        {/* Quick Presets for Courier */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-stone-500 font-medium">Courier Presets:</span>
                          {[
                            'Spirits Express Priority Courier (Adult 21+ Required)',
                            'FedEx Priority Adult Signature 21+',
                            'Bonded Cellar European Freight (Temp Controlled)',
                            'DHL Express International Vault Service'
                          ].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setOrderDrafts(prev => ({
                                  ...prev,
                                  [ord.id]: {
                                    tracking: draftTracking,
                                    carrier: preset,
                                    status: draftStatus
                                  }
                                }));
                                updateOrderTracking(ord.id, draftTracking, preset);
                                showToast(`Carrier set to: ${preset.slice(0, 24)}...`);
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 cursor-pointer transition"
                            >
                              {preset.split(' ')[0]} {preset.split(' ')[1]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: PRODUCT-WISE PACKING & DISPATCH MANIFEST (WAREHOUSE AGGREGATED)     */}
      {/* ========================================================================= */}
      {viewMode === 'product_manifest' && (
        <div className="space-y-4">
          <div className="p-4 bg-stone-900/80 border border-amber-900/30 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-stone-300 font-semibold">
                Product-Wise Fulfillment Manifest: Grouped by spirits bottle catalog to streamline batch cellar pulling and customer parcel packaging.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              {productManifest.length} Active Spirits
            </span>
          </div>

          <div className="space-y-4">
            {productManifest.map(productGroup => (
              <div
                key={productGroup.productId}
                className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden shadow-lg"
              >
                {/* Product Header Strip */}
                <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={productGroup.image}
                      alt={productGroup.productName}
                      className="w-14 h-14 object-cover rounded-xl border border-stone-700 bg-stone-900 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-stone-100 text-base">
                          {productGroup.productName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                          {productGroup.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                        <span>Unit: <strong className="text-stone-200">{formatPrice(productGroup.price, adminSettings.currencySymbol)}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-stone-200">{productGroup.bottleSize}</strong></span>
                        <span>•</span>
                        <span>ABV: <strong className="text-stone-200">{productGroup.abv}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Required in Bond House */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 uppercase block leading-tight">Total Required</span>
                      <span className="font-mono text-xl font-bold text-amber-400">
                        {productGroup.totalBottlesOrdered} {productGroup.totalBottlesOrdered === 1 ? 'Bottle' : 'Bottles'}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">
                      across {productGroup.totalOrdersCount} {productGroup.totalOrdersCount === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                </div>

                {/* Customer Allocation Table for this Product */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-stone-800">
                    <thead className="bg-stone-950/70 text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Customer Name & Contact</th>
                        <th className="p-3.5">Order Number</th>
                        <th className="p-3.5">Destination City</th>
                        <th className="p-3.5 text-center">Bottles Ordered</th>
                        <th className="p-3.5">Packaging Notes</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 text-stone-300">
                      {productGroup.allocations.map((alloc, idx) => (
                        <tr key={`${alloc.orderId}-${idx}`} className="hover:bg-stone-850/50 transition">
                          <td className="p-3.5 font-medium">
                            <div className="font-semibold text-stone-100">{alloc.customerName}</div>
                            <div className="text-[11px] text-stone-500 font-mono">{alloc.customerEmail}</div>
                            <div className="text-[10px] text-stone-500">{alloc.customerPhone}</div>
                          </td>
                          <td className="p-3.5 font-mono text-amber-400 font-semibold">
                            {alloc.orderNumber}
                          </td>
                          <td className="p-3.5 text-stone-300">
                            <div>{alloc.shippingCity}</div>
                            <div className="text-[10px] text-stone-500">{alloc.shippingCountry}</div>
                          </td>
                          <td className="p-3.5 text-center font-mono font-bold text-amber-300">
                            × {alloc.quantity}
                          </td>
                          <td className="p-3.5">
                            {alloc.giftBox && (
                              <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 mr-1 mb-1">
                                🎁 Gift Box
                              </span>
                            )}
                            {alloc.customEngraving && (
                              <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
                                ✍ "{alloc.customEngraving}"
                              </span>
                            )}
                            {!alloc.giftBox && !alloc.customEngraving && (
                              <span className="text-stone-600 text-[11px]">Standard Packaging</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(alloc.orderStatus)}`}>
                              {alloc.orderStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const matchingOrder = orders.find(o => o.id === alloc.orderId);
                                if (matchingOrder) {
                                  setActiveInvoiceOrder(matchingOrder);
                                }
                              }}
                              className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] rounded transition cursor-pointer"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
