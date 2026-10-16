import React, { useState, useMemo } from 'react';
import { CMSPage, GlobalSettings, PlacedStudent } from '../../types';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Building2, 
  Lock, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Landmark,
  BadgeCheck
} from 'lucide-react';
import { DEFAULT_PLACED_STUDENTS_LIST, DEFAULT_PLACED_STUDENTS_SECTIONS } from '../../lib/defaultPlacedStudents';

interface PublicPlacedStudentsPageProps {
  page?: CMSPage;
  settings?: GlobalSettings;
  placedStudents?: PlacedStudent[];
  isVisualMode?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
}

export default function PublicPlacedStudentsPage({
  page,
  settings,
  placedStudents = [],
  isVisualMode = false,
  selectedSectionId,
  onSelectSection,
  onEditField
}: PublicPlacedStudentsPageProps) {
  // Extract modular CMS sections with fallback to default sections
  const heroSec = page?.sections?.find(s => s.type === 'placed-hero') || DEFAULT_PLACED_STUDENTS_SECTIONS[0];
  const filterSec = page?.sections?.find(s => s.type === 'placed-filters') || DEFAULT_PLACED_STUDENTS_SECTIONS[1];
  const statutorySec = page?.sections?.find(s => s.type === 'placed-statutory') || DEFAULT_PLACED_STUDENTS_SECTIONS[2];
  const ctaSec = page?.sections?.find(s => s.type === 'placed-cta') || DEFAULT_PLACED_STUDENTS_SECTIONS[3];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Candidate Data: User live data from DB
  const studentList = useMemo(() => {
    if (placedStudents && placedStudents.length > 0) {
      return placedStudents.map((st, idx) => ({
        id: st.id || `stud-${idx}`,
        name: st.name || '',
        avatar: st.avatar || '',
        college: st.college || '',
        branch: st.branch || '',
        degree: st.degree || (st.branch ? `B.Tech ${st.branch}` : ''),
        year: st.year || '2024',
        company: st.company || '',
        role: st.role || 'Software Engineering Associate',
        packageLpa: st.packageLpa || '—',
        dossierId: st.dossierId || `TP-${st.year || '2024'}-${8000 + idx}`,
        offerLetterVerified: st.offerLetterVerified !== undefined ? st.offerLetterVerified : true,
        testimonialText: st.testimonialText || ''
      }));
    }
    return [];
  }, [placedStudents]);

  // Client-side instant reactive filtering
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return studentList.filter(student => {
      // 1. Text Search query matching Name, Company, College, Role, or Branch
      const matchesSearch = !q || (
        student.name.toLowerCase().includes(q) ||
        student.company.toLowerCase().includes(q) ||
        student.college.toLowerCase().includes(q) ||
        (student.role && student.role.toLowerCase().includes(q)) ||
        (student.branch && student.branch.toLowerCase().includes(q)) ||
        (student.degree && student.degree.toLowerCase().includes(q))
      );

      // 2. Batch Filter
      const matchesBatch = selectedBatch === 'all' || student.year === selectedBatch;

      // 3. Branch Filter
      let matchesBranch = true;
      if (selectedBranch === 'cse') {
        const text = `${student.branch} ${student.degree}`.toLowerCase();
        matchesBranch = text.includes('computer science') || text.includes('information technology') || text.includes('cse') || text.includes('it');
      } else if (selectedBranch === 'ece') {
        const text = `${student.branch} ${student.degree}`.toLowerCase();
        matchesBranch = text.includes('electronics') || text.includes('communication') || text.includes('ece');
      } else if (selectedBranch === 'ca') {
        const text = `${student.branch} ${student.degree}`.toLowerCase();
        matchesBranch = text.includes('bca') || text.includes('mca') || text.includes('computer application');
      } else if (selectedBranch === 'mech') {
        const text = `${student.branch} ${student.degree}`.toLowerCase();
        matchesBranch = text.includes('mechanical') || text.includes('civil') || text.includes('electrical');
      }

      return matchesSearch && matchesBatch && matchesBranch;
    });
  }, [studentList, searchQuery, selectedBatch, selectedBranch]);

  const navigateTo = (path: string) => {
    window.location.hash = path.startsWith('#') ? path : `#/${path}`;
  };

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans antialiased selection:bg-[#80d64b]/30 selection:text-[#092100]">
      
      {/* 1. HERO MASTHEAD & METRICS */}
      <section 
        className={`w-full bg-[#f7f9fd] py-8 lg:py-12 border-b border-[#e0e2e6] transition-all relative ${
          isVisualMode && selectedSectionId === heroSec.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(heroSec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#5f5e5e] text-xs font-semibold">
            <button 
              onClick={() => navigateTo('/')}
              className="hover:text-[#191c1f] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#5f5e5e]" />
            <span className="text-[#191c1f] font-bold">Placed Students</span>
          </nav>

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
            <div className="max-w-3xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#e0e2e6] w-fit rounded">
                <BadgeCheck className="w-4 h-4 text-[#2e6c00]" />
                <span className="text-[11px] uppercase tracking-wider text-[#191c1f] font-bold">
                  {heroSec.content?.badgeText || 'VERIFIED PLACEMENT OUTCOMES'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#191c1f] tracking-tight font-display">
                {heroSec.title || 'Our Placed Students'}
              </h1>
              <p className="text-base sm:text-lg text-[#5f5e5e] leading-relaxed">
                {heroSec.subtitle || 'Congratulations to our engineering and management students who cleared corporate selection rounds and secured job offers.'}
              </p>
            </div>

            {/* Institutional Metric Counter Pill */}
            <div className="bg-white p-4 rounded-xl flex items-center gap-4 shrink-0 shadow-sm border border-[#e0e2e6]">
              <div className="w-12 h-12 rounded-lg bg-[#eceef2] flex items-center justify-center text-[#191c1f]">
                <GraduationCap className="w-6 h-6 text-[#2e6c00]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#191c1f] tracking-tight">
                  {heroSec.content?.metricNumber || '1,840+'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#5f5e5e] font-semibold">
                  {heroSec.content?.metricLabel || 'Graduates Placed'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SEARCH & REAL-TIME FILTERS BAR */}
      <section 
        className={`w-full bg-[#f2f4f8] py-6 border-b border-[#e0e2e6] relative transition-all ${
          isVisualMode && selectedSectionId === filterSec.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(filterSec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f5e5e] w-4 h-4 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={filterSec.content?.searchPlaceholder || 'Search by student name, company, or college...'}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded font-normal text-sm text-[#191c1f] placeholder:text-[#5f5e5e] outline-none border border-[#e0e2e6] focus:border-[#191c1f] transition-colors shadow-sm"
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

            {/* Batch Filter Dropdown */}
            <div className="md:col-span-3 relative">
              <select 
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white rounded text-sm text-[#191c1f] border border-[#e0e2e6] focus:border-[#191c1f] outline-none cursor-pointer transition-colors pr-10 shadow-sm"
              >
                <option value="all">All Batches</option>
                <option value="2025">Batch of 2025</option>
                <option value="2024">Batch of 2024</option>
                <option value="2023">Batch of 2023</option>
                <option value="2022">Batch of 2022</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5f5e5e]">
                ▼
              </div>
            </div>

            {/* Branch Filter Dropdown */}
            <div className="md:col-span-3 relative">
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white rounded text-sm text-[#191c1f] border border-[#e0e2e6] focus:border-[#191c1f] outline-none cursor-pointer transition-colors pr-10 shadow-sm"
              >
                <option value="all">All Branches</option>
                <option value="cse">Computer Science & IT</option>
                <option value="ece">Electronics & Comm</option>
                <option value="ca">Computer Applications (BCA/MCA)</option>
                <option value="mech">Mechanical / Civil / Other</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5f5e5e]">
                ▼
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VERIFIED STUDENT PLACEMENT RECORDS GRID */}
      <section className="w-full bg-[#f7f9fd] py-12 md:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Records Count Bar */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#e0e2e6]">
            <span className="text-sm text-[#191c1f] font-semibold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#80d64b] animate-pulse" />
              <span>{filterSec.content?.statusLabel || 'Showing Verified Student Dossiers'}</span>
              <span className="text-xs bg-[#e0e2e6] text-[#191c1f] px-2 py-0.5 rounded-full font-bold ml-1">
                {filteredStudents.length} Records
              </span>
            </span>
            <span className="text-[11px] text-[#5f5e5e] uppercase tracking-widest font-semibold">
              {filterSec.content?.statusSublabel || 'Audited & Authenticated'}
            </span>
          </div>

          {/* Student Grid */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e0e2e6] shadow-sm flex flex-col items-center justify-center gap-3">
              <Search className="w-8 h-8 text-[#5f5e5e]" />
              <h3 className="text-lg font-bold text-[#191c1f]">No student records found</h3>
              <p className="text-sm text-[#5f5e5e] max-w-md">
                No verified dossiers matched your search query "{searchQuery}" or filter options. Try resetting your search terms.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedBatch('all'); setSelectedBranch('all'); }}
                className="mt-2 px-4 py-2 bg-[#80d64b] hover:bg-[#6fc43a] text-[#092100] font-bold text-xs rounded transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStudents.map((candidate) => (
                <article 
                  key={candidate.id}
                  className="bg-white rounded-xl p-6 flex flex-col justify-between border border-[#e0e2e6] transition-all duration-200 hover:border-[#191c1f] hover:shadow-md"
                >
                  <div>
                    {/* Header Row with Avatar, Name, Degree and Package Pill */}
                    <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#e0e2e6]">
                      <div className="flex items-center gap-4">
                        {candidate.avatar ? (
                          <img 
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-14 h-14 rounded-lg object-cover bg-[#eceef2] shrink-0 border border-[#e0e2e6]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-200">
                            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-[#191c1f]">{candidate.name}</h2>
                            <span title="Verified Credential"><BadgeCheck className="w-4 h-4 text-[#2e6c00]" /></span>
                          </div>
                          <span className="text-sm text-[#404a39] font-medium mt-0.5">
                            {candidate.degree || `B.Tech ${candidate.branch}`}
                          </span>
                          <span className="text-xs text-[#5f5e5e] flex items-center gap-1.5 mt-0.5">
                            <Landmark className="w-3.5 h-3.5 text-[#5f5e5e] shrink-0" />
                            <span className="line-clamp-1">{candidate.college}</span>
                          </span>
                        </div>
                      </div>

                      {/* Package Pill */}
                      <div className="text-right shrink-0">
                        <div className="px-3 py-1 bg-[#f7f9fd] rounded border border-[#191c1f] text-[#191c1f] text-base font-bold">
                          {candidate.packageLpa}
                        </div>
                        <span className="text-[10px] text-[#5f5e5e] block mt-1 uppercase tracking-wider font-semibold">
                          Annual CTC
                        </span>
                      </div>
                    </div>

                    {/* Hiring Company & Role Block */}
                    <div className="py-3.5 my-3 grid grid-cols-2 gap-4 bg-[#f2f4f8] px-4 rounded-lg border border-[#e0e2e6]">
                      <div>
                        <span className="text-[10px] text-[#5f5e5e] uppercase tracking-wider block font-semibold">
                          Appointed Company
                        </span>
                        <span className="text-sm text-[#191c1f] font-bold block mt-0.5 line-clamp-1">
                          {candidate.company}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5f5e5e] uppercase tracking-wider block font-semibold">
                          Role Appointed
                        </span>
                        <span className="text-sm text-[#191c1f] font-medium block mt-0.5 line-clamp-1">
                          {candidate.role || 'Graduate Trainee'}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Verification Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#eceef2] rounded-sm border border-[#e0e2e6] mb-4">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2e6c00]" />
                      <span className="text-[11px] font-semibold text-[#191c1f] uppercase tracking-wide">
                        Verified Offer Letter
                      </span>
                    </div>

                    {/* Student Experience Quote */}
                    {candidate.testimonialText && (
                      <p className="text-sm text-[#5f5e5e] italic relative pl-4 border-l-2 border-[#80d64b] leading-relaxed">
                        “{candidate.testimonialText}”
                      </p>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="mt-6 pt-4 border-t border-[#e0e2e6] flex items-center justify-between text-xs text-[#5f5e5e]">
                    <span className="font-mono text-[11px]">Dossier ID: {candidate.dossierId}</span>
                    <span className="text-[#2e6c00] font-semibold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#2e6c00]" />
                      <span>Institutional Record</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. STATUTORY TRANSPARENCY NOTICE */}
      <section 
        className={`w-full bg-[#f2f4f8] py-8 border-y border-[#e0e2e6] relative transition-all ${
          isVisualMode && selectedSectionId === statutorySec.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(statutorySec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-white rounded-lg border border-[#e0e2e6] flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#e0e2e6] flex items-center justify-center shrink-0 text-[#191c1f]">
              <ShieldAlert className="w-5 h-5 text-[#191c1f]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-widest text-[#5f5e5e] font-bold">
                {statutorySec.content?.label || 'Regulatory & Ethics Notice'}
              </span>
              <p className="text-sm text-[#191c1f] leading-relaxed">
                {statutorySec.content?.disclaimerText || 'Disclaimer: Final placement and hiring decisions rest solely with the respective hiring companies. TantraPex Technologies does not sell job seats, charge commissions, or guarantee job offers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CALL TO ACTION */}
      <section 
        className={`w-full bg-[#f7f9fd] py-16 lg:py-20 relative transition-all ${
          isVisualMode && selectedSectionId === ctaSec.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => isVisualMode && onSelectSection?.(ctaSec.id)}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 md:p-12 bg-white rounded-xl border border-[#e0e2e6] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex flex-col gap-2 max-w-2xl text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-[#2e6c00] font-bold">
                {ctaSec.content?.eyebrow || '100% Free For All Students'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#191c1f] tracking-tight font-display">
                {ctaSec.title || 'Ready to explore active hiring drives for your batch?'}
              </h2>
              <p className="text-sm sm:text-base text-[#5f5e5e]">
                {ctaSec.subtitle || 'Access transparent recruitment drives, verified compensation details, and direct employer assessments.'}
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto flex justify-center">
              <button 
                onClick={() => navigateTo(ctaSec.content?.buttonLink || '#/upcoming-drives')}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#80d64b] hover:bg-[#6fc43a] text-[#092100] font-bold text-sm rounded shadow-none transition-all cursor-pointer"
              >
                <span>{ctaSec.content?.buttonText || 'Explore Upcoming Opportunities'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
