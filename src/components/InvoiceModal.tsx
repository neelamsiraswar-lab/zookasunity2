import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';
import { 
  X, 
  Printer, 
  Download, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  PackageCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, adminSettings, aboutContent } = useStore();

  if (!activeInvoiceOrder) return null;

  const order = activeInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black"
        >
          {/* Top Actions */}
          <div className="p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between print:hidden">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4" />
              Official Spirits Vault Invoice
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setActiveInvoiceOrder(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Invoice Document Body */}
          <div className="p-8 overflow-y-auto space-y-8 print:p-0 print:text-black">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-800 pb-6 print:border-gray-300">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-stone-950" />
                  </div>
                  <span className="font-cinzel text-lg font-bold tracking-wider text-stone-100 print:text-black uppercase">
                    {adminSettings.brandName}
                  </span>
                </div>
                <p className="text-xs text-stone-400 print:text-gray-600 leading-relaxed">
                  {aboutContent.distilleryAddress}<br />
                  Concierge: {adminSettings.contactEmail} | {adminSettings.contactPhone}<br />
                  Distiller Bond Registration #US-DIST-77281
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-400 print:text-amber-700 block">
                  Invoice & Manifest
                </span>
                <h3 className="font-mono text-lg font-bold text-stone-100 print:text-black mt-0.5">
                  {order.orderNumber}
                </h3>
                <p className="text-xs text-stone-400 print:text-gray-600 mt-1">
                  Date: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-700/50 print:bg-gray-100 print:text-black print:border-gray-300">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Status: {order.status}</span>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-stone-800 pb-6 print:border-gray-300">
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-stone-400 print:text-gray-500 mb-2">
                  Consignee / Recipient:
                </h4>
                <p className="font-bold text-stone-200 print:text-black text-sm">{order.shippingAddress.fullName}</p>
                <p className="text-stone-300 print:text-gray-700 mt-1">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div>
                <h4 className="font-semibold uppercase tracking-wider text-stone-400 print:text-gray-500 mb-2">
                  Carrier & Dispatch Specs:
                </h4>
                <p className="text-stone-300 print:text-gray-700">
                  <strong>Carrier:</strong> {order.carrier}<br />
                  <strong>Tracking Number:</strong> <span className="font-mono text-amber-400 print:text-black">{order.trackingNumber}</span><br />
                  <strong>Compliance:</strong> Adult 21+ Verification Mandated<br />
                  <strong>Payment Reference:</strong> {order.payment.transactionId}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-400 print:text-gray-500 mb-3">
                Spirits Vault Manifest:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-800 print:border-gray-300 text-stone-400 print:text-gray-600">
                      <th className="py-2.5 pr-4 font-semibold">Spirit & Cask Spec</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Batch #</th>
                      <th className="py-2.5 px-3 font-semibold text-center">ABV</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                      <th className="py-2.5 pl-4 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850 print:divide-gray-200 text-stone-200 print:text-black">
                    {order.items.map((item, idx) => {
                      const unitPrice = item.product.salePrice ?? item.product.price;
                      return (
                        <tr key={idx}>
                          <td className="py-3 pr-4">
                            <p className="font-bold text-stone-100 print:text-black">{item.product.name}</p>
                            <p className="text-[11px] text-stone-400 print:text-gray-500">
                              Cask: {item.product.caskNumber} ({item.product.caskType})
                            </p>
                            {item.giftBox && (
                              <p className="text-[11px] text-amber-400 print:text-amber-800 mt-0.5">
                                + Timber Gift Box & Beeswax Seal
                              </p>
                            )}
                            {item.customEngraving && (
                              <p className="text-[11px] text-stone-400 print:text-gray-600 italic">
                                Engraved: "{item.customEngraving}"
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-stone-400 print:text-gray-600">
                            {item.product.batchNumber}
                          </td>
                          <td className="py-3 px-3 text-center text-stone-400 print:text-gray-600">
                            {item.product.abv}
                          </td>
                          <td className="py-3 px-3 text-center font-bold">
                            {item.quantity}
                          </td>
                          <td className="py-3 pl-4 text-right font-bold text-amber-400 print:text-black">
                            {formatPrice(unitPrice * item.quantity, adminSettings.currencySymbol)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="border-t border-stone-800 print:border-gray-300 pt-4 flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-2 text-xs text-stone-400 print:text-gray-600 max-w-sm">
                <p><strong>Compliance:</strong> 21+ Age Verified at Checkout</p>
                {order.notes && (
                  <p className="italic text-[11px] bg-stone-950 p-2.5 rounded-lg border border-stone-800 print:border-gray-200">
                    <strong>Delivery Notes:</strong> {order.notes}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-stone-300 print:text-gray-700">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal, adminSettings.currencySymbol)}</span>
                </div>
                {order.giftBoxFee > 0 && (
                  <div className="flex justify-between text-stone-300 print:text-gray-700">
                    <span>Artisanal Packaging:</span>
                    <span>+{formatPrice(order.giftBoxFee, adminSettings.currencySymbol)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount, adminSettings.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-300 print:text-gray-700">
                  <span>Insured Shipping:</span>
                  <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping, adminSettings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-stone-300 print:text-gray-700">
                  <span>Excise & Sales Tax:</span>
                  <span>{formatPrice(order.tax, adminSettings.currencySymbol)}</span>
                </div>
                <div className="border-t border-stone-700 print:border-gray-400 pt-2 flex justify-between text-base font-bold text-stone-100 print:text-black">
                  <span>Total Paid:</span>
                  <span className="text-amber-400 print:text-black">{formatPrice(order.total, adminSettings.currencySymbol)}</span>
                </div>
              </div>
            </div>

            {/* Master Distiller Verification Stamp */}
            <div className="border-t border-stone-800 print:border-gray-300 pt-6 flex items-center justify-between text-xs text-stone-500 print:text-gray-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-amber-600/40 flex items-center justify-center text-amber-500 font-cinzel font-bold text-[10px] text-center p-1">
                  SEALED & PROOVED
                </div>
                <div>
                  <p className="font-semibold text-stone-300 print:text-black">Zookas Unity Master Distillers</p>
                  <p className="text-[11px]">Direct Bond Vault Release #2026</p>
                </div>
              </div>
              <p className="text-[10px] text-right">
                Thank you for patronizing artisanal small-batch craft.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
