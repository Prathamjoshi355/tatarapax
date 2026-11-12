import React, { useState, useEffect, useMemo } from 'react';
import { PlacementDrive, GlobalSettings } from '../../types';
import {
  findDriveBySlugOrId,
  isDriveExpired,
  DEFAULT_PLACEMENT_DRIVES_LIST
} from '../../lib/defaultDrives';
import DriveApplicationModal from '../../components/drives/DriveApplicationModal';
import {
  Building2,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Check,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

interface PublicDriveDetailPageProps {
  slug?: string | null;
  drives?: PlacementDrive[];
  settings?: GlobalSettings;
  onNavigateBack?: () => void;
}

/**
 * Formatted description parser supporting bold, italics, links, and bullet items
 */
function FormattedDescription({ text }: { text: string }) {
  if (!text) {
    return <p className="text-slate-500 italic text-sm">No detailed description provided for this drive.</p>;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Section heading detection (starts with # or ends with :)
        if (trimmed.startsWith('#') || (trimmed.endsWith(':') && trimmed.length < 60)) {
          const cleanHeading = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm uppercase tracking-wide pt-2 border-b border-slate-100 pb-1">
              {cleanHeading}
            </h4>
          );
        }

        // Bullet point detection
        if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
          const cleanBullet = trimmed.replace(/^[-*•]\s+|\d+\.\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-emerald-600 font-bold leading-5 select-none">•</span>
              <span className="flex-1">{cleanBullet}</span>
            </div>
          );
        }

        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
}

export default function PublicDriveDetailPage({
  slug,
  drives: propDrives = [],
  settings,
  onNavigateBack
}: PublicDriveDetailPageProps) {
  const [drive, setDrive] = useState<PlacementDrive | null>(() => {
    const localDrives = (() => {
      try {
        const saved = localStorage.getItem('tpx_placement_drives');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();
    return (
      findDriveBySlugOrId(propDrives, slug) ||
      findDriveBySlugOrId(localDrives, slug) ||
      findDriveBySlugOrId(DEFAULT_PLACEMENT_DRIVES_LIST, slug)
    );
  });
  const [loading, setLoading] = useState<boolean>(!drive);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationRefId, setApplicationRefId] = useState<string | null>(null);

  // Sync when propDrives changes or slug changes
  useEffect(() => {
    const localDrives = (() => {
      try {
        const saved = localStorage.getItem('tpx_placement_drives');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const allKnown = [...propDrives, ...localDrives, ...DEFAULT_PLACEMENT_DRIVES_LIST];
    const matched = findDriveBySlugOrId(allKnown, slug);

    if (matched) {
      setDrive(matched);
      setFetchError(null);
      setLoading(false);
      return;
    }

    if (slug) {
      setLoading(true);
      setFetchError(null);

      // 1. Fetch directly by slug
      fetch(`/api/placement-drives/${encodeURIComponent(slug)}`)
        .then(async (res) => {
          if (!res.ok) {
            // Secondary fallback: fetch all placement drives in case slug differs in DB
            const allRes = await fetch('/api/placement-drives?all=true');
            if (allRes.ok) {
              const allJson = await allRes.json();
              if (allJson.success && Array.isArray(allJson.drives)) {
                const foundInAll = findDriveBySlugOrId(allJson.drives, slug);
                if (foundInAll) {
                  return { success: true, drive: foundInAll };
                }
              }
            }
            throw new Error("Placement drive not found");
          }
          return res.json();
        })
        .then(data => {
          if (data && data.success && data.drive) {
            setDrive(data.drive);
            setFetchError(null);
          } else {
            setFetchError(data?.msg || "Placement drive not found");
          }
        })
        .catch(err => {
          // One final check: in case propDrives or localStorage updated while waiting
          const recheckLocal = (() => {
            try {
              const saved = localStorage.getItem('tpx_placement_drives');
              return saved ? JSON.parse(saved) : [];
            } catch {
              return [];
            }
          })();
          const lateMatch = findDriveBySlugOrId([...propDrives, ...recheckLocal], slug);
          if (lateMatch) {
            setDrive(lateMatch);
            setFetchError(null);
          } else {
            setFetchError(err.message || "Failed to load placement drive");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug, propDrives]);

  // Update page title dynamically
  useEffect(() => {
    if (drive) {
      const company = drive.companyName || 'Corporate Partner';
      document.title = `${drive.title} at ${company} | TantraPex Placement Drive`;
    } else {
      document.title = "Placement Drive | TantraPex";
    }
  }, [drive]);

  const handleApplyClick = () => {
    if (!drive) return;
    if (drive.applyMode === 'google-form' && drive.googleFormUrl) {
      window.open(drive.googleFormUrl, '_blank');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      window.location.hash = '#/upcoming-drives';
    }
  };

  // Selection process steps
  const selectionSteps = useMemo(() => {
    if (!drive?.selectionProcess) return [];
    return drive.selectionProcess
      .split(/\+|,|\band\b|->|→/i)
      .map(s => s.trim())
      .filter(Boolean);
  }, [drive?.selectionProcess]);

  // Skills list
  const skillsList = useMemo(() => {
    if (!drive?.skills) return [];
    return drive.skills
      .split(/[,|•/]/)
      .map(s => s.trim())
      .filter(Boolean);
  }, [drive?.skills]);

  const isExpired = drive ? isDriveExpired(drive) : false;
  const isOnCampus = drive?.driveType === 'on-campus';

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-slate-600">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <h2 className="text-base font-bold text-slate-800">Loading placement drive details...</h2>
        <p className="text-xs text-slate-400 mt-1">Fetching official drive information from database</p>
      </div>
    );
  }

  // 2. Drive Not Found State
  if (!drive) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Placement Drive Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The placement drive link you followed (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{slug}</code>) might be invalid, archived, or temporarily unavailable.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setFetchError(null);
                fetch('/api/placement-drives?all=true')
                  .then(r => r.json())
                  .then(d => {
                    if (d.success && Array.isArray(d.drives)) {
                      const found = findDriveBySlugOrId(d.drives, slug);
                      if (found) {
                        setDrive(found);
                      }
                    }
                  })
                  .catch(() => {})
                  .finally(() => setLoading(false));
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 bg-[#2e6c00] hover:bg-[#255700] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Browse All Active Placement Drives
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-[#191c1f] font-sans antialiased pb-20">
      
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="w-full bg-[#f2f4f8] border-b border-[#e0e2e6]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#80d64b] text-[#092100]">
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600">
              Verified Corporate Placement Drive
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">
              TantraPex Corporate Intake Portal
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>Student Registration Fee:</span>
            <strong className="text-emerald-700 font-bold">₹0.00 Guaranteed</strong>
          </div>
        </div>
      </div>

      {/* 2. BREADCRUMBS & TOP NAV BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Placement Drives</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN HERO CONTAINER */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left: Company Logo & Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {drive.companyLogo ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-200 bg-white p-2 flex items-center justify-center shrink-0 shadow-xs">
                  <img src={drive.companyLogo} alt={drive.companyName} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                  <Building2 className="w-8 h-8 text-emerald-400" />
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                    {drive.companyName || 'Corporate Partner'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" /> Verified Partner
                  </span>
                  {isOnCampus ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                      On-Campus (Exclusive)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                      Off-Campus (Open for All)
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                  {drive.title}
                </h1>

                {/* Key metadata pills */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {drive.categoryLabel || drive.category || 'General Hiring'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {drive.location || 'Pan India'} {drive.workMode ? `(${drive.workMode})` : ''}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-mono font-bold text-emerald-700">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    {drive.salary || 'As per Industry Standards'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Apply Action Card */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              {isExpired ? (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> Applications Closed
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-1">Deadline expired on {drive.deadline}</span>
                </div>
              ) : isOnCampus ? (
                <div className="text-right space-y-1">
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
                  >
                    Partner College Network Only
                  </button>
                  <span className="block text-[10px] text-slate-400">Restricted to enrolled college cohorts</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2e6c00] hover:bg-[#255700] text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#80d64b]" />
                  <span>Apply for this Drive</span>
                </button>
              )}

              {/* Deadline reminder */}
              {drive.deadline && !isExpired && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {drive.deadline}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 4. KEY SPECIFICATIONS & ELIGIBILITY GRID */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Key Specifications & Candidate Eligibility</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
            {/* Compensation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Compensation (CTC)
              </span>
              <span className="text-base font-extrabold text-emerald-700 block">
                {drive.salary || 'As per Industry Standards'}
              </span>
              {drive.salarySubtext && (
                <span className="text-[11px] text-slate-500 block mt-0.5">{drive.salarySubtext}</span>
              )}
            </div>

            {/* Experience */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Experience Level
              </span>
              <span className="text-sm font-bold text-slate-800 block">
                {drive.experience || 'Freshers / Any Experience'}
              </span>
            </div>

            {/* Eligible Batches */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Eligible Batches
              </span>
              <span className="text-sm font-bold text-slate-800 block">
                {drive.eligibleBatch || 'All Batches Eligible'}
              </span>
            </div>

            {/* Eligible Degree */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Eligible Degree & Stream
              </span>
              <span className="text-xs font-semibold text-slate-800 block">
                {drive.eligibleDegree || 'Any Graduate / Postgraduate'}
              </span>
            </div>

            {/* Academic Criteria / CGPA */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Academic Cut-off / CGPA
              </span>
              <span className="text-xs font-semibold text-slate-800 block">
                {drive.minCgpa || 'No minimum percentage required'}
              </span>
            </div>

            {/* Location & Work Mode */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Workplace Location & Mode
              </span>
              <span className="text-xs font-semibold text-slate-800 block">
                {drive.location || 'Pan India'} {drive.workMode ? `• ${drive.workMode}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* 5. JOB DESCRIPTION & DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Role Description & Responsibilities</span>
          </h2>
          <FormattedDescription text={drive.description || ''} />
        </div>

        {/* 6. SELECTION PROCESS & REQUIRED SKILLS */}
        {(selectionSteps.length > 0 || skillsList.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Selection Process Roadmap */}
            {selectionSteps.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3.5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Selection & Assessment Rounds
                </h3>
                <div className="space-y-2.5 pt-1">
                  {selectionSteps.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desired Skills Chips */}
            {skillsList.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3.5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Desired Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. WHATSAPP UPDATES GROUP (IF CONFIGURED) */}
        {drive.whatsappGroupUrl && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                Direct Candidate Channel
              </span>
              <h3 className="text-base font-bold text-emerald-950">
                Join Official Drive WhatsApp Group
              </h3>
              <p className="text-xs text-emerald-700">
                Receive instant notifications about exam links, shortlist announcements, and interview slots directly from our coordinators.
              </p>
            </div>
            <a
              href={drive.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        )}

        {/* 8. ZERO-FEE CHARTER & TRANSPARENCY GUARANTEE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">
              TantraPex Zero-Fee Transparency Guarantee
            </h4>
            <p className="text-slate-600 leading-relaxed">
              TantraPex Technologies maintains a strict zero-charge policy for candidate registrations, online test links, and corporate panel interviews. Candidates are never asked for application fees or processing charges.
            </p>
          </div>
        </div>

        {/* 9. BOTTOM ACTION APPLY BANNER */}
        {!isExpired && !isOnCampus && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Career Intake Portal
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Ready to Apply for {drive.title}?
              </h3>
              <p className="text-xs text-slate-300">
                Submit your official profile & resume in under 2 minutes. Free and verified.
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyClick}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              Apply for this Drive Now
            </button>
          </div>
        )}

      </div>

      {/* 10. STICKY MOBILE APPLY BAR */}
      {!isExpired && !isOnCampus && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Package</span>
            <span className="text-xs font-bold text-emerald-700 font-mono">{drive.salary || 'Competitive CTC'}</span>
          </div>

          <button
            type="button"
            onClick={handleApplyClick}
            className="flex-1 max-w-[200px] py-2.5 bg-[#2e6c00] text-white font-bold text-xs rounded-xl shadow transition-colors text-center"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* 11. APPLICATION MODAL */}
      {isApplyModalOpen && (
        <DriveApplicationModal
          drive={drive}
          onClose={() => setIsApplyModalOpen(false)}
          onApplicationSuccess={(refId) => {
            setApplicationRefId(refId);
            setIsApplyModalOpen(false);
          }}
        />
      )}

      {/* 12. SUCCESS DIALOG */}
      {applicationRefId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Application Submitted Successfully!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your application for <strong>{drive.title}</strong> at <strong>{drive.companyName}</strong> has been registered with reference ID:
            </p>
            <div className="bg-slate-100 py-2 px-3 rounded-lg font-mono font-bold text-sm text-slate-900">
              {applicationRefId}
            </div>
            <p className="text-[11px] text-slate-400">
              Our placement team and corporate recruiters will review your credentials and contact you directly with testing instructions.
            </p>
            <button
              type="button"
              onClick={() => setApplicationRefId(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

