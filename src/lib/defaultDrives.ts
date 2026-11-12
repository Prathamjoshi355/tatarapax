import { PlacementDrive, CMSSection } from '../types';

/**
 * Helper to determine whether a placement drive's application deadline has expired.
 * Drives with expired deadlines are hidden from the Homepage, but remain visible
 * on the Upcoming Placement Opportunities page with an "Applications Closed" badge.
 */
export function isDriveExpired(drive: { deadline?: string; status?: string } | null | undefined): boolean {
  if (!drive) return false;
  if (drive.status === 'closed' || drive.status === 'archived') return true;
  if (!drive.deadline || drive.deadline.trim() === '') return false;

  const todayStr = new Date().toISOString().split('T')[0];
  const cleanDeadline = drive.deadline.trim();

  // If standard YYYY-MM-DD string
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDeadline)) {
    return cleanDeadline < todayStr;
  }

  // Fallback timestamp parse
  const deadlineTime = Date.parse(cleanDeadline);
  if (!isNaN(deadlineTime)) {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    return deadlineTime < todayMidnight.getTime();
  }

  return false;
}

export const DEFAULT_PLACEMENT_DRIVES_LIST: PlacementDrive[] = [];

export const DEFAULT_UPCOMING_DRIVES_SECTIONS: CMSSection[] = [
  {
    id: 'drives-hero-main',
    type: 'drives-hero',
    title: 'Upcoming Placement Opportunities',
    subtitle: 'Explore verified campus and pooled hiring drives. Check eligibility, review test dates, and apply for free with zero intermediary fees.',
    content: {
      cycleNotice: 'Recruitment Cycle 2024-2025',
      accreditationNotice: 'Real-Time Industry Accreditation',
      feeGuaranteeNotice: 'Student Fee: ₹0.00 Guaranteed',
      badgeText: 'ACTIVE CORPORATE DRIVES',
      title: 'Upcoming Placement Opportunities',
      subtitle: 'Explore verified campus and pooled hiring drives. Check eligibility, review test dates, and apply for free with zero intermediary fees.',
      hiringStatsTitle: 'Hiring Statistics',
      hiringStatsBadge: 'Live Status',
      stat1Label: 'Active Drives',
      stat2Number: '₹8.4L',
      stat2Label: 'Peak CTC',
      stat3Number: '100%',
      stat3Label: 'Free Access'
    },
    design: {
      backgroundColor: '#f7f9fd',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      borderRadius: '0px',
      paddingY: '8',
      animation: 'none'
    }
  },
  {
    id: 'drives-salary-bands',
    type: 'drives-salary-bands',
    title: 'Standardized Salary Bands',
    subtitle: 'Institutional classification framework for corporate campus packages.',
    content: {
      sectionTitle: 'Standardized Salary Bands',
      bandATitle: 'Category A',
      bandARange: 'Up to ₹4 LPA',
      bandBTitle: 'Category B',
      bandBRange: 'Up to ₹6 LPA',
      bandCTitle: 'Category C',
      bandCRange: 'Up to ₹9 LPA',
      bandDTitle: 'Category D',
      bandDRange: 'Dream (₹9+ LPA)'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      borderRadius: '12px',
      paddingY: '4',
      animation: 'none'
    }
  },
  {
    id: 'drives-zero-fee-charter',
    type: 'drives-zero-fee-charter',
    title: 'Zero Fee Charter',
    subtitle: '100% Free Application Guarantee for Students',
    content: {
      badgeText: 'INSTITUTIONAL POLICY',
      title: 'Zero Fee Charter',
      description: 'TantraPex Technologies never charges students any fee for applying to recruitment drives, taking online tests, or attending corporate interviews.',
      vigilanceWarning: 'If any representative asks for payment at any stage of testing or onboarding, report it immediately to our vigilance board.',
      feeStatusLabel: 'Fee Status',
      feeStatusValue: '₹0 Free',
      cellStatusLabel: 'Placement Cell',
      cellStatusValue: 'Private'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      borderRadius: '16px',
      paddingY: '8',
      animation: 'none'
    }
  },
  {
    id: 'drives-assistance-cta',
    type: 'drives-assistance-cta',
    title: 'Have questions about eligibility or drive registration?',
    subtitle: 'Our placement advisors are available on business days to evaluate your academic transcripts, clarify cut-off relaxations, and help you finalize your drive submissions.',
    content: {
      eyebrow: 'ASSISTANCE & CLARIFICATION',
      title: 'Have questions about eligibility or drive registration?',
      subtitle: 'Our placement advisors are available on business days to evaluate your academic transcripts, clarify cut-off relaxations, and help you finalize your drive submissions.',
      primaryBtnText: 'Contact Placement Team',
      primaryBtnLink: '#/contact',
      secondaryBtnText: 'Review Prep Guides',
      secondaryBtnLink: '#/lms'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#191c1f',
      headingColor: '#191c1f',
      borderRadius: '16px',
      paddingY: '12',
      animation: 'none'
    }
  }
];

export interface DomainCategory {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  keywords: string[];
}

export const PREDEFINED_DOMAINS: DomainCategory[] = [
  {
    id: 'it-software',
    label: 'IT & Software Development',
    shortLabel: 'IT & Software',
    description: 'Software Engineering, Full-Stack, Backend, Frontend, Cloud & Mobile',
    keywords: ['software', 'developer', 'sde', 'engineer', 'frontend', 'backend', 'full stack', 'fullstack', 'react', 'node', 'java', 'python', 'c++', 'web', 'it', 'cloud', 'aws', 'mobile', 'android', 'ios']
  },
  {
    id: 'data-ai',
    label: 'Data Science, Analytics & AI / ML',
    shortLabel: 'Data & AI',
    description: 'Data Scientist, Business Analyst, ML Engineer & Big Data',
    keywords: ['data', 'analytics', 'analyst', 'ai', 'ml', 'machine learning', 'deep learning', 'sql', 'power bi', 'tableau', 'big data', 'nlp']
  },
  {
    id: 'core-engineering',
    label: 'Core Engineering (Mechanical / Civil / Electrical / ECE)',
    shortLabel: 'Core Engineering',
    description: 'Design, Production, VLSI, Embedded, Automation & Site Engineering',
    keywords: ['mechanical', 'civil', 'electrical', 'electronics', 'ece', 'vlsi', 'embedded', 'cad', 'autocad', 'manufacturing', 'production', 'chemical', 'mechatronics']
  },
  {
    id: 'product-qa',
    label: 'Product Management & QA / Testing',
    shortLabel: 'Product & QA',
    description: 'Product Manager, QA Automation, SDET & Quality Assurance',
    keywords: ['product', 'qa', 'testing', 'sdet', 'automation', 'manual testing', 'quality', 'selenium', 'jira']
  },
  {
    id: 'sales-marketing',
    label: 'Sales, Marketing & Business Development',
    shortLabel: 'Sales & Marketing',
    description: 'BDE, Inside Sales, Digital Marketing, SEO & Brand Management',
    keywords: ['sales', 'marketing', 'bde', 'business development', 'digital marketing', 'lead', 'inside sales', 'growth', 'seo', 'advertising']
  },
  {
    id: 'finance-consulting',
    label: 'Finance, Banking & Management Consulting',
    shortLabel: 'Finance & Consulting',
    description: 'Financial Analyst, Audit, Accounts, Risk & Strategy Consulting',
    keywords: ['finance', 'banking', 'account', 'audit', 'tax', 'consulting', 'financial', 'cfa', 'ca', 'wealth', 'investment']
  },
  {
    id: 'operations-hr',
    label: 'Operations, HR & Supply Chain',
    shortLabel: 'Operations & HR',
    description: 'HR Executive, Talent Acquisition, Operations & Supply Chain Logistics',
    keywords: ['operations', 'hr', 'human resources', 'recruitment', 'recruiter', 'supply chain', 'logistics', 'admin', 'talent']
  },
  {
    id: 'design-creative',
    label: 'UI/UX Design & Creative Arts',
    shortLabel: 'Design & UI/UX',
    description: 'UI/UX Designer, Graphic Artist, Visual Communication & Content',
    keywords: ['design', 'ui', 'ux', 'graphic', 'figma', 'creative', 'visual', 'illustrator', 'photoshop', 'animation']
  },
  {
    id: 'customer-support',
    label: 'Customer Success & Technical Support',
    shortLabel: 'Support & Success',
    description: 'Customer Support, Technical Service, Client Relations & CRM',
    keywords: ['support', 'customer service', 'voice', 'non-voice', 'helpdesk', 'technical support', 'client support']
  }
];

export interface StandardSalaryBand {
  id: string; // 'Category A' | 'Category B' | 'Category C' | 'Category D'
  label: string;
  range: string;
  minLpa: number;
  maxLpa: number;
}

export const STANDARDIZED_SALARY_BANDS: StandardSalaryBand[] = [
  { id: 'Category A', label: 'Category A', range: 'Up to ₹4 LPA', minLpa: 0, maxLpa: 4 },
  { id: 'Category B', label: 'Category B', range: '₹4 - ₹6 LPA', minLpa: 4, maxLpa: 6 },
  { id: 'Category C', label: 'Category C', range: '₹6 - ₹10 LPA', minLpa: 6, maxLpa: 10 },
  { id: 'Category D', label: 'Category D', range: 'Dream (₹10+ LPA)', minLpa: 10, maxLpa: 999 }
];

/**
 * Helper to match a drive against a selected domain filter.
 * Checks explicit domain/category first, then smart keywords fallback.
 */
export function matchesDriveDomain(drive: PlacementDrive, domainId: string): boolean {
  if (!domainId || domainId === 'all') return true;

  // 1. Direct domain match
  const dDomain = (drive.domain || '').toLowerCase().trim();
  const dCategory = (drive.category || '').toLowerCase().trim();

  if (dDomain === domainId) return true;
  if (dCategory === domainId) return true;

  // Legacy category mapping
  if (domainId === 'it-software' && (dCategory === 'it' || dCategory === 'it-software')) return true;
  if (domainId === 'core-engineering' && (dCategory === 'core' || dCategory === 'core-engineering')) return true;
  if (domainId === 'product-qa' && (dCategory === 'product' || dCategory === 'product-qa')) return true;

  // 2. Keyword fallback matching
  const domainConfig = PREDEFINED_DOMAINS.find(d => d.id === domainId);
  if (!domainConfig) return false;

  const searchableText = `${drive.title || ''} ${drive.skills || ''} ${drive.description || ''} ${drive.eligibleDegree || ''} ${drive.categoryLabel || ''} ${drive.domainLabel || ''}`.toLowerCase();

  return domainConfig.keywords.some(kw => searchableText.includes(kw));
}

/**
 * Helper to extract numeric LPA value from a salary text string
 * Examples: "₹4.5 - ₹6.0 LPA" -> 6.0, "12 LPA" -> 12, "3.5 LPA" -> 3.5
 */
export function parseLpaFromSalary(salaryStr?: string): number | null {
  if (!salaryStr) return null;
  const clean = salaryStr.replace(/,/g, '');
  const matches = clean.match(/(\d+(?:\.\d+)?)/g);
  if (!matches || matches.length === 0) return null;
  const numbers = matches.map(Number).filter(n => !isNaN(n) && n > 0 && n < 200);
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
}

/**
 * Helper to match a drive against a standardized salary band.
 * Checks explicit salaryBand first, then numeric LPA fallback.
 */
export function matchesDriveSalaryBand(drive: PlacementDrive, bandId: string | null): boolean {
  if (!bandId) return true;

  // 1. Explicit assigned salary band
  if (drive.salaryBand && drive.salaryBand.toLowerCase().trim() === bandId.toLowerCase().trim()) {
    return true;
  }

  // 2. Heuristic check based on salary string
  const band = STANDARDIZED_SALARY_BANDS.find(b => b.id.toLowerCase() === bandId.toLowerCase());
  if (!band) return false;

  const lpa = parseLpaFromSalary(drive.salary);
  if (lpa === null) return false;

  if (band.id === 'Category A') return lpa <= 4;
  if (band.id === 'Category B') return lpa > 4 && lpa <= 6;
  if (band.id === 'Category C') return lpa > 6 && lpa <= 10;
  if (band.id === 'Category D') return lpa > 10;

  return false;
}

/**
 * Generates a clean URL slug for a placement drive.
 * Converts Company Name + Title to kebab-case (e.g. "Infosys Specialist Programmer" -> "infosys-specialist-programmer")
 */
export function generateDriveSlug(companyName: string = '', title: string = '', fallbackId: string = ''): string {
  const text = `${companyName} ${title}`.trim();
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return slug || (fallbackId ? fallbackId.toLowerCase().replace(/[^a-z0-9-]/g, '') : `drive-${Date.now()}`);
}

/**
 * Returns the effective unique identifier / slug for a placement drive.
 */
export function getDriveSlug(drive: { slug?: string; id: string; companyName?: string; title?: string } | null | undefined): string {
  if (!drive) return '';
  if (drive.slug && drive.slug.trim()) {
    return drive.slug.trim().toLowerCase().replace(/^[#/]+|\/+$/g, '');
  }
  if (drive.companyName && drive.title) {
    return generateDriveSlug(drive.companyName, drive.title, drive.id);
  }
  return drive.id || '';
}

/**
 * Generates the full shareable unique URL for a placement drive.
 * e.g. "https://tantrapex.com/#/drive/infosys-specialist-programmer"
 */
export function getDriveShareUrl(drive: { slug?: string; id: string; companyName?: string; title?: string } | null | undefined, origin?: string): string {
  if (!drive) return '';
  const slug = getDriveSlug(drive);
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/#/drive/${slug}`;
}

/**
 * Helper to lookup a drive by slug, id, or shortCode.
 */
export function findDriveBySlugOrId(drives: PlacementDrive[], slugOrId?: string | null): PlacementDrive | null {
  if (!slugOrId || !Array.isArray(drives) || drives.length === 0) return null;
  const clean = slugOrId.trim().toLowerCase().replace(/^[#/]+|\/+$/g, '');

  // 1. Exact match on slug
  const bySlug = drives.find(d => (d.slug || '').trim().toLowerCase() === clean);
  if (bySlug) return bySlug;

  // 2. Exact match on id
  const byId = drives.find(d => (d.id || '').trim().toLowerCase() === clean);
  if (byId) return byId;

  // 3. Match on shortCode
  const byShortCode = drives.find(d => (d.shortCode || '').trim().toLowerCase() === clean);
  if (byShortCode) return byShortCode;

  // 4. Fallback generated slug match
  const byGeneratedSlug = drives.find(d => generateDriveSlug(d.companyName, d.title, d.id) === clean);
  if (byGeneratedSlug) return byGeneratedSlug;

  return null;
}

