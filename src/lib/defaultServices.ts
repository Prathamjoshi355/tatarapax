import { CMSSection } from '../types';

export const DEFAULT_SERVICES_SECTIONS: CMSSection[] = [
  {
    id: 'services-hero',
    type: 'services-hero',
    title: 'Career Preparation & Placement Support Services',
    subtitle: 'We offer complete training and placement support to help you build confidence, master technical skills, and clear company interviews.',
    content: {
      badgeText: 'WHAT WE OFFER',
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Our Services',
      telemetry: {
        standardLabel: 'Student Impact Standard',
        isoBadge: 'ISO 9001:2015',
        stats: [
          {
            value: '100% Free',
            label: 'Campus Placement Access'
          },
          {
            value: '450+',
            label: 'Hiring Corporate Partners'
          }
        ]
      }
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '16',
      animation: 'fade'
    }
  },
  {
    id: 'services-spotlight',
    type: 'services-spotlight',
    title: 'Structured from campus benchmark to final offer letter',
    subtitle: 'Our 12 service pillars eliminate guesswork. Students master each screening parameter through standardized evaluations, live corporate mentorship, and audited skill rubrics.',
    content: {
      eyebrow: 'ENGINEERED FOR EMPLOYABILITY',
      checkpoints: [
        'Audited ATS Formats',
        'Real-world Code Labs'
      ],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM6uN0oQY4yvtVPuxP0VGkbxEKyoAtuYv_sAsENmliqtqUO-8pyJWjhhOWoZAplS77kHxJkq1ATbUUXxjvtku0bDAdXIvAiUUK3v7Mw_uCcWIvi7LXeL94KUnQ4GFeAeXSjJgFjh8vlFjQsS62eC08WK5xCD-TWy69bUR_hOuSWrNfxvJw-PrfxuWH7lYlUeWHIHvNaXu1Il7aYlGVtK24n-9h-t6NaFUfyIeTBv9i8ARB8H_30sslOQ',
      imageAlt: 'A focused group of engineering students inside a bright contemporary laboratory collaborating across code terminals',
      engineBadgeText: 'TantraPex Assessment Engine V3.4 Active',
      benchmarkText: 'Real-Time Recruiter Benchmarks'
    },
    design: {
      backgroundColor: '#eceef2',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '12',
      animation: 'slide'
    }
  },
  {
    id: 'services-pillars',
    type: 'services-pillars',
    title: '12 Placement Preparation Modules',
    subtitle: 'Explore each track to see how we transform college graduates into hire-ready engineering and business talent.',
    content: {
      eyebrow: 'SYSTEMATIC CURRICULUM',
      pillars: [
        {
          id: 'pillar-1',
          pillarNumber: 'Pillar 01',
          title: 'Resume Building',
          description: 'Create an ATS-friendly resume that highlights your projects, skills, and internships clearly.',
          format: '1-on-1 Review',
          icon: 'FileText',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-2',
          pillarNumber: 'Pillar 02',
          title: 'LinkedIn Optimization',
          description: 'Set up a professional profile that attracts corporate recruiters and hiring managers.',
          format: 'Audit & Polish',
          icon: 'Share2',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-3',
          pillarNumber: 'Pillar 03',
          title: 'Aptitude Training',
          description: 'Master quantitative aptitude, logical reasoning, and verbal ability with practice tests.',
          format: '50+ Mock Tests',
          icon: 'Calculator',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-4',
          pillarNumber: 'Pillar 04',
          title: 'Technical Training',
          description: 'Learn full-stack programming, core Java, Python, and data structures from industry experts.',
          format: 'Hands-on Labs',
          icon: 'Terminal',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-5',
          pillarNumber: 'Pillar 05',
          title: 'Mock Interviews',
          description: 'Practice one-on-one technical and HR interviews with detailed feedback.',
          format: 'Live Video Panels',
          icon: 'Mic',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-6',
          pillarNumber: 'Pillar 06',
          title: 'Interview Preparation',
          description: 'Understand company-specific question patterns and behavioral interview rounds.',
          format: 'Case Analysis',
          icon: 'Brain',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-7',
          pillarNumber: 'Pillar 07',
          title: 'Communication Skills',
          description: 'Improve your spoken English, group discussion skills, and workplace communication.',
          format: 'GD Simulations',
          icon: 'MessageSquare',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-8',
          pillarNumber: 'Pillar 08',
          title: 'Career Counseling',
          description: 'Get personalized advice on career paths, technology domains, and job roles.',
          format: '1-on-1 Advisory',
          icon: 'Compass',
          linkText: 'Learn More',
          linkUrl: '#/contact'
        },
        {
          id: 'pillar-9',
          pillarNumber: 'Pillar 09',
          title: 'Placement Assistance',
          description: 'Direct access to verified on-campus and pooled recruitment drives across India.',
          format: 'Drive Invitations',
          icon: 'Briefcase',
          linkText: 'Learn More',
          linkUrl: '#/upcoming-drives'
        },
        {
          id: 'pillar-10',
          pillarNumber: 'Pillar 10',
          title: 'Corporate Training',
          description: 'Specialized programs designed to match specific hiring company requirements.',
          format: 'Client Syllabi',
          icon: 'Building2',
          linkText: 'Learn More',
          linkUrl: '#/college-partnership'
        },
        {
          id: 'pillar-11',
          pillarNumber: 'Pillar 11',
          title: 'LMS / Learning Resources',
          description: 'Access self-paced video modules, code practice sandboxes, and study guides anytime.',
          format: '24/7 Portal Access',
          icon: 'BookOpen',
          linkText: 'Learn More',
          linkUrl: '#/lms'
        },
        {
          id: 'pillar-12',
          pillarNumber: 'Pillar 12',
          title: 'Skill Certifications',
          description: 'Earn recognized course completion certificates after clearing skill assessments.',
          format: 'Verifiable Badges',
          icon: 'Award',
          linkText: 'Learn More',
          linkUrl: '#/contact'
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
    id: 'services-process',
    type: 'services-process',
    title: 'How It Works',
    subtitle: 'A four-step linear workflow engineered to take any ambitious college student from foundational review to a corporate appointment letter.',
    content: {
      eyebrow: 'CLEAR CANDIDATE ROADMAP',
      steps: [
        {
          stepNumber: '1',
          title: 'Enroll in Training',
          description: 'Register for your campus-recommended batch or choose customized self-paced learning modules.',
          stageLabel: 'Stage 1 Initiation',
          icon: 'GraduationCap',
          isHighlighted: false
        },
        {
          stepNumber: '2',
          title: 'Practice & Mock Tests',
          description: 'Solve timed aptitude questions, debug code in sandboxes, and take 1-on-1 technical mock drills.',
          stageLabel: 'Stage 2 Validation',
          icon: 'HelpCircle',
          isHighlighted: false
        },
        {
          stepNumber: '3',
          title: 'Apply to Verified Drives',
          description: 'Get direct placement notifications and submit your pre-verified credentials to corporate drives.',
          stageLabel: 'Stage 3 Matching',
          icon: 'Send',
          isHighlighted: false
        },
        {
          stepNumber: '4',
          title: 'Get Hired',
          description: 'Clear corporate interview rounds with confidence, negotiate your terms, and secure your offer letter.',
          stageLabel: 'Stage 4 Final Selection',
          icon: 'CheckCircle2',
          isHighlighted: true
        }
      ],
      tracker: {
        title: 'Fast-Track Readiness Window',
        subtitle: 'Average duration from Day 1 assessment to first shortlisted drive: 45 Days',
        buttonText: 'Check Workshop Schedule',
        buttonUrl: '#/workshops'
      }
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '20',
      animation: 'fade'
    }
  },
  {
    id: 'services-proof',
    type: 'services-proof',
    title: 'On-Ground Campus Presence & Mentorship Proof',
    subtitle: 'Real photographs from live bootcamps and corporate evaluation panels across India.',
    content: {
      cards: [
        {
          id: 'proof-1',
          tag: 'CAMPUS ENGAGEMENT',
          title: 'Institutional Placement Bootcamps',
          description: 'Conducted on-ground across 120+ partner engineering colleges in Tier 1 and Tier 2 cities.',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx6m_kM5466JAk7y_mx3bYFsGTS0Sb3nxVMbL_CCC4CKF6afI1ZstWYygJC-DndQ-a1WdJmpEX9SF0q8skcmSKluXFBuRS38kSwkUXddQTgux57CFKndPDbrlS1T5iCu33mKoBPwEXdIoCyo05zdbL1akTOgX2UTSu3a1FA0mxsyIdzzX_zYK0NTaNYDOT02wds496EEMoHXeXfM8SW4y0vN898QcQXTQDUvqTTkWZ9OieTM9xDQVdgQ'
        },
        {
          id: 'proof-2',
          tag: 'INDIVIDUALIZED PREPARATION',
          title: 'Direct Feedback From Hiring Leads',
          description: 'Evaluations run by technical leads from top product firms and multinational consultancies.',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKgD-B_7HZM2xSYiSFrAnRfsdnOWLz5RXw88Sf2uMhn_YYfXU5wxYy52O60RhmjZqYlUzqldkWOIOq3uFCxBM-_Nknd4X0Bq4q5B6wjIECRxDYqElU_kx_-bfan9ZuYYlXLQErg5ingq17ZIKsERRi7scdsZH-3I15z2Hjyi8KAbP9rDi65x_rw5JbapXWwYlARoD8sIfOBMFzfB_djenzYzKxo2-0RHtvYnJ4Y0CKHvIACGsdvjuCpQ'
        }
      ]
    },
    design: {
      backgroundColor: '#f7f9fd',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '8px',
      paddingY: '16',
      animation: 'fade'
    }
  },
  {
    id: 'services-cta',
    type: 'services-cta',
    title: 'Ready to start your placement preparation?',
    subtitle: 'View our pricing plans or explore live drives.',
    content: {
      eyebrow: 'START YOUR JOURNEY TODAY',
      primaryButtonText: 'Explore Drives',
      primaryButtonUrl: '#/upcoming-drives',
      secondaryButtonText: 'View Pricing',
      secondaryButtonUrl: '#/pricing'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#5f5e5e',
      headingColor: '#191c1f',
      borderRadius: '12px',
      paddingY: '20',
      animation: 'fade'
    }
  }
];
