import React, { useState, useEffect } from 'react';
import { CMSPage, GlobalSettings, Lead } from '../../types';
import { DEFAULT_PRICING_SECTIONS } from '../../lib/defaultPricing';
import {
  ChevronRight,
  Home,
  Check,
  X,
  ShieldCheck,
  Building2,
  BookOpen,
  LineChart,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
  Sparkles,
  CreditCard,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface PublicPricingPageProps {
  page?: CMSPage;
  settings?: GlobalSettings;
  onAddLead?: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField?: (sectionId: string, fieldPath: string, value: any) => void;
  isVisualMode?: boolean;
}

export default function PublicPricingPage({
  page,
  settings,
  onAddLead,
  isVisualMode = false
}: PublicPricingPageProps) {
  // Extract sections with fallback to DEFAULT_PRICING_SECTIONS
  const sections = page?.sections && page.sections.length > 0 ? page.sections : DEFAULT_PRICING_SECTIONS;

  const headerSec = sections.find(s => s.type === 'pricing-header') || DEFAULT_PRICING_SECTIONS[0];
  const plansSec = sections.find(s => s.type === 'pricing-plans') || DEFAULT_PRICING_SECTIONS[1];
  const curriculumSec = sections.find(s => s.type === 'pricing-curriculum') || DEFAULT_PRICING_SECTIONS[2];
  const faqsSec = sections.find(s => s.type === 'pricing-faqs') || DEFAULT_PRICING_SECTIONS[3];
  const ctaSec = sections.find(s => s.type === 'pricing-cta') || DEFAULT_PRICING_SECTIONS[4];

  const headerContent = headerSec.content || {};
  const plansContent = plansSec.content || {};
  const curriculumContent = curriculumSec.content || {};
  const faqsContent = faqsSec.content || {};
  const ctaContent = ctaSec.content || {};

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Enrollment Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    degree: 'B.Tech / BE'
  });
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollOrderRef, setEnrollOrderRef] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>('');

  useEffect(() => {
    fetch('/api/razorpay-key')
      .then(res => res.json())
      .then(data => {
        if (data && data.keyId) {
          setRazorpayKeyId(data.keyId);
        }
      })
      .catch(err => {
        console.warn("Failed to prefetch Razorpay Key ID:", err);
      });
  }, []);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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

  const handleOpenEnroll = (plan: any) => {
    setSelectedPlan(plan);
    setIsEnrollModalOpen(true);
    setEnrollSuccess(false);
    setEnrollError(null);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.phone || !enrollForm.email) return;

    setIsSubmittingEnroll(true);
    setEnrollError(null);

    const numericAmount = selectedPlan?.numericAmount || 
      (selectedPlan?.price ? parseInt(String(selectedPlan.price).replace(/[^\d]/g, ''), 10) : 3000) || 3000;

    try {
      // 1. Fetch public Razorpay key ID if missing
      let activeKeyId = razorpayKeyId;
      if (!activeKeyId) {
        try {
          const keyRes = await fetch('/api/razorpay-key');
          if (keyRes.ok) {
            const keyData = await keyRes.json();
            if (keyData.keyId) {
              activeKeyId = keyData.keyId;
              setRazorpayKeyId(keyData.keyId);
            }
          }
        } catch (e) {
          console.warn('Failed to fetch razorpay key:', e);
        }
      }

      // 2. Create order on backend via Razorpay Orders API
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          currency: 'INR',
          receipt: `plan-${Date.now()}`,
          notes: {
            planId: selectedPlan?.id || 'career-pro',
            planName: selectedPlan?.name || 'Career Pro Plan',
            studentName: enrollForm.name,
            studentEmail: enrollForm.email,
            studentPhone: enrollForm.phone,
          }
        })
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to initialize payment order with server.');
      }

      const orderData = await orderRes.json();
      if (!orderData.success || !orderData.order?.id) {
        throw new Error(orderData.error || 'Order creation failed. Please try again.');
      }

      const effectiveKey = orderData.keyId || activeKeyId;
      if (!effectiveKey) {
        throw new Error('Razorpay public key is not configured.');
      }

      // 3. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay payment gateway script could not be loaded.');
      }

      // 4. Open Razorpay modal
      const options = {
        key: effectiveKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency || 'INR',
        name: 'TantraPex Technologies',
        description: `Enrollment: ${selectedPlan?.name || 'Career Pro Plan'}`,
        order_id: orderData.order.id,
        prefill: {
          name: enrollForm.name,
          email: enrollForm.email,
          contact: enrollForm.phone
        },
        theme: {
          color: '#071b4d'
        },
        modal: {
          ondismiss: function () {
            setIsSubmittingEnroll(false);
          }
        },
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id || `pay_${Date.now()}`;
          const orderId = response.razorpay_order_id || orderData.order.id;

          // Save purchase record to MongoDB via /api/plan-purchases/add
          try {
            await fetch('/api/plan-purchases/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId,
                orderId,
                signature: response.razorpay_signature || '',
                planId: selectedPlan?.id || 'career-pro',
                planName: selectedPlan?.name || 'Career Pro Plan',
                amount: numericAmount,
                studentName: enrollForm.name,
                studentEmail: enrollForm.email,
                studentPhone: enrollForm.phone,
                college: enrollForm.college || '',
                degree: enrollForm.degree || '',
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              })
            });
          } catch (saveErr) {
            console.warn('Failed to save purchase to DB:', saveErr);
          }

          if (onAddLead) {
            onAddLead({
              name: enrollForm.name,
              email: enrollForm.email,
              phone: enrollForm.phone,
              interest: `Enrolled: ${selectedPlan?.name || 'Career Pro Plan'} (Txn: ${paymentId})`
            });
          }

          setEnrollOrderRef(paymentId);
          setEnrollSuccess(true);
          setIsSubmittingEnroll(false);
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setEnrollError(resp.error?.description || 'Payment failed or declined. Please try again.');
        setIsSubmittingEnroll(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay initialization error:', err);
      setEnrollError(err.message || 'Payment service error. Please try again.');
      setIsSubmittingEnroll(false);
    }
  };

  const formatPlanPrice = (price: any) => {
    if (price === undefined || price === null || price === '') return 'Custom';
    if (typeof price === 'number') return `₹${price.toLocaleString('en-IN')}`;
    if (typeof price === 'string') {
      const trimmed = price.trim();
      if (/^\d+$/.test(trimmed)) return `₹${parseInt(trimmed, 10).toLocaleString('en-IN')}`;
      return trimmed;
    }
    return String(price);
  };

  const getFeatureInfo = (feat: any) => {
    if (typeof feat === 'string') {
      return { text: feat, included: true, strikethrough: false };
    }
    return {
      text: feat?.text || '',
      included: feat?.included !== false,
      strikethrough: !!feat?.strikethrough
    };
  };

  const activePlans = plansContent.plans || DEFAULT_PRICING_SECTIONS[1].content.plans;
  const curriculumModules = curriculumContent.modules || DEFAULT_PRICING_SECTIONS[2].content.modules;
  const faqList = faqsContent.faqs || DEFAULT_PRICING_SECTIONS[3].content.faqs;

  return (
    <div className="w-full bg-[#f7f9fd] text-[#191c1f] font-sans antialiased min-h-screen">

      {/* 1. BREADCRUMB & METADATA BAR */}
      <section className="w-full bg-[#f2f4f8] border-b border-[#e0e2e6]/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5f5e5e]">
            <a href="#/" className="hover:text-[#191c1f] transition-colors flex items-center gap-1 font-medium">
              <Home className="w-3.5 h-3.5 text-[#5f5e5e]" />
              <span>Home</span>
            </a>
            <span className="text-[#e0e2e6] select-none">/</span>
            <span className="text-[#191c1f] font-semibold">Pricing &amp; Programs</span>
          </nav>
        </div>
      </section>

      {/* 2. EDITORIAL INSTITUTIONAL HEADER */}
      <section className={`w-full bg-white border-b border-[#e0e2e6] pt-12 pb-14 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e6e8ec] rounded text-[#191c1f] text-[10px] uppercase font-bold tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-[#80d64b]"></span>
              <span>{headerContent.eyebrow || "Transparent Pricing"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#191c1f] tracking-tight leading-tight mb-4">
              {headerSec.title || "Pricing & Programs"}
            </h1>
            <p className="text-base sm:text-xl text-[#5f5e5e] leading-relaxed">
              {headerSec.subtitle || "Simple, affordable training programs. Remember: Applying to our placement drives is always 100% free."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. HIGH PRIORITY MANDATORY TRANSPARENCY NOTE */}
      <section className="w-full bg-[#f7f9fd] pt-8 pb-4">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-white border-l-4 border-l-[#80d64b] border-y border-r border-[#e0e2e6] p-5 md:p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-[#80d64b]/20 flex items-center justify-center shrink-0 text-[#2e6c00] mt-0.5 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#191c1f] mb-0.5">
                  {headerContent.transparencyNote?.title || "Zero Cost for Drive Placements"}
                </h2>
                <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                  <strong className="text-[#191c1f] font-semibold">Important:</strong> {headerContent.transparencyNote?.desc || "You do not need to buy any plan to apply for TantraPex placement drives. All campus and pooled placement drives are 100% free for all students."}
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-14 md:pl-0">
              <span className="inline-block px-3 py-1.5 rounded bg-[#eceef2] text-xs text-[#191c1f] font-bold tracking-wide uppercase">
                {headerContent.transparencyNote?.badge || "Guaranteed Free Access"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING MATRICES (3-COLUMN RIGOROUS ARCHITECTURE) */}
      <section className={`w-full bg-[#f7f9fd] py-12 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 ${
            activePlans.length === 1 
              ? 'max-w-xl mx-auto' 
              : activePlans.length === 2 
                ? 'md:grid-cols-2 max-w-4xl mx-auto' 
                : 'lg:grid-cols-3'
          } gap-6 items-stretch`}>
            {activePlans.map((plan: any, pIdx: number) => {
              const isInactive = plan.status === 'inactive' || plan.isLocked === true;
              const isInstitutionalMoU = plan.status === 'institutional' && (!plan.price || plan.price === 'Contact');
              const isHighlighted = plan.isMostPopular || plan.status === 'active' || (!isInactive && !isInstitutionalMoU);
              const formattedPrice = formatPlanPrice(plan.price);

              return (
                <div
                  key={plan.id || pIdx}
                  className={`bg-white rounded-xl p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isHighlighted
                      ? 'border-2 border-[#80d64b] shadow-xl ring-1 ring-[#80d64b]/30'
                      : 'border border-[#e0e2e6] shadow-sm opacity-90 hover:opacity-100'
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1 bg-[#80d64b] text-[#092100] text-[10px] uppercase font-extrabold tracking-wider rounded-full shadow-sm inline-flex items-center gap-1.5 whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full bg-[#092100] animate-pulse"></span>
                        {plan.badge || (plan.isMostPopular ? "Most Popular Plan" : "Current Active Plan")}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold font-mono ${
                        isHighlighted ? 'text-[#2e6c00]' : 'text-[#5f5e5e]'
                      }`}>
                        {plan.cohortTag || plan.badge || (isInactive ? "Inactive" : "Student Intensive Track")}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighlighted
                          ? 'bg-emerald-50 text-[#2e6c00] border border-emerald-200'
                          : 'bg-[#eceef2] text-[#5f5e5e]'
                      }`}>
                        {plan.batch || plan.statusText || plan.duration || "Batch 2025-26"}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] mb-2 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5f5e5e] mb-6 min-h-[36px] leading-relaxed">
                      {plan.desc}
                    </p>

                    <div className={`py-4 border-y border-[#e0e2e6] mb-6 ${
                      isHighlighted ? 'bg-[#f2f4f8] -mx-6 lg:-mx-8 px-6 lg:px-8' : ''
                    }`}>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
                          isInactive ? 'text-[#5f5e5e] line-through' : 'text-[#191c1f]'
                        }`}>
                          {formattedPrice}
                        </span>
                        {plan.period && (
                          <span className="text-xs sm:text-sm text-[#5f5e5e] font-semibold">
                            {plan.period}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs block mt-1 font-semibold ${
                        isHighlighted ? 'text-[#2e6c00]' : 'text-[#5f5e5e]'
                      }`}>
                        {plan.sublabel || "Inclusive of all taxes • 7-day refund guarantee"}
                      </span>
                    </div>

                    <div className="space-y-3.5 mb-8">
                      <span className="text-[10px] uppercase tracking-wider text-[#191c1f] font-bold block mb-2">
                        Included with plan:
                      </span>
                      {(plan.features || []).map((rawFeat: any, fIdx: number) => {
                        const feat = getFeatureInfo(rawFeat);
                        return (
                          <div key={fIdx} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              feat.included
                                ? isHighlighted ? 'bg-[#80d64b] text-[#092100]' : 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {feat.included ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                            </div>
                            <span className={`text-xs sm:text-sm leading-snug ${
                              feat.strikethrough ? 'line-through text-slate-400' : 'text-[#191c1f] font-medium'
                            }`}>
                              {feat.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    {isInactive ? (
                      <div>
                        <button
                          disabled
                          type="button"
                          className="w-full py-3 px-4 bg-[#eceef2] text-[#5f5e5e] rounded-lg cursor-not-allowed select-none font-bold text-xs text-center border border-[#e0e2e6]"
                        >
                          {plan.btnText || "Currently Inactive"}
                        </button>
                        <p className="text-[11px] text-center text-[#5f5e5e] mt-2.5">
                          {plan.footerText || "Registrations closed for this track"}
                        </p>
                      </div>
                    ) : isInstitutionalMoU ? (
                      <div>
                        <button
                          onClick={() => navigateTo('contact')}
                          type="button"
                          className="w-full py-3.5 px-6 bg-white border border-[#191c1f] text-[#191c1f] hover:bg-[#f2f4f8] transition-colors text-xs font-bold rounded-lg text-center block cursor-pointer"
                        >
                          {plan.btnText || "Contact for College MoU"}
                        </button>
                        <p className="text-[11px] text-center text-[#5f5e5e] mt-2.5">
                          {plan.footerText || "Requires verified institutional affiliation"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => handleOpenEnroll(plan)}
                          type="button"
                          className={`w-full py-3.5 px-6 font-extrabold rounded-lg text-center block transition-all shadow-sm active:scale-95 cursor-pointer text-sm ${
                            isHighlighted
                              ? 'bg-[#80d64b] hover:bg-[#72c242] text-[#092100]'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {plan.btnText || `Enroll Now — ${formattedPrice}`}
                        </button>
                        <p className="text-[11px] text-center text-[#5f5e5e] mt-2.5 flex items-center justify-center gap-1 font-medium">
                          <Lock className="w-3.5 h-3.5 text-[#2e6c00]" />
                          <span>{plan.footerText || "Instant LMS portal activation on enrollment"}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TRAINING PROGRAM CURRICULUM & BENCHMARKS BREAKDOWN */}
      <section className={`w-full bg-white border-y border-[#e0e2e6] py-16 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 4 cols: Title & Stats */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] uppercase tracking-wider text-[#5f5e5e] font-bold block font-mono">
                {curriculumContent.eyebrow || "Curriculum Architecture"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] tracking-tight leading-tight">
                {curriculumSec.title || "What makes the Career Pro track effective?"}
              </h2>
              <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                {curriculumSec.subtitle || "We built this curriculum using exact screening patterns from over 140+ hiring companies that recruit via our placement cells."}
              </p>

              {/* Metric Strip */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e0e2e6]">
                {(curriculumContent.stats || DEFAULT_PRICING_SECTIONS[2].content.stats).map((st: any, sIdx: number) => (
                  <div key={sIdx} className="bg-[#f2f4f8] p-4 rounded-xl border border-[#e0e2e6]">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] block tracking-tight font-display">
                      {st.value}
                    </span>
                    <span className="text-xs text-[#5f5e5e] block mt-1 font-medium">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 8 cols: 4 Curriculum Modules */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {curriculumModules.map((mod: any, mIdx: number) => (
                <div key={mIdx} className="bg-[#f7f9fd] p-5 sm:p-6 rounded-xl border border-[#e0e2e6] shadow-2xs hover:border-[#80d64b] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#191c1f] text-white flex items-center justify-center text-xs font-bold mb-3 font-mono">
                    {mod.num}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#191c1f] mb-1.5">
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ACCORDION FAQS */}
      <section className={`w-full bg-[#f7f9fd] py-16 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-wider text-[#2e6c00] font-bold block font-mono mb-1">
              {faqsContent.eyebrow || "Clear Answers"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] tracking-tight">
              {faqsSec.title || "Frequently Asked Questions"}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1.5">
              {faqsSec.subtitle || "Everything you need to know about our placement policy, payments, and student eligibility."}
            </p>
          </div>

          <div className="space-y-3.5">
            {faqList.map((faq: any, fIdx: number) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="bg-white border border-[#e0e2e6] rounded-xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 select-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#191c1f]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#5f5e5e] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#5f5e5e] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5f5e5e] leading-relaxed border-t border-[#e0e2e6]/70 pt-3 animate-in fade-in duration-150">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. GROUNDED EXECUTIVE BOTTOM CTA */}
      <section className={`w-full bg-white border-t border-[#e0e2e6] py-16 ${
        isVisualMode ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all' : ''
      }`}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f2f4f8] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#e0e2e6]">
            <div className="max-w-xl text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#2e6c00] font-bold block font-mono mb-1">
                {ctaContent.eyebrow || "Institutional Advisory"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f] mb-2 tracking-tight">
                {ctaSec.title || "Have questions about our training programs?"}
              </h2>
              <p className="text-xs sm:text-sm text-[#5f5e5e] leading-relaxed">
                {ctaSec.subtitle || "Our placement advisors and academic counselors are available to walk through batch timetables, payment receipts, or institutional MoUs for your campus."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => navigateTo(ctaContent.primaryBtnLink || 'contact')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#191c1f] hover:bg-[#2d3134] text-white text-xs font-bold rounded-lg text-center transition-colors shadow-xs cursor-pointer"
              >
                {ctaContent.primaryBtnText || "Contact Us"}
              </button>
              <button
                onClick={() => navigateTo(ctaContent.secondaryBtnLink || 'upcoming-drives')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#e0e2e6] hover:border-[#191c1f] text-[#191c1f] text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
              >
                {ctaContent.secondaryBtnText || "Browse Free Drives"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ENROLLMENT / RAZORPAY CHECKOUT MODAL */}
      {isEnrollModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white border border-[#e0e2e6] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-xs text-[#5f5e5e] my-8">
            
            <div className="flex items-start justify-between border-b border-[#e0e2e6] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e6c00] font-mono">
                  {selectedPlan.badge || "Career Pro Plan"}
                </span>
                <h3 className="text-xl font-bold text-[#191c1f]">
                  Enroll in {selectedPlan.name}
                </h3>
                <span className="text-xs text-[#5f5e5e]">
                  {selectedPlan.price} {selectedPlan.period}
                </span>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {enrollSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-[#2e6c00] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#191c1f]">Enrollment Confirmed!</h4>
                  <p className="text-xs text-[#5f5e5e] leading-relaxed max-w-sm mx-auto">
                    Thank you, <strong className="text-[#191c1f]">{enrollForm.name}</strong>. Your enrollment reference is <span className="font-mono font-bold text-[#2e6c00]">{enrollOrderRef}</span>.
                  </p>
                  <p className="text-[11px] text-[#5f5e5e]">
                    Your LMS access credentials and cohort joining schedule have been dispatched to your email and WhatsApp.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsEnrollModalOpen(false);
                      navigateTo('lms');
                    }}
                    className="px-6 py-2.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                  >
                    Go to LMS Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="bg-[#f2f4f8] p-3 rounded-xl border border-[#e0e2e6] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#191c1f] block">{selectedPlan.name}</span>
                    <span className="text-[11px] text-[#5f5e5e]">12-Month Access • 1-on-1 Mocks</span>
                  </div>
                  <span className="text-lg font-extrabold text-[#2e6c00] font-display">
                    {formatPlanPrice(selectedPlan.price)}
                  </span>
                </div>

                {enrollError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                    <span className="font-bold">⚠️</span>
                    <span>{enrollError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#191c1f] uppercase tracking-wider block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.name}
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#f7f9fd] border border-[#e0e2e6] rounded-lg text-xs text-[#191c1f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#191c1f] uppercase tracking-wider block">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-[#f7f9fd] border border-[#e0e2e6] rounded-lg text-xs text-[#191c1f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#191c1f] uppercase tracking-wider block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={enrollForm.email}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#f7f9fd] border border-[#e0e2e6] rounded-lg text-xs text-[#191c1f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#191c1f] uppercase tracking-wider block">
                      College Name
                    </label>
                    <input
                      type="text"
                      value={enrollForm.college}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, college: e.target.value }))}
                      placeholder="e.g. DY Patil Pune"
                      className="w-full px-3.5 py-2.5 bg-[#f7f9fd] border border-[#e0e2e6] rounded-lg text-xs text-[#191c1f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#191c1f] uppercase tracking-wider block">
                      Degree / Stream
                    </label>
                    <select
                      value={enrollForm.degree}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, degree: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-[#f7f9fd] border border-[#e0e2e6] rounded-lg text-xs text-[#191c1f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    >
                      <option value="B.Tech / BE">B.Tech / BE</option>
                      <option value="BCA / MCA">BCA / MCA</option>
                      <option value="B.Sc / M.Sc (IT)">B.Sc / M.Sc (IT)</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-[#2e6c00] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Institutional 7-day refund guarantee applies to all enrolled students.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e0e2e6]">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-4 py-2 bg-[#eceef2] hover:bg-slate-200 text-[#191c1f] font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEnroll}
                    className="px-5 py-2.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-extrabold rounded-lg text-xs cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingEnroll ? "Opening Razorpay..." : `Pay ${formatPlanPrice(selectedPlan?.price)} via Razorpay`}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
