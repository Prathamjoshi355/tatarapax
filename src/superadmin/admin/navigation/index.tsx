import React, { useState } from 'react';
import { GlobalSettings, HeaderConfig, FooterConfig, NavItemConfig, ExploreDropdownItemConfig, FooterColumnConfig, FooterLinkItem, MediaItem } from '../../../types';
import { DEFAULT_HEADER_CONFIG, DEFAULT_FOOTER_CONFIG } from '../../../lib/defaultNavigation';
import {
  Menu,
  Sliders,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link as LinkIcon,
  Globe,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Terminal,
  Newspaper,
  Megaphone,
  Bell,
  Mail,
  Phone,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface AdminNavigationPageProps {
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  media?: MediaItem[];
}

export default function AdminNavigationPage({
  settings,
  setSettings,
  media = []
}: AdminNavigationPageProps) {
  // Tabs: logo, primaryNav, dropdown, cta, footerBrand, footerColumns
  const [activeTab, setActiveTab] = useState<'logo' | 'primaryNav' | 'dropdown' | 'cta' | 'footerBrand' | 'footerColumns'>('primaryNav');

  // Local working copy of Header & Footer configs
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => {
    return {
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
        : DEFAULT_HEADER_CONFIG.exploreMoreItems
    };
  });

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    return {
      ...DEFAULT_FOOTER_CONFIG,
      ...(settings.footerConfig || {}),
      brandTitle: settings.footerConfig?.brandTitle || settings.logoText || DEFAULT_FOOTER_CONFIG.brandTitle,
      corporateHQ: settings.footerConfig?.corporateHQ || settings.address || DEFAULT_FOOTER_CONFIG.corporateHQ,
      columns: settings.footerConfig?.columns && settings.footerConfig.columns.length > 0
        ? settings.footerConfig.columns
        : DEFAULT_FOOTER_CONFIG.columns
    };
  });

  // Social media copy
  const [socialMedia, setSocialMedia] = useState({
    facebook: settings.socialMedia?.facebook || '',
    twitter: settings.socialMedia?.twitter || '',
    linkedin: settings.socialMedia?.linkedin || '',
    instagram: settings.socialMedia?.instagram || '',
    youtube: settings.socialMedia?.youtube || '',
    whatsapp: settings.socialMedia?.whatsapp || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Icon options available for Explore More dropdown items
  const ICON_OPTIONS = [
    { name: 'GraduationCap', label: 'Graduation Cap', icon: GraduationCap },
    { name: 'Building2', label: 'Building (Partners)', icon: Building2 },
    { name: 'Briefcase', label: 'Briefcase (Services)', icon: Briefcase },
    { name: 'Award', label: 'Award (Partnerships)', icon: Award },
    { name: 'BookOpen', label: 'Book (LMS/Resources)', icon: BookOpen },
    { name: 'Calendar', label: 'Calendar (Workshops)', icon: Calendar },
    { name: 'Terminal', label: 'Terminal (Courses)', icon: Terminal },
    { name: 'Newspaper', label: 'Newspaper (Blog)', icon: Newspaper },
    { name: 'Megaphone', label: 'Megaphone (Ambassador)', icon: Megaphone },
    { name: 'ShieldCheck', label: 'Shield Check', icon: ShieldCheck },
    { name: 'Sparkles', label: 'Sparkles', icon: Sparkles }
  ];

  // Helper to render icon preview
  const renderIcon = (iconName?: string) => {
    const found = ICON_OPTIONS.find(i => i.name === iconName);
    if (found) {
      const Component = found.icon;
      return <Component className="w-4 h-4" />;
    }
    return <Sparkles className="w-4 h-4" />;
  };

  // --- Handlers for Primary Nav ---
  const handleUpdatePrimaryNavItem = (index: number, field: keyof NavItemConfig, value: any) => {
    const items = [...(headerConfig.primaryNavItems || [])];
    if (items[index]) {
      items[index] = { ...items[index], [field]: value };
      setHeaderConfig(prev => ({ ...prev, primaryNavItems: items }));
    }
  };

  const handleAddPrimaryNavItem = () => {
    const items = [...(headerConfig.primaryNavItems || [])];
    const newItem: NavItemConfig = {
      id: `nav-${Date.now()}`,
      label: "New Link",
      link: "#/",
      highlight: false,
      highlightText: "NEW",
      isVisible: true,
      order: items.length + 1
    };
    setHeaderConfig(prev => ({ ...prev, primaryNavItems: [...items, newItem] }));
  };

  const handleDeletePrimaryNavItem = (index: number) => {
    const items = [...(headerConfig.primaryNavItems || [])];
    if (items.length <= 1) {
      alert("At least one navigation link must remain in the navbar.");
      return;
    }
    items.splice(index, 1);
    setHeaderConfig(prev => ({ ...prev, primaryNavItems: items }));
  };

  const handleMovePrimaryNavItem = (index: number, direction: 'up' | 'down') => {
    const items = [...(headerConfig.primaryNavItems || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setHeaderConfig(prev => ({ ...prev, primaryNavItems: items }));
  };

  // --- Handlers for Dropdown Menu Items ---
  const handleUpdateDropdownItem = (index: number, field: keyof ExploreDropdownItemConfig, value: any) => {
    const items = [...(headerConfig.exploreMoreItems || [])];
    if (items[index]) {
      items[index] = { ...items[index], [field]: value };
      setHeaderConfig(prev => ({ ...prev, exploreMoreItems: items }));
    }
  };

  const handleAddDropdownItem = () => {
    const items = [...(headerConfig.exploreMoreItems || [])];
    const newItem: ExploreDropdownItemConfig = {
      id: `exp-${Date.now()}`,
      label: "New Explore Item",
      desc: "Brief description of page or program",
      link: "#/",
      iconName: "Sparkles",
      isVisible: true
    };
    setHeaderConfig(prev => ({ ...prev, exploreMoreItems: [...items, newItem] }));
  };

  const handleDeleteDropdownItem = (index: number) => {
    const items = [...(headerConfig.exploreMoreItems || [])];
    items.splice(index, 1);
    setHeaderConfig(prev => ({ ...prev, exploreMoreItems: items }));
  };

  // --- Handlers for Footer Columns & Links ---
  const handleUpdateColumnTitle = (colIndex: number, newTitle: string) => {
    const cols = [...(footerConfig.columns || [])];
    if (cols[colIndex]) {
      cols[colIndex] = { ...cols[colIndex], title: newTitle };
      setFooterConfig(prev => ({ ...prev, columns: cols }));
    }
  };

  const handleUpdateFooterLink = (colIndex: number, linkIndex: number, field: keyof FooterLinkItem, value: any) => {
    const cols = [...(footerConfig.columns || [])];
    if (cols[colIndex] && cols[colIndex].links[linkIndex]) {
      const links = [...cols[colIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      cols[colIndex] = { ...cols[colIndex], links };
      setFooterConfig(prev => ({ ...prev, columns: cols }));
    }
  };

  const handleAddFooterLink = (colIndex: number) => {
    const cols = [...(footerConfig.columns || [])];
    if (cols[colIndex]) {
      const newLink: FooterLinkItem = {
        id: `link-${Date.now()}`,
        label: "New Footer Link",
        link: "#/"
      };
      cols[colIndex] = {
        ...cols[colIndex],
        links: [...cols[colIndex].links, newLink]
      };
      setFooterConfig(prev => ({ ...prev, columns: cols }));
    }
  };

  const handleDeleteFooterLink = (colIndex: number, linkIndex: number) => {
    const cols = [...(footerConfig.columns || [])];
    if (cols[colIndex]) {
      const links = [...cols[colIndex].links];
      links.splice(linkIndex, 1);
      cols[colIndex] = { ...cols[colIndex], links };
      setFooterConfig(prev => ({ ...prev, columns: cols }));
    }
  };

  // --- Save Changes to MongoDB & Settings ---
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("Saving Navigation & Footer configurations to MongoDB...");

    const updatedSettings: GlobalSettings = {
      ...settings,
      logoText: headerConfig.logoText || settings.logoText,
      logoSubText: headerConfig.logoSubText || settings.logoSubText,
      logoUrl: headerConfig.logoUrl || settings.logoUrl,
      address: footerConfig.corporateHQ || settings.address,
      headerCtaText: headerConfig.ctaButtonText || settings.headerCtaText,
      headerCtaLink: headerConfig.ctaButtonLink || settings.headerCtaLink,
      socialMedia: {
        ...socialMedia
      },
      headerConfig: {
        ...headerConfig
      },
      footerConfig: {
        ...footerConfig
      }
    };

    try {
      // Update parent React state
      setSettings(updatedSettings);

      // Direct write to /api/save-all
      const res = await fetch('/api/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updatedSettings })
      });
      const data = await res.json();

      if (data.success) {
        setSaveStatus("Navbar & Footer settings saved & synced with MongoDB!");
      } else {
        setSaveStatus(data.msg || "Saved to local system.");
      }
    } catch (err: any) {
      setSaveStatus("Saved in browser storage and local active state.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleResetDefaults = () => {
    const confirmReset = window.confirm("Are you sure you want to reset all Navbar and Footer settings to canonical defaults?");
    if (confirmReset) {
      setHeaderConfig(DEFAULT_HEADER_CONFIG);
      setFooterConfig(DEFAULT_FOOTER_CONFIG);
      setSaveStatus("Reset to default settings. Click 'Save & Publish' to persist.");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen pb-28">
      {/* 1. Header Masthead Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                System Global Config
              </span>
              <span className="text-xs text-slate-400 font-mono">Scope: Header & Footer Layout</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Menu className="w-6 h-6 text-blue-400" />
              <span>Navbar & Footer Studio / Visual Config</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Control logo branding, primary navigation links, Explore More dropdown, CTA buttons, announcement strip, footer columns, and legal links.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleResetDefaults}
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Reset to default links"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <a
              href="#/"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Site</span>
            </a>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="py-2 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save & Publish to MongoDB"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {saveStatus && (
          <div className="max-w-7xl mx-auto mt-3 py-2 px-4 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-blue-400" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* 2. Navigation Studio Tab Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveTab('primaryNav')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'primaryNav'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Top Navbar Links ({headerConfig.primaryNavItems?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('dropdown')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dropdown'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Explore More Dropdown ({headerConfig.exploreMoreItems?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'logo'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Brand Logo & Layout</span>
          </button>

          <button
            onClick={() => setActiveTab('cta')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'cta'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>CTA Button & Announcement Strip</span>
          </button>

          <button
            onClick={() => setActiveTab('footerColumns')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'footerColumns'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Footer Navigation Columns ({footerConfig.columns?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('footerBrand')}
            className={`py-2 px-4 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'footerBrand'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Footer Brand, Badges & Social Links</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="max-w-7xl mx-auto px-6 pt-6">

        {/* TAB 1: Primary Navbar Links */}
        {activeTab === 'primaryNav' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Top Desktop Navigation Links</h2>
                <p className="text-xs text-slate-400">
                  Control the primary links rendered horizontally across the top navigation bar.
                </p>
              </div>

              <button
                onClick={handleAddPrimaryNavItem}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Navbar Link</span>
              </button>
            </div>

            <div className="space-y-3">
              {(headerConfig.primaryNavItems || []).map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.isVisible ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMovePrimaryNavItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMovePrimaryNavItem(idx, 'down')}
                        disabled={idx === (headerConfig.primaryNavItems?.length || 0) - 1}
                        className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-blue-400 w-6 text-center">
                      #{idx + 1}
                    </span>

                    <div className="flex-1 md:w-48">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdatePrimaryNavItem(idx, 'label', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="e.g. Upcoming Placements"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full md:flex-1">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">Target Link / Route</label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) => handleUpdatePrimaryNavItem(idx, 'link', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                        placeholder="#/upcoming-drives"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={!!item.highlight}
                          onChange={(e) => handleUpdatePrimaryNavItem(idx, 'highlight', e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>Highlight Badge</span>
                      </label>
                    </div>

                    {item.highlight && (
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">Badge Text</label>
                        <input
                          type="text"
                          value={item.highlightText || 'ACTIVE'}
                          onChange={(e) => handleUpdatePrimaryNavItem(idx, 'highlightText', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-emerald-400 font-bold"
                          placeholder="ACTIVE"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleUpdatePrimaryNavItem(idx, 'isVisible', !item.isVisible)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        item.isVisible
                          ? 'bg-slate-800 text-slate-300 hover:text-white'
                          : 'bg-slate-800/40 text-slate-600 hover:text-slate-400'
                      }`}
                      title={item.isVisible ? "Visible on Navbar" : "Hidden from Navbar"}
                    >
                      {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeletePrimaryNavItem(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Explore More Dropdown */}
        {activeTab === 'dropdown' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dropdown Trigger Button Title
              </label>
              <input
                type="text"
                value={headerConfig.exploreMoreTitle || 'Explore More'}
                onChange={(e) => setHeaderConfig(prev => ({ ...prev, exploreMoreTitle: e.target.value }))}
                placeholder="Explore More"
                className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Displayed on the top navbar with a chevron dropdown indicator</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Dropdown Menu Items ({headerConfig.exploreMoreItems?.length || 0})</h2>
                <p className="text-xs text-slate-400">Programs, resources, and dynamic sub-pages housed inside the dropdown panel.</p>
              </div>

              <button
                onClick={handleAddDropdownItem}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dropdown Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(headerConfig.exploreMoreItems || []).map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-xl p-4 transition-all flex flex-col justify-between gap-3 ${
                    item.isVisible ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400">
                        {renderIcon(item.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateDropdownItem(idx, 'label', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-xs font-bold text-white block outline-none"
                          placeholder="Item Label"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateDropdownItem(idx, 'isVisible', !item.isVisible)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          item.isVisible ? 'text-slate-400 hover:text-white' : 'text-slate-600'
                        }`}
                        title={item.isVisible ? "Visible" : "Hidden"}
                      >
                        {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteDropdownItem(idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Sub-Description</label>
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleUpdateDropdownItem(idx, 'desc', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                      placeholder="Brief one-line summary..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Link Destination</label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) => handleUpdateDropdownItem(idx, 'link', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                        placeholder="#/page-slug"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Icon Representation</label>
                      <select
                        value={item.iconName || 'Sparkles'}
                        onChange={(e) => handleUpdateDropdownItem(idx, 'iconName', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white cursor-pointer"
                      >
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.name} value={opt.name}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Logo & Brand Settings */}
        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-400">
                <Globe className="w-4 h-4" />
                <span>Navbar Brand Logo & Identity</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brand Logo Main Name
                  </label>
                  <input
                    type="text"
                    value={headerConfig.logoText || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, logoText: e.target.value }))}
                    placeholder="TantraPex"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Renders next to the logo image in both header and footer</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brand Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={headerConfig.logoSubText || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, logoSubText: e.target.value }))}
                    placeholder="YOUR CAREER, OUR PRIORITY"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Brand Logo Image URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={headerConfig.logoUrl || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  {headerConfig.logoUrl && (
                    <div className="p-2 bg-white rounded-lg shrink-0 border border-slate-700">
                      <img src={headerConfig.logoUrl} alt="Logo Preview" className="h-7 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CTA Button & Announcement Strip */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            {/* Header CTA Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>Header Call-to-Action Button</span>
              </h2>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={headerConfig.showCtaButton !== false}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, showCtaButton: e.target.checked }))}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Show Primary Action Button on Desktop Header</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={headerConfig.ctaButtonText || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, ctaButtonText: e.target.value }))}
                    placeholder="Explore Placement Drives"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Button Link / Route
                  </label>
                  <input
                    type="text"
                    value={headerConfig.ctaButtonLink || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, ctaButtonLink: e.target.value }))}
                    placeholder="#/upcoming-drives"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Optional Announcement Strip */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-400">
                <Bell className="w-4 h-4" />
                <span>Top Announcement Notification Strip</span>
              </h2>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!headerConfig.showAnnouncementBar}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, showAnnouncementBar: e.target.checked }))}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Enable Floating Announcement Strip above the Header</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Announcement Message
                  </label>
                  <input
                    type="text"
                    value={headerConfig.announcementText || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, announcementText: e.target.value }))}
                    placeholder="📢 Applications open for Batch 2025-26 Placement Drives!"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Announcement Target Link
                  </label>
                  <input
                    type="text"
                    value={headerConfig.announcementLink || ''}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, announcementLink: e.target.value }))}
                    placeholder="#/upcoming-drives"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Footer Navigation Columns */}
        {activeTab === 'footerColumns' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Footer Navigation Link Columns</h2>
              <p className="text-xs text-slate-400">Manage the quick links, legal pages, and student resource directories rendered in the footer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(footerConfig.columns || []).map((col, colIdx) => (
                <div key={col.id || `col-${colIdx}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex-1 mr-3">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Column #{colIdx + 1} Title</label>
                      <input
                        type="text"
                        value={col.title}
                        onChange={(e) => handleUpdateColumnTitle(colIdx, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-bold text-white"
                        placeholder="Column Title"
                      />
                    </div>
                    <button
                      onClick={() => handleAddFooterLink(colIdx)}
                      className="py-1 px-2.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0 mt-3"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {col.links.map((linkItem, linkIdx) => (
                      <div key={linkItem.id} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <input
                          type="text"
                          value={linkItem.label}
                          onChange={(e) => handleUpdateFooterLink(colIdx, linkIdx, 'label', e.target.value)}
                          className="flex-1 bg-transparent border-0 text-xs text-white font-medium outline-none"
                          placeholder="Link Label"
                        />
                        <input
                          type="text"
                          value={linkItem.link}
                          onChange={(e) => handleUpdateFooterLink(colIdx, linkIdx, 'link', e.target.value)}
                          className="w-40 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 font-mono outline-none"
                          placeholder="#/page"
                        />
                        <button
                          onClick={() => handleDeleteFooterLink(colIdx, linkIdx)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Footer Brand, Badges & Social Links */}
        {activeTab === 'footerBrand' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-400">
                <Building2 className="w-4 h-4" />
                <span>Footer Company Description & Verification Badges</span>
              </h2>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Purpose Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={footerConfig.brandDesc || ''}
                  onChange={(e) => setFooterConfig(prev => ({ ...prev, brandDesc: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corporate HQ Address</label>
                  <input
                    type="text"
                    value={footerConfig.corporateHQ || ''}
                    onChange={(e) => setFooterConfig(prev => ({ ...prev, corporateHQ: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Support Desk Contact</label>
                  <input
                    type="text"
                    value={footerConfig.officialDesk || ''}
                    onChange={(e) => setFooterConfig(prev => ({ ...prev, officialDesk: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Verification Badge 1</label>
                  <input
                    type="text"
                    value={footerConfig.badge1Text || ''}
                    onChange={(e) => setFooterConfig(prev => ({ ...prev, badge1Text: e.target.value }))}
                    placeholder="ISO 9001:2015 Placement Standard"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Verification Badge 2</label>
                  <input
                    type="text"
                    value={footerConfig.badge2Text || ''}
                    onChange={(e) => setFooterConfig(prev => ({ ...prev, badge2Text: e.target.value }))}
                    placeholder="Verified Placement Cell"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Copyright Notice</label>
                <input
                  type="text"
                  value={footerConfig.copyrightText || ''}
                  onChange={(e) => setFooterConfig(prev => ({ ...prev, copyrightText: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-400">
                <Globe className="w-4 h-4" />
                <span>Social Media Profiles</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={socialMedia.linkedin}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">WhatsApp Contact (Number or Link)</label>
                  <input
                    type="text"
                    value={socialMedia.whatsapp}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="+91 98765 43210 or https://wa.me/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Twitter / X URL</label>
                  <input
                    type="text"
                    value={socialMedia.twitter}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="https://x.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={socialMedia.instagram}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={socialMedia.youtube}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={socialMedia.facebook}
                    onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
