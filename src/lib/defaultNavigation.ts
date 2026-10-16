import { HeaderConfig, FooterConfig } from '../types';

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  logoText: "TantraPex",
  logoSubText: "YOUR CAREER, OUR PRIORITY",
  logoUrl: "https://res.cloudinary.com/dhy9pmo8s/image/upload/v1791973693/Untitled_design_3_hez3tf-removebg-preview_igasef.png",
  primaryNavItems: [
    { id: "nav-home", label: "Home", link: "#/", isVisible: true, order: 1 },
    { id: "nav-about", label: "About Us", link: "#/about", isVisible: true, order: 2 },
    { id: "nav-drives", label: "Upcoming Placements", link: "#/upcoming-drives", highlight: true, highlightText: "ACTIVE", isVisible: true, order: 3 },
    { id: "nav-pricing", label: "Pricing", link: "#/pricing", isVisible: true, order: 4 },
    { id: "nav-contact", label: "Contact Us", link: "#/contact", isVisible: true, order: 5 }
  ],
  exploreMoreTitle: "Explore More",
  exploreMoreItems: [
    {
      id: "exp-ambassador",
      label: "Campus Ambassador",
      desc: "Student campus leadership & recruitment program",
      link: "#/campus-ambassador",
      iconName: "Megaphone",
      isVisible: true
    },
    {
      id: "exp-lms",
      label: "LMS & Practice Sandbox",
      desc: "Coding sandbox, placement training & aptitude prep",
      link: "#/lms",
      iconName: "BookOpen",
      isVisible: true
    },
    {
      id: "exp-placed",
      label: "Placed Students",
      desc: "Verified candidate placement registry & alumni proof",
      link: "#/placed-students",
      iconName: "GraduationCap",
      isVisible: true
    },
    {
      id: "exp-partners",
      label: "Placement Partners",
      desc: "Enterprise recruiters & corporate MoUs",
      link: "#/companies",
      iconName: "Building2",
      isVisible: true
    },
    {
      id: "exp-services",
      label: "Our Services",
      desc: "Placement readiness & campus solutions",
      link: "#/services",
      iconName: "Briefcase",
      isVisible: true
    },
    {
      id: "exp-colleges",
      label: "College Partnerships",
      desc: "Institutional CRT & university tie-ups",
      link: "#/college-partnership",
      iconName: "Award",
      isVisible: true
    },
    {
      id: "exp-workshops",
      label: "Corporate Workshops",
      desc: "Corporate workshops & technical bootcamps",
      link: "#/workshops",
      iconName: "Calendar",
      isVisible: true
    },
    {
      id: "exp-blog",
      label: "Blogs & Insights",
      desc: "Career guidance, articles & placement tips",
      link: "#/blog",
      iconName: "Newspaper",
      isVisible: true
    }
  ],
  ctaButtonText: "Explore Placement Drives",
  ctaButtonLink: "#/upcoming-drives",
  showCtaButton: true,
  showAnnouncementBar: false,
  announcementText: "📢 Applications open for Batch 2025-26 Pooled Corporate Drives with 100% Free Access!",
  announcementLink: "#/upcoming-drives"
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandTitle: "TantraPex Technologies",
  brandTagline: "India's First Private Placement Cell",
  brandDesc: "Beyond Placement. Building Careers. Empowering Corporates. India's First Private Placement Cell connecting university talent with leading enterprise recruitment drives.",
  corporateHQ: "Institutional Placement Tower, Outer Ring Road, Bengaluru, Karnataka, India",
  officialDesk: "contact@tantrapex.com | +91 (080) 4920-8000",
  badge1Text: "ISO 9001:2015 Placement Standard",
  badge2Text: "Verified Placement Cell",
  columns: [
    {
      id: "col-placements",
      title: "Placement Quick Links",
      links: [
        { id: "pl-1", label: "Upcoming Campus Drives", link: "#/upcoming-drives" },
        { id: "pl-2", label: "Placement Partners", link: "#/companies" },
        { id: "pl-3", label: "Programs & Pricing", link: "#/pricing" },
        { id: "pl-4", label: "LMS & Learning Resources", link: "#/lms" },
        { id: "pl-5", label: "Corporate Workshops", link: "#/workshops" },
        { id: "pl-6", label: "Campus Ambassador", link: "#/campus-ambassador" },
        { id: "pl-7", label: "Placed Students", link: "#/placed-students" }
      ]
    },
    {
      id: "col-institutional",
      title: "Institutional & Legal",
      links: [
        { id: "lg-1", label: "Privacy Policy", link: "#/privacy-policy" },
        { id: "lg-2", label: "Terms of Placement Service", link: "#/terms-and-conditions" },
        { id: "lg-3", label: "Institutional Disclaimer", link: "#/disclaimer" },
        { id: "lg-4", label: "Refund & Cancellation Policy", link: "#/refund-policy" },
        { id: "lg-5", label: "College Partnerships Desk", link: "#/college-partnership" },
        { id: "lg-6", label: "Support & Grievance Desk", link: "mailto:placements@tantrapex.com" }
      ]
    }
  ],
  copyrightText: "© 2025 TantraPex Technologies Private Limited. All rights reserved. 100% Free Placement Cell for Students.",
  bottomCategoryText: "Production Placement Desk Active",
  supportDeskLabel: "Support & Grievance Desk",
  supportDeskEmail: "placements@tantrapex.com"
};
