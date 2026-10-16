import React, { useState, useEffect } from 'react';
import { CMSPage, CMSSection, MediaItem, PlacedStudent } from '../../../types';
import { DEFAULT_PLACED_STUDENTS_LIST, DEFAULT_PLACED_STUDENTS_SECTIONS } from '../../../lib/defaultPlacedStudents';
import {
  Save,
  RotateCcw,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Globe,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Building2,
  Lock,
  UserCheck,
  Award,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPlacedStudentsPageProps {
  page: CMSPage;
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  placedStudents: PlacedStudent[];
  setPlacedStudents: React.Dispatch<React.SetStateAction<PlacedStudent[]>>;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  onMoveSection?: (direction: 'up' | 'down', sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  media?: MediaItem[];
  setMedia?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export default function AdminPlacedStudentsPage({
  page,
  setPages,
  placedStudents,
  setPlacedStudents
}: AdminPlacedStudentsPageProps) {
  const [activeTab, setActiveTab] = useState<
    'hero' | 'dossiers' | 'filters' | 'statutory' | 'cta' | 'seo'
  >('dossiers');

  const [sections, setSections] = useState<CMSSection[]>(() => {
    if (page.sections && page.sections.length > 0 && page.sections.some(s => s.type.startsWith('placed-'))) {
      return page.sections;
    }
    return DEFAULT_PLACED_STUDENTS_SECTIONS;
  });

  const [studentsList, setLocalStudentsList] = useState<PlacedStudent[]>(() => {
    if (placedStudents && placedStudents.length > 0) {
      return placedStudents;
    }
    return [];
  });

  useEffect(() => {
    if (placedStudents) {
      setLocalStudentsList(placedStudents);
    }
  }, [placedStudents]);

  const [seoTitle, setSeoTitle] = useState(
    page.seo?.title || 'Our Placed Students & Verified Recruitment Outcomes | TantraPex'
  );
  const [seoDesc, setSeoDesc] = useState(
    page.seo?.description ||
      'Explore verified student placement records, campus recruitments, package CTCs, and corporate hiring dossiers from engineering colleges across India.'
  );
  const [seoKeywords, setSeoKeywords] = useState(
    page.seo?.keywords ||
      'placed students, campus placement records, student testimonials, salary packages, engineering placement, TantraPex'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const updateSection = (sectionId: string, mutator: (sec: CMSSection) => CMSSection) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return mutator({ ...sec });
      })
    );
  };

  const getSection = (type: string, fallbackIdx: number): CMSSection => {
    return sections.find(s => s.type === type) || DEFAULT_PLACED_STUDENTS_SECTIONS[fallbackIdx];
  };

  const heroSec = getSection('placed-hero', 0);
  const filterSec = getSection('placed-filters', 1);
  const statutorySec = getSection('placed-statutory', 2);
  const ctaSec = getSection('placed-cta', 3);

  // Student CRUD helpers
  const handleAddStudent = () => {
    const newStudent: PlacedStudent = {
      id: `stud-${Date.now()}`,
      name: 'New Candidate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      college: 'National Institute of Technology',
      branch: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      year: '2025',
      company: 'Leading Enterprise Tech',
      role: 'Associate Software Engineer',
      packageLpa: '₹5.50 LPA',
      dossierId: `TP-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      offerLetterVerified: true,
      showOnHomepage: true,
      testimonialText: 'The training and direct placement drive through TantraPex gave me great clarity and helped me clear all interview rounds.'
    };
    setLocalStudentsList(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (id: string, field: keyof PlacedStudent, value: any) => {
    setLocalStudentsList(prev =>
      prev.map(st => (st.id === id ? { ...st, [field]: value } : st))
    );
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student placement record?')) {
      setLocalStudentsList(prev => prev.filter(st => st.id !== id));
    }
  };

  // Reset to original Stitch defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all Placed Students page content and student records to original default template?')) {
      setSections(DEFAULT_PLACED_STUDENTS_SECTIONS);
      setLocalStudentsList(DEFAULT_PLACED_STUDENTS_LIST);
      setSeoTitle('Our Placed Students & Verified Recruitment Outcomes | TantraPex');
      setSeoDesc('Explore verified student placement records, campus recruitments, package CTCs, and corporate hiring dossiers.');
      setSeoKeywords('placed students, campus placement records, student testimonials, salary packages, TantraPex');
    }
  };

  // Save to MongoDB Atlas via /api/save-all
  const handleSaveToMongoDB = async () => {
    setIsSaving(true);
    setSaveStatus('Saving to MongoDB Atlas...');

    const updatedPage: CMSPage = {
      ...page,
      id: 'placed-students',
      title: 'Our Placed Students',
      slug: '/placed-students',
      sections,
      seo: {
        title: seoTitle,
        description: seoDesc,
        keywords: seoKeywords
      },
      updatedAt: new Date().toISOString()
    };

    setPages(prevPages =>
      prevPages.map(p => (p.id === 'placed-students' ? updatedPage : p))
    );
    setPlacedStudents(studentsList);

    try {
      const getRes = await fetch('/api/load-all');
      const getJson = await getRes.json();
      const currentData = getJson.data || {};

      const existingPages: CMSPage[] = currentData.pages || [];
      const mergedPages = existingPages.map(p => (p.id === 'placed-students' ? updatedPage : p));
      if (!mergedPages.some(p => p.id === 'placed-students')) {
        mergedPages.push(updatedPage);
      }

      const response = await fetch('/api/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          pages: mergedPages,
          placed_students: studentsList
        })
      });

      const res = await response.json();
      if (res.success) {
        setSaveStatus('Saved & Published to MongoDB Atlas Successfully!');
      } else {
        setSaveStatus(`Saved locally. Note: ${res.msg || 'MongoDB sync pending'}`);
      }
    } catch (err: any) {
      setSaveStatus(`Saved locally in browser. ${err.message || ''}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Action Ribbon */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              TantraPex CMS Editor • Placed Students • Live Connected
            </span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Placed Students CMS Configurator</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage candidate dossiers, CTC packages, recruiters, verified offer letters, hero masthead metrics, and regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Reset to default stitch configuration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => { window.location.hash = '#/placed-students'; }}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Preview live public page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live Page</span>
          </button>

          <button
            onClick={handleSaveToMongoDB}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish to MongoDB'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveStatus && (
        <div className="w-full bg-emerald-950/90 border-b border-emerald-800 text-emerald-300 px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{saveStatus}</span>
          </div>
          <button onClick={() => setSaveStatus(null)} className="text-emerald-400 hover:text-white text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation Controls */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'dossiers', label: `Student Dossiers (${studentsList.length})`, icon: UserCheck },
          { id: 'hero', label: 'Hero & Metrics', icon: Sparkles },
          { id: 'filters', label: 'Search & Filters', icon: Search },
          { id: 'statutory', label: 'Regulatory Notice', icon: ShieldAlert },
          { id: 'cta', label: 'Bottom Opportunities CTA', icon: ArrowRight },
          { id: 'seo', label: 'SEO Meta', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STUDENT DOSSIERS CRUD */}
      {activeTab === 'dossiers' && (
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                CANDIDATE REGISTRY
              </span>
              <h2 className="text-lg font-bold text-white">Verified Placement Dossiers</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Each card shows student portrait, degree, college, appointed enterprise, role, annual CTC, and verified offer letter status.
              </p>
            </div>
            <button
              onClick={handleAddStudent}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Candidate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentsList.map((st, idx) => (
              <div 
                key={st.id} 
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all shadow-md"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">{st.name || 'Unnamed Student'}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteStudent(st.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Student Dossier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Name</label>
                    <input
                      type="text"
                      value={st.name}
                      onChange={(e) => handleUpdateStudent(st.id, 'name', e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Package CTC</label>
                    <input
                      type="text"
                      value={st.packageLpa}
                      onChange={(e) => handleUpdateStudent(st.id, 'packageLpa', e.target.value)}
                      placeholder="e.g. ₹5.20 LPA"
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointed Company</label>
                    <input
                      type="text"
                      value={st.company}
                      onChange={(e) => handleUpdateStudent(st.id, 'company', e.target.value)}
                      placeholder="e.g. Infosys BPM"
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role Appointed</label>
                    <input
                      type="text"
                      value={st.role || ''}
                      onChange={(e) => handleUpdateStudent(st.id, 'role', e.target.value)}
                      placeholder="e.g. Associate System Engineer"
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree / Branch</label>
                    <input
                      type="text"
                      value={st.degree || st.branch}
                      onChange={(e) => {
                        handleUpdateStudent(st.id, 'degree', e.target.value);
                        handleUpdateStudent(st.id, 'branch', e.target.value);
                      }}
                      placeholder="e.g. BE Information Technology"
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">College / Institution</label>
                    <input
                      type="text"
                      value={st.college}
                      onChange={(e) => handleUpdateStudent(st.id, 'college', e.target.value)}
                      placeholder="e.g. D.Y. Patil Institute, Pune"
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batch / Passing Year</label>
                    <select
                      value={st.year || '2024'}
                      onChange={(e) => handleUpdateStudent(st.id, 'year', e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="2025">Batch of 2025</option>
                      <option value="2024">Batch of 2024</option>
                      <option value="2023">Batch of 2023</option>
                      <option value="2022">Batch of 2022</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dossier ID</label>
                    <input
                      type="text"
                      value={st.dossierId || `TP-${st.year || '2024'}-8841`}
                      onChange={(e) => handleUpdateStudent(st.id, 'dossierId', e.target.value)}
                      placeholder="e.g. TP-2024-9122"
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Avatar Image URL & Preview */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avatar Image URL</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={st.avatar}
                      onChange={(e) => handleUpdateStudent(st.id, 'avatar', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-mono"
                    />
                    {st.avatar ? (
                      <img src={st.avatar} alt="thumb" className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Experience Quote</label>
                  <textarea
                    rows={2}
                    value={st.testimonialText || ''}
                    onChange={(e) => handleUpdateStudent(st.id, 'testimonialText', e.target.value)}
                    placeholder="Student feedback quote..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none resize-y"
                  />
                </div>

                {/* Verification Checkbox */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={st.offerLetterVerified !== false}
                      onChange={(e) => handleUpdateStudent(st.id, 'offerLetterVerified', e.target.checked)}
                      className="rounded accent-emerald-500 h-4 w-4"
                    />
                    <span>Verified Offer Letter Issued</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HERO & METRICS */}
      {activeTab === 'hero' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 01
              </span>
              <h2 className="text-lg font-bold text-white">Hero Masthead & Institutional Counter</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure the top page banner, title, subtitle, and right-hand metric counter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pill Badge Text</label>
                <input
                  type="text"
                  value={heroSec.content?.badgeText || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, badgeText: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Page Headline</label>
                <input
                  type="text"
                  value={heroSec.title || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({ ...sec, title: e.target.value }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle Description</label>
              <textarea
                rows={3}
                value={heroSec.subtitle || ''}
                onChange={(e) =>
                  updateSection(heroSec.id, sec => ({ ...sec, subtitle: e.target.value }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduates Metric Count</label>
                <input
                  type="text"
                  value={heroSec.content?.metricNumber || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, metricNumber: e.target.value }
                    }))
                  }
                  placeholder="e.g. 1,840+"
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Metric Sub-Label</label>
                <input
                  type="text"
                  value={heroSec.content?.metricLabel || ''}
                  onChange={(e) =>
                    updateSection(heroSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, metricLabel: e.target.value }
                    }))
                  }
                  placeholder="e.g. Graduates Placed"
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEARCH & FILTERS CONFIG */}
      {activeTab === 'filters' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 02
              </span>
              <h2 className="text-lg font-bold text-white">Search Bar & Status Labels</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure the input placeholder text, result count bar label, and authentication tag.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Box Placeholder</label>
              <input
                type="text"
                value={filterSec.content?.searchPlaceholder || ''}
                onChange={(e) =>
                  updateSection(filterSec.id, sec => ({
                    ...sec,
                    content: { ...sec.content, searchPlaceholder: e.target.value }
                  }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Headline Label</label>
                <input
                  type="text"
                  value={filterSec.content?.statusLabel || ''}
                  onChange={(e) =>
                    updateSection(filterSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, statusLabel: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Right Authentication Tag</label>
                <input
                  type="text"
                  value={filterSec.content?.statusSublabel || ''}
                  onChange={(e) =>
                    updateSection(filterSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, statusSublabel: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATUTORY NOTICE */}
      {activeTab === 'statutory' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 03
              </span>
              <h2 className="text-lg font-bold text-white">Regulatory & Ethics Notice</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent statutory note clarifying that hiring decisions rest with recruiters and TantraPex sells no seats.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notice Badge / Header</label>
              <input
                type="text"
                value={statutorySec.content?.label || ''}
                onChange={(e) =>
                  updateSection(statutorySec.id, sec => ({
                    ...sec,
                    content: { ...sec.content, label: e.target.value }
                  }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none uppercase font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Disclaimer Text</label>
              <textarea
                rows={3}
                value={statutorySec.content?.disclaimerText || ''}
                onChange={(e) =>
                  updateSection(statutorySec.id, sec => ({
                    ...sec,
                    content: { ...sec.content, disclaimerText: e.target.value }
                  }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BOTTOM OPPORTUNITIES CTA */}
      {activeTab === 'cta' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SECTION 04
              </span>
              <h2 className="text-lg font-bold text-white">Bottom Opportunities Call To Action</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Encourage students viewing past placements to explore active upcoming drives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eyebrow Tag</label>
                <input
                  type="text"
                  value={ctaSec.content?.eyebrow || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, eyebrow: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none uppercase font-bold text-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Heading Title</label>
                <input
                  type="text"
                  value={ctaSec.title || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({ ...sec, title: e.target.value }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle Description</label>
              <textarea
                rows={2}
                value={ctaSec.subtitle || ''}
                onChange={(e) =>
                  updateSection(ctaSec.id, sec => ({ ...sec, subtitle: e.target.value }))
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Button Text</label>
                <input
                  type="text"
                  value={ctaSec.content?.buttonText || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, buttonText: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Button Target URL</label>
                <input
                  type="text"
                  value={ctaSec.content?.buttonLink || ''}
                  onChange={(e) =>
                    updateSection(ctaSec.id, sec => ({
                      ...sec,
                      content: { ...sec.content, buttonLink: e.target.value }
                    }))
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SEO META */}
      {activeTab === 'seo' && (
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                METADATA & INDEXING
              </span>
              <h2 className="text-lg font-bold text-white">SEO & Search Engine Optimization</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage Google search titles, preview descriptions, and ranking keywords for the Placed Students page.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Keywords (Comma Separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
