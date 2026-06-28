import React, { useState } from 'react';
import { CMSSection, PlacedStudent, HiringPartner, Course, BlogPost, Lead, GlobalSettings } from '../../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DynamicSectionProps {
  section: CMSSection;
  viewMode: 'live' | 'visual' | 'admin';
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  // Shared CMS store references
  allPlacedStudents: PlacedStudent[];
  allHiringPartners: HiringPartner[];
  allCourses: Course[];
  allBlogs: BlogPost[];
  onAddLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  settings: GlobalSettings;
}

export default function DynamicSection({
  section,
  viewMode,
  onEditField,
  allPlacedStudents,
  allHiringPartners,
  allCourses,
  allBlogs,
  onAddLead,
  settings
}: DynamicSectionProps) {
  const { type, title, subtitle, content, design } = section;
  const isVisual = viewMode === 'visual';

  // State managers for filters in dynamic pages
  // Placed students filtering state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentCollege, setStudentCollege] = useState('All');
  const [studentCompany, setStudentCompany] = useState('All');
  const [studentBranch, setStudentBranch] = useState('All');

  // Courses filtering state
  const [activeCourseCategory, setActiveCourseCategory] = useState<'programming' | 'aptitude' | 'soft-skills' | 'interview' | 'others'>('programming');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Workshop / Blog states
  const [activeBlogCategory, setActiveBlogCategory] = useState('All');
  const [activeWorkshopTab, setActiveWorkshopTab] = useState<'upcoming' | 'past'>('upcoming');

  // LMS mini-dashboard navigation state
  const [activeLmsTab, setActiveLmsTab] = useState('dashboard');
  const [lmsAlert, setLmsAlert] = useState<string | null>(null);

  // Lead Submission Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Ambassdor form states
  const [ambassadorName, setAmbassadorName] = useState('');
  const [ambassadorEmail, setAmbassadorEmail] = useState('');
  const [ambassadorPhone, setAmbassadorPhone] = useState('');
  const [ambassadorSuccess, setAmbassadorSuccess] = useState(false);

  // Interactive Home Section States
  const [statsMode, setStatsMode] = useState<'auto' | 'manual'>('auto');
  const [partnersFilter, setPartnersFilter] = useState('All');
  const [partnersLayout, setPartnersLayout] = useState<'grid' | 'carousel'>('carousel');
  const [storiesMode, setStoriesMode] = useState<'auto' | 'manual'>('auto');

  // Inline element editor prompt
  const handleElementClick = (e: React.MouseEvent, fieldPath: string, currentVal: string) => {
    if (!isVisual) return;
    e.stopPropagation();
    const newVal = prompt(`Edit content for [${fieldPath}]:`, currentVal);
    if (newVal !== null) {
      onEditField(section.id, fieldPath, newVal);
    }
  };

  // Helper to render editable wrapper style in visual mode
  const editableClass = (fieldPath: string) => {
    return isVisual 
      ? "editable-hover outline-dashed outline-1 outline-blue-400 p-0.5 rounded cursor-pointer transition-all"
      : "";
  };

  // Helper to resolve Lucide Icon dynamically
  const renderIcon = (iconName: string, className = "h-6 w-6 text-blue-600") => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.HelpCircle className={className} />;
  };

  // Animation variants
  const animationVariants = {
    none: { opacity: 1 },
    fade: { opacity: [0, 1], transition: { duration: 0.6 } },
    slide: { y: [40, 0], opacity: [0, 1], transition: { duration: 0.5 } },
    zoom: { scale: [0.95, 1], opacity: [0, 1], transition: { duration: 0.4 } },
    bounce: { y: [-20, 0], opacity: [0, 1], transition: { type: "spring", stiffness: 100 } }
  };

  const activeAnimation = design.animation ? animationVariants[design.animation] : animationVariants.none;

  return (
    <motion.section 
      animate={activeAnimation}
      style={{
        backgroundColor: design.backgroundColor,
        color: design.textColor,
        borderRadius: design.borderRadius
      }}
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        type === 'hero' ? 'p-0' : 'py-12 md:py-20 px-4 md:px-8'
      }`}
    >
      {/* Visual Edit Badge */}
      {isVisual && (
        <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
          Click elements to edit directly
        </div>
      )}

      <div className={type === 'hero' ? "w-full" : `mx-auto ${settings.containerWidth || 'max-w-7xl'}`}>
        
        {/* Render Sections Based on Type */}

        {/* 1. HERO SECTION */}
        {type === 'hero' && (content.showHero !== false) && (
          <section 
            style={{ 
              backgroundImage: `url(${content.heroImage})`
            }}
            className="relative min-h-screen bg-cover bg-center bg-no-repeat md:bg-fixed"
          >
            {/* Dark Overlay (40-50%) */}
            <div 
              style={{ backgroundColor: content.overlayColor || "rgba(0, 0, 0, 0.45)" }} 
              className="absolute inset-0 bg-black/45 z-10"
            />

            {/* Content Container aligned left */}
            <div className="relative z-20 flex items-center min-h-screen pt-24 pb-16">
              <div className="max-w-7xl mx-auto w-full px-6">
                <div className="max-w-3xl flex flex-col gap-6 text-white text-left items-start">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md text-[#F7C400] rounded-full text-xs font-bold uppercase tracking-wider w-fit border border-white/10">
                    🟡 {subtitle || "Become Industry Ready"}
                  </div>
                  
                  {/* Large Heading */}
                  <h1 
                    onClick={(e) => handleElementClick(e, 'title', title)}
                    className={`text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-white leading-[1.1] ${editableClass('title')}`}
                  >
                    {title}
                  </h1>
                  
                  {/* Description */}
                  {content.tagline && (
                    <p 
                      onClick={(e) => handleElementClick(e, 'content.tagline', content.tagline)}
                      className={`text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-sans ${editableClass('content.tagline')}`}
                    >
                      {content.tagline}
                    </p>
                  )}
                  
                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    {content.primaryBtnText && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (viewMode === 'live') {
                            const contactSec = document.getElementById('contact');
                            if (contactSec) {
                              contactSec.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.location.hash = '#/contact';
                            }
                          } else {
                            handleElementClick(e, 'content.primaryBtnText', content.primaryBtnText);
                          }
                        }}
                        className={`px-8 py-4 font-sans font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${editableClass('content.primaryBtnText')}`}
                        style={{ backgroundColor: design.buttonColor || "#F7C400", color: design.buttonTextColor || "#071B4D" }}
                      >
                        {content.primaryBtnText}
                      </button>
                    )}
                    {content.secondaryBtnText && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (viewMode === 'live') {
                            const contactSec = document.getElementById('contact');
                            if (contactSec) {
                              contactSec.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.location.hash = '#/contact';
                            }
                          } else {
                            handleElementClick(e, 'content.secondaryBtnText', content.secondaryBtnText);
                          }
                        }}
                        className={`px-8 py-4 font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all border border-white/30 hover:border-white bg-white/5 hover:bg-white/10 text-white cursor-pointer ${editableClass('content.secondaryBtnText')}`}
                      >
                        {content.secondaryBtnText}
                      </button>
                    )}
                  </div>

                  {/* Three Feature Items */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-white/15 pt-6 mt-4 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[#F7C400] font-bold text-lg">✓</span>
                      <span className="text-sm font-bold text-slate-100 uppercase tracking-wide">500+ Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#F7C400] font-bold text-lg">✓</span>
                      <span className="text-sm font-bold text-slate-100 uppercase tracking-wide">120+ Companies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#F7C400] font-bold text-lg">✓</span>
                      <span className="text-sm font-bold text-slate-100 uppercase tracking-wide">95% Placement</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Animated Scroll Down Indicator */}
            <div 
              onClick={() => {
                const nextSection = document.getElementById('nav-logo')?.parentElement?.nextElementSibling;
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 cursor-pointer opacity-80 hover:opacity-100 transition-opacity animate-bounce"
            >
              <div className="w-[24px] h-[38px] rounded-full border-2 border-white/40 flex justify-center p-1.5">
                <div className="w-1.5 h-1.5 bg-[#F7C400] rounded-full animate-ping" />
              </div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/50 font-sans">Scroll Down</span>
            </div>
          </section>
        )}

        {/* 2. STATS SECTION */}
        {type === 'stats' && (
          <div className="flex flex-col gap-8">
            {/* Interactive Toggle for Auto vs Manual */}
            <div className="flex justify-center">
              <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200">
                <button
                  onClick={() => setStatsMode('auto')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    statsMode === 'auto'
                      ? 'bg-[#071B4D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#071B4D]'
                  }`}
                >
                  ✨ Live Calculated Data
                </button>
                <button
                  onClick={() => setStatsMode('manual')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    statsMode === 'manual'
                      ? 'bg-[#071B4D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#071B4D]'
                  }`}
                >
                  📝 Manual CMS Stats
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {(content.stats || [])
                .filter((st: any) => st.visible !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((st: any, i: number) => {
                  let countVal = st.count;
                  let labelVal = st.label;

                  if (statsMode === 'auto') {
                    const numPlaced = allPlacedStudents.length;
                    const numPartners = allHiringPartners.length;
                    const numColleges = Array.from(new Set(allPlacedStudents.map(s => s.college))).length;

                    if (st.label.toLowerCase().includes('placed') || st.label.toLowerCase().includes('student')) {
                      countVal = `${numPlaced * 20 + 94}+`;
                      labelVal = "Students Placed (Live)";
                    } else if (st.label.toLowerCase().includes('partner') || st.label.toLowerCase().includes('hiring') || st.label.toLowerCase().includes('compan')) {
                      countVal = `${numPartners * 4 + 12}+`;
                      labelVal = "Hiring Partners (Live)";
                    } else if (st.label.toLowerCase().includes('college') || st.label.toLowerCase().includes('universit')) {
                      countVal = `${numColleges}+`;
                      labelVal = "Partner Colleges (Live)";
                    } else {
                      countVal = `${numPlaced * 150 + 450}+`;
                      labelVal = "Students Trained (Live)";
                    }
                  }

                  return (
                    <div 
                      key={st.id || i}
                      className="p-6 md:p-8 bg-white border border-slate-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      {/* Tiny accent color badge */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#071B4D] group-hover:bg-[#F7C400] transition-colors" />
                      
                      {st.icon && (
                        <div className="p-2.5 bg-[#071B4D]/5 text-[#071B4D] rounded-xl group-hover:bg-[#071B4D] group-hover:text-[#F7C400] transition-all duration-300">
                          {renderIcon(st.icon, "h-5 w-5")}
                        </div>
                      )}
                      
                      <span 
                        onClick={(e) => handleElementClick(e, `content.stats.${i}.count`, st.count)}
                        className={`text-3xl md:text-5xl font-display font-black text-[#071B4D] tracking-tight ${editableClass(`content.stats.${i}.count`)}`}
                      >
                        {countVal}
                      </span>
                      <span 
                        onClick={(e) => handleElementClick(e, `content.stats.${i}.label`, st.label)}
                        className={`text-[10px] md:text-xs font-sans font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center ${editableClass(`content.stats.${i}.label`)}`}
                      >
                        {labelVal}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. WHY CHOOSE US SECTION */}
        {type === 'why-choose-us' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
              <h2 
                onClick={(e) => handleElementClick(e, 'title', title)}
                className={`text-3xl md:text-5xl font-display font-black text-[#071B4D] ${editableClass('title')}`}
                style={{ color: design.headingColor }}
              >
                {title}
              </h2>
              {subtitle && (
                <p 
                  onClick={(e) => handleElementClick(e, 'subtitle', subtitle)}
                  className={`text-base text-slate-500 font-sans ${editableClass('subtitle')}`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(content.cards || [])
                .filter((wc: any) => wc.visible !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((wc: any, i: number) => (
                  <div 
                    key={wc.id || i}
                    style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                    className="p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 flex flex-col gap-4 text-left group relative"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#071B4D] group-hover:bg-[#F7C400] transition-colors rounded-t-2xl" />
                    
                    <div className="rounded-xl overflow-hidden h-14 w-14 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {wc.image ? (
                        <img 
                          src={wc.image} 
                          alt={wc.title} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        renderIcon(wc.icon || "Award", "h-6 w-6 text-[#071B4D]")
                      )}
                    </div>

                    <h3 
                      onClick={(e) => handleElementClick(e, `content.cards.${i}.title`, wc.title)}
                      className={`text-base font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors ${editableClass(`content.cards.${i}.title`)}`}
                    >
                      {wc.title}
                    </h3>
                    <p 
                      onClick={(e) => handleElementClick(e, `content.cards.${i}.desc`, wc.desc)}
                      className={`text-xs text-slate-500 font-sans leading-relaxed ${editableClass(`content.cards.${i}.desc`)}`}
                    >
                      {wc.desc}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 3b. SERVICES HOME SECTION */}
        {type === 'services-home' && (
          <div className="flex flex-col gap-8">
            <div className="text-center max-w-3xl mx-auto mb-4 flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services || [])
                .filter((s: any) => s.visible !== false)
                .map((serv: any, i: number) => (
                  <div 
                    key={serv.id || i}
                    style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                    className="bg-white p-6 rounded-2xl border text-left shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#071B4D] group-hover:bg-[#F7C400] transition-colors" />
                    
                    {serv.image && (
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={serv.image} 
                          alt={serv.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}

                    <h3 className="font-display font-bold text-[#071B4D] text-lg mt-1">{serv.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{serv.desc}</p>
                    
                    <button 
                      onClick={() => { window.location.hash = '#/services'; }}
                      className="mt-auto text-xs font-bold uppercase tracking-wider text-[#071B4D] group-hover:text-blue-600 transition-colors flex items-center gap-1 w-fit cursor-pointer"
                    >
                      <span>Explore Program &rarr;</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 3c. SUCCESS / IMPACT SECTION */}
        {type === 'impact' && (
          <div className="w-full py-16 px-8 rounded-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 text-white shadow-lg" style={{ backgroundColor: design.backgroundColor || '#071B4D' }}>
            {/* Soft backdrop accents */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            
            <div className="flex flex-col gap-3 text-left lg:max-w-md relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
                {title}
              </h2>
              {subtitle && <p className="text-sm text-slate-200 leading-relaxed font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center w-full lg:max-w-3xl shrink-0 relative z-10">
              {[
                { label: "Students Trained", value: content.trained || "5000+" },
                { label: "Hiring Partners", value: content.companies || "50+" },
                { label: "Expert Courses", value: content.courses || "12+" },
                { label: "Google Rating", value: content.googleRating || "4.9 Stars" }
              ].map((m, mi) => (
                <div key={mi} className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-1.5 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
                  <span className="text-2xl md:text-4xl font-display font-black text-[#F7C400] tracking-tight">{m.value}</span>
                  <span className="text-[9px] md:text-xs font-bold text-slate-300 uppercase tracking-widest">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3d. TESTIMONIALS SECTION */}
        {type === 'testimonials' && (
          <div className="flex flex-col gap-8">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
              {(content.testimonials || []).map((t: any, idx: number) => (
                <div 
                  key={t.id || idx}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 relative group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#071B4D] group-hover:bg-[#F7C400] transition-colors rounded-t-2xl" />
                  
                  <div className="text-left font-sans italic text-slate-600 text-xs leading-relaxed">
                    &ldquo;{t.review}&rdquo;
                  </div>

                  <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                    <img 
                      src={t.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100"} 
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-full object-cover border-2 border-[#071B4D] shrink-0"
                    />
                    <div className="flex flex-col text-left">
                      <h4 className="font-display font-black text-xs text-[#071B4D] leading-none">{t.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-none">{t.college}</span>
                      <span className="text-[10px] font-black text-[#071B4D] mt-1 bg-[#F7C400]/10 px-1.5 py-0.5 rounded w-fit">
                        {t.company} ({t.package})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3e. COURSES HOME SECTION */}
        {type === 'courses-home' && (
          <div className="flex flex-col gap-8">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allCourses?.slice(0, content.limit || 3).map((course: any, idx: number) => (
                <div 
                  key={course.id || idx}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-5 relative group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#071B4D] group-hover:bg-[#F7C400] transition-colors" />
                  
                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#071B4D] bg-[#071B4D]/5 px-2.5 py-1 rounded w-fit">
                      {course.category}
                    </span>
                    <h3 className="font-display font-black text-[#071B4D] text-lg mt-1">{course.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-sans">
                      {course.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Duration</span>
                      <span className="text-xs font-bold text-[#071B4D]">{course.duration}</span>
                    </div>
                    <button 
                      onClick={() => { window.location.hash = '#/contact'; }}
                      className="px-4 py-2 bg-[#071B4D] hover:bg-[#F7C400] text-white hover:text-[#071B4D] font-black text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3f. WORKSHOPS HOME SECTION */}
        {type === 'workshops-home' && (
          <div className="flex flex-col gap-8">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Resume & ATS Engineering Workshop",
                  desc: "Draft a premium 1-page ATS score-ready engineering resume live with our experts.",
                  date: "15 July 2026",
                  location: "Bhopal Branch Office",
                  image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600"
                },
                {
                  title: "STAR Interview Prep Masterclass",
                  desc: "Learn secret frameworks to respond to behavior questions and pass mock technical panels.",
                  date: "22 July 2026",
                  location: "Indore Branch Office",
                  image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600"
                }
              ].map((wk, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group"
                >
                  <div className="md:w-1/2 h-48 md:h-full relative overflow-hidden bg-slate-100">
                    <img 
                      src={wk.image} 
                      alt={wk.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="md:w-1/2 p-6 flex flex-col justify-between text-left gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-black uppercase text-[#F7C400] bg-[#071B4D] px-2.5 py-1 rounded w-fit">
                        {wk.date}
                      </span>
                      <h3 className="font-display font-bold text-[#071B4D] text-base leading-snug">{wk.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{wk.desc}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{wk.location}</span>
                      <button 
                        onClick={() => { window.location.hash = '#/contact'; }}
                        className="text-xs font-black text-[#071B4D] hover:text-blue-600 cursor-pointer"
                      >
                        Register &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3g. BLOGS HOME SECTION */}
        {type === 'blogs-home' && (
          <div className="flex flex-col gap-8">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allBlogs?.slice(0, 3).map((blog: any, idx: number) => (
                <div 
                  key={blog.id || idx}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[9px] font-black uppercase text-[#071B4D] bg-[#F7C400] px-2 py-0.5 rounded">
                      {blog.category}
                    </span>
                  </div>
                  
                  <div className="p-5 flex flex-col gap-2.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{blog.date}</span>
                    <h3 className="font-display font-bold text-[#071B4D] text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="p-5 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold">{blog.readTime}</span>
                    <button 
                      onClick={() => { window.location.hash = `#/blog/${blog.slug || blog.id}`; }}
                      className="text-xs font-black text-[#071B4D] hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Read More</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3h. CTA BANNER SECTION */}
        {type === 'cta-banner' && (
          <div 
            style={{ backgroundImage: `url(${content.bgImage})` }}
            className="w-full py-20 px-8 rounded-3xl relative overflow-hidden bg-cover bg-center text-white shadow-xl text-center"
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#071B4D]/85 z-10" />

            <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center gap-6">
              <span className="text-[10px] font-black uppercase text-[#071B4D] tracking-widest bg-[#F7C400] px-3.5 py-1.5 rounded-full">
                🔥 Join MP's Most Active Placement Hub
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight max-w-2xl">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs md:text-sm text-slate-200 font-sans max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}
              {content.tagline && (
                <p className="text-xs text-[#F7C400] font-bold tracking-wide uppercase mt-1">
                  💡 {content.tagline}
                </p>
              )}
              <button 
                onClick={() => { window.location.hash = '#/contact'; }}
                className="mt-4 px-8 py-4 bg-[#F7C400] hover:bg-white text-[#071B4D] font-sans font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                {content.primaryBtnText || "Register For Free Demo"}
              </button>
            </div>
          </div>
        )}

        {/* 4. TIMELINE SECTION */}
        {type === 'timeline' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
              <h2 
                onClick={(e) => handleElementClick(e, 'title', title)}
                className={`text-3xl md:text-4xl font-display font-bold ${editableClass('title')}`}
                style={{ color: design.headingColor }}
              >
                {title}
              </h2>
              {subtitle && (
                <p 
                  onClick={(e) => handleElementClick(e, 'subtitle', subtitle)}
                  className={`text-base text-slate-500 font-sans ${editableClass('subtitle')}`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative">
              {content.steps?.map((st: any, i: number) => (
                <div 
                  key={st.id || i}
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="p-6 rounded-xl border relative flex flex-col gap-3 text-left hover:border-blue-500 transition-colors shadow-sm"
                >
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                    {st.num}
                  </span>
                  <h3 
                    onClick={(e) => handleElementClick(e, `content.steps.${i}.label`, st.label)}
                    className={`text-sm font-display font-bold text-slate-900 ${editableClass(`content.steps.${i}.label`)}`}
                  >
                    {st.label}
                  </h3>
                  <p 
                    onClick={(e) => handleElementClick(e, `content.steps.${i}.desc`, st.desc)}
                    className={`text-xs text-slate-500 leading-relaxed font-sans ${editableClass(`content.steps.${i}.desc`)}`}
                  >
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SUCCESS STORIES SECTION */}
        {type === 'success-stories' && (
          <div className="flex flex-col gap-8">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-medium text-base">{subtitle}</p>}

              {/* Integrated Google Rating Indicator */}
              <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 border border-slate-100 py-2.5 px-4 rounded-xl w-fit mx-auto shadow-sm">
                <div className="flex text-amber-400">
                  <Icons.Star className="h-4 w-4 fill-current" />
                  <Icons.Star className="h-4 w-4 fill-current" />
                  <Icons.Star className="h-4 w-4 fill-current" />
                  <Icons.Star className="h-4 w-4 fill-current" />
                  <Icons.Star className="h-4 w-4 fill-current" />
                </div>
                <span className="font-extrabold text-sm text-[#071B4D]">Google {settings.googleRatingValue || "4.8"} Stars</span>
                <span className="text-xs text-slate-400 font-semibold">({settings.googleRatingTitle || "Verified Student Reviews"})</span>
              </div>
            </div>

            {/* Live Registry vs Manual Stories Toggle */}
            <div className="flex justify-center">
              <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200">
                <button
                  onClick={() => setStoriesMode('auto')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    storiesMode === 'auto'
                      ? 'bg-[#071B4D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#071B4D]'
                  }`}
                >
                  🔥 Auto-Synced Placed Registry
                </button>
                <button
                  onClick={() => setStoriesMode('manual')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    storiesMode === 'manual'
                      ? 'bg-[#071B4D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#071B4D]'
                  }`}
                >
                  💭 CMS Success Stories
                </button>
              </div>
            </div>

            {/* Placed Students rendering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(storiesMode === 'auto' ? allPlacedStudents.slice(0, 6) : (content.stories || allPlacedStudents.slice(0, 3))).map((st: any, idx: number) => (
                <div 
                  key={st.id || idx}
                  className="bg-white border border-slate-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 relative group"
                >
                  {/* Subtle top decoration */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#071B4D] group-hover:bg-[#F7C400] transition-all rounded-t-2xl" />

                  <div className="flex items-center gap-4 mt-2">
                    <img 
                      src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"} 
                      alt={st.name} 
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 rounded-full object-cover border-2 border-[#071B4D] shadow-sm shrink-0" 
                    />
                    <div className="flex flex-col text-left">
                      <h3 className="font-display font-black text-[#071B4D] text-base leading-tight">{st.name}</h3>
                      <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide leading-none">{st.branch || "Computer Science"}</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-1 leading-none">{st.college}</span>
                    </div>
                  </div>

                  {st.testimonialText && (
                    <p className="text-xs italic text-slate-500 font-sans mt-1 text-left leading-relaxed">
                      &ldquo;{st.testimonialText}&rdquo;
                    </p>
                  )}

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center w-full mt-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Placed At</span>
                      <span className="font-black text-sm text-[#071B4D]">{st.company}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Salary Package</span>
                      <span className="font-extrabold text-xs text-[#071B4D] bg-[#F7C400]/20 px-2.5 py-1 rounded-md mt-0.5">
                        {st.packageLpa || "4.5 LPA"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button 
                onClick={() => { window.location.hash = '#/placed-students'; }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#071B4D] hover:bg-[#0c2b73] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <span>{content.viewAllBtnText || "View All Placed"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. PARTNERS LOGO SECTION */}
        {type === 'partners' && (
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
              <h2 className="text-2xl md:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
            </div>

            {/* Interactive controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {/* Category selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Category:</span>
                <div className="flex gap-1">
                  {['All', 'MNCs', 'Product-Based', 'Startups'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPartnersFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        partnersFilter === cat
                          ? 'bg-[#071B4D] text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Layout:</span>
                <div className="bg-slate-200 p-1 rounded-xl flex items-center shadow-inner">
                  <button
                    onClick={() => setPartnersLayout('carousel')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      partnersLayout === 'carousel'
                        ? 'bg-white text-[#071B4D] shadow'
                        : 'text-slate-500 hover:text-[#071B4D]'
                    }`}
                  >
                    Smooth Slider
                  </button>
                  <button
                    onClick={() => setPartnersLayout('grid')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      partnersLayout === 'grid'
                        ? 'bg-white text-[#071B4D] shadow'
                        : 'text-slate-500 hover:text-[#071B4D]'
                    }`}
                  >
                    Structured Grid
                  </button>
                </div>
              </div>
            </div>

            {/* Filtered Partner Logos */}
            {(() => {
              const mncs = ['tcs', 'infosys', 'wipro', 'accenture', 'cognizant', 'ibm', 'deloitte'];
              const products = ['persistent', 'ibm', 'deloitte', 'zs associates'];
              
              const filteredPartners = allHiringPartners.filter(partner => {
                if (partnersFilter === 'All') return true;
                const nameLower = partner.name.toLowerCase();
                if (partnersFilter === 'MNCs') {
                  return mncs.some(m => nameLower.includes(m));
                }
                if (partnersFilter === 'Product-Based') {
                  return products.some(p => nameLower.includes(p));
                }
                if (partnersFilter === 'Startups') {
                  return !mncs.some(m => nameLower.includes(m)) && !products.some(p => nameLower.includes(p));
                }
                return true;
              });

              if (partnersLayout === 'carousel') {
                // Return a beautiful continuous infinite animation wrapper
                const duplicatePartners = [...filteredPartners, ...filteredPartners, ...filteredPartners];
                return (
                  <div className="w-full overflow-hidden relative py-4 bg-slate-50/50 rounded-2xl border border-slate-100 mt-2">
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                    
                    <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full">
                      {duplicatePartners.map((partner, idx) => (
                        <div 
                          key={`${partner.id}-${idx}`}
                          className="inline-flex items-center justify-center px-8 py-5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-800 font-display font-black tracking-tighter text-base shrink-0 select-none hover:border-[#071B4D] transition-colors"
                        >
                          {partner.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                  {filteredPartners.map((partner) => (
                    <div 
                      key={partner.id}
                      className="px-6 py-5 bg-white border border-slate-100 rounded-xl shadow-sm font-display font-black text-slate-700 tracking-tighter text-base hover:text-[#071B4D] hover:border-[#071B4D] transition-all flex items-center justify-center text-center group relative overflow-hidden"
                    >
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#F7C400] scale-y-0 group-hover:scale-y-100 transition-transform" />
                      {partner.name}
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="text-center mt-6">
              <button 
                onClick={() => { window.location.hash = '#/companies'; }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#071B4D] hover:bg-[#0c2b73] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>{content.viewAllBtnText || "View All Companies"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 7. ABOUT MAIN SECTION */}
        {type === 'about-main' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <h2 
                onClick={(e) => handleElementClick(e, 'title', title)}
                className={`text-3xl md:text-4xl font-display font-extrabold ${editableClass('title')}`}
                style={{ color: design.headingColor }}
              >
                {title}
              </h2>
              <p 
                onClick={(e) => handleElementClick(e, 'content.description', content.description)}
                className={`text-lg text-slate-600 leading-relaxed font-sans ${editableClass('content.description')}`}
              >
                {content.description}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <img src={content.founderImage} alt="Founder" className="h-44 w-44 rounded-full object-cover border-4 border-white shadow-md mb-4" />
              <h3 
                onClick={(e) => handleElementClick(e, 'content.founderName', content.founderName)}
                className={`font-display font-bold text-lg text-slate-900 ${editableClass('content.founderName')}`}
              >
                {content.founderName}
              </h3>
              <p 
                onClick={(e) => handleElementClick(e, 'content.founderRole', content.founderRole)}
                className={`text-xs text-blue-600 font-sans mt-1 ${editableClass('content.founderRole')}`}
              >
                {content.founderRole}
              </p>
            </div>
          </div>
        )}

        {/* 8. MISSION & VISION SECTION */}
        {type === 'mission-vision' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div 
              style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
              className="p-8 rounded-2xl border shadow-sm flex flex-col gap-4"
            >
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
                <Icons.Target className="h-6 w-6" />
              </div>
              <h3 
                onClick={(e) => handleElementClick(e, 'content.missionTitle', content.missionTitle)}
                className={`text-xl font-display font-bold text-slate-900 ${editableClass('content.missionTitle')}`}
              >
                {content.missionTitle}
              </h3>
              <p 
                onClick={(e) => handleElementClick(e, 'content.missionDesc', content.missionDesc)}
                className={`text-sm text-slate-600 leading-relaxed font-sans ${editableClass('content.missionDesc')}`}
              >
                {content.missionDesc}
              </p>
            </div>

            <div 
              style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
              className="p-8 rounded-2xl border shadow-sm flex flex-col gap-4"
            >
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
                <Icons.Compass className="h-6 w-6" />
              </div>
              <h3 
                onClick={(e) => handleElementClick(e, 'content.visionTitle', content.visionTitle)}
                className={`text-xl font-display font-bold text-slate-900 ${editableClass('content.visionTitle')}`}
              >
                {content.visionTitle}
              </h3>
              <p 
                onClick={(e) => handleElementClick(e, 'content.visionDesc', content.visionDesc)}
                className={`text-sm text-slate-600 leading-relaxed font-sans ${editableClass('content.visionDesc')}`}
              >
                {content.visionDesc}
              </p>
            </div>
          </div>
        )}

        {/* 9. WHY US LIST (ABOUT US) */}
        {type === 'why-us-list' && (
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-10 text-center" style={{ color: design.headingColor }}>
              {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.points?.map((pt: any, i: number) => (
                <div key={pt.id} className="flex gap-4 text-left">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1">
                    <Icons.Check className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display font-bold text-slate-900 text-base">{pt.title}</h3>
                    <p className="text-sm text-slate-500 font-sans leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. ABOUT JOURNEY (MILESTONES) */}
        {type === 'about-journey' && (
          <div>
            <h2 className="text-3xl font-display font-bold text-center mb-12" style={{ color: design.headingColor }}>
              {title}
            </h2>
            <div className="relative border-l border-slate-200 ml-4 md:ml-32 pl-8 space-y-12 text-left">
              {content.milestones?.map((m: any, i: number) => (
                <div key={m.id || i} className="relative">
                  <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-blue-600 border-4 border-white shadow flex items-center justify-center font-bold text-white text-[9px]" />
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <span className="text-xl font-display font-black text-blue-600 min-w-[80px]">
                      {m.year}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-display font-bold text-slate-900">{m.title}</h3>
                      <p className="text-sm text-slate-500 font-sans leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. SERVICES GRID SECTION */}
        {type === 'services-grid' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.services?.map((serv: any, i: number) => (
                <div 
                  key={serv.id || i}
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="p-6 rounded-2xl border text-left shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                >
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg w-fit">
                    <Icons.Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-lg">{serv.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-sans">{serv.desc}</p>
                </div>
              ))}
            </div>

            {/* Services Page CTA Banner */}
            <div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-xl">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-display font-bold">{content.ctaTitle}</h3>
                <p className="text-slate-100 text-sm font-sans">{content.ctaDesc}</p>
              </div>
              <a 
                href="#contact" 
                className="px-6 py-3 bg-white text-blue-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-lg shadow shrink-0 transition-all font-sans"
              >
                {content.ctaBtnText}
              </a>
            </div>
          </div>
        )}

        {/* 12. PLACED TABLE (PLACED STUDENTS PAGE) */}
        {type === 'placed-table' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 text-sm font-sans">{subtitle}</p>}
            </div>

            {/* Google review widget */}
            <div className="flex items-center justify-center gap-2 mb-8 bg-white p-3 rounded-lg shadow-sm border border-slate-100 w-fit mx-auto text-xs font-sans">
              <div className="flex text-amber-400">
                <Icons.Star className="h-4 w-4 fill-current" />
                <Icons.Star className="h-4 w-4 fill-current" />
                <Icons.Star className="h-4 w-4 fill-current" />
                <Icons.Star className="h-4 w-4 fill-current" />
                <Icons.Star className="h-4 w-4 fill-current" />
              </div>
              <span className="font-bold text-slate-800">Google {content.googleRatingValue} Stars</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-medium">{content.googleRatingTitle}</span>
            </div>

            {/* Real-time filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 text-left text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Search Name</label>
                <div className="relative">
                  <Icons.Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Filter College</label>
                <select 
                  value={studentCollege}
                  onChange={(e) => setStudentCollege(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                >
                  <option value="All">All Colleges</option>
                  <option value="Bhabha University">Bhabha University</option>
                  <option value="LNCT Bhopal">LNCT Bhopal</option>
                  <option value="RGPV Bhopal">RGPV Bhopal</option>
                  <option value="IPS Academy">IPS Academy</option>
                  <option value="VIT Bhopal">VIT Bhopal</option>
                  <option value="SIRT Bhopal">SIRT Bhopal</option>
                  <option value="SGSITS Indore">SGSITS Indore</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Filter Company</label>
                <select 
                  value={studentCompany}
                  onChange={(e) => setStudentCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                >
                  <option value="All">All Companies</option>
                  <option value="Infosys">Infosys</option>
                  <option value="TCS">TCS</option>
                  <option value="Capgemini">Capgemini</option>
                  <option value="Cognizant">Cognizant</option>
                  <option value="Wipro">Wipro</option>
                  <option value="Tech Mahindra">Tech Mahindra</option>
                  <option value="Accenture">Accenture</option>
                  <option value="HCL">HCL</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Filter Year</label>
                <select 
                  value={studentBranch}
                  onChange={(e) => setStudentBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                >
                  <option value="All">All Years</option>
                  <option value="2024">2024 Grad</option>
                  <option value="2023">2023 Grad</option>
                </select>
              </div>
            </div>

            {/* Students Grid/List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left text-xs font-sans">
              <div className="overflow-x-auto">
                <table className="w-full text-slate-700">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">College & Branch</th>
                      <th className="px-6 py-4">Company Placed</th>
                      <th className="px-6 py-4">Salary Package</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPlacedStudents
                      .filter(st => {
                        const mName = st.name.toLowerCase().includes(studentSearch.toLowerCase());
                        const mColl = studentCollege === 'All' || st.college === studentCollege;
                        const mComp = studentCompany === 'All' || st.company === studentCompany;
                        const mYr = studentBranch === 'All' || st.year === studentBranch;
                        return mName && mColl && mComp && mYr;
                      })
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={st.avatar} alt={st.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">{st.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Class of {st.year}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800">{st.college}</span>
                              <span className="text-slate-400 text-[10px]">{st.branch}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 font-bold text-blue-600">
                              <Icons.Building className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span>{st.company}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full font-mono text-[10px]">
                              {st.packageLpa}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 13. COMPANIES GRID (HIRING COMPANIES PAGE) */}
        {type === 'companies-grid' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {allHiringPartners.map((partner) => (
                <div 
                  key={partner.id}
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="p-8 rounded-xl border flex flex-col items-center justify-center font-display font-extrabold text-lg text-slate-700 tracking-tighter hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group shadow-sm bg-white"
                >
                  <Icons.Building className="h-5 w-5 mb-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  <span className="text-slate-800 group-hover:text-blue-600">{partner.name}</span>
                </div>
              ))}
            </div>

            {/* Recruiter contact block */}
            <div className="mt-16 bg-slate-50 border border-slate-200 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between text-left gap-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-lg text-slate-900">{content.ctaTitle}</h3>
                <p className="text-sm text-slate-500 font-sans">{content.ctaDesc}</p>
              </div>
              <a href="#contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow shrink-0 font-sans transition-colors">
                {content.ctaBtnText || "Hire From Us"}
              </a>
            </div>
          </div>
        )}

        {/* 14. COURSES TABS */}
        {type === 'courses-tabs' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans text-sm">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              {/* Left category tabs */}
              <div className="lg:col-span-4 flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-fit text-xs font-sans">
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 px-2">Course Categories</h3>
                {[
                  { id: 'programming', label: 'Programming Courses', icon: 'Code' },
                  { id: 'aptitude', label: 'Aptitude Courses', icon: 'Award' },
                  { id: 'soft-skills', label: 'Soft Skills Training', icon: 'MessageSquare' },
                  { id: 'interview', label: 'Interview Training', icon: 'UserCheck' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCourseCategory(cat.id as any);
                      setExpandedCourseId(null);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                      activeCourseCategory === cat.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {renderIcon(cat.icon, `h-4 w-4 ${activeCourseCategory === cat.id ? 'text-blue-600' : 'text-slate-400'}`)}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Right Course List */}
              <div className="lg:col-span-8 flex flex-col gap-4 text-xs font-sans">
                {allCourses
                  .filter(c => c.category === activeCourseCategory)
                  .map((course) => {
                    const isExpanded = expandedCourseId === course.id;
                    return (
                      <div 
                        key={course.id}
                        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all cursor-pointer text-left"
                        onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
                              {course.duration} Module
                            </span>
                            <h3 className="text-lg font-display font-bold text-slate-900 hover:text-blue-600 transition-colors">
                              {course.name}
                            </h3>
                            <p className="text-slate-500 font-sans leading-relaxed text-sm">
                              {course.description}
                            </p>
                          </div>
                          <div className="shrink-0 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-800">
                            {isExpanded ? <Icons.ChevronUp className="h-4 w-4" /> : <Icons.ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>

                        {/* Expandable topics list */}
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3"
                          >
                            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">What you will learn:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                              {course.topics.map((topic, ti) => (
                                <div key={ti} className="flex items-center gap-2">
                                  <Icons.CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                  <span className="font-medium text-slate-700">{topic}</span>
                                </div>
                              ))}
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase rounded w-fit tracking-wider">
                              Enquiry Now
                            </button>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* 15. STUDENT LMS DASHBOARD */}
        {type === 'lms-dashboard' && (
          <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row text-xs font-sans text-left">
            {/* Sidebar Menu Panel */}
            <div className="lg:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col gap-1 justify-between shrink-0">
              <div className="flex flex-col gap-6">
                {/* Profile Card */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-600 text-white font-black rounded-lg flex items-center justify-center text-sm shadow">
                    PJ
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{content.studentName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{content.studentId}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Dashboard Options */}
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'dashboard', label: 'Student Dashboard', icon: 'LayoutDashboard' },
                    { id: 'courses', label: 'My Courses (3)', icon: 'BookOpen' },
                    { id: 'classes', label: 'Live Lectures (2)', icon: 'Video' },
                    { id: 'assignments', label: 'Assignments (3)', icon: 'FileText' },
                    { id: 'tests', label: 'Mock Drills (4)', icon: 'Award' },
                    { id: 'support', label: 'System Support', icon: 'HelpCircle' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveLmsTab(item.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left w-full ${
                        activeLmsTab === item.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      {renderIcon(item.icon, `h-4 w-4 ${activeLmsTab === item.id ? 'text-white' : 'text-slate-500'}`)}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Tentrapax LMS v2.4</span>
              </div>
            </div>

            {/* Dashboard Content Container */}
            <div className="flex-1 p-6 md:p-8 bg-slate-900/40 flex flex-col gap-6">
              
              {/* Reminder Banner */}
              <div className="bg-blue-950/80 border border-blue-900 text-blue-300 p-4 rounded-xl flex items-center gap-3">
                <Icons.Bell className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="font-medium">{content.notificationText}</span>
              </div>

              {activeLmsTab === 'dashboard' && (
                <div className="flex flex-col gap-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "My Courses", value: "3 Enrolled", color: "text-blue-400", bg: "bg-blue-950/50" },
                      { label: "Live Classes", value: "2 Upcoming", color: "text-amber-400", bg: "bg-amber-950/50" },
                      { label: "Assignments", value: "3 Pending", color: "text-rose-400", bg: "bg-rose-950/50" },
                      { label: "Mock Tests", value: "4 Available", color: "text-emerald-400", bg: "bg-emerald-950/50" }
                    ].map((stat, si) => (
                      <div key={si} className={`p-4 rounded-xl border border-slate-800 ${stat.bg} flex flex-col gap-1.5`}>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                        <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Active Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
                      <h3 className="font-display font-bold text-white text-sm">Course Progress Tracker</h3>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-300">Java Programming & DSA</span>
                            <span className="text-blue-400 font-mono">75% Complete</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-300">Quantitative Aptitude</span>
                            <span className="text-amber-400 font-mono">45% Complete</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Countdown Banner */}
                    <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Upcoming Live Class</span>
                        <h4 className="text-base font-display font-bold text-white">Aptitude - Percentage Calculation</h4>
                        <span className="text-slate-400 text-xs mt-1">Today at 7:00 PM (IST) &bull; 1.5 Hrs Session</span>
                      </div>
                      <button 
                        onClick={() => {
                          setLmsAlert("Launching Live Lecture Classroom... Connecting to media container on port 3000.");
                          setTimeout(() => setLmsAlert(null), 3500);
                        }}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded transition-colors text-[10px]"
                      >
                        Join Live Classroom
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeLmsTab !== 'dashboard' && (
                <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[220px]">
                  <Icons.Lock className="h-8 w-8 text-slate-600 mb-3" />
                  <h3 className="font-bold text-white text-sm uppercase">Active Enrollment Required</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">This module is locked. Contact your counselor to assign your technical stream batch.</p>
                </div>
              )}

              {lmsAlert && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded font-mono text-[10px] text-center">
                  {lmsAlert}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 16. CAMPUS AMBASSADOR PANEL */}
        {type === 'ambassador-main' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900" style={{ color: design.headingColor }}>
                {title}
              </h2>
              <h3 className="text-xl text-blue-600 font-sans font-bold uppercase tracking-wider">
                {subtitle}
              </h3>

              <div className="flex flex-col gap-3 mt-2">
                {content.benefits?.map((benefit: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Icons.Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-slate-600 font-sans font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
              <h3 className="font-display font-bold text-slate-900 text-lg mb-4">Apply for Ambassador</h3>
              {ambassadorSuccess ? (
                <div className="p-6 bg-emerald-50 text-emerald-700 rounded-xl text-center flex flex-col items-center gap-3">
                  <Icons.CheckCircle className="h-10 w-10 text-emerald-500" />
                  <span className="font-bold text-sm">Application Sent Successfully!</span>
                  <p className="text-xs text-slate-500">Our HR coordinator will email you instructions on campus tasks.</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!ambassadorName || !ambassadorEmail || !ambassadorPhone) return;
                    onAddLead({
                      type: 'ambassador',
                      name: ambassadorName,
                      email: ambassadorEmail,
                      phone: ambassadorPhone,
                      message: "Ambassador application request",
                      status: 'new'
                    });
                    setAmbassadorSuccess(true);
                  }}
                  className="flex flex-col gap-3 font-sans text-xs"
                >
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-600 uppercase tracking-wide">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Name"
                      value={ambassadorName}
                      onChange={(e) => setAmbassadorName(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-600 uppercase tracking-wide">University Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Email"
                      value={ambassadorEmail}
                      onChange={(e) => setAmbassadorEmail(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-600 uppercase tracking-wide">WhatsApp Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="WhatsApp Number"
                      value={ambassadorPhone}
                      onChange={(e) => setAmbassadorPhone(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <button className="mt-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded transition-colors shadow">
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 17. COLLEGE PARTNERSHIP GRID */}
        {type === 'partnership-grid' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 text-sm font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {content.partnerships?.map((item: any, i: number) => (
                <div 
                  key={item.id || i}
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="p-8 rounded-2xl border flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                    <Icons.GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-sans leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
              <a href="#contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow font-sans transition-colors">
                {content.registerBtnText || "Register Your College"}
              </a>
              <button 
                onClick={() => alert("Downloading PDF Brochure from static storage asset...")}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs rounded-lg shadow-sm font-sans hover:bg-slate-50 transition-colors"
              >
                {content.brochureBtnText || "Download Brochure"}
              </button>
            </div>
          </div>
        )}

        {/* 18. WORKSHOPS LIST */}
        {type === 'workshops-list' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 text-sm font-sans">{subtitle}</p>}
            </div>

            {/* Tabs filter */}
            <div className="flex items-center justify-center gap-2 mb-10 text-xs font-sans">
              <button 
                onClick={() => setActiveWorkshopTab('upcoming')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  activeWorkshopTab === 'upcoming' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Upcoming Workshops
              </button>
              <button 
                onClick={() => setActiveWorkshopTab('past')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  activeWorkshopTab === 'past' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Past Workshops
              </button>
            </div>

            {activeWorkshopTab === 'upcoming' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-xs font-sans">
                {content.workshops?.map((wk: any, i: number) => (
                  <div 
                    key={wk.id || i}
                    style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                    className="p-6 rounded-2xl border flex flex-col sm:flex-row gap-6 shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <img src={wk.image} alt={wk.title} className="h-32 sm:w-40 rounded-xl object-cover shrink-0 border border-slate-100 shadow" />
                    <div className="flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                            <Icons.Calendar className="h-3 w-3 shrink-0" />
                            {wk.date}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                            <Icons.MapPin className="h-3 w-3 shrink-0" />
                            {wk.location}
                          </span>
                        </div>
                        <h3 className="text-base font-display font-bold text-slate-900">{wk.title}</h3>
                        <p className="text-slate-500 font-sans leading-relaxed text-xs">{wk.desc}</p>
                      </div>
                      <button 
                        onClick={() => alert(`Submitting registration for ${wk.title}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded w-fit text-[10px] transition-colors"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-sans">
                {[
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
                ].map((img, picI) => (
                  <div key={picI} className="relative rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                    <img src={img} alt="Workshop" className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 19. BLOG GRID (BLOG CMS PAGE) */}
        {type === 'blog-grid' && (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 text-sm font-sans">{subtitle}</p>}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-sans">
              {['All', 'Resume Tips', 'Interview Tips', 'LinkedIn Tips'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveBlogCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                    activeBlogCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs font-sans">
              {allBlogs
                .filter(b => b.status === 'published')
                .filter(b => activeBlogCategory === 'All' || b.category === activeBlogCategory)
                .map((blog) => (
                  <div 
                    key={blog.id}
                    style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                    className="p-5 rounded-2xl border flex flex-col gap-4 shadow-sm hover:shadow-md transition-all h-full bg-white"
                  >
                    <img src={blog.image} alt={blog.title} className="w-full h-44 rounded-xl object-cover border border-slate-100 shadow-sm" />
                    <div className="flex flex-col gap-3 justify-between flex-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] font-bold text-blue-600">
                          <span className="bg-blue-50 px-2 py-0.5 rounded uppercase">{blog.category}</span>
                          <span className="text-slate-400 font-medium">{blog.date}</span>
                        </div>
                        <h3 className="text-base font-display font-bold text-slate-900 leading-tight">
                          {blog.title}
                        </h3>
                        <p className="text-slate-500 font-sans text-xs leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>
                      <button 
                        onClick={() => alert(`Opening complete article detail block for "${blog.title}"\n\nContent:\n${blog.content}`)}
                        className="text-blue-600 font-bold flex items-center gap-1 text-[11px] hover:text-blue-700 transition-colors mt-2"
                      >
                        Read Full Article
                        <Icons.ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 20. CONTACT SPLIT */}
        {type === 'contact-split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left text-xs font-sans">
            {/* Left office addresses */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900" style={{ color: design.headingColor }}>
                  {title}
                </h2>
                {subtitle && <p className="text-slate-500 font-sans leading-relaxed text-sm">{subtitle}</p>}
              </div>

              <div className="flex flex-col gap-6">
                {content.offices?.map((office: any, i: number) => (
                  <div 
                    key={office.id || i}
                    className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-3"
                  >
                    <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Icons.Building className="h-4 w-4 text-blue-600" />
                      {office.name}
                    </h3>
                    <div className="space-y-1.5 text-slate-600 leading-relaxed font-sans text-xs">
                      <p className="flex items-start gap-2">
                        <Icons.MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{office.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{office.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{office.email}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vector custom styled placeholder map */}
              <div className="h-48 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center text-center p-6 shadow-inner">
                <div className="absolute inset-0 bg-slate-50 flex flex-col p-4">
                  <div className="w-full h-full border border-dashed border-slate-200 rounded flex flex-col items-center justify-center bg-slate-100/50">
                    <Icons.Globe className="h-6 w-6 text-slate-400 mb-2 animate-pulse" />
                    <span className="font-bold text-slate-800 text-[10px] tracking-wide uppercase">{content.mapTitle}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 font-mono">Latitude: 23.2332 | Longitude: 77.4345</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right contact interactive form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
              <h3 className="font-display font-bold text-slate-900 text-lg mb-6">Drop Us a Message</h3>
              {contactSuccess ? (
                <div className="p-8 bg-emerald-50 text-emerald-700 rounded-xl text-center flex flex-col items-center gap-4">
                  <Icons.CheckCircle className="h-12 w-12 text-emerald-500" />
                  <span className="font-bold text-base">Your message has been sent!</span>
                  <p className="text-xs text-slate-500">We appreciate your interest. A professional career counselor from Tentrapax will call or email you shortly.</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactName || !contactEmail || !contactPhone) return;
                    onAddLead({
                      type: 'contact',
                      name: contactName,
                      email: contactEmail,
                      phone: contactPhone,
                      message: contactMessage,
                      status: 'new'
                    });
                    setContactSuccess(true);
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500 text-xs" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">Your Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500 text-xs" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">Your Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500 text-xs" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">Write Your Message / Query</label>
                    <textarea 
                      rows={4}
                      placeholder="I would like to enquire about placement training programs..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500 text-xs" 
                    />
                  </div>

                  <button className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-lg transition-colors shadow">
                    {content.formSubmitBtnText || "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </motion.section>
  );
}
