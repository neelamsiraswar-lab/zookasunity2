import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Sparkles, 
  Award, 
  Wine, 
  Gift, 
  ShieldCheck, 
  Flame, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  GlassWater,
  Building2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { activeProductModal, setActiveProductModal, addToCart } = useStore();
  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [giftBox, setGiftBox] = useState<boolean>(false);
  const [customEngraving, setCustomEngraving] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const unitPrice = product.salePrice ?? product.price;
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, giftBox, customEngraving);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setActiveProductModal(null);
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveProductModal(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/80 border border-stone-700 text-stone-300 hover:text-white hover:border-amber-500 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Image Gallery & Badges */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center">
                  <img
                    src={product.images[selectedImgIndex] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {product.isLimitedRelease && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                      Limited Cask Lot
                    </span>
                  )}
                  {product.salePrice && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-full">
                      SAVE ${(product.price - product.salePrice).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImgIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          selectedImgIndex === idx ? 'border-amber-500 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Awards ribbon */}
                {product.awards.length > 0 && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                      <Award className="w-4 h-4 text-amber-400" />
                      Distillery Accolades
                    </span>
                    {product.awards.map((award, i) => (
                      <p key={i} className="text-xs text-amber-200/90 flex items-start gap-1">
                        <span>•</span>
                        <span>{award}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Spirit Story, Specs, Tasting Notes & Cart */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>Batch {product.batchNumber}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                    {product.name}
                  </h2>
                  <p className="text-sm text-stone-400 mt-1 italic">
                    "{product.tagline}"
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 font-bold text-stone-200">{product.rating}</span>
                      <span className="text-stone-500 ml-1">({product.reviewCount} reviews)</span>
                    </div>
                    <span className="text-stone-700">|</span>
                    <span className="text-xs text-stone-400">
                      Distilled by <strong className="text-stone-200">{product.distillerName}</strong> ({product.distillerOrigin})
                    </span>
                  </div>
                </div>

                {/* Key Distiller Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 text-center">
                  <div className="p-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">ABV / Proof</span>
                    <strong className="text-sm text-amber-400 font-serif">{product.abv} ({product.proof}°)</strong>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">Cask Lot</span>
                    <strong className="text-xs text-stone-200 truncate block">{product.caskNumber}</strong>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">Cask Finish</span>
                    <strong className="text-xs text-stone-200 truncate block">{product.caskType}</strong>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">Live Stock</span>
                    <strong className={`text-xs ${product.stockQuantity <= product.lowStockThreshold ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} btls left` : 'Sold Out'}
                    </strong>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Tasting Notes Ledger */}
                <div className="p-4 bg-stone-950/40 rounded-xl border border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Master Distiller's Tasting Profile
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-stone-300 block mb-1">Aroma & Nose:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tastingNotes.aroma.map((note, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-stone-800 text-stone-200 rounded-md border border-stone-700">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-stone-300 block mb-1">Palate & Mouthfeel:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tastingNotes.palate.map((note, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-amber-950/50 text-amber-300 rounded-md border border-amber-800/40">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-stone-300 block mb-1">The Finish:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tastingNotes.finish.map((note, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-stone-800 text-stone-300 rounded-md border border-stone-700">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature Cocktail Pairing Card */}
                {product.cocktailPairing && (
                  <div className="p-4 bg-gradient-to-r from-stone-950 to-stone-900 rounded-xl border border-amber-800/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <GlassWater className="w-4 h-4 text-amber-400" />
                        Signature Pairing: {product.cocktailPairing.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                        {product.cocktailPairing.glassware}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 italic">{product.cocktailPairing.tagline}</p>
                    <div className="pt-2 text-xs text-stone-300 space-y-1">
                      <p className="font-semibold text-stone-200">Ingredients:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-stone-400">
                        {product.cocktailPairing.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                      <p className="font-semibold text-stone-200 pt-1">Preparation:</p>
                      <p className="text-stone-400">{product.cocktailPairing.instructions}</p>
                    </div>
                  </div>
                )}

                {/* Gift Box & Custom Engraving */}
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={giftBox}
                        onChange={(e) => setGiftBox(e.target.checked)}
                        className="w-4 h-4 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-500/20"
                      />
                      <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-amber-400" />
                        Add Handcrafted Timber Gift Box & Beeswax Seal (+ $15.00)
                      </span>
                    </div>
                  </label>

                  {giftBox && (
                    <div className="pt-2">
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                        Optional Bottle Laser Engraving (Max 35 chars)
                      </label>
                      <input
                        type="text"
                        maxLength={35}
                        placeholder="e.g. Reserve for Lord Arthur 2026"
                        value={customEngraving}
                        onChange={(e) => setCustomEngraving(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* Price, Quantity & Add To Cart Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800">
                  <div className="w-full sm:w-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-serif text-amber-400">
                        ${unitPrice}
                      </span>
                      {product.salePrice && (
                        <span className="text-sm text-stone-500 line-through">
                          ${product.price}
                        </span>
                      )}
                      <span className="text-xs text-stone-400">/ {product.bottleSize}</span>
                    </div>
                    <span className="text-[11px] text-stone-500">Includes spirits excise tax calculation</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-stone-700 rounded-xl bg-stone-950 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 text-stone-400 hover:text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-stone-100">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        disabled={quantity >= product.stockQuantity}
                        className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        addedAnimation
                          ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/20'
                          : isOutOfStock
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 active:scale-[0.99]'
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Spirits Bag!</span>
                        </>
                      ) : isOutOfStock ? (
                        <span>Sold Out</span>
                      ) : (
                        <>
                          <Wine className="w-4 h-4" />
                          <span>Add to Cask Selection</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
