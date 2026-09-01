import React, { useState, useMemo } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  Sparkles, 
  MessageSquarePlus, 
  Filter, 
  Trash2, 
  Wine, 
  HeartHandshake, 
  Award,
  Send,
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductReview, SpiritProduct } from '../types';

interface ProductReviewsSectionProps {
  product: SpiritProduct;
}

const AVAILABLE_TASTING_TAGS = [
  'Smoky Peat',
  'Rich Caramel',
  'Vanilla Pod',
  'Spiced Oak',
  'Dried Fig',
  'Sherry Cask',
  'Smooth Finish',
  'High Proof Heat',
  'Citrus Zest',
  'Floral Honey',
  'Tobacco Leaf',
  'Dark Chocolate',
  'Toasted Almond',
  'Sea Salt & Brine'
];

const RATING_LABELS: Record<number, string> = {
  1: 'Disappointing - Needs Refinement',
  2: 'Fair - Below Reserve Standard',
  3: 'Pleasant - Balanced Daily Sip',
  4: 'Very Good - Exceptional Expression',
  5: 'Masterpiece - Unrivaled Connoisseur Selection'
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { 
    reviews, 
    addProductReview, 
    deleteProductReview, 
    voteReviewHelpful, 
    customer, 
    isCustomerLoggedIn,
    openAuthModal 
  } = useStore();

  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | 'all'>('all');

  // Form State
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formUserName, setFormUserName] = useState<string>(customer.name || '');
  const [formUserEmail, setFormUserEmail] = useState<string>(customer.email || '');
  const [formRecommended, setFormRecommended] = useState<boolean>(true);
  const [formSelectedTags, setFormSelectedTags] = useState<string[]>([]);
  const [formIsSubmitting, setFormIsSubmitting] = useState<boolean>(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // Filter reviews for this product
  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === product.id);
  }, [reviews, product.id]);

  // Rating distribution calculation
  const stats = useMemo(() => {
    const total = productReviews.length;
    if (total === 0) {
      return {
        total: 0,
        average: product.rating || 5.0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendPercent: 100
      };
    }

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let recommendCount = 0;
    let sumRating = 0;

    productReviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      dist[rounded] = (dist[rounded] || 0) + 1;
      sumRating += r.rating;
      if (r.recommended !== false) recommendCount++;
    });

    const avg = Number((sumRating / total).toFixed(1));
    const percentDist: Record<number, number> = {
      5: Math.round((dist[5] / total) * 100),
      4: Math.round((dist[4] / total) * 100),
      3: Math.round((dist[3] / total) * 100),
      2: Math.round((dist[2] / total) * 100),
      1: Math.round((dist[1] / total) * 100)
    };

    return {
      total,
      average: avg,
      distribution: dist,
      percentDistribution: percentDist,
      recommendPercent: Math.round((recommendCount / total) * 100)
    };
  }, [productReviews, product.rating]);

  // Filtered and sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...productReviews];

    if (filterRating !== 'all') {
      list = list.filter(r => Math.round(r.rating) === filterRating);
    }

    if (selectedTagFilter !== 'all') {
      list = list.filter(r => r.tastingNotesTags?.includes(selectedTagFilter));
    }

    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      if (sortBy === 'helpful') {
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      }
      return 0;
    });

    return list;
  }, [productReviews, filterRating, selectedTagFilter, sortBy]);

  const toggleFormTag = (tag: string) => {
    setFormSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage(null);

    const authorName = formUserName.trim() || customer.name || 'Connoisseur Enthusiast';
    const authorEmail = formUserEmail.trim() || customer.email || 'collector@unityspirits.com';

    if (!formTitle.trim()) {
      setFormErrorMessage('Please provide a headline for your tasting review.');
      return;
    }

    if (!formComment.trim() || formComment.trim().length < 15) {
      setFormErrorMessage('Please write at least 15 characters describing your tasting experience.');
      return;
    }

    setFormIsSubmitting(true);
    try {
      await addProductReview({
        productId: product.id,
        productName: product.name,
        userId: customer.id || `guest-${Date.now()}`,
        userName: authorName,
        userEmail: authorEmail,
        rating: formRating,
        title: formTitle.trim(),
        comment: formComment.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verifiedPurchase: true,
        recommended: formRecommended,
        helpfulCount: 0,
        helpfulVoters: [],
        tastingNotesTags: formSelectedTags
      });

      setFormSuccessMessage('Your connoisseur tasting review has been recorded to the live vault!');
      setFormTitle('');
      setFormComment('');
      setFormSelectedTags([]);
      setIsWritingReview(false);

      setTimeout(() => {
        setFormSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setFormErrorMessage(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setFormIsSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    await voteReviewHelpful(reviewId);
  };

  return (
    <div className="pt-6 border-t border-stone-800 space-y-6" id={`reviews-section-${product.id}`}>
      {/* Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
              Connoisseur Tasting Reviews
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Verified collector impressions & master cellar tasting notes
          </p>
        </div>

        <button
          onClick={() => {
            setIsWritingReview(!isWritingReview);
            setFormErrorMessage(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
            isWritingReview
              ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4 text-amber-400" />
          {isWritingReview ? 'Close Review Form' : 'Write a Tasting Review'}
        </button>
      </div>

      {/* Success Notification */}
      {formSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-950/40 border border-emerald-700/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{formSuccessMessage}</span>
        </motion.div>
      )}

      {/* Write Review Form Card */}
      <AnimatePresence>
        {isWritingReview && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitReview}
            className="p-4 sm:p-6 bg-stone-950/80 border border-amber-800/40 rounded-2xl space-y-4 overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Wine className="w-4 h-4" />
                Submit Your Tasting Ledger for {product.name}
              </h4>
              <span className="text-[11px] text-stone-500">Live Firestore Ledger</span>
            </div>

            {formErrorMessage && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formErrorMessage}</span>
              </div>
            )}

            {/* Star Rating Selection */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1.5">
                Overall Spirit Rating *
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className="p-1 text-stone-600 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          (formHoverRating || formRating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-300">
                  {RATING_LABELS[formHoverRating || formRating]}
                </span>
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1">
                  Your Connoisseur Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Sommelier Julian"
                  value={formUserName}
                  onChange={(e) => setFormUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1">
                  Email (Kept Private)
                </label>
                <input
                  type="email"
                  placeholder="collector@example.com"
                  value={formUserEmail}
                  onChange={(e) => setFormUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1">
                Headline / Summary *
              </label>
              <input
                type="text"
                required
                maxLength={90}
                placeholder="e.g. Rich peat smoke followed by velvety fig and toasted oak"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1">
                Tasting Impressions & Detailed Commentary *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Detail the nose aroma, mouthfeel, proof integration, and linger on the palate..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            {/* Tasting Notes Tags Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1.5 flex items-center justify-between">
                <span>Select Flavor Profile Notes ({formSelectedTags.length} selected)</span>
                <span className="text-[10px] text-stone-500 lowercase">click tags to apply</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TASTING_TAGS.map((tag) => {
                  const isSelected = formSelectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleFormTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommendation Toggle */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formRecommended}
                  onChange={(e) => setFormRecommended(e.target.checked)}
                  className="w-4 h-4 rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-xs text-stone-300 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  I recommend this rare spirit to fellow collectors
                </span>
              </label>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formIsSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {formIsSubmitting ? 'Recording to Cloud...' : 'Publish Tasting Review'}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Aggregate Rating Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-6 bg-stone-950/60 border border-stone-800 rounded-2xl">
        {/* Left: Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-stone-800">
          <span className="text-4xl sm:text-5xl font-bold font-serif text-amber-400">
            {stats.average}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.average)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-stone-400 font-medium">
            Based on {stats.total} {stats.total === 1 ? 'connoisseur review' : 'connoisseur reviews'}
          </span>
          <div className="mt-3 px-3 py-1 bg-amber-950/40 border border-amber-800/40 rounded-full flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{stats.recommendPercent}% of patrons recommend</span>
          </div>
        </div>

        {/* Middle: Rating Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2 py-1 px-1 sm:px-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const percent = stats.percentDistribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const isSelected = filterRating === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setFilterRating(isSelected ? 'all' : star)}
                className={`flex items-center gap-3 w-full group text-left cursor-pointer p-1 rounded-lg transition ${
                  isSelected ? 'bg-amber-950/30 ring-1 ring-amber-500/40' : 'hover:bg-stone-900/50'
                }`}
              >
                <div className="flex items-center gap-1 w-12 text-xs text-stone-300 font-medium">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="w-12 text-right text-xs text-stone-400 group-hover:text-stone-200">
                  {count}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Rating Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
              filterRating === 'all'
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            All Ratings ({stats.total})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setFilterRating(filterRating === s ? 'all' : s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border flex items-center gap-1 ${
                filterRating === s
                  ? 'bg-amber-500 text-stone-950 border-amber-500 font-semibold'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <span>{s}★</span>
              <span className="text-[10px] opacity-75">({stats.distribution[s as 1|2|3|4|5] || 0})</span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 text-xs bg-stone-900 border border-stone-800 text-stone-300 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="highest">Sort: Highest Rated</option>
            <option value="lowest">Sort: Lowest Rated</option>
            <option value="helpful">Sort: Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {displayedReviews.length === 0 ? (
          <div className="p-8 bg-stone-950/40 border border-stone-800/80 rounded-2xl text-center space-y-3">
            <Wine className="w-8 h-8 text-stone-600 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-stone-300">
                {filterRating !== 'all'
                  ? `No ${filterRating}-star reviews recorded yet.`
                  : 'No customer reviews published yet.'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Be the first spirit enthusiast to share your impressions of this release!
              </p>
            </div>
            <button
              onClick={() => setIsWritingReview(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              Write First Review
            </button>
          </div>
        ) : (
          displayedReviews.map((review) => {
            const voterId = customer.id || 'guest-voter';
            const hasVoted = review.helpfulVoters?.includes(voterId);

            return (
              <div
                key={review.id}
                id={`review-card-${review.id}`}
                className="p-4 sm:p-5 bg-stone-950/70 border border-stone-800 hover:border-stone-700/80 rounded-2xl transition space-y-3"
              >
                {/* Top Row: Stars, Verified Badge, Date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="font-bold text-xs text-stone-200">
                      {review.userName}
                    </span>

                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified Connoisseur
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-stone-500">
                    {review.date}
                  </span>
                </div>

                {/* Title */}
                <h5 className="font-serif text-sm sm:text-base font-bold text-stone-100">
                  {review.title}
                </h5>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {review.comment}
                </p>

                {/* Tasting Tags */}
                {review.tastingNotesTags && review.tastingNotesTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mr-1">
                      Notes:
                    </span>
                    {review.tastingNotesTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-amber-300/90 text-[11px] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Bar: Recommendation, Helpful Vote & Delete */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-800/80 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    {review.recommended !== false ? (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Recommends this bottle
                      </span>
                    ) : (
                      <span className="text-stone-500 text-[11px]">
                        Neutral impression
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(review.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition cursor-pointer border ${
                        hasVoted
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>Helpful ({review.helpfulCount || 0})</span>
                    </button>

                    {/* Delete button if matching user or admin */}
                    {(customer.id === review.userId || customer.email === review.userEmail) && (
                      <button
                        type="button"
                        onClick={() => deleteProductReview(review.id)}
                        className="p-1 text-stone-600 hover:text-rose-400 transition"
                        title="Delete your review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
