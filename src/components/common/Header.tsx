import React, { useState, useEffect, useRef } from 'react';
import { GlobalSettings, CMSPage, HeaderConfig } from '../../types';
import { DEFAULT_HEADER_CONFIG } from '../../lib/defaultNavigation';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Building2,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Terminal,
  Newspaper,
  Megaphone,
  Bell,
  Code2,
  Bookmark,
  Compass,
  FileText,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  settings: GlobalSettings;
  pages: CMSPage[];
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
}

// Icon dictionary for dynamic Explore More items
const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  Building2,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Terminal,
  Newspaper,
  Megaphone,
  Bell,
  Code2,
  Bookmark,
  Compass,
  FileText,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle
};

export default function Header({
  settings,
  pages,
  currentPageId,
  setCurrentPageId,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active header config with fallback
  const cfg: HeaderConfig = {
    ...DEFAULT_HEADER_CONFIG,
    ...(settings.headerConfig || {}),
    logoText: settings.headerConfig?.logoText || settings.logoText || DEFAULT_HEADER_CONFIG.logoText,
    logoSubText: settings.headerConfig?.logoSubText || settings.logoSubText || DEFAULT_HEADER_CONFIG.logoSubText,
    logoUrl: settings.headerConfig?.logoUrl || settings.logoUrl || DEFAULT_HEADER_CONFIG.logoUrl,
    primaryNavItems: settings.headerConfig?.primaryNavItems && settings.headerConfig.primaryNavItems.length > 0
      ? settings.headerConfig.primaryNavItems
      : DEFAULT_HEADER_CONFIG.primaryNavItems,
    exploreMoreItems: settings.headerConfig?.exploreMoreItems && settings.headerConfig.exploreMoreItems.length > 0
      ? settings.headerConfig.exploreMoreItems
      : DEFAULT_HEADER_CONFIG.exploreMoreItems,
  };

  const navigateToPage = (pageId: string) => {
    const cleanId = (pageId || '').replace(/^[#/]+/, '').trim() || 'home';
    setCurrentPageId(cleanId);
    const nextHash = cleanId === 'home' ? '#/' : `#/${cleanId}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setExploreDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (rawLink: string) => {
    if (!rawLink) return;
    if (rawLink.startsWith('http://') || rawLink.startsWith('https://') || rawLink.startsWith('mailto:') || rawLink.startsWith('tel:')) {
      window.open(rawLink, '_blank', 'noopener,noreferrer');
      setExploreDropdownOpen(false);
      setMobileMenuOpen(false);
      return;
    }
    let target = rawLink.replace(/^[#/]+/, '').trim();
    if (!target) target = 'home';
    navigateToPage(target);
  };

  // Helper to check if a link corresponds to the currently active page
  const isLinkActive = (rawLink: string) => {
    let clean = (rawLink || '').replace(/^[#/]+/, '').trim();
    if (!clean) clean = 'home';
    const currentClean = (currentPageId || '').replace(/^[#/]+/, '').trim() || 'home';
    return currentClean.toLowerCase() === clean.toLowerCase();
  };

  // Close dropdown on click outside
  useEffect(() => {
    if (!exploreDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [exploreDropdownOpen]);

  // Primary navigation items (filtered & sorted)
  const primaryNavItems = (cfg.primaryNavItems || DEFAULT_HEADER_CONFIG.primaryNavItems)
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Set of primary link targets to prevent duplicate items appearing in Explore More
  const primaryTargets = new Set(
    primaryNavItems.map(p => (p.link || '').replace(/^[#/]+/, '').trim() || 'home')
  );

  // Filter explore more items:
  // 1. Must be visible
  // 2. Must NOT be one of the top primary nav pages (Home, About Us, Upcoming Placements, Pricing, Contact Us)
  // 3. Must NOT be 'courses' (deleted as requested)
  const exploreMoreItems = (cfg.exploreMoreItems || DEFAULT_HEADER_CONFIG.exploreMoreItems)
    .filter((item) => {
      if (item.isVisible === false) return false;
      const target = (item.link || '').replace(/^[#/]+/, '').trim() || 'home';
      if (primaryTargets.has(target)) return false;
      if (target === 'courses' || target === 'career-courses') return false;
      return true;
    });

  const isExploreMoreActive = exploreMoreItems.some((item) => isLinkActive(item.link));

  const logoSrc = cfg.logoUrl || settings.logoUrl || DEFAULT_HEADER_CONFIG.logoUrl;

  return (
    <>
      {/* Optional Top Announcement Strip */}
      {cfg.showAnnouncementBar && cfg.announcementText && (
        <div className="w-full bg-[#0e2403] text-[#80d64b] py-2 px-4 text-xs font-semibold border-b border-[#1f4208] flex items-center justify-center gap-2 z-50">
          <span className="flex items-center gap-1.5 text-center">
            <span className="h-2 w-2 rounded-full bg-[#80d64b] animate-pulse shrink-0" />
            <span>{cfg.announcementText}</span>
          </span>
          {cfg.announcementLink && (
            <button
              onClick={() => handleLinkClick(cfg.announcementLink!)}
              className="underline text-white hover:text-[#a0ff66] transition-colors cursor-pointer text-[11px] font-bold ml-1.5 whitespace-nowrap"
            >
              Learn More &rarr;
            </button>
          )}
        </div>
      )}

      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs font-sans">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 h-16 md:h-20 flex items-center justify-between gap-6">

          {/* Left Side: Brand Logo + Desktop Navigation Left-Aligned Next to It */}
          <div className="flex items-center gap-6 xl:gap-8 min-w-0">
            <div
              className="flex items-center gap-2.5 cursor-pointer shrink-0"
              onClick={() => navigateToPage('home')}
              id="nav-logo"
            >
              <img
                src={logoSrc}
                alt="TantraPex Technologies Logo"
                className="h-8 sm:h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#111111] font-display leading-tight">
                  {cfg.logoText || 'TantraPex'}
                </span>
                {cfg.logoSubText && (
                  <span className="text-[8px] font-bold tracking-widest text-[#2e6c00] uppercase -mt-0.5">
                    {cfg.logoSubText}
                  </span>
                )}
              </div>
            </div>

            {/* Primary Desktop Navigation: 5 Core Pages + Filtered "Explore More" Dropdown */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {primaryNavItems.map((item) => {
                const isActive = isLinkActive(item.link);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.link)}
                    className={`text-xs xl:text-sm font-semibold py-1 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${isActive
                        ? 'text-[#2e6c00] font-bold border-b-2 border-[#2e6c00]'
                        : 'text-slate-700 hover:text-slate-900'
                      }`}
                  >
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#2e6c00] border border-emerald-200 uppercase tracking-wider leading-none">
                        {item.highlightText || 'Active'}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* "Explore More" Clickable Dropdown */}
              {exploreMoreItems.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="nav-explore-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExploreDropdownOpen(!exploreDropdownOpen);
                    }}
                    className={`text-xs xl:text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${exploreDropdownOpen || isExploreMoreActive
                        ? 'text-[#2e6c00] bg-slate-100 font-bold border border-slate-200'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    aria-haspopup="true"
                    aria-expanded={exploreDropdownOpen}
                  >
                    <span>{cfg.exploreMoreTitle || 'Explore More'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreDropdownOpen ? 'rotate-180 text-[#2e6c00]' : 'text-slate-500'
                        }`}
                    />
                  </button>

                  {/* Scale-out Scrollable Menu */}
                  <AnimatePresence>
                    {exploreDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full right-0 mt-2 w-80 max-h-[75vh] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-100 scrollbar-thin"
                      >
                        <div className="px-4 py-2 bg-[#F5F6F4] text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Institutional Portals &amp; Hubs</span>
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                            {exploreMoreItems.length} Portals
                          </span>
                        </div>

                        <div className="py-1">
                          {exploreMoreItems.map((item) => {
                            const isActive = isLinkActive(item.link);
                            const IconComp = (item.iconName && ICON_MAP[item.iconName]) || Compass;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleLinkClick(item.link)}
                                className={`w-full text-left px-4 py-2.5 transition-colors flex items-start gap-3 cursor-pointer ${isActive
                                    ? 'bg-slate-50 text-[#2e6c00]'
                                    : 'hover:bg-slate-50 text-slate-800'
                                  }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isActive
                                      ? 'bg-[#80d64b] text-[#092100]'
                                      : 'bg-[#F5F6F4] text-slate-700'
                                    }`}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className={`text-xs block font-bold leading-tight ${isActive ? 'text-[#2e6c00]' : 'text-slate-900'
                                        }`}
                                    >
                                      {item.label}
                                    </span>
                                    {isActive && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e6c00] shrink-0" />
                                    )}
                                  </div>
                                  {item.desc && (
                                    <span className="text-[11px] text-slate-500 block truncate leading-snug">
                                      {item.desc}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>
          </div>

          {/* Header Action: Controllable Brand CTA & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {cfg.showCtaButton !== false && (
              <button
                id="nav-cta-drives"
                onClick={() => handleLinkClick(cfg.ctaButtonLink || '#/upcoming-drives')}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#80d64b] hover:bg-[#72c242] text-[#092100] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>{cfg.ctaButtonText || 'Explore Placement Drives'}</span>
                <ArrowRight className="w-4 h-4 text-[#092100]" />
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white py-4 px-4 flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto shadow-inner animate-in fade-in duration-150">
            {/* Primary Nav Links */}
            {primaryNavItems.map((item) => {
              const isActive = isLinkActive(item.link);
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.link)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${isActive
                      ? 'bg-slate-100 text-[#2e6c00] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#2e6c00] border border-emerald-200 uppercase tracking-wider">
                      {item.highlightText || 'Active'}
                    </span>
                  )}
                </button>
              );
            })}

            {exploreMoreItems.length > 0 && (
              <>
                <div className="h-px bg-slate-200 my-1.5" />
                <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {cfg.exploreMoreTitle || 'Explore All Portals & Hubs'}
                </div>

                {/* All Filtered Explore More Pages */}
                {exploreMoreItems.map((item) => {
                  const isActive = isLinkActive(item.link);
                  const IconComp = (item.iconName && ICON_MAP[item.iconName]) || Compass;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.link)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${isActive
                          ? 'bg-slate-100 text-[#2e6c00] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{item.desc?.split('&')[0]?.trim()}</span>
                    </button>
                  );
                })}
              </>
            )}

            {cfg.showCtaButton !== false && (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <button
                  onClick={() => handleLinkClick(cfg.ctaButtonLink || '#/upcoming-drives')}
                  className="w-full py-2.5 bg-[#80d64b] text-[#092100] font-bold text-xs rounded-lg text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{cfg.ctaButtonText || 'Explore Placement Drives'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
