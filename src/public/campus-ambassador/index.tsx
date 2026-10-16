import React, { useState } from 'react';
import { CMSPage, GlobalSettings, Lead } from '../../types';
import { DEFAULT_AMBASSADOR_SECTIONS, AmbassadorResponsibilityCard } from '../../lib/defaultAmbassador';
import {
  Home,
  ChevronRight,
  Megaphone,
  Users,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Award,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface PublicCampusAmbassadorPageProps {
  page?: CMSPage;
  settings?: GlobalSettings;
  onAddLead?: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  isVisualMode?: boolean;
}

export default function PublicCampusAmbassadorPage({
  page,
  settings,
  onAddLead,
  isVisualMode = false
}: PublicCampusAmbassadorPageProps) {
  // Extract sections with fallback to DEFAULT_AMBASSADOR_SECTIONS
  const sections = page?.sections && page.sections.length > 0 ? page.sections : DEFAULT_AMBASSADOR_SECTIONS;

  const headerSec = sections.find(s => s.type === 'ambassador-header') || DEFAULT_AMBASSADOR_SECTIONS[0];
  const respSec = sections.find(s => s.type === 'ambassador-responsibilities') || DEFAULT_AMBASSADOR_SECTIONS[1];
  const formSec = sections.find(s => s.type === 'ambassador-form') || DEFAULT_AMBASSADOR_SECTIONS[2];

  const headerContent = headerSec.content || {};
  const respContent = respSec.content || {};
  const formContent = formSec.content || {};
  const formFieldsConfig = formContent.fields || {};
  const formSuccessConfig = formContent.successState || {};

  const cards: AmbassadorResponsibilityCard[] = respContent.cards || (DEFAULT_AMBASSADOR_SECTIONS[1].content as any).cards;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    collegeEmail: '',
    phoneNumber: '',
    collegeName: '',
    courseDegree: '',
    academicYear: '',
    cityState: '',
    motivation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigateTo = (target: string) => {
    if (target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const cleanTarget = target.startsWith('#/') ? target : `#/${target.replace(/^#/, '')}`;
    window.location.hash = cleanTarget;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.collegeEmail || !formData.phoneNumber) {
      setSubmitError("Please fill out all required fields marked with *");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const leadPayload = {
      name: formData.fullName,
      email: formData.collegeEmail,
      phone: formData.phoneNumber,
      degree: formData.courseDegree,
      batch: formData.academicYear,
      message: `[Campus Ambassador Application]\nCollege: ${formData.collegeName}\nLocation: ${formData.cityState}\nYear: ${formData.academicYear}\nDegree: ${formData.courseDegree}\nMotivation: ${formData.motivation}`,
      type: 'ambassador',
      interest: `Campus Ambassador (${formData.collegeName || 'Student Leadership'})`,
      status: 'new'
    };

    try {
      // Direct POST to backend leads API
      const res = await fetch('/api/leads/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      const data = await res.json();

      // Fire parent callback if supplied
      if (onAddLead) {
        onAddLead({
          name: formData.fullName,
          email: formData.collegeEmail,
          phone: formData.phoneNumber,
          type: 'ambassador',
          message: leadPayload.message,
          interest: leadPayload.interest
        });
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.warn("Backend leads submission fallback:", err);
      // Still show success if network fallback occurred
      if (onAddLead) {
        onAddLead({
          name: formData.fullName,
          email: formData.collegeEmail,
          phone: formData.phoneNumber,
          type: 'ambassador',
          message: leadPayload.message,
          interest: leadPayload.interest
        });
      }
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      collegeEmail: '',
      phoneNumber: '',
      collegeName: '',
      courseDegree: '',
      academicYear: '',
      cityState: '',
      motivation: ''
    });
    setIsSubmitted(false);
    setSubmitError(null);
  };

  // Helper to render icon by name
  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
      case 'groups':
        return <Users className="w-6 h-6 text-[#191c1f]" />;
      case 'MessageSquare':
      case 'forum':
        return <MessageSquare className="w-6 h-6 text-[#191c1f]" />;
      case 'Award':
        return <Award className="w-6 h-6 text-[#191c1f]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#191c1f]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#191c1f]" />;
      case 'Megaphone':
      case 'campaign':
      default:
        return <Megaphone className="w-6 h-6 text-[#191c1f]" />;
    }
  };

  const academicYears = formFieldsConfig.academicYearOptions && formFieldsConfig.academicYearOptions.length > 0
    ? formFieldsConfig.academicYearOptions
    : ["2nd Year", "3rd Year", "4th Year"];

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] min-h-screen">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">

        {/* 1. Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-[#5f5e5e] mb-8 font-medium">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#191c1f] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#191c1f] font-semibold">{headerContent.breadcrumb || "Campus Ambassador"}</span>
        </nav>

        {/* 2. Header Section */}
        <header className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eceef2] rounded font-mono text-[11px] font-bold tracking-widest text-[#191c1f] uppercase mb-4 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
            <span>{headerContent.pillBadge || "STUDENT LEADERSHIP"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-[#191c1f] tracking-tight leading-[1.15] mb-4">
            {headerSec.title || "Campus Ambassador Program"}
          </h1>
          <p className="text-base sm:text-lg text-[#5f5e5e] leading-relaxed">
            {headerSec.subtitle || "Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources."}
          </p>
        </header>

        {/* 3. SECTION 1: Key Responsibilities (3 Focused Cards) */}
        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div
                key={card.id || `resp-${idx}`}
                className="bg-white p-6 md:p-8 rounded-xl flex flex-col justify-between shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#eceef2] group-hover:bg-[#80d64b]/20 flex items-center justify-center text-[#191c1f] mb-6 transition-colors">
                    {renderCardIcon(card.icon)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#5f5e5e] uppercase tracking-wider">
                      {card.step || `0${idx + 1} / RESPONSIBILITY`}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#191c1f] mb-2.5">
                    {card.title}
                  </h2>
                  <p className="text-sm text-[#5f5e5e] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-2 text-[#2e6c00] border-t border-slate-100">
                  <span className="text-xs font-semibold">{card.badgeText || "Verified Notifications"}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECTION 2: Streamlined Application Form Card */}
        <section className="max-w-4xl bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-sm border border-slate-100 mb-16">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191c1f] tracking-tight mb-2">
              {formSec.title || "Apply for Campus Ambassador"}
            </h2>
            <p className="text-sm sm:text-base text-[#5f5e5e]">
              {formSec.subtitle || "Fill out this form to join the TantraPex student leadership network. Applications are reviewed on a rolling basis."}
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <span className="font-bold">Error:</span> {submitError}
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6" id="ambassador-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#191c1f]" htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e]"
                    id="fullName"
                    name="fullName"
                    placeholder={formFieldsConfig.fullNamePlaceholder || "e.g. Rahul Sharma"}
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* College Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#191c1f]" htmlFor="collegeEmail">
                    College Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e]"
                    id="collegeEmail"
                    name="collegeEmail"
                    placeholder={formFieldsConfig.collegeEmailPlaceholder || "rahul@college.edu.in"}
                    required
                    type="email"
                    value={formData.collegeEmail}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone Number / WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#191c1f]" htmlFor="phoneNumber">
                    Phone Number / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e]"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder={formFieldsConfig.phonePlaceholder || "+91 98765 43210"}
                    required
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                {/* College or University Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#191c1f]" htmlFor="collegeName">
                    College or University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e]"
                    id="collegeName"
                    name="collegeName"
                    placeholder={formFieldsConfig.collegeNamePlaceholder || "e.g. National Institute of Technology"}
                    required
                    type="text"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Course or Degree */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#191c1f]" htmlFor="courseDegree">
                    Course or Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e]"
                    id="courseDegree"
                    name="courseDegree"
                    placeholder={formFieldsConfig.courseDegreePlaceholder || "e.g. B.Tech (CSE), BCA, MCA, B.Sc"}
                    required
                    type="text"
                    value={formData.courseDegree}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Current Academic Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#191c1f]" htmlFor="academicYear">
                    Current Academic Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 pr-10 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all cursor-pointer font-medium"
                      id="academicYear"
                      name="academicYear"
                      required
                      value={formData.academicYear}
                      onChange={handleInputChange}
                    >
                      <option disabled value="">Select your current year</option>
                      {academicYears.map((yr: string) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5f5e5e] w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* City & State */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#191c1f]" htmlFor="cityState">
                  City &amp; State <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e]"
                  id="cityState"
                  name="cityState"
                  placeholder={formFieldsConfig.cityStatePlaceholder || "e.g. Pune, Maharashtra"}
                  required
                  type="text"
                  value={formData.cityState}
                  onChange={handleInputChange}
                />
              </div>

              {/* Motivation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#191c1f]" htmlFor="motivation">
                  {formFieldsConfig.motivationQuestion || "Why do you want to represent TantraPex in your college?"} <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full bg-[#f2f4f8] text-[#191c1f] text-sm rounded-lg p-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#191c1f] border border-transparent focus:border-[#191c1f] transition-all placeholder:text-[#5f5e5e] resize-none leading-relaxed"
                  id="motivation"
                  name="motivation"
                  placeholder={formFieldsConfig.motivationPlaceholder || "Tell us briefly about your interest in helping peers get placed, your campus reach, or any student clubs you lead..."}
                  required
                  rows={4}
                  value={formData.motivation}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {/* Verification Note & Submit Action */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[#5f5e5e] text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>{formContent.disclaimer || "Zero fees. 100% Free Placement Cell Initiative."}</span>
                </div>
                <button
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#80d64b] hover:bg-[#72c240] text-[#092100] font-bold text-sm rounded-lg transition-all cursor-pointer text-center inline-flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? "Submitting Application..." : (formContent.submitBtnText || "Submit Ambassador Application")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Success Feedback Dialog State */
            <div className="p-6 md:p-8 bg-[#eceef2] rounded-xl flex flex-col sm:flex-row items-start gap-4 border border-slate-200 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-[#2e6c00]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#191c1f]">
                  {formSuccessConfig.title || "Application Received"}
                </h3>
                <p className="text-sm text-[#5f5e5e] mt-1.5 leading-relaxed">
                  {formSuccessConfig.desc || "Thank you for applying. The TantraPex Student Placement Relations team will review your profile and reach out via WhatsApp/email within 48 hours."}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-300/60 flex flex-wrap items-center gap-4">
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#191c1f] hover:text-[#2e6c00] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit Another Application</span>
                  </button>
                  <button
                    onClick={() => navigateTo('upcoming-drives')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6c00] hover:underline cursor-pointer"
                  >
                    <span>Explore Placement Drives</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
