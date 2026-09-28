import React, { useState } from 'react';
import { 
  CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost, Lead 
} from '../../types';
import { 
  GraduationCap, Presentation, FileBadge, Contact, Building2, Award, 
  MapPin, Phone, Mail, Globe, Linkedin, Instagram, Youtube, Facebook, Check 
} from 'lucide-react';

interface PublicCollegePartnershipPageProps {
  page: CMSPage;
  settings: GlobalSettings;
  placedStudents: PlacedStudent[];
  hiringPartners: HiringPartner[];
  courses: Course[];
  blogs: BlogPost[];
  onAddLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
}

const DEFAULT_COLLEGE_SECTIONS = [
  {
    id: "partnership-badge-hero",
    type: "partnership-badge-hero",
    title: "Partner With Us",
    subtitle: "We work with colleges to provide better career opportunities",
    content: {
        badgeText: " ",
      brochureBtnText: "Download Brochure",
      brochureBtnLink: "#",
      registerBtnText: "Register Your College",
      registerBtnLink: "#contact",
      benefits: [
        { id: "b1", title: "Workshops & Seminars", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=120" },
        { id: "b2", title: "CRT Training Programs", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=120" },
        { id: "b3", title: "Placement Drives", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=120" },
        { id: "b4", title: "Industrial Visits", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120" },
        { id: "b5", title: "Faculty Development", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120" }
      ]
    }
  },
  {
    id: "partnership-why",
    type: "partnership-why",
    title: "Why Partner With TANTRAPEX?",
    subtitle: "",
    content: {
      cards: [
        { id: "c1", title: "Industry Exposure", desc: "Give your students real world industry exposure.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=120" },
        { id: "c2", title: "Better Placements", desc: "Improve placement rate with our training programs.", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=120" },
        { id: "c3", title: "Skill Development", desc: "Enhance skills and employability of your students.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120" },
        { id: "c4", title: "Career Growth", desc: "Help students to build a successful career path.", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=120" },
        { id: "c5", title: "Long Term Association", desc: "Build a strong and long term partnership.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120" },
        { id: "c6", title: "Dedicated Support", desc: "Get dedicated support from our expert team.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=120" }
      ]
    }
  },
  {
    id: "partnership-stats",
    type: "partnership-stats",
    title: "Key Metrics & Success",
    subtitle: "",
    content: {
      stats: [
        { id: "s1", count: "50+", label: "Partner Colleges", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=120" },
        { id: "s2", count: "20K+", label: "Students Trained", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=120" },
        { id: "s3", count: "500+", label: "Placement Drives", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=120" },
        { id: "s4", count: "100+", label: "Workshops Conducted", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120" },
        { id: "s5", count: "95%", label: "Placement Assistance", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=120" }
      ]
    }
  },
  {
    id: "partnership-contact",
    type: "partnership-contact",
    title: "Get In Touch",
    subtitle: "Interested in partnering with us? Let's build better futures together.",
    content: {
      officeTitle: "Bhopal Office",
      officeAddress: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016",
      phone: "+91 90900 12345",
      email: "info@tantrapex.com",
      website: "www.tantrapex.com",
      linkedinUrl: "https://linkedin.com",
      instagramUrl: "https://instagram.com",
      youtubeUrl: "https://youtube.com",
      facebookUrl: "https://facebook.com"
    }
  },
  {
    id: "partnership-cta",
    type: "partnership-cta",
    title: "Ready to start your journey?",
    subtitle: "Register now and get a free demo class.",
    content: {
      ctaBtnText: "Register Now",
      ctaBtnLink: "#contact"
    }
  }
];

export default function PublicCollegePartnershipPage({
  page,
  settings,
  onAddLead
}: PublicCollegePartnershipPageProps) {
  // Ensure sections exist or load defaults
  const sections = DEFAULT_COLLEGE_SECTIONS.map(defSec => {
    const existing = page?.sections?.find(s => s.id === defSec.id || s.type === defSec.type);
    if (existing) {
      return {
        ...defSec,
        ...existing,
        content: {
          ...defSec.content,
          ...existing.content
        }
      };
    }
    return defSec;
  });

  const heroSec = sections[0];
  const whySec = sections[1];
  const statsSec = sections[2];
  const contactSec = sections[3];
  const ctaSec = sections[4];

  // Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    phone: '',
    purpose: 'College Placement Partnership',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);

    try {
      const fullMessage = `College: ${formData.college || 'Not Specified'}\nPurpose: ${formData.purpose}\n\nMessage: ${formData.message || 'No message'}`;
      onAddLead({
        type: 'partnership',
        name: formData.name,
        email: formData.email || 'no-email@tantrapex.com',
        phone: formData.phone,
        message: fullMessage,
        status: 'new'
      });
      setSuccess(true);
      setFormData({ name: '', college: '', email: '', phone: '', purpose: 'College Placement Partnership', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to render benefits icons
  const getHeroIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Presentation className="h-6 w-6 text-[#071B4D]" />;
      case 1: return <FileBadge className="h-6 w-6 text-[#071B4D]" />;
      case 2: return <Contact className="h-6 w-6 text-[#071B4D]" />;
      case 3: return <Building2 className="h-6 w-6 text-[#071B4D]" />;
      default: return <GraduationCap className="h-6 w-6 text-[#071B4D]" />;
    }
  };

  // Helper to render why icons
  const getWhyIcon = (idx: number) => {
    switch (idx) {
      case 0: return { icon: <GraduationCap className="h-6 w-6" />, bg: "bg-blue-50 text-blue-600 border border-blue-100" };
      case 1: return { icon: <Award className="h-6 w-6" />, bg: "bg-purple-50 text-purple-600 border border-purple-100" };
      case 2: return { icon: <FileBadge className="h-6 w-6" />, bg: "bg-orange-50 text-orange-600 border border-orange-100" };
      case 3: return { icon: <Presentation className="h-6 w-6" />, bg: "bg-emerald-50 text-emerald-600 border border-emerald-100" };
      case 4: return { icon: <Building2 className="h-6 w-6" />, bg: "bg-yellow-50 text-yellow-600 border border-yellow-100" };
      default: return { icon: <Contact className="h-6 w-6" />, bg: "bg-pink-50 text-pink-600 border border-pink-100" };
    }
  };

  // Helper for stats icons
  const getStatIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Building2 className="h-5 w-5 text-amber-400" />;
      case 1: return <GraduationCap className="h-5 w-5 text-amber-400" />;
      case 2: return <Contact className="h-5 w-5 text-amber-400" />;
      case 3: return <Presentation className="h-5 w-5 text-amber-400" />;
      default: return <Award className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-white text-slate-800 font-sans leading-relaxed">
      
      {/* 1. HERO & BENEFITS ROW SECTION */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          
          {/* Top Badge */}
          {heroSec.content.badgeText && (
            <div className="mb-6 inline-flex items-center justify-center bg-[#071B4D] text-white px-6 py-2 rounded-full shadow-md">
              <span className="font-sans font-extrabold text-[11px] md:text-xs uppercase tracking-widest">
                {heroSec.content.badgeText}
              </span>
            </div>
          )}

          {/* Main Headings */}
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#071B4D] tracking-tight mb-4">
            {heroSec.title}
          </h1>
          {heroSec.subtitle && (
            <p className="text-slate-500 text-base md:text-lg max-w-2xl font-sans mb-12">
              {heroSec.subtitle}
            </p>
          )}

          {/* 5 Benefits Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 w-full max-w-5xl mb-12">
            {heroSec.content.benefits?.map((item: any, idx: number) => {
              const isUrl = item.image && (item.image.startsWith('http') || item.image.startsWith('data:'));
              return (
                <div key={item.id || idx} className="flex flex-col items-center p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm transition-all text-center">
                  <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 overflow-hidden shadow-inner shrink-0">
                    {isUrl ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      getHeroIcon(idx)
                    )}
                  </div>
                  <h3 className="font-display font-extrabold text-slate-800 text-xs md:text-sm tracking-tight leading-tight">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Brochure & Register Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {heroSec.content.registerBtnText && (
              <a 
                href={heroSec.content.registerBtnLink || "#contact"} 
                className="px-8 py-3.5 bg-[#071B4D] hover:bg-slate-900 text-white font-extrabold text-xs md:text-sm uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all font-sans text-center min-w-[220px]"
              >
                {heroSec.content.registerBtnText}
              </a>
            )}
            {heroSec.content.brochureBtnText && (
              <button 
                onClick={() => alert("Brochure download initiated... Thank you for partnering!")}
                className="px-8 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-extrabold text-xs md:text-sm uppercase tracking-widest rounded-lg shadow-sm hover:shadow transition-all font-sans text-center min-w-[220px]"
              >
                {heroSec.content.brochureBtnText}
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 2. WHY PARTNER WITH TANTRAPEX SECTION */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#071B4D] tracking-tight">
              {whySec.title || "Why Partner With TANTRAPEX?"}
            </h2>
            {whySec.subtitle && (
              <p className="text-slate-500 text-sm font-sans">{whySec.subtitle}</p>
            )}
          </div>

          {/* Grid of 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whySec.content.cards?.map((item: any, idx: number) => {
              const isUrl = item.image && (item.image.startsWith('http') || item.image.startsWith('data:'));
              const fallbackIcon = getWhyIcon(idx);
              return (
                <div 
                  key={item.id || idx} 
                  className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-4"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner ${fallbackIcon.bg}`}>
                    {isUrl ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      fallbackIcon.icon
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display font-extrabold text-slate-900 text-sm md:text-base leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. METRICS / STATS COUNTER ROW SECTION */}
      <section className="bg-[#071B4D] text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 items-center justify-center text-center">
            {statsSec.content.stats?.map((stat: any, idx: number) => {
              const isUrl = stat.image && (stat.image.startsWith('http') || stat.image.startsWith('data:'));
              return (
                <div 
                  key={stat.id || idx} 
                  className={`flex flex-col items-center justify-center ${
                    idx !== 0 ? 'md:border-l md:border-white/10 md:pl-4' : ''
                  }`}
                >
                  {/* Small icon header */}
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mb-3 overflow-hidden">
                    {isUrl ? (
                      <img 
                        src={stat.image} 
                        alt={stat.label} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      getStatIcon(idx)
                    )}
                  </div>
                  <span className="text-3xl md:text-4xl font-display font-extrabold text-amber-400 tracking-tight leading-none mb-1">
                    {stat.count}
                  </span>
                  <span className="text-white/80 text-[11px] md:text-xs font-semibold uppercase tracking-wider font-sans">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. GET IN TOUCH / INQUIRY FORM SECTION */}
      <section id="contact" className="py-16 md:py-24 bg-white border-b border-slate-100 scroll-mt-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#071B4D] tracking-tight">
                {contactSec.title}
              </h2>
              {contactSec.subtitle && (
                <p className="text-slate-500 text-sm md:text-base font-sans">
                  {contactSec.subtitle}
                </p>
              )}
            </div>

            {/* Address Info Cards */}
            <div className="flex flex-col gap-4 mt-4">
              
              {/* Bhopal Office Address */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/60">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm leading-tight">
                    {contactSec.content.officeTitle || "Bhopal Office"}
                  </span>
                  <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">
                    {contactSec.content.officeAddress || "123, Arera Colony, Bhopal, Madhya Pradesh - 462016"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/60">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Call Directly</span>
                  <a href={`tel:${contactSec.content.phone}`} className="font-bold text-slate-800 text-sm md:text-base hover:text-blue-600 transition-colors">
                    {contactSec.content.phone || "+91 90900 12345"}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/60">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Email Inquiry</span>
                  <a href={`mailto:${contactSec.content.email}`} className="font-bold text-slate-800 text-sm md:text-base hover:text-blue-600 transition-colors">
                    {contactSec.content.email || "info@tantrapex.com"}
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/60">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Official Portal</span>
                  <a href={`https://${contactSec.content.website}`} target="_blank" rel="noreferrer" className="font-bold text-slate-800 text-sm md:text-base hover:text-blue-600 transition-colors">
                    {contactSec.content.website || "www.tantrapex.com"}
                  </a>
                </div>
              </div>

            </div>

            {/* Social Media Row */}
            <div className="flex items-center gap-3 mt-4">
              {contactSec.content.linkedinUrl && (
                <a href={contactSec.content.linkedinUrl} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full border border-slate-200 hover:border-[#0077b5] flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#0077b5] transition-all shadow-sm">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {contactSec.content.instagramUrl && (
                <a href={contactSec.content.instagramUrl} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full border border-slate-200 hover:border-[#e1306c] flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#e1306c] transition-all shadow-sm">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {contactSec.content.youtubeUrl && (
                <a href={contactSec.content.youtubeUrl} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full border border-slate-200 hover:border-[#ff0000] flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#ff0000] transition-all shadow-sm">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {contactSec.content.facebookUrl && (
                <a href={contactSec.content.facebookUrl} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full border border-slate-200 hover:border-[#1877f2] flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#1877f2] transition-all shadow-sm">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
            
            {success ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#071B4D]">Inquiry Registered Successfully!</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Thank you for connecting with us. Our institutional relations representative will call you back within 24 working hours.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2.5 bg-[#071B4D] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded transition-all"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="flex flex-col gap-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#071B4D] uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#071B4D] uppercase tracking-wider">Your College</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter college name"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#071B4D] uppercase tracking-wider">Your Email</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#071B4D] uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-[#071B4D] uppercase tracking-wider">Purpose</label>
                  <select 
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans cursor-pointer"
                  >
                    <option value="College Placement Partnership">College Placement Partnership</option>
                    <option value="Workshops / Seminars">Workshops / Seminars</option>
                    <option value="CRT Training">CRT Training</option>
                    <option value="Other Inquiries">Other Inquiries</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-[#071B4D] uppercase tracking-wider">Your Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Write message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans resize-none placeholder:text-slate-400"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="mt-2 w-full py-3 bg-[#071B4D] hover:bg-slate-900 text-white font-extrabold text-xs md:text-sm uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition-all text-center"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* 5. READY TO START YOUR JOURNEY BANNER SECTION */}
      <section className="py-12 md:py-16 bg-[#071B4D] text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
              {ctaSec.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base font-sans">
              {ctaSec.subtitle}
            </p>
          </div>
          <a 
            href={ctaSec.content.ctaBtnLink || "#contact"} 
            className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-[#071B4D] font-extrabold text-xs md:text-sm uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all font-sans text-center min-w-[200px]"
          >
            {ctaSec.content.ctaBtnText || "Register Now"}
          </a>
        </div>
      </section>

    </div>
  );
}
