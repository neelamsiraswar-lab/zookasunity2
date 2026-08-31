import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BlogPost } from '../../types';
import { 
  BookOpen, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Share2, 
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const { blogPosts, selectedArticle, setSelectedArticle, addBlogComment } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [commentName, setCommentName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');

  const categories = ['All', 'Distillation Science', 'Craft Cocktail & Mixology', 'Mixology & Pairing'];

  const filteredPosts = blogPosts.filter((post) => {
    if (activeCategory !== 'All' && post.category !== activeCategory) {
      return false;
    }
    return true;
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArticle && commentText.trim()) {
      addBlogComment(selectedArticle.id, {
        name: commentName.trim() || 'Spirits Enthusiast',
        text: commentText.trim()
      });
      setCommentText('');
      setCommentName('');
    }
  };

  // Full Article Reader View
  if (selectedArticle) {
    // Sync comments with current store state
    const currentPost = blogPosts.find(p => p.id === selectedArticle.id) || selectedArticle;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full max-w-full overflow-x-hidden">
        {/* Back Button */}
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasting Journal</span>
        </button>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span>{currentPost.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-400">
              <Clock className="w-3.5 h-3.5" />
              {currentPost.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 leading-tight">
            {currentPost.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src={currentPost.author.avatar}
              alt={currentPost.author.name}
              className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
            />
            <div className="text-xs">
              <p className="font-bold text-stone-200">{currentPost.author.name}</p>
              <p className="text-stone-400">{currentPost.author.role} • Published {currentPost.publishedDate}</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-stone-800 bg-stone-950">
          <img
            src={currentPost.coverImage}
            alt={currentPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-stone-300 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line border-b border-stone-800 pb-10">
          {currentPost.content}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {currentPost.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-stone-900 text-stone-300 text-xs rounded-full border border-stone-800">
              #{tag}
            </span>
          ))}
        </div>

        {/* Comments Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Tasting Discussions ({currentPost.comments.length})
            </h3>
          </div>

          {/* Existing Comments */}
          <div className="space-y-4 divide-y divide-stone-800">
            {currentPost.comments.length === 0 ? (
              <p className="text-xs text-stone-500 italic">Be the first to share your tasting impressions.</p>
            ) : (
              currentPost.comments.map((comment) => (
                <div key={comment.id} className="pt-4 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-200">{comment.name}</span>
                    <span className="text-stone-500">{comment.date}</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="pt-4 border-t border-stone-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Share Your Sensory Notes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name (or title)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <textarea
              required
              rows={3}
              placeholder="What did you taste? Share aroma notes, barrel comparisons, or pairing suggestions..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Tasting Comment</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-stone-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Master Distiller Notes
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
            The Tasting Journal & Mixology
          </h1>
          <p className="text-sm text-stone-400 mt-1 max-w-xl">
            Deep-dives into wood chemistry, copper pot kinetics, botanical foraging, and craft cocktail alchemy.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => {
              setSelectedArticle(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-600/40 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-amber-950/30"
          >
            <div>
              <div className="aspect-[16/10] bg-stone-950 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1 text-stone-400">
                    <Clock className="w-3 h-3" />
                    {post.readTimeMinutes}m
                  </span>
                </div>

                <h2 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-400 transition line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-800/60 mt-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover border border-stone-700"
                />
                <span className="truncate">{post.author.name}</span>
              </div>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                Read Article
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
