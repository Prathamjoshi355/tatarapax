import { CMSSection, PlacedStudent } from '../types';

export const DEFAULT_PLACED_STUDENTS_LIST: PlacedStudent[] = [];

export const DEFAULT_PLACED_STUDENTS_SECTIONS: CMSSection[] = [
  {
    id: 'placed-hero',
    type: 'placed-hero',
    title: 'Our Placed Students',
    subtitle: 'Congratulations to our engineering and management students who cleared corporate selection rounds and secured job offers.',
    content: {
      badgeText: 'VERIFIED PLACEMENT OUTCOMES',
      metricNumber: '1,840+',
      metricLabel: 'GRADUATES PLACED',
      breadcrumbs: [
        { label: 'Home', href: '#/' },
        { label: 'Placed Students', href: '#/placed-students' }
      ]
    },
    design: {
      backgroundColor: '#f7f9fd',
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
    id: 'placed-filters',
    type: 'placed-filters',
    title: 'Placement Records & Live Search',
    subtitle: 'Audited and authenticated candidate dossiers',
    content: {
      searchPlaceholder: 'Search by student name, company, or college...',
      batchFilterOptions: [
        { value: 'all', label: 'All Batches' },
        { value: '2025', label: 'Batch of 2025' },
        { value: '2024', label: 'Batch of 2024' },
        { value: '2023', label: 'Batch of 2023' },
        { value: '2022', label: 'Batch of 2022' }
      ],
      branchFilterOptions: [
        { value: 'all', label: 'All Branches' },
        { value: 'cse', label: 'Computer Science & IT' },
        { value: 'ece', label: 'Electronics & Comm' },
        { value: 'ca', label: 'Computer Applications (BCA/MCA)' },
        { value: 'mech', label: 'Mechanical / Civil / Other' }
      ],
      statusLabel: 'Showing Verified Student Dossiers',
      statusSublabel: 'AUDITED & AUTHENTICATED'
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
    id: 'placed-statutory',
    type: 'placed-statutory',
    title: 'Statutory Transparency & Ethics Notice',
    subtitle: '',
    content: {
      label: 'REGULATORY & ETHICS NOTICE',
      disclaimerText: 'Disclaimer: Final placement and hiring decisions rest solely with the respective hiring companies. TantraPex Technologies does not sell job seats, charge commissions, or guarantee job offers.'
    },
    design: {
      backgroundColor: '#f2f4f8',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      buttonColor: '#80d64b',
      buttonHoverColor: '#6fc43a',
      buttonTextColor: '#092100',
      borderRadius: '12px',
      paddingY: '8',
      animation: 'fade',
      cardBackgroundColor: '#ffffff',
      borderColor: '#e0e2e6'
    }
  },
  {
    id: 'placed-cta',
    type: 'placed-cta',
    title: 'Ready to explore active hiring drives for your batch?',
    subtitle: 'Access transparent recruitment drives, verified compensation details, and direct employer assessments.',
    content: {
      eyebrow: '100% FREE FOR ALL STUDENTS',
      buttonText: 'Explore Upcoming Opportunities',
      buttonLink: '#/upcoming-drives'
    },
    design: {
      backgroundColor: '#f7f9fd',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      buttonColor: '#80d64b',
      buttonHoverColor: '#6fc43a',
      buttonTextColor: '#092100',
      borderRadius: '16px',
      paddingY: '16',
      animation: 'fade',
      cardBackgroundColor: '#ffffff',
      borderColor: '#e0e2e6'
    }
  }
];
