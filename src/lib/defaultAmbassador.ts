import { CMSSection } from '../types';

export interface AmbassadorResponsibilityCard {
  id: string;
  step: string;
  title: string;
  desc: string;
  badgeText: string;
  icon: 'Megaphone' | 'Users' | 'MessageSquare' | 'Award' | 'GraduationCap' | 'Sparkles' | string;
}

export interface AmbassadorFormConfig {
  fullNamePlaceholder: string;
  collegeEmailPlaceholder: string;
  phonePlaceholder: string;
  collegeNamePlaceholder: string;
  courseDegreePlaceholder: string;
  academicYearOptions: string[];
  cityStatePlaceholder: string;
  motivationQuestion: string;
  motivationPlaceholder: string;
}

export interface AmbassadorSuccessConfig {
  title: string;
  desc: string;
}

export const DEFAULT_AMBASSADOR_SECTIONS: CMSSection[] = [
  {
    id: "ambassador-header",
    type: "ambassador-header",
    title: "Campus Ambassador Program",
    subtitle: "Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources.",
    content: {
      pillBadge: "STUDENT LEADERSHIP",
      breadcrumb: "Campus Ambassador"
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
    id: "ambassador-responsibilities",
    type: "ambassador-responsibilities",
    title: "Core Responsibilities & Impact",
    subtitle: "Empower your campus peers through direct corporate drive sync and student advocacy.",
    content: {
      cards: [
        {
          id: "resp-1",
          step: "01 / OUTREACH",
          title: "Share Drive Updates",
          desc: "Inform fellow students about upcoming campus drives, deadlines, and eligibility criteria.",
          badgeText: "Verified Notifications",
          icon: "Megaphone"
        },
        {
          id: "resp-2",
          step: "02 / UPSKILLING",
          title: "Coordinate Workshops",
          desc: "Help organize online masterclasses and coding bootcamps for your department.",
          badgeText: "Direct Faculty Sync",
          icon: "Users"
        },
        {
          id: "resp-3",
          step: "03 / LIAISON",
          title: "Student Community Voice",
          desc: "Connect student queries directly with the TantraPex placement team.",
          badgeText: "Fast Resolution",
          icon: "MessageSquare"
        }
      ] as AmbassadorResponsibilityCard[]
    },
    design: {
      backgroundColor: "#f7f9fd",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "12px",
      paddingY: "10",
      animation: "fade"
    }
  },
  {
    id: "ambassador-form",
    type: "ambassador-form",
    title: "Apply for Campus Ambassador",
    subtitle: "Fill out this form to join the TantraPex student leadership network. Applications are reviewed on a rolling basis.",
    content: {
      fields: {
        fullNamePlaceholder: "e.g. Rahul Sharma",
        collegeEmailPlaceholder: "rahul@college.edu.in",
        phonePlaceholder: "+91 98765 43210",
        collegeNamePlaceholder: "e.g. National Institute of Technology",
        courseDegreePlaceholder: "e.g. B.Tech (CSE), BCA, MCA, B.Sc",
        academicYearOptions: ["2nd Year", "3rd Year", "4th Year"],
        cityStatePlaceholder: "e.g. Pune, Maharashtra",
        motivationQuestion: "Why do you want to represent TantraPex in your college?",
        motivationPlaceholder: "Tell us briefly about your interest in helping peers get placed, your campus reach, or any student clubs you lead..."
      } as AmbassadorFormConfig,
      disclaimer: "Zero fees. 100% Free Placement Cell Initiative.",
      submitBtnText: "Submit Ambassador Application",
      successState: {
        title: "Application Received",
        desc: "Thank you for applying. The TantraPex Student Placement Relations team will review your profile and reach out via WhatsApp/email within 48 hours."
      } as AmbassadorSuccessConfig
    },
    design: {
      backgroundColor: "#ffffff",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "16px",
      paddingY: "14",
      animation: "fade"
    }
  }
];
