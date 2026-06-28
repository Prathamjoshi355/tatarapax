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
}

export interface MenuItem {
  id: string;
  label: string;
  pageId: string;
  order: number;
  isVisible: boolean;
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
  type: 'contact' | 'demo' | 'partnership' | 'ambassador' | 'workshop';
  name: string;
  email: string;
  phone: string;
  message?: string;
  date: string;
  status: 'new' | 'contacted' | 'resolved';
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
}

export interface HiringPartner {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Course {
  id: string;
  name: string;
  category: 'programming' | 'aptitude' | 'soft-skills' | 'interview' | 'others';
  description: string;
  duration: string;
  topics: string[];
}
