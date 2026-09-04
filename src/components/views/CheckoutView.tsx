import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Printer, 
  Wine, 
  AlertCircle, 
  XCircle, 
  Building, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Check,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../../utils/currency';
import {
  ValidationErrors,
  CardBrand,
  detectCardBrand,
  formatCardNumber,
  formatExpiryDate,
  formatPhoneNumber,
  isValidEmail,
  isValidZipCode,
  validateExpiryDate,
  validateCardNumber,
  validateCvv
} from '../../utils/checkoutValidation';

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
    adminSettings,
    placeOrder,
    setActiveTab,
    setActiveInvoiceOrder
  } = useStore();

  // Guest details state
  const [guestEmail, setGuestEmail] = useState<string>(isCustomerLoggedIn ? customer.email : '');
  const [guestPhone, setGuestPhone] = useState<string>(isCustomerLoggedIn ? customer.phone : '');

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
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('09/28');
  const [cardCvv, setCardCvv] = useState<string>('882');
  const [cardHolder, setCardHolder] = useState<string>(isCustomerLoggedIn ? customer.name : '');

  // Gift Card State
  const [giftCardCode, setGiftCardCode] = useState<string>('');
  const [giftCardApplied, setGiftCardApplied] = useState<boolean>(false);
  const [giftCardDiscount, setGiftCardDiscount] = useState<number>(0);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);

  // Wire agreement
  const [wireTermsAccepted, setWireTermsAccepted] = useState<boolean>(false);

  // Age confirmation checkbox
  const [legalAgeAccepted, setLegalAgeAccepted] = useState<boolean>(true);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Form Tracking & Touched states for real-time validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Processing & Placed state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // References for smooth scrolling to errors
  const topErrorRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Update recipient / cardholder defaults when customer logs in
  useEffect(() => {
    if (isCustomerLoggedIn) {
      if (!guestEmail) setGuestEmail(customer.email);
      if (!guestPhone) setGuestPhone(customer.phone);
      if (!cardHolder) setCardHolder(customer.name);
      if (customer.addresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(customer.addresses[0].id);
        setUseNewAddress(false);
      }
    }
  }, [isCustomerLoggedIn, customer]);

  // Detected Card Brand
  const detectedBrand = useMemo<CardBrand>(() => {
    return detectCardBrand(cardNumber);
  }, [cardNumber]);

  // Real-time Validation Engine
  const validationErrors = useMemo<ValidationErrors>(() => {
    const errors: ValidationErrors = {};

    // 1. Legal 21+ Age Certification
    if (!legalAgeAccepted) {
      errors.legalAgeAccepted = 'You must certify that you are 21 years of age or older.';
    }

    // 2. Guest Contact (if not logged in)
    if (!isCustomerLoggedIn) {
      if (!guestEmail.trim()) {
        errors.guestEmail = 'Email address is required for order confirmation.';
      } else if (!isValidEmail(guestEmail)) {
        errors.guestEmail = 'Please enter a valid email address (e.g. name@domain.com).';
      }

      const rawPhone = guestPhone.replace(/\D/g, '');
      if (!guestPhone.trim()) {
        errors.guestPhone = 'Contact phone is required for courier age verification.';
      } else if (rawPhone.length < 10) {
        errors.guestPhone = 'Enter a valid 10-digit telephone number.';
      }
    }

    // 3. Shipping Address
    if (useNewAddress) {
      if (!customAddress.fullName.trim() || customAddress.fullName.trim().length < 2) {
        errors.fullName = 'Please enter the recipient full legal name.';
      }

      if (!customAddress.street.trim() || customAddress.street.trim().length < 5) {
        errors.street = 'Please provide a complete street address with building / suite number.';
      }

      if (!customAddress.city.trim() || customAddress.city.trim().length < 2) {
        errors.city = 'City name is required.';
      }

      if (!customAddress.state.trim()) {
        errors.state = 'State / Province is required.';
      }

      if (!customAddress.zipCode.trim()) {
        errors.zipCode = 'ZIP / Postal code is required.';
      } else if (!isValidZipCode(customAddress.zipCode)) {
        errors.zipCode = 'Enter a valid 5-digit ZIP code (e.g. 90210).';
      }

      const rawCustPhone = customAddress.phone.replace(/\D/g, '');
      if (!customAddress.phone.trim()) {
        errors.phone = 'Recipient phone is required for delivery scheduling.';
      } else if (rawCustPhone.length < 10) {
        errors.phone = 'Enter a valid 10-digit phone number.';
      }
    } else {
      // Using saved address
      const selected = customer.addresses.find(a => a.id === selectedAddressId);
      if (!selected) {
        errors.savedAddress = 'Please select an address from your address book.';
      }
    }

    // 4. Payment Validation
    if (paymentType === 'card') {
      const cardNumCheck = validateCardNumber(cardNumber);
      if (!cardNumCheck.valid) {
        errors.cardNumber = cardNumCheck.error;
      }

      const expiryCheck = validateExpiryDate(cardExpiry);
      if (!expiryCheck.valid) {
        errors.cardExpiry = expiryCheck.error;
      }

      const cvvCheck = validateCvv(cardCvv, detectedBrand);
      if (!cvvCheck.valid) {
        errors.cardCvv = cvvCheck.error;
      }

      if (!cardHolder.trim() || cardHolder.trim().length < 2) {
        errors.cardHolder = 'Cardholder name as printed on card is required.';
      }
    } else if (paymentType === 'cask_wire') {
      if (!wireTermsAccepted) {
        errors.wireAccepted = 'Please acknowledge that cask wire orders require receipt within 48 hours.';
      }
    } else if (paymentType === 'gift_card') {
      if (!giftCardApplied) {
        errors.giftCardCode = 'Please apply a verified Cask Card code or switch payment methods.';
      }
    }

    return errors;
  }, [
    legalAgeAccepted,
    isCustomerLoggedIn,
    guestEmail,
    guestPhone,
    useNewAddress,
    customAddress,
    selectedAddressId,
    customer.addresses,
    paymentType,
    cardNumber,
    cardExpiry,
    cardCvv,
    cardHolder,
    detectedBrand,
    wireTermsAccepted,
    giftCardApplied
  ]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  // Mark a field as touched
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const shouldShowError = (field: keyof ValidationErrors): boolean => {
    return !!validationErrors[field] && (!!touched[field] || hasAttemptedSubmit);
  };

  const isFieldValid = (field: keyof ValidationErrors, value: string): boolean => {
    return !validationErrors[field] && !!value && (!!touched[field] || hasAttemptedSubmit);
  };

  // Calculations
  const extraExpressFee = shippingMethod === 'express' ? 1000 : 0;
  const effectiveDiscount = giftCardApplied ? giftCardDiscount : 0;
  const finalPayableTotal = Math.max(
    0,
    Number((cartTotal + extraExpressFee - effectiveDiscount).toFixed(2))
  );

  // Apply Gift Card
  const handleApplyGiftCard = () => {
    setGiftCardError(null);
    const code = giftCardCode.trim().toUpperCase();
    if (!code) {
      setGiftCardError('Please enter a valid gift card or voucher code.');
      return;
    }

    if (code.startsWith('CASK') || code.includes('VIP') || code.length >= 8) {
      setGiftCardApplied(true);
      const discount = Math.min(4000, cartTotal);
      setGiftCardDiscount(discount);
      setGiftCardError(null);
    } else {
      setGiftCardError('Unrecognized gift card code. Try "CASK-2026-VIP" for ₹4,000 credit.');
    }
  };

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
          className="px-6 py-3 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition cursor-pointer"
        >
          Explore Spirits Vault
        </button>
      </div>
    );
  }

  // Handle Order Placement with Complete Validation & Firestore Persistence
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setSubmitError(null);

    // Validate entire form
    if (!isFormValid) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      setSubmitError('Please correct the highlighted fields before submitting your spirits order.');

      // Smooth scroll to the first problematic section
      if (firstErrorKey === 'legalAgeAccepted') {
        step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (['fullName', 'street', 'city', 'state', 'zipCode', 'phone', 'savedAddress', 'guestEmail', 'guestPhone'].includes(firstErrorKey)) {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const shippingAddress: Address = useNewAddress
      ? customAddress
      : customer.addresses.find(a => a.id === selectedAddressId) || customAddress;

    setIsProcessing(true);

    try {
      // Submit order to Firestore
      const order = await placeOrder({
        shippingAddress: {
          ...shippingAddress,
          fullName: shippingAddress.fullName || customer.name || 'Connoisseur Patron'
        },
        payment: {
          type: paymentType,
          cardLast4: paymentType === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) : '8821',
          cardBrand: 
            paymentType === 'apple_pay' 
              ? 'Apple Pay Express' 
              : paymentType === 'gift_card' 
              ? 'Cellar Reserve Gift Card' 
              : paymentType === 'cask_wire'
              ? 'Distiller Wire Transfer'
              : detectedBrand.toUpperCase() + ' SIGNATURE'
        },
        loyaltyPointsToUse: 0,
        notes: orderNotes
      });

      setCompletedOrder(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Order submission error:', err);
      setSubmitError(err?.message || 'A network error occurred while sealing your order with the distillery database. Please check your details and retry.');
      topErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      setIsProcessing(false);
    }
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
              Distiller Batch Reservation Confirmed & Persisted
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              Thank You for Your Order, {customer.name || completedOrder.shippingAddress.fullName}!
            </h1>
            <p className="text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
              Your artisanal spirits order <strong className="text-amber-400 font-mono">{completedOrder.orderNumber}</strong> has been transmitted to our master distillery bond house and saved to live cloud records.
            </p>
          </div>

          {/* Key Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs">
            <div className="p-2">
              <span className="text-stone-500 block uppercase tracking-wider text-[10px]">Total Paid</span>
              <strong className="text-amber-400 font-serif text-lg">{formatPrice(completedOrder.total, adminSettings.currencySymbol)}</strong>
            </div>
            <div className="p-2">
              <span className="text-stone-500 block uppercase tracking-wider text-[10px]">Tracking Number</span>
              <strong className="text-stone-200 font-mono text-xs truncate block">{completedOrder.trackingNumber}</strong>
            </div>
            <div className="p-2">
              <span className="text-stone-500 block uppercase tracking-wider text-[10px]">Verification</span>
              <strong className="text-emerald-400 font-serif text-sm">21+ Adult ID Mandate</strong>
            </div>
          </div>

          {/* Delivery & Payment Note */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-stone-300 text-left space-y-1.5">
            <p className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Adult Signature Delivery Mandate (21+)
            </p>
            <p className="text-stone-400">
              Dispatched via <strong>{completedOrder.carrier}</strong> to <span className="text-stone-200">{completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveInvoiceOrder(completedOrder)}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Official Invoice</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Track in Customer Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full max-w-full overflow-x-hidden" id="checkout-container">
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
                Tier: <span className="text-amber-300 font-semibold">{customer.loyaltyTier}</span> • Saved addresses active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition cursor-pointer"
            >
              Switch Account
            </button>
            <button
              onClick={logoutCustomer}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 rounded-lg transition cursor-pointer"
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
                Sign in to auto-fill saved shipping addresses and sync your order history to Firestore.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition shadow cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl transition cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Checkout Navigation Bar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-6">
        <button
          onClick={() => setActiveTab('products')}
          className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Spirits Checkout</span>
        </div>
      </div>

      {/* Prominent Global Error Notification */}
      <div ref={topErrorRef}>
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-rose-950/70 border-2 border-rose-600/70 rounded-2xl text-rose-200 flex items-start gap-3 shadow-xl"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-rose-300 text-sm">Submission Incomplete</p>
                <p>{submitError}</p>
                {hasAttemptedSubmit && Object.keys(validationErrors).length > 0 && (
                  <ul className="list-disc list-inside pt-1 space-y-0.5 text-rose-300/90 font-medium">
                    {Object.entries(validationErrors).map(([key, err]) => (
                      <li key={key}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Steps 1, 2 & 3 */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Legal 21+ Age Certification */}
          <div 
            ref={step1Ref}
            id="section-age-verification"
            className={`p-6 rounded-2xl bg-stone-900 border transition-all ${
              shouldShowError('legalAgeAccepted')
                ? 'border-rose-500/80 shadow-rose-950/30 ring-1 ring-rose-500/30'
                : 'border-stone-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Step 1 • Legal Compliance
              </span>
              {legalAgeAccepted ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Verified 21+
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Required
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg font-bold text-stone-100 mt-1">
              Legal Drinking Age Certification
            </h3>

            <label className={`flex items-start gap-3 p-3.5 mt-3 rounded-xl border cursor-pointer text-xs transition ${
              legalAgeAccepted
                ? 'bg-stone-950/90 border-stone-800 text-stone-300'
                : 'bg-rose-950/20 border-rose-800 text-rose-200'
            }`}>
              <input
                type="checkbox"
                id="checkbox-legal-age"
                checked={legalAgeAccepted}
                onChange={(e) => {
                  setLegalAgeAccepted(e.target.checked);
                  handleBlur('legalAgeAccepted');
                }}
                className="w-4 h-4 text-amber-500 rounded mt-0.5 cursor-pointer"
              />
              <span className="leading-relaxed">
                I certify under penalty of law that I am at least <strong className="text-amber-300">21 years of age</strong>, and the designated recipient at the shipping address is legally entitled to receive bonded spirit shipments under US Federal and State ABC regulations.
              </span>
            </label>

            {shouldShowError('legalAgeAccepted') && (
              <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationErrors.legalAgeAccepted}</span>
              </p>
            )}
          </div>

          {/* STEP 2: Contact & Shipping Destination */}
          <div 
            ref={step2Ref}
            id="section-shipping-address"
            className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Step 2 • Dispatch Destination
              </span>
              <span className="text-xs text-stone-500">Insured Delivery</span>
            </div>

            <h3 className="font-serif text-lg font-bold text-stone-100">
              Recipient & Shipping Information
            </h3>

            {/* Guest Contact Details (if guest) */}
            {!isCustomerLoggedIn && (
              <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3">
                <p className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Contact & Order Tracking Receipt
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="input-guest-email"
                        placeholder="collector@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        onBlur={() => handleBlur('guestEmail')}
                        className={`w-full px-3 py-2.5 bg-stone-900 border text-stone-100 rounded-lg text-xs transition focus:outline-none ${
                          shouldShowError('guestEmail')
                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                            : isFieldValid('guestEmail', guestEmail)
                            ? 'border-emerald-500/80 pr-8'
                            : 'border-stone-700 focus:border-amber-500'
                        }`}
                      />
                      {isFieldValid('guestEmail', guestEmail) && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-2.5" />
                      )}
                    </div>
                    {shouldShowError('guestEmail') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.guestEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Mobile Phone (Courier Verification) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="input-guest-phone"
                        placeholder="(555) 000-0000"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(formatPhoneNumber(e.target.value))}
                        onBlur={() => handleBlur('guestPhone')}
                        className={`w-full px-3 py-2.5 bg-stone-900 border text-stone-100 rounded-lg text-xs transition focus:outline-none ${
                          shouldShowError('guestPhone')
                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                            : isFieldValid('guestPhone', guestPhone)
                            ? 'border-emerald-500/80 pr-8'
                            : 'border-stone-700 focus:border-amber-500'
                        }`}
                      />
                      {isFieldValid('guestPhone', guestPhone) && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-2.5" />
                      )}
                    </div>
                    {shouldShowError('guestPhone') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.guestPhone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Saved Addresses vs New Address */}
            {!useNewAddress && customer.addresses.length > 0 ? (
              <div className="space-y-3">
                {customer.addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                      selectedAddressId === addr.id
                        ? 'bg-amber-950/40 border-amber-500 text-stone-100 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping-address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => {
                        setSelectedAddressId(addr.id);
                        handleBlur('savedAddress');
                      }}
                      className="w-4 h-4 text-amber-500 mt-0.5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-200">{addr.fullName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-[11px] text-stone-500">Phone: {addr.phone}</p>
                    </div>
                  </label>
                ))}

                {shouldShowError('savedAddress') && (
                  <p className="text-rose-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{validationErrors.savedAddress}</span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setUseNewAddress(true)}
                  className="text-xs text-amber-400 hover:underline cursor-pointer flex items-center gap-1 pt-1"
                >
                  <span>+ Ship to a different address</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                {/* Full Legal Name */}
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Recipient Full Legal Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-address-fullname"
                      required
                      placeholder="e.g. Master Sommelier Julian Vance"
                      value={customAddress.fullName}
                      onChange={(e) => setCustomAddress({ ...customAddress, fullName: e.target.value })}
                      onBlur={() => handleBlur('fullName')}
                      className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 transition focus:outline-none ${
                        shouldShowError('fullName')
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : isFieldValid('fullName', customAddress.fullName)
                          ? 'border-emerald-500/80 pr-8'
                          : 'border-stone-700 focus:border-amber-500'
                      }`}
                    />
                    {isFieldValid('fullName', customAddress.fullName) && (
                      <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                    )}
                  </div>
                  {shouldShowError('fullName') && (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{validationErrors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Street Address & Suite / Unit *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-address-street"
                      required
                      placeholder="e.g. 742 Amber Cask Blvd, Suite 18"
                      value={customAddress.street}
                      onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
                      onBlur={() => handleBlur('street')}
                      className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 transition focus:outline-none ${
                        shouldShowError('street')
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : isFieldValid('street', customAddress.street)
                          ? 'border-emerald-500/80 pr-8'
                          : 'border-stone-700 focus:border-amber-500'
                      }`}
                    />
                    {isFieldValid('street', customAddress.street) && (
                      <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                    )}
                  </div>
                  {shouldShowError('street') && (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{validationErrors.street}</span>
                    </p>
                  )}
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">City *</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="input-address-city"
                        required
                        placeholder="e.g. Louisville"
                        value={customAddress.city}
                        onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                        onBlur={() => handleBlur('city')}
                        className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 transition focus:outline-none ${
                          shouldShowError('city')
                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                            : isFieldValid('city', customAddress.city)
                            ? 'border-emerald-500/80 pr-8'
                            : 'border-stone-700 focus:border-amber-500'
                        }`}
                      />
                      {isFieldValid('city', customAddress.city) && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                      )}
                    </div>
                    {shouldShowError('city') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">State / Province *</label>
                    <input
                      type="text"
                      id="input-address-state"
                      required
                      placeholder="e.g. KY"
                      value={customAddress.state}
                      onChange={(e) => setCustomAddress({ ...customAddress, state: e.target.value.toUpperCase() })}
                      onBlur={() => handleBlur('state')}
                      className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 uppercase transition focus:outline-none ${
                        shouldShowError('state')
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : isFieldValid('state', customAddress.state)
                          ? 'border-emerald-500/80'
                          : 'border-stone-700 focus:border-amber-500'
                      }`}
                    />
                    {shouldShowError('state') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.state}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">ZIP / Postal Code *</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="input-address-zip"
                        required
                        placeholder="e.g. 40202"
                        value={customAddress.zipCode}
                        onChange={(e) => setCustomAddress({ ...customAddress, zipCode: e.target.value })}
                        onBlur={() => handleBlur('zipCode')}
                        className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 transition focus:outline-none ${
                          shouldShowError('zipCode')
                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                            : isFieldValid('zipCode', customAddress.zipCode)
                            ? 'border-emerald-500/80 pr-8'
                            : 'border-stone-700 focus:border-amber-500'
                        }`}
                      />
                      {isFieldValid('zipCode', customAddress.zipCode) && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                      )}
                    </div>
                    {shouldShowError('zipCode') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.zipCode}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Recipient Phone */}
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Contact Phone (for Courier verification & dispatch alert) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="input-address-phone"
                      required
                      placeholder="(555) 000-0000"
                      value={customAddress.phone}
                      onChange={(e) => setCustomAddress({ ...customAddress, phone: formatPhoneNumber(e.target.value) })}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 transition focus:outline-none ${
                        shouldShowError('phone')
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : isFieldValid('phone', customAddress.phone)
                          ? 'border-emerald-500/80 pr-8'
                          : 'border-stone-700 focus:border-amber-500'
                      }`}
                    />
                    {isFieldValid('phone', customAddress.phone) && (
                      <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                    )}
                  </div>
                  {shouldShowError('phone') && (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{validationErrors.phone}</span>
                    </p>
                  )}
                </div>

                {customer.addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(false)}
                    className="text-xs text-amber-400 hover:underline cursor-pointer pt-1 block"
                  >
                    ← Back to saved address book
                  </button>
                )}
              </div>
            )}

            {/* Shipping Speed Selector */}
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <label className="block text-xs font-bold text-stone-300">Courier Shipping Speed</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    shippingMethod === 'standard'
                      ? 'bg-amber-950/40 border-amber-500 text-stone-100 shadow-sm'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping-method"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-amber-500"
                    />
                    <div>
                      <p className="font-bold text-stone-200">Insured Craft Courier</p>
                      <p className="text-[11px] text-stone-400">3-5 Business Days</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400">
                    {cartShippingFee === 0 ? 'FREE' : formatPrice(cartShippingFee, adminSettings.currencySymbol)}
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    shippingMethod === 'express'
                      ? 'bg-amber-950/40 border-amber-500 text-stone-100 shadow-sm'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping-method"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-amber-500"
                    />
                    <div>
                      <p className="font-bold text-stone-200">Priority Cask Express</p>
                      <p className="text-[11px] text-stone-400">1-2 Days Priority Air</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400">+{formatPrice(1000, adminSettings.currencySymbol)}</span>
                </label>
              </div>
            </div>
          </div>

          {/* STEP 3: Payment Gateway */}
          <div 
            ref={step3Ref}
            id="section-payment-method"
            className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Step 3 • Secure Payment Gateway
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> PCI DSS Compliant
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-stone-100">
              Select Payment Method
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
                    onClick={() => {
                      setPaymentType(pm.id as any);
                      setSubmitError(null);
                    }}
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
                {/* Visual Metallic Card with live brand badge */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950/80 border border-amber-600/40 text-stone-100 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs tracking-wider text-amber-400 font-bold">
                      {adminSettings.brandName} VIP CARD
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase px-2 py-0.5 rounded bg-stone-900/80 border border-amber-500/30">
                      {detectedBrand.toUpperCase()} SIGNATURE
                    </span>
                  </div>
                  <p className="font-mono text-lg sm:text-xl tracking-widest text-stone-200 pt-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between text-xs font-mono text-stone-400">
                    <div>
                      <span className="text-[9px] block text-stone-500 uppercase">Cardholder</span>
                      <span className="text-stone-200">{cardHolder || 'CONNOISSEUR PATRON'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-stone-500 uppercase">Expires</span>
                      <span className="text-stone-200">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Card Number Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-stone-300 font-semibold">Card Number *</label>
                      <span className="text-[10px] text-stone-500 uppercase font-mono">
                        Brand: <strong className="text-amber-400">{detectedBrand}</strong>
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="input-card-number"
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        onBlur={() => handleBlur('cardNumber')}
                        className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 font-mono transition focus:outline-none ${
                          shouldShowError('cardNumber')
                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                            : isFieldValid('cardNumber', cardNumber)
                            ? 'border-emerald-500/80 pr-8'
                            : 'border-stone-700 focus:border-amber-500'
                        }`}
                      />
                      {isFieldValid('cardNumber', cardNumber) && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                      )}
                    </div>
                    {shouldShowError('cardNumber') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.cardNumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Cardholder Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="input-card-holder"
                        placeholder="e.g. Julian Vance"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        onBlur={() => handleBlur('cardHolder')}
                        className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 transition focus:outline-none ${
                          shouldShowError('cardHolder')
                            ? 'border-rose-500 ring-1 ring-rose-500/30'
                            : isFieldValid('cardHolder', cardHolder)
                            ? 'border-emerald-500/80 pr-8'
                            : 'border-stone-700 focus:border-amber-500'
                        }`}
                      />
                      {isFieldValid('cardHolder', cardHolder) && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                      )}
                    </div>
                    {shouldShowError('cardHolder') && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validationErrors.cardHolder}</span>
                      </p>
                    )}
                  </div>

                  {/* Expiration & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">Expiration (MM/YY) *</label>
                      <div className="relative">
                        <input
                          type="text"
                          id="input-card-expiry"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                          onBlur={() => handleBlur('cardExpiry')}
                          className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 font-mono transition focus:outline-none ${
                            shouldShowError('cardExpiry')
                              ? 'border-rose-500 ring-1 ring-rose-500/30'
                              : isFieldValid('cardExpiry', cardExpiry)
                              ? 'border-emerald-500/80 pr-8'
                              : 'border-stone-700 focus:border-amber-500'
                          }`}
                        />
                        {isFieldValid('cardExpiry', cardExpiry) && (
                          <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                        )}
                      </div>
                      {shouldShowError('cardExpiry') && (
                        <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{validationErrors.cardExpiry}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">
                        Security Code ({detectedBrand === 'amex' ? '4-digit CID' : '3-digit CVV'}) *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          id="input-card-cvv"
                          maxLength={detectedBrand === 'amex' ? 4 : 3}
                          placeholder={detectedBrand === 'amex' ? '8821' : '882'}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          onBlur={() => handleBlur('cardCvv')}
                          className={`w-full p-2.5 bg-stone-950 border rounded-lg text-stone-100 font-mono transition focus:outline-none ${
                            shouldShowError('cardCvv')
                              ? 'border-rose-500 ring-1 ring-rose-500/30'
                              : isFieldValid('cardCvv', cardCvv)
                              ? 'border-emerald-500/80 pr-8'
                              : 'border-stone-700 focus:border-amber-500'
                          }`}
                        />
                        {isFieldValid('cardCvv', cardCvv) && (
                          <Check className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3" />
                        )}
                      </div>
                      {shouldShowError('cardCvv') && (
                        <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{validationErrors.cardCvv}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Apple Pay View */}
            {paymentType === 'apple_pay' && (
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center mx-auto text-stone-100">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-200">Biometric Apple Pay Ready</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
                    Authenticate directly using FaceID, TouchID, or your Apple Watch when clicking the button below.
                  </p>
                </div>
                <div className="inline-block px-6 py-2.5 bg-white text-black font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-stone-100 transition">
                   Pay {formatPrice(finalPayableTotal, adminSettings.currencySymbol)}
                </div>
              </div>
            )}

            {/* Distiller Cask Wire View */}
            {paymentType === 'cask_wire' && (
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Direct Distiller Vault Wire Instruction
                  </p>
                  <span className="text-[10px] text-stone-500">Fedwire / SWIFT</span>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-stone-300 p-2.5 bg-stone-900 rounded-lg">
                  <div>Routing (ABA): 121000358</div>
                  <div>Account: 884729103</div>
                  <div className="col-span-2">Beneficiary: Zookas Unity Spirits Master Bond LLC</div>
                </div>

                <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                  wireTermsAccepted
                    ? 'bg-stone-900 border-stone-700 text-stone-200'
                    : 'bg-rose-950/20 border-rose-800/80 text-rose-200'
                }`}>
                  <input
                    type="checkbox"
                    checked={wireTermsAccepted}
                    onChange={(e) => {
                      setWireTermsAccepted(e.target.checked);
                      handleBlur('wireAccepted');
                    }}
                    className="w-4 h-4 text-amber-500 rounded mt-0.5 cursor-pointer"
                  />
                  <span>
                    I understand this small-batch bottle lot is reserved for <strong>48 hours</strong> awaiting bank wire confirmation.
                  </span>
                </label>

                {shouldShowError('wireAccepted') && (
                  <p className="text-rose-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{validationErrors.wireAccepted}</span>
                  </p>
                )}
              </div>
            )}

            {/* Gift Card View */}
            {paymentType === 'gift_card' && (
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 text-xs">
                <p className="font-bold text-stone-200 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-400" />
                  Redeem Cask Card or Collector Voucher
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. CASK-2026-VIP)"
                    value={giftCardCode}
                    onChange={(e) => {
                      setGiftCardCode(e.target.value.toUpperCase());
                      setGiftCardApplied(false);
                      setGiftCardError(null);
                    }}
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyGiftCard}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition cursor-pointer shadow"
                  >
                    Apply Code
                  </button>
                </div>

                {giftCardError && (
                  <p className="text-rose-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{giftCardError}</span>
                  </p>
                )}

                {giftCardApplied && (
                  <div className="p-2.5 bg-emerald-950/50 border border-emerald-700/60 rounded-lg text-emerald-300 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Code <strong>{giftCardCode}</strong> applied successfully!
                    </span>
                    <strong className="text-emerald-400 font-mono">-{formatPrice(giftCardDiscount, adminSettings.currencySymbol)}</strong>
                  </div>
                )}

                {shouldShowError('giftCardCode') && !giftCardApplied && !giftCardError && (
                  <p className="text-rose-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{validationErrors.giftCardCode}</span>
                  </p>
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div className="pt-2">
              <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">
                Special Delivery / Cellar Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Leave with doorman; adult signature required; deliver after 2 PM."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5 sticky top-24 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Spirits Vault Manifest
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                {cart.length} {cart.length === 1 ? 'spirit item' : 'spirit items'}
              </span>
            </div>

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
                        className="w-10 h-12 rounded object-cover border border-stone-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-200 truncate">{item.product.name}</p>
                        <p className="text-stone-400 text-[11px]">
                          Qty: {item.quantity} • {item.product.abv} • {item.product.volumeMl}ml
                        </p>
                        {item.giftBox && (
                          <span className="text-[10px] text-amber-400 block">+ Gift Box Included</span>
                        )}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-stone-200">
                      {formatPrice(unitPrice * item.quantity, adminSettings.currencySymbol)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financials Breakdown */}
            <div className="border-t border-stone-800 pt-4 space-y-2 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Spirits Subtotal</span>
                <span className="text-stone-200 font-medium">{formatPrice(cartSubtotal, adminSettings.currencySymbol)}</span>
              </div>

              {cartGiftBoxTotal > 0 && (
                <div className="flex justify-between">
                  <span>Artisanal Timber Packaging</span>
                  <span className="text-stone-200 font-medium">+{formatPrice(cartGiftBoxTotal, adminSettings.currencySymbol)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Spirits Courier</span>
                <span className="text-stone-200 font-medium">
                  {cartShippingFee === 0 && shippingMethod === 'standard' ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    formatPrice(cartShippingFee + extraExpressFee, adminSettings.currencySymbol)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Spirits Tax ({adminSettings.taxRatePercent}%)</span>
                <span className="text-stone-200 font-medium">{formatPrice(cartTaxAmount, adminSettings.currencySymbol)}</span>
              </div>

              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Cask Card Voucher Credit</span>
                  <span>-{formatPrice(effectiveDiscount, adminSettings.currencySymbol)}</span>
                </div>
              )}

              <div className="border-t border-stone-700 pt-3 flex justify-between text-base font-bold text-stone-100">
                <span>Final Payable Total</span>
                <span className="text-amber-400 text-xl font-serif">{formatPrice(finalPayableTotal, adminSettings.currencySymbol)}</span>
              </div>
            </div>

            {/* Dynamic Status / Validation Preview Banner */}
            {!isFormValid && hasAttemptedSubmit && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{Object.keys(validationErrors).length} required field(s) require your attention above.</span>
              </div>
            )}

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
                  <span>Transmitting Order to Firestore...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order ({formatPrice(finalPayableTotal, adminSettings.currencySymbol)})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-500 text-center leading-relaxed">
              By authorizing, you certify that you are at least 21 years of age and accept our distillery terms of service. Adult signature is strictly verified by the courier upon delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
