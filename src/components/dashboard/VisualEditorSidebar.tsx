import React from 'react';
import { CMSPage, CMSSection } from '../../types';
import { 
  X, Palette, ArrowUp, ArrowDown, Copy, Trash2, Plus, Layout, EyeOff, Sparkles, Sliders
} from 'lucide-react';

interface VisualEditorSidebarProps {
  page: CMSPage;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  onUpdateSectionDesign: (sectionId: string, designUpdates: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (type: string) => void;
}

export default function VisualEditorSidebar({
  page,
  selectedSectionId,
  setSelectedSectionId,
  onUpdateSectionDesign,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onAddSection
}: VisualEditorSidebarProps) {
  
  const selectedSection = page.sections.find(s => s.id === selectedSectionId);

  const colorsPreset = [
    { name: "Midnight", bg: "#0b1329", heading: "#ffffff", text: "#e2e8f0" },
    { name: "Clean Light", bg: "#ffffff", heading: "#0f172a", text: "#475569" },
    { name: "Soft Offwhite", bg: "#f8fafc", heading: "#0f172a", text: "#334155" },
    { name: "Deep Charcoal", bg: "#0f172a", heading: "#ffffff", text: "#cbd5e1" },
    { name: "Emerald Mint", bg: "#f0fdf4", heading: "#14532d", text: "#166534" },
    { name: "Sunset Gold", bg: "#fffbeb", heading: "#78350f", text: "#92400e" }
  ];

  return (
    <div className="w-80 shrink-0 bg-slate-900 text-white border-l border-slate-800 h-screen sticky top-0 flex flex-col font-sans text-xs select-none shadow-2xl overflow-y-auto custom-scrollbar">
      {/* Editor Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="font-bold uppercase tracking-wider text-slate-300">Layout & Design Studio</span>
        </div>
        {selectedSectionId && (
          <button 
            onClick={() => setSelectedSectionId(null)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* SECTION BUILDER: Add new sections */}
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-3 flex items-center gap-1.5">
          <Layout className="h-3 w-3" />
          <span>Add Dynamic Block</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Hero Block', type: 'hero' },
            { label: 'Stats Banner', type: 'stats' },
            { label: 'Core Services', type: 'services-grid' },
            { label: 'Hiring Grid', type: 'companies-grid' },
            { label: 'Timeline', type: 'timeline' },
            { label: 'Course Tabs', type: 'courses-tabs' }
          ].map((block) => (
            <button
              key={block.type}
              onClick={() => onAddSection(block.type)}
              className="px-3 py-2 bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded text-left font-semibold transition-all flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>{block.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Block Customizer */}
      {selectedSection ? (
        <div className="flex-1 p-4 flex flex-col gap-6">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">Editing Active Block</span>
            <h4 className="text-sm font-bold text-white mt-1 uppercase">{selectedSection.title || selectedSection.type}</h4>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">ID: {selectedSection.id}</span>
          </div>

          {/* Quick Order Actions */}
          <div className="flex flex-col gap-2">
            <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Block Position Actions</h5>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => onMoveSection('up', selectedSection.id)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex flex-col items-center gap-1 font-semibold transition-colors"
                title="Move Section Up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span>Up</span>
              </button>
              <button
                onClick={() => onMoveSection('down', selectedSection.id)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex flex-col items-center gap-1 font-semibold transition-colors"
                title="Move Section Down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
                <span>Down</span>
              </button>
              <button
                onClick={() => onDuplicateSection(selectedSection.id)}
                className="p-2 bg-slate-800 hover:bg-amber-600 text-slate-200 rounded flex flex-col items-center gap-1 font-semibold transition-colors"
                title="Duplicate / Clone Block"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Clone</span>
              </button>
              <button
                onClick={() => onDeleteSection(selectedSection.id)}
                className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-200 rounded flex flex-col items-center gap-1 font-semibold transition-colors"
                title="Delete Block"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Color palette selections */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
              <Palette className="h-3.5 w-3.5 text-blue-400" />
              <span>Theme Presets</span>
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {colorsPreset.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => onUpdateSectionDesign(selectedSection.id, {
                    backgroundColor: preset.bg,
                    headingColor: preset.heading,
                    textColor: preset.text
                  })}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 hover:border-slate-500 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold text-slate-300 text-[10px]">{preset.name}</span>
                  <div className="flex gap-1 mt-1">
                    <div className="h-3 w-3 rounded-full border border-slate-600" style={{ backgroundColor: preset.bg }} />
                    <div className="h-3 w-3 rounded-full border border-slate-600" style={{ backgroundColor: preset.heading }} />
                    <div className="h-3 w-3 rounded-full border border-slate-600" style={{ backgroundColor: preset.text }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Style parameters (border-radius, paddings, animations) */}
          <div className="flex flex-col gap-4">
            <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-blue-400" />
              <span>Block Micro-Settings</span>
            </h5>

            {/* Custom Color Pickers */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Background Hex Color</span>
                <input 
                  type="color" 
                  value={selectedSection.design.backgroundColor}
                  onChange={(e) => onUpdateSectionDesign(selectedSection.id, { backgroundColor: e.target.value })}
                  className="bg-transparent h-6 w-8 border-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Heading Text Color</span>
                <input 
                  type="color" 
                  value={selectedSection.design.headingColor}
                  onChange={(e) => onUpdateSectionDesign(selectedSection.id, { headingColor: e.target.value })}
                  className="bg-transparent h-6 w-8 border-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Body Text Color</span>
                <input 
                  type="color" 
                  value={selectedSection.design.textColor}
                  onChange={(e) => onUpdateSectionDesign(selectedSection.id, { textColor: e.target.value })}
                  className="bg-transparent h-6 w-8 border-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Core Button Accent</span>
                <input 
                  type="color" 
                  value={selectedSection.design.buttonColor}
                  onChange={(e) => onUpdateSectionDesign(selectedSection.id, { buttonColor: e.target.value })}
                  className="bg-transparent h-6 w-8 border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Border Radius dropdown */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="font-semibold text-slate-300">Border Sharpness</label>
              <select
                value={selectedSection.design.borderRadius}
                onChange={(e) => onUpdateSectionDesign(selectedSection.id, { borderRadius: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-100 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="0px">Sharp (0px)</option>
                <option value="4px">Soft (4px)</option>
                <option value="8px">Medium Rounded (8px)</option>
                <option value="12px">Comfortable Rounded (12px)</option>
                <option value="20px">Extreme Rounded (20px)</option>
              </select>
            </div>

            {/* Motion Animation selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Active Motion Animation</label>
              <select
                value={selectedSection.design.animation}
                onChange={(e) => onUpdateSectionDesign(selectedSection.id, { animation: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-100 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="none">No Animation (Instant)</option>
                <option value="fade">Fade In (Gentle)</option>
                <option value="slide">Slide Up (Staggered)</option>
                <option value="zoom">Scale Zoom (Elastic)</option>
                <option value="bounce">Bounce In (Playful)</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 text-center flex flex-col items-center justify-center text-slate-500 gap-3">
          <EyeOff className="h-8 w-8 text-slate-600" />
          <p className="font-semibold text-slate-400">No Block Selected</p>
          <p className="text-[11px] leading-relaxed">
            Click on any heading, block background, or item in the preview screen to activate design properties!
          </p>
          <div className="w-full h-px bg-slate-800 my-4" />
          <div className="text-left w-full">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Quick Page Structure:</span>
            <div className="flex flex-col gap-1.5 mt-2">
              {page.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-between text-[11px] font-mono font-medium transition-all"
                >
                  <span className="truncate">{sec.title || sec.type}</span>
                  <span className="text-[9px] text-blue-400 shrink-0 uppercase">[{sec.type}]</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
