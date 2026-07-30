import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, FileText, Clock, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import type { BlogPost } from '../types';
import { getStoredBlogPosts, subscribeBlogUpdates } from '../utils/blogStore';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openConsultationModal } = useModal();
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return subscribeBlogUpdates((updatedPosts) => {
      setPosts(updatedPosts);
    });
  }, []);

  const decodedSlug = slug ? decodeURIComponent(slug) : '';
  const post = posts.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      p.slug === decodedSlug ||
      p.metaSlug === slug ||
      p.metaSlug === decodedSlug
  ) || posts[0];

  /* Meta tags, Robots & Canonical URL update */
  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || post.title;
      const upsertMeta = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };
      upsertMeta('description', post.metaDescription || post.excerpt);
      upsertMeta('keywords', post.metaKeywords || (post.tags || []).join(', '));
      upsertMeta('robots', post.metaRobots || 'index, follow, max-image-preview:large, max-snippet:-1');

      // Canonical URL tag injection
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      const canonicalHref = post.canonicalUrl || `${window.location.origin}/blog/${post.metaSlug || post.slug}`;
      canonical.setAttribute('href', canonicalHref);
    }
  }, [post]);

  /* Scroll progress bar */
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setProgress(pct);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const normalizeCategory = (cat?: string) => {
    if (!cat) return 'Digital Marketing';
    if (cat === 'Perf Marketing') return 'Performance Marketing';
    if (cat === 'Web Dev') return 'Web Development';
    return cat;
  };

  /* Dynamic Categories with actual post counts (Capped to max 10) */
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();

    posts.forEach((p) => {
      const cat = normalizeCategory(p.category);
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [posts]);

  /* Recent Posts list */
  const recentPostsList = useMemo(() => {
    return posts.slice(0, 10);
  }, [posts]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 mb-3">Article Not Found</h1>
          <Link
            to="/blog"
            className="px-5 py-3 rounded-2xl bg-[#1352D0] text-white font-extrabold text-xs inline-flex items-center space-x-2"
          >
            <span>← Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-24 relative">
      {/* CUSTOM SCRIPT INJECTION */}
      {post?.customScript && <div dangerouslySetInnerHTML={{ __html: post.customScript }} />}

      {/* READING PROGRESS BAR — Positioned cleanly at top-0 without background line overlap */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.05 }}
          className="h-full bg-gradient-to-r from-[#D91212] via-[#1352D0] to-[#F4B400]"
        />
      </div>

      {/* =============================== HEADER HERO BANNER =============================== */}
      <header className="relative bg-[#1D2B53] text-white pt-32 sm:pt-36 pb-12 sm:pb-14 overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Blogs
          </h1>
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-300 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Home
            </Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/blog" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Blogs
            </Link>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-100 font-extrabold truncate max-w-md">
              {post.category || 'Digital Marketing'}
            </span>
          </nav>
        </div>
      </header>

      {/* =============================== MAIN CONTENT AREA =============================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: MAIN ARTICLE BODY (8 COLS) */}
          <article className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
            
            {/* FEATURED COVER IMAGE */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto max-h-[460px] object-cover"
              />
            </div>

            {/* MAIN BLOG TITLE */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#1D2B53] leading-snug tracking-tight">
              {post.title}
            </h2>

            {/* AUTHOR INFO & DESIGNATION BADGE CARD (Positioned before article reading) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-slate-100/70 border border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4 shadow-xs">
              <div className="flex items-center space-x-3.5">
                <img
                  src={post.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={post.author?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1352D0]/40 shadow-xs shrink-0"
                />
                <div>
                  <div className="text-sm font-black text-slate-900 flex items-center space-x-2">
                    <span>{post.author?.name || 'Sumit Sharma'}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1352D0] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {post.category || 'SEO Strategy'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1352D0] mt-0.5">
                    {post.author?.role || 'Founder & Chief Growth Officer'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-bold text-slate-600 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/80">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#1352D0]" />
                  <span>{post.publishedAt || 'July 28, 2026'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{post.readTime || '6 min read'}</span>
                </div>
              </div>
            </div>

            {/* BLOG ARTICLE CONTENT BODY */}
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 pt-2 border-t border-slate-100
                prose-headings:font-black prose-headings:text-[#1D2B53] prose-headings:tracking-tight
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-slate-900 prose-strong:font-black
                prose-a:text-[#1352D0] prose-a:font-bold hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* FREQUENTLY ASKED QUESTIONS SECTION */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h3 className="text-xl font-black text-[#1D2B53]">
                Frequently Asked Questions
              </h3>

              {post.faqs && post.faqs.length > 0 ? (
                <div className="space-y-3">
                  {post.faqs.map((faq, index) => (
                    <details key={index} className="group bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center text-sm">
                        <span>{faq.question}</span>
                        <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-amber-900 text-xs sm:text-sm font-semibold shadow-xs">
                  No FAQs available for this blog.
                </div>
              )}
            </div>

          </article>

          {/* RIGHT COLUMN: SIDEBAR WIDGETS (4 COLS) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* WIDGET 1: CATEGORIES */}
            <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-slate-200/90 shadow-sm space-y-4 font-sans">
              <h3 className="text-xs sm:text-sm font-black uppercase text-[#1D2B53] tracking-wider pb-2 border-b-2 border-[#1D2B53]">
                CATEGORIES
              </h3>
              <div className="space-y-2">
                {categoryCounts.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/blog?category=${encodeURIComponent(cat.name)}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all text-xs font-bold text-slate-800 hover:text-[#1352D0] group shadow-xs"
                  >
                    <span>{cat.name}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 group-hover:bg-[#1352D0] text-slate-600 group-hover:text-white text-[10px] font-extrabold transition-colors">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* WIDGET 2: RECENT POSTS */}
            <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-slate-200/90 shadow-sm space-y-4 font-sans">
              <h3 className="text-xs sm:text-sm font-black uppercase text-[#1D2B53] tracking-wider pb-2 border-b-2 border-[#1D2B53]">
                RECENT POSTS
              </h3>
              <div className="space-y-2.5">
                {recentPostsList.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug || p.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="block p-3.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all text-xs font-bold text-slate-800 hover:text-[#1352D0] leading-snug shadow-xs"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
};
