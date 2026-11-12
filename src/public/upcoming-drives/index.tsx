import React, { useState, useEffect, useMemo } from 'react';
import { PlacementDrive, CMSPage, GlobalSettings } from '../../types';
import { 
  DEFAULT_PLACEMENT_DRIVES_LIST, 
  DEFAULT_UPCOMING_DRIVES_SECTIONS, 
  isDriveExpired,
  PREDEFINED_DOMAINS,
  STANDARDIZED_SALARY_BANDS,
  matchesDriveDomain,
  matchesDriveSalaryBand,
  getDriveSlug
} from '../../lib/defaultDrives';
import DriveApplicationModal from '../../components/drives/DriveApplicationModal';
import DriveDetailsModal from '../../components/drives/DriveDetailsModal';
import { 
  Building2, MapPin, Calendar, Award, Briefcase, Search, Filter, 
  ArrowRight, CheckCircle2, Clock, Info, X, Lock, Globe, ShieldCheck, 
  RotateCw, AlertCircle, Phone, BookOpen, Send, Sparkles, School, GraduationCap,
  UserPlus
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
    return (propDrives && Array.isArray(propDrives)) ? propDrives : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propDrives && propDrives.length > 0) {
      setDrives(propDrives);
    }
  }, [propDrives]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSalaryBand, setSelectedSalaryBand] = useState<string | null>(null);

  // Modals state
  const [selectedDetailDrive, setSelectedDetailDrive] = useState<PlacementDrive | null>(null);
  const [selectedApplyDrive, setSelectedApplyDrive] = useState<PlacementDrive | null>(null);

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

  // Dynamic counts for each Predefined Domain
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { all: drives.length };
    PREDEFINED_DOMAINS.forEach(dom => {
      counts[dom.id] = drives.filter(d => matchesDriveDomain(d, dom.id)).length;
    });
    return counts;
  }, [drives]);

  // Dynamic counts for each Standardized Salary Band
  const salaryBandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STANDARDIZED_SALARY_BANDS.forEach(band => {
      counts[band.id] = drives.filter(d => matchesDriveSalaryBand(d, band.id)).length;
    });
    return counts;
  }, [drives]);

  // Filtered drives calculation
  const filteredDrives = useMemo(() => {
    const list = drives.filter(d => {
      // 1. Domain / Career Stream filter
      if (selectedDomain && selectedDomain !== 'all') {
        if (!matchesDriveDomain(d, selectedDomain)) return false;
      }

      // 2. Salary Band filter (Category A, B, C, D)
      if (selectedSalaryBand) {
        if (!matchesDriveSalaryBand(d, selectedSalaryBand)) return false;
      }

      // 3. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (d.companyName || '').toLowerCase().includes(q);
        const roleMatch = (d.title || '').toLowerCase().includes(q);
        const skillMatch = (d.skills || '').toLowerCase().includes(q);
        const locMatch = (d.location || '').toLowerCase().includes(q);
        const codeMatch = (d.shortCode || '').toLowerCase().includes(q);
        const catMatch = (d.categoryLabel || '').toLowerCase().includes(q);
        const domMatch = (d.domainLabel || d.domain || '').toLowerCase().includes(q);
        if (!nameMatch && !roleMatch && !skillMatch && !locMatch && !codeMatch && !catMatch && !domMatch) {
          return false;
        }
      }

      return true;
    });

    // Active unexpired drives first, expired drives at the end
    return [...list].sort((a, b) => {
      const aExp = isDriveExpired(a);
      const bExp = isDriveExpired(b);
      if (aExp && !bExp) return 1;
      if (!aExp && bExp) return -1;
      return 0;
    });
  }, [drives, selectedDomain, selectedSalaryBand, searchQuery]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDomain('all');
    setSelectedSalaryBand(null);
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
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="#/register-for-free"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#/register-for-free';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#80d64b]" />
                  <span>Register for Free Candidate Pool</span>
                </a>
              </div>
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
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
          
          {/* Top Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              id="driveSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, skills, degree, or domain..."
              className="w-full bg-white border border-[#e0e2e6] pl-11 pr-10 py-3 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Domain / Career Stream Filter Bar */}
          <div className="p-4 bg-white border border-[#e0e2e6] rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span className="text-xs uppercase tracking-wider text-slate-900 font-extrabold">
                  Filter by Career Stream / Academic Domain
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  {PREDEFINED_DOMAINS.length} Streams
                </span>
              </div>
              {selectedDomain !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedDomain('all')}
                  className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1 self-start sm:self-auto"
                >
                  <X className="w-3 h-3" />
                  <span>Show All Domains</span>
                </button>
              )}
            </div>

            {/* Predefined Domain Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1" id="domainFilterPills">
              {/* All Domains Pill */}
              <button
                type="button"
                onClick={() => setSelectedDomain('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                  selectedDomain === 'all'
                    ? 'bg-slate-900 text-white shadow-slate-900/10 ring-2 ring-slate-900/10'
                    : 'bg-[#f7f9fd] border border-[#e0e2e6] text-slate-700 hover:border-slate-800 hover:bg-white'
                }`}
              >
                <span>All Career Domains</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedDomain === 'all' ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700 font-bold'
                }`}>
                  {domainCounts['all'] || 0}
                </span>
              </button>

              {/* Predefined Domains List */}
              {PREDEFINED_DOMAINS.map(dom => {
                const isSelected = selectedDomain === dom.id;
                const count = domainCounts[dom.id] || 0;
                return (
                  <button
                    key={dom.id}
                    type="button"
                    onClick={() => setSelectedDomain(isSelected ? 'all' : dom.id)}
                    title={dom.description}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-slate-900/10 ring-2 ring-slate-900/10'
                        : 'bg-[#f7f9fd] border border-[#e0e2e6] text-slate-700 hover:border-slate-800 hover:bg-white'
                    }`}
                  >
                    <span>{dom.shortLabel}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected 
                        ? 'bg-emerald-400 text-slate-950 font-black' 
                        : count > 0 ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standardized Salary Bands Key & Filter */}
          <div className="p-4 bg-white border border-[#e0e2e6] rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span className="text-xs uppercase tracking-wider text-slate-900 font-extrabold">
                  {salaryContent.sectionTitle || "Standardized Salary Bands"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  • Click any band to filter drives
                </span>
              </div>
              {selectedSalaryBand && (
                <button 
                  type="button"
                  onClick={() => setSelectedSalaryBand(null)}
                  className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Clear Band Filter</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STANDARDIZED_SALARY_BANDS.map(band => {
                const isSelected = selectedSalaryBand === band.id;
                const count = salaryBandCounts[band.id] || 0;
                
                // Color configuration per band
                let dotBg = 'bg-slate-400';
                let activeClasses = 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-950';
                if (band.id === 'Category B') {
                  dotBg = 'bg-blue-500';
                  activeClasses = 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-950';
                } else if (band.id === 'Category C') {
                  dotBg = 'bg-emerald-500';
                  activeClasses = 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950';
                } else if (band.id === 'Category D') {
                  dotBg = 'bg-purple-500';
                  activeClasses = 'bg-slate-900 border-slate-900 ring-2 ring-slate-900/20 text-white';
                }

                return (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setSelectedSalaryBand(isSelected ? null : band.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? activeClasses
                        : 'bg-[#f7f9fd] border-[#e0e2e6] hover:border-slate-400 hover:bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotBg}`} />
                      <div className="flex flex-col min-w-0">
                        <span className={`text-[11px] font-extrabold truncate ${isSelected && band.id === 'Category D' ? 'text-white' : 'text-slate-900'}`}>
                          {band.label}
                        </span>
                        <span className={`text-[10px] truncate ${isSelected && band.id === 'Category D' ? 'text-slate-300' : 'text-slate-500'}`}>
                          {band.range}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                      isSelected
                        ? (band.id === 'Category D' ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-white border border-slate-300 text-slate-900 font-black shadow-xs')
                        : count > 0 ? 'bg-slate-200 text-slate-700 font-bold' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Summary Bar (if any filter is engaged) */}
          {(selectedDomain !== 'all' || selectedSalaryBand !== null || searchQuery.trim()) && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl text-xs shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  Active Filters:
                </span>

                {/* Domain Chip */}
                {selectedDomain !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 font-semibold">
                    <span>Domain: {PREDEFINED_DOMAINS.find(d => d.id === selectedDomain)?.shortLabel || selectedDomain}</span>
                    <button 
                      onClick={() => setSelectedDomain('all')} 
                      className="hover:text-white p-0.5" 
                      title="Clear domain filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Salary Band Chip */}
                {selectedSalaryBand && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-blue-300 border border-slate-700 font-semibold">
                    <span>Band: {selectedSalaryBand}</span>
                    <button 
                      onClick={() => setSelectedSalaryBand(null)} 
                      className="hover:text-white p-0.5" 
                      title="Clear salary band filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Search Query Chip */}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 font-semibold">
                    <span>Search: "{searchQuery}"</span>
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="hover:text-white p-0.5" 
                      title="Clear search query"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-slate-300 hover:text-white font-bold underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

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
                const isExpired = isDriveExpired(drive);
                const skillsList = drive.skills
                  ? drive.skills.split(/[,•|]/).map(s => s.trim()).filter(Boolean)
                  : [];
                return (
                  <article
                    key={drive.id}
                    className={`drive-card flex flex-col bg-white border rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden group ${
                      isExpired ? 'border-slate-300 opacity-90' : 'border-[#e0e2e6] hover:border-slate-800'
                    }`}
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Header Row: Logo/Shortcode + Company Name + Category Pill */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            {/* Logo or ShortCode Avatar */}
                            <div className="w-12 h-12 bg-[#eceef2] rounded-xl border border-[#e0e2e6] flex items-center justify-center font-bold text-slate-900 text-sm overflow-hidden shrink-0 mt-0.5">
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

                            <div className="flex flex-col min-w-0 flex-1">
                              <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors truncate">
                                <a 
                                  href={`#/drive/${getDriveSlug(drive)}`}
                                  onClick={() => {
                                    window.location.hash = `#/drive/${getDriveSlug(drive)}`;
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="hover:underline"
                                >
                                  {drive.companyName || 'Corporate Partner'}
                                </a>
                              </h3>
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                                {drive.domainLabel || drive.categoryLabel || (drive.category === 'core' ? 'Core Engineering' : drive.category === 'product' ? 'Product Engineering' : 'Enterprise Technology')}
                              </p>
                            </div>
                          </div>

                          {/* Salary Band Pill (Explicit or Auto-Detected) */}
                          {(() => {
                            const displayedBand = drive.salaryBand || (
                              STANDARDIZED_SALARY_BANDS.find(b => matchesDriveSalaryBand(drive, b.id))?.label
                            );
                            if (!displayedBand) return null;
                            const isDreamBand = displayedBand === 'Category D';
                            return (
                              <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border tracking-wide uppercase shrink-0 ${
                                isDreamBand 
                                  ? 'bg-slate-900 text-white border-slate-900' 
                                  : 'bg-[#eceef2] border-[#e0e2e6] text-slate-800'
                              }`}>
                                {displayedBand}
                              </span>
                            );
                          })()}
                        </div>

                        {/* Role & CTC Focus */}
                        <div className="mb-5 pb-4 border-b border-[#e0e2e6]">
                          <h4 className="text-lg font-extrabold text-slate-900 mb-1 leading-snug">
                            <a 
                              href={`#/drive/${getDriveSlug(drive)}`}
                              onClick={() => {
                                window.location.hash = `#/drive/${getDriveSlug(drive)}`;
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {drive.title}
                            </a>
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
                        <div className="space-y-3 mb-4 text-xs">
                          {/* Eligible Batch */}
                          <div className="flex items-start gap-2.5">
                            <School className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                Eligible Batch
                              </span>
                              <span className="font-bold text-slate-800 text-xs">
                                {drive.eligibleBatch || '2025 & 2026 Passing Out'}
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
                              {isExpired ? (
                                <span className="font-bold text-slate-500 text-xs">
                                  {drive.deadline ? `${drive.deadline} (Closed)` : 'Drive Concluded'}
                                </span>
                              ) : (
                                <span className="font-bold text-red-600 text-xs">
                                  {drive.deadline || 'Closing Soon'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Compact Skills Preview (Max 2 tags + more badge) */}
                          {skillsList.length > 0 && (
                            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-0.5">
                                Skills:
                              </span>
                              {skillsList.slice(0, 2).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md border border-slate-200 truncate max-w-[130px]"
                                  title={skill}
                                >
                                  {skill}
                                </span>
                              ))}
                              {skillsList.length > 2 && (
                                <a
                                  href={`#/drive/${getDriveSlug(drive)}`}
                                  onClick={() => {
                                    window.location.hash = `#/drive/${getDriveSlug(drive)}`;
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200 transition-colors cursor-pointer"
                                  title={skillsList.slice(2).join(', ')}
                                >
                                  +{skillsList.length - 2} more
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="pt-4 border-t border-[#e0e2e6] flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs">
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-bold text-[11px] border border-slate-300">
                              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                              Applications Closed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f9fd] rounded-lg text-slate-800 font-bold text-[11px] border border-[#e0e2e6]">
                              <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
                              {drive.statusBadge || 'Applications Open'}
                            </span>
                          )}
                          <span className="text-[11px] font-medium text-slate-500">
                            {isExpired ? 'Drive Concluded' : (drive.statusSubtext || 'No Registration Charges')}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <a
                            href={`#/drive/${getDriveSlug(drive)}`}
                            onClick={() => {
                              window.location.hash = `#/drive/${getDriveSlug(drive)}`;
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-2.5 bg-white border border-[#e0e2e6] hover:border-slate-800 text-slate-900 rounded-xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs truncate block"
                          >
                            View Details
                          </a>

                          {isExpired ? (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold text-center cursor-not-allowed select-none truncate"
                              title="Applications for this drive have concluded"
                            >
                              Closed
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedApplyDrive(drive)}
                              className="px-3 py-2.5 bg-[#80d64b] hover:bg-[#85dc50] text-[#092100] rounded-xl text-xs font-extrabold text-center transition-all cursor-pointer shadow-xs hover:shadow truncate"
                            >
                              Apply Now
                            </button>
                          )}
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
              <a
                href="#/register-for-free"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#/register-for-free';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer gap-2"
              >
                <UserPlus className="w-4 h-4 text-[#092100]" />
                <span>Register for Free</span>
              </a>
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
        <DriveDetailsModal
          drive={selectedDetailDrive}
          onClose={() => setSelectedDetailDrive(null)}
          onApply={(d) => {
            setSelectedDetailDrive(null);
            setSelectedApplyDrive(d);
          }}
        />
      )}

      {/* 8. Dynamic Application Modal (Admin Form Builder & Google Form Connected) */}
      {selectedApplyDrive && (
        <DriveApplicationModal
          drive={selectedApplyDrive}
          onClose={() => setSelectedApplyDrive(null)}
          onApplicationSuccess={(refId) => {
            console.log('Application submitted successfully with Reference ID:', refId);
          }}
        />
      )}

    </div>
  );
}
