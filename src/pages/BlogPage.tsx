import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, TrendingUp, Code2, Users, Palette, Cpu, Award, Star, CheckCircle2, ShieldCheck, Zap, Camera, BarChart3, Sparkles, FileText, Clock, User, Tag, BookOpen, Compass, Rocket, Target, Layers } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import type { BlogPost } from '../types';
import { getStoredBlogPosts, subscribeBlogUpdates } from '../utils/blogStore';

export const BlogPage: React.FC = () => {
  const { openConsultationModal } = useModal();
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    return subscribeBlogUpdates((updatedPosts) => {
      setPosts(updatedPosts);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [posts]);

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'SEO Strategy': return { tag: 'bg-blue-50 text-[#1352D0] border-blue-200', dot: 'bg-[#1352D0]', text: 'text-[#1352D0]' };
      case 'Performance Marketing': return { tag: 'bg-red-50 text-[#D91212] border-red-200', dot: 'bg-[#D91212]', text: 'text-[#D91212]' };
      case 'Web Development': return { tag: 'bg-blue-50 text-[#1352D0] border-blue-200', dot: 'bg-[#1352D0]', text: 'text-[#1352D0]' };
      case 'Social Media': return { tag: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-[#F4B400]', text: 'text-amber-800' };
      case 'AI Marketing': return { tag: 'bg-blue-50 text-[#1352D0] border-blue-200', dot: 'bg-[#1352D0]', text: 'text-[#1352D0]' };
      case 'Branding': return { tag: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-[#F4B400]', text: 'text-amber-800' };
      default: return { tag: 'bg-blue-50 text-[#1352D0] border-blue-200', dot: 'bg-[#1352D0]', text: 'text-[#1352D0]' };
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, activeCategory]);

  const featuredPost = posts[0] || filteredPosts[0];
  const restPosts = filteredPosts;

  return (
    <div className="relative font-sans overflow-hidden">

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[88vh] bg-[#061329] text-white overflow-hidden flex items-center pt-38 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(19,82,208,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,82,208,0.12)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_80%,transparent_100%)] opacity-70" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
        

          <div className="max-w-4xl mx-auto overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white space-y-2"
            >
              <div>Actionable Growth Playbooks.</div>
              <div>
                <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.7)]">Straight From Our</span>
                <span className="text-white"> Desk</span> <span className="text-[#F4B400] drop-shadow-[0_0_18px_rgba(244,180,0,0.5)]">To Yours.</span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed pt-6"
            >
              SEO blueprints, Meta/Google ROAS scaling frameworks, Next.js performance guides, AI automation playbooks, and viral Reels formulas.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1352D0] via-[#F4B400] to-[#D91212] rounded-full opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white rounded-full shadow-2xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search strategies, case studies, frameworks, keywords…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-20 py-4.5 text-slate-900 text-sm sm:text-base font-bold rounded-full focus:outline-none bg-transparent placeholder-slate-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-[#1352D0] hover:bg-blue-600 text-white rounded-full text-sm font-black transition-all flex items-center space-x-1.5 cursor-pointer">
                  <Sparkles className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {categories.map((cat, i) => {
              const isActive = activeCategory === cat;
              const count = cat === 'All' ? posts.length : posts.filter(p => p.category === cat).length;
              return (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-300 flex items-center space-x-2 border cursor-pointer ${
                    isActive
                      ? 'bg-[#1352D0] text-white border-[#1352D0] shadow-xl scale-105'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white text-[#1352D0]' : 'bg-white/20 text-white'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: ARTICLES GRID */}
      <section className="relative py-24 bg-[linear-gradient(180deg,#F8FBFF_0%,#F2F7FF_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {restPosts.map((post, i) => {
              const c = categoryColor(post.category);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-500 flex flex-col"
                >
                  <Link to={`/blog/${post.slug}`} className="relative h-56 sm:h-60 overflow-hidden block">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1000ms]"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur ${c.tag}`}>
                        {post.category}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black bg-slate-950/70 text-white backdrop-blur border border-white/20 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col space-y-4">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-[#1352D0] transition-colors line-clamp-3">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="w-full py-3 rounded-full bg-slate-900 hover:bg-[#1352D0] text-white text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: FINAL CTA */}
      <section className="relative py-24 sm:py-28 bg-[linear-gradient(135deg,#07152E_0%,#081B3D_50%,#0A1F47_100%)] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Reading vs Doing. <br className="hidden sm:block" />
            <span className="text-[#1352D0] drop-shadow-[0_0_25px_rgba(19,82,208,0.65)]">Close the Gap in 30 Minutes.</span>
          </motion.h2>

          <button
            onClick={() => openConsultationModal('Blog Final CTA — 30-Min Growth Call')}
            className="px-10 py-5 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg rounded-full border border-[#1352D0] shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Book My 30-Min Growth Call
          </button>
        </div>
      </section>

    </div>
  );
};
