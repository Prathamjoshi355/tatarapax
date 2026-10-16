import { CMSPage, CMSSection } from '../types';
import { DEFAULT_ABOUT_SECTIONS } from './defaultAbout';
import { DEFAULT_BLOG_SECTIONS } from './defaultBlogs';
import { DEFAULT_LMS_SECTIONS } from './defaultLms';
import { DEFAULT_SERVICES_SECTIONS } from './defaultServices';
import { DEFAULT_COLLEGES_SECTIONS } from './defaultColleges';
import { DEFAULT_PLACED_STUDENTS_SECTIONS } from './defaultPlacedStudents';
import { DEFAULT_PARTNERS_SECTIONS } from './defaultPartners';
import { DEFAULT_UPCOMING_DRIVES_SECTIONS } from './defaultDrives';
import { DEFAULT_PRICING_SECTIONS } from './defaultPricing';
import { DEFAULT_AMBASSADOR_SECTIONS } from './defaultAmbassador';

export const DEFAULT_CONTACT_SECTIONS: CMSSection[] = [
  {
    id: 'sec-contact-split',
    type: 'contact-split',
    title: 'Get In Touch With Our Placement Cell',
    subtitle: 'Have questions about campus recruitment drives, student training modules, or institutional MoUs? Our team is available to assist.',
    content: {
      offices: [
        { id: "of-1", name: "Corporate HQ - Bengaluru", address: "Institutional Placement Tower, Outer Ring Road, Bengaluru, Karnataka - 560103" },
        { id: "of-2", name: "Central Placement Desk", address: "123, Arera Colony, Bhopal, Madhya Pradesh - 462016" }
      ],
      supportEmail: "contact@tantrapex.com",
      supportPhone: "+91 (080) 4920-8000"
    },
    design: {
      backgroundColor: "#f8fafc",
      textColor: "#334155",
      headingColor: "#0f172a",
      buttonColor: "#80d64b",
      buttonTextColor: "#092100",
      borderRadius: "12px",
      paddingY: "12",
      animation: "fade" as const
    }
  }
];

export const CANONICAL_PAGES_LIST: CMSPage[] = [
  {
    id: 'home',
    title: 'Home',
    slug: '/',
    seo: {
      title: "TantraPex Technologies | India's First Private Placement Cell",
      description: "TantraPex Technologies is India's First Private Placement Cell connecting engineering and university students with verified corporate campus recruitment drives.",
      keywords: "placement cell, campus drives, engineering jobs, fresher hiring, private placement cell"
    },
    sections: []
  },
  {
    id: 'about',
    title: 'About Us',
    slug: '/about',
    seo: {
      title: 'About Us | TantraPex Technologies',
      description: "Learn about TantraPex Technologies, India's First Private Placement Cell connecting students with leading enterprise recruiters with 100% free access.",
      keywords: 'about tantrapex, private placement cell, student recruitment, campus placements'
    },
    sections: DEFAULT_ABOUT_SECTIONS
  },
  {
    id: 'upcoming-drives',
    title: 'Upcoming Placement Opportunities',
    slug: '/upcoming-drives',
    seo: {
      title: 'Upcoming Placement Opportunities | TantraPex',
      description: 'Explore verified campus and pooled corporate placement drives with zero intermediary fees.',
      keywords: 'placement drives, campus hiring, LTTS, Capgemini, Cognizant, Zoho, AWS, KPIT, engineering jobs'
    },
    sections: DEFAULT_UPCOMING_DRIVES_SECTIONS
  },
  {
    id: 'pricing',
    title: 'Pricing & Programs',
    slug: '/pricing',
    seo: {
      title: 'Pricing & Programs | TantraPex Technologies',
      description: 'Simple, affordable training programs. Remember: Applying to our placement drives is always 100% free.',
      keywords: 'pricing, placement training fees, career pro plan, campus mou, fresher training cost'
    },
    sections: DEFAULT_PRICING_SECTIONS
  },
  {
    id: 'contact',
    title: 'Contact Us',
    slug: '/contact',
    seo: {
      title: 'Contact Us | TantraPex Technologies',
      description: 'Contact TantraPex placement coordinators, corporate recruitment team, and student grievance desk.',
      keywords: 'contact tantrapex, placement support, student grievance, corporate hiring contact'
    },
    sections: DEFAULT_CONTACT_SECTIONS
  },
  {
    id: 'campus-ambassador',
    title: 'Campus Ambassador Program',
    slug: '/campus-ambassador',
    seo: {
      title: 'Campus Ambassador Program | TantraPex Technologies',
      description: 'Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources.',
      keywords: 'campus ambassador, student leadership, college placement cell, student coordinator, engineering campus rep'
    },
    sections: DEFAULT_AMBASSADOR_SECTIONS
  },
  {
    id: 'lms',
    title: 'LMS / Learning Resources',
    slug: '/lms',
    seo: {
      title: 'LMS & Learning Resources | TantraPex × UG Skill',
      description: 'Structured coding sandbox, placement training, aptitude mock tests, and faculty guidance powered by TantraPex and UG Skill.',
      keywords: 'lms, coding sandbox, campus placement training, aptitude tests, engineering courses'
    },
    sections: DEFAULT_LMS_SECTIONS
  },
  {
    id: 'services',
    title: 'Our Services',
    slug: '/services',
    seo: {
      title: 'Our Services | TantraPex Technologies',
      description: 'Explore campus placement readiness, mock tests, corporate bootcamps, and talent acquisition services.',
      keywords: 'placement services, campus CRT, technical bootcamps, talent acquisition'
    },
    sections: DEFAULT_SERVICES_SECTIONS
  },
  {
    id: 'blog',
    title: 'Blogs & Insights',
    slug: '/blog',
    seo: {
      title: 'Blogs & Career Insights | TantraPex Technologies',
      description: 'Read the latest placement strategies, engineering career advice, aptitude interview tips, and tech hiring news.',
      keywords: 'placement blog, career insights, interview tips, fresher hiring advice'
    },
    sections: DEFAULT_BLOG_SECTIONS
  },
  {
    id: 'college-partnership',
    title: 'College Partnerships',
    slug: '/college-partnership',
    seo: {
      title: 'College Partnerships | TantraPex Technologies',
      description: 'Partner with TantraPex to elevate campus placement ratios with pooled corporate recruitment drives and student CRT.',
      keywords: 'college partnership, university placement MoU, campus recruiter tie-up, TPO partnership'
    },
    sections: DEFAULT_COLLEGES_SECTIONS
  },
  {
    id: 'placed-students',
    title: 'Placed Students',
    slug: '/placed-students',
    seo: {
      title: 'Placed Students Registry | TantraPex Technologies',
      description: 'Browse verified candidate placement registry with candidate names, packages, company designations, and proofs.',
      keywords: 'placed students, placement records, tantrapex alumni, salary packages'
    },
    sections: DEFAULT_PLACED_STUDENTS_SECTIONS
  },
  {
    id: 'companies',
    title: 'Placement Partners',
    slug: '/companies',
    seo: {
      title: 'Placement Partners & Enterprise Recruiters | TantraPex',
      description: 'Discover the enterprise recruiters, startups, and IT giants partnering with TantraPex for verified campus talent.',
      keywords: 'placement partners, hiring partners, enterprise recruiters, tech companies hiring'
    },
    sections: DEFAULT_PARTNERS_SECTIONS
  }
];

export const CANONICAL_PAGES_MAP = new Map<string, CMSPage>(
  CANONICAL_PAGES_LIST.map((page) => [page.id, page])
);
