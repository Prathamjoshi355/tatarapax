import React, { useState } from 'react';
import { CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost, Lead } from '../../types';
import { DEFAULT_COLLEGES_SECTIONS } from '../../lib/defaultColleges';
import {
  School,
  CheckCircle,
  Terminal,
  BarChart3,
  Building2,
  ArrowRight,
  ChevronRight,
  FileText,
  Sliders,
  FileCheck,
  Rocket,
  BadgePercent,
  ShieldCheck,
  Headphones,
  Mail,
  Phone,
  Clock,
  Gavel,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface PublicCollegePartnershipPageProps {
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

const iconMap: Record<string, React.ElementType> = {
  School,
  CheckCircle,
  Terminal,
  BarChart3,
  Building2,
  FileText,
  Sliders,
  FileCheck,
  Rocket,
  BadgePercent,
  ShieldCheck,
  Headphones
};

export default function PublicCollegePartnershipPage({
  page,
  onAddLead,
  isVisualMode = false
}: PublicCollegePartnershipPageProps) {
  const sections = (page.sections && page.sections.length > 0 && page.sections.some(s => s.type.startsWith('college-')))
    ? page.sections
    : DEFAULT_COLLEGES_SECTIONS;

  const heroSec = sections.find(s => s.type === 'college-hero') || DEFAULT_COLLEGES_SECTIONS[0];
  const benefitsSec = sections.find(s => s.type === 'college-benefits') || DEFAULT_COLLEGES_SECTIONS[1];
  const processSec = sections.find(s => s.type === 'college-process') || DEFAULT_COLLEGES_SECTIONS[2];
  const enquirySec = sections.find(s => s.type === 'college-enquiry') || DEFAULT_COLLEGES_SECTIONS[3];
  const statutorySec = sections.find(s => s.type === 'college-statutory') || DEFAULT_COLLEGES_SECTIONS[4];

  const heroContent = heroSec.content || {};
  const benefitsContent = benefitsSec.content || {};
  const processContent = processSec.content || {};
  const enquiryContent = enquirySec.content || {};
  const statutoryContent = statutorySec.content || {};

  const chipsList = heroContent.chips || [];
  const pillarsList = benefitsContent.pillars || [];
  const stepsList = processContent.steps || [];
  const featuresList = enquiryContent.features || [];
  const contactInfo = enquiryContent.contact || {};
  const formConfig = enquiryContent.form || {};

  // Form state
  const [formData, setFormData] = useState({
    collegeName: '',
    contactName: '',
    designation: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    studentCount: '',
    interestAreas: [] as string[],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInterestToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      interestAreas: prev.interestAreas.includes(area)
        ? prev.interestAreas.filter(a => a !== area)
        : [...prev.interestAreas, area]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onAddLead) {
        onAddLead({
          name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          course: `College Partnership: ${formData.collegeName} (${formData.studentCount} students)`,
          status: 'new',
          notes: `Designation: ${formData.designation} | Location: ${formData.city}, ${formData.state} | Interests: ${formData.interestAreas.join(', ')} | Note: ${formData.message}`
        });
      }

      // Also persist lead directly to API if available
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            course: `College Partnership: ${formData.collegeName}`,
            status: 'new',
            notes: `Designation: ${formData.designation} | City: ${formData.city}, ${formData.state} | Batch: ${formData.studentCount} | Areas: ${formData.interestAreas.join(', ')} | Message: ${formData.message}`
          })
        });
      } catch (e) {
        // Fallback
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting college inquiry:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans select-text">

      {/* 1. TOP BREADCRUMB & EXECUTIVE HEADER SECTION */}
      <section className="w-full bg-[#f2f4f8] py-12 lg:py-16 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs font-semibold text-[#5f5e5e]">
            <a href="#/" className="hover:text-[#191c1f] transition-colors">
              {heroContent.breadcrumbHome || 'Home'}
            </a>
            <ChevronRight className="h-3.5 w-3.5 text-[#707a67]" />
            <span aria-current="page" className="text-[#191c1f] font-bold">
              {heroContent.breadcrumbCurrent || 'College Partnerships'}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e0e2e6] rounded-md text-[#191c1f] w-fit">
                <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest font-mono">
                  {heroContent.badgeText || 'FOR ENGINEERING COLLEGES & INSTITUTIONS'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#191c1f] tracking-tight font-extrabold font-display leading-[1.1]">
                {heroSec.title || 'Partner with TantraPex'}
              </h1>

              <p className="text-base sm:text-lg text-[#5f5e5e] max-w-2xl leading-relaxed">
                {heroSec.subtitle || 'Collaborate with TantraPex Technologies to bring corporate training, aptitude assessments, and verified placement drives to your campus.'}
              </p>
            </div>

            {/* Quick Data Snapshot Chip Stack */}
            <div className="flex flex-wrap lg:flex-col gap-3 lg:items-end shrink-0">
              {chipsList.map((chip: any, idx: number) => {
                const IconComponent = iconMap[chip.icon] || (idx === 0 ? School : CheckCircle);
                return (
                  <div
                    key={chip.id || idx}
                    className="bg-white px-5 py-3.5 rounded-xl shadow-xs border border-[#e0e2e6] flex items-center gap-3.5 min-w-[220px]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#80d64b]/20 flex items-center justify-center text-[#2e6c00]">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#191c1f] font-display leading-tight">
                        {chip.value}
                      </div>
                      <div className="text-[11px] font-bold text-[#5f5e5e] uppercase tracking-wider font-mono mt-0.5">
                        {chip.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 2. PURPOSE & CORE INSTITUTIONAL BENEFITS (3 HIGH-IMPACT CARDS) */}
      <section className="w-full bg-[#f7f9fd] py-16 lg:py-24 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="flex flex-col gap-2 mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2e6c00] font-mono">
              {benefitsContent.eyebrow || 'CORE INSTITUTIONAL VALUE'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1f] font-display">
              {benefitsSec.title || 'Structured Campus Readiness Infrastructure'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillarsList.map((pillar: any, idx: number) => {
              const IconComp = iconMap[pillar.icon] || Terminal;

              return (
                <div
                  key={pillar.id || idx}
                  className="bg-white p-7 rounded-2xl shadow-xs border border-[#e0e2e6] flex flex-col justify-between group hover:shadow-md hover:border-[#80d64b] transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e6e8ec] group-hover:bg-[#80d64b]/20 flex items-center justify-center text-[#191c1f] group-hover:text-[#2e6c00] transition-colors">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#707a67] font-mono">
                      {pillar.pillarNumber || `Pillar 0${idx + 1}`}
                    </div>
                    <h3 className="text-xl font-bold text-[#191c1f] font-display group-hover:text-[#2e6c00] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 bg-[#f2f4f8] -mx-7 -mb-7 p-6 rounded-b-2xl flex items-center justify-between border-t border-[#e0e2e6]/70">
                    <span className="text-xs font-bold text-[#191c1f]">
                      {pillar.bottomTag}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#2e6c00] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. HOW THE COLLEGE COLLABORATION WORKS (4-STEP LINEAR WORKFLOW) */}
      <section className="w-full bg-[#f2f4f8] py-16 lg:py-24 border-b border-[#e0e2e6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2e6c00] font-mono">
              {processContent.eyebrow || 'INSTITUTIONAL ROADMAP'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1f] font-display mt-2">
              {processSec.title || 'How the College Collaboration Works'}
            </h2>
            <p className="text-sm sm:text-base text-[#5f5e5e] mt-3 leading-relaxed">
              {processSec.subtitle || 'A transparent, step-by-step engagement process designed to quickly integrate with your academic calendar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsList.map((step: any, idx: number) => {
              const IconComponent = iconMap[step.icon] || FileText;
              const isHighlight = step.isHighlighted;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl flex flex-col justify-between border transition-all ${
                    isHighlight
                      ? 'bg-white border-[#80d64b] shadow-sm'
                      : 'bg-white border-[#e0e2e6] hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-sm ${
                          isHighlight
                            ? 'bg-[#80d64b] text-[#092100]'
                            : 'bg-[#191c1f] text-white'
                        }`}
                      >
                        {step.stepNumber || idx + 1}
                      </span>
                      <IconComponent
                        className={`h-5 w-5 ${
                          isHighlight ? 'text-[#2e6c00]' : 'text-[#5f5e5e]'
                        }`}
                      />
                    </div>

                    <h3 className="text-base font-bold text-[#191c1f] font-display mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#5f5e5e] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 bg-[#f2f4f8] -mx-6 -mb-6 px-6 py-3 rounded-b-2xl border-t border-[#e0e2e6]/70">
                    <span className="text-[10px] font-extrabold text-[#191c1f] uppercase tracking-wider font-mono">
                      {step.bottomTag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. COLLEGE / INSTITUTION ENQUIRY FORM (2-COLUMN SECTION) */}
      <section className="w-full bg-[#f7f9fd] py-16 lg:py-24 border-b border-[#e0e2e6]" id="enquiry-section">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Side: Summary & Institutional Support Desk */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#2e6c00] font-mono">
                  {enquiryContent.eyebrow || 'DIRECT PARTNERSHIP DESK'}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#191c1f] font-display mt-2 leading-tight">
                  {enquirySec.title || 'Why 120+ Engineering Colleges Partner with TantraPex'}
                </h2>
                <p className="text-sm sm:text-base text-[#5f5e5e] mt-4 leading-relaxed">
                  {enquirySec.subtitle || 'We bridge the gap between classroom theory and enterprise expectations with zero operational burden on your training cell.'}
                </p>
              </div>

              {/* 3 Value Propositions */}
              <div className="flex flex-col gap-3.5">
                {featuresList.map((feat: any, idx: number) => {
                  const FeatIcon = iconMap[feat.icon] || ShieldCheck;

                  return (
                    <div
                      key={feat.id || idx}
                      className="bg-white p-5 rounded-2xl border border-[#e0e2e6] flex items-start gap-4 shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#80d64b]/20 flex items-center justify-center text-[#2e6c00] shrink-0 mt-0.5">
                        <FeatIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#191c1f] font-display">
                          {feat.title}
                        </h4>
                        <p className="text-xs text-[#5f5e5e] leading-relaxed mt-1">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Institutional Support Desk Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#e0e2e6] shadow-xs flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191c1f] font-mono">
                  {contactInfo.deskTitle || 'Institutional Support Desk'}
                </span>
                <div className="flex flex-col gap-2.5 text-xs text-[#5f5e5e]">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#191c1f]" />
                    <a
                      href={`mailto:${contactInfo.email || 'partnerships@tantrapex.com'}`}
                      className="text-[#191c1f] font-semibold hover:text-[#2e6c00] transition-colors"
                    >
                      {contactInfo.email || 'partnerships@tantrapex.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#191c1f]" />
                    <span className="text-[#191c1f] font-semibold">
                      {contactInfo.phone || '+91 (080) 4128-9900'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#707a67]" />
                    <span>{contactInfo.timing || 'Mon – Fri: 09:30 AM – 06:30 PM IST'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive College Enquiry Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#e0e2e6] shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#191c1f] font-display">
                  {formConfig.title || 'College Partnership Enquiry'}
                </h3>
                <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1.5 leading-relaxed">
                  {formConfig.subtitle || 'Submit your college information below. Our institutional coordinator will respond within 24 business hours.'}
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-[#f2f4f8] rounded-2xl border border-[#80d64b] flex items-start gap-4 animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-[#80d64b] flex items-center justify-center text-[#092100] shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base font-bold text-[#191c1f] font-display">
                      {formConfig.successTitle || 'Partnership Enquiry Received'}
                    </h4>
                    <p className="text-xs text-[#5f5e5e] leading-relaxed">
                      {formConfig.successDesc || 'Thank you. Our institutional liaison desk will contact the designated TPO within 24 business hours.'}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          collegeName: '',
                          contactName: '',
                          designation: '',
                          email: '',
                          phone: '',
                          city: '',
                          state: '',
                          studentCount: '',
                          interestAreas: [],
                          message: ''
                        });
                      }}
                      className="mt-3 text-xs font-bold text-[#2e6c00] hover:underline self-start"
                    >
                      Submit Another Inquiry →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* College Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                      College / Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Institute of Engineering & Technology"
                      value={formData.collegeName}
                      onChange={e => setFormData({ ...formData, collegeName: e.target.value })}
                      className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Contact Person & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                        Contact Person's Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. S. K. Sharma"
                        value={formData.contactName}
                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                        className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                        Designation / Role *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Head of Training & Placements (TPO)"
                        value={formData.designation}
                        onChange={e => setFormData({ ...formData, designation: e.target.value })}
                        className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Official Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tpo@niet-edu.in"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Pune"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Batch Size Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                      Approximate Final Year Student Count *
                    </label>
                    <select
                      required
                      value={formData.studentCount}
                      onChange={e => setFormData({ ...formData, studentCount: e.target.value })}
                      className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="" disabled>Select Final Year Batch Size</option>
                      <option value="100-300">100 - 300 Students</option>
                      <option value="300-600">300 - 600 Students</option>
                      <option value="600+">600+ Students</option>
                    </select>
                  </div>

                  {/* Interested Areas */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                      Interested Areas (Select all that apply)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'campus_training', label: 'Campus Training' },
                        { id: 'pooled_drives', label: 'Pooled Placement Drives' },
                        { id: 'mock_interviews', label: 'Mock Interviews' },
                        { id: 'faculty_workshops', label: 'Faculty Workshops' }
                      ].map(item => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-[#f2f4f8] hover:bg-[#eceef2] rounded-xl cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.interestAreas.includes(item.id)}
                            onChange={() => handleInterestToggle(item.id)}
                            className="w-4 h-4 rounded accent-[#2e6c00] cursor-pointer"
                          />
                          <span className="text-xs font-medium text-[#191c1f]">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message / Additional Details */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#191c1f] uppercase tracking-wide">
                      Message / Additional Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention key departments (CSE, ECE, Mechanical), preferred drive months, or specific bootcamp requirements..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="bg-[#f2f4f8] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#191c1f] border border-transparent focus:border-[#80d64b] focus:bg-white focus:outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#80d64b] hover:bg-[#85dc50] text-[#092100] text-sm font-extrabold rounded-xl shadow-xs transition-colors text-center cursor-pointer disabled:opacity-50 mt-2 font-display"
                  >
                    {isSubmitting ? 'Submitting Enquiry...' : (formConfig.buttonText || 'Submit College Partnership Enquiry')}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 5. STATUTORY & ETHICAL COMPLIANCE NOTE */}
      <section className="w-full bg-[#e6e8ec] py-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center gap-4">
          <Gavel className="h-5 w-5 text-[#191c1f] shrink-0" />
          <p className="text-xs sm:text-sm text-[#191c1f] font-medium leading-relaxed">
            <span className="font-extrabold">{statutoryContent.statutoryLabel || 'Statutory Note:'}</span>{' '}
            {statutoryContent.statutoryText || 'TantraPex Technologies works directly with approved college placement cells and TPOs. No commercial fees are charged to students for applying to drives.'}
          </p>
        </div>
      </section>

    </div>
  );
}
