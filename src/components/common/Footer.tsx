import React from 'react';
import { GlobalSettings, CMSPage, FooterConfig } from '../../types';
import { DEFAULT_FOOTER_CONFIG } from '../../lib/defaultNavigation';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, CheckCircle2, MessageSquare } from 'lucide-react';

interface FooterProps {
  settings: GlobalSettings;
  pages: CMSPage[];
  setCurrentPageId: (id: string) => void;
  viewMode: 'live' | 'visual' | 'admin' | 'superadmin';
}

export default function Footer({
  settings,
  pages,
  setCurrentPageId,
  viewMode
}: FooterProps) {
  // Configured footer settings with fallbacks
  const cfg: FooterConfig = {
    ...DEFAULT_FOOTER_CONFIG,
    ...(settings.footerConfig || {}),
    brandTitle: settings.footerConfig?.brandTitle || settings.logoText || DEFAULT_FOOTER_CONFIG.brandTitle,
    corporateHQ: settings.footerConfig?.corporateHQ || settings.address || DEFAULT_FOOTER_CONFIG.corporateHQ,
    columns: settings.footerConfig?.columns && settings.footerConfig.columns.length > 0
      ? settings.footerConfig.columns
      : DEFAULT_FOOTER_CONFIG.columns
  };

  const navigateToPage = (pageId: string) => {
    if (pageId.startsWith('#') && !pageId.startsWith('#/')) {
      try {
        const el = document.querySelector(pageId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } catch {}
    }
    const cleanId = (pageId || '').replace(/^[#/]+/, '').trim() || 'home';
    setCurrentPageId(cleanId);
    const nextHash = cleanId === 'home' ? '#/' : `#/${cleanId}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (rawLink: string) => {
    if (!rawLink) return;
    if (rawLink.startsWith('mailto:') || rawLink.startsWith('tel:') || rawLink.startsWith('http://') || rawLink.startsWith('https://')) {
      window.open(rawLink, '_blank', 'noopener,noreferrer');
      return;
    }
    navigateToPage(rawLink);
  };

  if (viewMode === 'admin') return null;

  const logoSrc = settings.headerConfig?.logoUrl || settings.logoUrl || "https://res.cloudinary.com/dhy9pmo8s/image/upload/v1791973693/Untitled_design_3_hez3tf-removebg-preview_igasef.png";

  return (
    <footer className="w-full bg-white text-slate-700 border-t border-slate-200 font-sans">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-10 border-b border-slate-200">

          {/* Column 1 & 2: Brand, Purpose & HQ */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateToPage('home')}>
              <img
                src={logoSrc}
                alt="TantraPex Technologies Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-extrabold text-lg text-slate-900 font-display">
                {cfg.brandTitle || settings.logoText || "TantraPex Technologies"}
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {cfg.brandDesc || "Beyond Placement. Building Careers. Empowering Corporates. India's First Private Placement Cell connecting university talent with leading enterprise recruitment drives."}
            </p>

            <div className="space-y-1.5 text-xs text-slate-500 pt-1">
              {cfg.corporateHQ && (
                <div>
                  <strong className="text-slate-800">Corporate HQ:</strong> {cfg.corporateHQ}
                </div>
              )}
              {cfg.officialDesk && (
                <div>
                  <strong className="text-slate-800">Official Desk:</strong> {cfg.officialDesk}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {cfg.badge1Text && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-200 uppercase tracking-wider">
                  {cfg.badge1Text}
                </span>
              )}
              {cfg.badge2Text && (
                <span className="px-2.5 py-1 bg-[#80d64b] text-[#092100] text-[11px] font-bold rounded uppercase tracking-wider">
                  {cfg.badge2Text}
                </span>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2 pt-2">
              {settings.socialMedia?.facebook && (
                <a href={settings.socialMedia.facebook} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-[#80d64b] hover:text-[#092100] rounded-lg transition-colors text-slate-600" title="Facebook">
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialMedia?.twitter && (
                <a href={settings.socialMedia.twitter} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-[#80d64b] hover:text-[#092100] rounded-lg transition-colors text-slate-600" title="Twitter / X">
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialMedia?.linkedin && (
                <a href={settings.socialMedia.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-[#80d64b] hover:text-[#092100] rounded-lg transition-colors text-slate-600" title="LinkedIn">
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialMedia?.instagram && (
                <a href={settings.socialMedia.instagram} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-[#80d64b] hover:text-[#092100] rounded-lg transition-colors text-slate-600" title="Instagram">
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialMedia?.youtube && (
                <a href={settings.socialMedia.youtube} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-[#80d64b] hover:text-[#092100] rounded-lg transition-colors text-slate-600" title="YouTube">
                  <Youtube className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialMedia?.whatsapp && (
                <a href={settings.socialMedia.whatsapp.startsWith('http') ? settings.socialMedia.whatsapp : `https://wa.me/${settings.socialMedia.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 hover:bg-[#80d64b] hover:text-[#092100] rounded-lg transition-colors text-slate-600" title="WhatsApp">
                  <MessageSquare className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Navigation Columns (e.g. Placement Quick Links, Institutional & Legal, etc.) */}
          {(cfg.columns || []).map((col) => (
            <div key={col.id} className="space-y-3 text-left">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {(col.links || []).map((linkItem) => (
                  <li key={linkItem.id}>
                    <button
                      onClick={() => handleLinkClick(linkItem.link)}
                      className="hover:text-slate-900 hover:translate-x-0.5 transition-all text-left cursor-pointer"
                    >
                      {linkItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {cfg.copyrightText || `© ${new Date().getFullYear()} TantraPex Technologies Pvt Ltd. All rights reserved.`}
          </div>
          <div className="flex items-center gap-4 text-xs">
            {cfg.bottomCategoryText && (
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{cfg.bottomCategoryText}</span>
              </span>
            )}
            {cfg.supportDeskEmail && (
              <a
                href={`mailto:${cfg.supportDeskEmail}`}
                className="hover:text-slate-900 transition-colors font-semibold"
              >
                {cfg.supportDeskLabel || "Contact Desk"}
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
