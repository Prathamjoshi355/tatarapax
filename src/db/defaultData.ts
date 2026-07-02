import { CMSPage, GlobalSettings, MediaItem, BlogPost, PlacedStudent, HiringPartner, Course, Lead, Service } from '../types';

export const DEFAULT_SETTINGS: GlobalSettings = {
  logoText: "TANTRAPEX",
  logoSubText: "YOUR CAREER, OUR PRIORITY",
  logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100",
  email: "info@tantrapex.com",
  phone: "+91 93000 12345",
  address: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016",
  socialMedia: {
    facebook: "https://facebook.com/tantrapex",
    twitter: "https://twitter.com/tantrapex",
    linkedin: "https://linkedin.com/company/tantrapex",
    instagram: "https://instagram.com/tantrapex",
    youtube: "https://youtube.com/tantrapex"
  },
  primaryColor: "#071B4D", // Navy Blue
  secondaryColor: "#F7C400", // Yellow CTA
  themeMode: "light",
  containerWidth: "max-w-7xl",
  adminPassword: "admin123",
  headerCtaText: "Enquire Now",
  headerCtaLink: "contact",
  googleRatingValue: "4.8",
  googleRatingTitle: "Based on 250+ Reviews",
  menuItems: [
    { id: "menu-1", label: "Home", pageId: "home", order: 1, isVisible: true },
    { id: "menu-2", label: "About Us", pageId: "about", order: 2, isVisible: true },
    { id: "menu-3", label: "Our Services", pageId: "services", order: 3, isVisible: true },
    { id: "menu-workshops", label: "Workshops", pageId: "workshops", order: 4, isVisible: true },
    { id: "menu-blog", label: "Blogs", pageId: "blog", order: 5, isVisible: true },
    { id: "menu-lms", label: "LMS", pageId: "lms", order: 6, isVisible: true },
    { id: "menu-4", label: "Placement Partners", pageId: "companies", order: 7, isVisible: true },
    { id: "menu-5", label: "Placed Students", pageId: "placed-students", order: 8, isVisible: true },
    { id: "menu-6", label: "Colleges", pageId: "college-partnership", order: 9, isVisible: true },
    { id: "menu-7", label: "Career", pageId: "courses", order: 10, isVisible: true },
    { id: "menu-8", label: "Ambassador", pageId: "campus-ambassador", order: 11, isVisible: true },
    { id: "menu-9", label: "Contact Us", pageId: "contact", order: 12, isVisible: true }
  ]
};

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: "img-hero",
    name: "Students Success Hero",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    type: "image",
    size: "1.2 MB",
    folder: "General",
    altText: "Group of smiling successful college students with laptops"
  },
  {
    id: "img-ceo",
    name: "Founder & CEO Profile",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    type: "image",
    size: "340 KB",
    folder: "Team",
    altText: "Founder & CEO of Tantrapex"
  },
  {
    id: "img-workshop1",
    name: "Resume Building Banner",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
    type: "image",
    size: "450 KB",
    folder: "Workshops",
    altText: "CV resume sheet and coffee on work desk"
  },
  {
    id: "img-workshop2",
    name: "Interview Prep Session",
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
    type: "image",
    size: "520 KB",
    folder: "Workshops",
    altText: "Dynamic interview simulation training class"
  }
];

export const DEFAULT_PLACED_STUDENTS: PlacedStudent[] = [
  {
    id: "stud-1",
    name: "Ankit Verma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    college: "Bhabha University",
    branch: "Computer Science",
    year: "2024",
    company: "Infosys",
    packageLpa: "6.0 LPA"
  },
  {
    id: "stud-2",
    name: "Pooja Singh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    college: "LNCT Bhopal",
    branch: "Information Technology",
    year: "2024",
    company: "TCS",
    packageLpa: "4.2 LPA"
  },
  {
    id: "stud-3",
    name: "Rahul Yadav",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    college: "RGPV Bhopal",
    branch: "Mechanical Engineering",
    year: "2023",
    company: "Capgemini",
    packageLpa: "4.5 LPA"
  },
  {
    id: "stud-4",
    name: "Neha Sharma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    college: "IPS Academy",
    branch: "Electronics & Communication",
    year: "2024",
    company: "Cognizant",
    packageLpa: "4.1 LPA"
  },
  {
    id: "stud-5",
    name: "Harsh Patel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    college: "VIT Bhopal",
    branch: "Computer Science",
    year: "2024",
    company: "Wipro",
    packageLpa: "3.5 LPA"
  },
  {
    id: "stud-6",
    name: "Sanya Gupta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    college: "SIRT Bhopal",
    branch: "Computer Science",
    year: "2024",
    company: "Tech Mahindra",
    packageLpa: "4.8 LPA"
  },
  {
    id: "stud-7",
    name: "Vikram Malhotra",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    college: "TIT Bhopal",
    branch: "Information Technology",
    year: "2023",
    company: "Accenture",
    packageLpa: "5.5 LPA"
  },
  {
    id: "stud-8",
    name: "Aditi Rao",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    college: "SGSITS Indore",
    branch: "Computer Science",
    year: "2024",
    company: "HCL",
    packageLpa: "6.2 LPA"
  }
];

export const DEFAULT_HIRING_PARTNERS: HiringPartner[] = [
  { id: "partner-tcs", name: "TCS", logoUrl: "TCS" },
  { id: "partner-infosys", name: "Infosys", logoUrl: "Infosys" },
  { id: "partner-wipro", name: "Wipro", logoUrl: "Wipro" },
  { id: "partner-capgemini", name: "Capgemini", logoUrl: "Capgemini" },
  { id: "partner-accenture", name: "Accenture", logoUrl: "Accenture" },
  { id: "partner-hcl", name: "HCL", logoUrl: "HCL" },
  { id: "partner-cognizant", name: "Cognizant", logoUrl: "Cognizant" },
  { id: "partner-techm", name: "Tech Mahindra", logoUrl: "Tech Mahindra" },
  { id: "partner-persistent", name: "Persistent", logoUrl: "Persistent" },
  { id: "partner-mindtree", name: "Mindtree", logoUrl: "Mindtree" },
  { id: "partner-lti", name: "LTI", logoUrl: "LTI" },
  { id: "partner-mphasis", name: "Mphasis", logoUrl: "Mphasis" },
  { id: "partner-ibm", name: "IBM", logoUrl: "IBM" },
  { id: "partner-deloitte", name: "Deloitte", logoUrl: "Deloitte" },
  { id: "partner-zs", name: "ZS Associates", logoUrl: "ZS" },
  { id: "partner-byjus", name: "BYJU'S", logoUrl: "BYJU'S" }
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: "course-java",
    name: "Java Programming",
    category: "programming",
    description: "Core Java, OOPs, Collections, JDBC, Spring Basics",
    duration: "3 Months",
    level: "Beginner",
    topics: ["Core Java Syntax", "OOPs Concepts", "Collections Framework", "JDBC & Database Connectivity", "Spring Boot Basics & REST APIs"]
  },
  {
    id: "course-python",
    name: "Python Programming",
    category: "programming",
    description: "Core Python, OOPs, Data Structures, Libraries",
    duration: "3 Months",
    level: "Beginner",
    topics: ["Python Core Syntax", "OOPs in Python", "Data Structures (List, Dict, Tuple)", "Popular Libraries (NumPy, Pandas)", "File Handling & Database Integration"]
  },
  {
    id: "course-cpp",
    name: "C & C++ Programming",
    category: "programming",
    description: "C Essentials, Advanced, DSA, STL",
    duration: "3 Months",
    level: "Intermediate",
    topics: ["Fundamentals of C", "Pointers & Memory Allocation", "C++ OOP Concepts", "STL (Standard Template Library)", "Basic Data Structures in C++"]
  },
  {
    id: "course-web",
    name: "Web Development",
    category: "programming",
    description: "HTML, CSS, JavaScript, React, Node.js",
    duration: "4 Months",
    level: "Intermediate",
    topics: ["HTML5 & Semantics", "CSS3 & Modern Flexbox/Grid", "JavaScript ES6+ and DOM", "React.js Frontend Development", "Node.js & Express Backend Basics"]
  },
  {
    id: "course-dsa",
    name: "Data Structures & Algorithms",
    category: "programming",
    description: "Using Java / Python, DSA, Arrays, Trees, Graph",
    duration: "3 Months",
    level: "Intermediate",
    topics: ["Arrays, Linked Lists, Stacks, Queues", "Trees & Graphs", "Searching & Sorting Algorithms", "Recursion & Dynamic Programming", "LeetCode Problem Solving Techniques"]
  },
  {
    id: "course-sql",
    name: "SQL & Database",
    category: "database",
    description: "SQL, MySQL, PL/SQL, Database Concepts",
    duration: "2 Months",
    level: "Beginner",
    topics: ["Relational Model Concepts", "SQL Queries & Aggregations", "Subqueries & Joins", "Indexing & Transactions", "PL/SQL Stored Procedures & Triggers"]
  },
  {
    id: "course-aptitude",
    name: "Quantitative Aptitude Mastery",
    category: "aptitude",
    description: "Master quantitative, logical, and verbal skills to clear company screening rounds.",
    duration: "2 Months",
    level: "Beginner",
    topics: ["Percentages, Profit & Loss", "Time, Speed & Distance", "Permutations & Combinations", "Data Interpretation", "Logical Reasoning Blocks"]
  },
  {
    id: "course-soft",
    name: "Professional Communication & Soft Skills",
    category: "soft-skills",
    description: "Hone your public speaking, corporate email writing, and group discussion skills.",
    duration: "1 Month",
    level: "Beginner",
    topics: ["Public Speaking", "Body Language & Etiquette", "Group Discussion Strategy", "E-mail Writing", "Resume Walkthrough Preparation"]
  },
  {
    id: "course-interview",
    name: "Comprehensive Interview Bootcamp",
    category: "interview",
    description: "Live mock drills with industry veterans. Personalized performance analysis.",
    duration: "1 Month",
    level: "Intermediate",
    topics: ["Technical Mock Drills", "HR & Behavioral Cracking", "Star Methodology", "Salary Negotiation Hacks"]
  }
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "service-resume",
    title: "Resume Writing & ATS Optimization",
    slug: "resume-writing-ats-optimization",
    category: "career-services",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Create resume profiles that pass ATS filters and impress recruiters.",
    description: "Professional resume writing, keyword optimization, and formatting improvements that position you for interviews in product and service companies.",
    buttonText: "Book Resume Review",
    buttonLink: "#/contact",
    featured: true,
    showOnHomepage: true,
    published: true,
    order: 1,
    createdAt: "2026-06-26T09:00:00.000Z",
    seo: {
      title: "Resume Writing Service | Tantrapex",
      description: "Stand out with a recruiter-ready resume optimized for ATS and hiring managers.",
      keywords: "resume writing, ATS optimization, application support"
    }
  },
  {
    id: "service-mock-interview",
    title: "Mock Interviews & Feedback",
    slug: "mock-interviews-feedback",
    category: "interview-prep",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Simulated technical and behavioral interviews with expert feedback.",
    description: "Live mock interview sessions across coding, system design, and HR rounds with personalized improvement plans.",
    buttonText: "Schedule Mock Interview",
    buttonLink: "#/contact",
    featured: true,
    showOnHomepage: true,
    published: true,
    order: 2,
    createdAt: "2026-06-26T09:15:00.000Z",
    seo: {
      title: "Mock Interview Coaching | Tantrapex",
      description: "Practice real interview questions and get detailed performance feedback from industry mentors.",
      keywords: "mock interview, interview coaching, technical interview prep"
    }
  },
  {
    id: "service-career-counseling",
    title: "Career Counseling & Strategy",
    slug: "career-counseling-strategy",
    category: "career-services",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    shortDescription: "One-on-one career guidance for academic and professional transitions.",
    description: "Tailored career planning sessions to help you choose the right specialization, company fit, and career path.",
    buttonText: "Book Counseling Session",
    buttonLink: "#/contact",
    featured: false,
    showOnHomepage: false,
    published: true,
    order: 3,
    createdAt: "2026-06-26T09:30:00.000Z",
    seo: {
      title: "Career Counseling | Tantrapex",
      description: "Get expert career guidance on course selection, company fit, and job search strategy.",
      keywords: "career counseling, career strategy, course guidance"
    }
  }
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "How to Create an ATS Friendly Resume?",
    slug: "how-to-create-an-ats-friendly-resume",
    category: "Resume Tips",
    excerpt: "Get your resume selected by corporate Applicant Tracking Systems with these industry secrets.",
    content: "An ATS (Applicant Tracking System) parses your resume for keywords before a human ever looks at it. To make yours friendly, use clear headings, standard fonts (Arial, Inter), absolute text (no graphics/icons), and align your key terms directly with the target job description. Avoid templates with dual columns, progress bars, or complicated layout cards.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
    date: "10 May 2026",
    readTime: "5 mins read",
    status: "published"
  },
  {
    id: "blog-2",
    title: "Top 10 Interview Questions & Answers",
    slug: "top-10-interview-questions-and-answers",
    category: "Interview Tips",
    excerpt: "The absolute guide to cracking technical and behavioral interview questions.",
    content: "Preparation is the key. When answering 'Tell me about yourself', link your educational path directly to the job needs. For difficult queries like 'What is your weakness?', state a true professional hurdle you have already taken clear, measurable steps to conquer. Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
    date: "18 May 2026",
    readTime: "8 mins read",
    status: "published"
  },
  {
    id: "blog-3",
    title: "LinkedIn Profile Optimization Guide",
    slug: "linkedin-profile-optimization-guide",
    category: "LinkedIn Tips",
    excerpt: "How to attract top recruiters organically with a premium, searchable profile.",
    content: "Recruiters use advanced filters to locate candidates on LinkedIn. To rank high, make sure your Headline contains high-demand skills (e.g. 'Java Developer | Spring Boot | React'). Write an engaging summary describing your project accomplishments, and obtain recommendations from your teachers or past internship managers.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500",
    date: "05 Jun 2026",
    readTime: "6 mins read",
    status: "published"
  }
];

export const DEFAULT_LEADS: Lead[] = [
  {
    id: "lead-1",
    type: "contact",
    name: "Rohan Agrawal",
    email: "rohan@gmail.com",
    phone: "9876543210",
    message: "I am interested in the Java Placement Course. Please schedule a call.",
    date: "2026-06-25T10:30:00.000Z",
    status: "new"
  },
  {
    id: "lead-2",
    type: "demo",
    name: "Kriti Sen",
    email: "kriti@gmail.com",
    phone: "9112233445",
    message: "Requested live demo access for the LMS system.",
    date: "2026-06-26T14:15:00.000Z",
    status: "contacted"
  }
];

export const DEFAULT_PAGES: CMSPage[] = [
  {
    id: "home",
    title: "Home",
    slug: "/",
    seo: {
      title: "Tantrapex | Get Placed in Top Companies",
      description: "Premier career development and placement consultancy helping students train, mentorship and get placed.",
      keywords: "placement, career, engineering jobs, training, bootcamp"
    },
    sections: [
      {
        id: "hero-1",
        type: "hero",
        title: "Get Placed in Top Companies",
        subtitle: "Your Career Starts Here",
        content: {
          tagline: "Training | Mentorship | Placement Assistance",
          primaryBtnText: "Register Now",
          primaryBtnLink: "#contact",
          secondaryBtnText: "Book Free Demo",
          secondaryBtnLink: "#contact",
          heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600",
          mobileHeroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
          overlayColor: "rgba(7, 27, 77, 0.55)",
          heroHeight: "95vh",
          textAlignment: "left",
          showHero: true
        },
        design: {
          backgroundColor: "#071B4D",
          textColor: "#f8fafc",
          headingColor: "#ffffff",
          buttonColor: "#F7C400",
          buttonHoverColor: "#e2b400",
          buttonTextColor: "#071B4D",
          borderRadius: "0px",
          paddingY: "0",
          animation: "fade",
          cardBackgroundColor: "#111827",
          borderColor: "#374151"
        }
      },
      {
        id: "stats-1",
        type: "stats",
        title: "Our Placement Stats",
        subtitle: "Direct results of premium student mentorship",
        content: {
          statsMode: "manual",
          stats: [
            { id: "stat-1", label: "Students Placed", count: "100+", icon: "Users", visible: true, order: 1 },
            { id: "stat-2", label: "Hiring Companies", count: "50+", icon: "Award", visible: true, order: 2 },
            { id: "stat-3", label: "Students Trained", count: "2000+", icon: "GraduationCap", visible: true, order: 3 },
            { id: "stat-4", label: "Student Satisfaction", count: "95%", icon: "CheckCircle", visible: true, order: 4 }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#071B4D",
          buttonColor: "#071B4D",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "0px",
          paddingY: "8",
          animation: "slide",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0"
        }
      },
      {
        id: "why-choose-us-1",
        type: "why-choose-us",
        title: "Why Choose Tantrapex?",
        subtitle: "Comprehensive training and hands-on guidance to accelerate your placement rate.",
        content: {
          cards: [
            { id: "wc-1", title: "Resume Building", desc: "ATS optimized resume", icon: "FileText", order: 1, visible: true },
            { id: "wc-2", title: "LinkedIn Profile", desc: "Profile optimization", icon: "Linkedin", order: 2, visible: true },
            { id: "wc-3", title: "Aptitude Training", desc: "Quantitative & logical skill-building", icon: "Brain", order: 3, visible: true },
            { id: "wc-4", title: "Mock Interviews", desc: "Real prep panels with industry veterans", icon: "Video", order: 4, visible: true },
            { id: "wc-5", title: "Communication Skills", desc: "Speaking and presentation drills", icon: "MessageSquare", order: 5, visible: true },
            { id: "wc-6", title: "Placement Assistance", desc: "Linkages with top MNC recruitment agencies", icon: "Briefcase", order: 6, visible: true }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#475569",
          headingColor: "#071B4D",
          buttonColor: "#071B4D",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "0px",
          paddingY: "16",
          animation: "zoom",
          cardBackgroundColor: "#ffffff",
          borderColor: "#cbd5e1"
        }
      },
      {
        id: "timeline-1",
        type: "timeline",
        title: "Your Journey With Us",
        subtitle: "Step-by-step guidance designed to transform you into a job-ready professional.",
        content: {
          steps: [
            { id: "step-1", num: "1", label: "Register", icon: "Edit3", desc: "Sign up and create your candidate profile on our centralized database." },
            { id: "step-2", num: "2", label: "Free Demo", icon: "Play", desc: "Attend a free masterclass demo of our premium placement boot camp." },
            { id: "step-3", num: "3", label: "Assessment", icon: "ClipboardCheck", desc: "Take an initial coding and logical reasoning diagnostic assessment." },
            { id: "step-4", num: "4", label: "LMS Access", icon: "BookOpen", desc: "Unlock full learning modules, curated test banks and project trackers." },
            { id: "step-5", num: "5", label: "Training & Guidance", icon: "GraduationCap", desc: "Undergo rigorous technical, quant, and aptitude classroom boot camp." },
            { id: "step-6", num: "6", label: "Interview Prep", icon: "Users", desc: "Conduct exhaustive mock loops, resume tuning, and peer feedback sessions." },
            { id: "step-7", num: "7", label: "Placement", icon: "CheckCircle", desc: "Participate in dedicated hiring drives and receive actual corporate offers." }
          ]
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#071B4D",
          borderRadius: "0px",
          paddingY: "16",
          animation: "fade",
          cardBackgroundColor: "#ffffff",
          borderColor: "#cbd5e1"
        }
      },
      {
        id: "stories-and-partners-1",
        type: "stories-and-partners",
        title: "Our Achievers & Trusted Hiring Partners",
        subtitle: "Bridging the gap between MP's top talent and international product companies.",
        content: {},
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#071B4D",
          borderRadius: "0px",
          paddingY: "16",
          animation: "fade"
        }
      },
      {
        id: "cta-banner-1",
        type: "cta-banner",
        title: "Ready to start your journey?",
        subtitle: "Register now and get a free demo class.",
        content: {
          primaryBtnText: "Register Now",
          primaryBtnLink: "#contact",
          tagline: "Over 5000+ candidates already trained & mentored.",
          bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600"
        },
        design: {
          backgroundColor: "#071B4D",
          textColor: "#ffffff",
          headingColor: "#ffffff",
          buttonColor: "#F7C400",
          buttonHoverColor: "#e2b400",
          buttonTextColor: "#071B4D",
          borderRadius: "16px",
          paddingY: "16",
          animation: "zoom"
        }
      }
    ]
  },
  {
    id: "about",
    title: "About Us",
    slug: "/about",
    seo: {
      title: "About Us | Tantrapex Consultancy",
      description: "Learn about the mission, vision, and core journey of Tantrapex career development consultancy.",
      keywords: "consultancy founder, our story, Bhopal training centre"
    },
    sections: [
      {
        id: "about-main-1",
        type: "about-main",
        title: "About Tantrapex",
        content: {
          description: "Tantrapex is a career development and placement consultancy helping students to build skills, crack interviews and get placed in top companies. We bridge the gap between college education and industrial demands through high-touch mentoring and actual job resources.",
          founderName: "Founder & CEO",
          founderRole: "Leading Tantrapex to build real career bridges for students",
          founderImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "fade",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#cbd5e1"
        }
      },
      {
        id: "mission-vision-1",
        type: "mission-vision",
        title: "Our Direction",
        content: {
          missionTitle: "Our Mission",
          missionDesc: "To empower students with the right skills, guidance and opportunities to build a highly successful and fulfilling career.",
          missionImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300",
          visionTitle: "Our Vision",
          visionDesc: "To become India's most trusted and reliable career partner for students and leading corporate hiring organizations alike.",
          visionImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=300"
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "12",
          animation: "zoom",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0"
        }
      },
      {
        id: "why-us-list-1",
        type: "why-us-list",
        title: "Why Choose Us?",
        content: {
          points: [
            { id: "p-1", title: "Industry Expert Mentors", desc: "Learn directly from professionals currently working in top tech companies." },
            { id: "p-2", title: "Personalized Training", desc: "Custom attention tailored to your exact logical level and pace." },
            { id: "p-3", title: "100% Placement Assistance", desc: "Constant linkages, continuous drives and mock prep." },
            { id: "p-4", title: "Practical Learning Approach", desc: "No boring slides. Build code, write real queries and pitch live." },
            { id: "p-5", title: "Strong Industry Connections", desc: "Partnerships with 50+ leading companies throughout India." },
            { id: "p-6", title: "Lifetime Support", desc: "Alumni portal access, career guidance and community help forever." }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "8px",
          paddingY: "16",
          animation: "slide",
          cardBackgroundColor: "#f1f5f9",
          borderColor: "#cbd5e1"
        }
      },
      {
        id: "about-journey-1",
        type: "about-journey",
        title: "Our Journey",
        content: {
          milestones: [
            { id: "m-1", year: "2018", title: "Started Journey", desc: "Laid the foundation of Tantrapex in Pune, mentoring our first batch of 50 students.", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300" },
            { id: "m-2", year: "2021", title: "Expanded to Bhopal", desc: "Opened our modern training center in Arera Colony, Bhopal, scaling our student base.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300" },
            { id: "m-3", year: "2023", title: "Expanded to Indore", desc: "Launched Indore branch on Vijay Nagar Road to support students across Madhya Pradesh.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300" },
            { id: "m-4", year: "2025+", title: "Expanding to More Cities", desc: "Enabling comprehensive LMS, digital classrooms, and expanding to tier-2 cities nationwide.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300" }
          ]
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "fade",
          cardBackgroundColor: "#ffffff",
          borderColor: "#cbd5e1"
        }
      }
    ]
  },
  {
    id: "services",
    title: "Services",
    slug: "/services",
    seo: {
      title: "Our Services | Tantrapex",
      description: "Discover how we prepare you for job placements, from resume writing to core training bootcamps.",
      keywords: "resume service, placement training, technical mock interviews"
    },
    sections: [
      {
        id: "services-grid-1",
        type: "services-grid",
        title: "Our Services",
        subtitle: "Everything you need to build your career",
        content: {
          services: [
            { id: "s-1", title: "Resume Building", desc: "Professional resume editing with ATS optimizations that gets you shortlisted by HR.", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=300" },
            { id: "s-2", title: "LinkedIn Profile", desc: "Organically optimize your profile visibility to rank high in recruiter searches.", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=300" },
            { id: "s-3", title: "Aptitude Training", desc: "Rigorous daily quantitative, logical reasoning and verbal aptitude modules.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300" },
            { id: "s-4", title: "Technical Training", desc: "Learn Java, Python, DSA, System Design and SQL from industrial developers.", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300" },
            { id: "s-5", title: "Mock Interview", desc: "Simulated stress interviews mimicking genuine corporate technical standards.", image: "https://images.unsplash.com/photo-1521791136364-72868500282c?auto=format&fit=crop&q=80&w=300" },
            { id: "s-6", title: "Interview Preparation", desc: "Comprehensive behavioral preparation, body language training and STAR framework guidelines.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300" },
            { id: "s-7", title: "Communication Skills", desc: "Overcome fear, polish English pitch, and excel in difficult group debates.", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=300" },
            { id: "s-8", title: "Career Counselling", desc: "Personalized 1-on-1 feedback on choosing standard pathways or product vs service lines.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300" },
            { id: "s-9", title: "Placement Assistance", desc: "Access exclusive off-campus and on-campus drive notifications from our 50+ list.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=300" },
            { id: "s-10", title: "Corporate Training", desc: "Custom corporate packages, training new recruits on custom enterprise software pipelines.", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300" },
            { id: "s-11", title: "LMS Access", desc: "Structured login access to assignments, video logs, class notes, and certificates 24/7.", image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=300" },
            { id: "s-12", title: "Certificate", desc: "Gain highly respected, industry-recognized certificates of achievement upon module completion.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300" }
          ],
          ctaTitle: "Ready to start your journey?",
          ctaDesc: "Register now and get a free demo class with our expert mentors.",
          ctaBtnText: "Register Now"
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#475569",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "20",
          animation: "zoom",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#e2e8f0"
        }
      }
    ]
  },
  {
    id: "placed-students",
    title: "Placed Students",
    slug: "/placed-students",
    seo: {
      title: "Our Placed Students | Tantrapex",
      description: "Browse the comprehensive list of successful students placed in top MNCs.",
      keywords: "student placement records, salary packages, top company placements"
    },
    sections: [
      {
        id: "placed-table-1",
        type: "placed-table",
        title: "Our Placed Students",
        subtitle: "100+ students placed in top companies",
        content: {
          googleRatingTitle: "Based on 120+ Reviews",
          googleRatingValue: "4.8"
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "slide",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0"
        }
      }
    ]
  },
  {
    id: "companies",
    title: "Hiring Companies",
    slug: "/companies",
    seo: {
      title: "Our Hiring Partners | Tantrapex",
      description: "Explore our rich network of hiring partners, recruiters, and companies.",
      keywords: "TCS hiring partner, Capgemini hiring, MNC recruiters, Bhopal consultancy"
    },
    sections: [
      {
        id: "companies-grid-1",
        type: "companies-grid",
        title: "Our Hiring Partners",
        subtitle: "We have strong, persistent connections with 50+ companies",
        content: {
          ctaTitle: "Are you a recruiter looking to hire?",
          ctaDesc: "Get access to pre-screened, highly skilled ready-to-deploy tech candidates.",
          ctaBtnText: "Hire From Us"
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#475569",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "fade",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#cbd5e1"
        }
      }
    ]
  },
  {
    id: "courses",
    title: "Courses",
    slug: "/courses",
    seo: {
      title: "Courses We Offer | Tantrapex",
      description: "Check out our industry-oriented training programs and syllabus.",
      keywords: "Java syllabus, Python courses, quantitative aptitude, C++ training"
    },
    sections: [
      {
        id: "courses-tabs-1",
        type: "courses-tabs",
        title: "Courses We Offer",
        subtitle: "Industry oriented courses specifically tuned to boost your career prospects.",
        content: {
          viewAllBtnText: "Enquire About Course"
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "zoom",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0"
        }
      }
    ]
  },
  {
    id: "lms",
    title: "Student LMS Portal",
    slug: "/lms",
    seo: {
      title: "LMS Student Portal | Tantrapex",
      description: "Interactive online learning dashboard for students.",
      keywords: "LMS student portal, assignment submission, online lectures"
    },
    sections: [
      {
        id: "lms-dashboard-1",
        type: "lms-dashboard",
        title: "Student Dashboard",
        content: {
          studentName: "Pratham Joshi",
          studentId: "TPX-2026-089",
          notificationText: "Reminder: Upcoming Live Class on Aptitude - Percentage begins in 15 minutes.",
          coursesIconUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=150",
          coursesLabel: "My Courses",
          coursesValue: "5 Enrolled",
          classesIconUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=150",
          classesLabel: "Live Classes",
          classesValue: "2 Upcoming",
          assignmentsIconUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=150",
          assignmentsLabel: "Assignments",
          assignmentsValue: "3 Pending",
          testsIconUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=150",
          testsLabel: "Mock Tests",
          testsValue: "4 Pending",
          progressItems: [
            { name: "Java Programming", progress: 75 },
            { name: "Web Development", progress: 50 },
            { name: "Aptitude Training", progress: 100 }
          ],
          liveClassTitle: "Aptitude - Percentage",
          liveClassInstructor: "By Ravi Sir",
          liveClassSchedule: "Tomorrow, 11:00 AM",
          liveClassBtnText: "Join Class",
          videoThumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
          videoUrl: "https://www.youtube.com",
          googleLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
          googleRating: "4.8",
          googleReviewsText: "Based on 500+ Reviews",
          googleBtnText: "Read Reviews",
          googleReviewsLink: "https://google.com",
          recentActivities: [
            { id: "act-1", title: "Java Basics", type: "Live Class", status: "Completed", date: "10 May 2024", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" },
            { id: "act-2", title: "Data Structures", type: "Assignment", status: "Submitted", date: "09 May 2024", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
            { id: "act-3", title: "Aptitude Mock Test 1", type: "Mock Test", status: "In Progress", date: "09 May 2024", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
            { id: "act-4", title: "Resume Building", type: "Live Class", status: "Completed", date: "08 May 2024", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
            { id: "act-5", title: "Interview Skills", type: "Live Class", status: "Upcoming", date: "11 May 2024", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#071B4D",
          buttonColor: "#071B4D",
          buttonHoverColor: "#00103a",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "12",
          animation: "fade",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#e2e8f0"
        }
      }
    ]
  },
  {
    id: "campus-ambassador",
    title: "Campus Ambassador",
    slug: "/campus-ambassador",
    seo: {
      title: "Become a Campus Ambassador | Tantrapex",
      description: "Gain leadership skills and referral benefits as our university student leader.",
      keywords: "campus ambassador program, student rewards, Bhopal college leader"
    },
    sections: [
      {
        id: "ambassador-main-1",
        type: "ambassador-main",
        title: "Become a Campus Ambassador",
        subtitle: "Lead. Learn. Earn.",
        content: {
          benefitsTitle: "Benefits You Get",
          benefits: [
            "Enhance Communication",
            "Internship Opportunities",
            "Leadership Exposure",
            "Monthly Incentives",
            "Placement Priority",
            "Branding & Experience",
            "Exclusive Trainings"
          ],
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
          formTitle: "Apply Now",
          pastAmbassadorsTitle: "Our Past Ambassadors",
          pastAmbassadors: [
            { id: "pa-1", year: "2019", title: "Joined Journey", desc: "Our pioneer campus crew began here." },
            { id: "pa-2", year: "2021", title: "Expanded to 50+ Colleges", desc: "Mentored over 500+ student leads across colleges." },
            { id: "pa-3", year: "2023", title: "Expanded to India Wide", desc: "Established closed pooled networks across standard cities." },
            { id: "pa-4", year: "2024+", title: "Expanding to more cities", desc: "Now adding dynamic tech nodes globally." }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#475569",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "20",
          animation: "zoom",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#cbd5e1"
        }
      }
    ]
  },
  {
    id: "college-partnership",
    title: "College Partnership",
    slug: "/college-partnership",
    seo: {
      title: "College Partnership | Tantrapex",
      description: "Working in tandem with colleges to scale campus placements.",
      keywords: "CRT training, campus drives, university placements"
    },
    sections: [
      {
        id: "partnership-grid-1",
        type: "partnership-grid",
        title: "Partner With Us",
        subtitle: "We work directly with colleges and universities to provide best career opportunities.",
        content: {
          partnerships: [
            { id: "prt-1", title: "Workshops & Seminars", desc: "Expert talks on latest industry trends, resume design, and LinkedIn profile tips." },
            { id: "prt-2", title: "CRT Training Programs", desc: "Comprehensive Campus Recruitment Training spanning logical reasoning, aptitude and mock technical tests." },
            { id: "prt-3", title: "Placement Drives", desc: "Exclusive closed pooled placement drives for partner colleges to maximize student hiring." },
            { id: "prt-4", title: "Industrial Visits", desc: "Visits to premium corporate software development centers to witness active product environments." },
            { id: "prt-5", title: "Faculty Development", desc: "FDP training programs helping college professors align their curriculum with industrial changes." }
          ],
          brochureBtnText: "Download Brochure",
          registerBtnText: "Register Your College"
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "fade",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0"
        }
      }
    ]
  },
  {
    id: "workshops",
    title: "Workshops",
    slug: "/workshops",
    seo: {
      title: "Our Workshops | Tantrapex",
      description: "Interactive tech seminars and resume clinics.",
      keywords: "upcoming workshops, past seminars, resume clinic"
    },
    sections: [
      {
        id: "workshops-list-1",
        type: "workshops-list",
        title: "Our Workshops",
        subtitle: "Hands-on, highly interactive masterclasses to sharpen your real-world skills.",
        content: {
          workshops: [
            {
              id: "wk-1",
              title: "Resume Building Workshop",
              desc: "Get an ATS-friendly premium resume designed live, complete with keywords matching MNC filters.",
              date: "15 July 2026",
              location: "Bhopal Office",
              image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            },
            {
              id: "wk-2",
              title: "Interview Preparation Workshop",
              desc: "Master the STAR behavioral interview framework, learn secret body language hacks, and clear technical mock drills.",
              date: "22 July 2026",
              location: "Indore Office",
              image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
              status: "upcoming"
            }
          ]
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#475569",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "16",
          animation: "slide",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#cbd5e1"
        }
      }
    ]
  },
  {
    id: "blog",
    title: "Blog",
    slug: "/blog",
    seo: {
      title: "Career & Placement Blog | Tantrapex",
      description: "Read advice columns from our senior placement experts and tech mentors.",
      keywords: "career tips, interview advice, LinkedIn hacks"
    },
    sections: [
      {
        id: "blog-grid-1",
        type: "blog-grid",
        title: "Career & Placement Blog",
        subtitle: "Weekly articles packed with verified hacks to land high-paying product roles.",
        content: {
          viewAllBtnText: "View All Blogs"
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#475569",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "zoom",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#e2e8f0"
        }
      }
    ]
  },
  {
    id: "contact",
    title: "Contact Us",
    slug: "/contact",
    seo: {
      title: "Contact Us | Tantrapex Career Consultancy",
      description: "Contact our offices in Bhopal and Indore for physical coaching, registration, and corporate deals.",
      keywords: "Arera Colony office, Vijay Nagar road office, Bhopal phone number"
    },
    sections: [
      {
        id: "contact-split-1",
        type: "contact-split",
        title: "Get In Touch",
        subtitle: "We are here to help you launch your dream career. Reach out anytime.",
        content: {
          offices: [
            { id: "of-1", name: "Bhopal Office", address: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016", phone: "+91 93000 12345", email: "bhopal@tantrapex.com" },
            { id: "of-2", name: "Indore Office", address: "456, Vijay Nagar, Indore, Madhya Pradesh - 452010", phone: "+91 93000 54321", email: "indore@tantrapex.com" }
          ],
          mapTitle: "Tantrapex Bhopal Office Location",
          formSubmitBtnText: "Send Message",
          mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2163989182373!2d77.4277!3d23.2332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42636f2f2f11%3A0x7d8a6b1297eefb3b!2sArera%20Colony%2C%20Bhopal%2C%20Madhya%20Pradesh%20462016!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
          phone: "+91 93000 12345",
          email: "info@tantrapex.com",
          website: "www.tantrapex.com",
          linkedin: "https://linkedin.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com",
          facebook: "https://facebook.com"
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "16",
          animation: "slide",
          cardBackgroundColor: "#ffffff",
          borderColor: "#cbd5e1"
        }
      }
    ]
  }
];
