import React from 'react';
import { GlobalSettings, CMSPage } from '../../types';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Star } from 'lucide-react';

interface FooterProps {
  settings: GlobalSettings;
  pages: CMSPage[];
  setCurrentPageId: (id: string) => void;
  viewMode: 'live' | 'visual' | 'admin';
}

export default function Footer({
  settings,
  pages,
  setCurrentPageId,
  viewMode
}: FooterProps) {
  if (viewMode === 'admin') return null;

  // Resolve and sort menu items for footer quick links
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
    <footer className="w-full bg-[#071B4D] text-slate-200 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Company Summary Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-white text-[#071B4D] rounded-lg flex items-center justify-center font-display font-black text-xl shadow-md">
              TP
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-white tracking-tight uppercase leading-none">
                {settings.logoText || "TENTRAPAX"}
              </span>
              <span className="text-[8px] font-sans font-medium text-slate-400 tracking-wider uppercase mt-1">
                {settings.logoSubText || "YOUR CAREER, OUR PRIORITY"}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Tentrapax is a premier career development and placement consultancy helping students build premium technical skills, crack demanding interviews, and enter leading MNC corporate roles.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2.5 mt-3">
            {settings.socialMedia.facebook && (
              <a href={settings.socialMedia.facebook} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/60 hover:bg-[#F7C400] hover:text-[#071B4D] rounded-md transition-all text-slate-300">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.socialMedia.twitter && (
              <a href={settings.socialMedia.twitter} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/60 hover:bg-[#F7C400] hover:text-[#071B4D] rounded-md transition-all text-slate-300">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {settings.socialMedia.linkedin && (
              <a href={settings.socialMedia.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/60 hover:bg-[#F7C400] hover:text-[#071B4D] rounded-md transition-all text-slate-300">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {settings.socialMedia.instagram && (
              <a href={settings.socialMedia.instagram} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/60 hover:bg-[#F7C400] hover:text-[#071B4D] rounded-md transition-all text-slate-300">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.socialMedia.youtube && (
              <a href={settings.socialMedia.youtube} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/60 hover:bg-[#F7C400] hover:text-[#071B4D] rounded-md transition-all text-slate-300">
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-5 pb-1 border-b border-white/10 w-fit">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setCurrentPageId(item.pageId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F7C400] transition-colors text-left font-medium"
                >
                  &rsaquo; {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services Summary Column */}
        <div>
          <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-5 pb-1 border-b border-white/10 w-fit">
            Core Services
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>&bull; Quantitative & Logical Aptitude</li>
            <li>&bull; Java & Python Development</li>
            <li>&bull; Data Structures & Algorithms (DSA)</li>
            <li>&bull; Professional ATS Resume Engineering</li>
            <li>&bull; Simulated Mock Interview Panels</li>
            <li>&bull; Corporate Placement Assurances</li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-5 pb-1 border-b border-white/10 w-fit">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#F7C400] shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors">{settings.phone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#F7C400] shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors">{settings.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#F7C400] shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors leading-snug">{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Render Google Rating widget dynamically inside footer */}
          <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-2 text-[11px] mt-1">
            <div className="flex text-[#F7C400]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="font-bold text-white">Google {settings.googleRatingValue || "4.8"} Stars</span>
            <span className="opacity-60">({settings.googleRatingTitle || "Verified Reviews"})</span>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-white/5 bg-[#041030] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <span>
            &copy; 2026 Tentrapax Career Development and Placement Consultancy. All rights reserved.
          </span>
          <span className="flex items-center gap-3">
            <a href="#privacy" className="hover:text-[#F7C400]">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#terms" className="hover:text-[#F7C400]">Terms of Use</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
