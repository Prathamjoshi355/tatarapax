import { CMSSection } from '../types';

export const DEFAULT_ABOUT_SECTIONS: CMSSection[] = [
  {
    id: "about-hero",
    type: "about-hero",
    title: "About TantraPex",
    subtitle: "TantraPex Technologies is India's first private placement cell. We help college students learn industry skills, clear aptitude tests, and get placed in leading technology companies — completely free of cost.",
    content: {
      badgeText: "WHO WE ARE",
      statusTag: "Cell Status & Policy",
      statusTitle: "100% Free For Students",
      statusDesc: "Zero registration charges. Zero security deposits. Pure merit-driven campus hiring."
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "8px",
      paddingY: "12",
      animation: "fade"
    }
  },
  {
    id: "about-mission-approach",
    type: "about-mission-approach",
    title: "Institutional Mandate & Approach",
    subtitle: "Bridging the gap between higher education and corporate placement pipelines.",
    content: {
      missionTag: "Institutional Mandate",
      missionTitle: "Our Mission",
      missionDesc: "Our mission is to make college campus hiring fair, transparent, and accessible to every student, no matter which college they study in.",
      missionFooter: "Democratizing Placement Infrastructure",
      approachTag: "Execution Pipeline",
      approachTitle: "Our Approach",
      approachDesc: "We bridge the gap between college education and corporate job requirements with practical training and verified hiring drives.",
      approachFooter: "Rigorous Skill-First Assessments"
    },
    design: {
      backgroundColor: "#f7f9fd",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "8px",
      paddingY: "12",
      animation: "fade"
    }
  },
  {
    id: "about-ecosystem",
    type: "about-ecosystem",
    title: "How We Support Students & Colleges",
    subtitle: "A synchronized tripartite framework aligning learners, degree colleges, and corporate talent recruiters.",
    content: {
      tag: "Ecosystem Architecture",
      pillars: [
        {
          id: "p-students",
          tag: "01 // ASPIRANTS",
          icon: "school",
          title: "For Students",
          desc: "Free access to verified drives, resume reviews, and interview prep.",
          features: [
            "Zero fees or platform commissions",
            "Technical & HR mock evaluation sessions",
            "Direct interview call tokens for verified drives"
          ],
          btnText: "View Open Drives",
          btnLink: "#/upcoming-drives"
        },
        {
          id: "p-colleges",
          tag: "02 // INSTITUTIONS",
          icon: "domain",
          title: "For Colleges",
          desc: "Institutional campus training, student mock assessments, and pooled corporate drives.",
          features: [
            "Placement cell co-pilot & automation",
            "Standardized cohort benchmarking tests",
            "Expanded tier-1 recruiter network access"
          ],
          btnText: "Campus Partnership Model",
          btnLink: "#/college-partnership"
        },
        {
          id: "p-companies",
          tag: "03 // RECRUITERS",
          icon: "apartment",
          title: "For Companies",
          desc: "Pre-screened, verified candidate batches ready for onboarding with zero hiring fees.",
          features: [
            "100% verified academic credentials",
            "Standardized skill assessment scores",
            "High joiner-ratio talent pipeline"
          ],
          btnText: "Hire Pre-screened Talent",
          btnLink: "#/companies"
        }
      ]
    },
    design: {
      backgroundColor: "#f2f4f8",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "8px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "about-team",
    type: "about-team",
    title: "Our Leadership & Team",
    subtitle: "Experienced Governance across tech hiring and engineering staffing.",
    content: {
      tag: "Experienced Governance",
      heading: "Our team consists of senior technical trainers, career counselors, and corporate talent acquisition leaders working together to empower young engineers across India.",
      description: "With over 35 cumulative years across tech hiring, curriculum design, and engineering staffing at leading software enterprises, we build standardized programs that eliminate arbitrary recruitment hurdles. We believe employment access should be based purely on verified aptitude and problem-solving skill, not regional boundaries or institutional tier labels.",
      teamImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGnBotQ4plh1jB4kWGqsakBM7rnHf8HjGwSDbxGJYWGorSdq3kOzzihI4IXSnyxBdp9LqYgrhKbiEPabVGo8e9cqNd8pb6jOwfgy1buIcahtdMLF2D3At-fIXmvbozq9NfokrRMeG4v_md5qaAga5YEjN5bHyZuyLRvPcrf_A_mOWWTuj5mUWpDJoai9jM4Edu5NcFo27NOV3ZuL2j3sfV0MpH6Zv7h-0A9bUt96Vfq-fRKA90m5_GBw",
      imageBadge: "TantraPex Advisory & Operations Cell",
      imageCaption: "Leadership / Team Representative — Committed to Candidate Success",
      stats: [
        { id: "s-1", value: "100%", label: "Free For Candidates" },
        { id: "s-2", value: "450+", label: "Colleges Reached" },
        { id: "s-3", value: "28,000+", label: "Students Evaluated" }
      ]
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "8px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "about-values",
    type: "about-values",
    title: "Our 5 Core Values",
    subtitle: "The non-negotiable institutional tenets that guide every assessment, student counseling session, and corporate partnership.",
    content: {
      tag: "Guiding Principles",
      values: [
        { id: "v-1", number: "01", title: "Candidate First", desc: "Students always come first; zero fees." },
        { id: "v-2", number: "02", title: "Corporate Trust", desc: "Only verified corporate drives." },
        { id: "v-3", number: "03", title: "Skill Before Placement", desc: "Quality preparation ensures success." },
        { id: "v-4", number: "04", title: "Full Transparency", desc: "No fake claims or hidden fees." },
        { id: "v-5", number: "05", title: "Long-Term Support", desc: "Helping candidates from prep to offer letter." }
      ]
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "8px",
      paddingY: "16",
      animation: "fade"
    }
  },
  {
    id: "about-cta",
    type: "about-cta",
    title: "Have questions or want to partner with us? Talk to our team today.",
    subtitle: "Whether you are a student preparing for campus recruitments, a training placement officer seeking industry drives, or a corporate talent lead hiring engineers.",
    content: {
      tag: "Immediate Institutional Access",
      primaryBtnText: "Contact Us",
      primaryBtnLink: "#/contact",
      secondaryBtnText: "Explore Drives",
      secondaryBtnLink: "#/upcoming-drives"
    },
    design: {
      backgroundColor: "#eceef2",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "8px",
      paddingY: "16",
      animation: "fade"
    }
  }
];
