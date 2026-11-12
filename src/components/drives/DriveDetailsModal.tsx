import React, { useEffect, useMemo } from 'react';
import { PlacementDrive } from '../../types';
import {
  X,
  MapPin,
  Briefcase
} from 'lucide-react';

interface DriveDetailsModalProps {
  drive: PlacementDrive | null;
  onClose: () => void;
  onApply: (drive: PlacementDrive) => void;
}

/**
 * Parses inline formatting tags:
 * - Single asterisk *bold* or double asterisk **bold** -> <strong>
 * - Single underscore _italic_ -> <em>
 * - Double underscore __underline__ -> underline
 * - Single tilde ~strike~ -> <del>
 * - Raw URLs -> clickable <a>
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  if (!text) return [];

  const tokenRegex = /(\*\*[^*\n]+\*\*|\*[^*\n\s](?:[^*\n]*[^*\n\s])?\*|__[^_\n]+__|_[^_\n\s](?:[^_\n]*[^_\n\s])?_|~[^~\n]+~|https?:\/\/[^\s]+)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Double asterisk: **bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Single asterisk: *bold*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(1, -1)}
        </strong>
      );
    }

    // Double underscore: __underline__
    if (part.startsWith('__') && part.endsWith('__') && part.length >= 4) {
      return (
        <span key={index} className="underline decoration-slate-400 underline-offset-2">
          {part.slice(2, -2)}
        </span>
      );
    }

    // Single underscore: _italic_
    if (part.startsWith('_') && part.endsWith('_') && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Single tilde: ~strike~
    if (part.startsWith('~') && part.endsWith('~') && part.length >= 2) {
      return (
        <del key={index} className="line-through text-slate-400">
          {part.slice(1, -1)}
        </del>
      );
    }

    // URL link
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 underline font-medium hover:text-emerald-800 break-all"
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

/**
 * Formatted description component:
 * - Detects section headings (lines starting with # or ending with :)
 * - Detects bullet items (-, *, •, 1.)
 * - Formats inline bold (*word* and **word**), italic (_word_), underline (__word__), strike (~word~)
 * - Renders clean, readable paragraphs without layout breaking
 */
function FormattedDescription({ text }: { text: string }) {
  const parsedSections = useMemo(() => {
    if (!text || !text.trim()) return [];

    const rawLines = text.split(/\r?\n/).map(l => l.trimEnd());
    const elements: Array<{
      type: 'heading' | 'bullet' | 'paragraph';
      content: string;
    }> = [];

    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push({
          type: 'paragraph',
          content: currentParagraph.join(' ')
        });
        currentParagraph = [];
      }
    };

    const isHeading = (line: string): boolean => {
      const clean = line.trim();
      if (!clean) return false;
      if (/^#{1,4}\s+/.test(clean)) return true;
      if (clean.endsWith(':') && clean.length <= 70) return true;
      if (/^(about the (role|company|job)|responsibilities|key responsibilities|job description|requirements|qualifications|eligibility|what you'?ll do|who you are|perks|benefits|selection process|rounds|work mode|compensation & benefits)/i.test(clean)) {
        return true;
      }
      return false;
    };

    const cleanHeading = (line: string): string => {
      return line.trim().replace(/^#{1,4}\s+/, '').replace(/:$/, '');
    };

    const isBullet = (line: string): boolean => {
      const clean = line.trim();
      return /^([•\-\*▪▫]|\d+[\.\)]|[a-zA-Z][\.\)])\s+/.test(clean);
    };

    const cleanBullet = (line: string): string => {
      return line.trim().replace(/^([•\-\*▪▫]|\d+[\.\)]|[a-zA-Z][\.\)])\s+/, '');
    };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();

      if (!line) {
        flushParagraph();
        continue;
      }

      if (isHeading(line)) {
        flushParagraph();
        elements.push({ type: 'heading', content: cleanHeading(line) });
        continue;
      }

      if (isBullet(line)) {
        flushParagraph();
        elements.push({ type: 'bullet', content: cleanBullet(line) });
        continue;
      }

      currentParagraph.push(line);
    }

    flushParagraph();
    return elements;
  }, [text]);

  if (!text || !text.trim()) {
    return (
      <p className="text-slate-400 italic text-xs">
        No specific description provided for this placement drive. Please review the eligibility specifications above.
      </p>
    );
  }

  return (
    <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
      {parsedSections.map((sec, idx) => {
        if (sec.type === 'heading') {
          return (
            <div key={idx} className="pt-3 pb-1 border-b border-slate-100">
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-slate-700 rounded-sm shrink-0" />
                <span>{sec.content}</span>
              </h5>
            </div>
          );
        }

        if (sec.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              <div className="text-slate-700 leading-relaxed flex-1">
                {parseInlineFormatting(sec.content)}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {parseInlineFormatting(sec.content)}
          </p>
        );
      })}
    </div>
  );
}

export default function DriveDetailsModal({
  drive,
  onClose,
  onApply
}: DriveDetailsModalProps) {
  // Always call hooks unconditionally at the very top
  useEffect(() => {
    if (!drive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drive, onClose]);

  const selectionSteps = useMemo(() => {
    if (!drive?.selectionProcess) return [];
    const parts = drive.selectionProcess
      .split(/\s*(?:\+|->|→|,|\/)\s*/)
      .map(s => s.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : [drive.selectionProcess];
  }, [drive?.selectionProcess]);

  const skillsList = useMemo(() => {
    if (!drive?.skills) return [];
    return drive.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [drive?.skills]);

  // Early return after all hooks
  if (!drive) return null;

  const isOnCampus = drive.driveType === 'on-campus';

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drive-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800">

        {/* 1. FIXED MODAL HEADER (Matte, Humanized, Clean) */}
        <header className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {/* Company Logo or Initials */}
            {drive.companyLogo ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shrink-0">
                <img
                  src={drive.companyLogo}
                  alt={drive.companyName || 'Company'}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
                {(drive.companyName || 'D').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Title & Organization Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-700">
                  {drive.companyName || 'Corporate Partner'}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    isOnCampus
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isOnCampus ? 'On-Campus Exclusive' : 'Off-Campus Drive'}
                </span>
              </div>

              <h2
                id="drive-modal-title"
                className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-display"
                title={drive.title}
              >
                {drive.title}
              </h2>

              {(drive.location || drive.workMode) && (
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  {drive.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.location}</span>
                    </span>
                  )}
                  {drive.workMode && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.workMode}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 2. SCROLLABLE SINGLE COLUMN BODY */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">

          {/* On-Campus Alert (only if on-campus) */}
          {isOnCampus && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
              <span className="font-bold block mb-0.5">On-Campus Recruitment Opportunity</span>
              <p className="leading-relaxed text-amber-800">
                This drive is conducted exclusively for students enrolled in our partner college network and career cohorts. Direct public applications are closed.
              </p>
            </div>
          )}

          {/* Key Specifications Grid (Single column container with clean matte boxes) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 pb-2 border-b border-slate-200">
              Drive Overview & Eligibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {/* Compensation */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Compensation (CTC)
                </span>
                <span className="text-sm font-bold text-emerald-700 block">
                  {drive.salary || 'As per Industry Standards'}
                </span>
                {drive.salarySubtext && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">{drive.salarySubtext}</span>
                )}
              </div>

              {/* Required Experience */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Required Experience
                </span>
                <span className="text-sm font-bold text-slate-800 block">
                  {drive.experience || 'Freshers / Any Experience'}
                </span>
              </div>

              {/* Eligible Batch */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Eligible Batch
                </span>
                <span className="text-sm font-bold text-slate-800 block">
                  {drive.eligibleBatch || 'All Batches Eligible'}
                </span>
              </div>

              {/* Eligible Degree */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Eligible Degree / Branch
                </span>
                <span className="text-xs font-semibold text-slate-800 block">
                  {drive.eligibleDegree || 'Any Graduate'}
                </span>
              </div>

              {/* Location & Work Mode */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Location & Work Mode
                </span>
                <span className="text-xs font-semibold text-slate-800 block">
                  {drive.location || 'Pan India'} {drive.workMode ? `• ${drive.workMode}` : ''}
                </span>
              </div>

              {/* Application Deadline */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Application Deadline
                </span>
                <span className="text-xs font-bold text-red-600 block">
                  {drive.deadline || 'Open / Rolling'}
                </span>
              </div>

              {/* Academic Criteria / CGPA (if specified) */}
              {drive.minCgpa && (
                <div className="bg-white border border-slate-200 rounded-lg p-3 sm:col-span-2 md:col-span-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Academic Cut-off / CGPA
                  </span>
                  <span className="text-xs font-semibold text-slate-800 block">
                    {drive.minCgpa}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Card (Single column full width) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
              Role Description & Details
            </h3>
            <FormattedDescription text={drive.description || ''} />
          </div>

          {/* Selection Process (if available) */}
          {selectionSteps.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Selection Process
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 text-xs"
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desired Skills (if available) */}
          {skillsList.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Desired Skills & Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-md border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* 3. FIXED MODAL FOOTER */}
        <footer className="px-5 sm:px-7 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium truncate">
            {drive.companyName ? `${drive.companyName} • ${drive.title}` : drive.title}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>

            {isOnCampus ? (
              <button
                type="button"
                disabled
                className="px-5 py-2 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-lg cursor-not-allowed"
              >
                Enrolled Students Only
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onApply(drive)}
                className="px-5 py-2 bg-[#2e6c00] hover:bg-[#255700] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Apply for this Drive
              </button>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
}
