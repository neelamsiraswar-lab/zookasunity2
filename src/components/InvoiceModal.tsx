import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';
import { 
  X, 
  Printer, 
  Flame, 
  CheckCircle2, 
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, adminSettings, aboutContent } = useStore();

  const order = activeInvoiceOrder;

  // Manage print class on body when invoice is active
  useEffect(() => {
    if (!order) return;
    document.body.classList.add('has-active-print-job', 'printing-invoice');
    
    const handleAfterPrint = () => {
      document.body.classList.remove('has-active-print-job', 'printing-invoice');
    };
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      document.body.classList.remove('has-active-print-job', 'printing-invoice');
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [order]);

  if (!order) return null;

  const handlePrint = () => {
    document.body.classList.add('has-active-print-job', 'printing-invoice');
    window.print();
    setTimeout(() => {
      if (!activeInvoiceOrder) {
        document.body.classList.remove('has-active-print-job', 'printing-invoice');
      }
    }, 1500);
  };

  const printRoot = typeof document !== 'undefined' ? document.getElementById('print-root') : null;

  // Render Clean 1-Page Printable Invoice Document
  const renderPrintableDocument = () => (
    <div className="print-invoice-page text-black bg-white font-sans text-xs leading-normal">
      {/* Invoice Header */}
      <div className="flex justify-between items-start pb-4 border-b-2 border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center text-white">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-bold tracking-wider text-black uppercase">
              {adminSettings.brandName || "ZOOKAS UNITY SPIRITS"}
            </span>
          </div>
          <p className="text-[11px] text-stone-700 leading-tight">
            {aboutContent.distilleryAddress || "Floor No.: 1ST FLOOR Building, S S TOWER, Dankuni, West Bengal 712311"}<br />
            Concierge: {adminSettings.contactEmail || "zookasspirit123@gmail.com"} | {adminSettings.contactPhone || "9593712358"}<br />
            Distiller Bond Registration: SCOT-BOND-HW-8841-B
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-800 block">
            Official Invoice & Manifest
          </span>
          <h3 className="font-mono text-base font-bold text-black mt-0.5">
            {order.orderNumber}
          </h3>
          <p className="text-[11px] text-stone-600 mt-0.5">
            Date: {new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-900 border border-stone-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Status: {order.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Consignee & Shipping Dispatch */}
      <div className="grid grid-cols-2 gap-4 text-xs py-3 border-b border-stone-300">
        <div>
          <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-500 mb-1">
            Consignee / Recipient:
          </h4>
          <p className="font-bold text-black text-xs">{order.shippingAddress.fullName}</p>
          <p className="text-stone-700 text-[11px] leading-tight mt-0.5">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country} • Phone: {order.shippingAddress.phone}
          </p>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-500 mb-1">
            Carrier & Compliance:
          </h4>
          <p className="text-stone-700 text-[11px] leading-tight">
            <strong>Carrier:</strong> {order.carrier}<br />
            <strong>Tracking No:</strong> <span className="font-mono font-bold text-black">{order.trackingNumber}</span><br />
            <strong>Verification:</strong> 21+ Age Verified at Release<br />
            <strong>Tx Ref:</strong> {order.payment.transactionId}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="py-3">
        <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-500 mb-1.5">
          Spirits Vault Manifest:
        </h4>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-stone-800 text-black text-[11px]">
              <th className="py-1.5 pr-2 font-bold">Spirit & Cask Spec</th>
              <th className="py-1.5 px-2 font-bold text-center">Batch</th>
              <th className="py-1.5 px-2 font-bold text-center">ABV</th>
              <th className="py-1.5 px-2 font-bold text-center">Qty</th>
              <th className="py-1.5 pl-2 font-bold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-black text-xs">
            {order.items.map((item, idx) => {
              const unitPrice = item.product.salePrice ?? item.product.price;
              return (
                <tr key={idx}>
                  <td className="py-2 pr-2">
                    <p className="font-bold text-black">{item.product.name}</p>
                    <p className="text-[10px] text-stone-600">
                      Cask: {item.product.caskNumber} ({item.product.caskType})
                    </p>
                    {item.giftBox && (
                      <p className="text-[10px] text-amber-800">
                        + Timber Gift Box & Wax Seal
                      </p>
                    )}
                    {item.customEngraving && (
                      <p className="text-[10px] text-stone-600 italic">
                        Engraved: "{item.customEngraving}"
                      </p>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] text-stone-700">
                    {item.product.batchNumber}
                  </td>
                  <td className="py-2 px-2 text-center text-stone-700">
                    {item.product.abv}
                  </td>
                  <td className="py-2 px-2 text-center font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-2 pl-2 text-right font-bold text-black font-mono">
                    {formatPrice(unitPrice * item.quantity, adminSettings.currencySymbol)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals & Notes Breakdown */}
      <div className="border-t-2 border-stone-800 pt-3 flex justify-between gap-6">
        <div className="space-y-1 text-[11px] text-stone-600 max-w-xs">
          <p><strong>Compliance:</strong> Adult 21+ Verification Mandated</p>
          {order.notes && (
            <p className="italic text-[10px] bg-stone-50 p-1.5 rounded border border-stone-200">
              <strong>Notes:</strong> {order.notes}
            </p>
          )}
        </div>

        <div className="w-56 space-y-1 text-xs">
          <div className="flex justify-between text-stone-700">
            <span>Subtotal:</span>
            <span className="font-mono">{formatPrice(order.subtotal, adminSettings.currencySymbol)}</span>
          </div>
          {order.giftBoxFee > 0 && (
            <div className="flex justify-between text-stone-700">
              <span>Artisanal Box:</span>
              <span className="font-mono">+{formatPrice(order.giftBoxFee, adminSettings.currencySymbol)}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discount:</span>
              <span className="font-mono">-{formatPrice(order.discount, adminSettings.currencySymbol)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-700">
            <span>Insured Shipping:</span>
            <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping, adminSettings.currencySymbol)}</span>
          </div>
          <div className="flex justify-between text-stone-700">
            <span>Tax & Excise:</span>
            <span className="font-mono">{formatPrice(order.tax, adminSettings.currencySymbol)}</span>
          </div>
          <div className="border-t border-stone-800 pt-1.5 flex justify-between text-sm font-bold text-black">
            <span>Total Paid:</span>
            <span className="font-mono text-black">{formatPrice(order.total, adminSettings.currencySymbol)}</span>
          </div>
        </div>
      </div>

      {/* Footer Verification Seal */}
      <div className="border-t border-stone-300 pt-3 mt-4 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full border border-stone-400 flex items-center justify-center text-stone-800 font-serif font-bold text-[8px] text-center p-0.5">
            SEALED & PROOVED
          </div>
          <div>
            <p className="font-bold text-black text-xs">Zookas Unity Master Distillers</p>
            <p className="text-[10px] text-stone-500">Direct Bond Vault Release #2026</p>
          </div>
        </div>
        <p className="text-[10px] text-right text-stone-500">
          Official Registered Commercial Invoice • 1 of 1
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Print Isolated Document via Portal */}
      {printRoot && createPortal(renderPrintableDocument(), printRoot)}

      {/* 2. Interactive Screen Preview Modal */}
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:hidden print-modal-chrome">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
          >
            {/* Top Actions Bar */}
            <div className="p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4" />
                Official Spirits Vault Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg transition cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setActiveInvoiceOrder(null)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Document Body on Screen */}
            <div className="p-8 overflow-y-auto space-y-8 text-stone-200">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-800 pb-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-stone-950" />
                    </div>
                    <span className="font-cinzel text-lg font-bold tracking-wider text-stone-100 uppercase">
                      {adminSettings.brandName}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {aboutContent.distilleryAddress}<br />
                    Concierge: {adminSettings.contactEmail} | {adminSettings.contactPhone}<br />
                    Distiller Bond Registration #US-DIST-77281
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs uppercase tracking-widest font-semibold text-amber-400 block">
                    Invoice & Manifest
                  </span>
                  <h3 className="font-mono text-lg font-bold text-stone-100 mt-0.5">
                    {order.orderNumber}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Date: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-700/50">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Status: {order.status}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-stone-800 pb-6">
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Consignee / Recipient:
                  </h4>
                  <p className="font-bold text-stone-200 text-sm">{order.shippingAddress.fullName}</p>
                  <p className="text-stone-300 mt-1">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}<br />
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Carrier & Dispatch Specs:
                  </h4>
                  <p className="text-stone-300">
                    <strong>Carrier:</strong> {order.carrier}<br />
                    <strong>Tracking Number:</strong> <span className="font-mono text-amber-400">{order.trackingNumber}</span><br />
                    <strong>Compliance:</strong> Adult 21+ Verification Mandated<br />
                    <strong>Payment Reference:</strong> {order.payment.transactionId}
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-400 mb-3">
                  Spirits Vault Manifest:
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400">
                        <th className="py-2.5 pr-4 font-semibold">Spirit & Cask Spec</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Batch #</th>
                        <th className="py-2.5 px-3 font-semibold text-center">ABV</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                        <th className="py-2.5 pl-4 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-850 text-stone-200">
                      {order.items.map((item, idx) => {
                        const unitPrice = item.product.salePrice ?? item.product.price;
                        return (
                          <tr key={idx}>
                            <td className="py-3 pr-4">
                              <p className="font-bold text-stone-100">{item.product.name}</p>
                              <p className="text-[11px] text-stone-400">
                                Cask: {item.product.caskNumber} ({item.product.caskType})
                              </p>
                              {item.giftBox && (
                                <p className="text-[11px] text-amber-400 mt-0.5">
                                  + Timber Gift Box & Beeswax Seal
                                </p>
                              )}
                              {item.customEngraving && (
                                <p className="text-[11px] text-stone-400 italic">
                                  Engraved: "{item.customEngraving}"
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-stone-400">
                              {item.product.batchNumber}
                            </td>
                            <td className="py-3 px-3 text-center text-stone-400">
                              {item.product.abv}
                            </td>
                            <td className="py-3 px-3 text-center font-bold">
                              {item.quantity}
                            </td>
                            <td className="py-3 pl-4 text-right font-bold text-amber-400">
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
              <div className="border-t border-stone-800 pt-4 flex flex-col sm:flex-row justify-between gap-6">
                <div className="space-y-2 text-xs text-stone-400 max-w-sm">
                  <p><strong>Compliance:</strong> 21+ Age Verified at Checkout</p>
                  {order.notes && (
                    <p className="italic text-[11px] bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <strong>Delivery Notes:</strong> {order.notes}
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal, adminSettings.currencySymbol)}</span>
                  </div>
                  {order.giftBoxFee > 0 && (
                    <div className="flex justify-between text-stone-300">
                      <span>Artisanal Packaging:</span>
                      <span>+{formatPrice(order.giftBoxFee, adminSettings.currencySymbol)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-{formatPrice(order.discount, adminSettings.currencySymbol)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-300">
                    <span>Insured Shipping:</span>
                    <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping, adminSettings.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Excise & Sales Tax:</span>
                    <span>{formatPrice(order.tax, adminSettings.currencySymbol)}</span>
                  </div>
                  <div className="border-t border-stone-700 pt-2 flex justify-between text-base font-bold text-stone-100">
                    <span>Total Paid:</span>
                    <span className="text-amber-400">{formatPrice(order.total, adminSettings.currencySymbol)}</span>
                  </div>
                </div>
              </div>

              {/* Master Distiller Verification Stamp */}
              <div className="border-t border-stone-800 pt-6 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-amber-600/40 flex items-center justify-center text-amber-500 font-cinzel font-bold text-[10px] text-center p-1">
                    SEALED & PROOVED
                  </div>
                  <div>
                    <p className="font-semibold text-stone-300">Zookas Unity Master Distillers</p>
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
    </>
  );
};

