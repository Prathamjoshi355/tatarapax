import React, { useState } from 'react';
import { GlobalSettings, Lead } from '../../types';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  HelpCircle,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Briefcase,
  FileCheck,
  Award,
  Users
} from 'lucide-react';

interface PublicFreeRegistrationPageProps {
  settings?: GlobalSettings;
  onAddLead?: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onNavigateHome?: () => void;
  onNavigateDrives?: () => void;
}

export default function PublicFreeRegistrationPage({
  settings,
  onAddLead,
  onNavigateHome,
  onNavigateDrives
}: PublicFreeRegistrationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    degree: 'B.Tech / BE',
    batch: '2025',
    college: '',
    branch: '',
    cgpa: '',
    description: '',
    instruction: '',
    agreePolicy: true
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredRecord, setRegisteredRecord] = useState<any | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const goHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '#/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goDrives = () => {
    if (onNavigateDrives) {
      onNavigateDrives();
    } else {
      window.location.hash = '#/upcoming-drives';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMsg('Please provide either your WhatsApp/Phone number or Email address.');
      return;
    }
    if (!formData.agreePolicy) {
      setErrorMsg('Please confirm the 100% Free Placement Policy agreement.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const refId = `TPX-FCR-${Date.now().toString().slice(-6)}`;
    const fullDescription = [
      formData.college ? `College: ${formData.college}` : '',
      formData.branch ? `Branch: ${formData.branch}` : '',
      formData.cgpa ? `CGPA/Score: ${formData.cgpa}` : '',
      formData.description ? `Skills/Summary: ${formData.description}` : ''
    ].filter(Boolean).join(' | ');

    const payload = {
      id: refId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      degree: formData.degree,
      batch: formData.batch,
      college: formData.college.trim(),
      branch: formData.branch.trim(),
      cgpa: formData.cgpa.trim(),
      description: fullDescription || formData.description.trim(),
      instruction: formData.instruction.trim(),
      interest: `${formData.degree} (${formData.batch}) - Free Candidate Registration`,
      source: 'Dedicated Free Registration Page (#/register-for-free)',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Submit to API endpoint
      const res = await fetch('/api/free-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 2. Dual-save to localStorage for instant local backup & admin sync
      try {
        const localList = JSON.parse(localStorage.getItem('tpx_free_candidate_registrations') || '[]');
        localList.unshift(payload);
        localStorage.setItem('tpx_free_candidate_registrations', JSON.stringify(localList));
      } catch (localErr) {
        // non-blocking
      }

      // 3. Register to Leads system if handler provided
      if (onAddLead) {
        onAddLead({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          interest: `${payload.degree} (${payload.batch}) - Free Candidate Registration`
        });
      }

      setRegisteredRecord(payload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration failed:', err);
      // Fallback: still treat as success locally if network fails
      try {
        const localList = JSON.parse(localStorage.getItem('tpx_free_candidate_registrations') || '[]');
        localList.unshift(payload);
        localStorage.setItem('tpx_free_candidate_registrations', JSON.stringify(localList));
      } catch {}
      setRegisteredRecord(payload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setRegisteredRecord(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      degree: 'B.Tech / BE',
      batch: '2025',
      college: '',
      branch: '',
      cgpa: '',
      description: '',
      instruction: '',
      agreePolicy: true
    });
    setErrorMsg(null);
  };

  const FAQS = [
    {
      q: 'Is candidate registration on TantraPex truly 100% free?',
      a: 'Yes, absolutely. TantraPex operates under institutional MoUs and corporate recruitment mandates. We never charge students any registration fees, admit card fees, or salary cuts. It is 100% free forever.'
    },
    {
      q: 'Who is eligible to register on this portal?',
      a: 'Students currently enrolled in pre-final and final years (2025 & 2026 batches) as well as recently graduated candidates (2024 & 2023 batches) from B.Tech, BE, BCA, MCA, B.Sc/M.Sc (IT), Diploma in Engineering, and MBA/BBA streams are eligible.'
    },
    {
      q: 'How will I receive notifications about upcoming placement drives?',
      a: 'Once registered, our verified candidate matching algorithm links your profile with corporate eligibility criteria. You will receive real-time notifications with application links directly on your WhatsApp and Email.'
    },
    {
      q: 'Can I apply to multiple placement drives?',
      a: 'Yes! Once registered, you can apply to all eligible corporate campus and pooled drives posted on our platform with 1-click application.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-800">
      
      {/* Top Breadcrumb & Trust Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <button
              onClick={goHome}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Home</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Register for Free</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Free Drive Access Guaranteed
            </span>
            <button
              onClick={goDrives}
              className="text-[#2e6c00] hover:text-[#1e4800] font-bold text-[11px] underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Active Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {registeredRecord ? (
          /* ================= SUCCESS CONFIRMATION STATE ================= */
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Registration Successful!
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Welcome aboard, <strong className="text-slate-900">{registeredRecord.name}</strong>. Your candidate profile has been registered in TantraPex Verified Placement Pool.
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Application Reference ID</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {registeredRecord.id}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                  <span className="font-semibold text-slate-900">{registeredRecord.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
                  <span className="font-semibold text-slate-900">{registeredRecord.degree} ({registeredRecord.batch})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp / Mobile</span>
                  <span className="font-semibold text-slate-900">{registeredRecord.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="font-semibold text-slate-900">{registeredRecord.email || '—'}</span>
                </div>
                {registeredRecord.college && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">College / Institution</span>
                    <span className="font-semibold text-slate-900">{registeredRecord.college}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-[#f0f9eb] border border-[#d3eed1] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2e6c00] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>What Happens Next?</span>
              </h3>
              <ol className="space-y-2 text-xs text-slate-700 leading-relaxed list-decimal list-inside">
                <li><strong className="text-slate-900">Profile Indexed:</strong> Your profile is active for recruitment panels searching for {registeredRecord.degree} candidates.</li>
                <li><strong className="text-slate-900">Live Drive Alerts:</strong> When a matching corporate drive opens, you'll receive direct alerts with registration links on your WhatsApp &amp; Email.</li>
                <li><strong className="text-slate-900">Direct Application:</strong> You can apply directly to upcoming drives right away with 0% application fees.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={goDrives}
                className="w-full sm:flex-1 py-3.5 px-6 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Active Drives Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto py-3.5 px-5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Register Another Candidate
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN 2-COLUMN REGISTRATION FORM ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Why Register / Benefits (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-extrabold tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Free Candidate Placement Desk
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                  Register for Campus &amp; Pooled Drives
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Join India's First Private Placement Cell candidate pool. Direct access to exclusive enterprise drives with zero intermediary fees, zero cut on salaries, and instant WhatsApp updates.
                </p>
              </div>

              {/* 3 Core Value Props */}
              <div className="space-y-3.5 pt-1">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      100% Free Placement Policy
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Zero registration fee, zero processing charges, and 0% salary deductions forever. Corporate drives are completely sponsor-funded.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Direct Corporate MoUs
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Participate in exclusive drives with top recruiters including LTTS, Cognizant, TCS, Capgemini, Zoho, KPIT &amp; innovative tech startups.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Real-time WhatsApp Alerts
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Instant notifications for newly announced drives, test links, admit cards, and shortlist results delivered straight to WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Placement Desk Stats */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Placement Cell Registry
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                    ACTIVE 2024-26
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl font-extrabold text-white">500+</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Partner Recruiters</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-[#80d64b]">₹8.4 LPA</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Average Peak CTC</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">₹0</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Student Fees</div>
                  </div>
                </div>
              </div>

              {/* Need Immediate Help Box */}
              <div className="bg-[#f5f6f4] border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Have placement questions?</span>
                  <span className="text-[11px]">Chat with our placement support desk</span>
                </div>
                <a
                  href={`https://wa.me/${(settings?.phone || '919876543210').replace(/\D/g, '')}?text=Hi%20TantraPex,%20I%20have%20questions%20regarding%20free%20candidate%20registration`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: Candidate Registration Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e6c00] font-mono">
                      Candidate Onboarding
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Step 1 of 1 • Takes 2 mins
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
                    Free Placement Registration
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in your verified details to participate in active campus &amp; pooled recruitment drives.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                    />
                  </div>

                  {/* WhatsApp & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        WhatsApp / Mobile No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      />
                      <span className="text-[10px] text-slate-400 block">Drive updates &amp; admit cards sent here</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="rahul.sharma@example.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      />
                      <span className="text-[10px] text-slate-400 block">Assessment links &amp; official invite</span>
                    </div>
                  </div>

                  {/* Degree & Batch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Degree / Qualification <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.degree}
                        onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      >
                        <option value="B.Tech / BE">B.Tech / BE</option>
                        <option value="BCA / MCA">BCA / MCA</option>
                        <option value="B.Sc / M.Sc (IT)">B.Sc / M.Sc (IT / CS)</option>
                        <option value="Diploma in Engg">Diploma in Engineering</option>
                        <option value="BBA / MBA">BBA / MBA</option>
                        <option value="Other Degree">Other Degree</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Graduation Batch <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.batch}
                        onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      >
                        <option value="2025">2025 (Final Year)</option>
                        <option value="2026">2026 (Pre-Final Year)</option>
                        <option value="2024">2024 (Graduated)</option>
                        <option value="2023 or earlier">2023 or earlier</option>
                      </select>
                    </div>
                  </div>

                  {/* College & Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        College / University Name
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                        placeholder="e.g. RGPV, SPPU, AKTU, etc."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Branch / Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                        placeholder="e.g. CSE, IT, ECE, Mechanical..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      />
                    </div>
                  </div>

                  {/* CGPA / Percentage & Preferred Roles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Current CGPA / Percentage
                        </label>
                        <span className="text-[10px] text-slate-400 italic">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.cgpa}
                        onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                        placeholder="e.g. 7.8 CGPA or 72%"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Target Roles / Location
                        </label>
                        <span className="text-[10px] text-slate-400 italic">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.instruction}
                        onChange={(e) => setFormData(prev => ({ ...prev, instruction: e.target.value }))}
                        placeholder="e.g. Software Dev, Pune/Bangalore"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all"
                      />
                    </div>
                  </div>

                  {/* Profile Summary / Key Skills */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Key Skills &amp; Profile Summary
                      </label>
                      <span className="text-[10px] text-slate-400 italic">Optional</span>
                    </div>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. React.js, Java, Python, SQL, Data Structures & Algorithms, Git..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80d64b] font-sans transition-all resize-none"
                    />
                  </div>

                  {/* Zero-Fee Charter Assurance Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreePolicy}
                        onChange={(e) => setFormData(prev => ({ ...prev, agreePolicy: e.target.checked }))}
                        className="mt-0.5 rounded border-slate-300 text-[#2e6c00] focus:ring-[#80d64b] w-4 h-4"
                      />
                      <span className="text-xs text-slate-600 leading-snug">
                        I confirm that my details are accurate and agree to receive verified placement drive notifications via WhatsApp &amp; Email. I understand that TantraPex charges <strong className="text-slate-900">₹0 fees</strong> and makes <strong className="text-slate-900">0% deductions</strong> from student packages.
                      </span>
                    </label>
                  </div>

                  {/* Submission Buttons */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-[#2e6c00]" />
                      <span>Encrypted &amp; Confidential • No Spam Guarantee</span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#092100] border-t-transparent rounded-full animate-spin" />
                          <span>Registering Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Free Registration</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>
        )}

        {/* ================= FREQUENTLY ASKED QUESTIONS SECTION ================= */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Clarifications &amp; Help
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500">
                Everything you need to know about TantraPex Free Candidate Placement Registration.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

