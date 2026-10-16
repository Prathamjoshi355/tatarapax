import React, { useState, useEffect, useMemo } from 'react';
import { PlacementDrive, CMSPage, GlobalSettings } from '../../types';
import { DEFAULT_PLACEMENT_DRIVES_LIST, DEFAULT_UPCOMING_DRIVES_SECTIONS } from '../../lib/defaultDrives';
import { 
  Building2, MapPin, Calendar, Award, Briefcase, Search, Filter, 
  ArrowRight, CheckCircle2, Clock, Info, X, Lock, Globe, ShieldCheck, 
  RotateCw, AlertCircle, Phone, BookOpen, Send, Sparkles, School, GraduationCap
} from 'lucide-react';

interface PublicUpcomingDrivesPageProps {
  page?: CMSPage;
  settings?: GlobalSettings;
  drives?: PlacementDrive[];
  onEditField?: (sectionId: string, field: string, value: any) => void;
}

export default function PublicUpcomingDrivesPage({
  page,
  settings,
  drives: propDrives,
  onEditField
}: PublicUpcomingDrivesPageProps) {
  const [drives, setDrives] = useState<PlacementDrive[]>(() => {
    if (propDrives && propDrives.length > 0) return propDrives;
    return [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propDrives && propDrives.length > 0) {
      setDrives(propDrives);
    }
  }, [propDrives]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'it' | 'core' | 'product'>('all');
  const [selectedSalaryBand, setSelectedSalaryBand] = useState<string | null>(null);

  // Modals state
  const [selectedDetailDrive, setSelectedDetailDrive] = useState<PlacementDrive | null>(null);
  const [selectedApplyDrive, setSelectedApplyDrive] = useState<PlacementDrive | null>(null);

  // Application form state
  const [applyForm, setApplyForm] = useState({
    rollNumber: '',
    studentEmail: '',
    fullName: '',
    phone: '',
    degree: '',
    branch: '',
    cgpa: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Fetch drives from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchApiDrives = async () => {
      try {
        const res = await fetch('/api/placement-drives');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.drives)) {
          if (isMounted) {
            setDrives(data.drives);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch placement drives:', err);
      }
    };

    fetchApiDrives();
    return () => { isMounted = false; };
  }, []);

  // Update drives if propDrives changes
  useEffect(() => {
    if (propDrives && propDrives.length > 0) {
      setDrives(propDrives);
    }
  }, [propDrives]);

  // Extract CMS sections
  const heroSection = page?.sections?.find(s => s.type === 'drives-hero') || DEFAULT_UPCOMING_DRIVES_SECTIONS[0];
  const salarySection = page?.sections?.find(s => s.type === 'drives-salary-bands') || DEFAULT_UPCOMING_DRIVES_SECTIONS[1];
  const charterSection = page?.sections?.find(s => s.type === 'drives-zero-fee-charter') || DEFAULT_UPCOMING_DRIVES_SECTIONS[2];
  const ctaSection = page?.sections?.find(s => s.type === 'drives-assistance-cta') || DEFAULT_UPCOMING_DRIVES_SECTIONS[3];

  const heroContent = heroSection.content || {};
  const salaryContent = salarySection.content || {};
  const charterContent = charterSection.content || {};
  const ctaContent = ctaSection.content || {};

  // Filtered drives calculation
  const filteredDrives = useMemo(() => {
    return drives.filter(d => {
      // Category filter
      if (activeCategory !== 'all') {
        const cat = (d.category || '').toLowerCase();
        if (activeCategory === 'it' && cat !== 'it') return false;
        if (activeCategory === 'core' && cat !== 'core') return false;
        if (activeCategory === 'product' && cat !== 'product') return false;
      }

      // Salary Band filter (if toggled)
      if (selectedSalaryBand) {
        if (d.salaryBand !== selectedSalaryBand) return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (d.companyName || '').toLowerCase().includes(q);
        const roleMatch = (d.title || '').toLowerCase().includes(q);
        const skillMatch = (d.skills || '').toLowerCase().includes(q);
        const locMatch = (d.location || '').toLowerCase().includes(q);
        const codeMatch = (d.shortCode || '').toLowerCase().includes(q);
        const catMatch = (d.categoryLabel || '').toLowerCase().includes(q);
        if (!nameMatch && !roleMatch && !skillMatch && !locMatch && !codeMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [drives, activeCategory, selectedSalaryBand, searchQuery]);

  // Count by category
  const itCount = useMemo(() => drives.filter(d => (d.category || '').toLowerCase() === 'it').length, [drives]);
  const coreCount = useMemo(() => drives.filter(d => (d.category || '').toLowerCase() === 'core').length, [drives]);
  const productCount = useMemo(() => drives.filter(d => (d.category || '').toLowerCase() === 'product').length, [drives]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedSalaryBand(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.studentEmail) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applyForm.fullName || `Candidate (${applyForm.rollNumber})`,
          email: applyForm.studentEmail,
          phone: applyForm.phone || 'N/A',
          source: `Placement Drive: ${selectedApplyDrive?.companyName} - ${selectedApplyDrive?.title}`,
          college: applyForm.rollNumber || 'Enrolled Student',
          notes: `Applied for drive ${selectedApplyDrive?.id} (${selectedApplyDrive?.title}) at ${selectedApplyDrive?.companyName}. Degree: ${applyForm.degree || 'N/A'}, CGPA: ${applyForm.cgpa || 'N/A'}`
        })
      });

      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedApplyDrive(null);
        setApplyForm({
          rollNumber: '',
          studentEmail: '',
          fullName: '',
          phone: '',
          degree: '',
          branch: '',
          cgpa: ''
        });
      }, 2500);
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateTo = (path: string) => {
    const clean = (path || '').replace(/^[#/]+/, '').trim();
    window.location.hash = clean === '' || clean === 'home' ? '#/' : `#/${clean}`;
  };

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans antialiased min-h-screen">
      
      {/* 1. Top Progress & Real-Time Industry Accreditation Strip */}
      <div className="w-full bg-[#f2f4f8] border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#80d64b] text-[#092100]">
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
              {heroContent.cycleNotice || "Recruitment Cycle 2024-2025"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">
              {heroContent.accreditationNotice || "Real-Time Industry Accreditation"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-600">
              Student Fee: <strong className="text-slate-900 font-bold">{heroContent.feeGuaranteeNotice || "₹0.00 Guaranteed"}</strong>
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#80d64b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2e6c00]"></span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Breadcrumbs & Institutional Masthead */}
      <section className="w-full bg-white border-b border-[#e0e2e6] pt-8 pb-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs text-slate-500">
            <button 
              onClick={() => navigateTo('home')} 
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
            >
              <Building2 className="w-3.5 h-3.5" />
              Home
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Upcoming Placement Opportunities</span>
          </nav>

          {/* Institutional Header Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eceef2] w-fit rounded-lg border border-[#e0e2e6]">
                <span className="w-2 h-2 rounded-full bg-[#2e6c00]"></span>
                <span className="text-[11px] uppercase tracking-widest text-slate-800 font-extrabold">
                  {heroContent.badgeText || "ACTIVE CORPORATE DRIVES"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {heroContent.title || "Upcoming Placement Opportunities"}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                {heroContent.subtitle || "Explore verified campus and pooled hiring drives. Check eligibility, review test dates, and apply for free with zero intermediary fees."}
              </p>
            </div>

            {/* Quick Summary Snapshot Card */}
            <div className="lg:col-span-4 bg-[#f7f9fd] border border-[#e0e2e6] p-5 rounded-2xl flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e2e6]">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  {heroContent.hiringStatsTitle || "Hiring Statistics"}
                </span>
                <span className="text-[11px] bg-[#80d64b] px-2 py-0.5 rounded text-[#092100] font-extrabold uppercase tracking-wide">
                  {heroContent.hiringStatsBadge || "Live Status"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {String(drives.length).padStart(2, '0')}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {heroContent.stat1Label || "Active Drives"}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {heroContent.stat2Number || "₹8.4L"}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {heroContent.stat2Label || "Peak CTC"}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#2e6c00]">
                    {heroContent.stat3Number || "100%"}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {heroContent.stat3Label || "Free Access"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter & Discovery Command Center */}
      <section className="w-full bg-[#f7f9fd] py-8 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          
          {/* Search Input & Category Pills */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                id="driveSearchInput"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company, role, or required skill..."
                className="w-full bg-white border border-[#e0e2e6] pl-11 pr-4 py-3 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Segment Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : 'bg-white border border-[#e0e2e6] text-slate-700 hover:border-slate-900'
                }`}
              >
                All Drives ({drives.length})
              </button>
              <button
                onClick={() => setActiveCategory('it')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeCategory === 'it'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : 'bg-white border border-[#e0e2e6] text-slate-700 hover:border-slate-900'
                }`}
              >
                IT & Software {itCount > 0 ? `(${itCount})` : ''}
              </button>
              <button
                onClick={() => setActiveCategory('core')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeCategory === 'core'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : 'bg-white border border-[#e0e2e6] text-slate-700 hover:border-slate-900'
                }`}
              >
                Core Engineering {coreCount > 0 ? `(${coreCount})` : ''}
              </button>
              <button
                onClick={() => setActiveCategory('product')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeCategory === 'product'
                    ? 'bg-slate-900 text-white shadow-slate-900/10'
                    : 'bg-white border border-[#e0e2e6] text-slate-700 hover:border-slate-900'
                }`}
              >
                Product Companies {productCount > 0 ? `(${productCount})` : ''}
              </button>
            </div>
          </div>

          {/* Standardized Salary Bands Key */}
          <div className="p-4 bg-white border border-[#e0e2e6] rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span className="text-xs uppercase tracking-wider text-slate-900 font-extrabold">
                  {salaryContent.sectionTitle || "Standardized Salary Bands"}
                </span>
                {selectedSalaryBand && (
                  <button 
                    onClick={() => setSelectedSalaryBand(null)}
                    className="text-[11px] text-blue-600 hover:underline font-semibold ml-2"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                {/* Category A */}
                <button
                  type="button"
                  onClick={() => setSelectedSalaryBand(selectedSalaryBand === 'Category A' ? null : 'Category A')}
                  className={`px-3 py-1.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedSalaryBand === 'Category A'
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20'
                      : 'bg-[#f7f9fd] border-[#e0e2e6] hover:border-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold text-slate-900">
                      {salaryContent.bandATitle || "Category A"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {salaryContent.bandARange || "Up to ₹4 LPA"}
                    </span>
                  </div>
                </button>

                {/* Category B */}
                <button
                  type="button"
                  onClick={() => setSelectedSalaryBand(selectedSalaryBand === 'Category B' ? null : 'Category B')}
                  className={`px-3 py-1.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedSalaryBand === 'Category B'
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20'
                      : 'bg-[#f7f9fd] border-[#e0e2e6] hover:border-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold text-slate-900">
                      {salaryContent.bandBTitle || "Category B"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {salaryContent.bandBRange || "Up to ₹6 LPA"}
                    </span>
                  </div>
                </button>

                {/* Category C */}
                <button
                  type="button"
                  onClick={() => setSelectedSalaryBand(selectedSalaryBand === 'Category C' ? null : 'Category C')}
                  className={`px-3 py-1.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedSalaryBand === 'Category C'
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'bg-[#f7f9fd] border-[#e0e2e6] hover:border-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#80d64b] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold text-slate-900">
                      {salaryContent.bandCTitle || "Category C"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {salaryContent.bandCRange || "Up to ₹9 LPA"}
                    </span>
                  </div>
                </button>

                {/* Category D */}
                <button
                  type="button"
                  onClick={() => setSelectedSalaryBand(selectedSalaryBand === 'Category D' ? null : 'Category D')}
                  className={`px-3 py-1.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedSalaryBand === 'Category D'
                      ? 'bg-slate-900 border-slate-900 ring-2 ring-slate-900/20 text-white'
                      : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#80d64b] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold text-white">
                      {salaryContent.bandDTitle || "Category D"}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {salaryContent.bandDRange || "Dream (₹9+ LPA)"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Drives Grid Section */}
      <section className="w-full bg-[#f7f9fd] py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-slate-600">
              Showing <span className="font-extrabold text-slate-900" id="visibleCount">{filteredDrives.length}</span> corporate opportunities
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
              Verified Direct Tie-Ups
            </div>
          </div>

          {/* Grid Layout */}
          {filteredDrives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="drivesGrid">
              {filteredDrives.map((drive) => {
                const isDream = drive.salaryBand === 'Category D';
                return (
                  <article
                    key={drive.id}
                    className="drive-card flex flex-col bg-white border border-[#e0e2e6] hover:border-slate-800 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden group"
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Header Row: Logo/Shortcode + Company Name + Category Pill */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            {/* Logo or ShortCode Avatar */}
                            <div className="w-12 h-12 bg-[#eceef2] rounded-xl border border-[#e0e2e6] flex items-center justify-center font-bold text-slate-900 text-sm overflow-hidden shrink-0">
                              {drive.companyLogo ? (
                                <img 
                                  src={drive.companyLogo} 
                                  alt={drive.companyName || 'Company'} 
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    // Fallback to text initials
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span>{drive.shortCode || (drive.companyName ? drive.companyName.substring(0, 4).toUpperCase() : 'DRV')}</span>
                              )}
                            </div>

                            <div className="flex flex-col">
                              <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                                {drive.companyName}
                              </h3>
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                {drive.categoryLabel || drive.skills || 'Enterprise Technology'}
                              </p>
                            </div>
                          </div>

                          {/* Salary Band Pill */}
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border tracking-wide uppercase shrink-0 ${
                            isDream 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-[#eceef2] border-[#e0e2e6] text-slate-800'
                          }`}>
                            {drive.salaryBand || 'Category B'}
                          </span>
                        </div>

                        {/* Role & CTC Focus */}
                        <div className="mb-5 pb-4 border-b border-[#e0e2e6]">
                          <h4 className="text-lg font-extrabold text-slate-900 mb-1 leading-snug">
                            {drive.title}
                          </h4>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-extrabold text-[#2e6c00]">
                              {drive.salary || 'Competitive Package'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {drive.salarySubtext || 'Annual CTC'}
                            </span>
                          </div>
                        </div>

                        {/* Matrix Metadata */}
                        <div className="space-y-3 mb-6 text-xs">
                          {/* Eligible Batch */}
                          <div className="flex items-start gap-2.5">
                            <School className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                Eligible Batch
                              </span>
                              <span className="font-bold text-slate-800 text-xs">
                                {drive.eligibleBatch || '2024 & 2025 Passing Out'}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {drive.batchSubtext || drive.eligibleDegree || 'BE / B.Tech / MCA'}
                              </span>
                            </div>
                          </div>

                          {/* CGPA Criterion */}
                          <div className="flex items-start gap-2.5">
                            <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                CGPA Criterion
                              </span>
                              <span className={`text-xs ${
                                (drive.minCgpa || '').toLowerCase().includes('no minimum') 
                                  ? 'font-bold text-[#2e6c00]' 
                                  : 'font-semibold text-slate-800'
                              }`}>
                                {drive.minCgpa || '6.0 CGPA Minimum'}
                              </span>
                            </div>
                          </div>

                          {/* Job Location */}
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                Job Location
                              </span>
                              <span className="font-medium text-slate-700 text-xs">
                                {drive.location || 'PAN India / Hybrid'}
                              </span>
                            </div>
                          </div>

                          {/* Application Deadline */}
                          <div className="flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                Application Deadline
                              </span>
                              <span className="font-bold text-red-600 text-xs">
                                {drive.deadline || 'Closing Soon'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="pt-4 border-t border-[#e0e2e6] flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f9fd] rounded-lg text-slate-800 font-bold text-[11px] border border-[#e0e2e6]">
                            <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
                            {drive.statusBadge || 'Applications Open'}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {drive.statusSubtext || 'No Registration Charges'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailDrive(drive)}
                            className="px-3 py-2.5 bg-white border border-[#e0e2e6] hover:border-slate-800 text-slate-900 rounded-xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedApplyDrive(drive)}
                            className="px-3 py-2.5 bg-[#80d64b] hover:bg-[#85dc50] text-[#092100] rounded-xl text-xs font-extrabold text-center transition-all cursor-pointer shadow-xs hover:shadow"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Zero Results State */
            <div className="py-16 text-center bg-white border border-[#e0e2e6] rounded-2xl p-8 max-w-lg mx-auto shadow-sm">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-xl font-extrabold text-slate-900">No Matching Opportunities Found</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
                Try adjusting your search query or reset the filter pills to see all available corporate drives.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. 100% Free Application Guarantee Box (Zero Fee Charter) */}
      <section className="w-full bg-white border-y border-[#e0e2e6] py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 bg-[#f7f9fd] border-2 border-[#80d64b] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#80d64b] flex items-center justify-center shrink-0 text-[#092100] shadow-sm">
                <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-slate-900">
                    {charterContent.title || "Zero Fee Charter"}
                  </span>
                  <span className="text-[10px] uppercase bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold tracking-wider">
                    {charterContent.badgeText || "INSTITUTIONAL POLICY"}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 font-semibold max-w-3xl leading-relaxed">
                  {charterContent.description || "TantraPex Technologies never charges students any fee for applying to recruitment drives, taking online tests, or attending corporate interviews."}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {charterContent.vigilanceWarning || "If any representative asks for payment at any stage of testing or onboarding, report it immediately to our vigilance board."}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <div className="px-5 py-3 bg-white border border-[#e0e2e6] rounded-xl text-center shadow-xs">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {charterContent.feeStatusLabel || "Fee Status"}
                </span>
                <span className="text-base font-black text-[#2e6c00]">
                  {charterContent.feeStatusValue || "₹0 Free"}
                </span>
              </div>
              <div className="px-5 py-3 bg-white border border-[#e0e2e6] rounded-xl text-center shadow-xs">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {charterContent.cellStatusLabel || "Placement Cell"}
                </span>
                <span className="text-base font-black text-slate-900">
                  {charterContent.cellStatusValue || "Private"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Support & Assistance CTA Section */}
      <section className="w-full bg-[#f7f9fd] py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#e0e2e6] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                {ctaContent.eyebrow || "ASSISTANCE & CLARIFICATION"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {ctaContent.title || "Have questions about eligibility or drive registration?"}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {ctaContent.subtitle || "Our placement advisors are available on business days to evaluate your academic transcripts, clarify cut-off relaxations, and help you finalize your drive submissions."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => navigateTo(ctaContent.primaryBtnLink || 'contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{ctaContent.primaryBtnText || "Contact Placement Team"}</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo(ctaContent.secondaryBtnLink || 'lms')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white border border-[#e0e2e6] hover:border-slate-800 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>{ctaContent.secondaryBtnText || "Review Prep Guides"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Detailed Modal for View Details */}
      {selectedDetailDrive && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e0e2e6] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedDetailDrive(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-[#80d64b] text-[#092100] font-extrabold rounded-md">
                Verified Corporate Drive
              </span>
              <span className="text-xs text-slate-500 font-semibold">100% Free Application</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              {selectedDetailDrive.companyName}
            </h3>
            <p className="text-sm font-bold text-blue-600 mt-1 mb-4">
              {selectedDetailDrive.title} • {selectedDetailDrive.salary}
            </p>

            <div className="bg-[#f7f9fd] border border-[#e0e2e6] p-4 rounded-xl mb-5 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Industry Track:</span>
                <span className="font-bold text-slate-800">{selectedDetailDrive.categoryLabel || 'Enterprise Engineering'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Eligible Batch:</span>
                <span className="font-bold text-slate-800">{selectedDetailDrive.eligibleBatch || '2024 & 2025'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Degree Criteria:</span>
                <span className="font-bold text-slate-800">{selectedDetailDrive.eligibleDegree || 'BE / B.Tech / MCA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Academic Threshold:</span>
                <span className="font-bold text-slate-800">{selectedDetailDrive.minCgpa || '6.0 CGPA Minimum'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Job Location:</span>
                <span className="font-bold text-slate-800">{selectedDetailDrive.location || 'PAN India'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Application Deadline:</span>
                <span className="font-extrabold text-red-600">{selectedDetailDrive.deadline || 'Closing Soon'}</span>
              </div>
            </div>

            {selectedDetailDrive.description && (
              <div className="mb-5 text-xs text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1.5">Role Overview</h4>
                <p>{selectedDetailDrive.description}</p>
              </div>
            )}

            {selectedDetailDrive.skills && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">Evaluated Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailDrive.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#eceef2] text-slate-800 text-[11px] font-semibold rounded-lg border border-[#e0e2e6]">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e0e2e6]">
              <button
                type="button"
                onClick={() => setSelectedDetailDrive(null)}
                className="px-4 py-2.5 border border-[#e0e2e6] hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = selectedDetailDrive;
                  setSelectedDetailDrive(null);
                  setSelectedApplyDrive(d);
                }}
                className="px-5 py-2.5 bg-[#80d64b] hover:bg-[#85dc50] text-[#092100] rounded-xl text-xs font-extrabold transition-all shadow-xs"
              >
                Apply for this Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Detailed Modal for TantraPex Direct Apply */}
      {selectedApplyDrive && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e0e2e6] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedApplyDrive(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your academic dossier for <strong>{selectedApplyDrive.companyName} ({selectedApplyDrive.title})</strong> has been registered with TantraPex Placement Cell. Our coordinator will review your eligibility and dispatch next steps to your registered email.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Zero Fee Guarantee Verified
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-[#80d64b] text-[#092100] font-extrabold rounded-md">
                    TantraPex Direct Apply
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">100% Free Application</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedApplyDrive.companyName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Applying for <strong>{selectedApplyDrive.title}</strong> • Package: {selectedApplyDrive.salary}
                </p>

                {/* Verification Notice */}
                <div className="bg-[#f7f9fd] border border-[#e0e2e6] p-4 rounded-xl mb-5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fee Requirement:</span>
                    <span className="font-extrabold text-[#2e6c00]">₹0 (Zero Charges)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Application Mode:</span>
                    <span className="font-bold text-slate-800">Online Evaluation + Corporate Portal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification SLA:</span>
                    <span className="font-bold text-slate-800">Instant Eligibility Stamp</span>
                  </div>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applyForm.fullName}
                        onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#f7f9fd] border border-[#e0e2e6] px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">WhatsApp / Mobile *</label>
                      <input
                        type="tel"
                        required
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#f7f9fd] border border-[#e0e2e6] px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Roll / Registration Number *</label>
                      <input
                        type="text"
                        required
                        value={applyForm.rollNumber}
                        onChange={(e) => setApplyForm({ ...applyForm, rollNumber: e.target.value })}
                        placeholder="e.g. 21BCE10482"
                        className="w-full bg-[#f7f9fd] border border-[#e0e2e6] px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">College Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applyForm.studentEmail}
                        onChange={(e) => setApplyForm({ ...applyForm, studentEmail: e.target.value })}
                        placeholder="student@institution.ac.in"
                        className="w-full bg-[#f7f9fd] border border-[#e0e2e6] px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Degree & Branch</label>
                      <input
                        type="text"
                        value={applyForm.degree}
                        onChange={(e) => setApplyForm({ ...applyForm, degree: e.target.value })}
                        placeholder="e.g. B.Tech CSE (2024)"
                        className="w-full bg-[#f7f9fd] border border-[#e0e2e6] px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Graduation CGPA / Percentage</label>
                      <input
                        type="text"
                        value={applyForm.cgpa}
                        onChange={(e) => setApplyForm({ ...applyForm, cgpa: e.target.value })}
                        placeholder="e.g. 7.8 CGPA"
                        className="w-full bg-[#f7f9fd] border border-[#e0e2e6] px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e0e2e6]">
                    <button
                      type="button"
                      onClick={() => setSelectedApplyDrive(null)}
                      className="px-4 py-2.5 border border-[#e0e2e6] hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#80d64b] hover:bg-[#85dc50] text-[#092100] rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Eligibility...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Confirm & Proceed to Drive</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
