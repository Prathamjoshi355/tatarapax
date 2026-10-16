import { CMSSection } from '../types';

export const DEFAULT_COLLEGES_SECTIONS: CMSSection[] = [
  {
    id: 'college-hero',
    type: 'college-hero',
    title: 'Partner with TantraPex',
    subtitle: 'Collaborate with TantraPex Technologies to bring corporate training, aptitude assessments, and verified placement drives to your campus.',
    content: {
      badgeText: 'FOR ENGINEERING COLLEGES & INSTITUTIONS',
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'College Partnerships',
      chips: [
        {
          id: 'chip-1',
          value: '120+',
          label: 'Institutions Onboarded',
          icon: 'School'
        },
        {
          id: 'chip-2',
          value: '100% Free',
          label: 'For All College Students',
          icon: 'CheckCircle'
        }
      ]
    },
    design: {
      backgroundColor: '#f2f4f8',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '16',
      animation: 'fade'
    }
  },
  {
    id: 'college-benefits',
    type: 'college-benefits',
    title: 'Structured Campus Readiness Infrastructure',
    subtitle: 'Institutional engagement models designed for accredited engineering colleges and universities.',
    content: {
      eyebrow: 'CORE INSTITUTIONAL VALUE',
      pillars: [
        {
          id: 'cpillar-1',
          pillarNumber: 'Pillar 01',
          title: 'Campus Recruitment Training',
          description: 'Structured aptitude, programming, and soft skill bootcamps conducted by industry trainers.',
          bottomTag: 'Technical & Quant Ready',
          icon: 'Terminal'
        },
        {
          id: 'cpillar-2',
          pillarNumber: 'Pillar 02',
          title: 'Proctored Student Diagnostics',
          description: 'Assess student readiness with automated test reports and company-specific cut-off benchmarking.',
          bottomTag: 'Cut-off Analytics Included',
          icon: 'BarChart3'
        },
        {
          id: 'cpillar-3',
          pillarNumber: 'Pillar 03',
          title: 'Pooled Corporate Drives',
          description: 'Connect your eligible final-year students with pooled recruitment drives from top tech enterprises.',
          bottomTag: 'Tier-1 & Tier-2 Tech Access',
          icon: 'Building2'
        }
      ]
    },
    design: {
      backgroundColor: '#f7f9fd',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '20',
      animation: 'fade'
    }
  },
  {
    id: 'college-process',
    type: 'college-process',
    title: 'How the College Collaboration Works',
    subtitle: 'A transparent, step-by-step engagement process designed to quickly integrate with your academic calendar.',
    content: {
      eyebrow: 'INSTITUTIONAL ROADMAP',
      steps: [
        {
          stepNumber: '1',
          title: 'Submit College Inquiry',
          description: 'Fill out the official partnership form with student batch capacity and training interests.',
          bottomTag: 'Initial Consultation',
          icon: 'FileText',
          isHighlighted: false
        },
        {
          stepNumber: '2',
          title: 'Discuss Batch Requirements',
          description: 'Our academic desk meets with your TPO team to review curriculum gaps and branch eligibility.',
          bottomTag: 'Gap Analysis',
          icon: 'Sliders',
          isHighlighted: false
        },
        {
          stepNumber: '3',
          title: 'Sign Institutional MoU',
          description: 'Formalize the zero-cost placement agreement establishing drive access protocols.',
          bottomTag: 'Official Protocol',
          icon: 'FileCheck',
          isHighlighted: false
        },
        {
          stepNumber: '4',
          title: 'Launch Training & Drives',
          description: 'Begin on-campus diagnostic assessments and register student profiles for pooled corporate drives.',
          bottomTag: 'Placement Execution',
          icon: 'Rocket',
          isHighlighted: true
        }
      ]
    },
    design: {
      backgroundColor: '#f2f4f8',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '20',
      animation: 'fade'
    }
  },
  {
    id: 'college-enquiry',
    type: 'college-enquiry',
    title: 'Why 120+ Engineering Colleges Partner with TantraPex',
    subtitle: 'We bridge the gap between classroom theory and enterprise expectations with zero operational burden on your training cell.',
    content: {
      eyebrow: 'DIRECT PARTNERSHIP DESK',
      features: [
        {
          id: 'feat-1',
          title: 'Zero Platform Listing Fee',
          description: 'Institutions pay zero fees to join our pooled campus network. Your placement records remain fully college-branded.',
          icon: 'BadgePercent'
        },
        {
          id: 'feat-2',
          title: 'Strict Recruiter Verification',
          description: 'Every enterprise hiring on TantraPex undergoes statutory checks. We guarantee legitimate JD offers and transparent pay structures.',
          icon: 'ShieldCheck'
        },
        {
          id: 'feat-3',
          title: 'Dedicated Institutional Relationship Desk',
          description: 'Your Training and Placement Officer (TPO) receives a dedicated account coordinator for drive schedules and live candidate tracking.',
          icon: 'Headphones'
        }
      ],
      contact: {
        deskTitle: 'Institutional Support Desk',
        email: 'partnerships@tantrapex.com',
        phone: '+91 (080) 4128-9900',
        timing: 'Mon – Fri: 09:30 AM – 06:30 PM IST'
      },
      form: {
        title: 'College Partnership Enquiry',
        subtitle: 'Submit your college information below. Our institutional coordinator will respond within 24 business hours.',
        buttonText: 'Submit College Partnership Enquiry',
        successTitle: 'Partnership Enquiry Received',
        successDesc: 'Thank you. Our institutional liaison desk will contact the designated TPO within 24 business hours.'
      }
    },
    design: {
      backgroundColor: '#f7f9fd',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '20',
      animation: 'fade'
    }
  },
  {
    id: 'college-statutory',
    type: 'college-statutory',
    title: 'Statutory Note:',
    subtitle: 'TantraPex Technologies works directly with approved college placement cells and TPOs. No commercial fees are charged to students for applying to drives.',
    content: {
      statutoryLabel: 'Statutory Note:',
      statutoryText: 'TantraPex Technologies works directly with approved college placement cells and TPOs. No commercial fees are charged to students for applying to drives.'
    },
    design: {
      backgroundColor: '#e6e8ec',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      borderRadius: '0px',
      paddingY: '8',
      animation: 'fade'
    }
  }
];
