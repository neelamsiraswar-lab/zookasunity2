import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address, Order } from '../../types';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Truck, 
  CheckCircle2, 
  Gift, 
  Sparkles, 
  ArrowLeft, 
  ShoppingBag,
  Clock,
  Printer,
  ChevronRight,
  Wine,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartGiftBoxTotal,
    cartShippingFee,
    cartTaxAmount,
    cartTotal,
    customer,
    isCustomerLoggedIn,
    openAuthModal,
    logoutCustomer,
    switchCustomerAccount,
    demoCustomersList,
    adminSettings,
    placeOrder,
    setActiveTab,
    setActiveInvoiceOrder
  } = useStore();

  // Guest details state
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestCreateAccount, setGuestCreateAccount] = useState<boolean>(false);

  // Selected shipping address for logged-in user
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customer.addresses.find(a => a.isDefault)?.id || customer.addresses[0]?.id || ''
  );

  // New address state if user wants to enter custom / guest
  const [useNewAddress, setUseNewAddress] = useState<boolean>(!isCustomerLoggedIn || customer.addresses.length === 0);
  const [customAddress, setCustomAddress] = useState<Address>({
    id: 'addr-custom',
    fullName: isCustomerLoggedIn ? customer.name : '',
    street: '',
    city: '',
    state: 'CA',
    zipCode: '',
    country: 'United States',
    phone: isCustomerLoggedIn ? customer.phone : '',
    isDefault: false
  });

  // Shipping Speed
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentType, setPaymentType] = useState<'card' | 'apple_pay' | 'cask_wire' | 'gift_card'>('card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('09/28');
  const [cardCvv, setCardCvv] = useState<string>('882');
  const [cardHolder, setCardHolder] = useState<string>(customer.name);

  // Age confirmation checkbox
  const [legalAgeAccepted, setLegalAgeAccepted] = useState<boolean>(true);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Processing & Placed state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculations
  const extraExpressFee = shippingMethod === 'express' ? 13 : 0;
  const finalPayableTotal = Math.max(
    0,
    Number((cartTotal + extraExpressFee).toFixed(2))
  );

  // If cart is empty and no order completed, redirect or show message
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-stone-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-stone-100">No Spirits in Checkout Bag</h2>
        <p className="text-xs text-stone-400">
          Your cask selection is currently empty. Visit the Spirits Vault to reserve your bottles.
        </p>
        <button
          onClick={() => setActiveTab('products')}
          className="px-6 py-3 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
        >
          Explore Spirits Vault
        </button>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalAgeAccepted) {
      alert('You must certify that you are 21 years of age or older.');
      return;
    }

    const shippingAddress = useNewAddress
      ? customAddress
      : customer.addresses.find(a => a.id === selectedAddressId) || customer.addresses[0];

    if (!shippingAddress || !shippingAddress.street) {
      alert('Please select or provide a valid delivery address.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder({
        shippingAddress,
        payment: {
          type: paymentType,
          cardLast4: paymentType === 'card' ? cardNumber.slice(-4) : '8821',
          cardBrand: paymentType === 'apple_pay' ? 'Apple Pay Express' : 'Visa Signature'
        },
        loyaltyPointsToUse: 0,
        notes: orderNotes
      });

      setIsProcessing(false);
      setCompletedOrder(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // Order Complete Celebration Screen
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 w-full max-w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-stone-900 border border-amber-600/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl"
        >
          {/* Badge & Check */}
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Distiller Batch Reservation Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              Thank You for Your Order, {customer.name}!
            </h1>
            <p className="text-xs text-stone-300 max-w-lg mx-auto">
              Your artisanal spirits order <strong className="text-amber-400 font-mono">{completedOrder.orderNumber}</strong> has been transmitted to our master distillery bond house.
            </p>
          </div>

          {/* Key Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs">
            <div className="p-2">
              <span className="text-stone-500 block uppercase tracking-wider text-[10px]">Total Paid</span>
              <strong className="text-amber-400 font-serif text-lg">${completedOrder.total.toFixed(2)}</strong>
            </div>
            <div className="p-2">
              <span className="text-stone-500 block uppercase tracking-wider text-[10px]">Tracking Number</span>
              <strong className="text-stone-200 font-mono text-xs truncate block">{completedOrder.trackingNumber}</strong>
            </div>
            <div className="p-2">
              <span className="text-stone-500 block uppercase tracking-wider text-[10px]">Verification</span>
              <strong className="text-emerald-400 font-serif text-sm">21+ ID Required</strong>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-stone-300 text-left space-y-1">
            <p className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Adult Signature Mandate (21+)
            </p>
            <p className="text-stone-400">
              Dispatched via {completedOrder.carrier}. The courier will inspect a government-issued ID prior to handing over the package.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveInvoiceOrder(completedOrder)}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Official Invoice</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              Track in Customer Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Customer Session Status Banner */}
      {isCustomerLoggedIn ? (
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
            />
            <div>
              <p className="text-stone-300">
                Checking out as <strong className="text-amber-400 font-bold">{customer.name}</strong> ({customer.email})
              </p>
              <p className="text-[11px] text-stone-500">
                Using saved addresses & small-batch reservation preferences
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('demo')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition"
            >
              Switch Account
            </button>
            <button
              onClick={logoutCustomer}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-300">
                Have a Spirits Cellar Society Account?
              </p>
              <p className="text-stone-400 text-[11px]">
                Sign in to auto-fill saved shipping addresses and sync your order history.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition shadow"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('demo')}
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl transition"
            >
              1-Click Demo Logins
            </button>
          </div>
        </div>
      )}

      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-6">
        <button
          onClick={() => setActiveTab('products')}
          className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Spirits Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Shipping, Loyalty & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Legal 21+ Age Certification */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Step 1 • Legal Compliance
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Legal Drinking Age Certification
            </h3>
            <label className="flex items-start gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer text-xs text-stone-300">
              <input
                type="checkbox"
                required
                checked={legalAgeAccepted}
                onChange={(e) => setLegalAgeAccepted(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded mt-0.5"
              />
              <span>
                I certify that I am at least <strong>21 years of age</strong>, and the recipient designated at the delivery address is legally eligible to receive alcohol shipments under state and federal regulations.
              </span>
            </label>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Step 2 • Dispatch Destination
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Select Delivery Address
            </h3>

            {!useNewAddress && customer.addresses.length > 0 ? (
              <div className="space-y-3">
                {customer.addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                      selectedAddressId === addr.id
                        ? 'bg-amber-950/40 border-amber-500 text-stone-100'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping-address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="w-4 h-4 text-amber-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-200">{addr.fullName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-[11px] text-stone-500">Phone: {addr.phone}</p>
                    </div>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setUseNewAddress(true)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  + Ship to a different address
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={customAddress.fullName}
                    onChange={(e) => setCustomAddress({ ...customAddress, fullName: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Amber Cask Blvd, Suite 18"
                    value={customAddress.street}
                    onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-stone-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={customAddress.city}
                      onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={customAddress.state}
                      onChange={(e) => setCustomAddress({ ...customAddress, state: e.target.value })}
                      className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={customAddress.zipCode}
                      onChange={(e) => setCustomAddress({ ...customAddress, zipCode: e.target.value })}
                      className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Contact Phone (for Courier verification)</label>
                  <input
                    type="tel"
                    required
                    value={customAddress.phone}
                    onChange={(e) => setCustomAddress({ ...customAddress, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                {customer.addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(false)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    ← Use saved address from book
                  </button>
                )}
              </div>
            )}

            {/* Shipping Speed Selector */}
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <label className="block text-xs font-bold text-stone-300">Courier Shipping Speed</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                    shippingMethod === 'standard'
                      ? 'bg-amber-950/40 border-amber-500 text-stone-100'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping-method"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <div>
                      <p className="font-bold text-stone-200">Insured Craft Courier</p>
                      <p className="text-[11px] text-stone-400">3-5 Business Days</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400">
                    {cartShippingFee === 0 ? 'FREE' : `$${cartShippingFee}`}
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                    shippingMethod === 'express'
                      ? 'bg-amber-950/40 border-amber-500 text-stone-100'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping-method"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <div>
                      <p className="font-bold text-stone-200">Priority Cask Express</p>
                      <p className="text-[11px] text-stone-400">1-2 Days Priority Flight</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400">+$13.00</span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Gateway */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Step 3 • Secure Payment Gateway
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Payment Method
            </h3>

            {/* Payment Type Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'apple_pay', label: 'Apple Pay', icon: Lock },
                { id: 'gift_card', label: 'Cask Card', icon: Gift },
                { id: 'cask_wire', label: 'Distiller Wire', icon: Sparkles }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentType === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentType(pm.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Card Form */}
            {paymentType === 'card' && (
              <div className="space-y-4 pt-2">
                {/* Visual Metallic Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950/80 border border-amber-600/40 text-stone-100 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs tracking-wider text-amber-400 font-bold">
                      {adminSettings.brandName} VIP CARD
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">VISA SIGNATURE</span>
                  </div>
                  <p className="font-mono text-lg tracking-widest text-stone-200 pt-2">
                    {cardNumber}
                  </p>
                  <div className="flex justify-between text-xs font-mono text-stone-400">
                    <div>
                      <span className="text-[9px] block text-stone-500 uppercase">Card Holder</span>
                      <span className="text-stone-200">{cardHolder}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-stone-500 uppercase">Expires</span>
                      <span className="text-stone-200">{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Security Code (CVV)</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentType === 'apple_pay' && (
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-center space-y-2">
                <p className="text-xs text-stone-300">
                  Ready to authenticate via Apple Pay with your biometric TouchID / FaceID.
                </p>
                <div className="inline-block px-6 py-2.5 bg-white text-black font-bold text-xs rounded-xl shadow">
                   Pay ${finalPayableTotal.toFixed(2)}
                </div>
              </div>
            )}

            {paymentType === 'cask_wire' && (
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-2">
                <p className="font-bold text-amber-400">Direct Distiller Vault Wire Instruction:</p>
                <p>Routing: 121000358 | Account: 884729103 | Beneficiary: Zookas Unity Spirits Bond</p>
                <p className="text-[11px] text-stone-500">Your bottle batch will be reserved and bottled upon wire confirmation.</p>
              </div>
            )}

            {/* Delivery Instructions */}
            <div className="pt-2">
              <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">
                Special Delivery / Cellar Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Leave with doorman; adult signature required; deliver after 2 PM."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-stone-100 border-b border-stone-800 pb-3">
              Spirits Vault Manifest ({cart.length} items)
            </h3>

            {/* Items List */}
            <div className="divide-y divide-stone-800 max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const unitPrice = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-12 rounded object-cover border border-stone-700"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-200 truncate">{item.product.name}</p>
                        <p className="text-stone-400 text-[11px]">
                          Qty: {item.quantity} • {item.product.abv}
                        </p>
                        {item.giftBox && (
                          <span className="text-[10px] text-amber-400 block">+ Gift Box Included</span>
                        )}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-stone-200">
                      ${(unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financials Breakdown */}
            <div className="border-t border-stone-800 pt-4 space-y-2 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Spirits Subtotal</span>
                <span className="text-stone-200 font-medium">${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartGiftBoxTotal > 0 && (
                <div className="flex justify-between">
                  <span>Artisanal Timber Packaging</span>
                  <span className="text-stone-200 font-medium">+${cartGiftBoxTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Spirits Courier</span>
                <span className="text-stone-200 font-medium">
                  {cartShippingFee === 0 && shippingMethod === 'standard' ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    `$${(cartShippingFee + extraExpressFee).toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Spirits Tax ({adminSettings.taxRatePercent}%)</span>
                <span className="text-stone-200 font-medium">${cartTaxAmount.toFixed(2)}</span>
              </div>

              <div className="border-t border-stone-700 pt-3 flex justify-between text-base font-bold text-stone-100">
                <span>Final Payable Total</span>
                <span className="text-amber-400 text-xl font-serif">${finalPayableTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              id="btn-complete-order"
              className={`w-full py-4 px-6 font-bold text-sm uppercase tracking-wider rounded-xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                isProcessing
                  ? 'bg-stone-800 text-stone-500 cursor-wait'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/25 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span>Sealing Cask Lot Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order (${finalPayableTotal.toFixed(2)})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-500 text-center leading-relaxed">
              By authorizing, you confirm that you are of legal drinking age and accept our terms of service. Adult signature is strictly required at delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
