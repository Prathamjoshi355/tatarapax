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
import { CMSPage, GlobalSettings, MediaItem, PlacedStudent, HiringPartner, Course, BlogPost, Lead, CMSSection } from './types';
import { 
  DEFAULT_PAGES, DEFAULT_SETTINGS, DEFAULT_MEDIA, DEFAULT_PLACED_STUDENTS, 
  DEFAULT_HIRING_PARTNERS, DEFAULT_COURSES, DEFAULT_BLOGS, DEFAULT_LEADS 
} from './db/defaultData';

// Public Page implementations
import PublicHomePage from './public/home';
import PublicAboutPage from './public/about';
import PublicServicesPage from './public/services';
import PublicBlogPage from './public/blog';
import PublicContactPage from './public/contact';

// Admin Page implementations
import AdminHomePage from './superadmin/admin/home';
import AdminAboutPage from './superadmin/admin/about';
import AdminServicesPage from './superadmin/admin/services';
import AdminBlogPage from './superadmin/admin/blog';
import AdminContactPage from './superadmin/admin/contact';

// Visual Editor Page implementations
import VisualEditorHomePage from './superadmin/visual/home';
import VisualEditorAboutPage from './superadmin/visual/about';
import VisualEditorServicesPage from './superadmin/visual/services';
import VisualEditorBlogPage from './superadmin/visual/blog';
import VisualEditorContactPage from './superadmin/visual/contact';

// Super Admin Dashboard
import SuperAdminDashboard from './superadmin/dashboard';

export default function App() {
  // Master persistent states loading from localStorage
  const [pages, setPages] = useState<CMSPage[]>(() => {
    const saved = localStorage.getItem('tpx_pages');
    const rawPages = saved ? JSON.parse(saved) : DEFAULT_PAGES;
    const uniqueMap = new Map();
    rawPages.forEach((p: CMSPage) => {
      if (p && p.id) {
        uniqueMap.set(p.id, p);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('tpx_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('tpx_media');
    return saved ? JSON.parse(saved) : DEFAULT_MEDIA;
  });

  const [placedStudents, setPlacedStudents] = useState<PlacedStudent[]>(() => {
    const saved = localStorage.getItem('tpx_placed_students');
    const raw = saved ? JSON.parse(saved) : DEFAULT_PLACED_STUDENTS;
    const uniqueMap = new Map();
    raw.forEach((item: PlacedStudent) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [hiringPartners, setHiringPartners] = useState<HiringPartner[]>(() => {
    const saved = localStorage.getItem('tpx_hiring_partners');
    const raw = saved ? JSON.parse(saved) : DEFAULT_HIRING_PARTNERS;
    const uniqueMap = new Map();
    raw.forEach((item: HiringPartner) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('tpx_courses');
    const raw = saved ? JSON.parse(saved) : DEFAULT_COURSES;
    const uniqueMap = new Map();
    raw.forEach((item: Course) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('tpx_blogs');
    const raw = saved ? JSON.parse(saved) : DEFAULT_BLOGS;
    const uniqueMap = new Map();
    raw.forEach((item: BlogPost) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('tpx_leads');
    const raw = saved ? JSON.parse(saved) : DEFAULT_LEADS;
    const uniqueMap = new Map();
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
        const rawRoute = hash.replace(/^#(?:|\/)/, '').toLowerCase(); // e.g. "about" or "services" or "page-lms"

        if (rawRoute === '' || rawRoute === 'home') {
          setCurrentPageId('home');
        } else if (rawRoute.startsWith('page-')) {
          const pageId = rawRoute.replace('page-', '');
          setCurrentPageId(pageId);
        } else {
          // Check if it's an existing page ID using ref to avoid dependency re-triggers
          const exists = pagesRef.current.some(p => p.id === rawRoute);
          if (exists) {
            setCurrentPageId(rawRoute);
          } else {
            // Default fallback
            setCurrentPageId('home');
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // run once on initial mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('tpx_superadmin_authed');
    setIsSuperAdminAuthenticated(false);
    setViewMode('live');
    window.location.hash = '#/';
  };

  const [mongoDbStatus, setMongoDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [mongoDbError, setMongoDbError] = useState<string | null>(null);

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
          if (d.pages && d.pages.length > 0) {
            const uniqueMap = new Map();
            d.pages.forEach((p: any) => {
              if (p && p.id) {
                uniqueMap.set(p.id, p);
              }
            });
            setPages(Array.from(uniqueMap.values()));
          }
           if (d.settings && d.settings.logoText) setSettings(d.settings);
          if (d.media && d.media.length > 0) setMedia(d.media);
          if (d.placed_students && d.placed_students.length > 0) {
            const m = new Map();
            d.placed_students.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setPlacedStudents(Array.from(m.values()));
          }
          if (d.hiring_partners && d.hiring_partners.length > 0) {
            const m = new Map();
            d.hiring_partners.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setHiringPartners(Array.from(m.values()));
          }
          if (d.courses && d.courses.length > 0) {
            const m = new Map();
            d.courses.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setCourses(Array.from(m.values()));
          }
          if (d.blogs && d.blogs.length > 0) {
            const m = new Map();
            d.blogs.forEach((item: any) => { if (item && item.id) m.set(item.id, item); });
            setBlogs(Array.from(m.values()));
          }
          if (d.leads && d.leads.length > 0) {
            const m = new Map();
            d.leads.forEach((item: any) => {
              const id = item.id || item.email || Math.random().toString();
              m.set(id, item);
            });
            setLeads(Array.from(m.values()));
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
    localStorage.setItem('tpx_leads', JSON.stringify(leads));
  }, [leads]);

  // Synchronize state changes to MongoDB (Debounced by 1500ms to avoid overlapping request floods)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch('/api/save-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pages,
            settings,
            media,
            placed_students: placedStudents,
            hiring_partners: hiringPartners,
            courses,
            blogs,
            leads
          })
        });
        const result = await response.json();
        if (result.success) {
          setMongoDbStatus('connected');
          setMongoDbError(null);
          console.log("MongoDB State synchronized successfully!");
        } else {
          setMongoDbStatus('disconnected');
          if (result.connectionError) {
            setMongoDbError(result.connectionError);
          }
          console.warn("MongoDB Sync Warning:", result.msg);
        }
      } catch (err: any) {
        setMongoDbStatus('disconnected');
        setMongoDbError(err.message || String(err));
        console.warn("Failed to synchronize with MongoDB database:", err);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [pages, settings, media, placedStudents, hiringPartners, courses, blogs, leads]);

  // Reset database state callback
  const handleResetDatabase = () => {
    const confirmReset = window.confirm("Are you sure you want to restore the Tentrapax demo database back to default themes, templates, and students?");
    if (confirmReset) {
      localStorage.clear();
      setPages(DEFAULT_PAGES);
      setSettings(DEFAULT_SETTINGS);
      setMedia(DEFAULT_MEDIA);
      setPlacedStudents(DEFAULT_PLACED_STUDENTS);
      setHiringPartners(DEFAULT_HIRING_PARTNERS);
      setCourses(DEFAULT_COURSES);
      setBlogs(DEFAULT_BLOGS);
      setLeads(DEFAULT_LEADS);
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
              } else if (keys.length === 4 && keys[1] === 'stats') {
                // e.g. "content.stats.2.count"
                const index = parseInt(keys[2], 10);
                const subKey = keys[3];
                const statsCopy = [...updatedSection.content.stats];
                statsCopy[index] = { ...statsCopy[index], [subKey]: value };
                updatedSection.content = { ...updatedSection.content, stats: statsCopy };
              } else if (keys.length === 4 && keys[1] === 'cards') {
                // e.g. "content.cards.2.title"
                const index = parseInt(keys[2], 10);
                const subKey = keys[3];
                const cardsCopy = [...updatedSection.content.cards];
                cardsCopy[index] = { ...cardsCopy[index], [subKey]: value };
                updatedSection.content = { ...updatedSection.content, cards: cardsCopy };
              } else if (keys.length === 4 && keys[1] === 'steps') {
                // e.g. "content.steps.0.label"
                const index = parseInt(keys[2], 10);
                const subKey = keys[3];
                const stepsCopy = [...updatedSection.content.steps];
                stepsCopy[index] = { ...stepsCopy[index], [subKey]: value };
                updatedSection.content = { ...updatedSection.content, steps: stepsCopy };
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
      templateContent = { stats: [ { id: "stat-a", label: "Students", count: "500+" }, { id: "stat-b", label: "Success Rate", count: "98%" } ] };
    } else if (type === 'services-grid') {
      templateContent = { services: [ { id: "s-t1", title: "Job Coaching", desc: "Expert placement advice and resume creation." } ], ctaTitle: "Start Now", ctaDesc: "Begin training today", ctaBtnText: "Enquire" };
    } else if (type === 'companies-grid') {
      templateContent = { ctaTitle: "Looking to recruit?", ctaDesc: "Hire from our alumni pool", ctaBtnText: "Hire" };
    } else if (type === 'timeline') {
      templateContent = { steps: [ { id: "stp-1", num: "01", label: "Start", desc: "Sign up and begin" } ] };
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
      default:
        return (
          <div className="w-full flex flex-col">
            {activePage.sections.map((section) => (
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
    const pageToEdit = pages.find(p => p.id === adminActivePageId) || pages[0];
    
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
                } else if (keys.length === 4 && keys[1] === 'stats') {
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  const statsCopy = [...updatedSection.content.stats];
                  statsCopy[index] = { ...statsCopy[index], [subKey]: value };
                  updatedSection.content = { ...updatedSection.content, stats: statsCopy };
                } else if (keys.length === 4 && keys[1] === 'cards') {
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  const cardsCopy = [...updatedSection.content.cards];
                  cardsCopy[index] = { ...cardsCopy[index], [subKey]: value };
                  updatedSection.content = { ...updatedSection.content, cards: cardsCopy };
                } else if (keys.length === 4 && keys[1] === 'steps') {
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  const stepsCopy = [...updatedSection.content.steps];
                  stepsCopy[index] = { ...stepsCopy[index], [subKey]: value };
                  updatedSection.content = { ...updatedSection.content, steps: stepsCopy };
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
      default:
        return (
          <AdminHomePage
            page={pageToEdit}
            setPages={setPages}
            onEditField={handleEditFieldOnPage}
            onMoveSection={handleMoveSectionOnPage}
            onDeleteSection={handleDeleteSectionOnPage}
          />
        );
    }
  };

  const renderVisualEditorPage = () => {
    const pageToEdit = pages.find(p => p.id === adminActivePageId) || pages[0];

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
                } else if (keys.length === 4 && keys[1] === 'stats') {
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  const statsCopy = [...updatedSection.content.stats];
                  statsCopy[index] = { ...statsCopy[index], [subKey]: value };
                  updatedSection.content = { ...updatedSection.content, stats: statsCopy };
                } else if (keys.length === 4 && keys[1] === 'cards') {
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  const cardsCopy = [...updatedSection.content.cards];
                  cardsCopy[index] = { ...cardsCopy[index], [subKey]: value };
                  updatedSection.content = { ...updatedSection.content, cards: cardsCopy };
                } else if (keys.length === 4 && keys[1] === 'steps') {
                  const index = parseInt(keys[2], 10);
                  const subKey = keys[3];
                  const stepsCopy = [...updatedSection.content.steps];
                  stepsCopy[index] = { ...stepsCopy[index], [subKey]: value };
                  updatedSection.content = { ...updatedSection.content, steps: stepsCopy };
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
        templateContent = { stats: [ { id: "stat-a", label: "Students", count: "500+" }, { id: "stat-b", label: "Success Rate", count: "98%" } ] };
      } else if (type === 'services-grid') {
        templateContent = { services: [ { id: "s-t1", title: "Job Coaching", desc: "Expert placement advice and resume creation." } ], ctaTitle: "Start Now", ctaDesc: "Begin training today", ctaBtnText: "Enquire" };
      } else if (type === 'companies-grid') {
        templateContent = { ctaTitle: "Looking to recruit?", ctaDesc: "Hire from our alumni pool", ctaBtnText: "Hire" };
      } else if (type === 'timeline') {
        templateContent = { steps: [ { id: "stp-1", num: "01", label: "Start", desc: "Sign up and begin" } ] };
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

  const activePage = pages.find(p => p.id === currentPageId) || pages[0];

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
              window.location.hash = '#/superadmin/dashboard';
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
                {/* Embedded dynamic admin header toolbar */}
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
                  {mongoDbStatus === 'connected' ? (
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900 px-2.5 py-1 rounded">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                      <span>MongoDB Connected</span>
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
                </div>

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
                      onClick={handleResetDatabase}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-rose-400 hover:text-rose-300 rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Reset database to original static templates"
                    >
                      Reset Draft Data
                    </button>
                  </div>
                </div>

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

