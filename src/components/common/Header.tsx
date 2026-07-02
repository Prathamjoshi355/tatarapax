import React, { useState, useEffect } from 'react';
import { GlobalSettings, CMSPage } from '../../types';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  settings: GlobalSettings;
  pages: CMSPage[];
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
}

export default function Header({
  settings,
  pages,
  currentPageId,
  setCurrentPageId,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Resolve and sort menu items
  const menuItems = settings.menuItems
    ? [...settings.menuItems]
        .filter((item) => item.isVisible !== false)
        .sort((a, b) => a.order - b.order)
    : pages.map((p, i) => ({
        id: `fallback-${p.id}`,
        label: p.title,
        pageId: p.id,
        order: i,
        isVisible: true,
      }));

  // Group items to fit on laptop/desktop screens without wrapping
  const maxPrimaryItems = 5;
  const showMoreDropdown = menuItems.length > 6; // only group if total is more than 6
  const primaryItems = showMoreDropdown ? menuItems.slice(0, maxPrimaryItems) : menuItems;
  const dropdownItems = showMoreDropdown ? menuItems.slice(maxPrimaryItems) : [];

  const isDropdownActive = dropdownItems.some((item) => item.pageId === currentPageId);

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);


  return (
   <header className="sticky top-0 z-50 w-full bg-[#071B4D] border-b border-blue-900 shadow-lg">
      {/* Top micro-bar for premium feel */}
      <div className="w-full px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Logo Brand Block */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          onClick={() => setCurrentPageId('home')}
          id="nav-logo"
        >
         <div className="h-9 w-9 rounded-lg flex items-center justify-center font-display font-black text-lg shadow-md border bg-white border-white text-[#071B4D]">
            TP
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-sm md:text-base xl:text-lg tracking-tight leading-none uppercase text-white">
              {settings.logoText || "TANTRAPEX"}
            </span>
            <span className="text-[7px] xl:text-[8px] font-sans font-bold tracking-widest mt-1 uppercase text-slate-300">
              {settings.logoSubText || "YOUR CAREER, OUR PRIORITY"}
            </span> 
          </div>
        </div>

        {/* Navigation Links for Desktop & Laptop */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 max-w-xl xl:max-w-2xl 2xl:max-w-4xl flex-nowrap overflow-visible">
          {primaryItems.map((item) => {
            const isActive = currentPageId === item.pageId;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.pageId}`}
                onClick={() => setCurrentPageId(item.pageId)}
                className={`px-1.5 xl:px-3 py-1.5 xl:py-2 rounded-lg font-sans text-[10px] xl:text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider transition-all duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "text-[#F7C400] bg-white/10 border-b-2 border-[#F7C400]"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {showMoreDropdown && (
            <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
              <button
                id="nav-item-more"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`px-1.5 xl:px-3 py-1.5 xl:py-2 rounded-lg font-sans text-[10px] xl:text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider transition-all duration-150 flex items-center gap-0.5 xl:gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                  isDropdownActive
                    ? "text-[#F7C400] bg-white/10 border-b-2 border-[#F7C400]"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>More</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 pt-2 w-48 z-50"
                  >
                    <div className="bg-[#071B4D] border border-blue-900 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1">
                      {dropdownItems.map((item) => {
                        const isActive = currentPageId === item.pageId;
                        return (
                          <button
                            key={item.id}
                            id={`nav-item-${item.pageId}`}
                            onClick={() => {
                              setCurrentPageId(item.pageId);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg font-sans text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "text-[#071B4D] bg-[#F7C400]"
                                : "text-slate-200 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {item.label}
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

        {/* Right CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dynamic CTA button */}
          <button
            id="nav-cta"
            onClick={() => setCurrentPageId(settings.headerCtaLink || 'contact')}
            className="hidden sm:flex items-center gap-1.5 px-3 xl:px-5 py-2 xl:py-2.5 bg-[#F7C400] text-[#071B4D] font-sans font-extrabold text-[10px] xl:text-xs uppercase tracking-wider rounded-lg transition-all duration-150 hover:bg-[#e2b400] shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{settings.headerCtaText || "Enquire Now"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile menu burger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-inner py-4 px-4 flex flex-col gap-2 animate-fadeIn">
          {menuItems.map((item) => {
            const isActive = currentPageId === item.pageId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPageId(item.pageId);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#071B4D] bg-[#071B4D]/5 font-extrabold'
                    : 'text-slate-600 hover:text-[#071B4D] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="h-px bg-slate-100 my-2" />
          <button
            onClick={() => {
              setCurrentPageId(settings.headerCtaLink || 'contact');
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 bg-[#F7C400] text-[#071B4D] font-bold text-center rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow cursor-pointer"
          >
            <span>{settings.headerCtaText || "Enquire Now"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </header>
  );
}
