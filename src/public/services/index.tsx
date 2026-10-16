import React from 'react';
import { CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost, Lead, Service } from '../../types';
import { DEFAULT_SERVICES_SECTIONS } from '../../lib/defaultServices';
import {
  FileText,
  Share2,
  Calculator,
  Terminal,
  Mic,
  Brain,
  MessageSquare,
  Compass,
  Briefcase,
  Building2,
  BookOpen,
  Award,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Send,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface PublicServicesPageProps {
  page: CMSPage;
  settings?: GlobalSettings;
  placedStudents?: PlacedStudent[];
  hiringPartners?: HiringPartner[];
  courses?: Course[];
  blogs?: BlogPost[];
  allServices?: Service[];
  onAddLead?: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  isVisualMode?: boolean;
}

// Map string icon names to Lucide icon components
const iconMap: Record<string, React.ElementType> = {
  FileText,
  Share2,
  Calculator,
  Terminal,
  Mic,
  Brain,
  MessageSquare,
  Compass,
  Briefcase,
  Building2,
  BookOpen,
  Award,
  GraduationCap,
  HelpCircle,
  Send,
  CheckCircle2
};

export default function PublicServicesPage({
  page,
  onEditField,
  isVisualMode = false
}: PublicServicesPageProps) {
  const sections = (page.sections && page.sections.length > 0 && page.sections.some(s => s.type.startsWith('services-')))
    ? page.sections
    : DEFAULT_SERVICES_SECTIONS;

  const heroSec = sections.find(s => s.type === 'services-hero') || DEFAULT_SERVICES_SECTIONS[0];
  const spotlightSec = sections.find(s => s.type === 'services-spotlight') || DEFAULT_SERVICES_SECTIONS[1];
  const pillarsSec = sections.find(s => s.type === 'services-pillars') || DEFAULT_SERVICES_SECTIONS[2];
  const processSec = sections.find(s => s.type === 'services-process') || DEFAULT_SERVICES_SECTIONS[3];
  const proofSec = sections.find(s => s.type === 'services-proof') || DEFAULT_SERVICES_SECTIONS[4];
  const ctaSec = sections.find(s => s.type === 'services-cta') || DEFAULT_SERVICES_SECTIONS[5];

  const heroContent = heroSec.content || {};
  const spotlightContent = spotlightSec.content || {};
  const pillarsContent = pillarsSec.content || {};
  const processContent = processSec.content || {};
  const proofContent = proofSec.content || {};
  const ctaContent = ctaSec.content || {};

  const pillarsList = pillarsContent.pillars || [];
  const stepsList = processContent.steps || [];
  const proofCards = proofContent.cards || [];
  const tracker = processContent.tracker || {};
  const telemetry = heroContent.telemetry || {};
  const telemetryStats = telemetry.stats || [];

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans select-text">

      {/* 1. BREADCRUMBS & CONTEXT */}
      <section className="w-full bg-white border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5f5e5e]">
            <a href="#/" className="hover:text-[#191c1f] transition-colors">
              {heroContent.breadcrumbHome || 'Home'}
            </a>
            <ChevronRight className="h-3.5 w-3.5 text-[#707a67]" />
            <span className="text-[#191c1f] font-bold">
              {heroContent.breadcrumbCurrent || 'Our Services'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL TOP HEADER & TELEMETRY BLOCK */}
      <section className="w-full bg-white pb-14 pt-8 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Header Narrative */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eceef2] rounded-md w-fit">
                <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#191c1f] font-mono">
                  {heroContent.badgeText || 'WHAT WE OFFER'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191c1f] tracking-tight font-display leading-[1.15]">
                {heroSec.title || 'Career Preparation & Placement Support Services'}
              </h1>

              <p className="text-base sm:text-lg text-[#5f5e5e] max-w-2xl leading-relaxed mt-1">
                {heroSec.subtitle || 'We offer complete training and placement support to help you build confidence, master technical skills, and clear company interviews.'}
              </p>
            </div>

            {/* Right Telemetry / KPI Card */}
            <div className="lg:col-span-4 bg-[#f2f4f8] p-6 rounded-2xl border border-[#e0e2e6] flex flex-col justify-between gap-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f5e5e] font-mono">
                  {telemetry.standardLabel || 'Student Impact Standard'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#092100] bg-[#80d64b] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{telemetry.isoBadge || 'ISO 9001:2015'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-[#e0e2e6]/70">
                {telemetryStats.map((st: any, idx: number) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] font-display">
                      {st.value}
                    </span>
                    <span className="text-xs text-[#5f5e5e] font-medium mt-0.5">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VISUAL SPOTLIGHT BANNER: BRIDGE TO ARCHITECTURE GRID */}
      <section className="w-full bg-[#eceef2] py-14 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5f5e5e] font-mono">
                {spotlightContent.eyebrow || 'ENGINEERED FOR EMPLOYABILITY'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] font-display leading-tight">
                {spotlightSec.title || 'Structured from campus benchmark to final offer letter'}
              </h2>

              <p className="text-sm sm:text-base text-[#5f5e5e] leading-relaxed">
                {spotlightSec.subtitle || 'Our 12 service pillars eliminate guesswork. Students master each screening parameter through standardized evaluations, live corporate mentorship, and audited skill rubrics.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                {(spotlightContent.checkpoints || ['Audited ATS Formats', 'Real-world Code Labs']).map((cp: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e0e2e6] shadow-xs">
                    <CheckCircle className="h-4 w-4 text-[#2e6c00]" />
                    <span className="text-xs font-bold text-[#191c1f]">{cp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Photography Card with Floating Telemetry Ribbon */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl shadow-md border border-[#e0e2e6] group">
                <img
                  src={spotlightContent.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM6uN0oQY4yvtVPuxP0VGkbxEKyoAtuYv_sAsENmliqtqUO-8pyJWjhhOWoZAplS77kHxJkq1ATbUUXxjvtku0bDAdXIvAiUUK3v7Mw_uCcWIvi7LXeL94KUnQ4GFeAeXSjJgFjh8vlFjQsS62eC08WK5xCD-TWy69bUR_hOuSWrNfxvJw-PrfxuWH7lYlUeWHIHvNaXu1Il7aYlGVtK24n-9h-t6NaFUfyIeTBv9i8ARB8H_30sslOQ'}
                  alt={spotlightContent.imageAlt || 'Students collaborating on code terminals'}
                  className="w-full h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* Floating bottom status ribbon */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[#e0e2e6]">
                  <div className="flex items-center gap-2 text-[#191c1f]">
                    <Cpu className="h-4 w-4 text-[#2e6c00]" />
                    <span className="text-xs font-bold tracking-tight">
                      {spotlightContent.engineBadgeText || 'TantraPex Assessment Engine V3.4 Active'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5f5e5e] font-mono">
                    {spotlightContent.benchmarkText || 'Real-Time Recruiter Benchmarks'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. 12 PLACEMENT PREPARATION MODULES (3-COLUMN RESPONSIVE GRID) */}
      <section className="w-full bg-[#f7f9fd] py-20 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f5e5e] font-mono">
                {pillarsContent.eyebrow || 'SYSTEMATIC CURRICULUM'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1f] font-display mt-1">
                {pillarsSec.title || '12 Placement Preparation Modules'}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#5f5e5e] max-w-md leading-relaxed">
              {pillarsSec.subtitle || 'Explore each track to see how we transform college graduates into hire-ready engineering and business talent.'}
            </p>
          </div>

          {/* 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillarsList.map((pillar: any, idx: number) => {
              const IconComp = iconMap[pillar.icon] || FileText;

              return (
                <div
                  key={pillar.id || idx}
                  className="bg-white p-7 rounded-2xl border border-[#e0e2e6] shadow-xs hover:shadow-md hover:border-[#80d64b] transition-all flex flex-col justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#eceef2] group-hover:bg-[#80d64b]/20 flex items-center justify-center text-[#191c1f] group-hover:text-[#2e6c00] transition-colors">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-extrabold text-[#707a67] uppercase tracking-widest font-mono">
                        {pillar.pillarNumber || `Pillar ${String(idx + 1).padStart(2, '0')}`}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#191c1f] font-display mb-2 group-hover:text-[#2e6c00] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#e0e2e6]/70 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#5f5e5e]">
                      Format: <strong className="text-[#191c1f]">{pillar.format}</strong>
                    </span>

                    <a
                      href={pillar.linkUrl || '#/contact'}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#191c1f] hover:text-[#2e6c00] transition-colors"
                    >
                      <span>{pillar.linkText || 'Learn More'}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS: 4-STEP LINEAR PROCESS */}
      <section className="w-full bg-white py-20 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="flex flex-col mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f5e5e] font-mono">
              {processContent.eyebrow || 'CLEAR CANDIDATE ROADMAP'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1f] font-display mt-1">
              {processSec.title || 'How It Works'}
            </h2>
            <p className="text-sm sm:text-base text-[#5f5e5e] max-w-xl mt-2 leading-relaxed">
              {processSec.subtitle || 'A four-step linear workflow engineered to take any ambitious college student from foundational review to a corporate appointment letter.'}
            </p>
          </div>

          {/* 4 Steps Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsList.map((st: any, idx: number) => {
              const IconComponent = iconMap[st.icon] || GraduationCap;
              const isHighlight = st.isHighlighted;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl flex flex-col justify-between min-h-[240px] border transition-all ${
                    isHighlight
                      ? 'bg-[#f7f9fd] border-[#80d64b] shadow-sm'
                      : 'bg-[#f2f4f8] border-[#e0e2e6] hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-display text-sm ${
                          isHighlight
                            ? 'bg-[#80d64b] text-[#092100]'
                            : 'bg-[#191c1f] text-white'
                        }`}
                      >
                        {st.stepNumber || idx + 1}
                      </span>
                      <IconComponent
                        className={`h-5 w-5 ${
                          isHighlight ? 'text-[#2e6c00]' : 'text-[#5f5e5e]'
                        }`}
                      />
                    </div>

                    <h3 className="text-base font-bold text-[#191c1f] font-display mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-[#5f5e5e] leading-relaxed">
                      {st.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-2 border-t border-[#e0e2e6]/60 mt-4">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isHighlight ? 'bg-[#2e6c00]' : 'bg-[#80d64b]'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-[#191c1f] font-mono">
                      {st.stageLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quantitative Placement Timeline Tracker Banner */}
          <div className="mt-10 bg-[#eceef2] p-6 sm:p-8 rounded-2xl border border-[#e0e2e6] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#80d64b] flex items-center justify-center text-[#092100] shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-[#191c1f] font-display">
                  {tracker.title || 'Fast-Track Readiness Window'}
                </span>
                <span className="text-xs sm:text-sm text-[#5f5e5e] mt-0.5">
                  {tracker.subtitle || 'Average duration from Day 1 assessment to first shortlisted drive: 45 Days'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={tracker.buttonUrl || '#/workshops'}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#191c1f] text-xs font-bold rounded-xl border border-[#e0e2e6] hover:bg-[#191c1f] hover:text-white transition-all shadow-xs"
              >
                {tracker.buttonText || 'Check Workshop Schedule'}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PHOTO PROOF SECTION: AUDITORIUM TRAINING & 1-ON-1 PANEL */}
      <section className="w-full bg-[#f7f9fd] py-16 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {proofCards.map((card: any, idx: number) => (
              <div
                key={card.id || idx}
                className="overflow-hidden rounded-2xl shadow-sm border border-[#e0e2e6] bg-white flex flex-col group"
              >
                <div className="h-72 sm:h-80 overflow-hidden relative">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 bg-white flex flex-col gap-1.5 border-t border-[#e0e2e6]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#707a67] font-mono">
                    {card.tag}
                  </span>
                  <h4 className="text-lg font-bold text-[#191c1f] font-display">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER SECTION */}
      <section className="w-full bg-white py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="bg-[#f2f4f8] p-8 sm:p-12 md:p-16 rounded-3xl border border-[#e0e2e6] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            
            <div className="flex flex-col max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#80d64b]"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f5e5e] font-mono">
                  {ctaContent.eyebrow || 'START YOUR JOURNEY TODAY'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1f] font-display tracking-tight">
                {ctaSec.title || 'Ready to start your placement preparation?'}
              </h2>

              <p className="text-base text-[#5f5e5e] mt-2">
                {ctaSec.subtitle || 'View our pricing plans or explore live drives.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto shrink-0">
              <a
                href={ctaContent.secondaryButtonUrl || '#/pricing'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#191c1f] text-sm font-bold rounded-xl border border-[#e0e2e6] hover:bg-[#eceef2] transition-colors shadow-xs text-center"
              >
                {ctaContent.secondaryButtonText || 'View Pricing'}
              </a>

              <a
                href={ctaContent.primaryButtonUrl || '#/upcoming-drives'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#80d64b] hover:bg-[#85dc50] text-[#092100] text-sm font-bold rounded-xl shadow-xs transition-colors text-center"
              >
                {ctaContent.primaryButtonText || 'Explore Drives'}
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
