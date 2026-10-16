import React, { useState, useMemo } from 'react';
import { CMSPage, GlobalSettings, HiringPartner } from '../../types';
import { 
  Building2, 
  Search, 
  ChevronRight, 
  Info, 
  Users, 
  CheckSquare, 
  Zap, 
  Briefcase, 
  ArrowRight, 
  Download,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { DEFAULT_HIRING_PARTNERS_LIST, DEFAULT_PARTNERS_SECTIONS } from '../../lib/defaultPartners';

interface PublicPartnersPageProps {
  page?: CMSPage;
  settings?: GlobalSettings;
  hiringPartners?: HiringPartner[];
  isVisualMode?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
}

export default function PublicPartnersPage({
  page,
  settings,
  hiringPartners = [],
  isVisualMode = false,
  selectedSectionId,
  onSelectSection,
  onEditField
}: PublicPartnersPageProps) {
  // Extract modular CMS sections with fallback to default sections
  const heroSec = page?.sections?.find(s => s.type === 'partners-hero') || DEFAULT_PARTNERS_SECTIONS[0];
  const noticeSec = page?.sections?.find(s => s.type === 'partners-notice') || DEFAULT_PARTNERS_SECTIONS[1];
  const processSec = page?.sections?.find(s => s.type === 'partners-process') || DEFAULT_PARTNERS_SECTIONS[2];
  const ctaSec = page?.sections?.find(s => s.type === 'partners-cta') || DEFAULT_PARTNERS_SECTIONS[3];

  // Filtering & Search State
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'it-services' | 'product-enterprise' | 'core-engineering'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Partners data: user live database records
  const partnersList: HiringPartner[] = useMemo(() => {
    if (hiringPartners && hiringPartners.length > 0) {
      return hiringPartners.filter(p => p.isVisible !== false).map((hp, idx) => ({
        ...hp,
        id: hp.id || `hp-${idx}`,
        shortCode: hp.shortCode || hp.name.slice(0, 3).toUpperCase(),
        tier: hp.tier || 'Tier-1',
        category: hp.category || 'it-services',
        trackLabel: hp.trackLabel || 'Intake Route',
        trackValue: hp.trackValue || 'Campus Drive'
      }));
    }
    return [];
  }, [hiringPartners]);

  // Client-side search & category filtering
  const filteredPartners = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return partnersList.filter(partner => {
      const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory;
      const matchesSearch = !q || (
        partner.name.toLowerCase().includes(q) ||
        (partner.shortCode && partner.shortCode.toLowerCase().includes(q)) ||
        (partner.industry && partner.industry.toLowerCase().includes(q)) ||
        (partner.trackValue && partner.trackValue.toLowerCase().includes(q))
      );
      return matchesCategory && matchesSearch;
    });
  }, [partnersList, selectedCategory, searchQuery]);

  // Count active drives
  const activeDrivesCount = useMemo(() => {
    return partnersList.filter(p => p.hasActiveDrive).length;
  }, [partnersList]);

  const navigateTo = (path: string) => {
    window.location.hash = path.startsWith('#') ? path : `#/${path}`;
  };

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans antialiased selection:bg-[#80d64b]/30 selection:text-[#092100]">
      
      {/* 1. TOP BREADCRUMB */}
      <section className="w-full bg-white border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#5f5e5e]">
            <button 
              onClick={() => navigateTo('/')}
              className="hover:text-[#191c1f] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#5c5f5e]" />
            <span className="text-[#191c1f] font-bold">Placement Partners</span>
          </nav>
        </div>
      </section>

      {/* 2. PAGE HEADER & METRICS BAR */}
      <section 
        className={`w-full bg-white pb-10 pt-6 transition-all relative ${
          isVisualMode && selectedSectionId === heroSec.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(heroSec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Left Header Copy */}
            <div className="max-w-3xl flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#eceef2] rounded text-[11px] font-bold text-[#191c1f] uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#80d64b] animate-pulse" />
                <span>{heroSec.content?.badgeText || 'CORPORATE RECRUITMENT DIRECTORY'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#191c1f] tracking-tight font-display">
                {heroSec.title || 'Placement Partners'}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-[#5f5e5e] leading-relaxed">
                {heroSec.subtitle || 'Top technology services, product engineering, and enterprise companies that participate in campus and pooled placement drives.'}
              </p>
            </div>

            {/* Right Metric Block */}
            <div className="flex items-center gap-6 bg-[#f7f9fd] px-6 py-4 rounded-xl border border-[#e0e2e6] shrink-0 shadow-sm">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-[#191c1f] leading-none">
                  {heroSec.content?.verifiedPartnersCount || partnersList.length}
                </span>
                <span className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider mt-1.5">
                  {heroSec.content?.verifiedPartnersLabel || 'Verified Partners'}
                </span>
              </div>
              <div className="w-px h-8 bg-[#e0e2e6]" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-[#2e6c00] leading-none">
                  {heroSec.content?.activeDrivesCount || activeDrivesCount}
                </span>
                <span className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider mt-1.5">
                  {heroSec.content?.activeDrivesLabel || 'Drives Active Today'}
                </span>
              </div>
            </div>

          </div>

          {/* Filter Controls & Search */}
          <div className="mt-8 pt-4 bg-[#f2f4f8] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#e0e2e6]">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#191c1f] text-white shadow-sm'
                    : 'bg-white text-[#404a39] hover:bg-[#eceef2] border border-[#e0e2e6]'
                }`}
              >
                All Companies ({partnersList.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('it-services')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'it-services'
                    ? 'bg-[#191c1f] text-white shadow-sm'
                    : 'bg-white text-[#404a39] hover:bg-[#eceef2] border border-[#e0e2e6]'
                }`}
              >
                IT Services
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('product-enterprise')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'product-enterprise'
                    ? 'bg-[#191c1f] text-white shadow-sm'
                    : 'bg-white text-[#404a39] hover:bg-[#eceef2] border border-[#e0e2e6]'
                }`}
              >
                Product & Enterprise
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('core-engineering')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'core-engineering'
                    ? 'bg-[#191c1f] text-white shadow-sm'
                    : 'bg-white text-[#404a39] hover:bg-[#eceef2] border border-[#e0e2e6]'
                }`}
              >
                Core Engineering
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c5f5e] w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={heroSec.content?.searchPlaceholder || 'Search company by name...'}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-xs text-[#191c1f] placeholder:text-[#5f5e5e] focus:outline-none focus:ring-1 focus:ring-[#191c1f] border border-[#e0e2e6] transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5f5e5e] hover:text-[#191c1f] font-bold"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 3. PARTNER DIRECTORY GRID */}
      <section className="w-full py-12 bg-[#f7f9fd]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPartners.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e0e2e6] shadow-sm flex flex-col items-center justify-center gap-3">
              <Building2 className="w-8 h-8 text-[#5f5e5e]" />
              <h3 className="text-lg font-bold text-[#191c1f]">No companies found</h3>
              <p className="text-sm text-[#5f5e5e] max-w-md">
                No verified hiring partners matched "{searchQuery}" under the selected category.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 px-4 py-2 bg-[#80d64b] hover:bg-[#6fc43a] text-[#092100] font-bold text-xs rounded transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPartners.map((partner) => (
                <div 
                  key={partner.id}
                  className="bg-white rounded-xl p-6 flex flex-col justify-between hover:bg-[#f2f4f8] border border-[#e0e2e6] hover:border-[#191c1f] hover:shadow-md transition-all duration-200 group"
                >
                  <div>
                    {/* Top Row: ShortCode / Logo and Status Pill */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      {partner.logoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name}
                          className="w-12 h-12 rounded-lg object-contain bg-[#e6e8ec] p-1.5 border border-[#e0e2e6]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#e6e8ec] flex items-center justify-center text-sm font-extrabold text-[#191c1f] tracking-tighter border border-[#e0e2e6]">
                          {partner.shortCode || partner.name.slice(0, 3).toUpperCase()}
                        </div>
                      )}

                      {partner.hasActiveDrive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-[#80d64b] text-[#092100] font-bold shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#092100] animate-ping" />
                          <span>Active Drive</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#eceef2] text-[#5f5e5e] uppercase font-bold border border-[#e0e2e6]">
                          {partner.tier || 'Tier-1'}
                        </span>
                      )}
                    </div>

                    {/* Company Name & Category Description */}
                    <h2 className="text-base font-bold text-[#191c1f] leading-snug group-hover:text-[#2e6c00] transition-colors">
                      {partner.name}
                    </h2>
                    <p className="text-xs text-[#5f5e5e] mt-1 line-clamp-1">
                      {partner.industry || (partner.category === 'core-engineering' ? 'Core Engineering & R&D' : partner.category === 'product-enterprise' ? 'Product & Enterprise' : 'IT Services & Consulting')}
                    </p>
                  </div>

                  {/* Bottom Placement Track Box */}
                  <div className="mt-5 pt-3 bg-[#f2f4f8] px-3.5 py-2.5 rounded-lg flex items-center justify-between border border-[#e0e2e6]">
                    <span className="text-[10px] text-[#5f5e5e] uppercase font-semibold">
                      {partner.trackLabel || (partner.hasActiveDrive ? 'Current Intake' : 'Intake Route')}
                    </span>
                    <span className="text-xs text-[#191c1f] font-bold line-clamp-1 text-right">
                      {partner.trackValue || 'Campus Hiring'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. CORPORATE TRANSPARENCY NOTE */}
          <div 
            className={`mt-10 p-5 bg-[#f2f4f8] rounded-xl flex items-start gap-3.5 border border-[#e0e2e6] relative transition-all ${
              isVisualMode && selectedSectionId === noticeSec.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => isVisualMode && onSelectSection?.(noticeSec.id)}
          >
            <Info className="w-5 h-5 text-[#5f5e5e] mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
              <strong className="text-[#191c1f] font-semibold">Note:</strong> {noticeSec.content?.noticeText || 'Company names and logos represent organizations that conduct recruitment drives through our institutional network. Display of a company logo does not guarantee current job openings or hiring outcomes.'}
            </p>
          </div>

        </div>
      </section>

      {/* 5. HOW COMPANIES HIRE THROUGH TANTRAPEX */}
      <section 
        className={`w-full py-16 lg:py-20 bg-white border-t border-[#e0e2e6] relative transition-all ${
          isVisualMode && selectedSectionId === processSec.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(processSec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-[#2e6c00] uppercase tracking-widest">
              {processSec.content?.eyebrow || 'RECRUITMENT PROCESS'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191c1f] mt-1 tracking-tight font-display">
              {processSec.title || 'How Companies Hire Through TantraPex'}
            </h2>
            <p className="text-sm sm:text-base text-[#5f5e5e] mt-2 leading-relaxed">
              {processSec.subtitle || 'Our institutional placement model delivers verified candidates directly to enterprise hiring teams with maximum speed and zero friction.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(processSec.content?.steps || [
              {
                id: 'step-1',
                number: '1',
                title: 'Direct Talent Access',
                description: 'Access pre-verified candidate profiles from 100+ partner engineering colleges across India with zero recruiter access fees.',
                metricLabel: 'Placement Fee',
                metricValue: '100% Free Model'
              },
              {
                id: 'step-2',
                number: '2',
                title: 'Standardized Online Screening',
                description: 'Save hundreds of engineering hours with automated aptitude assessments, proctored coding rounds, and standardized competency reports.',
                metricLabel: 'Proctoring',
                metricValue: 'Automated & Audited'
              },
              {
                id: 'step-3',
                number: '3',
                title: 'Fast Onboarding Support',
                description: 'Complete offer letters, document verification, and joining formalities in days with our dedicated institutional placement coordinators.',
                metricLabel: 'Turnaround Time',
                metricValue: '< 7 Working Days'
              }
            ]).map((step: any, idx: number) => {
              const icons = [Users, CheckSquare, Zap];
              const StepIcon = icons[idx % icons.length];
              return (
                <div 
                  key={step.id || idx}
                  className="bg-[#f7f9fd] rounded-xl p-6 flex flex-col justify-between border border-[#e0e2e6] shadow-sm hover:border-[#191c1f] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="w-10 h-10 rounded-lg bg-[#191c1f] text-white flex items-center justify-center text-base font-bold">
                        {step.number || idx + 1}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-[#80d64b]/20 flex items-center justify-center text-[#2e6c00]">
                        <StepIcon className="w-5 h-5 text-[#2e6c00]" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#191c1f]">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5f5e5e] mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 bg-white p-3 rounded-lg flex items-center justify-between border border-[#e0e2e6]">
                    <span className="text-[10px] text-[#5f5e5e] uppercase font-bold">
                      {step.metricLabel || 'Feature'}
                    </span>
                    <span className="text-xs text-[#191c1f] font-extrabold">
                      {step.metricValue || '100% Free'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. RECRUITER CALL TO ACTION BLOCK */}
      <section 
        className={`w-full py-16 bg-[#191c1f] text-white relative transition-all ${
          isVisualMode && selectedSectionId === ctaSec.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(ctaSec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded text-[11px] font-bold text-[#80d64b] uppercase tracking-wider mb-3">
                <Briefcase className="w-4 h-4 text-[#80d64b]" />
                <span>{ctaSec.content?.eyebrow || 'For HR Leaders & Talent Acquisition'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                {ctaSec.title || 'Are you a corporate recruiter looking to hire fresh talent?'}
              </h2>
              <p className="text-sm sm:text-base text-[#e5e2e1] mt-3 leading-relaxed">
                {ctaSec.subtitle || 'Partner with TantraPex to organize dedicated campus drives, pooled virtual evaluations, and direct hiring for freshers with no placement coordination cost.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                onClick={() => navigateTo(ctaSec.content?.primaryBtnLink || '#/contact')}
                className="px-6 py-3.5 rounded bg-[#80d64b] hover:bg-[#6fc43a] text-[#092100] text-sm font-bold transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{ctaSec.content?.primaryBtnText || 'Connect with Placement Team'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={ctaSec.content?.brochureUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <Download className="w-4 h-4" />
                <span>{ctaSec.content?.secondaryBtnText || 'Download Brochure'}</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
