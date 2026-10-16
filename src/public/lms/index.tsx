import React from 'react';
import { CMSPage, GlobalSettings } from '../../types';
import { DEFAULT_LMS_SECTIONS } from '../../lib/defaultLms';
import { 
  ChevronRight, 
  Home, 
  BookOpen, 
  Terminal, 
  HelpCircle, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  Code, 
  Check, 
  Handshake, 
  Sparkles,
  Zap,
  Gauge
} from 'lucide-react';

interface PublicLmsPageProps {
  page: CMSPage;
  settings?: GlobalSettings;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  isVisualMode?: boolean;
}

export default function PublicLmsPage({
  page,
  isVisualMode = false
}: PublicLmsPageProps) {
  // Extract sections with fallback to defaults
  const heroSection = page.sections?.find(s => s.type === 'lms-hero') || DEFAULT_LMS_SECTIONS[0];
  const pillarsSection = page.sections?.find(s => s.type === 'lms-pillars') || DEFAULT_LMS_SECTIONS[1];
  const facultySection = page.sections?.find(s => s.type === 'lms-faculty') || DEFAULT_LMS_SECTIONS[2];
  const journeySection = page.sections?.find(s => s.type === 'lms-journey') || DEFAULT_LMS_SECTIONS[3];
  const collaborationSection = page.sections?.find(s => s.type === 'lms-collaboration') || DEFAULT_LMS_SECTIONS[4];
  const ctaSection = page.sections?.find(s => s.type === 'lms-cta') || DEFAULT_LMS_SECTIONS[5];

  const heroContent = heroSection.content || {};
  const pillarsContent = pillarsSection.content || {};
  const facultyContent = facultySection.content || {};
  const journeyContent = journeySection.content || {};
  const collaborationContent = collaborationSection.content || {};
  const ctaContent = ctaSection.content || {};

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'menu_book':
      case 'book':
        return <BookOpen className="w-6 h-6" />;
      case 'terminal':
      case 'code':
        return <Terminal className="w-6 h-6" />;
      case 'quiz':
      case 'help':
        return <HelpCircle className="w-6 h-6" />;
      case 'badge':
      case 'award':
        return <Award className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans antialiased min-h-screen">

      {/* 1. BREADCRUMB & METADATA BAR */}
      <section className="w-full bg-white border-b border-[#e0e2e6]/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#5f5e5e]">
            <a href="#/" className="hover:text-[#191c1f] transition-colors flex items-center gap-1 font-medium">
              <Home className="w-3.5 h-3.5 text-[#5f5e5e]" />
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#191c1f] font-semibold">LMS / Learning Resources</span>
          </nav>
        </div>
      </section>

      {/* 2. HEADER SECTION (HERO - 2-COLUMN WITH SHORT-SIZE IMAGE, NO STATS) */}
      <header className={`w-full bg-[#f2f4f8] py-12 lg:py-16 border-b border-[#e0e2e6] ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline & Details */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#80d64b] rounded shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#092100]"></span>
                  <span className="text-[10px] uppercase tracking-wider text-[#092100] font-bold">
                    {heroContent.badgeText || "Learning, Training & Placement Collaboration"}
                  </span>
                </div>
                {heroContent.refinedBadge && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {heroContent.refinedBadge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#191c1f] tracking-tight leading-tight">
                {heroSection.title || "TantraPex × UG Skill"}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#404a39] leading-relaxed max-w-2xl">
                {heroSection.subtitle || "TantraPex Technologies collaborates with UG Skill (a learning product associated with NexisparkX) to provide structured learning, coding practice, and placement training."}
              </p>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e0e2e6] rounded-lg font-semibold text-[#191c1f]">
                  <Terminal className="w-3.5 h-3.5 text-[#2e6c00]" />
                  In-Browser Code Sandbox
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e0e2e6] rounded-lg font-semibold text-[#191c1f]">
                  <Award className="w-3.5 h-3.5 text-[#2e6c00]" />
                  Recruiter Test Bank
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e0e2e6] rounded-lg font-semibold text-[#191c1f]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2e6c00]" />
                  100% Free for Registered Candidates
                </span>
              </div>
            </div>

            {/* Right Column: Short-size Hero Image (Editable via CMS) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#e0e2e6] bg-white shadow-md max-w-md w-full">
                <img
                  src={heroContent.heroImage || "https://res.cloudinary.com/dhy9pmo8s/image/upload/v1792099216/Tantrapex/vgqsc91t2xxo6zl68bnl.jpg"}
                  alt="UG Skill LMS & Coding Platform"
                  className="w-full h-auto object-cover max-h-[360px] rounded-2xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/lms-hero.jpg";
                  }}
                />
                
                {/* Floating Bottom Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-[#e0e2e6] p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-xs text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#80d64b] flex items-center justify-center text-[#092100] shrink-0 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-[#191c1f] block text-[11px] leading-tight">
                        UG Skill Active Sandbox
                      </span>
                      <span className="text-[10px] text-[#5f5e5e] block">
                        Python • Java • C++20 • Algorithms
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#2e6c00] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Zero Setup
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 3. SECTION 1: 4 CORE LEARNING PILLARS */}
      <section className={`w-full bg-[#f7f9fd] py-16 lg:py-20 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col gap-2 mb-12">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5f5e5e]">
                {pillarsContent.eyebrow || "Modular Architecture"}
              </span>
              <span className="h-px w-8 bg-[#e0e2e6]"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#191c1f] tracking-tight">
              {pillarsSection.title || "Four Core Learning Pillars"}
            </h2>
            <p className="text-sm sm:text-base text-[#5f5e5e] max-w-2xl leading-relaxed">
              {pillarsSection.subtitle || "Engineered to systematically advance technical capability from conceptual understanding to verified recruiter readiness."}
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(pillarsContent.pillars || DEFAULT_LMS_SECTIONS[1].content.pillars).map((pillar: any, idx: number) => (
              <div 
                key={pillar.id || idx} 
                className="bg-white p-6 rounded-lg border border-[#e0e2e6] flex flex-col justify-between hover:bg-[#f2f4f8] transition-colors group shadow-sm hover:shadow"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded bg-[#eceef2] flex items-center justify-center text-[#191c1f] group-hover:bg-[#80d64b] group-hover:text-[#092100] transition-colors">
                    {getPillarIcon(pillar.icon)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f5e5e]">
                      {pillar.num}
                    </span>
                    <h3 className="text-lg font-bold text-[#191c1f] leading-snug">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#f2f4f8] flex items-center justify-between text-[#5f5e5e] text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{pillar.footerTag}</span>
                  <CheckCircle className="w-4 h-4 text-[#2e6c00]" />
                </div>
              </div>
            ))}
          </div>

          {/* Sandbox Languages Banner */}
          <div className="mt-8 bg-white p-4 sm:p-5 rounded-lg border border-[#e0e2e6] flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#80d64b] rounded-sm"></span>
              <span className="text-xs sm:text-sm text-[#191c1f] font-bold">
                {pillarsContent.sandboxBanner?.label || "Active Compiler Environments:"}
              </span>
              <span className="text-xs sm:text-sm text-[#5f5e5e]">
                {pillarsContent.sandboxBanner?.languages || "C++20, OpenJDK 17, Python 3.11, JavaScript (Node runtime)"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#191c1f]">
              <CheckCircle className="w-4 h-4 text-[#2e6c00]" />
              <span>{pillarsContent.sandboxBanner?.badgeText || "Zero Local Installation Required"}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SECTION 2: MEET OUR TRAINING FACULTY */}
      <section className={`w-full bg-white py-16 lg:py-20 border-y border-[#e0e2e6] ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#eceef2] rounded mb-2 border border-[#e0e2e6]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1f]">
                  {facultyContent.badgeText || "Instructors"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#191c1f] tracking-tight">
                {facultySection.title || "Meet Our Training Faculty"}
              </h2>
              <p className="text-sm sm:text-base text-[#5f5e5e] mt-1">
                {facultySection.subtitle || "Learn directly from experienced educators and technical mentors."}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#f2f4f8] px-3.5 py-2 rounded-lg border border-[#e0e2e6]">
              <ShieldCheck className="w-5 h-5 text-[#2e6c00]" />
              <span className="text-xs font-semibold text-[#191c1f]">
                {facultyContent.verificationBadge || "Verified Academic Credentials"}
              </span>
            </div>
          </div>

          {/* 2 Faculty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(facultyContent.facultyList || DEFAULT_LMS_SECTIONS[2].content.facultyList).map((fac: any, idx: number) => (
              <div 
                key={fac.id || idx} 
                className="bg-[#f2f4f8] p-6 sm:p-8 rounded-xl border border-blue-200/80 flex flex-col justify-between relative shadow-sm hover:shadow transition-shadow"
              >
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
                      {fac.avatar ? (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 flex-shrink-0 shadow-md">
                          <img src={fac.avatar} alt={fac.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-white border-2 border-slate-200 flex-shrink-0 flex items-center justify-center text-blue-700 shadow-md">
                          <Code className="w-12 h-12 text-[#2e6c00]" />
                        </div>
                      )}
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#191c1f]">
                              {fac.name}
                            </h3>
                            <CheckCircle className="w-5 h-5 text-[#2e6c00]" />
                          </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {fac.badge || "Verified Mentor"}
                          </span>
                        </div>
                        <span className="text-sm sm:text-base font-bold text-[#2e6c00] mt-1">
                          {fac.role}
                        </span>
                        <span className="text-xs sm:text-sm text-[#5f5e5e] mt-0.5">
                          {fac.subRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#e0e2e6]">
                    <p className="text-xs sm:text-sm text-[#191c1f] leading-relaxed">
                      {fac.bio}
                    </p>
                  </div>

                  {/* Benchmarks Grid */}
                  <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    {(fac.benchmarks || []).map((bm: any, bIdx: number) => (
                      <div key={bIdx} className="bg-white p-2.5 rounded-lg border border-[#e0e2e6]">
                        <span className="text-[10px] font-bold uppercase text-[#5f5e5e] block tracking-wider">
                          {bm.label}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#191c1f] block mt-0.5">
                          {bm.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e0e2e6] flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#5f5e5e]">
                    {fac.primaryTrack}
                  </span>
                  <a 
                    href={fac.actionLink || "#/contact"} 
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#191c1f] hover:text-[#2e6c00] transition-colors"
                  >
                    <span>{fac.actionText || "Live Office Hours"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SECTION 3: LEARNING-TO-PLACEMENT JOURNEY */}
      <section className={`w-full bg-[#f7f9fd] py-16 lg:py-20 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col gap-2 mb-12">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5f5e5e]">
                {journeyContent.eyebrow || "Step-By-Step Readiness"}
              </span>
              <span className="h-px w-8 bg-[#e0e2e6]"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#191c1f] tracking-tight">
              {journeySection.title || "Learning-to-Placement Journey"}
            </h2>
            <p className="text-sm sm:text-base text-[#5f5e5e] max-w-2xl leading-relaxed">
              {journeySection.subtitle || "A structured 5-stage progression model ensuring candidate eligibility prior to on-campus and virtual hiring drives."}
            </p>
          </div>

          {/* 5-Step Visual Progression System */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e2e6] shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
              {(journeyContent.stages || DEFAULT_LMS_SECTIONS[3].content.stages).map((st: any, idx: number) => {
                const isHighlight = st.isHighlight || idx === 4;
                return (
                  <div 
                    key={st.id || idx} 
                    className={`flex flex-col gap-2 p-5 rounded-lg border transition-all ${
                      isHighlight
                        ? 'bg-[#f2f4f8] border-[#80d64b]/80 shadow-sm'
                        : 'bg-[#f2f4f8] border-[#e0e2e6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isHighlight
                          ? 'bg-[#80d64b] text-[#092100]'
                          : 'bg-[#191c1f] text-white'
                      }`}>
                        {st.num}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isHighlight ? 'text-[#191c1f] font-extrabold' : 'text-[#5f5e5e]'
                      }`}>
                        {st.stageTag}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold text-[#191c1f] mt-1 leading-snug ${isHighlight ? 'text-[#092100]' : ''}`}>
                      {st.title}
                    </h3>

                    <p className="text-xs text-[#5f5e5e] leading-relaxed">
                      {st.desc}
                    </p>

                    <div className="mt-auto pt-3 border-t border-[#e0e2e6] flex items-center gap-1.5 text-xs font-semibold text-[#191c1f]">
                      <Check className="w-3.5 h-3.5 text-[#2e6c00]" />
                      <span>{st.checkTag}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metric Footer for Progress */}
            <div className="mt-8 pt-6 border-t border-[#e0e2e6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f2f4f8] flex items-center justify-center shrink-0 text-[#2e6c00]">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#191c1f] block">
                    {journeyContent.metricFooter?.title || "Continuous Benchmarking Engine"}
                  </span>
                  <span className="text-xs text-[#5f5e5e]">
                    {journeyContent.metricFooter?.desc || "Students completing Stage 3 achieve an 84% shortlist rate in TantraPex drives."}
                  </span>
                </div>
              </div>

              <a 
                href={journeyContent.metricFooter?.linkUrl || "#/upcoming-drives"}
                className="text-xs sm:text-sm font-bold text-[#191c1f] hover:text-[#2e6c00] underline underline-offset-4 transition-colors"
              >
                {journeyContent.metricFooter?.linkText || "View Current Screening Thresholds"}
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECTION 4: COLLABORATION DETAILS */}
      <section className={`w-full bg-[#f2f4f8] py-16 lg:py-20 border-b border-[#e0e2e6] ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-10 lg:p-12 rounded-2xl border border-[#e0e2e6] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (8 cols): Descriptions & 2 Cards */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f2f4f8] rounded-md w-fit border border-[#e0e2e6]">
                  <Handshake className="w-4 h-4 text-[#2e6c00]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1f]">
                    {collaborationContent.badgeText || "Transparent Partnership Framework"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] leading-snug">
                  {collaborationSection.title || "Institutional Division of Responsibilities"}
                </h2>

                <p className="text-xs sm:text-sm text-[#191c1f] leading-relaxed">
                  {collaborationSection.subtitle || "TantraPex Technologies and UG Skill work together to make placement preparation affordable and accessible to every student. UG Skill powers the learning management software, while TantraPex coordinates placement drives with hiring companies."}
                </p>

                {/* 2 Partition Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#f2f4f8] rounded-lg border border-[#e0e2e6]">
                    <span className="text-xs sm:text-sm font-bold text-[#191c1f] block mb-1">
                      {collaborationContent.card1?.title || "UG Skill (NexisparkX)"}
                    </span>
                    <p className="text-xs text-[#5f5e5e] leading-relaxed">
                      {collaborationContent.card1?.desc || "Powers the LMS engine, cloud coding sandboxes, aptitude item banks, and self-paced video hosting."}
                    </p>
                  </div>

                  <div className="p-4 bg-[#f2f4f8] rounded-lg border border-[#e0e2e6]">
                    <span className="text-xs sm:text-sm font-bold text-[#191c1f] block mb-1">
                      {collaborationContent.card2?.title || "TantraPex Technologies"}
                    </span>
                    <p className="text-xs text-[#5f5e5e] leading-relaxed">
                      {collaborationContent.card2?.desc || "Operates India's first private placement cell, company outreach, drive scheduling, and student shortlisting."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Governance Standard */}
              <div className="lg:col-span-4 bg-[#f2f4f8] p-6 rounded-xl border border-[#e0e2e6] flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f5e5e]">
                  {collaborationContent.governanceStandard?.title || "Governance Standard"}
                </span>

                <div className="flex flex-col gap-3">
                  {(collaborationContent.governanceStandard?.bullets || DEFAULT_LMS_SECTIONS[4].content.governanceStandard.bullets).map((bullet: string, bIdx: number) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#2e6c00] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#191c1f] leading-snug">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#e0e2e6]">
                  <span className="text-[11px] text-[#5f5e5e]">
                    {collaborationContent.governanceStandard?.entityNote || "Affiliated entity: NexisparkX"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: CTA SECTION */}
      <section className={`w-full bg-white py-16 lg:py-20 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#191c1f] text-white p-8 sm:p-12 lg:p-14 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-slate-800">
            
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-[10px] uppercase tracking-wider text-[#80d64b] font-bold">
                {ctaContent.tag || "Structured Career Readiness"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {ctaSection.title || "Ready to explore learning resources and start preparing?"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                {ctaSection.subtitle || "Join hundreds of engineering colleges utilizing the TantraPex and UG Skill ecosystem for verified placement outcomes."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a 
                href={ctaContent.primaryBtnLink || "#/pricing"}
                className="w-full sm:w-auto px-6 py-3 bg-[#80d64b] hover:bg-[#72c240] text-[#092100] text-xs sm:text-sm rounded-lg font-bold text-center transition-colors shadow-md hover:shadow"
              >
                {ctaContent.primaryBtnText || "Explore Career Pro Plan"}
              </a>
              <a 
                href={ctaContent.secondaryBtnLink || "#/upcoming-drives"}
                className="w-full sm:w-auto px-6 py-3 bg-white text-[#191c1f] hover:bg-slate-100 text-xs sm:text-sm rounded-lg font-bold text-center transition-colors border border-slate-300"
              >
                {ctaContent.secondaryBtnText || "View Upcoming Drives"}
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
