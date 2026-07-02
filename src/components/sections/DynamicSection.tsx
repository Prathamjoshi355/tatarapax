import React, { useState } from 'react';
import { CMSSection, PlacedStudent, HiringPartner, Course, BlogPost, Lead, GlobalSettings, Service } from '../../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getEmbedUrl = (rawUrl: string): string => {
  if (!rawUrl) {
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2163989182373!2d77.4277!3d23.2332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42636f2f2f11%3A0x7d8a6b1297eefb3b!2sArera%20Colony%2C%20Bhopal%2C%20Madhya%20Pradesh%20462016!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";
  }
  
  const url = rawUrl.trim();

  // 1. If it's an iframe HTML tag, extract the src attribute
  if (url.includes('<iframe')) {
    const match = url.match(/src="([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 2. If it is already a google maps embed link (contains /embed or output=embed)
  if (url.includes('/embed') || url.includes('output=embed')) {
    return url;
  }

  // 3. If it contains a place name /maps/place/PlaceName/...
  if (url.includes('google.com/maps') || url.includes('maps.google.com')) {
    const placeMatch = url.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch && placeMatch[1]) {
      return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`;
    }

    const qMatch = url.match(/[?&]q=([^&]+)/);
    if (qMatch && qMatch[1]) {
      return `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;
    }

    const latLongMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (latLongMatch && latLongMatch[1] && latLongMatch[2]) {
      return `https://maps.google.com/maps?q=${latLongMatch[1]},${latLongMatch[2]}&output=embed`;
    }
  }

  // 4. If it's a general non-http text (like "Bhopal Office, Tantrapex"), convert to search embed query
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  }

  return url;
};

interface DynamicSectionProps {
  section: CMSSection;
  viewMode: 'live' | 'visual' | 'admin';
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  // Shared CMS store references
  allPlacedStudents: PlacedStudent[];
  allHiringPartners: HiringPartner[];
  allCourses: Course[];
  allBlogs: BlogPost[];
  allServices?: Service[];
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
  allServices = [],
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
  const [activeCourseCategory, setActiveCourseCategory] = useState<string>('programming');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Workshop / Blog states
  const [activeBlogCategory, setActiveBlogCategory] = useState('All');
  const [activeReaderBlog, setActiveReaderBlog] = useState<BlogPost | null>(null);
  const [activeWorkshopTab, setActiveWorkshopTab] = useState<'upcoming' | 'past' | 'gallery'>('upcoming');
  const [visibleWorkshopsCount, setVisibleWorkshopsCount] = useState(2);
  const [registeredWkTitle, setRegisteredWkTitle] = useState<string | null>(null);

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
  const [ambassadorCollege, setAmbassadorCollege] = useState('');
  const [ambassadorCourse, setAmbassadorCourse] = useState('');
  const [ambassadorCity, setAmbassadorCity] = useState('');
  const [ambassadorYear, setAmbassadorYear] = useState('');
  const [ambassadorWhy, setAmbassadorWhy] = useState('');
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
  const animationVariants: Record<string, any> = {
    none: { opacity: 1 },
    fade: { opacity: [0, 1], transition: { duration: 0.6 } },
    slide: { y: [40, 0], opacity: [0, 1], transition: { duration: 0.5 } },
    zoom: { scale: [0.95, 1], opacity: [0, 1], transition: { duration: 0.4 } },
    bounce: { y: [-20, 0], opacity: [0, 1], transition: { type: "spring", stiffness: 100 } }
  };

  const activeAnimation = design.animation && design.animation in animationVariants
    ? animationVariants[design.animation]
    : animationVariants.none;

  return (
    <motion.section
      animate={activeAnimation}
      style={{
        backgroundColor: design.backgroundColor,
        color: design.textColor,
        borderRadius: design.borderRadius
      }}
      className={`relative w-full overflow-hidden transition-all duration-300 ${type === 'hero' ? 'p-0' : 'py-12 md:py-20 px-4 md:px-8'
        }`}
    >
      {/* Visual Edit Badge */}
      {isVisual && (
        <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
          Click elements to edit directly
        </div>
      )}

      <div className={type === 'hero' ? "w-full" : `mx-auto ${!settings.containerWidth || settings.containerWidth === 'max-w-7xl' ? 'max-w-[1400px]' : settings.containerWidth}`}>

        {/* Render Sections Based on Type */}

        {/* 1. HERO SECTION */}
        {type === 'hero' && (content.showHero !== false) && (
          <section
            style={{
              backgroundImage: `url(${content.heroImage})`
            }}
            className="relative min-h-[85vh] md:min-h-screen bg-cover bg-center bg-no-repeat md:bg-fixed flex items-center">
            {/* Overlay */}
            <div
              style={{ backgroundColor: content.overlayColor || "rgba(7, 27, 77, 0.55)" }}
              className="absolute inset-0 z-5"
            />

            {/* Content Container aligned left */}
            <div className="relative z-10 w-full pt-24 pb-20">
              <div className="max-w-[1400px] mx-auto w-full px-6 sm:px-12 md:px-16 lg:px-20">
                <div className="max-w-3xl flex flex-col gap-5 md:gap-7 text-left items-start">

                  {/* Large Heading */}
                  <h1
                    onClick={(e) => handleElementClick(e, 'title', title)}
                    className={`text-3.5xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-tight font-black leading-[1.1] text-[#071B4D] ${editableClass('title')}`}
                  >
                    {title}
                  </h1>
                  {/* Description */}
                  {content.tagline && (
                    <p
                      onClick={(e) => handleElementClick(e, 'content.tagline', content.tagline)}
                      className={`text-sm sm:text-lg md:text-xl leading-relaxed font-semibold font-sans text-[#071B4D] ${editableClass('content.tagline')}`}
                    >
                      {content.tagline}
                    </p>
                  )}
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-3 w-full sm:w-auto">
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
                        className={`px-8 py-3.5 sm:py-4 font-sans font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer text-center shrink-0 ${editableClass('content.primaryBtnText')}`}
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
                        className={`px-8 py-3.5 sm:py-4 font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all border border-[#071B4D]/30 hover:border-[#071B4D] bg-[#071B4D]/5 hover:bg-[#071B4D]/10 text-[#071B4D] cursor-pointer text-center shrink-0 ${editableClass('content.secondaryBtnText')}`}
                      >
                        {content.secondaryBtnText}
                      </button>
                    )}
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

                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. STATS SECTION */}
        {type === 'stats' && (
          <div className="flex flex-col gap-6">
            {/* Interactive Toggle for Auto vs Manual - Only visible to Admins/Editors */}
            {viewMode !== 'live' && (
              <div className="flex justify-center">
                <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200">
                  <button
                    onClick={() => setStatsMode('auto')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${statsMode === 'auto'
                      ? 'bg-[#071B4D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#071B4D]'
                      }`}
                  >
                    ✨ Live Calculated Data
                  </button>
                  <button
                    onClick={() => setStatsMode('manual')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${statsMode === 'manual'
                      ? 'bg-[#071B4D] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#071B4D]'
                      }`}
                  >
                    📝 Manual CMS Stats
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 py-8 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
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
                      labelVal = "Students Placed";
                    } else if (st.label.toLowerCase().includes('partner') || st.label.toLowerCase().includes('hiring') || st.label.toLowerCase().includes('compan')) {
                      countVal = `${numPartners * 4 + 12}+`;
                      labelVal = "Hiring Partners";
                    } else if (st.label.toLowerCase().includes('college') || st.label.toLowerCase().includes('universit')) {
                      countVal = `${numColleges}+`;
                      labelVal = "Partner Colleges";
                    } else {
                      countVal = `${numPlaced * 150 + 450}+`;
                      labelVal = "Students Trained";
                    }
                  }

                  return (
                    <div
                      key={st.id || i}
                      className="flex flex-col items-center justify-center px-4 md:border-r border-slate-100 last:border-r-0"
                    >
                      <span
                        onClick={(e) => handleElementClick(e, `content.stats.${i}.count`, st.count)}
                        className={`text-3xl md:text-5xl font-display font-black text-[#071B4D] tracking-tight ${editableClass(`content.stats.${i}.count`)}`}
                      >
                        {countVal}
                      </span>
                      <span
                        onClick={(e) => handleElementClick(e, `content.stats.${i}.label`, st.label)}
                        className={`text-[10px] md:text-xs font-sans font-bold text-slate-500 uppercase tracking-widest mt-1.5 text-center max-w-[150px] ${editableClass(`content.stats.${i}.label`)}`}
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

            <div className={content.cards?.length > 4 ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"}>
              {(content.cards || [])
                .filter((wc: any) => wc.visible !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((wc: any, i: number) => {
                  if (content.cards?.length > 4) {
                    return (
                      <div
                        key={wc.id || i}
                        className="flex flex-col items-center text-center p-5 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/10 transition-all duration-300 group"
                      >
                        <div className="h-16 w-16 bg-[#eef2ff] border border-blue-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                          {wc.image ? (
                            <img src={wc.image} alt={wc.title} className="h-10 w-10 object-contain rounded-xl" referrerPolicy="no-referrer" />
                          ) : (
                            renderIcon(wc.icon || "Award", "h-7 w-7 text-blue-600")
                          )}
                        </div>
                        <span 
                          onClick={(e) => handleElementClick(e, `content.cards.${i}.title`, wc.title)}
                          className={`text-xs sm:text-sm font-display font-black text-[#071B4D] mt-3 leading-tight ${editableClass(`content.cards.${i}.title`)}`}
                        >
                          {wc.title}
                        </span>
                      </div>
                    );
                  }

                  return (
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
                      {wc.desc && (
                        <p
                          onClick={(e) => handleElementClick(e, `content.cards.${i}.desc`, wc.desc)}
                          className={`text-xs text-slate-500 font-sans leading-relaxed ${editableClass(`content.cards.${i}.desc`)}`}
                        >
                          {wc.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
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
            {/* Banner Badge */}
            <div className="flex justify-center">
              <span className="bg-[#071B4D] text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-6 py-2 rounded-md font-mono shadow-sm">
                11. BLOG PAGE
              </span>
            </div>

            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans text-sm">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allBlogs?.slice(0, 3).map((blog: any, idx: number) => (
                <div
                  key={blog.id || idx}
                  onClick={() => setActiveReaderBlog(blog)}
                  className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group text-left h-full cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-50">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[9px] font-black uppercase text-white bg-[#071B4D] px-2.5 py-1 rounded shadow-sm">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <h3 className="font-display font-black text-[#071B4D] text-lg md:text-xl leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mt-auto pt-2">
                      <Icons.Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{blog.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => { window.location.hash = '#/blog'; }}
                className="bg-[#071B4D] hover:bg-[#071B4D]/90 text-white font-sans font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>View All Blogs</span>
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
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
                className={`text-2xl md:text-4xl font-display font-black text-[#071B4D] ${editableClass('title')}`}
                style={{ color: design.headingColor }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  onClick={(e) => handleElementClick(e, 'subtitle', subtitle)}
                  className={`text-sm text-slate-500 font-sans ${editableClass('subtitle')}`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div className="relative mt-8 flex flex-col items-center">
              {/* Horizontal connecting line for desktop (visible on lg screens) */}
              <div className="hidden lg:block absolute top-8 left-12 right-12 h-0.5 border-t-2 border-dashed border-blue-200 z-0" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 w-full max-w-6xl relative z-10">
                {(content.steps || []).map((st: any, i: number) => (
                  <div key={st.id || i} className="flex flex-col items-center text-center relative group">
                    {/* Circle icon container */}
                    <div className="h-16 w-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-sm group-hover:scale-110 group-hover:bg-blue-50 hover:border-[#071B4D] transition-all duration-200">
                      {renderIcon(st.icon || 'HelpCircle', "h-6 w-6 text-blue-600")}
                    </div>

                    {/* Desktop connecting dot in the middle of steps */}
                    {i < (content.steps?.length || 0) - 1 && (
                      <div className="hidden lg:block absolute top-[30px] left-[calc(100%_-_16px)] w-2.5 h-2.5 bg-blue-500 rounded-full z-10 border-2 border-white -translate-x-1/2" />
                    )}

                    <span
                      onClick={(e) => handleElementClick(e, `content.steps.${i}.label`, st.label)}
                      className={`text-xs font-extrabold text-[#071B4D] mt-2.5 tracking-tight px-1 ${editableClass(`content.steps.${i}.label`)}`}
                    >
                      {st.label}
                    </span>
                    {st.desc && (
                      <p
                        onClick={(e) => handleElementClick(e, `content.steps.${i}.desc`, st.desc)}
                        className={`text-[10px] text-slate-500 mt-1.5 leading-normal max-w-[140px] font-sans ${editableClass(`content.steps.${i}.desc`)}`}
                      >
                        {st.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
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
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${storiesMode === 'auto'
                    ? 'bg-[#071B4D] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#071B4D]'
                    }`}
                >
                  🔥 Auto-Synced Placed Registry
                </button>
                <button
                  onClick={() => setStoriesMode('manual')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${storiesMode === 'manual'
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

        {/* STORIES & PARTNERS SIDE-BY-SIDE SECTION */}
        {type === 'stories-and-partners' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Success Stories (7 columns on large screens) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[480px]">
              <div>
                <h3 className="text-xl font-display font-black text-[#071B4D] mb-6 flex items-center gap-2 border-b border-slate-50 pb-3">
                  <Icons.Award className="h-5 w-5 text-blue-600" />
                  <span>Success Stories</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {allPlacedStudents.slice(0, 3).map((st: any, idx: number) => (
                    <div
                      key={st.id || idx}
                      className="bg-slate-50/50 border border-slate-100/80 p-4 rounded-xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-200"
                    >
                      <img
                        src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"}
                        alt={st.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-extrabold text-xs text-[#071B4D] mt-3 truncate w-full">{st.name}</span>
                      <span className="text-[10px] text-slate-500 font-bold truncate w-full mt-0.5">{st.branch || "Software Engineer"}</span>
                      <span className="text-[9px] text-[#071B4D] font-extrabold px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100 mt-1">{st.company}</span>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 w-full flex flex-col items-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Package</span>
                        <span className="text-xs font-black text-[#071B4D] mt-0.5">{st.packageLpa || "LPA"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => { window.location.hash = '#/placed-students'; }}
                  className="px-6 py-2.5 bg-[#071B4D] hover:bg-[#F7C400] text-white hover:text-[#071B4D] font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition-all shadow duration-200 cursor-pointer"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Right Column: Our Hiring Partners (5 columns on large screens) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[480px]">
              <div>
                <h3 className="text-xl font-display font-black text-[#071B4D] mb-6 flex items-center gap-2 border-b border-slate-50 pb-3">
                  <Icons.Building className="h-5 w-5 text-blue-600" />
                  <span>Our Hiring Partners</span>
                </h3>
                
                <div className="grid grid-cols-4 gap-4 items-center justify-items-center py-2">
                  {allHiringPartners.slice(0, 8).map((partner: any) => {
                    const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                    return (
                      <div
                        key={partner.id}
                        className="flex items-center justify-center p-2 border border-slate-100 rounded-lg bg-slate-50/20 hover:bg-slate-50/50 w-full aspect-square"
                        title={partner.name}
                      >
                        {isLogoUrl ? (
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="h-8 w-auto object-contain max-h-[40px] opacity-80 hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-400 hover:text-[#071B4D] text-center tracking-tight font-display line-clamp-2">{partner.name}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => { window.location.hash = '#/companies'; }}
                  className="px-6 py-2.5 bg-[#071B4D] hover:bg-[#F7C400] text-white hover:text-[#071B4D] font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition-all shadow duration-200 cursor-pointer"
                >
                  View All Companies
                </button>
              </div>
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${partnersFilter === cat
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${partnersLayout === 'carousel'
                      ? 'bg-white text-[#071B4D] shadow'
                      : 'text-slate-500 hover:text-[#071B4D]'
                      }`}
                  >
                    Smooth Slider
                  </button>
                  <button
                    onClick={() => setPartnersLayout('grid')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${partnersLayout === 'grid'
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

              const filteredPartners = allHiringPartners
                .filter(p => p.isVisible !== false)
                .filter(partner => {
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
                const duplicatePartners = filteredPartners.length > 0 
                  ? [...filteredPartners, ...filteredPartners, ...filteredPartners] 
                  : [];
                return (
                  <div className="w-full overflow-hidden relative py-6 mt-2 bg-slate-50/20 rounded-2xl border border-slate-100/50">
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-12 items-center animate-marquee whitespace-nowrap min-w-full">
                      {duplicatePartners.map((partner, idx) => {
                        const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                        return (
                          <div
                            key={`${partner.id}-${idx}`}
                            className="inline-flex items-center justify-center shrink-0 select-none px-4"
                          >
                            {isLogoUrl ? (
                              <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className="h-10 md:h-12 w-auto object-contain max-w-[140px] opacity-75 hover:opacity-100 transition-opacity duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-xl font-black text-slate-400 hover:text-slate-800 transition-colors tracking-tight font-display">{partner.name}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center mt-6 py-6">
                  {filteredPartners.map((partner) => {
                    const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                    return (
                      <div
                        key={partner.id}
                        className="flex items-center justify-center p-4 transition-all duration-300 hover:scale-105"
                      >
                        {isLogoUrl ? (
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="h-10 md:h-12 w-auto object-contain max-w-[140px] opacity-75 hover:opacity-100 transition-opacity duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-400 hover:text-slate-800 transition-colors tracking-tight font-display">{partner.name}</span>
                        )}
                      </div>
                    );
                  })}
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
        {/* {type === 'about-main' && (
          <div className="max-w-7xl mx-auto px-4 md:px-0 py-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-35 items-center">
              <div className=" lg:col-span-6">
                <h2 
                  onClick={(e) => handleElementClick(e, 'title', title)}
                  className={`text-3xl md:text-4xl font-display font-extrabold ${editableClass('title')}`}
                  style={{ color: design.headingColor }}
                >
                  {title}
                </h2>
                <p 
                  onClick={(e) => handleElementClick(e, 'content.description', content.description)}
                  className={`mt-4 text-lg text-slate-600 leading-relaxed font-sans ${editableClass('content.description')}`}
                >
                  {content.description}
                </p>
              </div>
              <div className="lg:col-span-5 flex justify-end">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 w-full max-full items-center text-center">
                  <div className="overflow-hidden items-center rounded-2xl mb-4">
                    {content.founderImage ? (
                      <img src={content.founderImage} alt={content.founderName} className="w-100 h-100 object-cover " />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </div>
                  <h3 
                    onClick={(e) => handleElementClick(e, 'content.founderName', content.founderName)}
                    className={`font-display font-bold text-lg ${editableClass('content.founderName')}`}
                  >
                    {content.founderName}
                  </h3>
                  {content.founderRole && (
                    <p className={`text-xs text-slate-500 mt-1 ${editableClass('content.founderRole')}`}>{content.founderRole}</p>
                  )}
                  {content.founderSignature && (
                    <img src={content.founderSignature} alt="signature" className="mt-4 mx-auto h-12 object-contain" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )} */}
        {type === 'about-main' && (
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* LEFT COLUMN: ABOUT + MISSION + VISION + WHY CHOOSE US */}
              <div className="lg:col-span-7 flex flex-col justify-start">
                <h2
                  onClick={(e) => handleElementClick(e, 'title', title)}
                  className={`text-4xl lg:text-5xl font-display font-extrabold leading-tight text-slate-900 ${editableClass('title')}`}
                >
                  {title}
                </h2>

                <p
                  onClick={(e) => handleElementClick(e, 'content.description', content.description)}
                  className={`mt-6 text-base leading-relaxed text-slate-600 font-sans ${editableClass('content.description')}`}
                >
                  {content.description}
                </p>
              </div>
              {/* RIGHT COLUMN: FOUNDER PROFILE CARD */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col w-full max-w-sm">
                  {/* Founder Image Container with soft background */}
                  <div className="p-4 bg-slate-50/50 flex-1 flex items-center justify-center">
                    {content.founderImage ? (
                      <div className="w-full relative aspect-[4/5] rounded-xl overflow-hidden shadow-inner border border-slate-100/60 bg-gradient-to-b from-blue-50 to-slate-100">
                        <img
                          src={content.founderImage}
                          alt={content.founderName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/5] bg-slate-100 flex items-center justify-center text-slate-400 rounded-xl">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Founder Footer block */}
                  <div className="bg-white py-5 px-6 border-t border-slate-100/80 text-center">
                    <h3
                      onClick={(e) => handleElementClick(e, 'content.founderName', content.founderName)}
                      className={`text-xl font-display font-extrabold text-[#002060] ${editableClass('content.founderName')}`}
                    >
                      {content.founderName}
                    </h3>
                    {content.founderRole && (
                      <p
                        onClick={(e) => handleElementClick(e, 'content.founderRole', content.founderRole)}
                        className={`text-sm text-slate-500 mt-1 leading-relaxed font-sans ${editableClass('content.founderRole')}`}
                      >
                        {content.founderRole}
                      </p>
                    )}
                  </div>
                </div>
              </div>
</div>
              {/* MISSION STATEMENT ROW */}
              <div className="flex items-start gap-5 mt-10 text-left">
                <div
                  onClick={(e) => handleElementClick(e, 'content.missionImage', content.missionImage || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300")}
                  className={`w-16 h-16 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden cursor-pointer ${editableClass('content.missionImage')}`}
                  title="Click to edit Mission Image"
                >
                  <img
                    src={content.missionImage || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300"}
                    alt="Mission"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    onClick={(e) => handleElementClick(e, 'content.missionTitle', content.missionTitle)}
                    className={`text-xl font-display font-extrabold text-slate-900 ${editableClass('content.missionTitle')}`}
                  >
                    {content.missionTitle || "Our Mission"}
                  </h3>
                  <p
                    onClick={(e) => handleElementClick(e, 'content.missionDesc', content.missionDesc)}
                    className={`mt-1 text-sm text-slate-600 leading-relaxed font-sans ${editableClass('content.missionDesc')}`}
                  >
                    {content.missionDesc}
                  </p>
                </div>
              </div>

              {/* VISION STATEMENT ROW */}
              <div className="flex items-start gap-5 mt-8 text-left">
                <div
                  onClick={(e) => handleElementClick(e, 'content.visionImage', content.visionImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=300")}
                  className={`w-16 h-16 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden cursor-pointer ${editableClass('content.visionImage')}`}
                  title="Click to edit Vision Image"
                >
                  <img
                    src={content.visionImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=300"}
                    alt="Vision"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    onClick={(e) => handleElementClick(e, 'content.visionTitle', content.visionTitle)}
                    className={`text-xl font-display font-extrabold text-slate-900 ${editableClass('content.visionTitle')}`}
                  >
                    {content.visionTitle || "Our Vision"}
                  </h3>
                  <p
                    onClick={(e) => handleElementClick(e, 'content.visionDesc', content.visionDesc)}
                    className={`mt-1 text-sm text-slate-600 leading-relaxed font-sans ${editableClass('content.visionDesc')}`}
                  >
                    {content.visionDesc}
                  </p>
                </div>
              </div>

              {/* WHY CHOOSE US ROW */}
              <div className="flex items-start gap-5 mt-8 text-left">
                <div
                  onClick={(e) => handleElementClick(e, 'content.whyImage', content.whyImage || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300")}
                  className={`w-16 h-16 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden cursor-pointer ${editableClass('content.whyImage')}`}
                  title="Click to edit Why Us Image"
                >
                  <img
                    src={content.whyImage || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"}
                    alt="Why Choose Us"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    onClick={(e) => handleElementClick(e, 'content.whyTitle', content.whyTitle)}
                    className={`text-xl font-display font-extrabold text-slate-900 ${editableClass('content.whyTitle')}`}
                  >
                    {content.whyTitle || "Why Choose Us?"}
                  </h3>

                  {/* Checklist */}
                  <div className="flex flex-col gap-3 mt-4">
                    {(content.whyPoints || []).map((pt: any, idx: number) => (
                      <div key={pt.id || idx} className="flex items-start gap-2.5 text-left">
                        <div className="bg-blue-50 text-blue-600 rounded-full p-0.5 mt-0.5 shrink-0">
                          <svg className="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          onClick={(e) => handleElementClick(e, `content.whyPoints.${idx}.text`, pt.text)}
                          className={`text-sm md:text-base font-semibold text-slate-800 ${editableClass(`content.whyPoints.${idx}.text`)}`}
                        >
                          {pt.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>



            
          </div>
        )}

        {/* 8. MISSION & VISION SECTION (Images instead of icons) */}
        {type === 'mission-vision' && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 w-full">
              <div
                style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                className="p-8 rounded-2xl border shadow-sm flex flex-col gap-4 items-start text-left"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {content.missionImage ? (
                    <img src={content.missionImage} alt="mission" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-xs font-mono">No Image</span>
                  )}
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
              <div className="w-full">
                <div
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="p-8 rounded-2xl border shadow-sm flex flex-col gap-4 items-start text-left"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {content.visionImage ? (
                      <img src={content.visionImage} alt="vision" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 text-xs font-mono">No Image</span>
                    )}
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
            </div>
          </div>
        )}

        {/* 9. WHY US LIST (ABOUT US) */}
        {type === 'why-us-list' && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-10 text-center" style={{ color: design.headingColor }}>
              {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.points?.map((pt: any, i: number) => (
                <div key={pt.id} className="flex gap-4 text-left items-start">
                  <div className="shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {pt.image ? (
                      <img src={pt.image} alt={pt.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400">No Image</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3
                      onClick={(e) => handleElementClick(e, `content.points.${i}.title`, pt.title)}
                      className="font-display font-bold text-slate-900 text-base"
                    >{pt.title}</h3>
                    <p
                      onClick={(e) => handleElementClick(e, `content.points.${i}.desc`, pt.desc)}
                      className="text-sm text-slate-500 font-sans leading-relaxed"
                    >{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. ABOUT JOURNEY (MILESTONES) - Horizontal timeline on desktop */}
        {type === 'about-journey' && (
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 text-left">
            <h2
              onClick={(e) => handleElementClick(e, 'title', title)}
              className={`text-2xl font-display font-extrabold text-slate-900 mb-8 ${editableClass('title')}`}
            >
              {title}
            </h2>

            <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative w-full">
                {content.milestones?.map((m: any, i: number) => {
                  const isLast = i === content.milestones.length - 1;
                  return (
                    <React.Fragment key={`${m.id || 'milestone'}-${i}`}>
                      <div className="flex flex-col items-center text-center flex-1 z-10">
                        {/* Icon Container */}
                        <div
                          onClick={(e) => handleElementClick(e, `content.milestones.${i}.image`, m.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300")}
                          className={`w-16 h-16 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0 mb-4 shadow-sm cursor-pointer ${editableClass(`content.milestones.${i}.image`)}`}
                          title="Click to edit Milestone Image"
                        >
                          <img
                            src={m.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"}
                            alt={m.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Year */}
                        <div className="text-xl font-display font-black text-slate-900 leading-none">{m.year}</div>

                        {/* Title */}
                        <h4
                          onClick={(e) => handleElementClick(e, `content.milestones.${i}.title`, m.title)}
                          className={`text-sm md:text-base font-extrabold text-slate-800 mt-2 cursor-pointer ${editableClass(`content.milestones.${i}.title`)}`}
                        >
                          {m.title}
                        </h4>

                        {/* Desc */}
                        <p
                          onClick={(e) => handleElementClick(e, `content.milestones.${i}.desc`, m.desc)}
                          className={`text-xs text-slate-500 mt-1 max-w-[160px] cursor-pointer leading-relaxed ${editableClass(`content.milestones.${i}.desc`)}`}
                        >
                          {m.desc}
                        </p>
                      </div>

                      {/* Connection Line with Center Blue Dot */}
                      {!isLast && (
                        <div className="hidden md:flex flex-1 items-center justify-center relative px-2">
                          <div className="w-full border-t-2 border-dashed border-slate-200 relative">
                            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
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
              {(content.services || []).map((serv: any, i: number) => (
                <div
                  key={serv.id || i}
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="bg-white p-5 rounded-xl border text-center items-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group"
                >
                  <div
                    onClick={(e) =>
                      handleElementClick(
                        e,
                        `content.services.${i}.image`,
                        serv.image ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"
                      )
                    }
                    className={`flex items-center justify-center w-12 h-12 mb-1 cursor-pointer shrink-0 ${editableClass(
                      `content.services.${i}.image`
                    )}`}
                    title="Click to edit Service Image"
                  >
                    <img
                      src={
                        serv.image ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"
                      }
                      alt={serv.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <h3 
                    onClick={(e) => handleElementClick(e, `content.services.${i}.title`, serv.title)}
                    className={`font-display font-bold text-[#071B4D] text-lg cursor-pointer ${editableClass(`content.services.${i}.title`)}`}
                  >
                    {serv.title}
                  </h3>
                  <p 
                    onClick={(e) => handleElementClick(e, `content.services.${i}.desc`, serv.desc || '')}
                    className={`text-sm text-slate-500 leading-relaxed font-sans cursor-pointer ${editableClass(`content.services.${i}.desc`)}`}
                  >
                    {serv.desc || ''}
                  </p>
                  
                  {serv.buttonText && serv.buttonLink && (
                    <a
                      href={serv.buttonLink}
                      className="mt-auto inline-flex items-center justify-center rounded-full bg-slate-950 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-all"
                    >
                      {serv.buttonText}
                    </a>
                  )}
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

            {/* Students Grid/List Table (Desktop View) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left text-xs font-sans">
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

            {/* Students Beautiful Cards (Mobile View) */}
            <div className="md:hidden flex flex-col gap-4">
              {allPlacedStudents
                .filter(st => {
                  const mName = st.name.toLowerCase().includes(studentSearch.toLowerCase());
                  const mColl = studentCollege === 'All' || st.college === studentCollege;
                  const mComp = studentCompany === 'All' || st.company === studentCompany;
                  const mYr = studentBranch === 'All' || st.year === studentBranch;
                  return mName && mColl && mComp && mYr;
                })
                .map((st) => (
                  <div key={st.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-left flex flex-col gap-4">
                    {/* Header Row: Avatar + Name + Year */}
                    <div className="flex items-center gap-3">
                      <img src={st.avatar} alt={st.name} className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0 animate-fade-in" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-base">{st.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Class of {st.year}</span>
                      </div>
                    </div>
                    
                    {/* Details Row: College & Branch */}
                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">College & Branch</span>
                      <span className="font-semibold text-slate-800 text-xs">{st.college}</span>
                      <span className="text-slate-500 text-[10px]">{st.branch}</span>
                    </div>

                    {/* Company & Package Row */}
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Company Placed</span>
                        <div className="flex items-center gap-1.5 font-bold text-blue-600 text-xs">
                          <Icons.Building className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{st.company}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Salary Package</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full font-mono text-xs">
                          {st.packageLpa}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-12 items-center justify-items-center py-6">
              {allHiringPartners.filter(p => p.isVisible !== false).map((partner) => {
                const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                return (
                  <div
                    key={partner.id}
                    className="flex items-center justify-center p-4 transition-all duration-300 hover:scale-105 select-none"
                  >
                    {isLogoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-10 md:h-12 w-auto object-contain max-w-[150px] opacity-80 hover:opacity-100 transition-opacity duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xl font-extrabold text-[#071B4D] tracking-tight font-display">{partner.name}</span>
                    )}
                  </div>
                );
              })}
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
        {type === 'courses-tabs' && (() => {
          const filteredCourses = allCourses.filter(c => c.category === activeCourseCategory);
          
          const renderCourseLogo = (course: Course) => {
            if (course.imageUrl && (course.imageUrl.startsWith('http') || course.imageUrl.startsWith('/') || course.imageUrl.startsWith('data:'))) {
              return (
                <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 p-1.5 shadow-sm">
                  <img src={course.imageUrl} alt={course.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </div>
              );
            }

            // High-fidelity fallback badges matching the screenshot colors and characters exactly
            const lowerName = course.name.toLowerCase();
            if (lowerName.includes('java programming') || lowerName.includes('core java')) {
              return (
                <div className="w-16 h-16 rounded-xl bg-[#F5F3FF] flex items-center justify-center border border-[#DDD6FE] shrink-0 shadow-sm">
                  <span className="text-[#6D28D9] font-mono text-xl font-bold">&lt;/&gt;</span>
                </div>
              );
            }
            if (lowerName.includes('python')) {
              return (
                <div className="w-16 h-16 rounded-xl bg-[#ECFDF5] flex items-center justify-center border border-[#A7F3D0] shrink-0 shadow-sm">
                  <span className="text-[#059669] font-mono text-xl font-bold">&lt;/&gt;</span>
                </div>
              );
            }
            if (lowerName.includes('c & c++') || lowerName.includes('c++')) {
              return (
                <div className="w-16 h-16 rounded-xl bg-[#EFF6FF] flex items-center justify-center border border-[#BFDBFE] shrink-0 shadow-sm">
                  <span className="text-[#1D4ED8] font-sans text-xl font-black">C</span>
                </div>
              );
            }
            if (lowerName.includes('web development') || lowerName.includes('javascript') || lowerName.includes('html') || lowerName.includes('node')) {
              return (
                <div className="w-16 h-16 rounded-xl bg-[#FFFBEB] flex items-center justify-center border border-[#FDE68A] shrink-0 shadow-sm">
                  <span className="text-[#D97706] font-sans text-xl font-black">JS</span>
                </div>
              );
            }
            if (lowerName.includes('data structures') || lowerName.includes('dsa') || lowerName.includes('algorithms')) {
              return (
                <div className="w-16 h-16 rounded-xl bg-[#F5F3FF] flex items-center justify-center border border-[#DDD6FE] shrink-0 shadow-sm text-[#6D28D9]">
                  <Icons.Database className="h-7 w-7" />
                </div>
              );
            }
            if (lowerName.includes('sql') || lowerName.includes('database')) {
              return (
                <div className="w-16 h-16 rounded-xl bg-[#EFF6FF] flex items-center justify-center border border-[#BFDBFE] shrink-0 shadow-sm text-[#1D4ED8]">
                  <Icons.Cloud className="h-7 w-7" />
                </div>
              );
            }
            
            // Standard generic fallback based on category
            return (
              <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0 shadow-sm text-slate-400">
                <Icons.BookOpen className="h-7 w-7" />
              </div>
            );
          };

          return (
            <div>
              {/* Badge and Title Block */}
              <div className="flex flex-col items-center gap-3 text-center max-w-3xl mx-auto mb-10">
                <div className="bg-[#071B4D] text-white text-[11px] tracking-widest font-black uppercase px-6 py-1.5 rounded-md font-display">
                  6. COURSES
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D] tracking-tight mt-1">
                  {title || "Courses We Offer"}
                </h2>
                {subtitle && <p className="text-slate-500 font-sans text-sm md:text-base leading-relaxed mt-1">{subtitle}</p>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                {/* Left category tabs */}
                <div className="lg:col-span-4 flex flex-col gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
                  <h3 className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] mb-1 px-1">Course Categories</h3>
                  {[
                    { id: 'programming', label: 'Programming Courses', icon: 'Code', iconBg: 'bg-[#F5F3FF]', iconColor: 'text-[#6D28D9]' },
                    { id: 'aptitude', label: 'Aptitude Courses', icon: 'Calculator', iconBg: 'bg-[#EFF6FF]', iconColor: 'text-[#1D4ED8]' },
                    { id: 'soft-skills', label: 'Soft Skills', icon: 'User', iconBg: 'bg-[#ECFDF5]', iconColor: 'text-[#059669]' },
                    { id: 'interview', label: 'Interview Training', icon: 'UserCheck', iconBg: 'bg-[#FDF2F8]', iconColor: 'text-[#DB2777]' },
                    { id: 'database', label: 'Database', icon: 'Database', iconBg: 'bg-[#EFF6FF]', iconColor: 'text-[#1D4ED8]' },
                    { id: 'others', label: 'Others', icon: 'Layers', iconBg: 'bg-[#F3F4F6]', iconColor: 'text-[#4B5563]' }
                  ].map((cat) => {
                    const isActive = activeCourseCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCourseCategory(cat.id);
                          setExpandedCourseId(null);
                        }}
                        className={`flex items-center gap-4 w-full text-left p-3.5 rounded-xl font-display font-black text-sm tracking-tight transition-all duration-300 border ${isActive
                          ? 'bg-[#071B4D] text-[#F7C400] border-[#071B4D] shadow-md shadow-blue-900/10 scale-[1.02]'
                          : 'bg-white text-[#071B4D] hover:bg-slate-50 hover:border-slate-200 border-slate-100'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/10' : cat.iconBg}`}>
                          {renderIcon(cat.icon, `h-5 w-5 ${isActive ? 'text-[#F7C400]' : cat.iconColor}`)}
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Course List */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col divide-y divide-slate-100/80">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => {
                        const isExpanded = expandedCourseId === course.id;
                        return (
                          <div
                            key={course.id}
                            className={`flex flex-col py-6 first:pt-0 last:pb-0 transition-colors group cursor-pointer text-left`}
                            onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                          >
                            <div className="flex gap-4 sm:gap-6 items-start">
                              {/* Image or Logo Block */}
                              {renderCourseLogo(course)}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="text-lg sm:text-xl font-display font-black text-[#071B4D] tracking-tight hover:text-blue-700 transition-colors">
                                    {course.name}
                                  </h3>
                                  <div className="shrink-0 p-1.5 bg-slate-50 rounded-full text-slate-400 group-hover:text-[#071B4D] group-hover:bg-slate-100 transition-all">
                                    {isExpanded ? <Icons.ChevronUp className="h-4 w-4" /> : <Icons.ChevronDown className="h-4 w-4" />}
                                  </div>
                                </div>
                                <p className="text-slate-500 font-sans text-sm md:text-base leading-relaxed mt-1">
                                  {course.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400 font-bold font-sans mt-3 tracking-wide uppercase">
                                  <span>Duration: {course.duration}</span>
                                  <span className="text-slate-200">|</span>
                                  <span className="inline-flex items-center gap-1">
                                    Level: <span className="text-[#071B4D] font-extrabold">{course.level || 'Beginner'}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Collapsible syllabus details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4 pl-0 sm:pl-22 text-left">
                                    <h4 className="font-extrabold text-[#071B4D] uppercase tracking-wider text-[10px]">What you will learn inside this module:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                                      {course.topics.map((topic, ti) => (
                                        <div key={ti} className="flex items-center gap-2.5">
                                          <Icons.CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                                          <span className="font-semibold text-slate-700 font-sans text-sm">{topic}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <a
                                      href="#contact"
                                      className="mt-4 px-6 py-2.5 bg-[#071B4D] hover:bg-blue-950 text-white text-[11px] font-bold uppercase rounded-lg w-fit tracking-wider shadow-md hover:shadow-lg transition-all"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Avoid collapsing
                                      }}
                                    >
                                      Enquiry Now & Get Demo
                                    </a>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
                        <Icons.BookOpen className="h-12 w-12 text-slate-300 mb-2 animate-pulse" />
                        <p className="font-sans font-semibold">No courses added in this category yet.</p>
                      </div>
                    )}
                  </div>

                  {/* View All Courses Button */}
                  <div className="flex justify-center mt-4">
                    <a
                      href="#contact"
                      className="px-8 py-3.5 bg-[#071B4D] hover:bg-blue-950 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all tracking-wider"
                    >
                      View All Courses
                    </a>
                  </div>
                </div>
              </div>

              {/* Ready to start your journey? CTA Banner */}
              <div className="mt-16 w-full bg-[#071B4D] text-white p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between text-left gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white">
                    Ready to start your journey?
                  </h3>
                  <p className="text-slate-300 font-sans text-sm md:text-base">
                    Register now and get a free demo class.
                  </p>
                </div>
                <a
                  href="#contact"
                  className="px-8 py-4 bg-[#F7C400] hover:bg-[#e2b400] text-slate-950 text-xs sm:text-sm font-black uppercase rounded-xl shadow-lg transition-all hover:scale-105 shrink-0"
                >
                  Register Now
                </a>
              </div>
            </div>
          );
        })()}

        {/* 15. STUDENT LMS DASHBOARD */}
        {type === 'lms-dashboard' && (() => {
          // Extract content with default values
          const sName = content.studentName || "Pratham Joshi";
          const sId = content.studentId || "TPX-2026-089";
          const nText = content.notificationText || "Reminder: Upcoming Live Class on Aptitude - Percentage begins in 15 minutes.";

          const cIconUrl = content.coursesIconUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=150";
          const cLabel = content.coursesLabel || "My Courses";
          const cVal = content.coursesValue || "5 Enrolled";

          const clIconUrl = content.classesIconUrl || "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=150";
          const clLabel = content.classesLabel || "Live Classes";
          const clVal = content.classesValue || "2 Upcoming";

          const aIconUrl = content.assignmentsIconUrl || "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=150";
          const aLabel = content.assignmentsLabel || "Assignments";
          const aVal = content.assignmentsValue || "3 Pending";

          const tIconUrl = content.testsIconUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=150";
          const tLabel = content.testsLabel || "Mock Tests";
          const tVal = content.testsValue || "4 Pending";

          const progItems = content.progressItems || [
            { name: "Java Programming", progress: 75 },
            { name: "Web Development", progress: 50 },
            { name: "Aptitude Training", progress: 100 }
          ];

          const liveTitle = content.liveClassTitle || "Aptitude - Percentage";
          const liveInst = content.liveClassInstructor || "By Ravi Sir";
          const liveSch = content.liveClassSchedule || "Tomorrow, 11:00 AM";
          const liveBtn = content.liveClassBtnText || "Join Class";

          const vidThumbnail = content.videoThumbnailUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600";
          const vidUrl = content.videoUrl || "https://www.youtube.com";

          const gLogoUrl = content.googleLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";
          const gRating = content.googleRating || "4.8";
          const gReviews = content.googleReviewsText || "Based on 500+ Reviews";
          const gBtn = content.googleBtnText || "Read Reviews";
          const gLink = content.googleReviewsLink || "https://google.com";

          const recentActs = content.recentActivities || [
            { id: "act-1", title: "Java Basics", type: "Live Class", status: "Completed", date: "10 May 2024", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" },
            { id: "act-2", title: "Data Structures", type: "Assignment", status: "Submitted", date: "09 May 2024", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
            { id: "act-3", title: "Aptitude Mock Test 1", type: "Mock Test", status: "In Progress", date: "09 May 2024", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
            { id: "act-4", title: "Resume Building", type: "Live Class", status: "Completed", date: "08 May 2024", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
            { id: "act-5", title: "Interview Skills", type: "Live Class", status: "Upcoming", date: "11 May 2024", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" }
          ];

          return (
            <div className="flex flex-col gap-1 w-full">
              {/* Outer Header Section */}
              <div className="flex flex-col gap-1.5 mb-6 text-left">
                <div className="bg-[#071B4D] text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] self-start inline-block shadow-sm">
                  7. LMS / STUDENT PORTAL
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-[#071B4D] tracking-tight">Student Dashboard</h2>
              </div>

              {/* Main LMS Dashboard Container */}
              <div className="bg-slate-50 border border-slate-200 text-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row text-xs font-sans text-left w-full">
                {/* Sidebar Menu Panel */}
                <div className="lg:w-64 bg-[#071B4D] p-6 flex flex-col gap-1 justify-between shrink-0 border-r border-slate-200">
                  <div className="flex flex-col gap-6">
                    {/* Profile Card */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#F7C400] text-slate-900 font-black rounded-lg flex items-center justify-center text-sm shadow shrink-0">
                        {sName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-white text-sm truncate">{sName}</span>
                        <span className="text-[10px] text-slate-300 font-mono tracking-wider">{sId}</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Dashboard Options */}
                    <div className="flex flex-col gap-1">
                      {[
                        { id: 'dashboard', label: 'Student Dashboard', icon: Icons.LayoutDashboard },
                        { id: 'courses', label: 'My Courses', icon: Icons.BookOpen },
                        { id: 'classes', label: 'Live Lectures', icon: Icons.Video },
                        { id: 'assignments', label: 'Assignments', icon: Icons.FileText },
                        { id: 'tests', label: 'Mock Drills', icon: Icons.Award },
                        { id: 'support', label: 'System Support', icon: Icons.HelpCircle }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveLmsTab(item.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left w-full ${activeLmsTab === item.id
                            ? 'bg-white/10 text-[#F7C400] font-extrabold border-l-4 border-[#F7C400]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <item.icon className={`h-4 w-4 shrink-0 ${activeLmsTab === item.id ? 'text-[#F7C400]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Tantrapex LMS v2.4</span>
                  </div>
                </div>

                {/* Dashboard Content Container */}
                <div className="flex-1 p-6 md:p-8 bg-slate-100/30 flex flex-col gap-6">

                  {/* Reminder Banner */}
                  <div className="bg-[#071B4D]/5 border border-[#071B4D]/15 text-[#071B4D] p-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <Icons.Bell className="h-4 w-4 text-[#071B4D] shrink-0 animate-bounce" />
                    <span className="font-semibold text-[11px] md:text-xs">{nText}</span>
                  </div>

                  {activeLmsTab === 'dashboard' && (
                    <div className="flex flex-col gap-6 w-full">
                      {/* Stats Row with Admin changeable Images instead of icons */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {[
                          { label: cLabel, value: cVal, img: cIconUrl, border: "border-blue-100" },
                          { label: clLabel, value: clVal, img: clIconUrl, border: "border-purple-100" },
                          { label: aLabel, value: aVal, img: aIconUrl, border: "border-amber-100" },
                          { label: tLabel, value: tVal, img: tIconUrl, border: "border-emerald-100" }
                        ].map((stat, si) => (
                          <div key={si} className={`bg-white p-5 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-transform hover:scale-[1.02] w-full`}>
                            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-100 p-1 shrink-0 shadow-inner">
                              <img src={stat.img} alt={stat.label} className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                            <span className="text-sm font-black text-[#071B4D]">{stat.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Active Progress & Upcoming Classes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Course Progress Tracker */}
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <h3 className="font-display font-extrabold text-[#071B4D] text-xs uppercase tracking-wider">Your Progress Tracker</h3>
                          </div>

                          <div className="flex flex-col gap-4">
                            {progItems.map((item: any, idx: number) => (
                              <div key={idx} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                                  <span>{item.name}</span>
                                  <span className="text-emerald-600 font-mono">{item.progress}% Complete</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Upcoming Live Class */}
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">Upcoming Live Class</span>
                            <h4 className="text-base font-display font-black text-[#071B4D] leading-tight">{liveTitle}</h4>
                            <div className="flex flex-col gap-1 mt-1 text-slate-600 font-semibold">
                              <span className="text-slate-500 text-xs">{liveInst}</span>
                              <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1">
                                <Icons.Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{liveSch}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setLmsAlert("Connecting to live streaming node... Launching classroom session.");
                              setTimeout(() => setLmsAlert(null), 3000);
                            }}
                            className="w-full py-3 bg-[#071B4D] hover:bg-blue-950 text-white font-extrabold uppercase tracking-wide rounded-lg transition-colors text-[10px]"
                          >
                            {liveBtn}
                          </button>
                        </div>
                      </div>

                      {/* Video Player & Google Reviews Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Video block */}
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <h3 className="font-display font-extrabold text-[#071B4D] text-xs uppercase tracking-wider">Featured Video Guides</h3>
                          </div>
                          <a href={vidUrl} target="_blank" rel="noreferrer" className="relative group block rounded-xl overflow-hidden aspect-video border border-slate-100 shadow-sm">
                            <img src={vidThumbnail} alt="Video Playback" className="h-full w-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-colors group-hover:bg-black/35">
                              <div className="h-12 w-12 bg-white/95 text-[#071B4D] rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                <Icons.Play className="h-5 w-5 ml-1 text-[#071B4D] fill-current" />
                              </div>
                            </div>
                          </a>
                        </div>

                        {/* Google Rating block */}
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <img src={gLogoUrl} alt="Google Reviews" className="h-6 object-contain" referrerPolicy="no-referrer" />
                            <div className="flex flex-col items-center mt-1">
                              <span className="text-3xl font-black text-slate-800 tracking-tight">{gRating}</span>
                              {/* Stars */}
                              <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Icons.Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wide">{gReviews}</span>
                            </div>
                          </div>
                          <a
                            href={gLink}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full block text-center py-3 bg-[#071B4D] hover:bg-blue-950 text-white font-extrabold uppercase tracking-wide rounded-lg transition-colors text-[10px] shadow-sm"
                          >
                            {gBtn}
                          </a>
                        </div>
                      </div>

                      {/* Recent Activities Section with student Images */}
                      <div className="flex flex-col gap-4 mt-2 w-full">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                          <h3 className="font-display font-extrabold text-[#071B4D] text-xs uppercase tracking-wider">Recent Batches Activity</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
                          {recentActs.map((act: any, idx: number) => {
                            // Status style
                            let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                            if (act.status === "Submitted") badgeColor = "bg-blue-50 text-blue-700 border-blue-100";
                            if (act.status === "In Progress") badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                            if (act.status === "Upcoming") badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100";

                            return (
                              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 w-full">
                                <div className="p-4 flex flex-col gap-2 text-left">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border self-start ${badgeColor}`}>
                                    {act.status}
                                  </span>
                                  <h5 className="font-bold text-slate-800 text-[11px] leading-tight line-clamp-2">{act.title}</h5>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">{act.type}</span>
                                  <span className="text-[10px] text-slate-500 font-medium">{act.date}</span>
                                </div>
                                
                                {/* Student image on activity card bottom */}
                                <div className="h-24 overflow-hidden relative border-t border-slate-100 bg-slate-50 shrink-0">
                                  <img src={act.image} alt={act.title} className="w-full h-full object-cover hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button 
                          onClick={() => {
                            setLmsAlert("Viewing expanded student activity logging dashboard.");
                            setTimeout(() => setLmsAlert(null), 3000);
                          }}
                          className="w-fit self-center px-8 py-3 bg-[#071B4D] hover:bg-blue-950 text-white font-extrabold uppercase tracking-wide rounded-xl mt-4 shadow"
                        >
                          View All Activity
                        </button>
                      </div>

                    </div>
                  )}

                  {activeLmsTab !== 'dashboard' && (
                    <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm w-full">
                      <Icons.Lock className="h-8 w-8 text-[#071B4D]/30 mb-3" />
                      <h3 className="font-bold text-[#071B4D] text-sm uppercase tracking-wide">Active Batch Enrollment Required</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">This module is currently locked. Contact your course coordinator counselor to assign your technical stream batch.</p>
                    </div>
                  )}

                  {lmsAlert && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg font-semibold text-[11px] text-center w-full shadow-sm animate-pulse">
                      {lmsAlert}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 16. CAMPUS AMBASSADOR PANEL */}
        {type === 'ambassador-main' && (
          <div className="flex flex-col gap-12 font-sans">
            {/* Top Badge & Header */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="px-5 py-2 bg-[#071B4D] text-white font-mono font-bold text-xs uppercase tracking-widest rounded-md shadow-sm">
                8. Campus Ambassador
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight" style={{ color: design.headingColor || "#071B4D" }}>
                {title || "Become a Campus Ambassador"}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 font-medium tracking-wide">
                {subtitle || "Lead. Learn. Earn."}
              </p>
            </div>

            {/* Middle Section: Benefits & Custom Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              <div className="lg:col-span-6 flex flex-col gap-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-[#071B4D]">
                  {content.benefitsTitle || "Benefits You Get"}
                </h3>

                <div className="flex flex-col gap-4 mt-2">
                  {(content.benefits || [
                    "Enhance Communication",
                    "Internship Opportunities",
                    "Leadership Exposure",
                    "Monthly Incentives",
                    "Placement Priority",
                    "Branding & Experience",
                    "Exclusive Trainings"
                  ]).map((benefit: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Icons.Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <span className="text-base text-slate-700 font-semibold">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    document.getElementById('ambassador-form-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-4 w-fit px-8 py-3.5 bg-[#071B4D] hover:bg-slate-900 text-white font-bold uppercase tracking-wider text-xs rounded transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Apply Now
                </button>
              </div>

              {/* Editable Campus Ambassador Image */}
              <div className="lg:col-span-6 flex justify-center items-center">
                <div className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50 p-4">
                  <img 
                    src={content.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"} 
                    alt="Campus Ambassador Illustration" 
                    className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Full Width Apply Now Form Container */}
            <div id="ambassador-form-section" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-lg max-w-4xl mx-auto w-full mt-6">
              <h3 className="font-display font-extrabold text-[#071B4D] text-2xl mb-8 text-center uppercase tracking-wide">
                {content.formTitle || "Apply Now"}
              </h3>
              
              {ambassadorSuccess ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center flex flex-col items-center gap-4 shadow-sm">
                  <Icons.CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
                  <span className="font-display font-bold text-xl">Application Submitted Successfully!</span>
                  <p className="text-sm text-slate-600 max-w-md">
                    Thank you, <strong className="text-slate-800">{ambassadorName}</strong>. Our HR coordinator will review your campus profile and contact you on WhatsApp/Email within 48 hours.
                  </p>
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
                      message: `Ambassador application from ${ambassadorCollege || "Unknown College"}. Course: ${ambassadorCourse}, City: ${ambassadorCity}, Year: ${ambassadorYear}. Reason: ${ambassadorWhy}`,
                      status: 'new'
                    });
                    setAmbassadorSuccess(true);
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"
                >
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={ambassadorName}
                      onChange={(e) => setAmbassadorName(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={ambassadorEmail}
                      onChange={(e) => setAmbassadorEmail(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">College / University</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your college name"
                      value={ambassadorCollege}
                      onChange={(e) => setAmbassadorCollege(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={ambassadorPhone}
                      onChange={(e) => setAmbassadorPhone(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">Course</label>
                    <select
                      value={ambassadorCourse}
                      onChange={(e) => setAmbassadorCourse(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    >
                      <option value="">Select your course</option>
                      <option value="Computer Science">Computer Science / B.Tech CSE</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="MCA">MCA / BCA</option>
                      <option value="MBA">MBA / BBA</option>
                      <option value="Other">Other Graduate Field</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your city"
                      value={ambassadorCity}
                      onChange={(e) => setAmbassadorCity(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">Year of Study</label>
                    <select
                      value={ambassadorYear}
                      onChange={(e) => setAmbassadorYear(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    >
                      <option value="">Select your year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated / Alumni</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left md:col-span-2">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">Why do you want to become Campus Ambassador?</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your answer here..."
                      value={ambassadorWhy}
                      onChange={(e) => setAmbassadorWhy(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-center mt-4">
                    <button className="px-8 py-4 bg-[#071B4D] hover:bg-slate-900 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all active:scale-95">
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Section: Past Ambassadors Row */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col gap-8 text-center">
              <h3 className="font-display font-extrabold text-[#071B4D] text-xl uppercase tracking-wider">
                {content.pastAmbassadorsTitle || "Our Past Ambassadors"}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(content.pastAmbassadors || [
                  { id: "pa-1", year: "2019", title: "Joined Journey", desc: "Our pioneer campus crew began here." },
                  { id: "pa-2", year: "2021", title: "Expanded to 50+ Colleges", desc: "Mentored over 500+ student leads across colleges." },
                  { id: "pa-3", year: "2023", title: "Expanded to India Wide", desc: "Established closed pooled networks across standard cities." },
                  { id: "pa-4", year: "2024+", title: "Expanding to more cities", desc: "Now adding dynamic tech nodes globally." }
                ]).map((item: any, idx: number) => {
                  const icons = [Icons.Users, Icons.Award, Icons.GraduationCap, Icons.TrendingUp];
                  const IconComp = icons[idx % icons.length] || Icons.Check;
                  return (
                    <div key={item.id || idx} className="bg-white p-6 rounded-2xl border border-slate-200/50 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all">
                      <div className="p-3.5 bg-blue-50 text-blue-600 rounded-full">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="font-display font-black text-2xl text-[#071B4D]">{item.year}</span>
                      <span className="font-bold text-slate-800 text-xs text-center leading-tight">{item.title}</span>
                      <span className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">{item.desc}</span>
                    </div>
                  );
                })}
              </div>
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
        {type === 'workshops-list' && (() => {
          const defaultUpcoming = [
            {
              id: "wk-1",
              title: "Resume Building Workshop",
              desc: "Learn to build ATS friendly resume",
              date: "25 May, 2025",
              location: "Bhopal",
              image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            },
            {
              id: "wk-2",
              title: "Interview Preparation Workshop",
              desc: "Crack interviews with confidence",
              date: "01 June, 2025",
              location: "Indore",
              image: "https://images.unsplash.com/photo-1573497191269-cc6db3aad297?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            },
            {
              id: "wk-3",
              title: "Group Discussion & Pitching Techniques",
              desc: "Learn to lead group discussions. Gain templates to pitch your solutions confidently.",
              date: "15 June, 2025",
              location: "Bhopal",
              image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            },
            {
              id: "wk-4",
              title: "LinkedIn Branding & Recruiter Outreach",
              desc: "Learn secrets to draft a profile summary, customize headlines, and message HRs directly.",
              date: "22 June, 2025",
              location: "Online Live",
              image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            },
            {
              id: "wk-5",
              title: "Quantitative Aptitude & Speed Math Hacks",
              desc: "Crack high-frequency aptitude questions and speed calculation patterns.",
              date: "29 June, 2025",
              location: "Indore",
              image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            },
            {
              id: "wk-6",
              title: "System Design & Live Mock Coding Round",
              desc: "Observe a live simulated interview mimicking Tier-1 tech company rounds.",
              date: "06 July, 2025",
              location: "Online Live",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            }
          ];

          const defaultPast = [
            {
              id: "past-1",
              title: "React & Frontend Architecture BootCamp",
              desc: "A 2-day session covering component optimization, server rendering, and modern state managers.",
              date: "10 May, 2025",
              location: "Bhopal",
              image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500",
              status: "past"
            },
            {
              id: "past-2",
              title: "Java Full-Stack & Microservices Seminar",
              desc: "A hands-on walk-through of Spring Boot, API gateway setups, and database orchestration.",
              date: "03 May, 2025",
              location: "Indore",
              image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500",
              status: "past"
            },
            {
              id: "past-3",
              title: "Campus to Corporate Transition Meet",
              desc: "Essential soft-skills and workspace etiquette guidelines delivered by corporate HR headers.",
              date: "25 April, 2025",
              location: "Bhopal",
              image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500",
              status: "past"
            },
            {
              id: "past-4",
              title: "SQL & Relational Database Essentials",
              desc: "Master indexes, complex joins, subqueries, and execution plan optimizations for technical interviews.",
              date: "18 April, 2025",
              location: "Online Live",
              image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=500",
              status: "past"
            }
          ];

           const rawWorkshops = content.workshops || [];
          const isCustomized = content.isWorkshopsCustomized || false;

          const userUpcoming = rawWorkshops.filter((w: any) => w.status !== 'past');
          const userPast = rawWorkshops.filter((w: any) => w.status === 'past');

          const mergedUpcoming = [...userUpcoming];
          if (!isCustomized) {
            defaultUpcoming.forEach((du) => {
              if (!mergedUpcoming.some(w => w.title.toLowerCase() === du.title.toLowerCase())) {
                mergedUpcoming.push(du);
              }
            });
          }

          const mergedPast = [...userPast];
          if (!isCustomized) {
            defaultPast.forEach((dp) => {
              if (!mergedPast.some(w => w.title.toLowerCase() === dp.title.toLowerCase())) {
                mergedPast.push(dp);
              }
            });
          }

          // Elegant date parser
          const parseWorkshopDate = (dateStr: string): Date => {
            if (!dateStr) return new Date();
            const cleanStr = dateStr.replace(/[,|]/g, ' ').replace(/\s+/g, ' ').trim();
            const parsed = new Date(cleanStr);
            if (!isNaN(parsed.getTime())) {
              return parsed;
            }
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const parts = cleanStr.toLowerCase().split(' ');
            let day = 1;
            let month = 0;
            let year = new Date().getFullYear();
            for (const part of parts) {
              const d = parseInt(part, 10);
              if (!isNaN(d)) {
                if (d > 31) year = d;
                else day = d;
              } else {
                const foundMonth = months.findIndex(m => part.startsWith(m));
                if (foundMonth !== -1) month = foundMonth;
              }
            }
            return new Date(year, month, day);
          };

          // Upcoming is sorted ASCENDING (nearest first)
          const sortedUpcoming = [...mergedUpcoming].sort((a, b) => {
            return parseWorkshopDate(a.date).getTime() - parseWorkshopDate(b.date).getTime();
          });

          // Past is sorted DESCENDING (most recently completed first)
          const sortedPast = [...mergedPast].sort((a, b) => {
            return parseWorkshopDate(b.date).getTime() - parseWorkshopDate(a.date).getTime();
          });

          const currentList = activeWorkshopTab === 'upcoming' ? sortedUpcoming : sortedPast;
          const displayedWorkshops = activeWorkshopTab === 'gallery' ? [] : currentList;
          const hasMore = activeWorkshopTab !== 'gallery' && currentList.length > visibleWorkshopsCount;

          return (
            <div>
              {/* Registration Success Overlay Modal */}
              {registeredWkTitle && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl animate-bounce">
                      ✓
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900">Registration Successful!</h3>
                    <p className="text-sm text-slate-600 font-sans leading-relaxed">
                      You have successfully registered for the <strong className="text-blue-600">{registeredWkTitle}</strong>. Our training coordinator will contact you shortly with your join instructions and credentials.
                    </p>
                    <button
                      onClick={() => setRegisteredWkTitle(null)}
                      className="mt-2 w-full py-3 bg-[#071B4D] text-white font-sans font-bold uppercase tracking-wider rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-2">
                <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight" style={{ color: design.headingColor }}>
                  {title}
                </h2>
                {subtitle && <p className="text-slate-500 text-sm md:text-base font-sans mt-1">{subtitle}</p>}
              </div>

              {/* Tabs filter matching exact screenshot */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12 text-xs md:text-sm font-sans">
                <button
                  onClick={() => {
                    setActiveWorkshopTab('upcoming');
                    setVisibleWorkshopsCount(2);
                  }}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all border ${
                    activeWorkshopTab === 'upcoming'
                      ? 'bg-[#071B4D] text-white border-[#071B4D] shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <Icons.Calendar className="h-4 w-4 shrink-0" />
                  <span>Upcoming Workshops</span>
                </button>
                <button
                  onClick={() => {
                    setActiveWorkshopTab('past');
                    setVisibleWorkshopsCount(2);
                  }}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all border ${
                    activeWorkshopTab === 'past'
                      ? 'bg-[#071B4D] text-white border-[#071B4D] shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <Icons.History className="h-4 w-4 shrink-0" />
                  <span>Past Workshops</span>
                </button>
                <button
                  onClick={() => {
                    setActiveWorkshopTab('gallery');
                  }}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all border ${
                    activeWorkshopTab === 'gallery'
                      ? 'bg-[#071B4D] text-white border-[#071B4D] shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <Icons.Image className="h-4 w-4 shrink-0" />
                  <span>Gallery</span>
                </button>
              </div>

              {activeWorkshopTab !== 'gallery' ? (
                <div className="flex flex-col gap-8">
                  {/* Top 2 Hero Cards matching exact screenshot */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left text-xs font-sans">
                    {/* Hero Card 1 (Nearest / Most Recent) - Dark Theme */}
                    {displayedWorkshops[0] && (() => {
                      const wk = displayedWorkshops[0];
                      return (
                        <div className="bg-gradient-to-br from-slate-950 via-[#071B4D] to-slate-900 text-white rounded-3xl border border-slate-800 p-8 md:p-10 flex flex-col md:flex-row gap-6 shadow-xl relative overflow-hidden group">
                          {/* Content Container */}
                          <div className="flex flex-col justify-between gap-6 md:w-3/5 z-10">
                            <div className="flex flex-col gap-3">
                              <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight">
                                {wk.title}
                              </h3>
                              <p className="text-slate-300 font-sans leading-relaxed text-sm">
                                {wk.desc}
                              </p>
                              
                              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mt-4">
                                <Icons.Calendar className="h-4.5 w-4.5 text-[#F7C400] shrink-0" />
                                <span className="font-mono">{wk.date} | {wk.location}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setRegisteredWkTitle(wk.title)}
                              className="px-6 py-3.5 bg-[#F7C400] hover:bg-yellow-400 text-[#071B4D] font-sans font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-fit"
                            >
                              Register Now
                            </button>
                          </div>

                          {/* Image Container with seamless fade blending */}
                          <div className="relative md:w-2/5 min-h-[220px] md:min-h-full rounded-2xl overflow-hidden shadow border border-white/5 shrink-0 self-stretch">
                            <img src={wk.image} alt={wk.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent pointer-events-none hidden md:block" />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Hero Card 2 (Second Nearest / Second Most Recent) - Light Theme */}
                    {displayedWorkshops[1] && (() => {
                      const wk = displayedWorkshops[1];
                      return (
                        <div className="bg-white text-slate-800 rounded-3xl border border-slate-200 p-8 md:p-10 flex flex-col md:flex-row gap-6 shadow-lg relative overflow-hidden group">
                          {/* Content Container */}
                          <div className="flex flex-col justify-between gap-6 md:w-3/5 z-10">
                            <div className="flex flex-col gap-3">
                              <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-slate-900 leading-tight">
                                {wk.title}
                              </h3>
                              <p className="text-slate-500 font-sans leading-relaxed text-sm">
                                {wk.desc}
                              </p>
                              
                              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mt-4">
                                <Icons.Calendar className="h-4.5 w-4.5 text-[#071B4D] shrink-0" />
                                <span className="font-mono">{wk.date} | {wk.location}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setRegisteredWkTitle(wk.title)}
                              className="px-6 py-3.5 bg-[#F7C400] hover:bg-yellow-400 text-[#071B4D] font-sans font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-fit"
                            >
                              Register Now
                            </button>
                          </div>

                          {/* Image Container with seamless fade blending */}
                          <div className="relative md:w-2/5 min-h-[220px] md:min-h-full rounded-2xl overflow-hidden shadow border border-slate-100 shrink-0 self-stretch">
                            <img src={wk.image} alt={wk.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent pointer-events-none hidden md:block" />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Subsequent Workshops under top 2, displayed when user clicks 'Load More' */}
                  {visibleWorkshopsCount > 2 && displayedWorkshops.length > 2 && (
                    <div className="mt-8 border-t border-slate-100 pt-8 animate-fade-in">
                      <h4 className="text-base font-bold text-slate-900 mb-6 font-display flex items-center gap-2 uppercase tracking-wider text-[11px] text-slate-400">
                        <span>Additional {activeWorkshopTab === 'upcoming' ? 'Upcoming' : 'Past'} Sessions</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedWorkshops.slice(2, visibleWorkshopsCount).map((wk: any, i: number) => (
                          <div
                            key={wk.id || i}
                            style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                            className="bg-white rounded-2xl border p-6 flex flex-col justify-between gap-5 shadow-sm hover:border-slate-300 hover:shadow transition-all text-left group"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="h-44 rounded-xl overflow-hidden relative">
                                <img src={wk.image} alt={wk.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-blue-700 shadow-sm font-mono uppercase">
                                  {wk.location}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-blue-600 font-bold font-mono">
                                <Icons.Calendar className="h-3.5 w-3.5" />
                                <span>{wk.date}</span>
                              </div>
                              <h3 className="text-sm font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{wk.title}</h3>
                              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">{wk.desc}</p>
                            </div>
                            <button
                              onClick={() => setRegisteredWkTitle(wk.title)}
                              className="w-full py-2.5 bg-[#071B4D] hover:bg-blue-900 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors cursor-pointer text-center"
                            >
                              Register Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Glimpses horizontal row matching exact screenshot layout */}
                  <div className="mt-16 border-t border-slate-150 pt-12">
                    <div className="text-center mb-8">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Glimpses from our Workshops</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {[
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
                        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
                        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
                      ].map((img, picI) => (
                        <div key={picI} className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-[4/3] group bg-slate-50">
                          <img src={img} alt="Workshop Glimpse" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-350" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-sans">
                  {[
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500",
                    "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=500",
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500"
                  ].map((img, picI) => (
                    <div key={picI} className="relative rounded-xl overflow-hidden group border border-slate-100 shadow-sm aspect-video">
                      <img src={img} alt="Workshop" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              )}

              {/* View All Workshops / Show Less CTA matching exact screenshot */}
              {activeWorkshopTab !== 'gallery' && (
                <div className="flex justify-center mt-12">
                  {visibleWorkshopsCount < currentList.length ? (
                    <button
                      onClick={() => setVisibleWorkshopsCount(currentList.length)}
                      className="group flex items-center gap-2 px-8 py-4 bg-[#071B4D] hover:bg-blue-900 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>View All Workshops</span>
                      <Icons.ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    currentList.length > 2 && (
                      <button
                        onClick={() => setVisibleWorkshopsCount(2)}
                        className="group flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>Show Less Sessions</span>
                        <Icons.ChevronUp className="h-4 w-4 shrink-0" />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* 19. BLOG GRID (BLOG CMS PAGE) */}
        {type === 'blog-grid' && (
          <div className="flex flex-col gap-8">
            {/* Banner Badge */}
            <div className="flex justify-center">
              <span className="bg-[#071B4D] text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-6 py-2 rounded-md font-mono shadow-sm">
                11. BLOG PAGE
              </span>
            </div>

            <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans text-sm">{subtitle}</p>}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 font-sans">
              {['All', 'Resume Tips', 'Interview Tips', 'LinkedIn Tips', 'Placement News'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveBlogCategory(cat)}
                  className={`px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold tracking-wide transition-all duration-200 border cursor-pointer ${
                    activeBlogCategory === cat 
                      ? 'bg-[#071B4D] text-white border-[#071B4D] shadow-md' 
                      : 'bg-white text-[#071B4D] border-slate-200 hover:bg-slate-50'
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
                    onClick={() => setActiveReaderBlog(blog)}
                    className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group text-left h-full cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-50">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[9px] font-black uppercase text-white bg-[#071B4D] px-2.5 py-1 rounded shadow-sm">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col gap-4 flex-1">
                      <h3 className="font-display font-black text-[#071B4D] text-lg md:text-xl leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mt-auto pt-2">
                        <Icons.Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Bottom Button to view home or trigger contact */}
            <div className="flex justify-center mt-12">
              <button
                onClick={() => { window.location.hash = '#/'; }}
                className="bg-[#071B4D] hover:bg-[#071B4D]/90 text-white font-sans font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>View All Blogs</span>
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* 20. CONTACT SPLIT */}
        {type === 'contact-split' && (
          <div className="flex flex-col gap-8 text-[#071B4D]">
            {/* Banner Badge */}
            <div className="flex justify-center">
              <span className="bg-[#071B4D] text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-6 py-2 rounded-md font-mono shadow-sm">
                12. CONTACT PAGE
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title || "Get In Touch"}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans text-sm md:text-base leading-relaxed">{subtitle}</p>}
            </div>

            {/* Main 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-6 text-left text-sm font-sans">
              
              {/* Left Column: Office Addresses & Contacts */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-6 justify-between">
                <div className="flex flex-col gap-6">
                  {/* Bhopal Office / Indore Office */}
                  {(content.offices || [
                    { id: "of-1", name: "Bhopal Office", address: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016" },
                    { id: "of-2", name: "Indore Office", address: "456, Vijay Nagar, Indore, Madhya Pradesh - 452010" }
                  ]).map((office: any, i: number) => (
                    <div key={office.id || i} className="flex gap-4 items-start pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="p-3 bg-slate-50 rounded-xl text-[#071B4D] shrink-0 border border-slate-100">
                        <Icons.MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-display font-black text-[#071B4D] text-base">
                          {office.name}
                        </h3>
                        <p className="text-slate-600 font-sans text-xs md:text-sm leading-relaxed">
                          {office.address}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Phone Row */}
                  <div className="flex gap-4 items-center pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl text-[#071B4D] shrink-0 border border-slate-100">
                      <Icons.Phone className="h-5 w-5" />
                    </div>
                    <span className="font-display font-black text-slate-950 text-base md:text-lg">
                      {content.phone || "+91 93000 12345"}
                    </span>
                  </div>

                  {/* Email Row */}
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-slate-50 rounded-xl text-[#071B4D] shrink-0 border border-slate-100">
                      <Icons.Mail className="h-5 w-5" />
                    </div>
                    <span className="font-display font-black text-slate-950 text-base md:text-lg break-all">
                      {content.email || "info@tantrapex.com"}
                    </span>
                  </div>

                  {/* Website Row */}
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-slate-50 rounded-xl text-[#071B4D] shrink-0 border border-slate-100">
                      <Icons.Globe className="h-5 w-5" />
                    </div>
                    <span className="font-display font-black text-[#071B4D] text-base md:text-lg">
                      {content.website || "www.tantrapex.com"}
                    </span>
                  </div>
                </div>

                {/* Social links row */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={content.linkedin || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#0077B5] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={content.instagram || "https://instagram.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={content.youtube || "https://youtube.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#FF0000] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Youtube className="h-4 w-4" />
                  </a>
                  <a
                    href={content.facebook || "https://facebook.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#1877F2] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Middle Column: Interactive Form */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                {contactSuccess ? (
                  <div className="p-8 bg-emerald-50 text-emerald-700 rounded-xl text-center flex flex-col items-center justify-center gap-4 h-full">
                    <Icons.CheckCircle className="h-12 w-12 text-emerald-500" />
                    <span className="font-bold text-base">Your message has been sent!</span>
                    <p className="text-xs text-slate-500">We appreciate your interest. A professional career counselor from Tantrapex will call or email you shortly.</p>
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
                    className="flex flex-col gap-4 h-full justify-between"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1 text-left">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#071B4D]/20 focus:border-[#071B4D] text-sm font-sans"
                        />
                      </div>
                      {/* Email */}
                      <div className="flex flex-col gap-1 text-left">
                        <input
                          type="email"
                          required
                          placeholder="Your Email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#071B4D]/20 focus:border-[#071B4D] text-sm font-sans"
                        />
                      </div>
                      {/* Phone */}
                      <div className="flex flex-col gap-1 text-left">
                        <input
                          type="tel"
                          required
                          placeholder="Your Phone"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#071B4D]/20 focus:border-[#071B4D] text-sm font-sans"
                        />
                      </div>
                      {/* Message */}
                      <div className="flex flex-col gap-1 text-left">
                        <textarea
                          rows={4}
                          placeholder="Your Message"
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#071B4D]/20 focus:border-[#071B4D] text-sm font-sans"
                        />
                      </div>
                    </div>

                    <button className="mt-6 w-full py-4 bg-[#071B4D] hover:bg-[#071B4D]/90 text-white font-sans font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow hover:shadow-lg hover:-translate-y-0.5">
                      {content.formSubmitBtnText || "Send Message"}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Google Maps Embed */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full min-h-[450px]">
                <div className="w-full h-full rounded-xl overflow-hidden border border-slate-100 flex-1 relative bg-slate-50">
                  <iframe
                    title="Location Map"
                    src={getEmbedUrl(content.mapUrl)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full rounded-xl"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Full Article Reader Popup Modal */}
      <AnimatePresence>
        {activeReaderBlog && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReaderBlog(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white text-slate-950 rounded-2xl border border-slate-200 overflow-hidden shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative z-10 text-left font-sans"
            >
              {/* Header / Cover Image */}
              <div className="relative h-64 md:h-80 overflow-hidden bg-slate-50 shrink-0">
                <img
                  src={activeReaderBlog.image}
                  alt={activeReaderBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Close button inside image header */}
                <button
                  onClick={() => setActiveReaderBlog(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-950/50 hover:bg-slate-950/80 text-white rounded-full transition-all cursor-pointer shadow-lg"
                >
                  <Icons.X className="h-5 w-5" />
                </button>

                {/* Title & Metadata Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-2">
                  <span className="bg-[#071B4D] self-start text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                    {activeReaderBlog.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-display font-black leading-tight drop-shadow-sm">
                    {activeReaderBlog.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 overflow-y-auto flex flex-col gap-5 min-h-0 text-slate-800">
                {/* Date & Read time */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Icons.Calendar className="h-4 w-4 text-slate-400" />
                    <span>{activeReaderBlog.date}</span>
                  </div>
                  {activeReaderBlog.readTime && (
                    <div className="flex items-center gap-1.5">
                      <Icons.Clock className="h-4 w-4 text-slate-400" />
                      <span>{activeReaderBlog.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                {activeReaderBlog.excerpt && (
                  <p className="text-sm font-sans italic text-slate-600 border-l-4 border-[#071B4D] pl-4 py-1 leading-relaxed">
                    {activeReaderBlog.excerpt}
                  </p>
                )}

                {/* Main Content text blocks */}
                <div className="text-sm md:text-base leading-relaxed font-sans whitespace-pre-line text-slate-700 space-y-4">
                  {activeReaderBlog.content}
                </div>
              </div>

              {/* Close footer bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                <button
                  onClick={() => setActiveReaderBlog(null)}
                  className="px-5 py-2 bg-[#071B4D] hover:bg-[#071B4D]/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
