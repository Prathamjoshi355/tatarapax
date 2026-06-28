import React, { useState, useEffect } from 'react';
import { GlobalSettings, CMSPage } from '../../types';
import { Menu, X, ArrowRight } from 'lucide-react';

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


  return (
   <header className="sticky top-0 z-50 w-full bg-[#071B4D] border-b border-blue-900 shadow-lg">
      {/* Top micro-bar for premium feel */}
      <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo Brand Block */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentPageId('home')}
          id="nav-logo"
        >
         <div className="h-10 w-10 rounded-lg flex items-center justify-center font-display font-black text-xl shadow-md border bg-white border-white text-[#071B4D]">
            TP
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight leading-none uppercase text-white">
              {settings.logoText || "TENTRAPAX"}
            </span>
            <span className="text-[8px] font-sans font-bold tracking-widest mt-1 uppercase text-slate-300">
              {settings.logoSubText || "YOUR CAREER, OUR PRIORITY"}
            </span> 
          </div>
        </div>

        {/* Navigation Links for Desktop & Tablet */}
        <nav className="hidden xl:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = currentPageId === item.pageId;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.pageId}`}
                onClick={() => setCurrentPageId(item.pageId)}
                className={`px-3 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
  isActive
    ? "text-[#F7C400] bg-white/10 border-b-2 border-[#F7C400]"
    : "text-slate-200 hover:text-white hover:bg-white/10"
}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* Dynamic CTA button */}
          <button
            id="nav-cta"
            onClick={() => setCurrentPageId(settings.headerCtaLink || 'contact')}
            className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 bg-[#F7C400] text-[#071B4D] font-sans font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all duration-150 hover:bg-[#e2b400] shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>{settings.headerCtaText || "Enquire Now"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile menu burger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Panel */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white shadow-inner py-4 px-4 flex flex-col gap-2 animate-fadeIn">
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
