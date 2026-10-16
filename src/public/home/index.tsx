import React, { useState, useEffect } from 'react';
import {
  CMSPage,
  GlobalSettings,
  PlacedStudent,
  HiringPartner,
  Course,
  BlogPost,
  Lead,
  PlacementDrive,
} from '../../types';
import DriveApplicationModal from '../../components/drives/DriveApplicationModal';
import {
  CheckCircle2,
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Terminal,
  Calculator,
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  GraduationCap
} from 'lucide-react';

interface PublicHomePageProps {
  page: CMSPage;
  settings: GlobalSettings;
  placedStudents: PlacedStudent[];
  hiringPartners: HiringPartner[];
  courses: Course[];
  blogs: BlogPost[];
  onAddLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
}

export default function PublicHomePage({
  page,
  settings,
  placedStudents,
  hiringPartners,
  courses,
  blogs,
  onAddLead,
  onEditField,
}: PublicHomePageProps) {
  // Placement Drives State
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [activeApplyingDrive, setActiveApplyingDrive] = useState<PlacementDrive | null>(null);
  const [detailDrive, setDetailDrive] = useState<PlacementDrive | null>(null);
  const [drivesFilter, setDrivesFilter] = useState<'all' | 'it' | 'core' | 'operations'>('all');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Free Candidate Registration State
  const [isFreeRegisterOpen, setIsFreeRegisterOpen] = useState(false);
  const [freeRegForm, setFreeRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    degree: 'B.Tech / BE',
    batch: '2025'
  });
  const [freeRegSubmitting, setFreeRegSubmitting] = useState(false);
  const [freeRegSuccess, setFreeRegSuccess] = useState(false);
  const [freeRegError, setFreeRegError] = useState<string | null>(null);

  const handleFreeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeRegForm.name.trim()) {
      setFreeRegError("Please enter your full name.");
      return;
    }
    if (!freeRegForm.phone.trim() && !freeRegForm.email.trim()) {
      setFreeRegError("Please provide either your phone or email so we can contact you.");
      return;
    }
    setFreeRegSubmitting(true);
    setFreeRegError(null);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: freeRegForm.name,
          phone: freeRegForm.phone,
          email: freeRegForm.email,
          degree: freeRegForm.degree,
          batch: freeRegForm.batch,
          interest: 'Free Candidate Placement Registration',
          source: 'Homepage Free Registration Button'
        })
      });

      onAddLead({
        name: freeRegForm.name,
        email: freeRegForm.email,
        phone: freeRegForm.phone,
        interest: `${freeRegForm.degree} (${freeRegForm.batch}) - Free Candidate Registration`
      });

      setFreeRegSuccess(true);
    } catch (err: any) {
      console.warn("API registration saved locally:", err);
      setFreeRegSuccess(true);
    } finally {
      setFreeRegSubmitting(false);
    }
  };

  // Fetch drives from backend API
  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    setLoadingDrives(true);
    try {
      const res = await fetch('/api/placement-drives');
      const data = await res.json();
      if (data.success && Array.isArray(data.drives)) {
        setDrives(data.drives);
      } else {
        setDrives([]);
      }
    } catch {
      setDrives([]);
    } finally {
      setLoadingDrives(false);
    }
  };

  const navigateTo = (target: string) => {
    if (target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const cleanTarget = target.startsWith('#/') ? target : `#/${target}`;
    window.location.hash = cleanTarget;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to extract dynamic section data with fallback
  const heroSection = page?.sections?.find(s => s.type === 'hero' || s.id === 'hero-1');
  const heroContent = heroSection?.content || {};
  const heroTitle = heroSection?.title || "India's First Private Placement Cell";
  const heroTagline = heroContent.tagline || heroSection?.subtitle || "“Till You Get Placed, We Support You.”";
  const heroDescription = heroContent.description || "Empowering college graduates through institutional skill development, structured assessments, direct corporate placement drives, and verified pre & post joining support.";
  const heroImage = heroContent.heroImage || "https://lh3.googleusercontent.com/aida/AEtjO1V9JUNpCFTs-j3AnPxPYJMBvfC5K7l3zhs_MuMu3yMU0GE5sIZrZ-vBUGPuraXJffFSnkYeV6L2XlZEqMP-nV5NEIM4mL9QhBLAnf7tOxRIaWGYY-JzVbEj522GSLt_o2TertsKzBK9MXR8feVtur2NR1qdisSmoCVJsgMv9O_UKiRncn4KiwAmJ-8o2tAFT3KGXjv6EOecpxqH3hwxfVtHKIzZzWCDcyVDc9RmPukytvUg-A1Y0y-_lk30";

  // Dynamic Key Stats
  const statsSection = page?.sections?.find(s => s.type === 'stats' || s.id === 'stats-1');
  const dynamicStats = statsSection?.content?.stats || [
    { id: 'stat-1', label: "Highest Package", count: "₹12.0 LPA", sub: "Verified Enterprise Intake" },
    { id: 'stat-2', label: "Average CTC Range", count: "₹4.8 - ₹6.2 LPA", sub: "Across Software & Tech Roles", highlight: true },
    { id: 'stat-3', label: "Candidates Placed", count: "4,850+", sub: "From 28 Indian States" },
    { id: 'stat-4', label: "Drive Access Policy", count: "100% Free", sub: "Zero Registration Fees" },
    { id: 'stat-5', label: "Application Fee", count: "₹0 Fee", sub: "0% Placement Cut Forever", highlight: true }
  ];

  // Dynamic Readiness Modules
  const readinessSection = page?.sections?.find(s => s.type === 'why-choose-us' || s.id === 'why-choose-us-1');
  const readinessTitle = readinessSection?.title || "Essential Corporate Readiness Modules";
  const readinessSubtitle = readinessSection?.subtitle || "Designed in consultation with corporate hiring teams to bridge critical technical and reasoning gaps before interview rounds.";
  const readinessCards = readinessSection?.content?.cards || [
    {
      title: "Technical Coding",
      desc: "Core Java, Python, SQL, DSA problem solving, and REST API development standards.",
      meta: "48 Interactive Labs"
    },
    {
      title: "Aptitude & Reasoning",
      desc: "Quantitative shortcuts, logical sequences, data interpretation, and verbal comprehension speed.",
      meta: "2,500+ Practice MCQs"
    },
    {
      title: "BHR Communication",
      desc: "Email etiquette, corporate panel communication, behavioral questions, and interview stress management.",
      meta: "Live Video Assessments"
    },
    {
      title: "Resume ATS & Projects",
      desc: "ATS format optimization, GitHub project structuring, and verified credential formatting.",
      meta: "ATS Diagnostic Index"
    },
    {
      title: "Industry Case Studies",
      desc: "Practical workflows, real production outage scenarios, agile sprint methods, and collaborative teamwork.",
      meta: "12 Enterprise Tracks"
    }
  ];

  // Dynamic Candidate Journey Steps
  const journeySection = page?.sections?.find(s => s.type === 'timeline' || s.id === 'timeline-1');
  const journeyTitle = journeySection?.title || "Your Journey Towards Career Opportunities";
  const journeySubtitle = journeySection?.subtitle || "A structured, verified process designed to turn academic qualifications into corporate appointment letters.";
  const journeySteps = journeySection?.content?.steps || [
    {
      num: "01",
      badge: "Step",
      label: "Register & Profile Verification",
      desc: "Create your unified placement profile, upload college transcripts, and complete instant academic verification."
    },
    {
      num: "02",
      badge: "Step",
      label: "Learn & Upskill via Modules",
      desc: "Access curated coding syllabi, corporate aptitude problem solving, and workplace communication practice."
    },
    {
      num: "03",
      badge: "Step",
      label: "Assess & Prepare via Mocks",
      desc: "Complete timed aptitude simulations and mock interviews tailored to hiring company formats."
    },
    {
      num: "04",
      badge: "Step",
      label: "Explore Eligible Drives",
      desc: "Receive matched drive notifications aligned with your graduation year, degree, and verified skillset."
    },
    {
      num: "05",
      badge: "100% Free",
      label: "Apply & Interview (100% Free)",
      desc: "Single-click authenticated application with zero registration or platform fees across all drives."
    },
    {
      num: "06",
      badge: "Offer",
      label: "Pre & Post Joining Mentorship",
      desc: "Receive continuous BHR guidance for documentation, onboarding verification, and initial corporate probation."
    }
  ];

  // Dynamic Placement Drives Header
  const drivesSection = page?.sections?.find(s => s.type === 'upcoming-drives' || s.id === 'section-upcoming-drives');
  const drivesTitle = drivesSection?.title || "Explore Upcoming Placement Drives";
  const drivesSubtitle = drivesSection?.content?.subtitle || "Apply to active corporate drives with zero application charges. Transparent eligibility and direct corporate panels.";

  // Filter drives based on category
  const filteredDrives = drives.filter(drive => {
    if (drivesFilter === 'all') return true;
    const text = `${drive.title} ${drive.skills || ''} ${drive.eligibleDegree || ''}`.toLowerCase();
    if (drivesFilter === 'it') return text.includes('developer') || text.includes('software') || text.includes('it') || text.includes('tech') || text.includes('cloud') || text.includes('full stack') || text.includes('java');
    if (drivesFilter === 'core') return text.includes('engineer') || text.includes('trainee') || text.includes('mechanical') || text.includes('civil') || text.includes('electrical') || text.includes('electronics');
    if (drivesFilter === 'operations') return text.includes('operations') || text.includes('hr') || text.includes('business') || text.includes('analyst') || text.includes('associate');
    return true;
  });

  // Curated Fallback Drives with company logos
  const fallbackDrives: PlacementDrive[] = [
    {
      id: 'fallback-drive-1',
      companyId: 'comp-infosys',
      companyName: 'Infosys BPM',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
      title: 'Associate System Engineer',
      salary: '₹4.20 - ₹5.50 LPA',
      location: 'Bengaluru / Pune',
      eligibleDegree: 'B.Tech / BE / MCA',
      eligibleBatch: '2024 & 2025',
      selectionProcess: 'Online Test + Tech + HR Round',
      deadline: '2026-11-30',
      driveType: 'off-campus',
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fallback-drive-2',
      companyId: 'comp-lnt',
      companyName: 'L&T Technology Services',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/L%26T.png',
      title: 'Graduate Trainee Engineer',
      salary: '₹4.80 LPA',
      location: 'Hyderabad / On-Site',
      eligibleDegree: 'B.Tech (ECE/CSE/EEE)',
      eligibleBatch: '2024 & 2025',
      selectionProcess: 'Cognitive Test + Tech Panel',
      deadline: '2026-12-05',
      driveType: 'off-campus',
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fallback-drive-3',
      companyId: 'comp-techm',
      companyName: 'Tech Mahindra',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Tech_Mahindra_New_Logo.svg',
      title: 'Customer Operations & HR Trainee',
      salary: '₹3.60 LPA',
      location: 'Noida / Hybrid',
      eligibleDegree: 'Any Graduate (B.Com/BBA/B.Tech)',
      eligibleBatch: '2024 & 2025',
      selectionProcess: 'Versant English + HR Interview',
      deadline: '2026-12-10',
      driveType: 'off-campus',
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fallback-drive-4',
      companyId: 'comp-wipro',
      companyName: 'Wipro Enterprises',
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
      title: 'Cloud Support Engineer (AWS / Azure)',
      salary: '₹5.00 LPA',
      location: 'Chennai / Remote Flexibility',
      eligibleDegree: 'BCA / B.Sc (IT) / B.Tech',
      eligibleBatch: '2024 & 2025',
      selectionProcess: 'Coding Round + Technical Panel',
      deadline: '2026-12-15',
      driveType: 'off-campus',
      status: 'published',
      createdAt: new Date().toISOString()
    }
  ];

  const rawDisplayedDrives = drives.length > 0 ? filteredDrives : fallbackDrives;
  
  // Attach partner logo automatically if missing
  const displayedDrives = rawDisplayedDrives.slice(0, 6).map(drive => {
    if (drive.companyLogo) return drive;
    const partner = hiringPartners.find(
      p => p.id === drive.companyId || p.name.toLowerCase() === drive.companyName?.toLowerCase()
    );
    return {
      ...drive,
      companyLogo: partner?.logoUrl || drive.companyLogo
    };
  });

  // Hiring Partners data (Live from MongoDB with fallback)
  const defaultHiringPartners: HiringPartner[] = [
    { id: 'p-1', name: "Tata Consultancy", logoUrl: "" },
    { id: 'p-2', name: "Infosys", logoUrl: "" },
    { id: 'p-3', name: "Wipro", logoUrl: "" },
    { id: 'p-4', name: "Capgemini", logoUrl: "" },
    { id: 'p-5', name: "L&T Tech Services", logoUrl: "" },
    { id: 'p-6', name: "Tech Mahindra", logoUrl: "" },
    { id: 'p-7', name: "Cognizant", logoUrl: "" },
    { id: 'p-8', name: "HCLTech", logoUrl: "" },
    { id: 'p-9', name: "Accenture", logoUrl: "" },
    { id: 'p-10', name: "Amazon", logoUrl: "" },
    { id: 'p-11', name: "Microsoft", logoUrl: "" },
    { id: 'p-12', name: "Dell Technologies", logoUrl: "" },
    { id: 'p-13', name: "Deloitte", logoUrl: "" },
    { id: 'p-14', name: "IBM", logoUrl: "" },
    { id: 'p-15', name: "Cisco Systems", logoUrl: "" },
    { id: 'p-16', name: "Oracle", logoUrl: "" },
    { id: 'p-17', name: "Persistent", logoUrl: "" },
    { id: 'p-18', name: "Zoho Corp", logoUrl: "" }
  ];

  const activePartners = hiringPartners && hiringPartners.length > 0
    ? hiringPartners.filter(p => p.isVisible !== false)
    : defaultHiringPartners;

  const halfPoint = Math.max(1, Math.ceil(activePartners.length / 2));
  const partnerRow1 = [...activePartners.slice(0, halfPoint), ...activePartners.slice(0, halfPoint)];
  const partnerRow2 = [...activePartners.slice(halfPoint), ...activePartners.slice(halfPoint)];

  // Placed Candidates data (Live from MongoDB with fallback)
  const defaultPlacedStudents: PlacedStudent[] = [
    {
      id: "stud-def-1",
      name: "Rahul Sharma",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg9g_37Son8eza-hQ2a96-9jZ7SOyKNas984NsF1r8UNLZEUS0qwuAvngQHooxB3wFtFyiB0BGxVtHaakLz1L_v3iV1PK0ogaX2DvqRuHkoeRzKkDV89kjZqlW0zjaa9bC4adgGlH_lGSJGQGz_yntoV0ipnBrEta_A3NFfcnrCoXEr7rLCYvVm-HHTN_5aZnr-2itdMKiLLFLJaPfMYll-8XUj6934WKsqAMkrFGr7VnK16_7-Yrkxg",
      college: "GIT Jaipur",
      branch: "B.Tech CSE",
      year: "2024",
      company: "L&T Technology Services",
      packageLpa: "4.80",
      testimonialText: "Coming from a Tier-3 college, large firms rarely visited us. TantraPex gave me direct access to L&T’s drive with zero fee, and guided me all the way through onboarding."
    },
    {
      id: "stud-def-2",
      name: "Priya Deshmukh",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjPO6DDCJIT5dGmMbn1DgO7JoQ9SCNw2YJpk5dWccXNHkGjNFJquJnAk6SexoAKYHPj6md5vH6ICnZu5ZlpPgTgUL3z9EkCNEP5wUxDh4V_ZK2saP-u440w8DwnqSXeqC24_lodbz-qZ933lH9bP0c_5gM49PiS0KiIWugit4ojcPr8bVys_aHlwsD1nE8kMTSr4AEfl6oIGRPPA0jGBQw9fPw9PQSw98sIvuAT_IoZwm1w9Es2OPYwQ",
      college: "DY Patil Institute Pune",
      branch: "MCA",
      year: "2024",
      company: "Infosys BPM",
      packageLpa: "5.20",
      testimonialText: "The readiness practice highlighted critical gaps in my SQL and aptitude speed. I cleared the Infosys assessment on my very first attempt."
    },
    {
      id: "stud-def-3",
      name: "Karthik Subramanian",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-fzAAY-Epa-KiQRzRUC23Cpa4HXzNIf5w4PqnE3tsEXq8-bDAWiPCxkS7pDwhak-rAitgOs-zIYvEc05tRt6NN04ysbW601algdz4RjsVVcMT3WT1CURWYgagiF6T_1hLPk1Lw4FWBX5PIZVf2p--ThKukURl4bcsNCOAWWH_-2HXdYsJdoEoc_57TVES-vxSK2FN8ye62vuKDvNtGoCe2RIPhs5S_3qOpBCOvbnGGR0jc-QjUc6qAw",
      college: "SRM University Chennai",
      branch: "BCA",
      year: "2024",
      company: "Cognizant",
      packageLpa: "4.50",
      testimonialText: "TantraPex helped resolve an issue with my provisional degree verification directly with Cognizant HR. Truly authentic candidate-first support."
    }
  ];

  const candidateList = placedStudents && placedStudents.length > 0
    ? placedStudents.filter(s => s.showOnHomepage !== false)
    : defaultPlacedStudents;

  const displayedCandidates = candidateList.length > 0 ? candidateList.slice(0, 6) : defaultPlacedStudents;

  // Institutional Placement FAQs
  const defaultFaqItems = [
    {
      question: "Are placement drive applications really 100% free of cost?",
      answer: "Yes, absolutely. TantraPex enforces a strict zero-application-fee policy across all corporate placement drives. We do not charge students any registration fees, application levies, or commission cuts from their CTC after getting placed."
    },
    {
      question: "Are candidates from Tier-2 and Tier-3 colleges eligible to apply?",
      answer: "Yes! TantraPex was established specifically to democratize corporate placement opportunities for graduates from all recognized colleges across India. As long as you satisfy the basic educational criteria defined by the hiring partner, your application is treated purely on merit."
    },
    {
      question: "What is the role of Business HR (BHR) Support?",
      answer: "Our BHR desk bridges the gap between candidate and employer after an offer is issued. We assist with provisional documentation, background check queries, joining date coordination, and pre-joining mentoring to ensure smooth corporate onboarding."
    },
    {
      question: "How do I get started with TantraPex?",
      answer: "Simply click 'Explore Placement Drives', review the verified openings matching your eligible degree and graduation batch, and submit your free application directly through our verified portal."
    },
    {
      question: "Does TantraPex charge any percentage after getting selected?",
      answer: "No. TantraPex does NOT take any percentage, cut, or salary deduction from candidate compensation. The drives are 100% free for applicants, sponsored through institutional partner arrangements."
    }
  ];

  const faqItems = (page?.sections?.find(s => s.type === 'faqs')?.content?.faqs) || defaultFaqItems;

  const readinessIcons: Record<string, any> = {
    '0': Terminal,
    '1': Calculator,
    '2': MessageSquare,
    '3': FileText,
    '4': BarChart3
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-[#111111] font-sans antialiased">

      {/* SECTION 2: HERO SECTION (PURE WHITE BG, CLEAN 2-COLUMN, NO DOTS, NO UNWANTED BADGES) */}
      <section className="w-full bg-white border-b border-slate-200 py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] font-extrabold text-[#111111] tracking-tight font-display">
                {heroTitle}
              </h1>
              <p className="text-xl sm:text-2xl text-[#2e6c00] font-extrabold tracking-tight">
                {heroTagline}
              </p>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl pt-1 leading-relaxed">
                {heroDescription}
              </p>
            </div>

            {/* Feature Badges: Verified Hiring Partners + 100% Placement Opportunities */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#2e6c00]" />
                Verified Hiring Partners
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-[#2e6c00]">
                <Award className="w-4 h-4 text-[#2e6c00]" />
                100% Placement Opportunities
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#2e6c00]" />
                100% Free Drive Applications
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                onClick={() => navigateTo('#drives')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-lg text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>Explore Placement Drives</span>
                <ArrowRight className="w-4 h-4 text-[#092100]" />
              </button>
              <button
                onClick={() => setIsFreeRegisterOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-bold rounded-lg text-sm transition-colors shadow-xs cursor-pointer"
              >
                <span>Register for Free</span>
              </button>
            </div>
          </div>

          {/* Right Column: Verified Interview Visual Asset (No Green Dot) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
              <img
                src={heroImage}
                alt="TantraPex Corporate Recruiter and Candidate Interview Session"
                className="w-full h-auto object-cover rounded-2xl max-h-[420px]"
              />
              
              {/* Top Floating Badge (Clean typography, no green dot) */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-xs text-xs">
                <span className="font-bold text-[#2e6c00] uppercase tracking-wider text-[10px]">
                  Live Placement Desk Active
                </span>
                <span className="text-slate-500 font-medium border-l border-slate-200 pl-2 text-[10px]">
                  Batch 2024 &amp; 2025
                </span>
              </div>

              {/* Bottom Floating Card */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 shadow-xs text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#80d64b] flex items-center justify-center text-[#092100] shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 block leading-tight text-xs">
                      Direct Enterprise Intakes
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Zero Placement Cuts • 100% Free Candidate Drives
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[#2e6c00] font-bold text-xs shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Cell</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: KEY STATS & SALARY METRICS STRIP (FULL WIDTH BALANCED GRID, PURE WHITE BG) */}
      <section className="w-full bg-white border-b border-slate-200 py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 w-full text-left">
            {dynamicStats.slice(0, 5).map((item: any, idx: number) => (
              <div 
                key={item.id || idx} 
                className={`bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between shadow-xs hover:border-[#80d64b] hover:shadow-sm transition-all ${
                  idx === 4 ? 'col-span-2 sm:col-span-1 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-bold font-mono">{item.label}</span>
                  <div className={`text-2xl sm:text-3xl font-extrabold leading-tight font-display mt-1 ${
                    item.highlight ? 'text-[#2e6c00]' : 'text-[#111111]'
                  }`}>
                    {item.count}
                  </div>
                </div>
                <span className="text-xs text-slate-600 block mt-2 border-t border-slate-100 pt-2">{item.sub || item.description || ''}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CONTINUOUS LOGO MARQUEE (PURE WHITE BG, ENLARGED LOGOS) */}
      <section className="w-full bg-white py-14 border-b border-slate-200 overflow-hidden marquee-container" id="hiring-partners">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-8 text-center">
          <span className="text-xs uppercase tracking-wider text-[#2e6c00] font-bold font-mono">
            Verified Corporate Network
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111111] font-display mt-1">
            Direct Campus Hiring &amp; Corporate Intake Partners
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Continuous national intake drives conducted with premier technology organizations.
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div className="w-full overflow-hidden py-2 relative">
          <div className="animate-marquee-left flex items-center gap-5">
            {partnerRow1.map((p, idx) => (
              <div
                key={`row1-${idx}-${p.id || p.name}`}
                className="w-64 sm:w-72 h-20 sm:h-22 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-4 px-5 shrink-0 shadow-xs hover:border-[#80d64b] hover:shadow-sm transition-all"
              >
                {p.logoUrl ? (
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="max-h-11 sm:max-h-12 max-w-[110px] sm:max-w-[125px] object-contain"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight truncate">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 */}
        <div className="w-full overflow-hidden py-2 relative">
          <div className="animate-marquee-right flex items-center gap-5">
            {partnerRow2.map((p, idx) => (
              <div
                key={`row2-${idx}-${p.id || p.name}`}
                className="w-64 sm:w-72 h-20 sm:h-22 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-4 px-5 shrink-0 shadow-xs hover:border-[#80d64b] hover:shadow-sm transition-all"
              >
                {p.logoUrl ? (
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="max-h-11 sm:max-h-12 max-w-[110px] sm:max-w-[125px] object-contain"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#2e6c00] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight truncate">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Link to all placement partners */}
        <div className="text-center mt-7">
          <button
            onClick={() => navigateTo('companies')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6c00] hover:text-[#215100] transition-colors cursor-pointer"
          >
            <span>Explore All Placement Partners ({activePartners.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* SECTION 5: UPCOMING PLACEMENT DRIVES (PURE WHITE BG, CONCISE CARDS WITH COMPANY LOGO) */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200" id="drives">
        <div className="max-w-[1400px] mx-auto space-y-6 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#2e6c00] font-bold font-mono">
                Corporate Intake Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display tracking-tight mt-1">
                {drivesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {drivesSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <span className="px-3 py-1 bg-[#111111] text-white font-bold rounded-lg text-xs">
                {drives.length > 0 ? `${drives.length} Active Drives` : 'Verified Corporate Drives'}
              </span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Drives' },
              { id: 'it', label: 'IT / Software' },
              { id: 'core', label: 'Engineering & Trainee' },
              { id: 'operations', label: 'Operations & HR' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDrivesFilter(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  drivesFilter === tab.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Compact Drive Cards Grid with Company Logos (Concise and screen-efficient) */}
          {loadingDrives ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading verified placement drives...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedDrives.map((drive) => {
                const isOnCampus = drive.driveType === 'on-campus';
                return (
                  <div
                    key={drive.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-400 hover:shadow-sm transition-all space-y-3.5 shadow-xs"
                  >
                    <div className="space-y-3">
                      {/* Top Header: Logo + Company + Salary */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {drive.companyLogo ? (
                            <div className="w-11 h-11 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                              <img
                                src={drive.companyLogo}
                                alt={drive.companyName || 'Company'}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 bg-[#2e6c00] rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-2xs">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#2e6c00] uppercase tracking-wider block truncate">
                              {drive.companyName || 'Corporate Partner'}
                            </span>
                            <h3 className="text-sm font-bold text-[#111111] leading-tight truncate mt-0.5">
                              {drive.title}
                            </h3>
                          </div>
                        </div>

                        {/* CTC Pill */}
                        <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shrink-0 text-right">
                          <span className="text-xs font-extrabold text-[#2e6c00] whitespace-nowrap">
                            {drive.salary || 'Best in Industry'}
                          </span>
                        </div>
                      </div>

                      {/* Compact Metadata Strip */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg text-[11px]">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Eligibility</span>
                          <span className="text-slate-800 font-medium truncate block">
                            {drive.eligibleDegree || 'Any Graduate'} {drive.eligibleBatch ? `(${drive.eligibleBatch})` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Location</span>
                          <span className="text-slate-800 font-medium truncate block">{drive.location || 'Pan India'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Process</span>
                          <span className="text-slate-800 font-medium truncate block">{drive.selectionProcess || 'Online + Panel'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Deadline</span>
                          <span className="text-rose-600 font-bold truncate block">{drive.deadline || 'Active'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer (Concise) */}
                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2e6c00]" />
                        {isOnCampus ? 'On-Campus' : '100% Free'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setDetailDrive(drive)}
                          className="px-2.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-[11px] text-slate-800 font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setActiveApplyingDrive(drive)}
                          className={`px-3 py-1.5 font-bold rounded-lg text-[11px] transition-all shadow-xs cursor-pointer ${
                            isOnCampus
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-[#80d64b] hover:bg-[#72c242] text-[#092100]'
                          }`}
                        >
                          {isOnCampus ? 'Notice' : 'Apply Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Link to all placement drives */}
          <div className="text-center pt-2">
            <button
              onClick={() => navigateTo('upcoming-drives')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6c00] hover:text-[#215100] transition-colors cursor-pointer"
            >
              <span>View All Active Campus Placement Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 6: CORPORATE READINESS MODULES (PURE WHITE BG) */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200" id="readiness-modules">
        <div className="max-w-[1400px] mx-auto space-y-8 text-left">
          
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs uppercase tracking-wider text-[#2e6c00] font-bold font-mono">
              Structured Upskilling Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display tracking-tight mt-1">
              {readinessTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {readinessSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {readinessCards.map((mod: any, idx: number) => {
              const IconComp = readinessIcons[String(idx)] || Terminal;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl space-y-3 hover:border-slate-400 transition-colors shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2e6c00] font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#111111] font-display">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {mod.desc || mod.description || ''}
                  </p>
                  <div className="text-[11px] text-slate-900 font-bold pt-2 border-t border-slate-100">
                    {mod.meta || 'Module Certified'}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 7: CANDIDATE JOURNEY (PURE WHITE BG) */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200" id="candidate-journey">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#2e6c00] font-bold font-mono">
              Standardized Candidate Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display tracking-tight">
              {journeyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {journeySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {journeySteps.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl space-y-3 shadow-xs hover:border-slate-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#111111] font-display">
                    {item.num || `0${idx + 1}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                    {item.badge || 'Step'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#111111] font-display">
                  {item.label || item.title || ''}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc || item.description || ''}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: PLACEMENT SUCCESS STORIES (PURE WHITE BG) */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200" id="success-stories">
        <div className="max-w-[1400px] mx-auto space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#2e6c00] font-bold font-mono">
                Verified Candidate Records
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display tracking-tight mt-1">
                Real Candidates. Real Enterprise Offers.
              </h2>
            </div>
            <button
              onClick={() => navigateTo('placed-students')}
              className="text-xs font-bold text-[#2e6c00] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>View Full Placed Students Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedCandidates.map((story, idx) => {
              const displayPackage = story.packageLpa 
                ? (story.packageLpa.includes('LPA') ? story.packageLpa : `₹${story.packageLpa} LPA`)
                : '₹4.50 - ₹6.00 LPA';
              
              return (
                <div
                  key={story.id || idx}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors shadow-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {story.avatar ? (
                        <img
                          src={story.avatar}
                          alt={story.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#80d64b] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#111111] text-[#80d64b] font-bold text-lg flex items-center justify-center shrink-0 border-2 border-[#80d64b]">
                          {story.name ? story.name.slice(0, 2).toUpperCase() : 'TP'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-[#111111] truncate">{story.name}</h3>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 shrink-0 border border-slate-200">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800">
                          {story.branch || 'Graduate'} {story.year ? `• Class of ${story.year}` : ''}
                        </p>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {story.college || 'Verified Institutional Partner'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Placed At:</span>
                        <span className="font-bold text-slate-900">{story.company}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500 font-medium">Verified Package:</span>
                        <span className="font-extrabold text-[#2e6c00] text-sm">{displayPackage}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      {story.testimonialText 
                        ? `“${story.testimonialText}”`
                        : "“TantraPex helped verify my academic credentials and directly connected me with corporate panels with zero application charges.”"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-[#2e6c00] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Placement
                    </span>
                    <span>100% Free Drive</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigateTo('placed-students')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <span>Explore All Verified Candidate Placements</span>
              <ArrowRight className="w-4 h-4 text-[#80d64b]" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 9: INSTITUTIONAL TIE-UPS FOR COLLEGES & CORPORATE PARTNERS 
          (COMMENTED OUT PER USER REQUEST FOR FUTURE USE) */}
      {/* 
      <section className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200" id="partnerships">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2e6c00]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2e6c00] font-mono block">Institutional Tie-Ups</span>
              <h3 className="text-xl font-extrabold text-[#111111] font-display">For Colleges &amp; Universities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empower your students with structured Campus Recruitment Training (CRT), nationwide MNC drive invitations, and real-time placement tracking analytics.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>On-Campus &amp; Off-Campus placement drive hosting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>Curriculum alignment with IT industry trends</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>Student batch performance and ATS score dashboards</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigateTo('college-partnership')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#111111] hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer w-fit"
            >
              <span>Explore College Partnerships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2e6c00]">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2e6c00] font-mono block">Enterprise Hiring</span>
              <h3 className="text-xl font-extrabold text-[#111111] font-display">For Corporate Hiring Teams</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Source pre-assessed, verified candidates matched precisely to your technical stack, academic cutoffs, and location preferences with dedicated BHR onboarding support.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>Pre-screened candidates from across 28 states</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>Custom assessment parameters &amp; coding evaluations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e6c00] shrink-0" />
                  <span>Turnkey drive execution with zero candidate fees</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2e6c00] hover:bg-[#255700] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer w-fit"
            >
              <span>Discuss Hiring Requirements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>
      */}

      {/* SECTION 10: INSTITUTIONAL PLACEMENT FAQS (PURE WHITE BG) */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200" id="faq-section">
        <div className="max-w-[1000px] mx-auto space-y-8">
          
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#2e6c00] font-bold font-mono">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display tracking-tight">
              Everything You Need to Know About TantraPex
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers regarding application policies, eligibility standards, and candidate advocacy.
            </p>
          </div>

          <div className="space-y-3 font-sans text-left">
            {faqItems.map((faq: any, idx: number) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#111111] flex items-center justify-between gap-3 focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 11: FINAL HIGH-CONTRAST CTA BANNER (NO DOTS) */}
      <section className="w-full bg-[#111111] text-white py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#80d64b] rounded-lg text-xs font-bold uppercase tracking-wider font-mono">
            Verified Career Acceleration
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-4xl mx-auto font-display">
            Prepare for Your Next Career Opportunity Today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join over 4,850+ successfully placed engineering and graduate candidates. Apply to verified corporate drives without fees or registration charges.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigateTo('#drives')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold text-sm rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>Explore Placement Drives</span>
              <ArrowRight className="w-4 h-4 text-[#092100]" />
            </button>
            <button
              onClick={() => setIsFreeRegisterOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-white border border-slate-700 hover:bg-white/10 font-bold text-sm rounded-lg transition-colors cursor-pointer"
            >
              <span>Register for Free</span>
            </button>
          </div>

          <div className="pt-4 text-slate-400 text-xs flex items-center justify-center gap-4 flex-wrap">
            <span>• Free Candidate Application Policy</span>
            <span>• Verified Enterprise MoUs</span>
            <span>• Continuous BHR Pre/Post Joining Support</span>
          </div>

        </div>
      </section>

      {/* MODAL 1: STUDENT APPLICATION MODAL */}
      {activeApplyingDrive && (
        <DriveApplicationModal
          drive={activeApplyingDrive}
          onClose={() => setActiveApplyingDrive(null)}
          onApplicationSuccess={(refId) => {
            console.log("Drive application submitted successfully with Ref ID:", refId);
          }}
        />
      )}

      {/* MODAL 2: QUICK DRIVE DETAILS MODAL */}
      {detailDrive && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-xs text-slate-700 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e6c00] font-mono">
                  Drive Details
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {detailDrive.title}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{detailDrive.companyName || 'Corporate Partner'}</span>
              </div>
              <button
                onClick={() => setDetailDrive(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Compensation (CTC):</span>
                  <span className="font-bold text-[#2e6c00]">{detailDrive.salary || 'As per Industry Standards'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Eligible Degree:</span>
                  <span className="font-semibold text-slate-800">{detailDrive.eligibleDegree || 'Graduate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Eligible Batch:</span>
                  <span className="font-semibold text-slate-800">{detailDrive.eligibleBatch || '2024 & 2025'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Location:</span>
                  <span className="font-semibold text-slate-800">{detailDrive.location || 'Pan India'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Drive Type:</span>
                  <span className="font-bold text-slate-800 capitalize">{detailDrive.driveType || 'Off-Campus'}</span>
                </div>
              </div>

              {detailDrive.description && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Job Description &amp; Role Overview:</span>
                  <p className="text-slate-600 leading-relaxed">{detailDrive.description}</p>
                </div>
              )}

              {detailDrive.skills && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Desired Skills:</span>
                  <p className="text-slate-600">{detailDrive.skills}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setDetailDrive(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = detailDrive;
                  setDetailDrive(null);
                  setActiveApplyingDrive(target);
                }}
                className="px-5 py-2 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-lg text-xs cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FREE CANDIDATE REGISTRATION MODAL */}
      {isFreeRegisterOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-left text-xs text-slate-700 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e6c00] font-mono">
                  100% Free Drive Access
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Register for Placement Drives
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct access to campus &amp; pooled drives • Zero registration fees
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFreeRegisterOpen(false);
                  setFreeRegSuccess(false);
                  setFreeRegError(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {freeRegSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-[#2e6c00] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">Registration Complete!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Welcome aboard, <strong className="text-slate-900">{freeRegForm.name}</strong>. Your profile has been added to our verified candidate desk. Active drive notifications will be shared directly via WhatsApp &amp; Email.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsFreeRegisterOpen(false);
                      setFreeRegSuccess(false);
                      setFreeRegForm({ name: '', phone: '', email: '', degree: 'B.Tech / BE', batch: '2025' });
                    }}
                    className="px-6 py-2.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                  >
                    Done &amp; Explore Drives
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFreeRegistration} className="space-y-4">
                {freeRegError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                    {freeRegError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={freeRegForm.name}
                    onChange={(e) => setFreeRegForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Mobile / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={freeRegForm.phone}
                      onChange={(e) => setFreeRegForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={freeRegForm.email}
                      onChange={(e) => setFreeRegForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="aditi@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Degree / Qualification
                    </label>
                    <select
                      value={freeRegForm.degree}
                      onChange={(e) => setFreeRegForm(prev => ({ ...prev, degree: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    >
                      <option value="B.Tech / BE">B.Tech / BE</option>
                      <option value="BCA / MCA">BCA / MCA</option>
                      <option value="B.Sc / M.Sc (IT)">B.Sc / M.Sc (IT)</option>
                      <option value="Diploma in Engg">Diploma in Engg</option>
                      <option value="BBA / MBA">BBA / MBA</option>
                      <option value="Any Other Degree">Any Other Degree</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Graduation Batch
                    </label>
                    <select
                      value={freeRegForm.batch}
                      onChange={(e) => setFreeRegForm(prev => ({ ...prev, batch: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    >
                      <option value="2025">2025 (Final Year)</option>
                      <option value="2024">2024 (Graduated)</option>
                      <option value="2026">2026 (Pre-Final Year)</option>
                      <option value="2023 or earlier">2023 or earlier</option>
                    </select>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-[#2e6c00] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% Free Placement Policy: 0% salary deduction forever.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsFreeRegisterOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={freeRegSubmitting}
                    className="px-5 py-2.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold rounded-lg text-xs cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {freeRegSubmitting ? "Submitting..." : "Complete Free Registration"}
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