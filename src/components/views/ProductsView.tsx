import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { SpiritCategory, SpiritProduct } from '../../types';
import { 
  Search, 
  SlidersHorizontal, 
  Wine, 
  Award, 
  Sparkles, 
  Flame, 
  Star, 
  Check, 
  X,
  AlertCircle,
  Filter
} from 'lucide-react';
import { formatPrice } from '../../utils/currency';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setActiveProductModal,
    addToCart,
    adminSettings
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'age'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [abvFilter, setAbvFilter] = useState<'all' | 'under-45' | '45-50' | 'above-50'>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  const categories: SpiritCategory[] = [
    'All',
    'Single Malt Whisky',
    'Cask Strength Bourbon',
    'Botanical Gin',
    'Artisanal Rum',
    'Artisanal Mezcal',
    'Unity Reserve Vodka'
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        const matchesCask = product.caskType.toLowerCase().includes(q) || product.caskNumber.toLowerCase().includes(q);
        const matchesDistiller = product.distillerName.toLowerCase().includes(q) || product.distillerOrigin.toLowerCase().includes(q);
        const matchesAroma = product.tastingNotes.aroma.some(a => a.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesTagline && !matchesCask && !matchesDistiller && !matchesAroma) {
          return false;
        }
      }

      // Price filter
      const unitPrice = product.salePrice ?? product.price;
      if (unitPrice > maxPrice) {
        return false;
      }

      // In stock only
      if (inStockOnly && product.stockQuantity <= 0) {
        return false;
      }

      // ABV Filter
      const abvNum = parseFloat(product.abv.replace('%', ''));
      if (abvFilter === 'under-45' && abvNum >= 45) return false;
      if (abvFilter === '45-50' && (abvNum < 45 || abvNum > 50)) return false;
      if (abvFilter === 'above-50' && abvNum <= 50) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'age') return (b.ageYears ?? 0) - (a.ageYears ?? 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, abvFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(50000);
    setAbvFilter('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="border-b border-stone-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Artisanal Cellar Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
            The Spirits Vault
          </h1>
          <p className="text-sm text-stone-400 mt-1 max-w-xl">
            Explore small-batch single casks, uncut cask-strength bourbons, and wild alpine botanical distillations with transparent cask tracking.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search spirits, aroma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="md:hidden p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-300 flex items-center gap-1.5 text-xs"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Desktop Filter & Sort Controls Row */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
        <div className="flex items-center gap-6 text-xs">
          {/* Max Price */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium">Max Price:</span>
            <input
              type="range"
              min={2000}
              max={50000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-amber-500"
            />
            <span className="text-amber-400 font-bold">{formatPrice(maxPrice, adminSettings.currencySymbol)}</span>
          </div>

          {/* ABV Level */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium">Proof / ABV:</span>
            <select
              value={abvFilter}
              onChange={(e) => setAbvFilter(e.target.value as any)}
              className="px-2.5 py-1 text-xs bg-stone-800 border border-stone-700 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Proofs</option>
              <option value="under-45">Under 45% ABV</option>
              <option value="45-50">45% – 50% ABV</option>
              <option value="above-50">50%+ Cask Strength</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-300 hover:text-white">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-500/20"
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="featured">Featured Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="age">Age: Oldest Cask</option>
          </select>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilterDrawer && (
        <div className="md:hidden p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-200 uppercase tracking-wider">Refine Spirits</span>
            <button onClick={() => setShowFilterDrawer(false)} className="text-stone-400">✕</button>
          </div>
          <div>
            <span className="text-stone-400 block mb-1">Max Price: {formatPrice(maxPrice, adminSettings.currencySymbol)}</span>
            <input
              type="range"
              min={2000}
              max={50000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <span className="text-stone-400 block mb-1">ABV Proof Filter:</span>
            <select
              value={abvFilter}
              onChange={(e) => setAbvFilter(e.target.value as any)}
              className="w-full p-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-200"
            >
              <option value="all">All Proofs</option>
              <option value="under-45">Under 45% ABV</option>
              <option value="45-50">45% – 50% ABV</option>
              <option value="above-50">50%+ Cask Strength</option>
            </select>
          </div>
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span>In Stock Only</span>
            </label>
            <button onClick={resetFilters} className="text-amber-400 underline">Reset</button>
          </div>
        </div>
      )}

      {/* Active Results Bar */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>
          Showing <strong className="text-stone-200">{filteredProducts.length}</strong> spirits in vault
          {selectedCategory !== 'All' && <span> • Category: <strong className="text-amber-400">{selectedCategory}</strong></span>}
        </span>
        {(searchQuery || selectedCategory !== 'All' || maxPrice < 50000 || abvFilter !== 'all' || inStockOnly) && (
          <button
            onClick={resetFilters}
            className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <Wine className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-200">No Spirits Match Your Search</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try loosening your price filters or searching for tasting notes like "Sherry", "Vanilla", or "Smoke".
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((spirit) => {
            const unitPrice = spirit.salePrice ?? spirit.price;
            const isLowStock = spirit.stockQuantity <= spirit.lowStockThreshold && spirit.stockQuantity > 0;
            const isOutOfStock = spirit.stockQuantity === 0;

            return (
              <div
                key={spirit.id}
                className="group flex flex-col rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/40"
              >
                {/* Image & Badges */}
                <div
                  className="relative aspect-[3/4] bg-stone-950 overflow-hidden cursor-pointer"
                  onClick={() => setActiveProductModal(spirit)}
                >
                  <img
                    src={spirit.images[0]}
                    alt={spirit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {spirit.isLimitedRelease && (
                      <span className="px-2.5 py-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider rounded-md shadow">
                        Limited Release
                      </span>
                    )}
                    {spirit.salePrice && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md shadow">
                        Special Price
                      </span>
                    )}
                  </div>

                  {/* Low Stock Warning Badge */}
                  {isLowStock && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-950/90 text-amber-300 text-[10px] font-semibold rounded border border-amber-600/40 backdrop-blur-sm">
                      {spirit.stockQuantity} btls left
                    </div>
                  )}

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="px-4 py-2 bg-stone-900 text-stone-300 font-serif font-bold text-xs uppercase tracking-wider rounded-lg border border-stone-700">
                        Cask Lot Sold Out
                      </span>
                    </div>
                  )}

                  {/* Cask Spec Bottom Pill */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-stone-950/80 backdrop-blur-sm text-stone-300 text-[10px] font-mono rounded border border-stone-700">
                    {spirit.abv} • {spirit.proof}°
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                      <span>{spirit.category}</span>
                      <div className="flex items-center gap-1 text-stone-400">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{spirit.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setActiveProductModal(spirit)}
                      className="font-serif text-base font-bold text-stone-100 hover:text-amber-400 transition cursor-pointer line-clamp-2 mt-1"
                    >
                      {spirit.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 italic">
                      "{spirit.tagline}"
                    </p>

                    {/* Cask Finish Tag */}
                    <p className="text-[11px] text-stone-400 mt-2 truncate">
                      Cask: <span className="text-stone-300">{spirit.caskType}</span>
                    </p>

                    {/* Tasting Notes */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {spirit.tastingNotes.aroma.slice(0, 3).map((note, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700/60">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg font-bold text-amber-400">
                          {formatPrice(unitPrice, adminSettings.currencySymbol)}
                        </span>
                        {spirit.salePrice && (
                          <span className="text-xs text-stone-500 line-through">
                            {formatPrice(spirit.price, adminSettings.currencySymbol)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {spirit.bottleSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveProductModal(spirit)}
                        className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg transition"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => addToCart(spirit, 1)}
                        disabled={isOutOfStock}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 text-xs font-bold rounded-lg transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
