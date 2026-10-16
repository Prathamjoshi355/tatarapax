export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
}

export interface SectionDesign {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonTextColor?: string;
  borderRadius: string;
  paddingY: string;
  animation: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
  cardBackgroundColor?: string;
  borderColor?: string;
}

export interface CMSSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content: any;
  design: SectionDesign;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  seo: SEOConfig;
  sections: CMSSection[];
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  pageId: string;
  order: number;
  isVisible: boolean;
}

export interface PolicySectionCallout {
  type: 'info' | 'danger' | 'warning' | 'success';
  text: string;
}

export interface PolicySectionItem {
  id: string;
  title: string;
  content?: string;
  bullets?: string[];
  callout?: PolicySectionCallout;
}

export interface PolicyDocument {
  id: string;
  title: string;
  companyName: string;
  introText?: string;
  lastUpdated?: string;
  contactEmail1?: string;
  contactEmail2?: string;
  sections: PolicySectionItem[];
}

export interface PoliciesConfig {
  privacy: PolicyDocument;
  terms: PolicyDocument;
  disclaimer: PolicyDocument;
  refund: PolicyDocument;
}

export interface NavItemConfig {
  id: string;
  label: string;
  link: string;
  highlight?: boolean;
  highlightText?: string;
  isVisible: boolean;
  isExternal?: boolean;
  order?: number;
}

export interface ExploreDropdownItemConfig {
  id: string;
  label: string;
  desc: string;
  link: string;
  iconName?: string;
  isVisible: boolean;
  isExternal?: boolean;
}

export interface HeaderConfig {
  logoText?: string;
  logoSubText?: string;
  logoUrl?: string;
  primaryNavItems?: NavItemConfig[];
  exploreMoreTitle?: string;
  exploreMoreItems?: ExploreDropdownItemConfig[];
  ctaButtonText?: string;
  ctaButtonLink?: string;
  showCtaButton?: boolean;
  showAnnouncementBar?: boolean;
  announcementText?: string;
  announcementLink?: string;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  link: string;
  isExternal?: boolean;
}

export interface FooterColumnConfig {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterConfig {
  brandTitle?: string;
  brandTagline?: string;
  brandDesc?: string;
  corporateHQ?: string;
  officialDesk?: string;
  badge1Text?: string;
  badge2Text?: string;
  columns?: FooterColumnConfig[];
  copyrightText?: string;
  bottomCategoryText?: string;
  supportDeskLabel?: string;
  supportDeskEmail?: string;
}

export interface GlobalSettings {
  logoText: string;
  logoSubText: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    whatsapp?: string;
  };
  primaryColor: string;
  secondaryColor: string;
  themeMode: 'light' | 'dark';
  containerWidth: 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
  adminPassword?: string;
  menuItems?: MenuItem[];
  headerCtaText?: string;
  headerCtaLink?: string;
  googleRatingValue?: string;
  googleRatingTitle?: string;
  policiesConfig?: PoliciesConfig;
  headerConfig?: HeaderConfig;
  footerConfig?: FooterConfig;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'svg';
  size: string;
  folder: string;
  altText: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  shortDescription: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  featured: boolean;
  showOnHomepage: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  seo: SEOConfig;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  status: 'draft' | 'published';
}

export interface Lead {
  id: string;
  type?: 'contact' | 'demo' | 'partnership' | 'ambassador' | 'workshop' | 'newsletter' | string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  date: string;
  status?: 'new' | 'contacted' | 'resolved' | string;
  interest?: string;
  course?: string;
  degree?: string;
  batch?: string;
  notes?: string;
  college?: string;
}

export interface PlacedStudent {
  id: string;
  name: string;
  avatar: string;
  college: string;
  branch: string;
  year: string;
  company: string;
  packageLpa: string;
  showOnHomepage?: boolean;
  testimonialText?: string;
  degree?: string;
  role?: string;
  dossierId?: string;
  offerLetterVerified?: boolean;
}

export interface HiringPartner {
  id: string;
  name: string;
  logoUrl: string;
  isVisible?: boolean;
  website?: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  status?: 'active' | 'inactive';
  emailNotificationsEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  shortCode?: string;
  tier?: string;
  hasActiveDrive?: boolean;
  category?: 'it-services' | 'product-enterprise' | 'core-engineering' | string;
  trackLabel?: string;
  trackValue?: string;
}

export type DriveFormFieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'tel' 
  | 'select' 
  | 'textarea' 
  | 'file' 
  | 'date';

export interface DriveFormField {
  id: string;
  label: string;
  type: DriveFormFieldType;
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  options?: string[];
  helpText?: string;
  allowedFileTypes?: string[];
  maxFileSizeMb?: number;
  section?: 'personal' | 'academic' | 'experience' | 'documents' | 'custom';
}

export const DEFAULT_DRIVE_FORM_FIELDS: DriveFormField[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Rahul Sharma', required: true, enabled: true, section: 'personal' },
  { id: 'phone', label: 'Mobile Number (WhatsApp Enabled)', type: 'tel', placeholder: '10-digit mobile number', required: true, enabled: true, section: 'personal' },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. rahul.sharma@gmail.com', required: true, enabled: true, section: 'personal' },
  { id: 'city', label: 'Current City / Location', type: 'text', placeholder: 'e.g. Bengaluru, Pune, Delhi', required: false, enabled: true, section: 'personal' },
  { id: 'college', label: 'College / University Name', type: 'text', placeholder: 'Full institution name', required: true, enabled: true, section: 'academic' },
  { id: 'degree', label: 'Degree & Specialization', type: 'text', placeholder: 'e.g. B.Tech (Computer Science)', required: true, enabled: true, section: 'academic' },
  { id: 'branch', label: 'Branch / Stream', type: 'text', placeholder: 'e.g. CSE / IT / ECE', required: true, enabled: true, section: 'academic' },
  { id: 'passingYear', label: 'Passing Out Year', type: 'select', options: ['2023', '2024', '2025', '2026', '2027'], required: true, enabled: true, section: 'academic' },
  { id: 'cgpa', label: 'Graduation CGPA / Percentage', type: 'text', placeholder: 'e.g. 7.8 CGPA or 78%', required: true, enabled: true, section: 'academic' },
  { id: 'sgpa', label: 'Latest Semester SGPA', type: 'text', placeholder: 'e.g. 8.2 SGPA', required: false, enabled: true, section: 'academic' },
  { id: 'tenthMarks', label: '10th Percentage / CGPA', type: 'text', placeholder: 'e.g. 85%', required: true, enabled: true, section: 'academic' },
  { id: 'twelfthMarks', label: '12th / Diploma Percentage', type: 'text', placeholder: 'e.g. 82%', required: true, enabled: true, section: 'academic' },
  { id: 'skills', label: 'Key Technical Skills', type: 'text', placeholder: 'e.g. Java, Python, React, SQL', required: false, enabled: true, section: 'experience' },
  { id: 'experienceStatus', label: 'Experience Status', type: 'select', options: ['Fresher', 'Experienced'], required: false, enabled: true, section: 'experience' },
  { id: 'experienceSummary', label: 'Work Experience / Internships', type: 'textarea', placeholder: 'Mention internships, projects, or work history...', required: false, enabled: true, section: 'experience' },
  { id: 'resume', label: 'Candidate Resume (PDF)', type: 'file', required: true, allowedFileTypes: ['.pdf'], maxFileSizeMb: 10, helpText: 'PDF format only, max 10MB', enabled: true, section: 'documents' },
  { id: 'photo', label: 'Passport Size Photograph', type: 'file', required: false, allowedFileTypes: ['.jpg', '.jpeg', '.png', '.webp'], maxFileSizeMb: 10, helpText: 'JPG or PNG format, max 10MB', enabled: true, section: 'documents' }
];

export interface PlacementDrive {
  id: string;
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  title: string;
  description?: string;
  location?: string;
  workMode?: 'On-Site' | 'Remote' | 'Hybrid';
  eligibleDegree?: string;
  eligibleBatch?: string;
  minCgpa?: string;
  skills?: string;
  experience?: string;
  salary?: string;
  openingDate?: string;
  deadline?: string;
  selectionProcess?: string;
  driveType?: 'off-campus' | 'on-campus'; // 'off-campus' = public open, 'on-campus' = enrolled/exclusive info showcase
  formFields?: DriveFormField[]; // Configurable dynamic form fields for this drive
  status: 'draft' | 'published' | 'closed' | 'archived';
  createdAt: string;
  updatedAt?: string;
  shortCode?: string;
  category?: 'it' | 'core' | 'product' | string;
  categoryLabel?: string;
  salaryBand?: 'Category A' | 'Category B' | 'Category C' | 'Category D' | string;
  salarySubtext?: string;
  statusBadge?: string;
  statusSubtext?: string;
  batchSubtext?: string;
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Assessment Pending'
  | 'Interview Pending'
  | 'Selected'
  | 'Not Selected'
  | 'Withdrawn';

export interface PlacementApplication {
  id: string;
  companyId: string;
  driveId: string;
  companyName?: string;
  driveTitle?: string;
  fullName: string;
  phone: string;
  email: string;
  city?: string;
  photoUrl?: string;
  photoPublicId?: string;
  college: string;
  degree: string;
  branch: string;
  passingYear: string;
  cgpa: string;
  sgpa?: string;
  tenthMarks: string;
  twelfthMarks: string;
  resumeUrl: string;
  resumeFileName?: string;
  resumePublicId?: string;
  experienceStatus: 'fresher' | 'experienced';
  experienceDuration?: string;
  experienceUnit?: 'days' | 'months' | 'years';
  designation?: string;
  previousOrganization?: string;
  experienceSummary?: string;
  skills?: string;
  agreedToTerms: boolean;
  status: ApplicationStatus;
  emailDeliveryStatus?: 'sent' | 'skipped' | 'failed';
  emailError?: string;
  dynamicResponses?: Record<string, any>;
  uploadedFiles?: Array<{
    fieldId: string;
    label: string;
    url: string;
    fileName: string;
    publicId?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  name: string;
  category: 'programming' | 'aptitude' | 'soft-skills' | 'interview' | 'database' | 'others' | string;
  description: string;
  duration: string;
  topics: string[];
  imageUrl?: string;
  level?: string; // e.g. Beginner, Intermediate, Advanced
}

