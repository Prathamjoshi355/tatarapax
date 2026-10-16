import { CMSSection } from '../types';

export const DEFAULT_PRICING_SECTIONS: CMSSection[] = [
  {
    id: "pricing-header",
    type: "pricing-header",
    title: "Pricing & Programs",
    subtitle: "Simple, affordable training programs. Remember: Applying to our placement drives is always 100% free.",
    content: {
      eyebrow: "Transparent Pricing",
      transparencyNote: {
        title: "Zero Cost for Drive Placements",
        desc: "Important: You do not need to buy any plan to apply for TantraPex placement drives. All campus and pooled placement drives are 100% free for all students.",
        badge: "Guaranteed Free Access"
      }
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "14",
      animation: "fade"
    }
  },
  {
    id: "pricing-plans",
    type: "pricing-plans",
    title: "Choose Your Placement Readiness Path",
    subtitle: "Transparent pricing with zero hidden placement cuts or percentage deductions.",
    content: {
      plans: [
        {
          id: "plan-self",
          name: "Self Learning Track",
          status: "inactive",
          badge: "Inactive",
          statusText: "Unavailable / Closed",
          desc: "Self-paced study material and public question banks for individual preparation.",
          price: "₹0",
          period: "/ Free",
          sublabel: "Self-directed self-study",
          features: [
            { text: "Basic study notes & references", included: true },
            { text: "Public question banks repository", included: true },
            { text: "Open community forum discussions", included: true },
            { text: "No mentor support", included: false, strikethrough: true },
            { text: "No live mock interviews", included: false, strikethrough: true }
          ],
          btnText: "Currently Inactive",
          btnLink: "#",
          footerText: "Registrations closed for this track"
        },
        {
          id: "plan-pro",
          name: "Career Pro Plan",
          status: "active",
          badge: "Current Active Plan",
          cohortTag: "Student Intensive Cohort",
          batch: "Batch 2025-26",
          desc: "Complete guided training with mentors, mock tests, and interview coaching.",
          price: "₹3,000",
          numericAmount: 3000,
          period: "one-time fee",
          sublabel: "Inclusive of all taxes • Non-refundable",
          isPopular: true,
          features: [
            { text: "Full Aptitude & Technical Training (Live + Recorded)", included: true },
            { text: "1-on-1 Mock Technical & HR Interviews", included: true },
            { text: "Resume Review & LinkedIn Profile Makeover", included: true },
            { text: "Company-specific test series & curated question banks", included: true },
            { text: "Priority doubt resolution with industry mentors", included: true },
            { text: "Unlimited access to LMS resources for 12 months", included: true }
          ],
          btnText: "Enroll Now — ₹3,000",
          btnLink: "#enroll",
          footerText: "Instant LMS portal activation on enrollment"
        },
        {
          id: "plan-campus",
          name: "Custom Campus Package",
          status: "institutional",
          badge: "Institutional Only",
          statusText: "For College TPOs Only",
          desc: "Campus-wide training program customized specifically for engineering colleges and institutes.",
          price: "Institutional MoU",
          period: "",
          sublabel: "Price configured per student cohort / college",
          features: [
            { text: "Dedicated corporate trainers on campus", included: true, icon: "apartment" },
            { text: "Custom syllabus mapped to targeted recruiters", included: true, icon: "menu_book" },
            { text: "Comprehensive college administrative dashboard", included: true, icon: "monitoring" },
            { text: "Semester-long benchmark progress tracking", included: true, icon: "calendar_month" },
            { text: "Not available for individual retail student signups", included: false, icon: "info" }
          ],
          btnText: "Contact for College MoU",
          btnLink: "#/contact",
          footerText: "Requires verified institutional affiliation"
        }
      ]
    },
    design: {
      backgroundColor: "#f7f9fd",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "pricing-curriculum",
    type: "pricing-curriculum",
    title: "What makes the Career Pro track effective?",
    subtitle: "We built this curriculum using exact screening patterns from over 140+ hiring companies that recruit via our placement cells.",
    content: {
      eyebrow: "Curriculum Architecture",
      stats: [
        { value: "120+", label: "Hours of Live Coaching" },
        { value: "24/7", label: "LMS Lab Sandbox" }
      ],
      modules: [
        {
          num: "01",
          title: "Quantitative & Logical Aptitude",
          desc: "Company-specific speed math, logical deduction, verbal ability, and data interpretation required to crack Round 1 online assessments."
        },
        {
          num: "02",
          title: "Core Tech & Coding Benchmarks",
          desc: "Data structures, algorithms, SQL querying, and fundamental OOP concepts aligned with typical service and product company evaluations."
        },
        {
          num: "03",
          title: "1-on-1 Personalized Mocks",
          desc: "Full-length 45-minute mock interviews conducted by industry professionals with written scorecards and immediate actionable feedback."
        },
        {
          num: "04",
          title: "Profile & Communication Drill",
          desc: "ATS-compliant resume rewriting, project showcase guidance, behavioral question preparation, and salary negotiation basics."
        }
      ]
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "pricing-faqs",
    type: "pricing-faqs",
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about our placement policy, payments, and student eligibility.",
    content: {
      eyebrow: "Clear Answers",
      faqs: [
        {
          q: "Is applying to placement drives free?",
          a: "Yes, 100% free with zero fees or salary deductions. We do not charge students for registering, taking screening tests, or appearing in interviews for any drive hosted through TantraPex Technologies. Our placement drives remain unconditionally accessible to qualified engineering students regardless of whether you enroll in our training programs."
        },
        {
          q: "What is included in the Career Pro Plan?",
          a: "The Career Pro Plan provides intensive aptitude and technical training, personalized 1-on-1 mock interviews, ATS resume overhaul, company-specific test series, and full unrestricted access to our digital learning resources (LMS) for 12 continuous months. It is designed for students who want structured daily coaching to boost their drive clearance rates."
        },
        {
          q: "Can I get a refund if I change my mind?",
          a: "No. All training program fees and registrations are strictly non-refundable and non-transferable once enrolled, as per our institutional policy. Please review course deliverables carefully prior to completing payment."
        },
        {
          q: "Does paying for Career Pro guarantee me a job offer?",
          a: "No organization can legitimately guarantee an employment offer, and we strictly maintain zero misleading claims. TantraPex provides authentic recruitment drives and rigorous training that significantly elevates your competence, interview maturity, and project credentials. The final hiring decision always lies with the recruiting enterprise based on your merit and evaluation performance."
        }
      ]
    },
    design: {
      backgroundColor: "#f7f9fd",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "pricing-cta",
    type: "pricing-cta",
    title: "Have questions about our training programs?",
    subtitle: "Our placement advisors and academic counselors are available to walk through batch timetables, payment receipts, or institutional MoUs for your campus.",
    content: {
      eyebrow: "Institutional Advisory",
      primaryBtnText: "Contact Us",
      primaryBtnLink: "#/contact",
      secondaryBtnText: "Browse Free Drives",
      secondaryBtnLink: "#/upcoming-drives"
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "16",
      animation: "fade"
    }
  }
];
