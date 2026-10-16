import React from 'react';
import { CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost, Lead } from '../../types';
import { DEFAULT_ABOUT_SECTIONS } from '../../lib/defaultAbout';
import {
  ShieldCheck,
  Flag,
  Sliders,
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Award,
  CheckCircle2,
  Users
} from 'lucide-react';

interface PublicAboutPageProps {
  page: CMSPage;
  settings?: GlobalSettings;
  placedStudents?: PlacedStudent[];
  hiringPartners?: HiringPartner[];
  courses?: Course[];
  blogs?: BlogPost[];
  onAddLead?: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  isVisualMode?: boolean;
}

export default function PublicAboutPage({
  page,
  settings,
  onEditField,
  isVisualMode = false
}: PublicAboutPageProps) {
  const navigateTo = (target: string) => {
    if (target.startsWith('#') && !target.startsWith('#/')) {
      try {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } catch {}
    }
    const clean = (target || '').replace(/^[#/]+/, '').trim();
    const cleanTarget = clean === '' || clean === 'home' ? '#/' : `#/${clean}`;
    window.location.hash = cleanTarget;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to get section with default fallback
  const getSection = (type: string, fallbackIdx: number) => {
    return page?.sections?.find(s => s.type === type) || DEFAULT_ABOUT_SECTIONS[fallbackIdx];
  };

  // Section 1: Hero
  const heroSection = getSection('about-hero', 0);
  const heroContent = heroSection.content || {};

  // Section 2: Mission & Approach
  const missionSection = getSection('about-mission-approach', 1);
  const missionContent = missionSection.content || {};

  // Section 3: Ecosystem (Students, Colleges, Companies)
  const ecosystemSection = getSection('about-ecosystem', 2);
  const ecosystemContent = ecosystemSection.content || {};
  const pillars: any[] = Array.isArray(ecosystemContent.pillars) && ecosystemContent.pillars.length > 0
    ? ecosystemContent.pillars
    : DEFAULT_ABOUT_SECTIONS[2].content.pillars;

  // Section 4: Leadership & Team
  const teamSection = getSection('about-team', 3);
  const teamContent = teamSection.content || {};
  const teamStats: any[] = Array.isArray(teamContent.stats) && teamContent.stats.length > 0
    ? teamContent.stats
    : DEFAULT_ABOUT_SECTIONS[3].content.stats;

  // Section 5: Core Values
  const valuesSection = getSection('about-values', 4);
  const valuesContent = valuesSection.content || {};
  const coreValues: any[] = Array.isArray(valuesContent.values) && valuesContent.values.length > 0
    ? valuesContent.values
    : DEFAULT_ABOUT_SECTIONS[4].content.values;

  // Section 6: CTA Banner
  const ctaSection = getSection('about-cta', 5);
  const ctaContent = ctaSection.content || {};

  // Editable click handler helper
  const handleEditable = (sectionId: string, fieldPath: string, currentVal: any) => (e: React.MouseEvent) => {
    if (isVisualMode && onEditField) {
      e.stopPropagation();
      onEditField(sectionId, fieldPath, currentVal);
    }
  };

  const editableClass = isVisualMode ? 'hover:outline-dashed hover:outline-2 hover:outline-blue-500 cursor-pointer transition-all' : '';

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-['Inter',sans-serif] antialiased">
      {/* 1. Breadcrumb Strip */}
      <section className="w-full bg-white border-b border-[#e0e2e6]/60">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#5f5e5e]">
            <button
              onClick={() => navigateTo('#/home')}
              className="hover:text-[#191c1f] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#5c5f5e]" />
            <span className="text-[#191c1f] font-bold">About Us</span>
          </nav>
        </div>
      </section>

      {/* 2. Editorial Header (Precision Corporate Anchor) */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div
                onClick={handleEditable(heroSection.id, 'content.badgeText', heroContent.badgeText || 'WHO WE ARE')}
                className={`inline-flex items-center gap-2 bg-[#eceef2] px-3 py-1 rounded w-fit ${editableClass}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
                <span className="text-[10px] font-bold text-[#191c1f] uppercase tracking-widest font-['Plus_Jakarta_Sans',sans-serif]">
                  {heroContent.badgeText || 'WHO WE ARE'}
                </span>
              </div>

              <h1
                onClick={handleEditable(heroSection.id, 'title', heroSection.title || 'About TantraPex')}
                className={`text-3xl sm:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#191c1f] tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
              >
                {heroSection.title || 'About TantraPex'}
              </h1>

              <p
                onClick={handleEditable(heroSection.id, 'subtitle', heroSection.subtitle || heroContent.description)}
                className={`text-base sm:text-lg text-[#5f5e5e] max-w-3xl leading-relaxed ${editableClass}`}
              >
                {heroSection.subtitle || heroContent.description || "TantraPex Technologies is India's first private placement cell. We help college students learn industry skills, clear aptitude tests, and get placed in leading technology companies — completely free of cost."}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="bg-white p-6 rounded-lg border border-[#e0e2e6] shadow-sm flex flex-col gap-2.5">
                <span
                  onClick={handleEditable(heroSection.id, 'content.statusTag', heroContent.statusTag || 'Cell Status & Policy')}
                  className={`text-[10px] font-bold text-[#5f5e5e] uppercase tracking-widest ${editableClass}`}
                >
                  {heroContent.statusTag || 'Cell Status & Policy'}
                </span>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-[#2e6c00] shrink-0" />
                  <span
                    onClick={handleEditable(heroSection.id, 'content.statusTitle', heroContent.statusTitle || '100% Free For Students')}
                    className={`text-lg font-bold text-[#191c1f] font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                  >
                    {heroContent.statusTitle || '100% Free For Students'}
                  </span>
                </div>

                <p
                  onClick={handleEditable(heroSection.id, 'content.statusDesc', heroContent.statusDesc)}
                  className={`text-xs text-[#5f5e5e] leading-relaxed ${editableClass}`}
                >
                  {heroContent.statusDesc || 'Zero registration charges. Zero security deposits. Pure merit-driven campus hiring.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Approach (2 Structural Monochrome Panes) */}
      <section className="w-full pb-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-lg border border-[#e0e2e6] shadow-sm flex flex-col justify-between group hover:bg-[#f2f4f8] transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded bg-[#eceef2] flex items-center justify-center">
                  <Flag className="w-6 h-6 text-[#191c1f]" />
                </div>
                <span
                  onClick={handleEditable(missionSection.id, 'content.missionTag', missionContent.missionTag || 'Institutional Mandate')}
                  className={`text-xs font-bold text-[#5f5e5e] uppercase tracking-wider ${editableClass}`}
                >
                  {missionContent.missionTag || 'Institutional Mandate'}
                </span>
                <h2
                  onClick={handleEditable(missionSection.id, 'content.missionTitle', missionContent.missionTitle || 'Our Mission')}
                  className={`text-2xl font-bold text-[#191c1f] font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                >
                  {missionContent.missionTitle || 'Our Mission'}
                </h2>
                <p
                  onClick={handleEditable(missionSection.id, 'content.missionDesc', missionContent.missionDesc)}
                  className={`text-base text-[#5f5e5e] leading-relaxed ${editableClass}`}
                >
                  {missionContent.missionDesc || 'Our mission is to make college campus hiring fair, transparent, and accessible to every student, no matter which college they study in.'}
                </p>
              </div>

              <div className="pt-8 mt-6 flex items-center gap-2 text-[#191c1f] font-semibold text-sm">
                <span
                  onClick={handleEditable(missionSection.id, 'content.missionFooter', missionContent.missionFooter)}
                  className={editableClass}
                >
                  {missionContent.missionFooter || 'Democratizing Placement Infrastructure'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#191c1f] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Approach Card */}
            <div className="bg-white p-8 rounded-lg border border-[#e0e2e6] shadow-sm flex flex-col justify-between group hover:bg-[#f2f4f8] transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded bg-[#80d64b] flex items-center justify-center">
                  <Sliders className="w-6 h-6 text-[#092100]" />
                </div>
                <span
                  onClick={handleEditable(missionSection.id, 'content.approachTag', missionContent.approachTag || 'Execution Pipeline')}
                  className={`text-xs font-bold text-[#5f5e5e] uppercase tracking-wider ${editableClass}`}
                >
                  {missionContent.approachTag || 'Execution Pipeline'}
                </span>
                <h2
                  onClick={handleEditable(missionSection.id, 'content.approachTitle', missionContent.approachTitle || 'Our Approach')}
                  className={`text-2xl font-bold text-[#191c1f] font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                >
                  {missionContent.approachTitle || 'Our Approach'}
                </h2>
                <p
                  onClick={handleEditable(missionSection.id, 'content.approachDesc', missionContent.approachDesc)}
                  className={`text-base text-[#5f5e5e] leading-relaxed ${editableClass}`}
                >
                  {missionContent.approachDesc || 'We bridge the gap between college education and corporate job requirements with practical training and verified hiring drives.'}
                </p>
              </div>

              <div className="pt-8 mt-6 flex items-center gap-2 text-[#191c1f] font-semibold text-sm">
                <span
                  onClick={handleEditable(missionSection.id, 'content.approachFooter', missionContent.approachFooter)}
                  className={editableClass}
                >
                  {missionContent.approachFooter || 'Rigorous Skill-First Assessments'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#191c1f] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How We Support Students & Colleges (3 Visual Columns) */}
      <section className="w-full py-16 bg-[#f2f4f8] border-y border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2">
              <span
                onClick={handleEditable(ecosystemSection.id, 'content.tag', ecosystemContent.tag || 'Ecosystem Architecture')}
                className={`text-xs font-bold text-[#5f5e5e] uppercase tracking-widest ${editableClass}`}
              >
                {ecosystemContent.tag || 'Ecosystem Architecture'}
              </span>
              <h2
                onClick={handleEditable(ecosystemSection.id, 'title', ecosystemSection.title || 'How We Support Students & Colleges')}
                className={`text-2xl sm:text-3xl font-extrabold text-[#191c1f] font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
              >
                {ecosystemSection.title || 'How We Support Students & Colleges'}
              </h2>
            </div>
            <p
              onClick={handleEditable(ecosystemSection.id, 'subtitle', ecosystemSection.subtitle)}
              className={`text-sm text-[#5f5e5e] max-w-md leading-relaxed ${editableClass}`}
            >
              {ecosystemSection.subtitle || 'A synchronized tripartite framework aligning learners, degree colleges, and corporate talent recruiters.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar: any, idx: number) => {
              const IconComponent = pillar.icon === 'school'
                ? GraduationCap
                : pillar.icon === 'domain'
                ? Building2
                : Briefcase;

              return (
                <div
                  key={pillar.id || idx}
                  className="bg-white p-6 rounded-lg border border-[#e0e2e6] shadow-sm flex flex-col justify-between h-full"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span
                        onClick={handleEditable(ecosystemSection.id, `content.pillars.${idx}.tag`, pillar.tag)}
                        className={`text-[10px] font-bold px-2.5 py-1 bg-[#eceef2] rounded text-[#191c1f] tracking-wider uppercase ${editableClass}`}
                      >
                        {pillar.tag || `0${idx + 1} // PILLAR`}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#eceef2] flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-[#191c1f]" />
                      </div>
                    </div>

                    <h3
                      onClick={handleEditable(ecosystemSection.id, `content.pillars.${idx}.title`, pillar.title)}
                      className={`text-lg font-bold text-[#191c1f] mb-2.5 font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      onClick={handleEditable(ecosystemSection.id, `content.pillars.${idx}.desc`, pillar.desc)}
                      className={`text-sm text-[#5f5e5e] leading-relaxed mb-6 ${editableClass}`}
                    >
                      {pillar.desc}
                    </p>

                    <ul className="flex flex-col gap-2.5 text-xs text-[#5f5e5e]">
                      {Array.isArray(pillar.features) && pillar.features.map((feat: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#80d64b] shrink-0"></span>
                          <span
                            onClick={handleEditable(ecosystemSection.id, `content.pillars.${idx}.features.${fIdx}`, feat)}
                            className={editableClass}
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#e0e2e6]/40">
                    <button
                      onClick={() => navigateTo(pillar.btnLink || '#/upcoming-drives')}
                      className="text-sm text-[#191c1f] font-bold inline-flex items-center gap-1 hover:text-[#2e6c00] transition-colors cursor-pointer"
                    >
                      <span
                        onClick={handleEditable(ecosystemSection.id, `content.pillars.${idx}.btnText`, pillar.btnText)}
                        className={editableClass}
                      >
                        {pillar.btnText || 'Learn More'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Leadership & Team Section */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg border border-[#e0e2e6] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Photo Column */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <div className="relative overflow-hidden rounded-lg bg-[#e6e8ec] h-80 sm:h-96 w-full shadow-inner">
                  <img
                    src={teamContent.teamImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGnBotQ4plh1jB4kWGqsakBM7rnHf8HjGwSDbxGJYWGorSdq3kOzzihI4IXSnyxBdp9LqYgrhKbiEPabVGo8e9cqNd8pb6jOwfgy1buIcahtdMLF2D3At-fIXmvbozq9NfokrRMeG4v_md5qaAga5YEjN5bHyZuyLRvPcrf_A_mOWWTuj5mUWpDJoai9jM4Edu5NcFo27NOV3ZuL2j3sfV0MpH6Zv7h-0A9bUt96Vfq-fRKA90m5_GBw"}
                    alt="Leadership Team"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#191c1f]/90 text-white p-3 flex items-center justify-between backdrop-blur-sm">
                    <span
                      onClick={handleEditable(teamSection.id, 'content.imageBadge', teamContent.imageBadge || 'TantraPex Advisory & Operations Cell')}
                      className={`text-xs uppercase tracking-wide font-bold ${editableClass}`}
                    >
                      {teamContent.imageBadge || 'TantraPex Advisory & Operations Cell'}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#80d64b]" />
                  </div>
                </div>
                <p
                  onClick={handleEditable(teamSection.id, 'content.imageCaption', teamContent.imageCaption)}
                  className={`text-xs text-[#5f5e5e] italic mt-1 ${editableClass}`}
                >
                  {teamContent.imageCaption || 'Leadership / Team Representative — Committed to Candidate Success'}
                </p>
              </div>

              {/* Text Editorial Column */}
              <div className="lg:col-span-7 flex flex-col justify-center gap-4 lg:pl-6">
                <div
                  onClick={handleEditable(teamSection.id, 'content.tag', teamContent.tag || 'Experienced Governance')}
                  className={`inline-flex items-center gap-2 bg-[#eceef2] px-3 py-1 rounded w-fit ${editableClass}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1f]">
                    {teamContent.tag || 'Experienced Governance'}
                  </span>
                </div>

                <h2
                  onClick={handleEditable(teamSection.id, 'title', teamSection.title || 'Our Leadership & Team')}
                  className={`text-2xl sm:text-3xl font-extrabold text-[#191c1f] font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                >
                  {teamSection.title || 'Our Leadership & Team'}
                </h2>

                <p
                  onClick={handleEditable(teamSection.id, 'content.heading', teamContent.heading)}
                  className={`text-base sm:text-lg text-[#191c1f] leading-relaxed font-semibold ${editableClass}`}
                >
                  {teamContent.heading || 'Our team consists of senior technical trainers, career counselors, and corporate talent acquisition leaders working together to empower young engineers across India.'}
                </p>

                <p
                  onClick={handleEditable(teamSection.id, 'content.description', teamContent.description)}
                  className={`text-sm text-[#5f5e5e] leading-relaxed ${editableClass}`}
                >
                  {teamContent.description || 'With over 35 cumulative years across tech hiring, curriculum design, and engineering staffing at leading software enterprises, we build standardized programs that eliminate arbitrary recruitment hurdles. We believe employment access should be based purely on verified aptitude and problem-solving skill, not regional boundaries or institutional tier labels.'}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  {teamStats.map((st: any, idx: number) => (
                    <div key={st.id || idx} className="bg-[#f2f4f8] p-4 rounded border border-[#e0e2e6]/60">
                      <span
                        onClick={handleEditable(teamSection.id, `content.stats.${idx}.value`, st.value)}
                        className={`text-xl sm:text-2xl font-extrabold text-[#191c1f] block font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                      >
                        {st.value}
                      </span>
                      <span
                        onClick={handleEditable(teamSection.id, `content.stats.${idx}.label`, st.label)}
                        className={`text-xs text-[#5f5e5e] ${editableClass}`}
                      >
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our 5 Core Values */}
      <section className="w-full py-16 bg-white border-y border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col gap-2 mb-12">
            <span
              onClick={handleEditable(valuesSection.id, 'content.tag', valuesContent.tag || 'Guiding Principles')}
              className={`text-xs font-bold text-[#5f5e5e] uppercase tracking-widest ${editableClass}`}
            >
              {valuesContent.tag || 'Guiding Principles'}
            </span>
            <h2
              onClick={handleEditable(valuesSection.id, 'title', valuesSection.title || 'Our 5 Core Values')}
              className={`text-2xl sm:text-3xl font-extrabold text-[#191c1f] font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
            >
              {valuesSection.title || 'Our 5 Core Values'}
            </h2>
            <p
              onClick={handleEditable(valuesSection.id, 'subtitle', valuesSection.subtitle)}
              className={`text-sm text-[#5f5e5e] max-w-xl leading-relaxed ${editableClass}`}
            >
              {valuesSection.subtitle || 'The non-negotiable institutional tenets that guide every assessment, student counseling session, and corporate partnership.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((val: any, idx: number) => (
              <div
                key={val.id || idx}
                className="bg-[#f7f9fd] p-6 rounded-lg border border-[#e0e2e6] shadow-sm flex flex-col justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span
                    onClick={handleEditable(valuesSection.id, `content.values.${idx}.number`, val.number)}
                    className={`text-2xl font-black ${idx === 0 ? 'text-[#2e6c00]' : 'text-[#191c1f]'} font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                  >
                    {val.number || `0${idx + 1}`}
                  </span>
                  <h3
                    onClick={handleEditable(valuesSection.id, `content.values.${idx}.title`, val.title)}
                    className={`text-base font-bold text-[#191c1f] mt-2 font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
                  >
                    {val.title}
                  </h3>
                  <p
                    onClick={handleEditable(valuesSection.id, `content.values.${idx}.desc`, val.desc)}
                    className={`text-xs text-[#5f5e5e] mt-1 leading-relaxed ${editableClass}`}
                  >
                    {val.desc}
                  </p>
                </div>
                <div className={`w-8 h-1 ${idx === 0 ? 'bg-[#191c1f]' : 'bg-[#e0e2e6]'} mt-6`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="w-full py-16 bg-[#eceef2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white p-8 md:p-12 rounded-lg border border-[#e0e2e6] shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-2.5 max-w-2xl">
              <div
                onClick={handleEditable(ctaSection.id, 'content.tag', ctaContent.tag || 'Immediate Institutional Access')}
                className={`inline-flex items-center gap-2 ${editableClass}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#80d64b]"></span>
                <span className="text-xs font-bold text-[#191c1f] uppercase tracking-wider">
                  {ctaContent.tag || 'Immediate Institutional Access'}
                </span>
              </div>

              <h2
                onClick={handleEditable(ctaSection.id, 'title', ctaSection.title || 'Have questions or want to partner with us? Talk to our team today.')}
                className={`text-2xl sm:text-3xl font-extrabold text-[#191c1f] tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${editableClass}`}
              >
                {ctaSection.title || 'Have questions or want to partner with us? Talk to our team today.'}
              </h2>

              <p
                onClick={handleEditable(ctaSection.id, 'subtitle', ctaSection.subtitle)}
                className={`text-sm text-[#5f5e5e] leading-relaxed ${editableClass}`}
              >
                {ctaSection.subtitle || 'Whether you are a student preparing for campus recruitments, a training placement officer seeking industry drives, or a corporate talent lead hiring engineers.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => navigateTo(ctaContent.primaryBtnLink || '#/contact')}
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#80d64b] hover:bg-[#a0f969] text-[#092100] text-sm rounded font-bold transition-colors shadow-sm cursor-pointer"
              >
                <span
                  onClick={handleEditable(ctaSection.id, 'content.primaryBtnText', ctaContent.primaryBtnText || 'Contact Us')}
                  className={editableClass}
                >
                  {ctaContent.primaryBtnText || 'Contact Us'}
                </span>
              </button>

              <button
                onClick={() => navigateTo(ctaContent.secondaryBtnLink || '#/upcoming-drives')}
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#191c1f] hover:bg-[#2d3134] text-white text-sm rounded font-bold transition-colors shadow-sm cursor-pointer"
              >
                <span
                  onClick={handleEditable(ctaSection.id, 'content.secondaryBtnText', ctaContent.secondaryBtnText || 'Explore Drives')}
                  className={editableClass}
                >
                  {ctaContent.secondaryBtnText || 'Explore Drives'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
