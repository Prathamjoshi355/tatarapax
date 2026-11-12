import { CMSSection, HiringPartner } from '../types';

export const DEFAULT_HIRING_PARTNERS_LIST: HiringPartner[] = [];

export const DEFAULT_PARTNERS_SECTIONS: CMSSection[] = [
  {
    id: 'partners-hero',
    type: 'partners-hero',
    title: 'Placement Partners',
    subtitle: 'Top technology services, product engineering, and enterprise companies that participate in campus and pooled placement drives.',
    content: {
      badgeText: 'CORPORATE RECRUITMENT DIRECTORY',
      verifiedPartnersCount: '22',
      verifiedPartnersLabel: 'Verified Partners',
      activeDrivesCount: '8',
      activeDrivesLabel: 'Drives Active Today',
      searchPlaceholder: 'Search company by name...',
      categories: [
        { id: 'all', label: 'All Companies' },
        { id: 'it-services', label: 'IT Services' },
        { id: 'product-enterprise', label: 'Product & Enterprise' },
        { id: 'core-engineering', label: 'Core Engineering' }
      ]
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      buttonColor: '#80d64b',
      buttonHoverColor: '#6fc43a',
      buttonTextColor: '#092100',
      borderRadius: '12px',
      paddingY: '12',
      animation: 'fade',
      cardBackgroundColor: '#ffffff',
      borderColor: '#e0e2e6'
    }
  },
  {
    id: 'partners-notice',
    type: 'partners-notice',
    title: 'Corporate Transparency Note',
    subtitle: '',
    content: {
      noticeText: 'Company names and logos represent organizations that conduct recruitment drives through our institutional network. Display of a company logo does not guarantee current job openings or hiring outcomes.'
    },
    design: {
      backgroundColor: '#f2f4f8',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      buttonColor: '#80d64b',
      buttonHoverColor: '#6fc43a',
      buttonTextColor: '#092100',
      borderRadius: '12px',
      paddingY: '6',
      animation: 'fade',
      cardBackgroundColor: '#ffffff',
      borderColor: '#e0e2e6'
    }
  },
  {
    id: 'partners-process',
    type: 'partners-process',
    title: 'How Companies Hire Through TantraPex',
    subtitle: 'Our institutional placement model delivers verified candidates directly to enterprise hiring teams with maximum speed and zero friction.',
    content: {
      eyebrow: 'RECRUITMENT PROCESS',
      steps: [
        {
          id: 'step-1',
          number: '1',
          icon: 'group_add',
          title: 'Direct Talent Access',
          description: 'Access pre-verified candidate profiles from 100+ partner engineering colleges across India with zero recruiter access fees.',
          metricLabel: 'Placement Fee',
          metricValue: '100% Free Model'
        },
        {
          id: 'step-2',
          number: '2',
          icon: 'fact_check',
          title: 'Standardized Online Screening',
          description: 'Save hundreds of engineering hours with automated aptitude assessments, proctored coding rounds, and standardized competency reports.',
          metricLabel: 'Proctoring',
          metricValue: 'Automated & Audited'
        },
        {
          id: 'step-3',
          number: '3',
          icon: 'bolt',
          title: 'Fast Onboarding Support',
          description: 'Complete offer letters, document verification, and joining formalities in days with our dedicated institutional placement coordinators.',
          metricLabel: 'Turnaround Time',
          metricValue: '< 7 Working Days'
        }
      ]
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      buttonColor: '#80d64b',
      buttonHoverColor: '#6fc43a',
      buttonTextColor: '#092100',
      borderRadius: '12px',
      paddingY: '16',
      animation: 'fade',
      cardBackgroundColor: '#f7f9fd',
      borderColor: '#e0e2e6'
    }
  },
  {
    id: 'partners-cta',
    type: 'partners-cta',
    title: 'Are you a corporate recruiter looking to hire fresh talent?',
    subtitle: 'Partner with TantraPex to organize dedicated campus drives, pooled virtual evaluations, and direct hiring for freshers with no placement coordination cost.',
    content: {
      eyebrow: 'FOR HR LEADERS & TALENT ACQUISITION',
      primaryBtnText: 'Connect with Placement Team',
      primaryBtnLink: '#/contact',
      secondaryBtnText: 'Download Brochure',
      brochureUrl: 'https://tantrapex.com/brochure.pdf'
    },
    design: {
      backgroundColor: '#191c1f',
      textColor: '#f7f9fd',
      headingColor: '#ffffff',
      buttonColor: '#80d64b',
      buttonHoverColor: '#6fc43a',
      buttonTextColor: '#092100',
      borderRadius: '16px',
      paddingY: '16',
      animation: 'fade',
      cardBackgroundColor: '#2d3134',
      borderColor: '#404a39'
    }
  }
];
