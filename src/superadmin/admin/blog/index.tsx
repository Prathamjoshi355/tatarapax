import React, { useState } from 'react';
import { CMSPage, CMSSection, BlogPost, Lead, MediaItem } from '../../../types';
import { DEFAULT_BLOG_SECTIONS, DEFAULT_BLOG_POSTS } from '../../../lib/defaultBlogs';
import { UniversalImageUploader } from '../../../components/dashboard/UniversalImageUploader';
import { 
  FileText, 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Calendar, 
  Clock, 
  Mail, 
  Download, 
  ExternalLink,
  Search,
  Filter,
  Eye,
  X,
  Layers,
  Tag,
  ShieldCheck,
  CheckCircle,
  Copy
} from 'lucide-react';

interface AdminBlogPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  blogs?: BlogPost[];
  setBlogs?: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  leads?: Lead[];
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminBlogPage({
  page,
  setPages,
  blogs = [],
  setBlogs,
  leads = []
}: AdminBlogPageProps) {
  // Tabs: hero, articles, ribbon, newsletter, subscribers, seo
  const [activeTab, setActiveTab] = useState<'hero' | 'articles' | 'ribbon' | 'newsletter' | 'subscribers' | 'seo'>('articles');

  // Pull sections or fallback to defaults
  const currentSections = page.sections && page.sections.some(s => s.type === 'blog-hero')
    ? page.sections
    : DEFAULT_BLOG_SECTIONS;

  const [sections, setSections] = useState<CMSSection[]>(currentSections);

  // SEO state
  const [seoTitle, setSeoTitle] = useState(page.seo?.title || "Latest Blogs & Career Insights | TantraPex Technologies");
  const [seoDesc, setSeoDesc] = useState(page.seo?.description || "Read helpful guides, placement preparation tips, and interview advice written by career coaches and tech professionals.");
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords || "campus placement, interview preparation, aptitude tests, engineering resume, tech jobs");

  // Articles state
  const currentBlogsList = blogs || [];
  const [localBlogs, setLocalBlogs] = useState<BlogPost[]>(currentBlogsList);

  React.useEffect(() => {
    if (blogs) {
      setLocalBlogs(blogs);
    }
  }, [blogs]);

  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('All');

  // New Category input state
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // UI notifications
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update specific section field
  const updateSectionField = (sectionType: string, fieldPath: string, value: any) => {
    setSections(prev => prev.map(sec => {
      if (sec.type !== sectionType) return sec;
      const updated = { ...sec };
      if (fieldPath === 'title') {
        updated.title = value;
      } else if (fieldPath === 'subtitle') {
        updated.subtitle = value;
      } else if (fieldPath.startsWith('content.')) {
        const subKey = fieldPath.replace('content.', '');
        updated.content = {
          ...updated.content,
          [subKey]: value
        };
      }
      return updated;
    }));
  };

  // Find section helpers
  const heroSection = sections.find(s => s.type === 'blog-hero') || DEFAULT_BLOG_SECTIONS[0];
  const ribbonSection = sections.find(s => s.type === 'blog-ribbon') || DEFAULT_BLOG_SECTIONS[1];
  const newsletterSection = sections.find(s => s.type === 'blog-newsletter') || DEFAULT_BLOG_SECTIONS[2];

  // Save everything to MongoDB & in-memory React state
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedPage: CMSPage = {
        ...page,
        title: "Latest Blogs & Career Insights",
        slug: "/blog",
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        },
        sections: sections
      };

      // 1. Update in-memory pages state
      setPages(prev => prev.map(p => p.id === page.id ? updatedPage : p));

      // 2. Update in-memory blogs state
      if (setBlogs) {
        setBlogs(localBlogs);
      }

      // 3. Save page to MongoDB
      await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: updatedPage })
      });

      // 4. Save blogs array to MongoDB
      await fetch('/api/save-blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogs: localBlogs })
      });

      triggerNotification("All Blog content, articles, and layout saved & published to MongoDB!");
    } catch (err: any) {
      console.error("Failed to save blog data:", err);
      triggerNotification("Error saving to database. Local changes preserved.");
    } finally {
      setIsSaving(false);
    }
  };

  const triggerNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 3500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset the blog page and articles to the redesign defaults? This will restore original articles and texts.")) {
      setSections(DEFAULT_BLOG_SECTIONS);
      setLocalBlogs(DEFAULT_BLOG_POSTS);
      if (setBlogs) {
        setBlogs(DEFAULT_BLOG_POSTS);
      }
      triggerNotification("Reset to default redesign layout. Remember to click Save & Publish.");
    }
  };

  // Article CRUD helpers
  const handleCreateNewArticle = () => {
    const newId = `blog-${Date.now()}`;
    const newArt: BlogPost = {
      id: newId,
      title: 'New Career Article Guide',
      slug: 'new-career-article-guide',
      category: 'Placement Prep',
      excerpt: 'Short compelling summary of this career preparation article.',
      content: 'Write the complete in-depth article guide here. You can use headings, lists, and advice paragraphs.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '5 min read',
      status: 'published'
    };
    setSelectedArticle(newArt);
  };

  const handleSaveArticle = () => {
    if (!selectedArticle) return;
    const exists = localBlogs.some(b => b.id === selectedArticle.id);
    let updated: BlogPost[];
    if (exists) {
      updated = localBlogs.map(b => b.id === selectedArticle.id ? selectedArticle : b);
    } else {
      updated = [selectedArticle, ...localBlogs];
    }
    setLocalBlogs(updated);
    if (setBlogs) {
      setBlogs(updated);
    }
    setSelectedArticle(null);
    triggerNotification(`Article "${selectedArticle.title}" saved!`);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm("Are you sure you want to delete this article permanently?")) {
      const updated = localBlogs.filter(b => b.id !== articleId);
      setLocalBlogs(updated);
      if (setBlogs) {
        setBlogs(updated);
      }
      if (selectedArticle?.id === articleId) {
        setSelectedArticle(null);
      }
      triggerNotification("Article removed.");
    }
  };

  // Category management helpers
  const currentCategories: string[] = heroSection.content?.categories || [
    "All Articles",
    "Placement Prep",
    "Technical Skills",
    "Interview Tips",
    "Resume & LinkedIn"
  ];

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    if (currentCategories.some(c => c.toLowerCase() === newCategoryInput.trim().toLowerCase())) {
      alert("This category already exists!");
      return;
    }
    const updated = [...currentCategories, newCategoryInput.trim()];
    updateSectionField('blog-hero', 'content.categories', updated);
    setNewCategoryInput('');
  };

  const handleDeleteCategory = (catName: string) => {
    if (catName === "All Articles") {
      alert("Cannot delete the default 'All Articles' category.");
      return;
    }
    const updated = currentCategories.filter(c => c !== catName);
    updateSectionField('blog-hero', 'content.categories', updated);
  };

  // Newsletter leads
  const newsletterLeads = leads.filter(l => l.type === 'newsletter' || l.message?.toLowerCase().includes('blog'));

  const exportSubscribersCSV = () => {
    if (newsletterLeads.length === 0) {
      alert("No newsletter subscribers recorded yet.");
      return;
    }
    const rows = [
      ["Email", "Date", "Status"],
      ...newsletterLeads.map(l => [l.email, l.date || 'Recent', l.status || 'new'])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tantrapex_blog_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered articles in admin
  const filteredLocalBlogs = localBlogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                          b.excerpt.toLowerCase().includes(articleSearchQuery.toLowerCase());
    const matchesCat = articleCategoryFilter === 'All' || b.category.toLowerCase() === articleCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full bg-slate-900 min-h-screen text-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* 1. Header Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">TantraPex CMS & CRM</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-emerald-500/20">
                Redesign V2 • Live Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Blogs & Career Insights Editor
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Fully unified content manager: edit hero texts, manage category tags, publish/delete articles, configure feature cards & newsletter dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Reset to default redesign layout"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <a
              href="#/blog"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live Page</span>
            </a>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving to MongoDB..." : "Save & Publish to MongoDB"}</span>
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'articles', label: 'Articles CMS & CRM', count: localBlogs.length, icon: FileText },
            { id: 'hero', label: 'Hero & Categories', icon: Layers },
            { id: 'ribbon', label: 'Value Metrics Ribbon', icon: ShieldCheck },
            { id: 'newsletter', label: 'Newsletter Box', icon: Mail },
            { id: 'subscribers', label: 'Subscribers Log', count: newsletterLeads.length, icon: Download },
            { id: 'seo', label: 'SEO & Metadata', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: ARTICLES CMS & CRM */}
        {activeTab === 'articles' && (
          <div className="flex flex-col gap-6">
            
            {/* Action Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    placeholder="Search articles by title, category, or summary..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={articleCategoryFilter}
                    onChange={(e) => setArticleCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  >
                    <option value="All">All Categories ({localBlogs.length})</option>
                    {currentCategories.filter(c => c !== "All Articles").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateNewArticle}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Publish New Article</span>
              </button>
            </div>

            {/* In-Place Article Editor Modal / Drawer */}
            {selectedArticle && (
              <div className="bg-slate-950 border-2 border-emerald-500/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-base font-extrabold text-white">
                      {selectedArticle.title ? `Editing: ${selectedArticle.title}` : 'Draft New Article'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Left Column: Title & Excerpt */}
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Article Headline Title
                      </label>
                      <input
                        type="text"
                        value={selectedArticle.title}
                        onChange={(e) => setSelectedArticle({ ...selectedArticle, title: e.target.value })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-semibold"
                        placeholder="e.g. How to Prepare for Campus Aptitude Tests in 30 Days"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Category Topic
                        </label>
                        <select
                          value={selectedArticle.category}
                          onChange={(e) => setSelectedArticle({ ...selectedArticle, category: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                        >
                          {currentCategories.filter(c => c !== "All Articles").map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          URL Slug
                        </label>
                        <input
                          type="text"
                          value={selectedArticle.slug}
                          onChange={(e) => setSelectedArticle({ ...selectedArticle, slug: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                          placeholder="how-to-prepare-for-aptitude-tests"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Summary Excerpt (Shown on cards grid)
                      </label>
                      <textarea
                        rows={2}
                        value={selectedArticle.excerpt}
                        onChange={(e) => setSelectedArticle({ ...selectedArticle, excerpt: e.target.value })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                        placeholder="Short compelling summary for the card view..."
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Full Article Body (Markdown supported with ### headings and bullets)
                      </label>
                      <textarea
                        rows={9}
                        value={selectedArticle.content}
                        onChange={(e) => setSelectedArticle({ ...selectedArticle, content: e.target.value })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                        placeholder="Write detailed guides, steps, advice, and tips..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Image, Date, ReadTime, Status */}
                  <div className="flex flex-col gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <UniversalImageUploader
                      label="Featured Cover Photo"
                      value={selectedArticle.image}
                      onChange={(url) => setSelectedArticle({ ...selectedArticle, image: url })}
                      helperText="Direct upload to Cloudinary or paste external URL."
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Date
                        </label>
                        <input
                          type="text"
                          value={selectedArticle.date}
                          onChange={(e) => setSelectedArticle({ ...selectedArticle, date: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                          placeholder="Nov 24, 2024"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={selectedArticle.readTime}
                          onChange={(e) => setSelectedArticle({ ...selectedArticle, readTime: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                          placeholder="5 min read"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Publishing Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedArticle({ ...selectedArticle, status: 'published' })}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                            selectedArticle.status === 'published'
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          ✓ Published
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedArticle({ ...selectedArticle, status: 'draft' })}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                            selectedArticle.status === 'draft'
                              ? 'bg-amber-600 border-amber-500 text-white shadow'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Draft (Hidden)
                        </button>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveArticle}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Article</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Articles Grid / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocalBlogs.map((article) => (
                <div
                  key={article.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
                >
                  <div className="relative h-40 bg-slate-900 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-slate-700">
                      {article.category}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        article.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mt-1">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                      <span className="text-[10px] text-slate-500 font-mono">
                        ID: {article.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedArticle(article)}
                          className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit this article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLocalBlogs.length === 0 && (
              <div className="py-16 text-center bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No articles match your search</h3>
                <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filter category.</p>
                <button
                  onClick={() => { setArticleSearchQuery(''); setArticleCategoryFilter('All'); }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: HERO & CATEGORIES */}
        {activeTab === 'hero' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Top Section</span>
              <h2 className="text-lg font-bold text-white mt-1">Hero Masthead & Category Tabs</h2>
              <p className="text-xs text-slate-400 mt-1">Customize the editorial masthead header and the category filter tags available to students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Top Pill Badge Text
                </label>
                <input
                  type="text"
                  value={heroSection.content?.badgeText || ''}
                  onChange={(e) => updateSectionField('blog-hero', 'content.badgeText', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="e.g. CAREER ARTICLES & TIPS"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Main Page Headline
                </label>
                <input
                  type="text"
                  value={heroSection.title || ''}
                  onChange={(e) => updateSectionField('blog-hero', 'title', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="e.g. Latest Blogs & Career Insights"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={heroSection.subtitle || ''}
                onChange={(e) => updateSectionField('blog-hero', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                placeholder="Read helpful guides, placement preparation tips..."
              />
            </div>

            {/* Category Tags Manager */}
            <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Live Category Filters</h3>
                  <p className="text-xs text-slate-400">Add or remove filter categories that appear in the filter bar.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    placeholder="New category name..."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    + Add Category
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-200"
                  >
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">{cat}</span>
                    {cat !== "All Articles" && (
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-slate-500 hover:text-rose-400 ml-1 transition-colors"
                        title="Delete category"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: VALUE METRICS RIBBON */}
        {activeTab === 'ribbon' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Middle Ribbon</span>
              <h2 className="text-lg font-bold text-white mt-1">Editorial Value Metrics Ribbon (3 Cards)</h2>
              <p className="text-xs text-slate-400 mt-1">Control the 3 value proposition highlight cards shown below the articles grid.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(ribbonSection.content?.features || DEFAULT_BLOG_SECTIONS[1].content.features).map((feat: any, idx: number) => (
                <div key={feat.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono">Feature #{idx + 1}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Icon: {feat.icon}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Icon Identifier</label>
                    <input
                      type="text"
                      value={feat.icon}
                      onChange={(e) => {
                        const copy = [...(ribbonSection.content?.features || DEFAULT_BLOG_SECTIONS[1].content.features)];
                        copy[idx] = { ...copy[idx], icon: e.target.value };
                        updateSectionField('blog-ribbon', 'content.features', copy);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      placeholder="verified_user, account_tree, payments"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feature Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const copy = [...(ribbonSection.content?.features || DEFAULT_BLOG_SECTIONS[1].content.features)];
                        copy[idx] = { ...copy[idx], title: e.target.value };
                        updateSectionField('blog-ribbon', 'content.features', copy);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feature Description</label>
                    <textarea
                      rows={3}
                      value={feat.desc}
                      onChange={(e) => {
                        const copy = [...(ribbonSection.content?.features || DEFAULT_BLOG_SECTIONS[1].content.features)];
                        copy[idx] = { ...copy[idx], desc: e.target.value };
                        updateSectionField('blog-ribbon', 'content.features', copy);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NEWSLETTER BOX */}
        {activeTab === 'newsletter' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Conversion Banner</span>
              <h2 className="text-lg font-bold text-white mt-1">Weekly Career Dispatch Newsletter Box</h2>
              <p className="text-xs text-slate-400 mt-1">Configure texts, disclaimers, and button labels for student email subscriptions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Small Pill Badge</label>
                <input
                  type="text"
                  value={newsletterSection.content?.badgeText || ''}
                  onChange={(e) => updateSectionField('blog-newsletter', 'content.badgeText', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="e.g. Weekly Career Dispatch"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Button Label</label>
                <input
                  type="text"
                  value={newsletterSection.content?.buttonText || ''}
                  onChange={(e) => updateSectionField('blog-newsletter', 'content.buttonText', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Subscribe"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Headline</label>
              <input
                type="text"
                value={newsletterSection.title || ''}
                onChange={(e) => updateSectionField('blog-newsletter', 'title', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                placeholder="Get placement tips and drive updates delivered directly to your inbox."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description Paragraph</label>
              <textarea
                rows={3}
                value={newsletterSection.subtitle || ''}
                onChange={(e) => updateSectionField('blog-newsletter', 'subtitle', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                placeholder="Join 35,000+ engineering and management students..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Input Placeholder</label>
                <input
                  type="text"
                  value={newsletterSection.content?.placeholder || ''}
                  onChange={(e) => updateSectionField('blog-newsletter', 'content.placeholder', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success Alert Message</label>
                <input
                  type="text"
                  value={newsletterSection.content?.successMessage || ''}
                  onChange={(e) => updateSectionField('blog-newsletter', 'content.successMessage', e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  placeholder="Thank you for subscribing! Check your inbox for the latest placement guide."
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Privacy Disclaimer Subtext</label>
              <input
                type="text"
                value={newsletterSection.content?.disclaimer || ''}
                onChange={(e) => updateSectionField('blog-newsletter', 'content.disclaimer', e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                placeholder="Zero spam. Unsubscribe anytime. Strictly career opportunities and study roadmaps."
              />
            </div>

          </div>
        )}

        {/* TAB 5: SUBSCRIBERS LOG */}
        {activeTab === 'subscribers' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Newsletter CRM Leads</span>
                <h2 className="text-lg font-bold text-white mt-1">Student Newsletter Subscribers ({newsletterLeads.length})</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time log of students subscribed to the weekly placement dispatch from this blog page.</p>
              </div>

              <button
                onClick={exportSubscribersCSV}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>

            {newsletterLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Subscriber Email</th>
                      <th className="py-3 px-4">Subscription Date</th>
                      <th className="py-3 px-4">Lead Origin</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {newsletterLeads.map((lead, idx) => (
                      <tr key={lead.id || idx} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lead.email}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {lead.date || 'Recent'}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {lead.message || 'Blog Page Dispatch'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {lead.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <Mail className="w-12 h-12 text-slate-700 mb-2" />
                <span className="text-xs font-bold text-slate-400">No newsletter subscribers recorded yet.</span>
                <span className="text-[11px] text-slate-600 mt-1">When students enter their email on the blog page, their records appear here instantly.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SEO & METADATA */}
        {activeTab === 'seo' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Search Visibility</span>
              <h2 className="text-lg font-bold text-white mt-1">SEO Title & Meta Tags</h2>
              <p className="text-xs text-slate-400 mt-1">Optimize search engine ranking and social media preview tags for the blog page.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Page Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Keywords</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Status Notification Toast */}
        {saveStatus && (
          <div className="fixed bottom-6 right-6 bg-slate-950 border border-emerald-500 text-emerald-400 text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{saveStatus}</span>
          </div>
        )}

      </div>
    </div>
  );
}
