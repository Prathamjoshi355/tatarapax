import { CMSPage, GlobalSettings, MediaItem, BlogPost, PlacedStudent, HiringPartner, Course, Lead } from '../types';

export const DEFAULT_SETTINGS: GlobalSettings = {
  logoText: "TENTRAPAX",
  logoSubText: "YOUR CAREER, OUR PRIORITY",
  logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100",
  email: "info@tentrapax.com",
  phone: "+91 93000 12345",
  address: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016",
  socialMedia: {
    facebook: "https://facebook.com/tentrapax",
    twitter: "https://twitter.com/tentrapax",
    linkedin: "https://linkedin.com/company/tentrapax",
    instagram: "https://instagram.com/tentrapax",
    youtube: "https://youtube.com/tentrapax"
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
    { id: "menu-4", label: "Placement Partners", pageId: "companies", order: 4, isVisible: true },
    { id: "menu-5", label: "Placed Students", pageId: "placed-students", order: 5, isVisible: true },
    { id: "menu-6", label: "Colleges", pageId: "college-partnership", order: 6, isVisible: true },
    { id: "menu-7", label: "Career", pageId: "courses", order: 7, isVisible: true },
    { id: "menu-8", label: "Ambassador", pageId: "campus-ambassador", order: 8, isVisible: true },
    { id: "menu-9", label: "Contact Us", pageId: "contact", order: 9, isVisible: true }
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
    altText: "Founder & CEO of Tentrapax"
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
    description: "Master Java from core syntax to high-level application frameworks.",
    duration: "12 Weeks",
    topics: ["Core Java", "OOPs Concepts", "Collections", "JDBC", "Spring Boot & Microservices"]
  },
  {
    id: "course-python",
    name: "Python Programming",
    category: "programming",
    description: "Build robust backend applications, data models, and scripts.",
    duration: "10 Weeks",
    topics: ["Python Core Syntax", "OOPs in Python", "Data Structures", "Database Integration", "Django/Flask Core"]
  },
  {
    id: "course-cpp",
    name: "C & C++ Programming",
    category: "programming",
    description: "Deep dive into machine concepts, memory management, and competitive logic.",
    duration: "8 Weeks",
    topics: ["Fundamentals of C", "Pointers & Memory Allocation", "C++ OOP Concepts", "STL (Standard Template Library)"]
  },
  {
    id: "course-dsa",
    name: "Data Structures & Algorithms",
    category: "programming",
    description: "The ultimate interview-cracking course for high-paying product companies.",
    duration: "14 Weeks",
    topics: ["Arrays, Linked Lists, Stacks, Queues", "Trees & Graphs", "Searching & Sorting", "Recursion & DP", "LeetCode Solutions"]
  },
  {
    id: "course-sql",
    name: "SQL & Databases",
    category: "programming",
    description: "Design efficient relational models, write complex joins, and optimize indexes.",
    duration: "6 Weeks",
    topics: ["Relational Model", "SQL Queries & Aggregations", "Subqueries & Joins", "Indexing & Transactions", "PostgreSQL/MySQL"]
  },
  {
    id: "course-aptitude",
    name: "Quantitative Aptitude Mastery",
    category: "aptitude",
    description: "Master quantitative, logical, and verbal skills to clear company screening rounds.",
    duration: "6 Weeks",
    topics: ["Percentages, Profit & Loss", "Time, Speed & Distance", "Permutations & Combinations", "Data Interpretation", "Logical Reasoning Blocks"]
  },
  {
    id: "course-soft",
    name: "Professional Communication & Soft Skills",
    category: "soft-skills",
    description: "Hone your public speaking, corporate email writing, and group discussion skills.",
    duration: "4 Weeks",
    topics: ["Public Speaking", "Body Language & Etiquette", "Group Discussion Strategy", "E-mail Writing", "Resume Walkthrough Preparation"]
  },
  {
    id: "course-interview",
    name: "Comprehensive Interview Bootcamp",
    category: "interview",
    description: "Live mock drills with industry veterans. Personalized performance analysis.",
    duration: "4 Weeks",
    topics: ["Technical Mock Drills", "HR & Behavioral Cracking", "Star Methodology", "Salary Negotiation Hacks"]
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
      title: "Tentrapax | Get Placed in Top Companies",
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
            { id: "stat-1", label: "Students Placed", count: "5000+", icon: "Users", visible: true, order: 1 },
            { id: "stat-2", label: "Hiring Partners", count: "50+", icon: "Award", visible: true, order: 2 },
            { id: "stat-3", label: "Salary Hikes", count: "95%", icon: "TrendingUp", visible: true, order: 3 },
            { id: "stat-4", label: "Placement Rate", count: "100%", icon: "CheckCircle", visible: true, order: 4 }
          ]
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#071B4D",
          buttonColor: "#071B4D",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "0px",
          paddingY: "16",
          animation: "slide",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0"
        }
      },
      {
        id: "why-choose-us-1",
        type: "why-choose-us",
        title: "Why Choose Tentrapax?",
        subtitle: "Comprehensive training and hands-on guidance to accelerate your placement rate.",
        content: {
          cards: [
            { id: "wc-1", title: "Resume Building", desc: "Professional resume that gets you noticed by corporate Applicant Tracking Systems.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200", order: 1, visible: true },
            { id: "wc-2", title: "LinkedIn Profile", desc: "Optimize your profile to rank high in organic recruiter searches.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200", order: 2, visible: true },
            { id: "wc-3", title: "Aptitude Training", desc: "Quantitative, Logical, and Verbal training from basic to advanced levels.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200", order: 3, visible: true },
            { id: "wc-4", title: "Mock Interview", desc: "Personalized preparation rounds with veteran corporate technical interviewers.", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=200", order: 4, visible: true }
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
        id: "services-home-1",
        type: "services-home",
        title: "Our Services",
        subtitle: "Premium skill development courses designed for modern corporate standards.",
        content: {
          services: [
            { id: "sh-1", title: "Quantitative Aptitude", desc: "Comprehensive numeric aptitude training covering logical syllogisms, verbal and data interpretation.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300", visible: true },
            { id: "sh-2", title: "Java Development Bootcamp", desc: "Master core Java, object-oriented design, multi-threading, Spring Boot and enterprise frameworks.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=300", visible: true },
            { id: "sh-3", title: "Data Structures & DSA", desc: "Solve complex array, list, tree and graph problems with optimal runtime complexities.", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=300", visible: true }
          ]
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#475569",
          headingColor: "#071B4D",
          cardBackgroundColor: "#ffffff",
          borderColor: "#e2e8f0",
          borderRadius: "16px",
          paddingY: "16",
          animation: "slide"
        }
      },
      {
        id: "partners-1",
        type: "partners",
        title: "Our Hiring Partners",
        subtitle: "Direct hiring linkages with premium product & services firms.",
        content: {
          viewAllBtnText: "View All Companies",
          viewAllBtnLink: "#companies",
          selectedPartnerIds: [] // Empty means show all
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#071B4D",
          buttonColor: "#071B4D",
          buttonHoverColor: "#1e293b",
          buttonTextColor: "#ffffff",
          borderRadius: "0px",
          paddingY: "12",
          animation: "fade",
          cardBackgroundColor: "#ffffff",
          borderColor: "#cbd5e1"
        }
      },
      {
        id: "impact-1",
        type: "impact",
        title: "Success / Impact",
        subtitle: "Delivering real, measurable technical training achievements",
        content: {
          trained: "5000+",
          companies: "50+",
          courses: "12+",
          googleRating: "4.9 Stars"
        },
        design: {
          backgroundColor: "#071B4D",
          textColor: "#ffffff",
          headingColor: "#ffffff",
          borderRadius: "0px",
          paddingY: "16",
          animation: "zoom"
        }
      },
      {
        id: "testimonials-1",
        type: "testimonials",
        title: "Student Testimonials",
        subtitle: "Hear what our successful candidates say about their transformation journey.",
        content: {
          testimonials: [
            {
              id: "testi-1",
              name: "Abhishek Sharma",
              college: "SGSITS Indore",
              company: "Persistent Systems",
              package: "7.5 LPA",
              review: "The Java bootcamp and ATS resume guidance completely changed my perspective. I cleared the Persistent drive in my very first attempt!",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
            },
            {
              id: "testi-2",
              name: "Nisha Patel",
              college: "LNCT Bhopal",
              company: "Wipro",
              package: "6.5 LPA",
              review: "The mock interview panel with corporate mentors gave me so much confidence. Highly recommended to everyone looking for premium guidance.",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
            },
            {
              id: "testi-3",
              name: "Ravi Kumar",
              college: "UIT RGPV",
              company: "Cognizant",
              package: "5.5 LPA",
              review: "The quantitative aptitude and logical reasoning classes are top tier. They solved hundreds of past placement papers.",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
            }
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
          borderColor: "#e2e8f0"
        }
      },
      {
        id: "success-stories-1",
        type: "success-stories",
        title: "Latest Placed Students",
        subtitle: "Meet our stars who cracked dream MNC job offers this season.",
        content: {
          limit: 3,
          storiesMode: "auto",
          viewAllBtnText: "View All Placed Students",
          viewAllBtnLink: "#placed-students"
        },
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#071B4D",
          buttonColor: "#071B4D",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "16",
          animation: "slide",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#cbd5e1"
        }
      },
      {
        id: "courses-home-1",
        type: "courses-home",
        title: "Upcoming Courses",
        subtitle: "Join our industry-aligned upcoming training programs to elevate your profile.",
        content: {
          limit: 3
        },
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#071B4D",
          borderRadius: "0px",
          paddingY: "16",
          animation: "zoom"
        }
      },
      {
        id: "workshops-home-1",
        type: "workshops-home",
        title: "Upcoming Workshops",
        subtitle: "Hands-on masterclasses to learn job hacks from experts live.",
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
        id: "blogs-home-1",
        type: "blogs-home",
        title: "Latest Blogs & News",
        subtitle: "Actionable guides on corporate interviews, DSA preparation, and salary negotiation.",
        content: {},
        design: {
          backgroundColor: "#f8fafc",
          textColor: "#334155",
          headingColor: "#071B4D",
          borderRadius: "0px",
          paddingY: "16",
          animation: "slide"
        }
      },
      {
        id: "cta-banner-1",
        type: "cta-banner",
        title: "Ready to Kickstart Your Placement Preparation?",
        subtitle: "Join the most advanced career boot camp in MP. Direct linkages with recruiters, premium mock panels and active career counseling sessions.",
        content: {
          primaryBtnText: "Register for Free Demo Session",
          primaryBtnLink: "#contact",
          tagline: "No credit card required. Over 5000+ students already placed.",
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
      title: "About Us | Tentrapax Consultancy",
      description: "Learn about the mission, vision, and core journey of Tentrapax career development consultancy.",
      keywords: "consultancy founder, our story, Bhopal training centre"
    },
    sections: [
      {
        id: "about-main-1",
        type: "about-main",
        title: "About Tentrapax",
        content: {
          description: "Tentrapax is a career development and placement consultancy helping students to build skills, crack interviews and get placed in top companies. We bridge the gap between college education and industrial demands through high-touch mentoring and actual job resources.",
          founderName: "Founder & CEO",
          founderRole: "Leading Tentrapax to build real career bridges for students",
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
          visionTitle: "Our Vision",
          visionDesc: "To become India's most trusted and reliable career partner for students and leading corporate hiring organizations alike."
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
            { id: "m-1", year: "2018", title: "Started Journey", desc: "Laid the foundation of Tentrapax in Pune, mentoring our first batch of 50 students." },
            { id: "m-2", year: "2021", title: "Expanded to Bhopal", desc: "Opened our modern training center in Arera Colony, Bhopal, scaling our student base." },
            { id: "m-3", year: "2023", title: "Expanded to Indore", desc: "Launched Indore branch on Vijay Nagar Road to support students across Madhya Pradesh." },
            { id: "m-4", year: "2025+", title: "Expanding to More Cities", desc: "Enabling comprehensive LMS, digital classrooms, and expanding to tier-2 cities nationwide." }
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
      title: "Our Services | Tentrapax",
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
            { id: "s-1", title: "Resume Building", desc: "Professional resume editing with ATS optimizations that gets you shortlisted by HR." },
            { id: "s-2", title: "LinkedIn Profile", desc: "Organically optimize your profile visibility to rank high in recruiter searches." },
            { id: "s-3", title: "Aptitude Training", desc: "Rigorous daily quantitative, logical reasoning and verbal aptitude modules." },
            { id: "s-4", title: "Technical Training", desc: "Learn Java, Python, DSA, System Design and SQL from industrial developers." },
            { id: "s-5", title: "Mock Interview", desc: "Simulated stress interviews mimicking genuine corporate technical standards." },
            { id: "s-6", title: "Interview Preparation", desc: "Comprehensive behavioral preparation, body language training and STAR framework guidelines." },
            { id: "s-7", title: "Communication Skills", desc: "Overcome fear, polish English pitch, and excel in difficult group debates." },
            { id: "s-8", title: "Career Counselling", desc: "Personalized 1-on-1 feedback on choosing standard pathways or product vs service lines." },
            { id: "s-9", title: "Placement Assistance", desc: "Access exclusive off-campus and on-campus drive notifications from our 50+ list." },
            { id: "s-10", title: "Corporate Training", desc: "Custom corporate packages, training new recruits on custom enterprise software pipelines." },
            { id: "s-11", title: "LMS Access", desc: "Structured login access to assignments, video logs, class notes, and certificates 24/7." },
            { id: "s-12", title: "Certificate", desc: "Gain highly respected, industry-recognized certificates of achievement upon module completion." }
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
      title: "Our Placed Students | Tentrapax",
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
      title: "Our Hiring Partners | Tentrapax",
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
      title: "Courses We Offer | Tentrapax",
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
      title: "LMS Student Portal | Tentrapax",
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
          notificationText: "Reminder: Upcoming Live Class on Aptitude - Percentage begins in 15 minutes."
        },
        design: {
          backgroundColor: "#0f172a", // Slate Dark
          textColor: "#cbd5e1",
          headingColor: "#ffffff",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "16px",
          paddingY: "12",
          animation: "fade",
          cardBackgroundColor: "#1e293b",
          borderColor: "#334155"
        }
      }
    ]
  },
  {
    id: "campus-ambassador",
    title: "Campus Ambassador",
    slug: "/campus-ambassador",
    seo: {
      title: "Become a Campus Ambassador | Tentrapax",
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
          benefits: [
            "Official Achievement Certificate",
            "Direct Paid Internship Opportunity",
            "Referral Income on student registration",
            "Monthly Rewards & Tech Gadgets",
            "Priority interview placement slots",
            "Real Leadership & Event management experience",
            "Exclusive private training circles"
          ],
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
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
      title: "College Partnership | Tentrapax",
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
      title: "Our Workshops | Tentrapax",
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
      title: "Career & Placement Blog | Tentrapax",
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
      title: "Contact Us | Tentrapax Career Consultancy",
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
            { id: "of-1", name: "Bhopal Office", address: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016", phone: "+91 93000 12345", email: "bhopal@tentrapax.com" },
            { id: "of-2", name: "Indore Office", address: "456, Vijay Nagar, Indore, Madhya Pradesh - 452010", phone: "+91 93000 54321", email: "indore@tentrapax.com" }
          ],
          mapTitle: "Tentrapax Bhopal Office Location",
          formSubmitBtnText: "Send Message"
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
