import { CMSSection, PlacedStudent } from '../types';

export const DEFAULT_PLACED_STUDENTS_LIST: PlacedStudent[] = [
  {
    id: 'stud-stitch-1',
    name: 'Rahul Sharma',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQL9GvWCf3opASmkGBG1kjvyHX_3xfZKBLEh9Tas4E2lEwgA7EyMFSNRz8djO-ae75aXdaiZGyHVN-mCqS__C3a0vqGl_iVBs4wnduAklP-Xq3PPWvtq54Xd-or6USkkpiLbltc5ETb58argrb6jWUHC-omNGuYp8A0kCs9-Yl5bGnSn8Kp9QpVqOg8oytOhXB0TzNvw0vq9TS2qoNQO47YMNm5NKTKdE55WaFPyuU10Ejfcp9gw5Eew',
    college: 'Global Institute of Technology (GIT), Jaipur',
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech Computer Science & Engineering',
    year: '2024',
    company: 'L&T Technology Services',
    role: 'Graduate Trainee Engineer',
    packageLpa: '₹4.80 LPA',
    dossierId: 'TP-2024-8841',
    offerLetterVerified: true,
    showOnHomepage: true,
    testimonialText: 'TantraPex helped me prepare for aptitude tests and arranged the interview with L&T. Applying was completely free.'
  },
  {
    id: 'stud-stitch-2',
    name: 'Priya Deshmukh',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA85j2Hgm_l0Pv7R50pZnJIXVCK0cOzRjKvRnYwqfLPU0wwujBjTi5-6kMJw8RKli4dzQTeGBK5Vd1_y-TBkYoREBOlOfTaucR30og9l_5uYd5Oodyv3YOX2VKTfvwwihvGEv1_KzwF-MJzDKBYG7aleWLTBxOLIA1mfhn2hLN4oNV2RFboAAKGvRa2EUIWG1p1Ud1ViXbVlAgMZ6Q6bZfCZqesUR6lCzeBTpMsHIgPD0rw47n88Yvo8Q',
    college: 'D.Y. Patil Institute of Engineering, Pune',
    branch: 'Information Technology',
    degree: 'BE Information Technology',
    year: '2024',
    company: 'Infosys BPM',
    role: 'Associate System Engineer',
    packageLpa: '₹5.20 LPA',
    dossierId: 'TP-2024-9122',
    offerLetterVerified: true,
    showOnHomepage: true,
    testimonialText: 'The mock interviews gave me confidence before the actual technical round. I received my offer letter within two weeks.'
  },
  {
    id: 'stud-stitch-3',
    name: 'Karthik Subramanian',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0UGjoOIK00Q5t_0s2_aQADmwlyZPfRDIwjkT_3bypX95bRzstpJ6a6TY6jgAXp0O_KPjl2i95HTwB03hBlvboA2y2GIjiJH8DsnyyGjb4uRtt0TrBIMykdRJ71kz75wuwWa3_vsvFm_RHHkA8iw6J6YPojwMAecs_XzEo3mGoUgHsYUT1vQRM39GP7_3DKhhO5XZy9U0mIjJaY5AhM1hVd0961JkW5ahx0i63TDwr5iYusIrgmKcbmA',
    college: 'SRM Institute of Science & Technology, Chennai',
    branch: 'Computer Applications',
    degree: 'BCA',
    year: '2024',
    company: 'Cognizant',
    role: 'GenC Quality Analyst',
    packageLpa: '₹4.50 LPA',
    dossierId: 'TP-2024-6703',
    offerLetterVerified: true,
    showOnHomepage: true,
    testimonialText: 'TantraPex coordinated the entire drive smoothly. Honest, direct support with zero hidden charges.'
  },
  {
    id: 'stud-stitch-4',
    name: 'Ananya Iyer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpnkSt4hj-mvAtdcYUPuRoj6mj1wqFd_BqSvKxgG6S3Lto8t8S96m7WV2JFiL6-Kp_abPK4irCFLbkF0r7HH8lRrZocqo-yH9-uATysyhZ7Di08B9mWUL047EslmJ8r0aP9DohtpkXTAiDEaMebG6hgdm8fa-Q1hW9sKyQXl9TZVpKtDp9RjRJrUkeZnAJ4gqsP-3hxPHwOY3mrIvN3uIGgWk5fyEyjrAHy4KK8MXU3TIO8QU4jgCz1A',
    college: 'RV College of Engineering, Bengaluru',
    branch: 'Electronics & Communication',
    degree: 'B.Tech Electronics & Communication',
    year: '2024',
    company: 'Capgemini',
    role: 'Software Engineering Associate',
    packageLpa: '₹5.75 LPA',
    dossierId: 'TP-2024-5519',
    offerLetterVerified: true,
    showOnHomepage: true,
    testimonialText: 'Transparent guidance and verified company drives. Great platform for final year students.'
  }
];

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
