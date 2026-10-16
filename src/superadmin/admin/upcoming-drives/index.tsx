import React, { useState, useEffect } from 'react';
import { CMSPage, PlacementDrive, CMSSection, MediaItem } from '../../../types';
import { DEFAULT_PLACEMENT_DRIVES_LIST, DEFAULT_UPCOMING_DRIVES_SECTIONS } from '../../../lib/defaultDrives';
import { 
  Building2, Briefcase, Plus, Trash2, Edit3, Save, Check, RefreshCw, 
  ExternalLink, Search, ShieldCheck, Phone, BookOpen, Layers, Award,
  Sparkles, Globe, Clock, MapPin, School, GraduationCap, X
} from 'lucide-react';

interface AdminUpcomingDrivesPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  drives?: PlacementDrive[];
  setDrives?: React.Dispatch<React.SetStateAction<PlacementDrive[]>>;
  onEditField?: any;
  onMoveSection?: any;
  onDeleteSection?: any;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminUpcomingDrivesPage({
  page,
  setPages,
  drives: propDrives,
  setDrives: propSetDrives,
  onEditField,
  media
}: AdminUpcomingDrivesPageProps) {
  // Local state for drives
  const [drivesList, setDrivesList] = useState<PlacementDrive[]>(() => {
    if (propDrives && propDrives.length > 0) return propDrives;
    return [];
  });

  useEffect(() => {
    if (propDrives) {
      setDrivesList(propDrives);
    }
  }, [propDrives]);

  const [activeTab, setActiveTab] = useState<'drives' | 'hero' | 'salary' | 'charter' | 'cta' | 'seo'>('drives');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing drive modal state
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);
  const [isNewDrive, setIsNewDrive] = useState(false);

  // SEO state
  const [seoTitle, setSeoTitle] = useState(page.seo?.title || 'Upcoming Placement Opportunities | TantraPex');
  const [seoDesc, setSeoDesc] = useState(page.seo?.description || 'Explore verified campus and pooled corporate placement drives with zero intermediary fees.');
  const [seoKeywords, setSeoKeywords] = useState(page.seo?.keywords || 'placement drives, campus hiring, LTTS, Capgemini, Cognizant, Zoho, AWS, KPIT, engineering jobs');

  // Extract sections
  const sections = (page.sections && page.sections.length > 0) ? page.sections : DEFAULT_UPCOMING_DRIVES_SECTIONS;
  const heroSection = sections.find(s => s.type === 'drives-hero') || DEFAULT_UPCOMING_DRIVES_SECTIONS[0];
  const salarySection = sections.find(s => s.type === 'drives-salary-bands') || DEFAULT_UPCOMING_DRIVES_SECTIONS[1];
  const charterSection = sections.find(s => s.type === 'drives-zero-fee-charter') || DEFAULT_UPCOMING_DRIVES_SECTIONS[2];
  const ctaSection = sections.find(s => s.type === 'drives-assistance-cta') || DEFAULT_UPCOMING_DRIVES_SECTIONS[3];

  const heroContent = heroSection.content || {};
  const salaryContent = salarySection.content || {};
  const charterContent = charterSection.content || {};
  const ctaContent = ctaSection.content || {};

  const handleUpdateSectionContent = (sectionId: string, key: string, value: any) => {
    onEditField(page.id, sectionId, `content.${key}`, value);
  };

  // Drives CRUD
  const handleAddNewDrive = () => {
    const newDrive: PlacementDrive = {
      id: `drv-${Date.now()}`,
      companyId: `comp-${Date.now()}`,
      companyName: 'New Enterprise Partner',
      shortCode: 'NEW',
      category: 'it',
      categoryLabel: 'IT Services',
      salaryBand: 'Category B',
      title: 'Graduate Software Engineer',
      salary: '₹5.00 LPA',
      salarySubtext: 'Annual CTC',
      eligibleBatch: '2024 & 2025 Passing Out',
      eligibleDegree: 'B.Tech / BE / MCA',
      batchSubtext: 'Circuit Branches / Computer Science',
      minCgpa: '6.0 CGPA Minimum',
      location: 'Bengaluru / Hybrid',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statusBadge: 'Applications Open',
      statusSubtext: 'No Registration Charges',
      status: 'published',
      driveType: 'off-campus',
      skills: 'Programming, Problem Solving, Web Technologies',
      description: 'Campus recruitment drive for fresh engineering graduates.',
      createdAt: new Date().toISOString()
    };
    setIsNewDrive(true);
    setEditingDrive(newDrive);
  };

  const handleSaveDriveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDrive) return;

    let updatedList: PlacementDrive[];
    if (isNewDrive) {
      updatedList = [editingDrive, ...drivesList];
    } else {
      updatedList = drivesList.map(d => d.id === editingDrive.id ? editingDrive : d);
    }

    setDrivesList(updatedList);
    if (propSetDrives) propSetDrives(updatedList);
    localStorage.setItem('tpx_placement_drives', JSON.stringify(updatedList));

    setEditingDrive(null);
    setIsNewDrive(false);
  };

  const handleDeleteDrive = (id: string) => {
    if (confirm('Are you sure you want to delete this placement drive?')) {
      const updated = drivesList.filter(d => d.id !== id);
      setDrivesList(updated);
      if (propSetDrives) propSetDrives(updated);
      localStorage.setItem('tpx_placement_drives', JSON.stringify(updated));
    }
  };

  // Reset to default Stitch drives & sections
  const handleResetDefaults = () => {
    if (confirm('Reset to Stitch default 6 placement opportunities and official copy?')) {
      setDrivesList(DEFAULT_PLACEMENT_DRIVES_LIST);
      if (propSetDrives) propSetDrives(DEFAULT_PLACEMENT_DRIVES_LIST);
      localStorage.setItem('tpx_placement_drives', JSON.stringify(DEFAULT_PLACEMENT_DRIVES_LIST));

      setPages(prev => prev.map(p => {
        if (p.id === page.id) {
          return {
            ...p,
            sections: DEFAULT_UPCOMING_DRIVES_SECTIONS,
            seo: {
              title: 'Upcoming Placement Opportunities | TantraPex',
              description: 'Explore verified campus and pooled corporate placement drives with zero intermediary fees.',
              keywords: 'placement drives, campus hiring, LTTS, Capgemini, Cognizant, Zoho, AWS, KPIT, engineering jobs'
            }
          };
        }
        return p;
      }));
      alert('Reset to Stitch defaults successfully!');
    }
  };

  // Save everything to MongoDB Atlas
  const handleSaveAllToMongo = async () => {
    setSaveStatus('saving');
    try {
      // 1. Fetch current database state safely
      let currentPages: CMSPage[] = [];
      try {
        const loadRes = await fetch('/api/load-all');
        if (loadRes.ok) {
          const loaded = await loadRes.json();
          if (Array.isArray(loaded.pages)) {
            currentPages = loaded.pages;
          }
        }
      } catch (err) {
        console.warn('Could not pre-fetch pages, using local pages state:', err);
      }

      // 2. Prepare updated page document
      const updatedPageDoc: CMSPage = {
        id: 'upcoming-drives',
        title: 'Upcoming Placement Opportunities',
        slug: '/upcoming-drives',
        seo: {
          title: seoTitle,
          description: seoDesc,
          keywords: seoKeywords
        },
        sections: (page.sections && page.sections.length > 0) ? page.sections : DEFAULT_UPCOMING_DRIVES_SECTIONS
      };

      // Merge into pages list
      const pageMap = new Map<string, CMSPage>();
      currentPages.forEach(p => { if (p && p.id) pageMap.set(p.id, p); });
      pageMap.set('upcoming-drives', updatedPageDoc);
      const mergedPages = Array.from(pageMap.values());

      // 3. Save pages and drives to MongoDB
      const saveRes = await fetch('/api/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pages: mergedPages,
          placement_drives: drivesList
        })
      });

      // 4. Also post individual drives to /api/placement-drives/save to ensure compatibility
      for (const drv of drivesList) {
        try {
          await fetch('/api/placement-drives/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(drv)
          });
        } catch (e) {
          // ignore individual item save error
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Save to MongoDB Atlas failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // Filter drives in admin
  const filteredAdminDrives = drivesList.filter(d => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (d.companyName || '').toLowerCase().includes(q) ||
      (d.title || '').toLowerCase().includes(q) ||
      (d.shortCode || '').toLowerCase().includes(q) ||
      (d.categoryLabel || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      
      {/* 1. Header Toolbar */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20">
                <Briefcase className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  Upcoming Placement Opportunities Config
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Atlas Live Synced
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage corporate placement drives, verified live statistics, salary bands key, zero fee charter, and recruiter assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <a
              href="#/upcoming-drives"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </a>

            <button
              type="button"
              onClick={handleSaveAllToMongo}
              disabled={saveStatus === 'saving'}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing to Atlas...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved & Published!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="max-w-[1500px] mx-auto mt-4 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'drives'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Placement Drives ({drivesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'hero'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hero & Live Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'salary'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Salary Bands Key</span>
          </button>

          <button
            onClick={() => setActiveTab('charter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'charter'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Fee Charter</span>
          </button>

          <button
            onClick={() => setActiveTab('cta')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'cta'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Support & Assistance CTA</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'seo'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SEO Meta</span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-[1500px] mx-auto px-6 pt-6">

        {/* TAB 1: PLACEMENT DRIVES DIRECTORY */}
        {activeTab === 'drives' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter drives by company, role, or shortcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddNewDrive}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Placement Drive</span>
              </button>
            </div>

            {/* Drives Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdminDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden">
                          {drive.companyLogo ? (
                            <img src={drive.companyLogo} alt={drive.companyName} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span>{drive.shortCode || 'DRV'}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                            {drive.companyName}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {drive.categoryLabel || drive.category} • {drive.salaryBand}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {drive.status || 'published'}
                      </span>
                    </div>

                    <div className="py-2 border-y border-slate-800/80 my-3">
                      <p className="text-sm font-bold text-white leading-tight">{drive.title}</p>
                      <p className="text-xs font-extrabold text-emerald-400 mt-1">
                        {drive.salary} <span className="text-[11px] text-slate-500 font-normal">({drive.salarySubtext || 'Annual CTC'})</span>
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      <p><strong className="text-slate-300">Batch:</strong> {drive.eligibleBatch}</p>
                      <p><strong className="text-slate-300">CGPA:</strong> {drive.minCgpa}</p>
                      <p><strong className="text-slate-300">Location:</strong> {drive.location}</p>
                      <p><strong className="text-slate-300">Deadline:</strong> <span className="text-red-400 font-semibold">{drive.deadline}</span></p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewDrive(false);
                        setEditingDrive({ ...drive });
                      }}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDrive(drive.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer border border-red-500/20"
                      title="Delete Drive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HERO & LIVE STATS */}
        {activeTab === 'hero' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-black text-white">Hero & Live Statistics Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize the top verification strip, hero headline, subtitle, and live hiring metrics cards.
              </p>
            </div>

            {/* Verification Strip text */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Accreditation Strip</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Recruitment Cycle Tag</label>
                  <input
                    type="text"
                    value={heroContent.cycleNotice || "Recruitment Cycle 2024-2025"}
                    onChange={(e) => handleUpdateSectionContent(heroSection.id, 'cycleNotice', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Accreditation Tag</label>
                  <input
                    type="text"
                    value={heroContent.accreditationNotice || "Real-Time Industry Accreditation"}
                    onChange={(e) => handleUpdateSectionContent(heroSection.id, 'accreditationNotice', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Fee Guarantee Notice</label>
                  <input
                    type="text"
                    value={heroContent.feeGuaranteeNotice || "Student Fee: ₹0.00 Guaranteed"}
                    onChange={(e) => handleUpdateSectionContent(heroSection.id, 'feeGuaranteeNotice', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Headline and Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Pill Badge Text</label>
                <input
                  type="text"
                  value={heroContent.badgeText || "ACTIVE CORPORATE DRIVES"}
                  onChange={(e) => handleUpdateSectionContent(heroSection.id, 'badgeText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={heroContent.title || "Upcoming Placement Opportunities"}
                  onChange={(e) => handleUpdateSectionContent(heroSection.id, 'title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subtitle</label>
                <textarea
                  rows={3}
                  value={heroContent.subtitle || "Explore verified campus and pooled hiring drives. Check eligibility, review test dates, and apply for free with zero intermediary fees."}
                  onChange={(e) => handleUpdateSectionContent(heroSection.id, 'subtitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            {/* Live Stats Box Configuration */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hiring Statistics Snapshot Box</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={heroContent.hiringStatsTitle || "Hiring Statistics"}
                    onChange={(e) => handleUpdateSectionContent(heroSection.id, 'hiringStatsTitle', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Card Status Badge</label>
                  <input
                    type="text"
                    value={heroContent.hiringStatsBadge || "Live Status"}
                    onChange={(e) => handleUpdateSectionContent(heroSection.id, 'hiringStatsBadge', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Stat 1 Label (Computed automatically)</label>
                  <input
                    type="text"
                    value={heroContent.stat1Label || "Active Drives"}
                    onChange={(e) => handleUpdateSectionContent(heroSection.id, 'stat1Label', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Stat 2 Number & Label</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={heroContent.stat2Number || "₹8.4L"}
                      onChange={(e) => handleUpdateSectionContent(heroSection.id, 'stat2Number', e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={heroContent.stat2Label || "Peak CTC"}
                      onChange={(e) => handleUpdateSectionContent(heroSection.id, 'stat2Label', e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Stat 3 Number & Label</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={heroContent.stat3Number || "100%"}
                      onChange={(e) => handleUpdateSectionContent(heroSection.id, 'stat3Number', e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={heroContent.stat3Label || "Free Access"}
                      onChange={(e) => handleUpdateSectionContent(heroSection.id, 'stat3Label', e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SALARY BANDS KEY */}
        {activeTab === 'salary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-black text-white">Standardized Salary Bands Key</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure the institutional classification labels for student packages.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Section Title</label>
              <input
                type="text"
                value={salaryContent.sectionTitle || "Standardized Salary Bands"}
                onChange={(e) => handleUpdateSectionContent(salarySection.id, 'sectionTitle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-400">Band 1</span>
                <input
                  type="text"
                  placeholder="Title (Category A)"
                  value={salaryContent.bandATitle || "Category A"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandATitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Range (Up to ₹4 LPA)"
                  value={salaryContent.bandARange || "Up to ₹4 LPA"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandARange', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-400">Band 2</span>
                <input
                  type="text"
                  placeholder="Title (Category B)"
                  value={salaryContent.bandBTitle || "Category B"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandBTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Range (Up to ₹6 LPA)"
                  value={salaryContent.bandBRange || "Up to ₹6 LPA"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandBRange', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Band 3</span>
                <input
                  type="text"
                  placeholder="Title (Category C)"
                  value={salaryContent.bandCTitle || "Category C"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandCTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Range (Up to ₹9 LPA)"
                  value={salaryContent.bandCRange || "Up to ₹9 LPA"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandCRange', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-purple-400">Band 4 (Dream)</span>
                <input
                  type="text"
                  placeholder="Title (Category D)"
                  value={salaryContent.bandDTitle || "Category D"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandDTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Range (Dream (₹9+ LPA))"
                  value={salaryContent.bandDRange || "Dream (₹9+ LPA)"}
                  onChange={(e) => handleUpdateSectionContent(salarySection.id, 'bandDRange', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ZERO FEE CHARTER */}
        {activeTab === 'charter' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-black text-white">Zero Fee Charter Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize the 100% Free Application Guarantee box and vigilance policy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={charterContent.badgeText || "INSTITUTIONAL POLICY"}
                  onChange={(e) => handleUpdateSectionContent(charterSection.id, 'badgeText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Charter Heading</label>
                <input
                  type="text"
                  value={charterContent.title || "Zero Fee Charter"}
                  onChange={(e) => handleUpdateSectionContent(charterSection.id, 'title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Charter Description</label>
              <textarea
                rows={3}
                value={charterContent.description || "TantraPex Technologies never charges students any fee for applying to recruitment drives, taking online tests, or attending corporate interviews."}
                onChange={(e) => handleUpdateSectionContent(charterSection.id, 'description', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Vigilance Warning</label>
              <textarea
                rows={2}
                value={charterContent.vigilanceWarning || "If any representative asks for payment at any stage of testing or onboarding, report it immediately to our vigilance board."}
                onChange={(e) => handleUpdateSectionContent(charterSection.id, 'vigilanceWarning', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Fee Status Label & Value</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={charterContent.feeStatusLabel || "Fee Status"}
                    onChange={(e) => handleUpdateSectionContent(charterSection.id, 'feeStatusLabel', e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={charterContent.feeStatusValue || "₹0 Free"}
                    onChange={(e) => handleUpdateSectionContent(charterSection.id, 'feeStatusValue', e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Placement Cell Label & Value</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={charterContent.cellStatusLabel || "Placement Cell"}
                    onChange={(e) => handleUpdateSectionContent(charterSection.id, 'cellStatusLabel', e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={charterContent.cellStatusValue || "Private"}
                    onChange={(e) => handleUpdateSectionContent(charterSection.id, 'cellStatusValue', e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT & CTA */}
        {activeTab === 'cta' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-black text-white">Support & Assistance CTA Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure the bottom contact banner for students needing academic evaluation or clarification.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Eyebrow Badge</label>
              <input
                type="text"
                value={ctaContent.eyebrow || "ASSISTANCE & CLARIFICATION"}
                onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'eyebrow', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">CTA Headline</label>
              <input
                type="text"
                value={ctaContent.title || "Have questions about eligibility or drive registration?"}
                onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'title', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">CTA Subtitle</label>
              <textarea
                rows={3}
                value={ctaContent.subtitle || "Our placement advisors are available on business days to evaluate your academic transcripts, clarify cut-off relaxations, and help you finalize your drive submissions."}
                onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'subtitle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Primary Button (Contact)</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={ctaContent.primaryBtnText || "Contact Placement Team"}
                  onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'primaryBtnText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Destination URL (e.g. #/contact)"
                  value={ctaContent.primaryBtnLink || "#/contact"}
                  onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'primaryBtnLink', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Secondary Button (Prep Guides)</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={ctaContent.secondaryBtnText || "Review Prep Guides"}
                  onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'secondaryBtnText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Destination URL (e.g. #/lms)"
                  value={ctaContent.secondaryBtnLink || "#/lms"}
                  onChange={(e) => handleUpdateSectionContent(ctaSection.id, 'secondaryBtnLink', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SEO META */}
        {activeTab === 'seo' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-black text-white">SEO & Meta Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimize search indexing and social sharing metadata for Upcoming Placement Opportunities.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Browser Page Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Keywords (Comma-separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        )}

      </div>

      {/* 4. Edit/Create Drive Modal */}
      {editingDrive && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingDrive(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1">
              {isNewDrive ? 'Create New Placement Opportunity' : `Edit: ${editingDrive.companyName}`}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Configure company credentials, packages, criteria, and deadline.
            </p>

            <form onSubmit={handleSaveDriveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.companyName}
                    onChange={(e) => setEditingDrive({ ...editingDrive, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">ShortCode / Initials (e.g. LTTS, AWS)</label>
                  <input
                    type="text"
                    value={editingDrive.shortCode || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, shortCode: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.title}
                    onChange={(e) => setEditingDrive({ ...editingDrive, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Company Logo URL</label>
                  <input
                    type="text"
                    value={editingDrive.companyLogo || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, companyLogo: e.target.value })}
                    placeholder="https://... (or leave empty for initials)"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingDrive.category || 'it'}
                    onChange={(e) => {
                      const val = e.target.value;
                      let label = 'IT Services';
                      if (val === 'core') label = 'Core Engineering';
                      if (val === 'product') label = 'Product';
                      setEditingDrive({ ...editingDrive, category: val, categoryLabel: label });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  >
                    <option value="it">IT & Software</option>
                    <option value="core">Core Engineering</option>
                    <option value="product">Product Companies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category Label</label>
                  <input
                    type="text"
                    value={editingDrive.categoryLabel || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, categoryLabel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Salary Band</label>
                  <select
                    value={editingDrive.salaryBand || 'Category B'}
                    onChange={(e) => setEditingDrive({ ...editingDrive, salaryBand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  >
                    <option value="Category A">Category A (Up to 4L)</option>
                    <option value="Category B">Category B (Up to 6L)</option>
                    <option value="Category C">Category C (Up to 9L)</option>
                    <option value="Category D">Category D (Dream 9L+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Salary / Package (e.g. ₹5.75 LPA) *</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.salary || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, salary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Salary Subtext</label>
                  <input
                    type="text"
                    value={editingDrive.salarySubtext || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, salarySubtext: e.target.value })}
                    placeholder="Fixed Annual CTC / Performance Driven"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Eligible Batch (e.g. 2024 & 2025)</label>
                  <input
                    type="text"
                    value={editingDrive.eligibleBatch || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, eligibleBatch: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Eligible Degree / Specialization</label>
                  <input
                    type="text"
                    value={editingDrive.batchSubtext || editingDrive.eligibleDegree || ''}
                    onChange={(e) => setEditingDrive({ 
                      ...editingDrive, 
                      batchSubtext: e.target.value,
                      eligibleDegree: e.target.value 
                    })}
                    placeholder="BE / B.Tech (ECE, EEE, Mechanical, CSE)"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">CGPA / Cut-off</label>
                  <input
                    type="text"
                    value={editingDrive.minCgpa || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, minCgpa: e.target.value })}
                    placeholder="6.0 CGPA / No minimum cut-off"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Job Location</label>
                  <input
                    type="text"
                    value={editingDrive.location || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, location: e.target.value })}
                    placeholder="Bengaluru, Pune, PAN India"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={editingDrive.deadline || ''}
                    onChange={(e) => setEditingDrive({ ...editingDrive, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status Badge Text</label>
                  <input
                    type="text"
                    value={editingDrive.statusBadge || 'Applications Open'}
                    onChange={(e) => setEditingDrive({ ...editingDrive, statusBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status Subtext</label>
                  <input
                    type="text"
                    value={editingDrive.statusSubtext || 'No Registration Charges'}
                    onChange={(e) => setEditingDrive({ ...editingDrive, statusSubtext: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={editingDrive.skills || ''}
                  onChange={(e) => setEditingDrive({ ...editingDrive, skills: e.target.value })}
                  placeholder="Java, Python, Cloud, Data Structures, Embedded C"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Role Description & Overview</label>
                <textarea
                  rows={2}
                  value={editingDrive.description || ''}
                  onChange={(e) => setEditingDrive({ ...editingDrive, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDrive(null)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer"
                >
                  {isNewDrive ? 'Create Opportunity' : 'Save Drive Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
