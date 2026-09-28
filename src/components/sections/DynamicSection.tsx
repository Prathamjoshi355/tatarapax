import React, { useState, useEffect } from 'react';
import { CMSSection, PlacedStudent, HiringPartner, Course, BlogPost, Lead, GlobalSettings, Service } from '../../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { div } from 'motion/react-client';

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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  const [heroImage, setHeroImage] = useState(content?.heroImage || '');

  useEffect(() => {
    const updateHeroImage = () => {
      const isMobile = window.innerWidth < 768;
      setHeroImage(isMobile ? (content?.mobileHeroImage || content?.heroImage || '') : (content?.heroImage || ''));
    };

    updateHeroImage();
    window.addEventListener('resize', updateHeroImage);
    return () => window.removeEventListener('resize', updateHeroImage);
  }, [content?.heroImage, content?.mobileHeroImage]);

  const navigateToRoute = (target?: string) => {
    const rawTarget = (target || '').trim();
    if (!rawTarget) return;

    if (/^(https?:|mailto:|tel:)/i.test(rawTarget)) {
      window.location.href = rawTarget;
      return;
    }

    const normalizedTarget = rawTarget.startsWith('#')
      ? rawTarget
      : rawTarget.startsWith('/')
        ? `#${rawTarget}`
        : `#/${rawTarget}`;

    const nextHash = normalizedTarget.startsWith('#/')
      ? normalizedTarget
      : `#/${normalizedTarget.slice(1)}`;

    if (window.location.hash === nextHash) {
      window.dispatchEvent(new Event('hashchange'));
      return;
    }

    window.location.hash = nextHash;
  };

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
  const [glimpseShuffleKey, setGlimpseShuffleKey] = useState(0);
  const [registeredWkTitle, setRegisteredWkTitle] = useState<string | null>(null);
  const [selectedWorkshopDetail, setSelectedWorkshopDetail] = useState<any | null>(null);
  
  // Public Workshop Enrollment Form States
  const [regWorkshop, setRegWorkshop] = useState<any | null>(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', college: '', branch: '', year: '3rd Year' });
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);

  const publishedBlogs = (Array.isArray(allBlogs) ? allBlogs : []).filter((blog: any) => blog.status === 'published');

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

  // Pricing, Razorpay Payment, and Assessment Quiz states
  const [checkoutPlan, setCheckoutPlan] = useState<any | null>(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAgreed, setCheckoutAgreed] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/razorpay-key')
      .then(res => res.json())
      .then(data => {
        if (data && data.keyId) {
          setRazorpayKeyId(data.keyId);
        } else {
          setRazorpayKeyId('');
        }
      })
      .catch(err => {
        console.error("Failed to load Razorpay Key ID:", err);
      });
  }, []);
  
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<any>({});

  // Interactive Home Section States
  const statsMode = content?.statsMode || 'manual';
  const setStatsMode = (mode: 'auto' | 'manual') => {
    onEditField(section.id, 'content.statsMode', mode);
  };
  const [partnersFilter, setPartnersFilter] = useState('All');
  const [partnersLayout, setPartnersLayout] = useState<'grid' | 'carousel'>('carousel');
  const storiesMode = content?.storiesMode || 'manual';
  const setStoriesMode = (mode: 'auto' | 'manual') => {
    onEditField(section.id, 'content.storiesMode', mode);
  };

  // Inline element editor prompt
  const handleElementClick = (e: React.MouseEvent, fieldPath: string, currentVal?: string) => {
    if (!isVisual) return;
    e.stopPropagation();
    const newVal = prompt(`Edit content for [${fieldPath}]:`, currentVal || '');
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
      className={`relative w-full overflow-hidden transition-all duration-300 ${type === 'hero' ? 'p-0' : 'py-2 md:py-2 px-4 md:px-8'
        }`}
    >
      {/* Visual Edit Badge */}
      {isVisual && (
        <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
          Click elements to edit directly
        </div>
      )}

      <div className={type === 'hero' ? "w-full" : `mx-auto ${!settings.containerWidth || settings.containerWidth === 'max-w-7xl' ? 'max-w-[1400px]': settings.containerWidth}`}>

        {/* Render Sections Based on Type */}

        {/* 1. HERO SECTION */}
        {type === 'hero' && (content.showHero !== false) && (
          <section
            style={{
              backgroundImage: `url(${heroImage})`
            }}
            className=" bg-center bg-no-repeat bg-cover relative h-100">
            {/* Overlay */}
            <div
              style={{ backgroundColor: content.overlayColor }}
              className="absolute inset-0 z-10 min-h-[700px] w-full"
            />

            {/* Content Container aligned left */}
            <div className="relative z-20 w-full pt-500px">
              <div className="px-6 pt-20 sm:px-12 md:px-16 lg:px-20" style={{paddingTop: "70px"}}>
                <div className="max-w-3xl flex flex-col gap-5 md:gap-7 text-left items-start">

                  {/* Large Heading */}
                  <h1
                    onClick={(e) => handleElementClick(e, 'title', title)}
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-display tracking-tight font-black leading-[1.1] text-[#071B4D] ${editableClass('title')}`}
                  >
                    {title}
                  </h1>
                  {/* Description */}
                  {content.tagline && (
                    <p
                      onClick={(e) => handleElementClick(e, 'content.tagline', content.tagline)}
                      className={`text-sm sm:text-lg md:text-xl lg:text-lg leading-relaxed font-semibold font-sans text-[#071B4D] ${editableClass('content.tagline')}`}
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
                            navigateToRoute(content.primaryBtnLink || '#pricing');
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
                            navigateToRoute(content.secondaryBtnLink || 'contact');
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
          <div className="flex flex-col gap-6 ">
            {/* Interactive Toggle for Auto vs Manual - Only visible to Admins/Editors */}
            {viewMode !== 'live' && (
              <div className="flex justify-center">
                <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-full">
                  <button
                    onClick={() => setStatsMode('auto')}
                    className={` rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${statsMode === 'auto'
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

            <div className="grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 py-8 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
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
                        className={`text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D] tracking-tight ${editableClass(`content.stats.${i}.count`)}`}
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
          <div className="flex flex-col gap-8 md:gap-12 py-8 md:py-12">
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
              <h2
                onClick={(e) => handleElementClick(e, 'title', title)}
                className={`text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D] ${editableClass('title')}`}
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

            <div className={content.cards?.length > 4 ? "grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"}>
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
         <div className="flex flex-col gap-8 md:gap-12 py-8 md:py-20 mb-8">
            <div className="text-center max-w-3xl mx-auto mb-4 flex flex-col gap-3 md:gap-12 py-8 md:py-12 ">
              <h2 className=" pt-30 text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D] " style={{ color: design.headingColor }}>
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
                      onClick={() => { navigateToRoute('#/services'); }}
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
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black tracking-tight leading-tight">
                {title}
              </h2>
              {subtitle && <p className="text-sm text-slate-200 leading-relaxed font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-4 gap-6 text-center w-full lg:max-w-3xl shrink-0 relative z-10">
              {[
                { label: "Students Trained", value: content.trained || "5000+" },
                { label: "Hiring Partners", value: content.companies || "50+" },
                { label: "Expert Courses", value: content.courses || "12+" },
                { label: "Google Rating", value: content.googleRating || "4.9 Stars" }
              ].map((m, mi) => (
                <div key={mi} className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-1.5 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
                  <span className="text-2xl md:text-4xl lg:text-2xl font-display font-black text-[#F7C400] tracking-tight">{m.value}</span>
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
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
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
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
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
                      onClick={() => { navigateToRoute('#/contact'); }}
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
             
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
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
                        onClick={() => { navigateToRoute('#/contact'); }}
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
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
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
                onClick={() => { navigateToRoute('#/blog'); }}
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
                onClick={() => { navigateToRoute(content.primaryBtnLink || '#pricing'); }}
                className="mt-4 px-8 py-4 bg-[#F7C400] hover:bg-white text-[#071B4D] font-sans font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                {content.primaryBtnText || "Register For Free Demo"}
              </button>
            </div>
          </div>
        )}

        {/* 4. TIMELINE SECTION */}
        {type === 'timeline' && (
          <div className="py-8 md:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
              <h2
                onClick={(e) => handleElementClick(e, 'title', title)}
                className={`text-2xl md:text-4xl lg:text-3xl font-display font-black text-[#071B4D] ${editableClass('title')}`}
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
              
              <div className="grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 w-full max-w-6xl relative z-10">
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
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
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
            <div className="grid grid-cols-1 mobileL:grid-cols-2 lg:grid-cols-3 gap-8">
              {(storiesMode === 'auto' ? allPlacedStudents.filter(st => st.showOnHomepage !== false).slice(0, 6) : (content.stories || allPlacedStudents.filter(st => st.showOnHomepage !== false).slice(0, 3))).map((st: any, idx: number) => (
                <div
                  key={st.id || idx}
                  className="bg-white border border-slate-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 relative group"
                >
                  {/* Subtle top decoration */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#071B4D] group-hover:bg-[#F7C400] transition-all rounded-t-2xl" />

                  <div className="flex items-center gap-4 mt-2">
                    {st.avatar && st.avatar.trim() !== '' && !st.avatar.includes('photo-1534528741775') && !st.avatar.includes('photo-1539571696357') && (
                      <img
                        src={st.avatar}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-full object-cover border-2 border-[#071B4D] shadow-sm shrink-0"
                      />
                    )}
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
                onClick={() => { navigateToRoute('#/placed-students'); }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#071B4D] hover:bg-[#0c2b73] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <span>{content.viewAllBtnText || "View All Placed"}</span>
              </button>
            </div>
          </div>
        )}

        {/* STORIES & PARTNERS STACKED SECTION */}
        {type === 'stories-and-partners' && (
          <div className="flex flex-col gap-8 w-full">
            {/* Top Block: Success Stories (Full Width) */}
            <div className="w-full flex flex-col justify-between py-2">
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-display font-black text-[#071B4D] flex items-center gap-2.5">
                    <Icons.Award className="h-6 w-6 text-blue-600" />
                    <span>Success Stories</span>
                  </h3>
                  <button
                    onClick={() => { navigateToRoute('#/placed-students'); }}
                    className="hidden sm:inline-flex px-5 py-2 bg-[#071B4D] hover:bg-[#F7C400] text-white hover:text-[#071B4D] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow duration-200 cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allPlacedStudents.filter(st => st.showOnHomepage !== false).slice(0, 6).map((st: any, idx: number) => (
                    <div
                      key={st.id || idx}
                      className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-md transition-all duration-200"
                    >
                      {st.avatar && st.avatar.trim() !== '' && !st.avatar.includes('photo-1534528741775') && !st.avatar.includes('photo-1539571696357') && (
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="font-extrabold text-xs text-[#071B4D] mt-3 truncate w-full">{st.name}</span>
                      <span className="text-[10px] text-slate-500 font-bold truncate w-full mt-0.5">{st.branch || "Software Engineer"}</span>
                      <span className="text-[10px] text-[#071B4D] font-extrabold px-2.5 py-0.5 bg-blue-50 rounded-full border border-blue-100 mt-1.5 truncate max-w-full">{st.company}</span>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100/80 w-full flex flex-col items-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Package</span>
                        <span className="text-xs font-black text-[#071B4D] mt-0.5">{st.packageLpa || "LPA"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-6 sm:hidden">
                <button
                  onClick={() => { navigateToRoute('#/placed-students'); }}
                  className="px-6 py-2.5 bg-[#071B4D] hover:bg-[#F7C400] text-white hover:text-[#071B4D] font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition-all shadow duration-200 cursor-pointer"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Bottom Block: Our Hiring Partners (Full Width Infinite Auto Slider) */}
            <div className="w-full flex flex-col justify-between overflow-hidden py-2">
              <div>
                <div className="flex items-center justify-between mb-4 pb-1">
                  <h3 className="text-xl sm:text-2xl font-display font-black text-[#071B4D] flex items-center gap-2.5">
                    <Icons.Building className="h-6 w-6 text-blue-600" />
                    <span>Our Hiring Partners</span>
                  </h3>
                  <button
                    onClick={() => { navigateToRoute('#/companies'); }}
                    className="hidden sm:inline-flex px-5 py-2 bg-[#071B4D] hover:bg-[#F7C400] text-white hover:text-[#071B4D] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow duration-200 cursor-pointer"
                  >
                    View All Companies
                  </button>
                </div>
                
                {/* Infinite Auto-Sliding Marquee Containers (Clean Borderless Image Slider) */}
                {(() => {
                  const partnersList = allHiringPartners.filter(p => p.isVisible !== false);
                  const validList = partnersList.length > 0 ? partnersList : [
                    { id: '1', name: 'TCS', logoUrl: '' },
                    { id: '2', name: 'Infosys', logoUrl: '' },
                    { id: '3', name: 'Wipro', logoUrl: '' },
                    { id: '4', name: 'Accenture', logoUrl: '' },
                    { id: '5', name: 'Cognizant', logoUrl: '' },
                    { id: '6', name: 'IBM', logoUrl: '' },
                  ];
                  const row1 = [...validList, ...validList, ...validList, ...validList];
                  const row2 = [...validList.slice().reverse(), ...validList.slice().reverse(), ...validList.slice().reverse(), ...validList.slice().reverse()];

                  return (
                    <div className="flex flex-col gap-6 py-3 relative overflow-hidden bg-transparent p-0">
                      {/* Left & Right Edge Gradient Fades */}
                      <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                      {/* Row 1: Infinite Marquee Left */}
                      <div className="flex gap-8 sm:gap-12 items-center animate-marquee whitespace-nowrap min-w-full py-2">
                        {row1.map((partner, idx) => {
                          const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                          return (
                            <div
                              key={`r1-${partner.id}-${idx}`}
                              className="inline-flex items-center justify-center shrink-0 px-4 py-2 bg-transparent border-0 shadow-none hover:scale-110 transition-transform duration-300 group cursor-pointer select-none"
                              title={partner.name}
                            >
                              {isLogoUrl ? (
                                <img
                                  src={partner.logoUrl}
                                  alt={partner.name}
                                  className="h-10 sm:h-14 md:h-16 w-auto max-w-[140px] sm:max-w-[170px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-base sm:text-lg font-black text-slate-600 group-hover:text-[#071B4D] transition-colors tracking-tight font-display text-center">{partner.name}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Row 2: Infinite Marquee Right */}
                      <div className="flex gap-8 sm:gap-12 items-center animate-marquee-reverse whitespace-nowrap min-w-full py-2">
                        {row2.map((partner, idx) => {
                          const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                          return (
                            <div
                              key={`r2-${partner.id}-${idx}`}
                              className="inline-flex items-center justify-center shrink-0 px-4 py-2 bg-transparent border-0 shadow-none hover:scale-110 transition-transform duration-300 group cursor-pointer select-none"
                              title={partner.name}
                            >
                              {isLogoUrl ? (
                                <img
                                  src={partner.logoUrl}
                                  alt={partner.name}
                                  className="h-10 sm:h-14 md:h-16 w-auto max-w-[140px] sm:max-w-[170px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-base sm:text-lg font-black text-slate-600 group-hover:text-[#071B4D] transition-colors tracking-tight font-display text-center">{partner.name}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="flex justify-center mt-6 sm:hidden">
                <button
                  onClick={() => { navigateToRoute('#/companies'); }}
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
              <h2 className="text-2xl md:text-4xl lg:text-3xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
            </div>

            {/* Filtered Partner Logos - Full Screen Size Infinite Auto Scroller */}
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
                // Return a beautiful full-screen width continuous infinite auto-scroller
                const duplicatePartners = filteredPartners.length > 0 
                  ? [...filteredPartners, ...filteredPartners, ...filteredPartners, ...filteredPartners] 
                  : [];
                return (
                  <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-8 sm:py-12 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 border-y border-slate-200/70 shadow-sm my-2">
                    {/* Left & Right Edge Gradient Fades */}
                    <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10 pointer-events-none" />

                    {/* Infinite Marquee Track */}
                    <div className="flex gap-8 sm:gap-14 md:gap-16 items-center animate-marquee whitespace-nowrap min-w-full">
                      {duplicatePartners.map((partner, idx) => {
                        const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                        return (
                          <div
                            key={`${partner.id}-${idx}`}
                            className="inline-flex items-center justify-center shrink-0 select-none px-6 py-2 bg-transparent border-0 shadow-none hover:scale-110 transition-transform duration-300 group cursor-pointer"
                          >
                            {isLogoUrl ? (
                              <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className="h-12 sm:h-16 md:h-20 w-auto max-w-[160px] sm:max-w-[200px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-base sm:text-xl md:text-2xl font-black text-slate-600 group-hover:text-[#071B4D] transition-colors tracking-tight font-display">{partner.name}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center mt-6 py-6">
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
                            className="h-16 md:h-20 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
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

            {/* Interactive controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 max-w-4xl mx-auto w-full">
              {/* Category selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Category:</span>
                <div className="flex gap-1">
                  {['All', 'MNCs', 'Product-Based', 'Startups'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPartnersFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${partnersFilter === cat
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${partnersLayout === 'carousel'
                      ? 'bg-white text-[#071B4D] shadow'
                      : 'text-slate-500 hover:text-[#071B4D]'
                      }`}
                  >
                    Smooth Slider
                  </button>
                  <button
                    onClick={() => setPartnersLayout('grid')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${partnersLayout === 'grid'
                      ? 'bg-white text-[#071B4D] shadow'
                      : 'text-slate-500 hover:text-[#071B4D]'
                      }`}
                  >
                    Structured Grid
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => { navigateToRoute('#/companies'); }}
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
                  className={`text-3xl md:text-4xl lg:text-3xl font-display font-extrabold ${editableClass('title')}`}
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">

              {/* LEFT COLUMN: ABOUT + MISSION + VISION + WHY CHOOSE US */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <h2
                  onClick={(e) => handleElementClick(e, 'title', title)}
                  className={`text-3xl md:text-4xl lg:text-5xl font-display font-extrabold leading-tight text-slate-900 ${editableClass('title')}`}
                >
                  {title}
                </h2>

              <div
  onClick={(e) =>
    handleElementClick(e, "content.description", content.description)
  }
  className={`mt-6 text-sm md:text-base text-slate-600 font-sans ${editableClass(
    "content.description"
  )}`}
>
  {content.description.split("\n").map((line: string, index: number) => {
    const text = line.trim();

    if (!text) return <div key={index} className="h-4" />;

    // Only lines starting with ► get different styling
    if (text.startsWith("►")) {
      return (
        <p
          key={index}
          className="leading-8 mt-4 flex items-start"
        >
          <span className="mr-3 text-[#002060] font-semibold">►</span>
          <span>{text.substring(1).trim()}</span>
        </p>
      );
    }

    // Normal paragraph
    return (
      <p
        key={index}
        className="leading-8 mb-3"
      >
        {text}
      </p>
    );
  })}
</div>
              </div>
              {/* RIGHT COLUMN: FOUNDER PROFILE CARD */}
              <div className="md:col-span-5 flex justify-center md:justify-end">
                <div className="flex flex-col w-full max-w-[460px] lg:max-w-[500px]">
                  {/* Founder Image Container without borders */}
                  <div className="w-full flex items-center justify-center">
                    {content.founderImage ? (
                      <div className="w-full relative rounded-2xl overflow-hidden">
                        <img
                          src={content.founderImage}
                          alt={content.founderName}
                          className="w-full h-auto max-h-[520px] object-cover rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-400 rounded-2xl">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Founder Footer block without top border */}
                  <div className="py-4 px-2 text-center w-full">
                    <h3
                      onClick={(e) => handleElementClick(e, 'content.founderName', content.founderName)}
                      className={`text-xl md:text-2xl font-display font-extrabold text-[#002060] ${editableClass('content.founderName')}`}
                    >
                      {content.founderName}
                    </h3>
                    {content.founderRole && (
                      <p
                        onClick={(e) => handleElementClick(e, 'content.founderRole', content.founderRole)}
                        className={`text-sm md:text-base text-slate-500 mt-1 leading-relaxed font-sans ${editableClass('content.founderRole')}`}
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
                <div
  onClick={(e) => handleElementClick(e, 'content.missionDesc', content.missionDesc)}
  className={`mt-1 text-sm text-slate-600 font-sans ${editableClass('content.missionDesc')}`}
>
  {content.missionDesc.split('\n').map((line: string, index: number) => {
    const text = line.trim();

    if (!text) return <div key={index} className="h-3" />;

    if (text.startsWith('►')) {
      return (
        <div
          key={index}
          className="flex items-start mt-3"
        >
          <span className="mr-2 font-semibold text-[#002060]">►</span>
          <span className="leading-7">{text.substring(1).trim()}</span>
        </div>
      );
    }

    return (
      <p
        key={index}
        className="leading-7 mb-2"
      >
        {text}
      </p>
    );
  })}
</div>
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
                   <div
  onClick={(e) => handleElementClick(e, 'content.visionDesc', content.visionDesc)}
  className={`mt-1 text-sm text-slate-600 font-sans ${editableClass('content.visionDesc')}`}
>
  {content.visionDesc.split('\n').map((line: string, index: number) => {
    const text = line.trim();

    if (!text) return <div key={index} className="h-3" />;

    if (text.startsWith('►')) {
      return (
        <div key={index} className="flex items-start mt-3">
          <span className="mr-2 font-semibold text-[#002060]">►</span>
          <span className="leading-7">{text.substring(1).trim()}</span>
        </div>
      );
    }

    return (
      <p key={index} className="leading-7 mb-2">
        {text}
      </p>
    );
  })}
</div>
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
              <h2 className="text-3xl md:text-4xl lg:text-3xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              {(content.services || []).map((serv: any, i: number) => (
                <div
                  key={serv.id || i}
                  style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                  className="bg-white p-4 sm:p-5 rounded-xl border text-center items-center transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group"
                >
                  {/* Floating Reorder Controls overlay for Visual/Admin Editors */}
                  {viewMode !== 'live' && (
                    <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm p-1 rounded-lg border border-slate-700/80 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (i === 0) return;
                          const list = [...(content.services || [])];
                          const temp = list[i - 1];
                          list[i - 1] = list[i];
                          list[i] = temp;
                          onEditField(section.id, 'content.services', list);
                        }}
                        className="p-1 bg-slate-800 hover:bg-blue-600 text-white rounded disabled:opacity-20 disabled:hover:bg-slate-800 transition-colors"
                        title="Move Left / Previous Sequence"
                      >
                        <Icons.ArrowLeft className="h-3 w-3" />
                      </button>
                      <span className="text-[10px] font-black text-blue-300 px-1 select-none">#{i + 1}</span>
                      <button
                        type="button"
                        disabled={i === (content.services || []).length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (i === (content.services || []).length - 1) return;
                          const list = [...(content.services || [])];
                          const temp = list[i + 1];
                          list[i + 1] = list[i];
                          list[i] = temp;
                          onEditField(section.id, 'content.services', list);
                        }}
                        className="p-1 bg-slate-800 hover:bg-blue-600 text-white rounded disabled:opacity-20 disabled:hover:bg-slate-800 transition-colors"
                        title="Move Right / Next Sequence"
                      >
                        <Icons.ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div
                    onClick={(e) =>
                      handleElementClick(
                        e,
                        `content.services.${i}.image`,
                        serv.image ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"
                      )
                    }
                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-1 cursor-pointer shrink-0 ${editableClass(
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
                    className={`font-display font-semibold text-[#071B4D] text-sm sm:text-base md:text-lg lg:text-xl leading-tight cursor-pointer ${editableClass(
                      `content.services.${i}.title`
                    )}`}
                  >
                    {serv.title}
                  </h3>
                  <p
                    onClick={(e) => handleElementClick(e, `content.services.${i}.desc`, serv.desc || '')}
                    className={`text-[12px] mobileL:text-sm sm:text-sm md:text-sm lg:text-base text-slate-500 leading-relaxed font-sans cursor-pointer max-h-14 sm:max-h-20 overflow-hidden ${editableClass(
                      `content.services.${i}.desc`
                    )}`}
                    title={serv.desc || ''}
                  >
                    {serv.desc || ''}
                  </p>
                  
                  {serv.buttonText && serv.buttonLink && (
                    <a
                      href={serv.buttonLink}
                      className="mt-auto inline-flex items-center justify-center rounded-full bg-slate-950 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-all"
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
                href="#/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToRoute('#/contact');
                }}
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
              <h2 className="text-3xl md:text-4xl lg:text-3xl font-display font-bold" style={{ color: design.headingColor }}>
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left text-xs font-sans">
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
                            {st.avatar && st.avatar.trim() !== '' && !st.avatar.includes('photo-1534528741775') && !st.avatar.includes('photo-1539571696357') && (
                              <img src={st.avatar} alt={st.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                            )}
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
                      {st.avatar && st.avatar.trim() !== '' && !st.avatar.includes('photo-1534528741775') && !st.avatar.includes('photo-1539571696357') && (
                        <img src={st.avatar} alt={st.name} className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0 animate-fade-in" />
                      )}
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
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-3xl mx-auto mb-6 flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl lg:text-3xl font-display font-bold" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans">{subtitle}</p>}
            </div>

            {/* Filtered Companies / Hiring Partners - Full Screen Size Infinite Auto Scroller */}
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
                const duplicatePartners = filteredPartners.length > 0 
                  ? [...filteredPartners, ...filteredPartners, ...filteredPartners, ...filteredPartners] 
                  : [];
                return (
                  <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-8 sm:py-12 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 border-y border-slate-200/70 shadow-sm my-2">
                    {/* Left & Right Edge Gradient Fades */}
                    <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10 pointer-events-none" />

                    {/* Infinite Marquee Track */}
                    <div className="flex gap-8 sm:gap-14 md:gap-16 items-center animate-marquee whitespace-nowrap min-w-full">
                      {duplicatePartners.map((partner, idx) => {
                        const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                        return (
                          <div
                            key={`${partner.id}-${idx}`}
                            className="inline-flex items-center justify-center shrink-0 select-none px-6 py-2 bg-transparent border-0 shadow-none hover:scale-110 transition-transform duration-300 group cursor-pointer"
                          >
                            {isLogoUrl ? (
                              <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className="h-12 sm:h-16 md:h-20 w-auto max-w-[160px] sm:max-w-[200px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-base sm:text-xl md:text-2xl font-black text-slate-600 group-hover:text-[#071B4D] transition-colors tracking-tight font-display">{partner.name}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center py-6">
                  {filteredPartners.map((partner) => {
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
              );
            })()}

            {/* Interactive controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 max-w-4xl mx-auto w-full">
              {/* Category selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Category:</span>
                <div className="flex gap-1">
                  {['All', 'MNCs', 'Product-Based', 'Startups'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPartnersFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${partnersFilter === cat
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${partnersLayout === 'carousel'
                      ? 'bg-white text-[#071B4D] shadow'
                      : 'text-slate-500 hover:text-[#071B4D]'
                      }`}
                  >
                    Smooth Slider
                  </button>
                  <button
                    onClick={() => setPartnersLayout('grid')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${partnersLayout === 'grid'
                      ? 'bg-white text-[#071B4D] shadow'
                      : 'text-slate-500 hover:text-[#071B4D]'
                      }`}
                  >
                    Structured Grid
                  </button>
                </div>
              </div>
            </div>

            {/* Recruiter contact block */}
            <div className="mt-12 bg-slate-50 border border-slate-200 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between text-left gap-8 max-w-5xl mx-auto w-full">
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-lg text-slate-900">{content.ctaTitle || "Looking for Top Tech Talent?"}</h3>
                <p className="text-sm text-slate-500 font-sans">{content.ctaDesc || "Partner with us to hire job-ready software developers and data analysts."}</p>
              </div>
              <a href="#/contact" onClick={(e) => { e.preventDefault(); navigateToRoute('#/contact'); }} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow shrink-0 font-sans transition-colors">
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
                                    <div className="grid grid-cols-1 mobileL:grid-cols-2 gap-3 text-slate-600">
                                      {course.topics.map((topic, ti) => (
                                        <div key={ti} className="flex items-center gap-2.5">
                                          <Icons.CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                                          <span className="font-semibold text-slate-700 font-sans text-sm">{topic}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <a
                                      href="#/contact"
                                      className="mt-4 px-6 py-2.5 bg-[#071B4D] hover:bg-blue-950 text-white text-[11px] font-bold uppercase rounded-lg w-fit tracking-wider shadow-md hover:shadow-lg transition-all"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigateToRoute('#/contact');
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
                      href="#/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToRoute('#/contact');
                      }}
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
                  href="#/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToRoute('#/contact');
                  }}
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

          const facultyCards = [
            {
              itemNo: '01',
              domain: 'Training',
              name: '[TRAINING FACULTY NAME]',
              designation: 'Training Faculty',
              description:
                "Faculty-led training sessions designed to strengthen students' practical knowledge, professional skills and understanding of real-world requirements.",
              image:
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
              reverse: false,
            },
            {
              itemNo: '02',
              domain: 'Coding',
              name: '[CODING FACULTY NAME]',
              designation: 'Coding Faculty',
              description:
                'Technical sessions focused on programming fundamentals, problem-solving, coding practice and the skills required for technical placement opportunities.',
              image:
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
              reverse: true,
            },
            {
              itemNo: '03',
              domain: 'Aptitude',
              name: '[APTITUDE FACULTY NAME]',
              designation: 'Aptitude Faculty',
              description:
                'Structured aptitude preparation covering logical reasoning, quantitative ability and problem-solving skills commonly required in placement assessments.',
              image:
                'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
              reverse: false,
            },
          ];

          return (
            <div className="w-full pb-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mx-auto max-w-[1280px]"
              >
                <section className="relative overflow-hidden rounded-[18px] border border-slate-200 bg-[#edf3ff] px-5 py-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)] sm:px-7 md:px-8 lg:px-10 lg:py-10">
                  <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-5">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-[#071B4D]">
                        COLLABORATION
                      </span>

                      <div className="space-y-3">
                        <h1 className="font-display text-[2.3rem] font-black leading-[1.05] tracking-[-0.05em] text-[#071B4D] sm:text-[2.9rem] lg:text-[4.1rem]">
                          UGSkill <span className="text-[#0b204c]">×</span> TantraPex
                        </h1>
                        <h2 className="max-w-xl text-xl font-semibold text-slate-700 md:text-[2rem] md:leading-[1.15]">
                          Learning, Training & Placement Preparation — Together
                        </h2>
                      </div>

                      <p className="max-w-[650px] text-base leading-7 text-slate-600 md:text-lg">
                        TantraPex has collaborated with UGSkill, a NexisparkX product, to provide students with continuous faculty-led learning, technical training and placement preparation.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                          <img
                            src="https://res.cloudinary.com/dhy9pmo8s/image/upload/v1790320751/1779608301561_hwpzap.jpg"
                            alt="UG Skill logo"
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-white"
                          />
                          <div>
                            <div className="text-base font-black tracking-[-0.03em] text-[#071B4D]">UG Skill</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">A NexisparkX Product</div>
                          </div>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-black text-[#071B4D] shadow-sm">
                          ×
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                          <img
                            src="https://res.cloudinary.com/dhy9pmo8s/image/upload/v1783025553/Untitled_design_3_hez3tf.png"
                            alt="TantraPex logo"
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-white"
                          />
                          <div>
                            <div className="text-base font-black tracking-[-0.03em] text-[#071B4D]">TantraPex</div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">Faculty-led learning</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_16px_42px_rgba(7,27,77,0.12)]">
                        <img
                          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                          alt="Indian college students learning together with a faculty member"
                          className="h-[320px] w-full rounded-[18px] object-cover md:h-[360px] lg:h-[430px]"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-10 rounded-[18px] border border-slate-200 bg-[#f4f7fb] p-5 shadow-[0_10px_26px_rgba(15,23,42,0.03)] md:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://res.cloudinary.com/dhy9pmo8s/image/upload/v1790320751/1779608301561_hwpzap.jpg"
                        alt="UG Skill logo"
                        className="h-20 w-20 rounded-[20px] object-cover border border-slate-200 bg-white shadow-md"
                      />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#071B4D]/70">Powered by</p>
                        <h3 className="mt-1 text-3xl font-display font-black tracking-tight text-[#071B4D]">UG Skill</h3>
                        <p className="text-base text-slate-600">A NexisparkX Product</p>
                      </div>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
                      {[
                        { label: 'Structured Learning', icon: Icons.BookOpen },
                        { label: 'Practice & Assessments', icon: Icons.CheckCircle2 },
                        { label: 'Skill Development', icon: Icons.BarChart3 },
                        { label: 'Placement Preparation', icon: Icons.BriefcaseBusiness },
                      ].map(({ label, icon: Icon }) => (
                        <div key={label} className="flex min-h-[110px] flex-col items-center justify-center rounded-[18px] border border-slate-200 bg-white px-3 py-4 text-center shadow-sm">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#071B4D]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-[12px] font-bold leading-5 text-[#071B4D]">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                    UGSkill is a NexisparkX product built to help students strengthen their skills through structured learning, assessments, practice and placement-focused preparation.
                  </div>
                </section>

                <section className="mt-12 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#071B4D]/70">OUR COLLABORATION</p>
                  <h3 className="mt-3 text-[2.2rem] font-display font-black tracking-tight text-[#071B4D] sm:text-[2.8rem]">
                    TantraPex × UGSkill Collaboration
                  </h3>
                  <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-slate-600 md:text-lg">
                    Through this collaboration, UGSkill provides continuous faculty support to TantraPex, offering structured training, technical learning and placement preparation for students.
                  </p>
                </section>

                <section className="mt-12 space-y-8">
                  {facultyCards.map((item) => (
                    <div
                      key={item.domain}
                      className={`grid items-center gap-6 lg:grid-cols-2 ${
                        item.reverse ? 'lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1' : ''
                      }`}
                    >
                      <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#071B4D]/70">{item.itemNo}</p>
                        <h4 className="mt-3 text-[2.1rem] font-display font-black tracking-tight text-[#071B4D] md:text-[2.5rem]">
                          {item.domain}
                        </h4>

                        <div className="mt-5 space-y-2">
                          <p className="text-[1.8rem] font-display font-black leading-tight tracking-[-0.04em] text-[#071B4D]">
                            {item.name}
                          </p>
                          <p className="text-lg font-semibold text-slate-700">{item.designation}</p>
                          <p className="max-w-[550px] text-base leading-7 text-slate-600 md:text-lg">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
                        <img
                          src={item.image}
                          alt={`${item.domain} faculty session`}
                          className="h-[260px] w-full object-cover md:h-[300px] lg:h-[360px]"
                        />
                      </div>
                    </div>
                  ))}
                </section>

                <section className="mt-14 rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.03)] md:p-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-[2.15rem] font-display font-black tracking-tight text-[#071B4D]">
                      From Learning to Placement
                    </h3>
                    <p className="mt-2 text-base text-slate-600">
                      A continuous journey toward becoming placement-ready.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                    {[
                      { label: 'Learn', icon: Icons.BookOpen },
                      { label: 'Practice', icon: Icons.CheckCircle2 },
                      { label: 'Improve', icon: Icons.BarChart3 },
                      { label: 'Prepare', icon: Icons.BriefcaseBusiness },
                      { label: 'Perform', icon: Icons.Trophy },
                    ].map(({ label, icon: Icon }, index) => (
                      <React.Fragment key={label}>
                        <div className="flex min-w-[112px] flex-col items-center gap-3 rounded-[20px] border border-slate-200 bg-[#edf3ff] px-4 py-5 shadow-sm">
                          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#071B4D] text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#071B4D]">{label}</span>
                        </div>
                        {index < 4 && (
                          <div className="hidden h-10 w-10 items-center justify-center text-[#071B4D] md:flex">
                            <Icons.ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </section>

                <section className="mt-12 relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#071B4D_0%,#0d224b_40%,#12398e_100%)] p-7 text-white shadow-[0_18px_44px_rgba(7,27,77,0.18)] md:p-8 lg:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_20%)]" />
                  <div className="relative grid items-end gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                      <h3 className="max-w-md text-[2.1rem] font-display font-black leading-[1.08] tracking-tight md:text-[3rem]">
                        Building Placement-Ready Students Together
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
                        Through the collaboration between TantraPex and UGSkill, students receive continuous guidance, technical training and aptitude preparation to help them move confidently toward placement opportunities.
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-2">
                      <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                        alt="Students walking toward their academic environment"
                        className="h-[220px] w-full rounded-[16px] object-cover md:h-[260px]"
                      />
                    </div>
                  </div>
                </section>
              </motion.div>
            </div>
          );
        })()}

        {/* 16. CAMPUS AMBASSADOR PANEL */}
        {type === 'ambassador-main' && (
          <div className="flex flex-col gap-12 font-sans">
            {/* Top Badge & Header */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-20"></div>
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
              
              <div className="grid grid-cols-1 mobileL:grid-cols-2 md:grid-cols-4 gap-6">
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
              <a href="/#/contact" onClick={(e) => { e.preventDefault(); navigateToRoute('#/contact'); }} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow font-sans transition-colors">
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
          const rawWorkshops = Array.isArray(content.workshops) ? content.workshops : [];
          const knownSeedTitles = new Set([
            'Group Discussion Mastery',
            'LinkedIn Branding Clinic',
            'Aptitude & Speed Math Masterclass',
            'MNC Placement Mock Drill',
            'React & Frontend Architecture BootCamp',
            'Resume Building Workshop',
            'Interview Preparation Workshop'
          ]);
          const hasSeedWorkshops = rawWorkshops.some((w: any) =>
            typeof w?.title === 'string' && knownSeedTitles.has(w.title.trim())
          );
          const shouldShowWorkshopData = content.isWorkshopsCustomized === true && Array.isArray(rawWorkshops) && rawWorkshops.length > 0 && !hasSeedWorkshops;

          const fallbackGalleryImages = [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500",
            "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=500",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500"
          ];
          const galleryImagesPool = Array.isArray(content.galleryImages) && content.galleryImages.length > 0
            ? content.galleryImages
            : fallbackGalleryImages;

          const userUpcoming = shouldShowWorkshopData ? rawWorkshops.filter((w: any) => w.status !== 'past') : [];
          const userPast = shouldShowWorkshopData ? rawWorkshops.filter((w: any) => w.status === 'past') : [];

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

          const sortedUpcoming = [...userUpcoming].sort((a, b) => {
            return parseWorkshopDate(a.date).getTime() - parseWorkshopDate(b.date).getTime();
          });

          const sortedPast = [...userPast].sort((a, b) => {
            return parseWorkshopDate(b.date).getTime() - parseWorkshopDate(a.date).getTime();
          });

          const currentList = activeWorkshopTab === 'upcoming' ? sortedUpcoming : sortedPast;
          const displayedWorkshops = activeWorkshopTab === 'gallery' ? [] : currentList;
          const glimpsePool: string[] = [
            ...galleryImagesPool,
            ...(rawWorkshops && Array.isArray(rawWorkshops) ? rawWorkshops.map((w: any) => w.image) : [])
          ].filter((img): img is string => typeof img === 'string' && img.trim().length > 0);

          const sourceGlimpseList = Array.from(new Set(glimpsePool));
          const getRandomFourImages = (list: string[], seed: number) => {
            if (list.length <= 4) return list;
            const copy = [...list];
            for (let i = copy.length - 1; i > 0; i--) {
              const pseudoRand = Math.abs(Math.sin((seed + 1) * 9999 + i * 1337) * 10000);
              const j = Math.floor(pseudoRand) % (i + 1);
              [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy.slice(0, 4);
          };
          const glimpseDisplayImages = getRandomFourImages(sourceGlimpseList, glimpseShuffleKey);

          // HELPER: Canvas Admit Card Generator
          const triggerCanvasDownload = (student: any) => {
            const qrImg = new Image();
            qrImg.crossOrigin = "anonymous";
            
            const renderCanvas = (qrImageElement: HTMLImageElement | null) => {
              const canvas = document.createElement('canvas');
              canvas.width = 750;
              canvas.height = 950;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              // Background
              ctx.fillStyle = '#0b1329'; // Deep Space Navy
              ctx.fillRect(0, 0, 750, 950);

              // Tech Grid Accents
              ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // Emerald
              ctx.lineWidth = 1;
              for (let i = 0; i < 750; i += 30) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 950);
                ctx.stroke();
              }
              for (let j = 0; j < 950; j += 30) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(750, j);
                ctx.stroke();
              }

              // Outer Neon Border
              ctx.strokeStyle = student.isFree ? '#10b981' : '#3b82f6'; // Emerald or Blue
              ctx.lineWidth = 6;
              ctx.strokeRect(20, 20, 710, 910);

              // Header Banner
              ctx.fillStyle = student.isFree ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)';
              ctx.fillRect(40, 40, 670, 110);
              ctx.strokeStyle = student.isFree ? '#10b981' : '#3b82f6';
              ctx.lineWidth = 2;
              ctx.strokeRect(40, 40, 670, 110);

              // Header Text
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 32px sans-serif';
              ctx.fillText('TANTRA PEX MASTERCLASS', 80, 105);

              ctx.fillStyle = student.isFree ? '#10b981' : '#3b82f6';
              ctx.font = '900 13px sans-serif';
              ctx.fillText('OFFICIAL ENTRY PASS & ADMIT CARD', 80, 72);

              // Ticket Details Border Box
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
              ctx.strokeRect(40, 180, 670, 520);

              // Vertical divider
              ctx.beginPath();
              ctx.moveTo(420, 180);
              ctx.lineTo(420, 700);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
              ctx.stroke();

              // Left Side: Student Details
              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('STUDENT NAME', 70, 220);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 20px sans-serif';
              ctx.fillText(student.name, 70, 245);

              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('EMAIL ADDRESS', 70, 300);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 14px sans-serif';
              ctx.fillText(student.email, 70, 322);

              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('TELEPHONE / CONTACT', 70, 370);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 14px sans-serif';
              ctx.fillText(student.phone, 70, 392);

              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('ACADEMIC COLLEGE / BRANCH', 70, 440);
              ctx.fillStyle = '#f1f5f9';
              ctx.font = 'bold 14px sans-serif';
              ctx.fillText(student.college, 70, 462);
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.font = '12px sans-serif';
              ctx.fillText(`${student.branch} • ${student.year}`, 70, 482);

              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('WORKSHOP ALLOCATION', 70, 540);
              ctx.fillStyle = student.isFree ? '#10b981' : '#3b82f6';
              ctx.font = 'black 18px sans-serif';
              ctx.fillText(student.workshopTitle, 70, 565);

              // Right Side: Pass Details & QR Code box
              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('TICKET ID', 450, 220);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 15px sans-serif';
              ctx.fillText(student.id, 450, 242);

              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('TRANSACTION ID', 450, 290);
              ctx.fillStyle = '#94a3b8';
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText(student.transactionId || 'TPX-FREE-SECURE', 450, 312);

              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('PASS CLASSIFICATION', 450, 360);
              ctx.fillStyle = student.isFree ? '#10b981' : '#3b82f6';
              ctx.font = 'bold 16px sans-serif';
              ctx.fillText(student.isFree ? 'FREE PASS' : `PAID PASS • ₹${student.pricePaid}`, 450, 385);

              // Real QR Code drawing instead of simulated barcode!
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(475, 415, 160, 160);
              if (qrImageElement) {
                ctx.drawImage(qrImageElement, 480, 420, 150, 150);
              } else {
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText('VERIFIABLE QR', 505, 505);
              }

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px sans-serif';
              ctx.fillText('VERIFIABLE SECURITY QR CODE', 475, 605);

              // Bottom Footer of Admit Card
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(40, 720, 670, 170);
              ctx.strokeStyle = 'rgba(255,255,255,0.1)';
              ctx.strokeRect(40, 720, 670, 170);

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 14px sans-serif';
              ctx.fillText('IMPORTANT CANDIDATE INSTRUCTIONS', 65, 755);

              ctx.fillStyle = '#94a3b8';
              ctx.font = '12px sans-serif';
              ctx.fillText('1. Please carry either a print-out of this pass or keep the PNG handy on your smartphone.', 65, 785);
              ctx.fillText('2. Entrance gate closes 15 minutes prior to the scheduled masterclass start time.', 65, 810);
              ctx.fillText('3. All workshop assets, templates, and certificates will be unlocked instantly post-session.', 65, 835);
              ctx.fillText('4. For any queries, drop an email to: support@tantrapex.com quote your Ticket ID.', 65, 860);

              // Save to file download
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `Admit_Card_${student.name.replace(/\s+/g, '_')}_TPX.png`;
              link.href = dataUrl;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            qrImg.onload = () => {
              renderCanvas(qrImg);
            };
            qrImg.onerror = () => {
              renderCanvas(null);
            };
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(student.id)}`;
          };

          const processWorkshopEnrollment = async (txnId: string) => {
            const ticketId = `TPX-REG-${10000 + Math.floor(Math.random() * 90000)}`;
            const newReg = {
              id: ticketId,
              name: regForm.name,
              email: regForm.email,
              phone: regForm.phone,
              college: regForm.college,
              branch: regForm.branch,
              year: regForm.year,
              workshopId: regWorkshop.id,
              workshopTitle: regWorkshop.title,
              pricePaid: regWorkshop.isFree ? 0 : (regWorkshop.price || 499),
              isFree: !!regWorkshop.isFree,
              transactionId: txnId,
              timestamp: new Date().toISOString()
            };

            // Save to local workshop registrations list
            const storedRegs = localStorage.getItem('tpx_workshop_registrations');
            const list = storedRegs ? JSON.parse(storedRegs) : [];
            list.unshift(newReg);
            localStorage.setItem('tpx_workshop_registrations', JSON.stringify(list));

            // POST to real backend API to store in MongoDB and trigger email with QR Code
            try {
              const response = await fetch('/api/workshop-registrations/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReg)
              });
              const data = await response.json();
              if (data.success && data.emailLog) {
                // Add dispatch details to local list of sent emails
                const storedEmails = localStorage.getItem('tpx_sent_emails');
                const emailList = storedEmails ? JSON.parse(storedEmails) : [];
                emailList.unshift(data.emailLog);
                localStorage.setItem('tpx_sent_emails', JSON.stringify(emailList));
              }
            } catch (err) {
              console.error("Error pushing registration to backend:", err);
              // Fallback to simulated log if server fails
              const storedEmails = localStorage.getItem('tpx_sent_emails');
              const emailList = storedEmails ? JSON.parse(storedEmails) : [];
              const emailLog = {
                id: `EML-${10000 + Math.floor(Math.random() * 90000)}`,
                recipientName: regForm.name,
                recipientEmail: regForm.email,
                subject: `Admit Card Entry Pass: ${regWorkshop.title}`,
                bodyPreview: `Dear ${regForm.name}, your enrollment for ${regWorkshop.title} is confirmed. Attached is your official Admit Card PNG. Ticket ID: ${ticketId}. Venue: ${regWorkshop.location}. Date: ${regWorkshop.date}.`,
                timestamp: new Date().toISOString()
              };
              emailList.unshift(emailLog);
              localStorage.setItem('tpx_sent_emails', JSON.stringify(emailList));
            }

            // Clean up state
            setRegWorkshop(null);
            setIsPaying(false);
            setRegForm({ name: '', email: '', phone: '', college: '', branch: '', year: '3rd Year' });

            // Display success preview overlay
            setPaymentSuccessData(newReg);

            // Programmatically trigger download
            setTimeout(() => {
              triggerCanvasDownload(newReg);
            }, 300);
          };

          const simulateRazorpaySuccess = (channelCode: string) => {
            const refId = `pay_${channelCode}_${Math.floor(Math.random() * 1000000000)}`;
            processWorkshopEnrollment(refId);
          };

          return (
            <div>
              {/* 1. PUBLIC REGISTRATION MODAL FORM */}
              {regWorkshop && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto text-left">
                  <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl flex flex-col gap-6 relative animate-scale-up text-slate-800">
                    <button 
                      onClick={() => setRegWorkshop(null)} 
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold z-10 font-sans"
                    >
                      ✕
                    </button>

                    <div>
                      <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider font-mono">
                        Masterclass Registration
                      </span>
                      <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 mt-2 uppercase">
                        {regWorkshop.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        Complete candidate details below to generate your verifiable secure admit card.
                      </p>
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (regWorkshop.isFree) {
                        processWorkshopEnrollment('TPX-FREE-BYPASS');
                      } else {
                        try {
                          const amount = Number(regWorkshop.price || 499);
                          const orderRes = await fetch('/api/razorpay/create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              amount,
                              currency: 'INR',
                              receipt: `wk-${Date.now()}`,
                              notes: { type: 'workshop', workshopId: regWorkshop.id || regWorkshop.title }
                            })
                          });
                          
                          let orderData = { keyId: razorpayKeyId, order: { id: null } };
                          if (orderRes.ok) {
                            try {
                              orderData = await orderRes.json();
                            } catch (e) {
                              console.warn("Failed to parse workshop order response:", e);
                            }
                          } else {
                            console.warn(`Workshop order creation returned status ${orderRes.status}`);
                          }
                          
                          const loaded = await loadRazorpayScript();
                          const options = {
                            key: orderData?.keyId || razorpayKeyId,
                            amount: amount * 100,
                            currency: "INR",
                            order_id: orderData?.order?.id,
                            name: "Tantrapex Masterclass",
                            description: regWorkshop.title,
                            handler: function (response: any) {
                              const payId = response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
                              processWorkshopEnrollment(payId);
                            },
                            prefill: {
                              name: regForm.name,
                              email: regForm.email,
                              contact: regForm.phone
                            },
                            theme: {
                              color: "#071b4d"
                            }
                          };

                          if (loaded && (window as any).Razorpay && orderData?.order?.id) {
                            const rzp = new (window as any).Razorpay(options);
                            rzp.open();
                          } else {
                            options.handler({ razorpay_payment_id: null });
                          }
                        } catch (err) {
                          console.error("Failed to open Razorpay:", err);
                          setIsPaying(true);
                        }
                      }
                    }} className="flex flex-col gap-4 font-sans text-xs">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={regForm.name}
                          onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                          placeholder="Enter your official name"
                          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={regForm.email}
                            onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                            placeholder="username@domain.com"
                            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Contact Phone *</label>
                          <input
                            type="tel"
                            required
                            value={regForm.phone}
                            onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                            placeholder="e.g. +91 98765 43210"
                            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">College / University Name *</label>
                        <input
                          type="text"
                          required
                          value={regForm.college}
                          onChange={(e) => setRegForm({...regForm, college: e.target.value})}
                          placeholder="Institute of Technology, Bhopal"
                          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Branch / Department *</label>
                          <input
                            type="text"
                            required
                            value={regForm.branch}
                            onChange={(e) => setRegForm({...regForm, branch: e.target.value})}
                            placeholder="e.g. Computer Science (CSE)"
                            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Year of Study *</label>
                          <select
                            value={regForm.year}
                            onChange={(e) => setRegForm({...regForm, year: e.target.value})}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          >
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                            <option>Post Graduate / PG</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between mt-2 text-slate-700">
                        <div>
                          <div className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">REGISTRATION PRICE</div>
                          <div className="text-lg font-black font-mono text-[#071B4D]">
                            {regWorkshop.isFree ? 'FREE ENTRY' : `₹${regWorkshop.price || 499}`}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {regWorkshop.isFree ? 'CRM Bypass Configured' : 'Secure Razorpay Gateway'}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 text-center leading-relaxed font-sans mt-2">
                        By proceeding, you agree to Tantrapex Technology Pvt. Ltd.'s{' '}
                        <a href="#/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800">
                          Terms of Service
                        </a>
                        ,{' '}
                        <a href="#/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800">
                          Privacy Policy
                        </a>
                        ,{' '}
                        <a href="#/disclaimer" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800">
                          Disclaimer
                        </a>
                        , and{' '}
                        <a href="#/refund-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800">
                          Cancellation & Refund Policy
                        </a>
                        .
                      </p>

                      <button
                        type="submit"
                        className="w-full py-3.5 mt-2 bg-[#071B4D] hover:bg-blue-900 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] cursor-pointer text-center"
                      >
                        {regWorkshop.isFree ? 'Confirm FREE Pass' : 'Proceed to Payment (Razorpay)'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* 2. SECURE INTERACTIVE RAZORPAY PAYMENT GATEWAY SANDBOX */}
              {isPaying && regWorkshop && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#0b1222] text-white rounded-3xl w-full max-w-md overflow-hidden border border-slate-800 shadow-2xl animate-scale-up">
                    
                    {/* Header simulating true Razorpay Checkout */}
                    <div className="bg-[#131a2e] p-5 border-b border-slate-850 flex items-center justify-between text-left">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-md font-sans">R</div>
                        <div>
                          <div className="text-xs font-black tracking-wider text-slate-300">RAZORPAY SECURE</div>
                          <div className="text-[10px] text-slate-400">TANTRA PEX ONLINE PAYMENTS</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsPaying(false)} 
                        className="text-slate-500 hover:text-white transition-colors text-sm cursor-pointer"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="p-6 flex flex-col gap-5 text-left text-xs font-sans">
                      {/* Amount Details */}
                      <div className="flex justify-between items-center bg-[#131d35] p-4 rounded-2xl border border-slate-800">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PAYING FOR</div>
                          <div className="font-bold text-white text-xs truncate max-w-[200px]">{regWorkshop.title}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOTAL AMOUNT</div>
                          <div className="text-lg font-black font-mono text-emerald-400">₹{regWorkshop.price || 499}</div>
                        </div>
                      </div>

                      {/* Mock Payment Options Selector */}
                      <div className="flex flex-col gap-2.5">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[8px]">Select Payment Channel</span>
                        
                        <button
                          onClick={() => simulateRazorpaySuccess('UPI-MOBILE-REF')}
                          className="p-3.5 bg-[#17223b] hover:bg-[#1f2e50] border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-left font-sans"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[9px] font-mono">UPI</div>
                            <div className="text-slate-200 text-xs font-semibold">Instant UPI (GPay, PhonePe, Paytm)</div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 font-bold">POPULAR</span>
                        </button>

                        <button
                          onClick={() => simulateRazorpaySuccess('CARD-TXN-9821')}
                          className="p-3.5 bg-[#17223b] hover:bg-[#1f2e50] border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-left font-sans"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-[9px] font-mono">CARD</div>
                            <div className="text-slate-200 text-xs font-semibold">Credit or Debit Card (Visa, MasterCard)</div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 font-bold">SECURE</span>
                        </button>

                        <button
                          onClick={() => simulateRazorpaySuccess('NB-TXN-1104')}
                          className="p-3.5 bg-[#17223b] hover:bg-[#1f2e50] border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-left font-sans"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[9px] font-mono">NB</div>
                            <div className="text-slate-200 text-xs font-semibold">Net Banking (SBI, HDFC, ICICI)</div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 font-bold">SANDBOX</span>
                        </button>
                      </div>

                      {/* Security elements */}
                      <div className="text-[10px] text-slate-500 flex items-center justify-center gap-2 mt-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                        <span>This is a secure 256-bit encrypted Razorpay Sandbox Connection.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TICKET PREVIEW & AUTOMATIC ADMIT CARD SUCCESS MODAL */}
              {paymentSuccessData && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 flex flex-col gap-6 shadow-2xl animate-scale-up text-white relative text-left">
                    <button
                      onClick={() => setPaymentSuccessData(null)}
                      className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    >
                      ✕
                    </button>

                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-xl mx-auto animate-bounce mb-3">
                        ✓
                      </div>
                      <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider font-mono">
                        Enrollment Confirmed
                      </span>
                      <h2 className="text-xl font-display font-extrabold text-white mt-2 uppercase tracking-wide">
                        Admit Card Entry Pass
                      </h2>
                      <p className="text-slate-400 text-[10px] mt-0.5">Your official pass has been generated and downloaded. Present this on entry.</p>
                    </div>

                    {/* Highly stylized visual pass pass boarding style card */}
                    <div className={`p-5 rounded-2xl border ${paymentSuccessData.isFree ? 'border-emerald-600/50 bg-emerald-950/10' : 'border-blue-600/50 bg-blue-950/10'} relative overflow-hidden flex flex-col gap-4 shadow-inner`}>
                      
                      {/* Grid background visual */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

                      <div className="flex justify-between items-start border-b border-slate-800 pb-3 relative z-10 font-sans">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 tracking-wider">TANTRA PEX</div>
                          <div className="text-base font-extrabold text-white truncate max-w-[220px]">{paymentSuccessData.workshopTitle}</div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${paymentSuccessData.isFree ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {paymentSuccessData.isFree ? 'FREE ENTRY' : `PAID TICKET`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10 font-mono text-[11px] leading-relaxed">
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">Student Name</div>
                          <div className="text-white font-bold text-xs">{paymentSuccessData.name}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">Ticket Pass ID</div>
                          <div className="text-emerald-400 font-bold text-xs">{paymentSuccessData.id}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">College Allocation</div>
                          <div className="text-slate-200 text-xs truncate" title={paymentSuccessData.college}>{paymentSuccessData.college}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">Transaction Ref</div>
                          <div className="text-slate-300 text-xs truncate">{paymentSuccessData.transactionId}</div>
                        </div>
                      </div>

                      {/* Barcode representation */}
                      <div className="bg-white p-3 rounded-xl flex flex-col items-center gap-1.5 relative z-10">
                        <div className="w-full h-10 flex gap-0.5 justify-center overflow-hidden font-sans">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-slate-950 h-full"
                              style={{ width: `${Math.floor(Math.random() * 3) + 1}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 font-bold tracking-widest">{paymentSuccessData.id}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 flex flex-col gap-1 text-[11px] text-slate-400 leading-relaxed font-sans">
                      <div className="font-bold text-slate-200 uppercase tracking-wider text-[9px] flex items-center gap-1">
                        <Icons.CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Auto-Download Status
                      </div>
                      <p>A confirmation email was successfully sent to <strong>{paymentSuccessData.email}</strong> enclosing this Entry Pass. Your automatic download should have started. If it didn't, please click the button below to retry manual download anytime.</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerCanvasDownload(paymentSuccessData)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors uppercase tracking-wider text-[10px]"
                      >
                        Download Admit Card PNG
                      </button>
                      <button
                        onClick={() => setPaymentSuccessData(null)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors text-[10px]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* original success fallback */}
              {registeredWkTitle && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl flex flex-col items-center text-center gap-4 text-slate-800">
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

              {/* Detailed Workshop Overlay Modal */}
              {selectedWorkshopDetail && (
                <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-slate-100 shadow-2xl flex flex-col gap-6 relative">
                    <button 
                      onClick={() => setSelectedWorkshopDetail(null)} 
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold z-10"
                    >
                      ✕
                    </button>
                    
                    <div className="h-56 md:h-72 w-full rounded-2xl overflow-hidden shadow-md border border-slate-100 shrink-0">
                      <img src={selectedWorkshopDetail.image} alt={selectedWorkshopDetail.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-extrabold rounded-lg font-mono uppercase tracking-wider">
                          {selectedWorkshopDetail.status || "Workshop"}
                        </span>
                        <span className="text-slate-400 text-xs font-mono">•</span>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                          <Icons.MapPin className="h-3.5 w-3.5 text-[#071B4D]" />
                          <span>{selectedWorkshopDetail.location}</span>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-3xl font-display font-black text-[#071B4D] tracking-tight leading-tight">
                        {selectedWorkshopDetail.title}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-[#071B4D] text-xs font-bold bg-[#F7C400]/10 border border-[#F7C400]/25 px-3 py-2 rounded-xl w-fit">
                          <Icons.Calendar className="h-4 w-4 text-[#071B4D] shrink-0" />
                          <span className="font-mono">Date: {selectedWorkshopDetail.date}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl w-fit border ${selectedWorkshopDetail.isFree ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-[#071B4D]/20'}`}>
                          <span className="font-mono">{selectedWorkshopDetail.isFree ? 'FREE WORKSHOP' : `REGISTRATION FEE: ₹${selectedWorkshopDetail.price || 499}`}</span>
                        </div>
                      </div>

                      <p className="text-slate-600 font-sans leading-relaxed text-sm md:text-base border-t border-slate-100 pt-4">
                        {selectedWorkshopDetail.desc}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-2 border-t border-slate-100 pt-5">
                      <button
                        onClick={() => {
                          const wk = selectedWorkshopDetail;
                          setSelectedWorkshopDetail(null);
                          setRegWorkshop(wk);
                        }}
                        className="flex-1 py-3.5 bg-[#071B4D] hover:bg-blue-900 text-white font-sans font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
                      >
                        Register For This Session
                      </button>
                      <button
                        onClick={() => setSelectedWorkshopDetail(null)}
                        className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div id="workshops-section-header" className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-2">
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

              {activeWorkshopTab === 'gallery' ? (
                <div className="flex flex-col gap-8">
                  {galleryImagesPool.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
                      <p className="text-lg font-semibold text-slate-700">There are no gallery photos yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {galleryImagesPool.map((image, index) => (
                        <div key={`${image}-${index}`} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                          <img
                            src={image}
                            alt={`Workshop gallery photo ${index + 1}`}
                            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                currentList.length === 0 ? (
                  <div className="flex flex-col gap-8">
                    {glimpseDisplayImages.length > 0 && (
                      <div className="mt-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {glimpseDisplayImages.map((image, index) => (
                            <div key={`${image}-${index}`} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                              <img src={image} alt="Workshop gallery glimpse" className="h-40 w-full object-cover md:h-44" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <button
                        onClick={() => setActiveWorkshopTab('gallery')}
                        className="group inline-flex items-center gap-3 rounded-xl bg-[#071B4D] px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(7,27,77,0.18)] transition-all hover:bg-[#081f54] hover:shadow-[0_16px_32px_rgba(7,27,77,0.2)]"
                      >
                        <Icons.Image className="h-4 w-4 shrink-0" />
                        <span>View full workshop gallery</span>
                        <Icons.ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ) : (
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
                              <h3 
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight cursor-pointer hover:text-[#F7C400] transition-colors"
                              >
                                {wk.title}
                              </h3>
                              <p className="text-slate-300 font-sans leading-relaxed text-sm">
                                {wk.desc}
                              </p>
                              
                              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mt-4">
                                <Icons.Calendar className="h-4.5 w-4.5 text-[#F7C400] shrink-0" />
                                <span className="font-mono">
                                  {wk.date} | {wk.location} | <strong className="text-[#F7C400] tracking-wider uppercase font-sans text-[10px] bg-[#F7C400]/10 border border-[#F7C400]/25 px-2 py-0.5 rounded-md ml-1">{wk.isFree ? 'FREE' : `₹${wk.price || 499}`}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2.5 items-center">
                              <button
                                onClick={() => setRegWorkshop(wk)}
                                className="px-6 py-3.5 bg-[#F7C400] hover:bg-yellow-400 text-[#071B4D] font-sans font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-fit"
                              >
                                Register Now
                              </button>
                              <button
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-fit"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          {/* Image Container with seamless fade blending */}
                          <div 
                            onClick={() => setSelectedWorkshopDetail(wk)}
                            className="relative md:w-2/5 min-h-[220px] md:min-h-full rounded-2xl overflow-hidden shadow border border-white/5 shrink-0 self-stretch cursor-pointer"
                          >
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
                              <h3 
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="text-2xl md:text-3xl font-display font-black tracking-tight text-slate-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                              >
                                {wk.title}
                              </h3>
                              <p className="text-slate-500 font-sans leading-relaxed text-sm">
                                {wk.desc}
                              </p>
                              
                              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mt-4">
                                <Icons.Calendar className="h-4.5 w-4.5 text-[#071B4D] shrink-0" />
                                <span className="font-mono">
                                  {wk.date} | {wk.location} | <strong className="text-blue-700 tracking-wider uppercase font-sans text-[10px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md ml-1">{wk.isFree ? 'FREE' : `₹${wk.price || 499}`}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2.5 items-center">
                              <button
                                onClick={() => setRegWorkshop(wk)}
                                className="px-6 py-3.5 bg-[#F7C400] hover:bg-yellow-400 text-[#071B4D] font-sans font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-fit"
                              >
                                Register Now
                              </button>
                              <button
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-fit border border-slate-200"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          {/* Image Container with seamless fade blending */}
                          <div 
                            onClick={() => setSelectedWorkshopDetail(wk)}
                            className="relative md:w-2/5 min-h-[220px] md:min-h-full rounded-2xl overflow-hidden shadow border border-slate-100 shrink-0 self-stretch cursor-pointer"
                          >
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
                      <div className="grid grid-cols-1 mobileL:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedWorkshops.slice(2, visibleWorkshopsCount).map((wk: any, i: number) => (
                          <div
                            key={wk.id || i}
                            style={{ backgroundColor: design.cardBackgroundColor, borderColor: design.borderColor }}
                            className="bg-white rounded-2xl border p-6 flex flex-col justify-between gap-5 shadow-sm hover:border-slate-300 hover:shadow transition-all text-left group animate-fade-in"
                          >
                            <div className="flex flex-col gap-3">
                              <div 
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="h-44 rounded-xl overflow-hidden relative cursor-pointer"
                              >
                                <img src={wk.image} alt={wk.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-blue-700 shadow-sm font-mono uppercase">
                                  {wk.location}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-blue-600 font-bold font-mono">
                                <Icons.Calendar className="h-3.5 w-3.5" />
                                <span>{wk.date}</span>
                                <span className="text-slate-300 font-sans">•</span>
                                <span className={wk.isFree ? "text-emerald-600 uppercase font-black" : "text-blue-700 uppercase font-black"}>
                                  {wk.isFree ? "FREE" : `₹${wk.price || 499}`}
                                </span>
                              </div>
                              <h3 
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="text-sm font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                {wk.title}
                              </h3>
                              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">{wk.desc}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => setRegWorkshop(wk)}
                                className="w-full py-2.5 bg-[#071B4D] hover:bg-blue-900 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors cursor-pointer text-center"
                              >
                                Register Now
                              </button>
                              <button
                                onClick={() => setSelectedWorkshopDetail(wk)}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-semibold uppercase tracking-wider text-[9px] rounded-lg border border-slate-200 transition-colors cursor-pointer text-center"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculate randomized Glimpses from Workshop Manager gallery photos and Workshop cover images */}
                  {(() => {
                    const glimpsePool: string[] = [
                      ...galleryImagesPool,
                      ...(rawWorkshops && Array.isArray(rawWorkshops) ? rawWorkshops.map((w: any) => w.image) : [])
                    ].filter((img): img is string => typeof img === 'string' && img.trim().length > 0);

                    const sourceGlimpseList = Array.from(new Set(glimpsePool));

                    const getRandomFourImages = (list: string[], seed: number) => {
                      if (list.length <= 4) return list;
                      const copy = [...list];
                      for (let i = copy.length - 1; i > 0; i--) {
                        const pseudoRand = Math.abs(Math.sin((seed + 1) * 9999 + i * 1337) * 10000);
                        const j = Math.floor(pseudoRand) % (i + 1);
                        [copy[i], copy[j]] = [copy[j], copy[i]];
                      }
                      return copy.slice(0, 4);
                    };

                    const glimpseDisplayImages = getRandomFourImages(sourceGlimpseList, glimpseShuffleKey);

                    return (
                      <>
                        <div className="flex justify-center mt-12 mb-6">
                          {visibleWorkshopsCount < currentList.length ? (
                            <button
                              onClick={() => setVisibleWorkshopsCount(prev => Math.min(prev + 2, currentList.length))}
                              className="group flex items-center gap-2 px-8 py-4 bg-[#071B4D] hover:bg-blue-900 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                            >
                              <span>Load More Workshops</span>
                              <Icons.ChevronDown className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-1 animate-pulse" />
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

                        {glimpseDisplayImages.length > 0 && (
                          <div className="mt-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {glimpseDisplayImages.map((image, index) => (
                                <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                  <img src={image} alt="Workshop gallery glimpse" className="h-36 w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ))}
          </div>
        )})()}

        {/* 19. BLOG GRID (BLOG CMS PAGE) */}
        {type === 'blog-grid' && (
          <div className="flex flex-col gap-8">
            {/* Banner Badge */}
            <div className="flex justify-center pt-20 ">
              
            </div>

            <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
                {title}
              </h2>
              {subtitle && <p className="text-slate-500 font-sans text-sm">{subtitle}</p>}
            </div>

            {publishedBlogs.length > 0 && (
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
            )}

            {publishedBlogs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
                <p className="text-lg font-semibold text-slate-700">There is no blog posted yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs font-sans">
                  {publishedBlogs
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

                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => { navigateToRoute('#/'); }}
                    className="bg-[#071B4D] hover:bg-[#071B4D]/90 text-white font-sans font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span>View All Blogs</span>
                    <Icons.ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 20. CONTACT SPLIT */}
        {type === 'contact-split' && (
          <div className="flex flex-col gap-8 text-[#071B4D]">
            {/* Banner Badge */}
            <div className="flex justify-center">
              <span className="h-20">
                
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl lg:text-4xl font-display font-black text-[#071B4D]" style={{ color: design.headingColor }}>
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
                    href={settings.socialMedia?.linkedin || content.linkedin || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#0077B5] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={settings.socialMedia?.instagram || content.instagram || "https://instagram.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={settings.socialMedia?.youtube || content.youtube || "https://youtube.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#FF0000] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Youtube className="h-4 w-4" />
                  </a>
                  <a
                    href={settings.socialMedia?.facebook || content.facebook || "https://facebook.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#1877F2] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                  >
                    <Icons.Facebook className="h-4 w-4" />
                  </a>
                  {settings.socialMedia?.twitter && (
                    <a
                      href={settings.socialMedia.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-[#1DA1F2] hover:scale-105 hover:shadow-lg transition-all rounded-full text-white cursor-pointer"
                    >
                      <Icons.Twitter className="h-4 w-4" />
                    </a>
                  )}
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

        {/* 21. PRICING HERO SECTION */}
        {type === 'pricing-hero' && (
          <div className="relative w-full overflow-hidden bg-slate-950 rounded-2xl">
            {/* Desktop Background Image */}
            <div 
              className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat transition-all"
              style={{ backgroundImage: `url(${content.desktopBg || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"})` }}
            />
            {/* Mobile Background Image */}
            <div 
              className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat transition-all"
              style={{ backgroundImage: `url(${content.mobileBg || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"})` }}
            />
            {/* Text Overlay Color and Opacity */}
            <div 
              className="absolute inset-0 z-10"
              style={{ backgroundColor: content.overlayColor || "rgba(7, 27, 77, 0.75)" }}
            />

            {/* Content overlay Container */}
            <div className="relative z-20 w-full px-6 py-16 md:py-28 text-center flex flex-col items-center justify-center gap-4 text-white font-sans">
              <span className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                {content.tagline || "Secure Payments via Razorpay"}
              </span>
              <h1 
                onClick={(e) => handleElementClick(e, 'title', title)}
                className="text-3xl md:text-6xl font-display font-black tracking-tight uppercase leading-none drop-shadow"
              >
                {title || "PRICING PLANS"}
              </h1>
              <p 
                onClick={(e) => handleElementClick(e, 'subtitle', subtitle)}
                className="text-sm md:text-lg text-slate-200 max-w-2xl font-light"
              >
                {subtitle || "Choose the perfect plan to accelerate your career journey"}
              </p>
            </div>
          </div>
        )}

        {/* 22. PRICING PLANS SECTION */}
        {type === 'pricing-plans' && (
          <div className="w-full py-6 flex flex-col gap-8 items-center text-[#071B4D]">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <h2 className="text-2xl md:text-4xl font-display font-black text-slate-900" style={{ color: design.headingColor }}>
                {title || "Choose Your Plan"}
              </h2>
              <p className="text-sm text-slate-600">
                {subtitle || "Select a customized track with structured features and mock interview iterations"}
              </p>
            </div>

            <div className="flex justify-center w-full mt-4">
              <div className="flex flex-wrap gap-8 max-w-6xl justify-center">
                {(() => {
                  const plansList = [...(content.plans || [])];
                  // Find the index of the most popular plan
                  const popIdx = plansList.findIndex((p: any) => p.isMostPopular);
                  if (popIdx !== -1 && plansList.length > 1) {
                    const [popularPlan] = plansList.splice(popIdx, 1);
                    // Place it in the middle of the remaining plans list
                    const middleIdx = Math.floor(plansList.length / 2);
                    plansList.splice(middleIdx, 0, popularPlan);
                  }
                  return plansList.map((plan: any, idx: number) => {
                    const isPopular = plan.isMostPopular;
                    const isLocked = plan.isLocked;
                    return (
                      <div 
                        key={plan.id || idx}
                        className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 border ${
                          isPopular 
                            ? 'bg-slate-950 text-white border-amber-400 shadow-2xl scale-105 z-10 w-full md:w-80' 
                            : 'bg-white text-slate-900 border-slate-200 shadow hover:border-blue-300 hover:shadow-lg w-full md:w-64'
                        } ${isLocked ? 'opacity-55 saturate-50 contrast-75' : ''}`}
                      >
                        {isPopular && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] tracking-widest uppercase px-4 py-1 rounded-full shadow-lg z-20">
                            MOST POPULAR
                          </span>
                        )}

                        {isLocked && (
                          <div className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-lg shadow-lg z-20" title="Plan Locked">
                            <Icons.Lock className="h-4 w-4" />
                          </div>
                        )}

                        <div className="p-6 md:p-8 flex flex-col gap-5 h-full">
                          <div>
                            <h3 className="text-lg font-black tracking-tight font-display">{plan.name}</h3>
                            <p className={`text-xs mt-1 ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.subtitle}</p>
                          </div>

                          <div className="py-4 border-y border-slate-100/10 flex items-baseline gap-2">
                            <span className="text-3xl md:text-5xl font-black font-mono">₹{plan.price}</span>
                            <span className={`text-xs font-semibold ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>/ {plan.duration || "3 Months"}</span>
                          </div>

                          {/* Buy/Pay Button is placed immediately under the pricing */}
                          <div className="py-2">
                            <button 
                              onClick={() => {
                                if (isLocked) {
                                  alert("Its locked for future");
                                  return;
                                }
                                setCheckoutPlan(plan);
                                setCheckoutName('');
                                setCheckoutEmail('');
                                setCheckoutPhone('');
                                setCheckoutAgreed(false);
                              }}
                              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                                isLocked
                                  ? 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-450 cursor-pointer border border-dashed border-slate-450'
                                  : isPopular 
                                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10'
                              }`}
                            >
                              {isLocked ? (
                                <>
                                  <Icons.Lock className="h-4 w-4" />
                                  <span>Locked for Future</span>
                                </>
                              ) : (
                                <>
                                  <Icons.CreditCard className="h-4 w-4" />
                                  <span>Select Plan & Pay</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Features are placed below the Pay Button */}
                          <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Plan Features</p>
                            <ul className="flex flex-col gap-2.5 text-xs">
                              {(plan.features || []).map((feat: string, fIdx: number) => (
                                <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                                  <Icons.CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 23. PRICING COMPARISON TABLE */}
        {type === 'pricing-comparison' && (
          <div className="w-full py-6 flex flex-col gap-6 items-center text-[#071B4D]">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900" style={{ color: design.headingColor }}>
                {title || "PLAN COMPARISON"}
              </h2>
              <p className="text-sm text-slate-600">
                {subtitle || "Compare the fine-grain aspects of our recruitment structures"}
              </p>
            </div>

            <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mt-4 font-sans">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 font-bold text-slate-700">Recruitment Feature</th>
                      <th className="p-4 font-bold text-slate-700 text-center">Career Pro Plan</th>
                      <th className="p-4 font-bold text-slate-700 text-center">Self Learning Track</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(content.features || []).map((feat: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">{feat.name}</td>
                        <td className="p-4 text-center">
                          {feat.status === 'checkmark' ? (
                            <Icons.Check className="h-5 w-5 text-emerald-500 mx-auto font-black" />
                          ) : feat.status === 'dash' ? (
                            <span className="text-slate-300">-</span>
                          ) : (
                            <span className="font-bold text-slate-900 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] uppercase">{feat.status}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {idx < 4 ? (
                            <Icons.Check className="h-5 w-5 text-emerald-500/50 mx-auto" />
                          ) : (
                            <Icons.X className="h-4 w-4 text-rose-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 24. PRICING ASSESSMENT INTERACTIVE SECTION */}
        {type === 'pricing-assessment' && (
          <div className="w-full py-6 text-white">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 to-blue-900 border border-blue-900/30 shadow-xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-3 max-w-xl text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">AI PATHWAY FINDER</span>
                <h3 className="text-xl md:text-3xl font-display font-black leading-tight">
                  {title || "Still Not Sure Which Plan is For You?"}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {subtitle || "Take our 30-second rapid pathway quiz to evaluate your preparation levels and get recommended matching bootcamps."}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setAssessmentStep(0);
                      setAssessmentAnswers({});
                      setAssessmentModalOpen(true);
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <Icons.Sparkles className="h-4 w-4 text-slate-950" />
                    <span>{content.btnText || "Take Free Assessment"}</span>
                  </button>
                </div>
              </div>

              <div className="w-full max-w-[280px] md:max-w-xs shrink-0 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                <img 
                  src={content.bannerImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"} 
                  alt="Assessment Banner"
                  className="w-full h-44 md:h-52 object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* 25. PRICING DYNAMIC IMPACT STATS */}
        {type === 'pricing-stats' && (
          <div className="w-full py-6 flex flex-col gap-6 items-center text-[#071B4D]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl">
              {(content.stats || []).map((st: any, sIdx: number) => (
                <div 
                  key={st.id || sIdx}
                  className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-sm hover:shadow transition-shadow flex flex-col gap-1 items-center"
                >
                  <span className="text-2xl md:text-4xl font-mono font-black text-blue-900 tracking-tight">{st.count}</span>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 26. SECURE RAZORPAY PAYMENT MODAL CHECKOUT */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutPlan(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white text-slate-900 rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden relative z-10 font-sans"
            >
              {/* Header */}
              <div className="bg-[#071B4D] text-white p-6 relative">
                <button 
                  onClick={() => setCheckoutPlan(null)}
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <Icons.X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <Icons.CreditCard className="h-6 w-6 text-amber-400" />
                  <div>
                    <h3 className="font-display font-black text-lg">Razorpay Checkout</h3>
                    <p className="text-slate-300 text-[10px] uppercase font-black tracking-widest">Secure Gateway</p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setCheckoutError(null);
                  
                  try {
                    const amount = Number(checkoutPlan.price || 0);
                    const orderRes = await fetch('/api/razorpay/create-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        amount,
                        currency: 'INR',
                        receipt: `plan-${Date.now()}`,
                        notes: { type: 'plan', planName: checkoutPlan.name }
                      })
                    });
                    
                    let orderData = { keyId: razorpayKeyId, order: { id: null } };
                    if (orderRes.ok) {
                      try {
                        orderData = await orderRes.json();
                      } catch (e) {
                        console.warn("Failed to parse order response:", e);
                      }
                    } else {
                      console.warn(`Order creation returned status ${orderRes.status}`);
                    }

                    if (!orderData?.keyId || !orderData?.order?.id) {
                      throw new Error("Razorpay is not configured correctly. Please verify the live API keys.");
                    }
                    
                    const loaded = await loadRazorpayScript();
                    if (!loaded || !(window as any).Razorpay) {
                      throw new Error("Razorpay script could not be loaded.");
                    }

                    const options = {
                      key: orderData?.keyId || razorpayKeyId,
                      amount: amount * 100,
                      currency: "INR",
                      order_id: orderData?.order?.id,
                      name: "Tantrapex Training",
                      description: checkoutPlan.name,
                      image: "https://res.cloudinary.com/dhy9pmo8s/image/upload/v1783025553/Untitled_design_3_hez3tf.png",
                      handler: async function (response: any) {
                        const payId = response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
                        const rzpReceipt = {
                          paymentId: payId,
                          orderId: `order_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                          planName: checkoutPlan.name,
                          amount: checkoutPlan.price,
                          studentName: checkoutName || "Pratham Joshi",
                          studentEmail: checkoutEmail || "student@tantrapex.com",
                          studentPhone: checkoutPhone || "9999999999"
                        };

                        const storedPurchases = localStorage.getItem('tpx_plan_purchases');
                        const purchaseList = storedPurchases ? JSON.parse(storedPurchases) : [];
                        purchaseList.unshift(rzpReceipt);
                        localStorage.setItem('tpx_plan_purchases', JSON.stringify(purchaseList));

                        try {
                          const postRes = await fetch('/api/plan-purchases/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(rzpReceipt)
                          });
                          const data = await postRes.json();
                          if (data.success && data.emailLog) {
                            const storedEmails = localStorage.getItem('tpx_sent_emails');
                            const emailList = storedEmails ? JSON.parse(storedEmails) : [];
                            emailList.unshift(data.emailLog);
                            localStorage.setItem('tpx_sent_emails', JSON.stringify(emailList));
                          }
                        } catch (err) {
                          console.error("Error pushing plan purchase to backend:", err);
                          const storedEmails = localStorage.getItem('tpx_sent_emails');
                          const emailList = storedEmails ? JSON.parse(storedEmails) : [];
                          const emailLog = {
                            id: `EML-${10000 + Math.floor(Math.random() * 90000)}`,
                            recipientName: checkoutName || "Pratham Joshi",
                            recipientEmail: checkoutEmail || "student@tantrapex.com",
                            subject: `Plan Purchase Confirmed: ${checkoutPlan.name}`,
                            bodyPreview: `Dear ${checkoutName || "Pratham Joshi"}, your purchase of ${checkoutPlan.name} plan for ₹${checkoutPlan.price} is confirmed. Payment ID: ${payId}. Confirmation QR enclosed.`,
                            timestamp: new Date().toISOString()
                          };
                          emailList.unshift(emailLog);
                          localStorage.setItem('tpx_sent_emails', JSON.stringify(emailList));
                        }

                        setPaymentSuccessReceipt(rzpReceipt);
                        setCheckoutPlan(null);
                      },
                      prefill: {
                        name: checkoutName || "Pratham Joshi",
                        email: checkoutEmail || "student@tantrapex.com",
                        contact: checkoutPhone || "9999999999"
                      },
                      theme: {
                        color: "#071b4d"
                      }
                    };

                    if (loaded && (window as any).Razorpay && orderData?.order?.id) {
                      const rzp = new (window as any).Razorpay(options);
                      rzp.open();
                    } else {
                      throw new Error("Razorpay could not be initialized.");
                    }
                  } catch (err) {
                    console.error("Failed to initialize Razorpay checkout:", err);
                    setCheckoutError(err instanceof Error ? err.message : "Razorpay checkout could not be initialized.");
                  }
                }}
                className="p-6 flex flex-col gap-4 text-left text-xs"
              >
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#071B4D]">{checkoutPlan.name}</p>
                    <p className="text-slate-500 text-[10px]">Access Duration: {checkoutPlan.duration || "3 Months"}</p>
                  </div>
                  <span className="text-lg font-mono font-black text-[#071B4D]">₹{checkoutPlan.price}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#071B4D]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#071B4D]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#071B4D]"
                  />
                </div>

                {/* Legal Policies Acceptance Checkbox */}
                <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl mt-1 text-left">
                  <input 
                    type="checkbox"
                    id="checkout-agreed-checkbox"
                    checked={checkoutAgreed}
                    onChange={(e) => setCheckoutAgreed(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0 mt-0.5 accent-blue-600"
                  />
                  <label htmlFor="checkout-agreed-checkbox" className="text-[11px] text-slate-700 leading-relaxed cursor-pointer font-sans select-none">
                    I accept Tantrapex Technology Pvt. Ltd.&apos;s{' '}
                    <a 
                      href="#/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 font-bold underline hover:text-blue-800"
                    >
                      Privacy Policy
                    </a>
                    ,{' '}
                    <a 
                      href="#/terms" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 font-bold underline hover:text-blue-800"
                    >
                      Terms of Service
                    </a>
                    ,{' '}
                    <a 
                      href="#/disclaimer" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 font-bold underline hover:text-blue-800"
                    >
                      Disclaimer
                    </a>
                    , and{' '}
                    <a 
                      href="#/refund-policy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 font-bold underline hover:text-blue-800"
                    >
                      Cancellation & Refund Policy
                    </a>
                    .
                  </label>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Icons.CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Razorpay secure encryption active.</span>
                </div>

                <button 
                  type="submit"
                  disabled={!checkoutAgreed}
                  className={`w-full mt-2 py-3.5 font-black uppercase tracking-wider rounded-xl transition-all text-xs flex items-center justify-center gap-2 ${
                    checkoutAgreed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.01] cursor-pointer'
                      : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none opacity-70'
                  }`}
                >
                  Pay ₹{checkoutPlan.price} with Razorpay
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 27. PAYMENTS SUCCESS RECEIPT DIALOG */}
      <AnimatePresence>
        {paymentSuccessReceipt && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentSuccessReceipt(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white text-slate-900 rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden relative z-10 font-sans text-left"
            >
              {/* Receipt Visual Header */}
              <div className="bg-emerald-600 text-white p-8 text-center flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                  <Icons.Check className="h-7 w-7 text-white font-black" />
                </div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight">Payment Successful</h3>
                <p className="text-emerald-100 text-xs">Thank you for enrolling in Tantrapex!</p>
              </div>

              {/* Receipt Details Box */}
              <div className="p-6 md:p-8 flex flex-col gap-5 text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="font-bold text-[#071B4D] uppercase text-[10px] tracking-wider text-slate-400 mb-1">TRANSACTION INVOICE</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-slate-500">Invoice No:</p>
                      <p className="font-mono font-bold text-slate-800">TXN-{paymentSuccessReceipt.paymentId.slice(-6)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Date & Time:</p>
                      <p className="font-bold text-slate-800">{paymentSuccessReceipt.date}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-100 pb-4 flex flex-col gap-2">
                  <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">ENROLMENT DETAILS</h4>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-semibold text-slate-800">{paymentSuccessReceipt.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-semibold text-slate-800">{paymentSuccessReceipt.studentEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone Number:</span>
                    <span className="font-semibold text-slate-800">{paymentSuccessReceipt.studentPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Plan:</span>
                    <span className="font-black text-[#071B4D]">{paymentSuccessReceipt.planName}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-slate-700">Total Amount Paid:</span>
                  <span className="text-xl font-mono font-black text-emerald-600">₹{paymentSuccessReceipt.amount}</span>
                </div>

                <div className="flex flex-col gap-2 bg-blue-50 border border-blue-100 p-4 rounded-xl text-[#071B4D]">
                  <p className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Icons.Sparkles className="h-4 w-4" />
                    <span>How to Access?</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Our training coordinator will email your LMS login credentials and mock interview schedule instructions within 2 hours. Get ready to elevate your career!
                  </p>
                </div>

                <div className="flex mt-2">
                  <button 
                    onClick={() => setPaymentSuccessReceipt(null)}
                    className="w-full py-3 bg-[#071B4D] hover:bg-[#071B4D]/90 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-900/10 text-center"
                  >
                    Close Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 28. FREE CAREER ASSESSMENT QUIZ MODAL */}
      <AnimatePresence>
        {assessmentModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssessmentModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white text-slate-900 rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden relative z-10 font-sans text-left"
            >
              {/* Header */}
              <div className="bg-[#071B4D] text-white p-6 relative">
                <button 
                  onClick={() => setAssessmentModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <Icons.X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <Icons.Sparkles className="h-6 w-6 text-amber-400" />
                  <div>
                    <h3 className="font-display font-black text-lg">AI Pathway Assessment</h3>
                    <p className="text-slate-300 text-[10px] uppercase font-black tracking-widest">Question {assessmentStep + 1} of 3</p>
                  </div>
                </div>
              </div>

              {/* Quiz Steps */}
              <div className="p-6 flex flex-col gap-5 text-xs">
                
                {/* Question 1 */}
                {assessmentStep === 0 && (
                  <div className="flex flex-col gap-4">
                    <p className="font-black text-sm text-[#071B4D]">1. What is your primary career goal?</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { key: "soft", text: "Software Developer (Java / Full Stack)" },
                        { key: "data", text: "Data Analyst & Business Intelligence" },
                        { key: "qa", text: "Quality Assurance & Automation Engineer" },
                        { key: "off", text: "Off-campus & Core corporate placements" }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setAssessmentAnswers({ ...assessmentAnswers, q1: item.key });
                            setAssessmentStep(1);
                          }}
                          className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all font-semibold"
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question 2 */}
                {assessmentStep === 1 && (
                  <div className="flex flex-col gap-4">
                    <p className="font-black text-sm text-[#071B4D]">2. What is your current college year or status?</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { key: "pre", text: "Pre-final Year (3rd Year / 6th Sem)" },
                        { key: "fin", text: "Final Year (4th Year / 8th Sem)" },
                        { key: "pass", text: "Passed Out Student / Looking for jobs" },
                        { key: "work", text: "Working Professional looking to switch" }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setAssessmentAnswers({ ...assessmentAnswers, q2: item.key });
                            setAssessmentStep(2);
                          }}
                          className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all font-semibold"
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question 3 */}
                {assessmentStep === 2 && (
                  <div className="flex flex-col gap-4">
                    <p className="font-black text-sm text-[#071B4D]">3. What is your current preparation level?</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { key: "beg", text: "Beginner - Have basic theory knowledge" },
                        { key: "int", text: "Intermediate - Can code but struggle in aptitude / DSA" },
                        { key: "adv", text: "Advanced - Ready but need premium referrals & mock drives" }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setAssessmentAnswers({ ...assessmentAnswers, q3: item.key });
                            setAssessmentStep(3); // Go to results
                          }}
                          className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all font-semibold"
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question 3 Result output */}
                {assessmentStep === 3 && (
                  <div className="flex flex-col gap-4 text-center">
                    <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                      <Icons.TrendingUp className="h-5 w-5" />
                    </div>
                    <h4 className="font-display font-black text-base text-[#071B4D] uppercase">Your Career Path Analysis</h4>
                    
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs leading-relaxed text-slate-700">
                      <p className="font-bold text-[#071B4D] mb-1">RECOMMENDATION: CAREER PRO PLAN</p>
                      Based on your goals and beginner/intermediate status, we recommend starting immediately with the complete three-month Career Pro bootcamp. Includes complete ATS Resume optimization, unlimited mock runs, and premium direct placement access.
                    </div>

                    <div className="flex gap-2.5 mt-2">
                      <button
                        onClick={() => setAssessmentModalOpen(false)}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase transition-all"
                      >
                        Explore More
                      </button>
                      <button
                        onClick={() => {
                          setAssessmentModalOpen(false);
                          const activePlans = content.plans || [];
                          const targetPlan = activePlans[0] || { id: "plan-career-pro", name: "CAREER PRO PLAN", price: 3000 };
                          setCheckoutPlan(targetPlan);
                        }}
                        className="flex-1 py-3 bg-[#071B4D] hover:bg-[#071B4D]/95 text-white font-black uppercase tracking-wider rounded-xl transition-all"
                      >
                        Enroll Now (₹3000)
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
