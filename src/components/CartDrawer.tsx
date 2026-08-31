import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    toggleGiftBox,
    cartSubtotal,
    cartGiftBoxTotal,
    cartShippingFee,
    cartTaxAmount,
    cartTotal,
    adminSettings,
    setActiveTab,
    products,
    addToCart
  } = useStore();

  const [engravingInputs, setEngravingInputs] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, adminSettings.freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / adminSettings.freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Your Cask Selection
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                  {cart.length} {cart.length === 1 ? 'bottle' : 'bottles'}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-3 bg-stone-950/40 border-b border-stone-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  {freeShippingNeeded === 0 ? (
                    <strong className="text-emerald-400">Complimentary Insured Shipping Unlocked!</strong>
                  ) : (
                    <span>
                      Add <strong className="text-amber-400">${freeShippingNeeded.toFixed(2)}</strong> for free shipping
                    </span>
                  )}
                </span>
                <span className="font-semibold text-stone-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-stone-200">Your Spirits Bag is Empty</h4>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    Explore our hand-selected small-batch single malts, high-proof bourbons, and alpine botanical gins.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('products');
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
                  >
                    Browse Spirits Vault
                  </button>

                  {/* Quick Add Suggestions */}
                  <div className="pt-8 border-t border-stone-800 text-left">
                    <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-3">
                      Master Distiller's Recommendations
                    </p>
                    <div className="space-y-3">
                      {products.slice(0, 2).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 bg-stone-800/50 rounded-xl border border-stone-700/60"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 px-3 min-w-0">
                            <h5 className="text-xs font-semibold text-stone-200 truncate">{p.name}</h5>
                            <span className="text-[11px] text-amber-400 font-bold">${p.salePrice ?? p.price}</span>
                          </div>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="px-3 py-1.5 bg-stone-700 hover:bg-amber-500 hover:text-stone-950 text-xs font-medium rounded-lg transition"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                cart.map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  const isLowStock = item.product.stockQuantity <= item.product.lowStockThreshold;

                  return (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-xl bg-stone-850 border border-stone-800 space-y-3 relative group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-20 rounded-lg object-cover border border-stone-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-stone-100 leading-snug line-clamp-2">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-stone-500 hover:text-rose-400 p-1 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                            <span>{item.product.abv}</span>
                            <span>•</span>
                            <span className="truncate">{item.product.caskNumber}</span>
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs font-bold text-amber-400">
                              ${(unitPrice * item.quantity).toFixed(2)}
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-stone-500 font-normal ml-1">
                                  (${unitPrice}/btl)
                                </span>
                              )}
                            </div>

                            <div className="flex items-center border border-stone-700 rounded-lg bg-stone-800">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-stone-300 hover:text-amber-400 disabled:opacity-30"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-stone-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stockQuantity}
                                className="p-1 text-stone-300 hover:text-amber-400 disabled:opacity-30"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {isLowStock && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-900/60">
                          <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Distiller Alert: Only {item.product.stockQuantity} bottles left in this cask lot.</span>
                        </div>
                      )}

                      {/* Gift Box Toggle */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-stone-100 select-none">
                          <input
                            type="checkbox"
                            checked={item.giftBox}
                            onChange={(e) => toggleGiftBox(item.product.id, e.target.checked)}
                            className="w-3.5 h-3.5 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-500/20"
                          />
                          <span className="flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-amber-400" />
                            Timber Gift Box (+$15)
                          </span>
                        </label>
                        {item.giftBox && (
                          <span className="text-[10px] text-amber-400 font-medium">Wax Seal Included</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-800 bg-stone-950 space-y-4">
                <div className="space-y-1.5 text-xs text-stone-400">
                  <div className="flex justify-between">
                    <span>Spirits Subtotal</span>
                    <span className="text-stone-200 font-medium">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {cartGiftBoxTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Artisanal Gift Packaging</span>
                      <span className="text-stone-200 font-medium">+${cartGiftBoxTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Insured Shipping</span>
                    <span className="text-stone-200 font-medium">
                      {cartShippingFee === 0 ? (
                        <strong className="text-emerald-400 uppercase text-[10px]">FREE</strong>
                      ) : (
                        `$${cartShippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Spirits Tax ({adminSettings.taxRatePercent}%)</span>
                    <span className="text-stone-200 font-medium">${cartTaxAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-bold text-stone-100">
                    <span>Estimated Total</span>
                    <span className="text-amber-400">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleCheckoutClick}
                    id="cart-proceed-checkout"
                    className="w-full py-3.5 px-6 font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Adult 21+ Required
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Bonded Warehouse Dispatch
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
