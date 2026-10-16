import React, { useState } from 'react';
import { CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost, Lead } from '../../types';
import { DEFAULT_BLOG_SECTIONS, DEFAULT_BLOG_POSTS } from '../../lib/defaultBlogs';
import { 
  Calendar, 
  ArrowRight, 
  Mail, 
  Send, 
  CheckCircle, 
  Home, 
  ChevronRight, 
  FileText, 
  X, 
  ShieldCheck, 
  GitFork, 
  CreditCard,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';

interface PublicBlogPageProps {
  page: CMSPage;
  settings: GlobalSettings;
  placedStudents?: PlacedStudent[];
  hiringPartners?: HiringPartner[];
  courses?: Course[];
  blogs?: BlogPost[];
  onAddLead?: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  isVisualMode?: boolean;
}

export default function PublicBlogPage({
  page,
  settings,
  blogs = [],
  onAddLead,
  onEditField,
  isVisualMode = false
}: PublicBlogPageProps) {
  // Pull section definitions with fallbacks to defaults
  const heroSection = page.sections?.find(s => s.type === 'blog-hero') || DEFAULT_BLOG_SECTIONS[0];
  const ribbonSection = page.sections?.find(s => s.type === 'blog-ribbon') || DEFAULT_BLOG_SECTIONS[1];
  const newsletterSection = page.sections?.find(s => s.type === 'blog-newsletter') || DEFAULT_BLOG_SECTIONS[2];

  const heroContent = heroSection.content || {};
  const ribbonContent = ribbonSection.content || {};
  const newsletterContent = newsletterSection.content || {};

  // Active articles list
  const activeBlogsList: BlogPost[] = (blogs && blogs.length > 0) ? blogs : DEFAULT_BLOG_POSTS;

  // Categories list
  const configuredCategories: string[] = heroContent.categories || [
    "All Articles",
    "Placement Prep",
    "Technical Skills",
    "Interview Tips",
    "Resume & LinkedIn"
  ];

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All Articles");
  const [activeReaderBlog, setActiveReaderBlog] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Filtered articles
  const filteredArticles = activeBlogsList.filter(article => {
    if (article.status && article.status !== 'published') return false;
    if (selectedCategory === "All Articles" || selectedCategory === "all" || selectedCategory === "All") {
      return true;
    }
    return article.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Handle newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    if (onAddLead) {
      onAddLead({
        type: 'newsletter',
        name: 'Newsletter Subscriber',
        email: newsletterEmail.trim(),
        phone: '',
        message: 'Subscribed from Blog Page Dispatch box',
        status: 'new'
      });
    }

    setSubscriptionSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => {
      setSubscriptionSuccess(false);
    }, 6000);
  };

  const getRibbonIcon = (iconName: string) => {
    switch (iconName) {
      case 'verified_user':
      case 'shield':
        return <ShieldCheck className="w-7 h-7 text-[#2e6c00]" />;
      case 'account_tree':
      case 'fork':
        return <GitFork className="w-7 h-7 text-[#2e6c00]" />;
      case 'payments':
      case 'card':
        return <CreditCard className="w-7 h-7 text-[#2e6c00]" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#2e6c00]" />;
    }
  };

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans antialiased min-h-screen">
      
      {/* 1. Sub-Navigation / Breadcrumb Bar */}
      <section className="w-full bg-white border-b border-[#e0e2e6]/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#5f5e5e]">
            <a 
              href="#/" 
              className="hover:text-[#191c1f] transition-colors flex items-center gap-1 font-medium"
            >
              <Home className="w-3.5 h-3.5 text-[#5f5e5e]" />
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#191c1f] font-semibold">Blogs</span>
          </nav>
        </div>
      </section>

      {/* 2. Header & Architectural Masthead */}
      <header className={`w-full bg-[#f2f4f8] py-12 lg:py-16 border-b border-[#e0e2e6] ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl flex flex-col gap-3">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#eceef2] px-3 py-1.5 rounded w-fit border border-[#e0e2e6]">
              <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1f]">
                {heroContent.badgeText || "CAREER ARTICLES & TIPS"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#191c1f] tracking-tight leading-tight mt-1">
              {heroSection.title || "Latest Blogs & Career Insights"}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5f5e5e] leading-relaxed max-w-2xl mt-1">
              {heroSection.subtitle || "Read helpful guides, placement preparation tips, and interview advice written by career coaches and tech professionals."}
            </p>
          </div>

          {/* Live Category Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-2" id="blog-filters">
            {configuredCategories.map((category) => {
              const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-[#191c1f] text-white border-[#191c1f] shadow-sm' 
                      : 'bg-white text-[#404a39] border-[#e0e2e6] hover:bg-[#eceef2] hover:text-[#191c1f]'
                  }`}
                  type="button"
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Main Content Listing (6-Card Responsive Grid) */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="articles-grid">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setActiveReaderBlog(article)}
                  className="flex flex-col bg-white rounded-lg border border-[#e0e2e6] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer text-left h-full"
                >
                  {/* Card Image */}
                  <div className="w-full h-48 bg-[#eceef2] relative overflow-hidden">
                    <img
                      src={article.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#191c1f] text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow">
                      {article.category || "Placement"}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between bg-white">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[#5f5e5e] text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#5f5e5e]" />
                        <span>{article.date || "Recent"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{article.readTime || "5 min read"}</span>
                      </div>

                      <h2 className="text-lg font-bold text-[#191c1f] leading-snug group-hover:text-[#2e6c00] transition-colors mt-1">
                        {article.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed line-clamp-3 mt-1">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Card Link Footer */}
                    <div className="mt-6 pt-4 border-t border-[#f2f4f8] flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2e6c00] group-hover:text-[#215100] transition-colors">
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center bg-white border border-[#e0e2e6] rounded-xl my-6 flex flex-col items-center justify-center p-8">
              <FileText className="w-12 h-12 text-[#5f5e5e] mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-[#191c1f]">No articles found</h3>
              <p className="text-sm text-[#5f5e5e] mt-1 max-w-sm">
                Try selecting a different filter category to see more articles and guides.
              </p>
              <button
                onClick={() => setSelectedCategory("All Articles")}
                className="mt-4 px-4 py-2 bg-[#2e6c00] hover:bg-[#215100] text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                Reset to All Articles
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. Editorial Value Metrics Ribbon */}
      <section className={`w-full bg-[#eceef2] py-12 border-y border-[#e0e2e6] ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(ribbonContent.features || DEFAULT_BLOG_SECTIONS[1].content.features).map((feat: any, idx: number) => (
              <div 
                key={feat.id || idx} 
                className="bg-white p-6 rounded-lg border border-[#e0e2e6] flex items-start gap-4 shadow-sm hover:shadow transition-shadow"
              >
                <div className="w-12 h-12 rounded bg-[#f2f4f8] border border-[#e0e2e6] flex items-center justify-center shrink-0">
                  {getRibbonIcon(feat.icon)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#191c1f] leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Newsletter / Subscription Box Section */}
      <section className={`w-full py-16 lg:py-20 bg-[#f2f4f8] ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#191c1f] text-white rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-xl border border-slate-800">
            
            <div className="max-w-2xl flex flex-col gap-3 relative z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#2d3134] px-3 py-1 rounded w-fit border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                  {newsletterContent.badgeText || "Weekly Career Dispatch"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-2 leading-tight">
                {newsletterSection.title || "Get placement tips and drive updates delivered directly to your inbox."}
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 mt-1 leading-relaxed">
                {newsletterSection.subtitle || "Join 35,000+ engineering and management students receiving weekly company patterns, aptitude questions, and verified job notices."}
              </p>

              {/* Form */}
              <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={newsletterContent.placeholder || "Enter your email address"}
                    className="w-full bg-white text-[#191c1f] text-sm pl-11 pr-4 py-3 rounded-lg outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#80d64b] transition-all font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#80d64b] hover:bg-[#72c240] text-[#092100] text-sm rounded-lg font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow"
                >
                  <span>{newsletterContent.buttonText || "Subscribe"}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Feedback status */}
              {subscriptionSuccess && (
                <div className="mt-3 text-xs sm:text-sm text-[#80d64b] flex items-center gap-1.5 font-medium bg-[#80d64b]/10 border border-[#80d64b]/30 p-2.5 rounded-lg">
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#80d64b]" />
                  <span>{newsletterContent.successMessage || "Thank you for subscribing! Check your inbox for the latest placement guide."}</span>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                {newsletterContent.disclaimer || "Zero spam. Unsubscribe anytime. Strictly career opportunities and study roadmaps."}
              </p>
            </div>

            {/* Background Icon Watermark */}
            <div className="absolute right-6 bottom-0 top-0 hidden lg:flex items-center justify-center opacity-10 pointer-events-none select-none">
              <FileText className="w-64 h-64 text-white" />
            </div>

          </div>
        </div>
      </section>

      {/* 6. Full Article Reader Modal */}
      {activeReaderBlog && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveReaderBlog(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-[#e0e2e6] max-w-3xl w-full my-8 overflow-hidden text-left flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#e0e2e6] bg-[#f7f9fd]">
              <div className="flex items-center gap-2">
                <span className="bg-[#191c1f] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {activeReaderBlog.category}
                </span>
                <span className="text-xs text-[#5f5e5e] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeReaderBlog.readTime}</span>
                </span>
              </div>
              <button
                onClick={() => setActiveReaderBlog(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Cover Image */}
              {activeReaderBlog.image && (
                <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-slate-100 border border-[#e0e2e6]">
                  <img
                    src={activeReaderBlog.image}
                    alt={activeReaderBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Metadata */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] leading-tight">
                  {activeReaderBlog.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#5f5e5e]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published on {activeReaderBlog.date}</span>
                  <span>•</span>
                  <span>Verified Placement Guide</span>
                </div>
              </div>

              {/* Excerpt Lead */}
              {activeReaderBlog.excerpt && (
                <div className="p-4 bg-[#f2f4f8] rounded-xl border-l-4 border-[#2e6c00] text-sm text-[#191c1f] font-medium leading-relaxed">
                  {activeReaderBlog.excerpt}
                </div>
              )}

              {/* Full Content */}
              <div className="text-sm sm:text-base text-[#404a39] leading-relaxed flex flex-col gap-4 whitespace-pre-line font-sans">
                {activeReaderBlog.content}
              </div>

              {/* Author & Footer Note */}
              <div className="mt-6 pt-6 border-t border-[#e0e2e6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2e6c00] text-white flex items-center justify-center font-bold text-sm">
                    TP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#191c1f] block">TantraPex Career Cell</span>
                    <span className="text-[11px] text-[#5f5e5e]">Corporate Placements & Guidance Team</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2500);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e0e2e6] hover:bg-slate-100 rounded-lg text-xs font-semibold text-[#191c1f] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#5f5e5e]" />
                    <span>{copiedLink ? "Link Copied!" : "Share Guide"}</span>
                  </button>
                  <button
                    onClick={() => setActiveReaderBlog(null)}
                    className="px-4 py-1.5 bg-[#191c1f] hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Done Reading
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
