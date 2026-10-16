import { CMSSection } from '../types';

export const DEFAULT_LMS_SECTIONS: CMSSection[] = [
  {
    id: "lms-hero",
    type: "lms-hero",
    title: "TantraPex × UG Skill",
    subtitle: "TantraPex Technologies collaborates with UG Skill (a learning product associated with NexisparkX) to provide structured learning, coding practice, and placement training.",
    content: {
      badgeText: "Learning, Training & Placement Collaboration",
      refinedBadge: "UG Skill Integrated",
      heroImage: "https://res.cloudinary.com/dhy9pmo8s/image/upload/v1792099216/Tantrapex/vgqsc91t2xxo6zl68bnl.jpg"
    },
    design: {
      backgroundColor: "#f2f4f8",
      textColor: "#404a39",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "lms-pillars",
    type: "lms-pillars",
    title: "Four Core Learning Pillars",
    subtitle: "Engineered to systematically advance technical capability from conceptual understanding to verified recruiter readiness.",
    content: {
      eyebrow: "Modular Architecture",
      pillars: [
        {
          id: "p1",
          num: "Pillar 01",
          icon: "menu_book",
          title: "Learning Resources",
          desc: "Self-paced video lessons and downloadable study notes for all major engineering subjects.",
          footerTag: "Curated Syllabi",
          footerIcon: "verified"
        },
        {
          id: "p2",
          num: "Pillar 02",
          icon: "terminal",
          title: "Coding & Technical Practice",
          desc: "In-browser coding sandbox with 500+ practice problems in C++, Java, and Python.",
          footerTag: "Auto-Evaluation",
          footerIcon: "code"
        },
        {
          id: "p3",
          num: "Pillar 03",
          icon: "quiz",
          title: "Aptitude & Reasoning Tests",
          desc: "Topic-wise mock tests with instant scoring and detailed step-by-step solutions.",
          footerTag: "Percentile Rank",
          footerIcon: "insights"
        },
        {
          id: "p4",
          num: "Pillar 04",
          icon: "badge",
          title: "Interview Preparation",
          desc: "Company-specific interview guides, technical quizzes, and HR question banks.",
          footerTag: "Recruiter Bank",
          footerIcon: "psychology"
        }
      ],
      sandboxBanner: {
        label: "Active Compiler Environments:",
        languages: "C++20, OpenJDK 17, Python 3.11, JavaScript (Node runtime)",
        badgeText: "Zero Local Installation Required"
      }
    },
    design: {
      backgroundColor: "#f7f9fd",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "20",
      animation: "fade"
    }
  },
  {
    id: "lms-faculty",
    type: "lms-faculty",
    title: "Meet Our Training Faculty",
    subtitle: "Learn directly from experienced educators and technical mentors.",
    content: {
      badgeText: "Instructors",
      verificationBadge: "Verified Academic Credentials",
      facultyList: [
        {
          id: "fac-1",
          name: "Senior Technical Mentor",
          role: "Coding & Data Structures Faculty",
          subRole: "Algorithms, Java, and Problem Solving",
          badge: "Schematic Card",
          bio: "10+ years of experience training engineering graduates for top-tier software company technical interviews.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
          benchmarks: [
            { label: "Focus", value: "DSA / LeetCode" },
            { label: "Cohorts", value: "45+ Batches" },
            { label: "Rating", value: "4.9 / 5.0" }
          ],
          primaryTrack: "Primary Track: Backend & Algorithms",
          actionText: "Live Office Hours",
          actionLink: "#/contact"
        },
        {
          id: "fac-2",
          name: "Placement Aptitude Specialist",
          role: "Quantitative & Logical Reasoning Faculty",
          subRole: "Aptitude Benchmarking & Speed Mathematics",
          badge: "Schematic Card",
          bio: "Specialist in company-specific screening assessments, logical puzzles, and corporate test patterns.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
          benchmarks: [
            { label: "Focus", value: "Speed Maths / DI" },
            { label: "Assessments", value: "200+ Test Sets" },
            { label: "Clearance", value: "92% Mock Pass" }
          ],
          primaryTrack: "Primary Track: Screening Clearance",
          actionText: "Live Office Hours",
          actionLink: "#/contact"
        }
      ]
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "20",
      animation: "fade"
    }
  },
  {
    id: "lms-journey",
    type: "lms-journey",
    title: "Learning-to-Placement Journey",
    subtitle: "A structured 5-stage progression model ensuring candidate eligibility prior to on-campus and virtual hiring drives.",
    content: {
      eyebrow: "Step-By-Step Readiness",
      stages: [
        {
          id: "st-1",
          num: "1",
          stageTag: "Stage 01",
          title: "Learn Fundamentals",
          desc: "Review syllabus modules, core engineering videos, and concept cheat sheets.",
          checkTag: "Complete Syllabi"
        },
        {
          id: "st-2",
          num: "2",
          stageTag: "Stage 02",
          title: "Practise in Sandbox",
          desc: "Solve algorithmic challenges in browser across C++, Java, or Python.",
          checkTag: "500+ Code Problems"
        },
        {
          id: "st-3",
          num: "3",
          stageTag: "Stage 03",
          title: "Take Mock Assessments",
          desc: "Simulate actual placement tests with timed aptitude and technical MCQs.",
          checkTag: "Real Test Timing"
        },
        {
          id: "st-4",
          num: "4",
          stageTag: "Stage 04",
          title: "Attend Live Doubts",
          desc: "Resolve sticking points with senior mentors during scheduled office hours.",
          checkTag: "Faculty Clarification"
        },
        {
          id: "st-5",
          num: "5",
          stageTag: "Stage 05",
          title: "Qualify for Placement Drives",
          desc: "Direct resume routing to partner companies based on verified platform benchmark scores.",
          checkTag: "Recruiter Dispatch",
          isHighlight: true
        }
      ],
      metricFooter: {
        title: "Continuous Benchmarking Engine",
        desc: "Students completing Stage 3 achieve an 84% shortlist rate in TantraPex drives.",
        linkText: "View Current Screening Thresholds",
        linkUrl: "#/upcoming-drives"
      }
    },
    design: {
      backgroundColor: "#f7f9fd",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "20",
      animation: "fade"
    }
  },
  {
    id: "lms-collaboration",
    type: "lms-collaboration",
    title: "Institutional Division of Responsibilities",
    subtitle: "TantraPex Technologies and UG Skill work together to make placement preparation affordable and accessible to every student. UG Skill powers the learning management software, while TantraPex coordinates placement drives with hiring companies.",
    content: {
      badgeText: "Transparent Partnership Framework",
      card1: {
        title: "UG Skill (NexisparkX)",
        desc: "Powers the LMS engine, cloud coding sandboxes, aptitude item banks, and self-paced video hosting."
      },
      card2: {
        title: "TantraPex Technologies",
        desc: "Operates India's first private placement cell, company outreach, drive scheduling, and student shortlisting."
      },
      governanceStandard: {
        title: "Governance Standard",
        bullets: [
          "Zero hidden platform licensing fees for core drives",
          "Centralized placement performance tracking",
          "Recruiter-verified code benchmark logs",
          "Dedicated college cell institutional login"
        ],
        entityNote: "Affiliated entity: NexisparkX"
      }
    },
    design: {
      backgroundColor: "#f2f4f8",
      textColor: "#191c1f",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "lms-cta",
    type: "lms-cta",
    title: "Ready to explore learning resources and start preparing?",
    subtitle: "Join hundreds of engineering colleges utilizing the TantraPex and UG Skill ecosystem for verified placement outcomes.",
    content: {
      tag: "Structured Career Readiness",
      primaryBtnText: "Explore Career Pro Plan",
      primaryBtnLink: "#/pricing",
      secondaryBtnText: "View Upcoming Drives",
      secondaryBtnLink: "#/upcoming-drives"
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#eceef2",
      headingColor: "#ffffff",
      borderRadius: "12px",
      paddingY: "20",
      animation: "fade"
    }
  }
];
