/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DynamicSection from './components/sections/DynamicSection';
import VisualEditorSidebar from './components/dashboard/VisualEditorSidebar';
import AdminPanel from './components/dashboard/AdminPanel';
import PasswordGateway from './components/dashboard/PasswordGateway';
import VisualEditorHeader from './components/dashboard/VisualEditorHeader';
import { CMSPage, GlobalSettings, MediaItem, PlacedStudent, HiringPartner, Course, BlogPost, Lead, CMSSection, Service, PlacementDrive } from './types';

// Public Page implementations
import PublicHomePage from './public/home';
import PublicAboutPage from './public/about';
import PublicServicesPage from './public/services';
import PublicBlogPage from './public/blog';
import PublicContactPage from './public/contact';
import PublicCollegePartnershipPage from './public/colleges';
import PublicUpcomingDrivesPage from './public/upcoming-drives';
import PublicLmsPage from './public/lms';
import PublicPlacedStudentsPage from './public/placed-students';
import PublicPartnersPage from './public/partners';
import PublicPricingPage from './public/pricing';
import PublicCampusAmbassadorPage from './public/campus-ambassador';
import { DEFAULT_ABOUT_SECTIONS } from './lib/defaultAbout';
import { DEFAULT_BLOG_SECTIONS, DEFAULT_BLOG_POSTS } from './lib/defaultBlogs';
import { DEFAULT_LMS_SECTIONS } from './lib/defaultLms';
import { DEFAULT_SERVICES_SECTIONS } from './lib/defaultServices';
import { DEFAULT_COLLEGES_SECTIONS } from './lib/defaultColleges';
import { DEFAULT_PLACED_STUDENTS_LIST, DEFAULT_PLACED_STUDENTS_SECTIONS } from './lib/defaultPlacedStudents';
import { DEFAULT_HIRING_PARTNERS_LIST, DEFAULT_PARTNERS_SECTIONS } from './lib/defaultPartners';
import { DEFAULT_PLACEMENT_DRIVES_LIST, DEFAULT_UPCOMING_DRIVES_SECTIONS } from './lib/defaultDrives';
import { DEFAULT_PRICING_SECTIONS } from './lib/defaultPricing';
import { DEFAULT_AMBASSADOR_SECTIONS } from './lib/defaultAmbassador';
import { CANONICAL_PAGES_LIST, CANONICAL_PAGES_MAP } from './lib/defaultPages';
import PolicyPage from './components/pages/PolicyPage';

// Admin Page implementations
import AdminHomePage from './superadmin/admin/home';
import AdminAboutPage from './superadmin/admin/about';
import AdminServicesPage from './superadmin/admin/services';
import AdminBlogPage from './superadmin/admin/blog';
import AdminContactPage from './superadmin/admin/contact';
import AdminCollegesPage from './superadmin/admin/colleges';
import AdminLmsPage from './superadmin/admin/lms';
import AdminPlacedStudentsPage from './superadmin/admin/placed-students';
import AdminPartnersPage from './superadmin/admin/partners';
import AdminUpcomingDrivesPage from './superadmin/admin/upcoming-drives';
import AdminPricingPage from './superadmin/admin/pricing';
import AdminCampusAmbassadorPage from './superadmin/admin/campus-ambassador';
import AdminNavigationPage from './superadmin/admin/navigation';

// Visual Editor Page implementations
import VisualEditorHomePage from './superadmin/visual/home';
import VisualEditorAboutPage from './superadmin/visual/about';
import VisualEditorServicesPage from './superadmin/visual/services';
import VisualEditorBlogPage from './superadmin/visual/blog';
import VisualEditorContactPage from './superadmin/visual/contact';
import VisualEditorLmsPage from './superadmin/visual/lms';

// Super Admin Dashboard
import SuperAdminDashboard from './superadmin/dashboard';

const EMPTY_SETTINGS: GlobalSettings = {
  logoText: "TantraPex",
  logoSubText: "YOUR CAREER, OUR PRIORITY",
  logoUrl: "https://res.cloudinary.com/dhy9pmo8s/image/upload/v1791973693/Untitled_design_3_hez3tf-removebg-preview_igasef.png",
  email: "",
  phone: "",
  address: "",
  socialMedia: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: ""
  },
  primaryColor: "",
  secondaryColor: "",
  themeMode: "light",
  containerWidth: "max-w-full",
  adminPassword: "",
  menuItems: []
};

const EMPTY_PAGE: CMSPage = {
  id: 'home',
  title: 'Home',
  slug: '/',
  seo: { title: '', description: '', keywords: '' },
  sections: []
};

const sanitizePages = (rawPages: CMSPage[]): CMSPage[] => {
  return rawPages.map(page => {
    if (!page || !page.sections) return page;

    // Find deprecated sections to migrate their values if the user previously edited them
    const oldMissionVision = page.sections.find(s => s.type === 'mission-vision');
    const oldWhyUsList = page.sections.find(s => s.type === 'why-us-list');

    // Filter out separate mission-vision and why-us-list sections for the 'about' page
    // because they are now beautifully integrated into the about-main section layout.
    let cleanedSections = page.sections;
    if (page.id === 'about') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'about-hero' || s.type === 'about-mission-approach');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_ABOUT_SECTIONS;
      }
    }

    if (page.id === 'blog') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'blog-hero' || s.type === 'blog-newsletter');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_BLOG_SECTIONS;
      }
    }

    if (page.id === 'lms') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'lms-hero' || s.type === 'lms-pillars');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_LMS_SECTIONS;
      }
    }

    if (page.id === 'services') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'services-hero' || s.type === 'services-pillars');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_SERVICES_SECTIONS;
      }
    }

    if (page.id === 'college-partnership') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'college-hero' || s.type === 'college-benefits');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_COLLEGES_SECTIONS;
      }
    }

    if (page.id === 'placed-students') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'placed-hero' || s.type === 'placed-filters');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_PLACED_STUDENTS_SECTIONS;
      }
    }

    if (page.id === 'companies') {
      const hasModernSections = page.sections && page.sections.some(s => s.type && s.type.startsWith('partners-'));
      if (!hasModernSections) {
        cleanedSections = DEFAULT_PARTNERS_SECTIONS;
      }
    }

    if (page.id === 'upcoming-drives') {
      const hasModernSections = page.sections && page.sections.some(s => s.type && s.type.startsWith('drives-'));
      if (!hasModernSections) {
        cleanedSections = DEFAULT_UPCOMING_DRIVES_SECTIONS;
      }
    }

    if (page.id === 'pricing') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'pricing-header' || s.type === 'pricing-plans');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_PRICING_SECTIONS;
      }
    }

    if (page.id === 'campus-ambassador') {
      const hasModernSections = page.sections && page.sections.some(s => s.type === 'ambassador-header' || s.type === 'ambassador-responsibilities');
      if (!hasModernSections) {
        cleanedSections = DEFAULT_AMBASSADOR_SECTIONS;
      }
    }

    if (page.id === 'home') {
      cleanedSections = page.sections.map(section => {
        if (section.type === 'hero' && section.content) {
          return {
            ...section,
            content: {
              ...section.content,
              primaryBtnLink: '#pricing'
            }
          };
        }
        if (section.type === 'cta-banner' && section.content) {
          return {
            ...section,
            content: {
              ...section.content,
              primaryBtnLink: '#pricing'
            }
          };
        }
        return section;
      });

      // Ensure Upcoming Drives section is present on Homepage
      const hasDrivesSection = cleanedSections.some(s => s.type === 'upcoming-drives');
      if (!hasDrivesSection) {
        const insertIdx = cleanedSections.findIndex(s => s.type === 'stats' || s.type === 'hero');
        const drivesSection: CMSSection = {
          id: 'section-upcoming-drives',
          type: 'upcoming-drives',
          title: 'Explore Upcoming Placement Drives',
          subtitle: 'Apply to active corporate placement drives with zero application charges. Transparent eligibility and direct corporate panels.',
          content: {
            title: 'Explore Upcoming Placement Drives',
            subtitle: 'Apply to active corporate placement drives with zero application charges. Transparent eligibility and direct corporate panels.',
            maxDrives: 4
          },
          design: {
            backgroundColor: '#f8fafc',
            textColor: '#1f2937',
            headingColor: '#111827',
            borderRadius: '16px',
            paddingY: '14',
            animation: 'none'
          }
        };

        const updated = [...cleanedSections];
        if (insertIdx !== -1) {
          updated.splice(insertIdx + 1, 0, drivesSection);
        } else {
          updated.push(drivesSection);
        }
        cleanedSections = updated;
      }
    }

    return {
      ...page,
      sections: cleanedSections.map(section => {
        if (section.type === 'about-main') {
          const content = section.content || {};

          return {
            ...section,
            content: {
              ...content,
              badgeText: content.badgeText || "2. ABOUT US",
              missionTitle: content.missionTitle || oldMissionVision?.content?.missionTitle || "Our Mission",
              missionDesc: content.missionDesc || oldMissionVision?.content?.missionDesc || "To empower students with the right skills, guidance and opportunities to build a successful career.",
              missionImage: content.missionImage || oldMissionVision?.content?.missionImage || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300",

              visionTitle: content.visionTitle || oldMissionVision?.content?.visionTitle || "Our Vision",
              visionDesc: content.visionDesc || oldMissionVision?.content?.visionDesc || "To become India's most trusted career partner for students and companies.",
              visionImage: content.visionImage || oldMissionVision?.content?.visionImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=300",

              whyTitle: content.whyTitle || oldWhyUsList?.title || "Why Choose Us?",
              whyImage: content.whyImage || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300",
              whyPoints: content.whyPoints || (oldWhyUsList?.content?.points?.map((pt: any) => ({ id: pt.id || `wp-${Math.random()}`, text: pt.title })) || [
                { id: "wp-1", text: "Industry Expert Mentors" },
                { id: "wp-2", text: "Personalized Training" },
                { id: "wp-3", text: "100% Placement Assistance" },
                { id: "wp-4", text: "Practical Learning Approach" },
                { id: "wp-5", text: "Strong Industry Connections" },
                { id: "wp-6", text: "Lifetime Support" }
              ])
            }
          };
        }
        if (section.type === 'about-journey') {
          const content = section.content || {};
          const defaultImages = [
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"
          ];
          const milestones = (content.milestones || []).map((m: any, idx: number) => ({
            ...m,
            image: m.image || defaultImages[idx] || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"
          }));
          return {
            ...section,
            content: {
              ...content,
              milestones
            }
          };
        }
        if (section.type === 'lms-dashboard') {
          return {
            ...section,
            design: {
              ...section.design,
              backgroundColor: "#ffffff",
              textColor: "#334155",
              headingColor: "#071B4D",
              buttonColor: "#071B4D",
              buttonHoverColor: "#00103a",
              buttonTextColor: "#ffffff",
              cardBackgroundColor: "#f8fafc",
              borderColor: "#e2e8f0"
            }
          };
        }
        return section;
      })
    };
  });
};

const normalizeRoute = (hash: string): string => {
  const rawHash = (hash || '#/').trim().toLowerCase();
  const withoutHash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  const withoutLeadingSlash = withoutHash.startsWith('/') ? withoutHash.slice(1) : withoutHash;
  const withoutSearch = withoutLeadingSlash.split(/[?#]/)[0];
  return withoutSearch.replace(/\/+$/g, '');
};

const normalizePageSlug = (slug: string): string => {
  return (slug || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');
};

const resolvePublicPageId = (route: string, pages: CMSPage[]): string => {
  const normalized = route.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (normalized === '' || normalized === 'home') return 'home';
  if (normalized === 'about' || normalized === 'about-us') return 'about';
  if (normalized === 'contact' || normalized === 'contact-us') return 'contact';
  if (normalized === 'pricing' || normalized === 'pricing-programs' || normalized === 'programs' || normalized === 'program') return 'pricing';
  if (normalized === 'campus-ambassador' || normalized === 'ambassador' || normalized === 'campus-ambassadors' || normalized === 'student-ambassador') return 'campus-ambassador';
  if (normalized === 'upcoming-drives' || normalized === 'upcoming-placement-drives' || normalized === 'upcoming-placement-opportunities' || normalized === 'drives' || normalized === 'upcoming-placements') return 'upcoming-drives';
  if (normalized === 'blog' || normalized === 'blogs') return 'blog';
  if (normalized === 'services' || normalized === 'our-services') return 'services';
  if (normalized === 'college-partnership' || normalized === 'college-partnerships' || normalized === 'partners-with-us' || normalized === 'partner-with-us') return 'college-partnership';
  if (normalized === 'lms' || normalized === 'lms-resources' || normalized === 'learning-resources') return 'lms';
  if (normalized === 'placed-students' || normalized === 'placed-student') return 'placed-students';
  if (normalized === 'companies' || normalized === 'placement-partners' || normalized === 'placement-partner' || normalized === 'partners') return 'companies';
  if (normalized === 'workshops' || normalized === 'corporate-workshops') return 'workshops';
  if (normalized === 'privacy-policy' || normalized === 'privacy') return 'privacy-policy';
  if (normalized === 'terms-and-conditions' || normalized === 'terms') return 'terms-and-conditions';
  if (normalized === 'disclaimer') return 'disclaimer';
  if (normalized === 'refund-policy' || normalized === 'refund') return 'refund-policy';
  if (normalized.startsWith('page-')) return normalized.replace(/^page-/, '');

  const matchedPage = pages.find((p) => {
    const pageSlug = normalizePageSlug(p.slug);
    return (
      p.id.toLowerCase() === normalized ||
      pageSlug === normalized
    );
  });
  if (matchedPage) return matchedPage.id;
  if (CANONICAL_PAGES_MAP.has(normalized)) return normalized;
  return 'home';
};

export default function App() {
  // Master persistent states loading from localStorage
  const [pages, setPages] = useState<CMSPage[]>(() => {
    let rawList: CMSPage[] = [];
    const saved = localStorage.getItem('tpx_pages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CMSPage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawList = parsed;
        }
      } catch {}
    }

    const uniqueMap = new Map<string, CMSPage>();
    rawList.forEach((p: CMSPage) => {
      if (p && p.id) {
        uniqueMap.set(p.id, p);
      }
    });

    // Guarantee all canonical pages exist
    CANONICAL_PAGES_LIST.forEach((cp) => {
      if (!uniqueMap.has(cp.id)) {
        uniqueMap.set(cp.id, cp);
      }
    });

    const pagesFromStorage = Array.from(uniqueMap.values());
    return sanitizePages(pagesFromStorage);
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('tpx_settings');
    const parsed = saved ? JSON.parse(saved) : {};
    const mergedSettings = { ...EMPTY_SETTINGS, ...parsed } as GlobalSettings;

    if (!mergedSettings.menuItems || mergedSettings.menuItems.length === 0) {
      mergedSettings.menuItems = [];
    }

    return mergedSettings;
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('tpx_media');
    const rawMedia = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(rawMedia) || rawMedia.length === 0) return [];
    const uniqueMap = new Map<string, MediaItem>();
    rawMedia.forEach((m: MediaItem) => {
      if (m && m.id) {
        uniqueMap.set(m.id, m);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [placedStudents, setPlacedStudents] = useState<PlacedStudent[]>(() => {
    const saved = localStorage.getItem('tpx_placed_students');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, PlacedStudent>();
    raw.forEach((item: PlacedStudent) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [hiringPartners, setHiringPartners] = useState<HiringPartner[]>(() => {
    const saved = localStorage.getItem('tpx_hiring_partners');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, HiringPartner>();
    raw.forEach((item: HiringPartner) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>(() => {
    const saved = localStorage.getItem('tpx_placement_drives');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, PlacementDrive>();
    raw.forEach((item: PlacementDrive) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('tpx_courses');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, Course>();
    raw.forEach((item: Course) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('tpx_blogs');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, BlogPost>();
    raw.forEach((item: BlogPost) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('tpx_services');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, Service>();
    raw.forEach((item: Service) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('tpx_leads');
    const raw = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const uniqueMap = new Map<string, Lead>();
    raw.forEach((item: Lead) => {
      const id = item.id || item.email || Math.random().toString();
      uniqueMap.set(id, item);
    });
    return Array.from(uniqueMap.values());
  });

  // UI View Controls State
  const [currentPageId, setCurrentPageId] = useState('home');
  const [viewMode, setViewMode] = useState<'live' | 'superadmin'>('live');
  const [subRoute, setSubRoute] = useState<'dashboard' | 'admin' | 'visual' | 'crm'>('dashboard');
  const [adminActivePageId, setAdminActivePageId] = useState<string>('home');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);

  // Keep pages state in a ref to avoid recreating the hashchange listener and calling handleHashChange on every change/keystroke
  const pagesRef = React.useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  // Super Admin security and auth state
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tpx_superadmin_authed') === 'true';
  });

  // Specific hash route listener to support direct router navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      const lowerHash = hash.toLowerCase();

      if (lowerHash.startsWith('#/superadmin') || lowerHash.startsWith('#superadmin')) {
        setViewMode('superadmin');
        const cleanPath = hash.replace(/^#(?:|\/)/, ''); // e.g. "superadmin/dashboard" or "superadmin/admin/home"
        const parts = cleanPath.split('/'); // e.g. ["superadmin", "dashboard"] or ["superadmin", "admin", "home"]

        const moduleName = parts[1]?.toLowerCase() || 'dashboard';

        if (moduleName === 'dashboard') {
          setSubRoute('dashboard');
        } else if (moduleName === 'crm') {
          setSubRoute('crm');
        } else if (moduleName === 'admin' && parts[2]) {
          setSubRoute('admin');
          setAdminActivePageId(parts[2].toLowerCase());
        } else if (moduleName === 'visual' && parts[2]) {
          setSubRoute('visual');
          setAdminActivePageId(parts[2].toLowerCase());
        } else {
          setSubRoute('dashboard');
        }
      } else {
        setViewMode('live');
        // Decode public routes
        const rawRoute = normalizeRoute(hash);
        const matchedPageId = resolvePublicPageId(rawRoute, pagesRef.current) || 'home';
        setCurrentPageId(matchedPageId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const hash = window.location.hash || '#/';
    const lowerHash = hash.toLowerCase();

    if (lowerHash.startsWith('#/superadmin') || lowerHash.startsWith('#superadmin')) {
      return;
    }

    const rawRoute = normalizeRoute(hash);
    const matchedPageId = resolvePublicPageId(rawRoute, pagesRef.current) || 'home';
    setCurrentPageId(matchedPageId);
  }, [pages]);

  const handleLogout = () => {
    sessionStorage.removeItem('tpx_superadmin_authed');
    setIsSuperAdminAuthenticated(false);
    setViewMode('live');
    window.location.hash = '#/';
  };

  const handleSaveVisualDraft = async () => {
    setIsSavingDraft(true);
    setSaveStatusMessage('Saving draft...');
    try {
      localStorage.setItem('tpx_pages', JSON.stringify(pages));
      localStorage.setItem('tpx_settings', JSON.stringify(settings));
      localStorage.setItem('tpx_media', JSON.stringify(media));
      localStorage.setItem('tpx_placed_students', JSON.stringify(placedStudents));
      localStorage.setItem('tpx_hiring_partners', JSON.stringify(hiringPartners));
      localStorage.setItem('tpx_courses', JSON.stringify(courses));
      localStorage.setItem('tpx_blogs', JSON.stringify(blogs));
      localStorage.setItem('tpx_services', JSON.stringify(services));
      localStorage.setItem('tpx_leads', JSON.stringify(leads));

      const response = await fetch('/api/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pages,
          settings,
          media,
          placed_students: placedStudents,
          hiring_partners: hiringPartners,
          courses,
          blogs,
          services,
          leads
        })
      });
      const result = await response.json();
      if (result.success) {
        setMongoDbStatus('connected');
        setMongoDbError(null);
        setSaveStatusMessage('Draft saved successfully.');
      } else {
        setMongoDbStatus('disconnected');
        setSaveStatusMessage(result.msg || 'Save failed.');
        if (result.connectionError) {
          setMongoDbError(result.connectionError);
        }
      }
    } catch (err: any) {
      setSaveStatusMessage('Save failed. Check your connection.');
      setMongoDbStatus('disconnected');
      setMongoDbError(err.message || String(err));
    } finally {
      setIsSavingDraft(false);
      window.setTimeout(() => {
        setSaveStatusMessage(null);
      }, 3000);
    }
  };

  const [mongoDbStatus, setMongoDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [mongoDbError, setMongoDbError] = useState<string | null>(null);
  const [mongoLoadComplete, setMongoLoadComplete] = useState(false);

  // Load all CMS collections from MongoDB on initial mount
  useEffect(() => {
    const loadMongoDbData = async () => {
      try {
        const res = await fetch('/api/load-all');
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setMongoDbStatus('connected');
          setMongoDbError(null);

          const uniqueMap = new Map<string, CMSPage>();
          if (d.pages && d.pages.length > 0) {
            d.pages.forEach((p: any) => {
              if (p && p.id) {
                uniqueMap.set(p.id, p);
              }
            });
          }

          setPages(sanitizePages(Array.from(uniqueMap.values())));

          const settingsDoc = Array.isArray(d.settings) ? d.settings[0] : d.settings;
          if (settingsDoc && settingsDoc.logoText) {
            const merged = { ...EMPTY_SETTINGS, ...settingsDoc } as GlobalSettings;
            if (!merged.menuItems || merged.menuItems.length === 0) {
              merged.menuItems = [];
            }
            setSettings(merged);
          } else {
            setSettings(EMPTY_SETTINGS);
          }

          if (d.media && d.media.length > 0) {
            setMedia(d.media);
          } else {
            setMedia([]);
          }

          setPlacedStudents(Array.isArray(d.placed_students) ? d.placed_students : []);
          setHiringPartners(Array.isArray(d.hiring_partners) ? d.hiring_partners : []);
          setPlacementDrives(Array.isArray(d.placement_drives) ? d.placement_drives : []);

          if (d.courses && d.courses.length > 0) {
            const m = new Map();
            d.courses.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setCourses(Array.from(m.values()));
          } else {
            setCourses([]);
          }

          if (d.blogs && d.blogs.length > 0) {
            const m = new Map();
            d.blogs.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setBlogs(Array.from(m.values()));
          } else {
            setBlogs([]);
          }

          if (d.services && d.services.length > 0) {
            const m = new Map();
            d.services.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setServices(Array.from(m.values()));
          } else {
            setServices([]);
          }

          if (d.leads && d.leads.length > 0) {
            const m = new Map<string, Lead>();
            d.leads.forEach((item: any) => {
              const id = item.id || item.email || Math.random().toString();
              m.set(id, item);
            });
            setLeads(Array.from(m.values()));
          } else {
            setLeads([]);
          }
        } else {
          setMongoDbStatus('disconnected');
          if (json.connectionError) {
            setMongoDbError(json.connectionError);
          }
        }
      } catch (err: any) {
        console.error("Error loading data from MongoDB:", err);
        setMongoDbStatus('disconnected');
        setMongoDbError(err.message || String(err));
      } finally {
        setMongoLoadComplete(true);
      }
    };
    loadMongoDbData();
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('tpx_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('tpx_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tpx_media', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('tpx_placed_students', JSON.stringify(placedStudents));
  }, [placedStudents]);

  useEffect(() => {
    localStorage.setItem('tpx_hiring_partners', JSON.stringify(hiringPartners));
  }, [hiringPartners]);

  useEffect(() => {
    localStorage.setItem('tpx_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('tpx_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('tpx_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('tpx_leads', JSON.stringify(leads));
  }, [leads]);

  // Notice: Automatic debounced full MongoDB overwrite is disabled to protect live user data.
  // Data synchronization only occurs on explicit user save actions in the admin CMS.

  // Reset database state callback
  const handleResetDatabase = () => {
    const confirmReset = window.confirm("Are you sure you want to clear local editor data and start from an empty CMS state?");
    if (confirmReset) {
      localStorage.clear();
      setPages([]);
      setSettings(EMPTY_SETTINGS);
      setMedia([]);
      setPlacedStudents([]);
      setHiringPartners([]);
      setCourses([]);
      setBlogs([]);
      setServices([]);
      setLeads([]);
      setCurrentPageId('home');
      setViewMode('live');
      setSelectedSectionId(null);
    }
  };

  // Add a form lead submission
  const handleAddLead = (leadDetails: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      date: new Date().toISOString(),
      ...leadDetails
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Dynamic visual editing value injector
  const handleEditField = (sectionId: string, fieldPath: string, value: any) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== currentPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id !== sectionId) return section;
            const updatedSection = { ...section };

            if (fieldPath === 'title') {
              updatedSection.title = value;
            } else if (fieldPath === 'subtitle') {
              updatedSection.subtitle = value;
            } else if (fieldPath.startsWith('content.')) {
              const keys = fieldPath.split('.');
              if (keys.length === 2) {
                const subKey = keys[1];
                updatedSection.content = {
                  ...updatedSection.content,
                  [subKey]: value
                };
              } else if (keys.length === 4) {
                const arrayKey = keys[1];
                const index = parseInt(keys[2], 10);
                const subKey = keys[3];
                if (Array.isArray(updatedSection.content[arrayKey])) {
                  const arrayCopy = [...updatedSection.content[arrayKey]];
                  arrayCopy[index] = { ...arrayCopy[index], [subKey]: value };
                  updatedSection.content = {
                    ...updatedSection.content,
                    [arrayKey]: arrayCopy
                  };
                }
              }
            }
            return updatedSection;
          })
        };
      });
    });
  };

  // Design property updates
  const handleUpdateSectionDesign = (sectionId: string, designUpdates: any) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== currentPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              design: {
                ...section.design,
                ...designUpdates
              }
            };
          })
        };
      });
    });
  };

  // Section positioning: move up or down inside active page
  const handleMoveSection = (direction: 'up' | 'down', sectionId: string) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== currentPageId) return page;
        const index = page.sections.findIndex(s => s.id === sectionId);
        if (index === -1) return page;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= page.sections.length) return page;

        const updatedSections = [...page.sections];
        const temp = updatedSections[index];
        updatedSections[index] = updatedSections[targetIndex];
        updatedSections[targetIndex] = temp;

        return { ...page, sections: updatedSections };
      });
    });
  };

  // Duplicate / Clone a Section block
  const handleDuplicateSection = (sectionId: string) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== currentPageId) return page;
        const targetSection = page.sections.find(s => s.id === sectionId);
        if (!targetSection) return page;

        const cloned: CMSSection = {
          ...targetSection,
          id: `${targetSection.type}-${Date.now()}`,
          title: `${targetSection.title} (Copy)`,
          design: { ...targetSection.design }
        };

        const index = page.sections.findIndex(s => s.id === sectionId);
        const updatedSections = [...page.sections];
        updatedSections.splice(index + 1, 0, cloned);

        return { ...page, sections: updatedSections };
      });
    });
  };

  // Delete a Section block
  const handleDeleteSection = (sectionId: string) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== currentPageId) return page;
        return {
          ...page,
          sections: page.sections.filter(s => s.id !== sectionId)
        };
      });
    });
    setSelectedSectionId(null);
  };

  // Add fresh block based on templates
  const handleAddSection = (type: string) => {
    let templateContent = {};
    if (type === 'hero') {
      templateContent = { tagline: "Training | Mentorship | Assistance", primaryBtnText: "Explore Courses", primaryBtnLink: "#", secondaryBtnText: "Contact Us", secondaryBtnLink: "#", heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" };
    } else if (type === 'stats') {
      templateContent = { stats: [{ id: "stat-a", label: "Students", count: "500+" }, { id: "stat-b", label: "Success Rate", count: "98%" }] };
    } else if (type === 'services-grid') {
      templateContent = { services: [{ id: "s-t1", title: "Job Coaching", desc: "Expert placement advice and resume creation." }], ctaTitle: "Start Now", ctaDesc: "Begin training today", ctaBtnText: "Enquire" };
    } else if (type === 'companies-grid') {
      templateContent = { ctaTitle: "Looking to recruit?", ctaDesc: "Hire from our alumni pool", ctaBtnText: "Hire" };
    } else if (type === 'timeline') {
      templateContent = { steps: [{ id: "stp-1", num: "01", label: "Start", desc: "Sign up and begin" }] };
    } else if (type === 'courses-tabs') {
      templateContent = { viewAllBtnText: "Learn More" };
    }

    const newSection: CMSSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Section`,
      subtitle: "Customize this subtitle text in the design panel",
      content: templateContent,
      design: {
        backgroundColor: "#ffffff",
        textColor: "#334155",
        headingColor: "#0f172a",
        buttonColor: "#2563eb",
        buttonHoverColor: "#1d4ed8",
        buttonTextColor: "#ffffff",
        borderRadius: "12px",
        paddingY: "12",
        animation: "fade",
        cardBackgroundColor: "#f8fafc",
        borderColor: "#cbd5e1"
      }
    };

    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== currentPageId) return page;
        return {
          ...page,
          sections: [...page.sections, newSection]
        };
      });
    });

    setSelectedSectionId(newSection.id);
  };

  const renderPublicPage = () => {
    switch (currentPageId) {
      case 'home':
        return (
          <PublicHomePage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'about':
        return (
          <PublicAboutPage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'services':
        return (
          <PublicServicesPage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            allServices={services}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'blog':
        return (
          <PublicBlogPage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'contact':
        return (
          <PublicContactPage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'college-partnership':
        return (
          <PublicCollegePartnershipPage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'upcoming-drives':
        return (
          <PublicUpcomingDrivesPage
            page={activePage}
            settings={settings}
            drives={placementDrives}
            onEditField={handleEditField}
          />
        );
      case 'lms':
        return (
          <PublicLmsPage
            page={activePage}
            settings={settings}
            onEditField={handleEditField}
          />
        );
      case 'placed-students':
        return (
          <PublicPlacedStudentsPage
            page={activePage}
            settings={settings}
            placedStudents={placedStudents}
            onEditField={handleEditField}
          />
        );
      case 'companies':
        return (
          <PublicPartnersPage
            page={activePage}
            settings={settings}
            hiringPartners={hiringPartners}
            onEditField={handleEditField}
          />
        );
      case 'pricing':
        return (
          <PublicPricingPage
            page={activePage}
            settings={settings}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'campus-ambassador':
        return (
          <PublicCampusAmbassadorPage
            page={activePage}
            settings={settings}
            onAddLead={handleAddLead}
            onEditField={handleEditField}
          />
        );
      case 'privacy-policy':
      case 'privacy':
        return <PolicyPage initialTab="privacy" settings={settings} />;
      case 'terms-and-conditions':
      case 'terms':
        return <PolicyPage initialTab="terms" settings={settings} />;
      case 'disclaimer':
        return <PolicyPage initialTab="disclaimer" settings={settings} />;
      case 'refund-policy':
      case 'refund':
        return <PolicyPage initialTab="refund" settings={settings} />;
      case 'workshops':
      case 'corporate-workshops': {
        const workshopsPage = pages.find(p => p.id === 'workshops') || {
          id: 'workshops',
          title: 'Upcoming Workshops & Masterclasses',
          slug: '/workshops',
          sections: [
            {
              id: 'sec-workshops-hero',
              type: 'hero',
              title: 'Practical Upskilling & Engineering Masterclasses',
              subtitle: 'Hands-on technical workshops, resume clinics, and live mock interview panels led by industry veterans.',
              content: {}
            },
            {
              id: 'sec-workshops-list',
              type: 'workshops-list',
              title: 'Upcoming Campus Workshops',
              subtitle: 'Reserve your verified seat, receive official Admit Cards, and unlock lifetime session recordings.',
              content: {}
            }
          ]
        };
        return (
          <div className="w-full flex flex-col">
            {(workshopsPage.sections || []).map((section: any) => (
              <div key={section.id}>
                <DynamicSection
                  section={section}
                  viewMode="live"
                  onEditField={handleEditField}
                  allPlacedStudents={placedStudents}
                  allHiringPartners={hiringPartners}
                  allCourses={courses}
                  allBlogs={blogs}
                  onAddLead={handleAddLead}
                  settings={settings}
                />
              </div>
            ))}
          </div>
        );
      }
      default:
        return (
          <div className="w-full flex flex-col">
            {(activePage.sections || []).map((section) => (
              <div key={section.id}>
                <DynamicSection
                  section={section}
                  viewMode="live"
                  onEditField={handleEditField}
                  allPlacedStudents={placedStudents}
                  allHiringPartners={hiringPartners}
                  allCourses={courses}
                  allBlogs={blogs}
                  onAddLead={handleAddLead}
                  settings={settings}
                />
              </div>
            ))}
          </div>
        );
    }
  };

  const renderAdminContentPage = () => {
    let pageToEdit = pages.find(p => p.id === adminActivePageId);
    if (!pageToEdit && adminActivePageId === 'pricing') {
      pageToEdit = {
        id: 'pricing',
        title: 'Pricing & Programs',
        slug: '/pricing',
        seo: {
          title: 'Pricing & Programs | TantraPex Technologies',
          description: 'Simple, affordable training programs. Remember: Applying to our placement drives is always 100% free.',
          keywords: 'pricing, placement training fees, career pro plan, campus mou, fresher training cost'
        },
        sections: DEFAULT_PRICING_SECTIONS
      };
    }
    if (!pageToEdit && adminActivePageId === 'campus-ambassador') {
      pageToEdit = {
        id: 'campus-ambassador',
        title: 'Campus Ambassador Program',
        slug: '/campus-ambassador',
        seo: {
          title: 'Campus Ambassador Program | TantraPex Technologies',
          description: 'Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources.',
          keywords: 'campus ambassador, student leadership, college placement cell, student coordinator, engineering campus rep'
        },
        sections: DEFAULT_AMBASSADOR_SECTIONS
      };
    }
    if (!pageToEdit && adminActivePageId === 'upcoming-drives') {
      pageToEdit = {
        id: 'upcoming-drives',
        title: 'Upcoming Placement Opportunities',
        slug: '/upcoming-drives',
        seo: {
          title: 'Upcoming Placement Opportunities | TantraPex',
          description: 'Explore verified campus and pooled corporate placement drives with zero intermediary fees.',
          keywords: 'placement drives, campus hiring, LTTS, Capgemini, Cognizant, Zoho, AWS, KPIT, engineering jobs'
        },
        sections: DEFAULT_UPCOMING_DRIVES_SECTIONS
      };
    }
    if (!pageToEdit) pageToEdit = pages[0] || EMPTY_PAGE;

    const handleEditFieldOnPage = (sectionId: string, fieldPath: string, value: any) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          return {
            ...page,
            sections: page.sections.map(section => {
              if (section.id !== sectionId) return section;
              const updatedSection = { ...section };
              if (fieldPath === 'title') {
                updatedSection.title = value;
              } else if (fieldPath === 'subtitle') {
                updatedSection.subtitle = value;
              } else if (fieldPath.startsWith('content.')) {
                const keys = fieldPath.split('.');
                if (keys.length === 2) {
                  const subKey = keys[1];
                  updatedSection.content = {
                    ...updatedSection.content,
                    [subKey]: value
                  };
                } else if (keys.length === 4) {
                  const arrayKey = keys[1];
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  if (Array.isArray(updatedSection.content[arrayKey])) {
                    const arrayCopy = [...updatedSection.content[arrayKey]];
                    arrayCopy[index] = { ...arrayCopy[index], [subKey]: value };
                    updatedSection.content = {
                      ...updatedSection.content,
                      [arrayKey]: arrayCopy
                    };
                  }
                }
              }
              return updatedSection;
            })
          };
        });
      });
    };

    const handleMoveSectionOnPage = (direction: 'up' | 'down', sectionId: string) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          const index = page.sections.findIndex(s => s.id === sectionId);
          if (index === -1) return page;
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= page.sections.length) return page;
          const updatedSections = [...page.sections];
          const temp = updatedSections[index];
          updatedSections[index] = updatedSections[targetIndex];
          updatedSections[targetIndex] = temp;
          return { ...page, sections: updatedSections };
        });
      });
    };

    const handleDeleteSectionOnPage = (sectionId: string) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          return {
            ...page,
            sections: page.sections.filter(s => s.id !== sectionId)
          };
        });
      });
    };

    switch (adminActivePageId) {
      case 'home':
        return (
          <AdminHomePage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'about':
        return (
          <AdminAboutPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'services':
        return (
          <AdminServicesPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'blog':
        return (
          <AdminBlogPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            blogs={blogs}
            setBlogs={setBlogs}
            leads={leads}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'contact':
        return (
          <AdminContactPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
          />
        );
      case 'college-partnership':
        return (
          <AdminCollegesPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'lms':
        return (
          <AdminLmsPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'placed-students':
        return (
          <AdminPlacedStudentsPage
            page={pageToEdit}
            setPages={setPages}
            placedStudents={placedStudents}
            setPlacedStudents={setPlacedStudents}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'companies':
        return (
          <AdminPartnersPage
            page={pageToEdit}
            setPages={setPages}
            hiringPartners={hiringPartners}
            setHiringPartners={setHiringPartners}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'pricing':
        return (
          <AdminPricingPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'campus-ambassador':
        return (
          <AdminCampusAmbassadorPage
            page={pageToEdit}
            setPages={setPages}
            leads={leads}
            setLeads={setLeads}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'upcoming-drives':
        return (
          <AdminUpcomingDrivesPage
            page={pageToEdit}
            setPages={setPages}
            drives={placementDrives}
            setDrives={setPlacementDrives}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'navigation':
      case 'navbar-footer':
        return (
          <AdminNavigationPage
            settings={settings}
            setSettings={setSettings}
            media={media}
          />
        );
      default:
        return (
          <AdminHomePage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
    }
  };

  const renderVisualEditorPage = () => {
    let pageToEdit = pages.find(p => p.id === adminActivePageId);
    if (!pageToEdit && adminActivePageId === 'pricing') {
      pageToEdit = {
        id: 'pricing',
        title: 'Pricing & Programs',
        slug: '/pricing',
        seo: {
          title: 'Pricing & Programs | TantraPex Technologies',
          description: 'Simple, affordable training programs. Remember: Applying to our placement drives is always 100% free.',
          keywords: 'pricing, placement training fees, career pro plan, campus mou, fresher training cost'
        },
        sections: DEFAULT_PRICING_SECTIONS
      };
    }
    if (!pageToEdit && adminActivePageId === 'campus-ambassador') {
      pageToEdit = {
        id: 'campus-ambassador',
        title: 'Campus Ambassador Program',
        slug: '/campus-ambassador',
        seo: {
          title: 'Campus Ambassador Program | TantraPex Technologies',
          description: 'Represent TantraPex Technologies in your college. Help your classmates discover verified placement drives, bootcamps, and career resources.',
          keywords: 'campus ambassador, student leadership, college placement cell, student coordinator, engineering campus rep'
        },
        sections: DEFAULT_AMBASSADOR_SECTIONS
      };
    }
    if (!pageToEdit && adminActivePageId === 'upcoming-drives') {
      pageToEdit = {
        id: 'upcoming-drives',
        title: 'Upcoming Placement Opportunities',
        slug: '/upcoming-drives',
        seo: {
          title: 'Upcoming Placement Opportunities | TantraPex',
          description: 'Explore verified campus and pooled corporate placement drives with zero intermediary fees.',
          keywords: 'placement drives, campus hiring, LTTS, Capgemini, Cognizant, Zoho, AWS, KPIT, engineering jobs'
        },
        sections: DEFAULT_UPCOMING_DRIVES_SECTIONS
      };
    }
    if (!pageToEdit) pageToEdit = pages[0] || EMPTY_PAGE;

    const handleEditFieldOnPage = (sectionId: string, fieldPath: string, value: any) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          return {
            ...page,
            sections: page.sections.map(section => {
              if (section.id !== sectionId) return section;
              const updatedSection = { ...section };
              if (fieldPath === 'title') {
                updatedSection.title = value;
              } else if (fieldPath === 'subtitle') {
                updatedSection.subtitle = value;
              } else if (fieldPath.startsWith('content.')) {
                const keys = fieldPath.split('.');
                if (keys.length === 2) {
                  const subKey = keys[1];
                  updatedSection.content = {
                    ...updatedSection.content,
                    [subKey]: value
                  };
                } else if (keys.length === 4) {
                  const arrayKey = keys[1];
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  if (Array.isArray(updatedSection.content[arrayKey])) {
                    const arrayCopy = [...updatedSection.content[arrayKey]];
                    arrayCopy[index] = { ...arrayCopy[index], [subKey]: value };
                    updatedSection.content = {
                      ...updatedSection.content,
                      [arrayKey]: arrayCopy
                    };
                  }
                }
              }
              return updatedSection;
            })
          };
        });
      });
    };

    const handleUpdateSectionDesignOnPage = (sectionId: string, designUpdates: any) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          return {
            ...page,
            sections: page.sections.map(section => {
              if (section.id !== sectionId) return section;
              return {
                ...section,
                design: {
                  ...section.design,
                  ...designUpdates
                }
              };
            })
          };
        });
      });
    };

    const handleMoveSectionOnPage = (direction: 'up' | 'down', sectionId: string) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          const index = page.sections.findIndex(s => s.id === sectionId);
          if (index === -1) return page;
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= page.sections.length) return page;
          const updatedSections = [...page.sections];
          const temp = updatedSections[index];
          updatedSections[index] = updatedSections[targetIndex];
          updatedSections[targetIndex] = temp;
          return { ...page, sections: updatedSections };
        });
      });
    };

    const handleDuplicateSectionOnPage = (sectionId: string) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          const targetSection = page.sections.find(s => s.id === sectionId);
          if (!targetSection) return page;

          const cloned: CMSSection = {
            ...targetSection,
            id: `${targetSection.type}-${Date.now()}`,
            title: `${targetSection.title} (Copy)`,
            design: { ...targetSection.design }
          };

          const index = page.sections.findIndex(s => s.id === sectionId);
          const updatedSections = [...page.sections];
          updatedSections.splice(index + 1, 0, cloned);
          return { ...page, sections: updatedSections };
        });
      });
    };

    const handleDeleteSectionOnPage = (sectionId: string) => {
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          return {
            ...page,
            sections: page.sections.filter(s => s.id !== sectionId)
          };
        });
      });
    };

    const handleAddSectionOnPage = (type: string) => {
      let templateContent = {};
      if (type === 'hero') {
        templateContent = { tagline: "Training | Mentorship | Assistance", primaryBtnText: "Explore Courses", primaryBtnLink: "#", secondaryBtnText: "Contact Us", secondaryBtnLink: "#", heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" };
      } else if (type === 'stats') {
        templateContent = { stats: [{ id: "stat-a", label: "Students", count: "500+" }, { id: "stat-b", label: "Success Rate", count: "98%" }] };
      } else if (type === 'services-grid') {
        templateContent = { services: [{ id: "s-t1", title: "Job Coaching", desc: "Expert placement advice and resume creation." }], ctaTitle: "Start Now", ctaDesc: "Begin training today", ctaBtnText: "Enquire" };
      } else if (type === 'companies-grid') {
        templateContent = { ctaTitle: "Looking to recruit?", ctaDesc: "Hire from our alumni pool", ctaBtnText: "Hire" };
      } else if (type === 'timeline') {
        templateContent = { steps: [{ id: "stp-1", num: "01", label: "Start", desc: "Sign up and begin" }] };
      } else if (type === 'courses-tabs') {
        templateContent = { viewAllBtnText: "Learn More" };
      }

      const newSection: CMSSection = {
        id: `${type}-${Date.now()}`,
        type,
        title: `New ${type.toUpperCase()} Section`,
        subtitle: "Customize this subtitle text in the design panel",
        content: templateContent,
        design: {
          backgroundColor: "#ffffff",
          textColor: "#334155",
          headingColor: "#0f172a",
          buttonColor: "#2563eb",
          buttonHoverColor: "#1d4ed8",
          buttonTextColor: "#ffffff",
          borderRadius: "12px",
          paddingY: "12",
          animation: "fade",
          cardBackgroundColor: "#f8fafc",
          borderColor: "#cbd5e1"
        }
      };

      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id !== adminActivePageId) return page;
          return {
            ...page,
            sections: [...page.sections, newSection]
          };
        });
      });
      setSelectedSectionId(newSection.id);
    };

    switch (adminActivePageId) {
      case 'home':
        return (
          <VisualEditorHomePage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
      case 'about':
        return (
          <VisualEditorAboutPage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
      case 'services':
        return (
          <VisualEditorServicesPage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            allServices={services}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
      case 'blog':
        return (
          <VisualEditorBlogPage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
      case 'contact':
        return (
          <VisualEditorContactPage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
      case 'college-partnership':
        return (
          <AdminCollegesPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
          />
        );
      case 'lms':
        return (
          <VisualEditorLmsPage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
      case 'placed-students':
        return (
          <AdminPlacedStudentsPage
            page={pageToEdit}
            setPages={setPages}
            placedStudents={placedStudents}
            setPlacedStudents={setPlacedStudents}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'companies':
        return (
          <AdminPartnersPage
            page={pageToEdit}
            setPages={setPages}
            hiringPartners={hiringPartners}
            setHiringPartners={setHiringPartners}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'pricing':
        return (
          <AdminPricingPage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'campus-ambassador':
        return (
          <AdminCampusAmbassadorPage
            page={pageToEdit}
            setPages={setPages}
            leads={leads}
            setLeads={setLeads}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'upcoming-drives':
        return (
          <AdminUpcomingDrivesPage
            page={pageToEdit}
            setPages={setPages}
            drives={placementDrives}
            setDrives={setPlacementDrives}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            media={media}
            setMedia={setMedia}
          />
        );
      case 'navigation':
      case 'navbar-footer':
        return (
          <AdminNavigationPage
            settings={settings}
            setSettings={setSettings}
            media={media}
          />
        );
      default:
        return (
          <VisualEditorHomePage
            page={pageToEdit}
            settings={settings}
            placedStudents={placedStudents}
            hiringPartners={hiringPartners}
            courses={courses}
            blogs={blogs}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onEditField={handleEditFieldOnPage}
            onUpdateSectionDesign={handleUpdateSectionDesignOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDuplicateSection={handleDuplicateSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
            onAddSection={handleAddSectionOnPage}
          />
        );
    }
  };

  const activePage = pages.find(p => p.id === currentPageId) || CANONICAL_PAGES_MAP.get(currentPageId) || pages[0] || EMPTY_PAGE;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-text">

      {/* 1. PUBLIC LIVE WEBSITE PORTAL VIEW */}
      {viewMode === 'live' && (
        <>
          <Header
            settings={settings}
            pages={pages}
            currentPageId={currentPageId}
            setCurrentPageId={setCurrentPageId}
          />
          <main className="flex-1">
            {renderPublicPage()}
          </main>
          {isSuperAdminAuthenticated && (
            <div className="fixed bottom-6 right-6 z-[999]">
              <button
                onClick={() => {
                  setViewMode('superadmin');
                  setSubRoute('dashboard');
                  window.location.hash = '#/superadmin/dashboard';
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white hover:bg-slate-900 border border-slate-800 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>⚙️ Control Panel</span>
              </button>
            </div>
          )}
          <Footer
            settings={settings}
            pages={pages}
            setCurrentPageId={setCurrentPageId}
            viewMode="live"
          />
        </>
      )}

      {/* 2. SUPER ADMIN CONTROL MODULE (SECURED GATEWAY) */}
      {viewMode === 'superadmin' && (
        !isSuperAdminAuthenticated ? (
          <PasswordGateway
            settings={settings}
            gatewayType="admin"
            onSuccess={() => {
              setIsSuperAdminAuthenticated(true);
              sessionStorage.setItem('tpx_superadmin_authed', 'true');
              if (subRoute === 'admin' && adminActivePageId) {
                window.location.hash = `#/superadmin/admin/${adminActivePageId}`;
              } else if (subRoute === 'visual' && adminActivePageId) {
                window.location.hash = `#/superadmin/visual/${adminActivePageId}`;
              } else {
                window.location.hash = '#/superadmin/dashboard';
              }
            }}
            onCancel={() => {
              setViewMode('live');
              window.location.hash = '#/';
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {subRoute === 'dashboard' && (
              <SuperAdminDashboard
                settings={settings}
                pages={pages}
                onOpenAdmin={(pageId) => {
                  setViewMode('superadmin');
                  setSubRoute('admin');
                  setAdminActivePageId(pageId);
                  window.location.hash = `#/superadmin/admin/${pageId}`;
                }}
                onOpenVisual={(pageId) => {
                  setViewMode('superadmin');
                  setSubRoute('visual');
                  setAdminActivePageId(pageId);
                  window.location.hash = `#/superadmin/visual/${pageId}`;
                }}
                onViewLiveSite={() => {
                  setViewMode('live');
                  setCurrentPageId('home');
                  window.location.hash = '#/';
                }}
                onLogout={handleLogout}
                leadsCount={leads.length}
                mongoDbStatus={mongoDbStatus}
                mongoDbError={mongoDbError}
                onOpenGlobalAdmin={() => {
                  setViewMode('superadmin');
                  setSubRoute('crm');
                  window.location.hash = '#/superadmin/crm';
                }}
              />
            )}

            {subRoute === 'admin' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSubRoute('dashboard');
                        window.location.hash = '#/superadmin/dashboard';
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('live');
                        setCurrentPageId(adminActivePageId);
                        window.location.hash = `#/${adminActivePageId === 'home' ? '' : adminActivePageId}`;
                      }}
                      className="px-3 py-1 bg-blue-950/80 hover:bg-blue-900 border border-blue-900/40 hover:border-blue-700 text-xs text-blue-300 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                      title="Preview this page on the live public website"
                    >
                      👁️ View Live Page
                    </button>
                    <div className="h-4 w-px bg-slate-800" />
                    <span className="text-xs font-semibold text-slate-400">Editing Document: <strong className="text-white uppercase font-mono">{adminActivePageId}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    {mongoDbStatus === 'connected' ? (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                        <span>MongoDB Synced</span>
                      </div>
                    ) : mongoDbStatus === 'loading' ? (
                      <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono bg-amber-950/40 border border-amber-900 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                        <span>Connecting MongoDB...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-950 border border-slate-800 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full" />
                        <span>MongoDB Disconnected</span>
                      </div>
                    )}
                    <button
                      onClick={handleSaveVisualDraft}
                      disabled={isSavingDraft}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 border border-blue-700 hover:border-blue-800 text-xs text-white rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Save current admin draft"
                    >
                      {isSavingDraft ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                      onClick={handleResetDatabase}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-rose-400 hover:text-rose-300 rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Reset database to original static templates"
                    >
                      Reset Draft Data
                    </button>
                  </div>
                </div>
                {saveStatusMessage && (
                  <div className="px-6 py-3 bg-slate-900 text-slate-100 text-xs rounded-b-lg">
                    {saveStatusMessage}
                  </div>
                )}
                {renderAdminContentPage()}
              </div>
            )}

            {subRoute === 'visual' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Embedded dynamic visual header toolbar */}
                <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSubRoute('dashboard');
                        window.location.hash = '#/superadmin/dashboard';
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('live');
                        setCurrentPageId(adminActivePageId);
                        window.location.hash = `#/${adminActivePageId === 'home' ? '' : adminActivePageId}`;
                      }}
                      className="px-3 py-1 bg-blue-950/80 hover:bg-blue-900 border border-blue-900/40 hover:border-blue-700 text-xs text-blue-300 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                      title="Preview this page on the live public website"
                    >
                      👁️ View Live Page
                    </button>
                    <div className="h-4 w-px bg-slate-800" />
                    <span className="text-xs font-semibold text-slate-400">Visual Framer Mode: <strong className="text-white uppercase font-mono">{adminActivePageId}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    {mongoDbStatus === 'connected' ? (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                        <span>MongoDB Synced</span>
                      </div>
                    ) : mongoDbStatus === 'loading' ? (
                      <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono bg-amber-950/40 border border-amber-900 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                        <span>Connecting MongoDB...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-950 border border-slate-800 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full" />
                        <span>MongoDB Disconnected</span>
                      </div>
                    )}
                    <button
                      onClick={handleSaveVisualDraft}
                      disabled={isSavingDraft}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 border border-blue-700 hover:border-blue-800 text-xs text-white rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Save current visual editor draft"
                    >
                      {isSavingDraft ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                      onClick={handleResetDatabase}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-rose-400 hover:text-rose-300 rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Reset database to original static templates"
                    >
                      Reset Draft Data
                    </button>
                  </div>
                </div>
                {saveStatusMessage && (
                  <div className="mt-2 px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-lg inline-block">
                    {saveStatusMessage}
                  </div>
                )}

                {renderVisualEditorPage()}
              </div>
            )}

            {subRoute === 'crm' && (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
                {/* Embedded dynamic crm header toolbar */}
                <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-white select-none">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSubRoute('dashboard');
                        window.location.hash = '#/superadmin/dashboard';
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Dashboard
                    </button>
                    <div className="h-4 w-px bg-slate-800" />
                    <span className="text-xs font-semibold text-slate-400">Database Collections Core Admin Hub</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {mongoDbStatus === 'connected' ? (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                        <span>MongoDB Synced</span>
                      </div>
                    ) : mongoDbStatus === 'loading' ? (
                      <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono bg-amber-950/40 border border-amber-900 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                        <span>Connecting MongoDB...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-950 border border-slate-800 px-2.5 py-1 rounded">
                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full" />
                        <span>MongoDB Disconnected (Local Active)</span>
                      </div>
                    )}
                    <button
                      onClick={handleResetDatabase}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-rose-400 hover:text-rose-300 rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Reset database to original static templates"
                    >
                      Reset Draft Data
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <AdminPanel
                    pages={pages}
                    setPages={setPages}
                    settings={settings}
                    setSettings={setSettings}
                    media={media}
                    setMedia={setMedia}
                    placedStudents={placedStudents}
                    setPlacedStudents={setPlacedStudents}
                    hiringPartners={hiringPartners}
                    setHiringPartners={setHiringPartners}
                    courses={courses}
                    setCourses={setCourses}
                    blogs={blogs}
                    setBlogs={setBlogs}
                    services={services}
                    setServices={setServices}
                    leads={leads}
                    setLeads={setLeads}
                    onLogout={handleLogout}
                    onReset={handleResetDatabase}
                    mongoDbStatus={mongoDbStatus}
                    mongoDbError={mongoDbError}
                  />
                </div>
              </div>
            )}
          </div>
        )
      )}

    </div>
  );
}

