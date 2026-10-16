import React, { useState, useEffect } from 'react';
import { PlacementDrive } from '../../types';
import DriveApplicationModal from '../drives/DriveApplicationModal';
import { Building2, MapPin, Calendar, Award, ArrowRight, Clock, Briefcase, CheckCircle2, X, Lock } from 'lucide-react';

interface UpcomingDrivesSectionProps {
  title?: string;
  subtitle?: string;
  maxDrives?: number;
}

export default function UpcomingDrivesSection({
  title = "Explore Upcoming Placement Drives",
  subtitle = "Apply to active corporate placement drives with zero application charges. Transparent eligibility and direct corporate panels.",
  maxDrives = 8
}: UpcomingDrivesSectionProps) {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeApplyingDrive, setActiveApplyingDrive] = useState<PlacementDrive | null>(null);
  const [detailDrive, setDetailDrive] = useState<PlacementDrive | null>(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/placement-drives');
      const data = await res.json();
      if (data.success && Array.isArray(data.drives)) {
        setDrives(data.drives);
      } else {
        setDrives([]);
      }
    } catch {
      setDrives([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedDrives = drives.slice(0, maxDrives);

  return (
    <section className="w-full bg-[#F8FAFC] py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-b border-slate-200" id="upcoming-drives-section">
      <div className="w-full max-w-[1720px] mx-auto space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] font-bold text-[#2e6c00] uppercase tracking-wider block">
              Corporate Intake Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">Live Opportunities:</span>
            <span className="px-2.5 py-0.5 bg-slate-900 text-white font-bold rounded-md text-xs font-mono">
              {drives.length} Active {drives.length === 1 ? 'Drive' : 'Drives'}
            </span>
          </div>
        </div>

        {/* Drives Content */}
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading active corporate drives...</span>
          </div>
        ) : displayedDrives.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2 shadow-sm">
            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-1">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 font-display">New placement opportunities will be announced soon.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our placement desk is coordinating upcoming national drives with corporate hiring partners. Check back shortly.
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${displayedDrives.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'} gap-4 lg:gap-5`}>
            {displayedDrives.map((drive) => {
              const isDeadlineSoon = drive.deadline && new Date(drive.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
              const isOnCampus = drive.driveType === 'on-campus';

              return (
                <div
                  key={drive.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3 hover:border-slate-300 hover:shadow-md transition-all text-left"
                >
                  <div className="space-y-3">
                    {/* Brand, Role & Package Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {drive.companyLogo ? (
                          <div className="w-10 h-10 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0">
                            <img src={drive.companyLogo} alt={drive.companyName} className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block truncate">
                              {drive.companyName || 'Corporate Partner'}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                              isOnCampus 
                                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {isOnCampus ? 'On-Campus' : 'Off-Campus'}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug truncate mt-0.5">
                            {drive.title}
                          </h3>
                        </div>
                      </div>

                      {drive.salary && (
                        <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shrink-0 text-right">
                          <span className="text-xs font-bold text-[#2e6c00] whitespace-nowrap">{drive.salary}</span>
                        </div>
                      )}
                    </div>

                    {/* Streamlined Inline Metadata Tags */}
                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] text-slate-600 border-y border-slate-100 py-2">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{drive.location || 'On-Site / Hybrid'}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{drive.eligibleDegree || 'Graduate'} {drive.eligibleBatch ? `(${drive.eligibleBatch})` : ''}</span>
                      </span>
                      {drive.deadline && (
                        <span className={`inline-flex items-center gap-1 font-semibold ${isDeadlineSoon ? 'text-rose-600' : 'text-slate-600'}`}>
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>Last Date: {drive.deadline}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    {isOnCampus ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Lock className="w-3 h-3 text-amber-600" />
                        Enrolled Students Only
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Registration Open
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailDrive(drive)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        Details
                      </button>

                      {isOnCampus ? (
                        <span
                          className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 font-bold rounded-lg text-xs flex items-center gap-1 cursor-default"
                          title="Direct public web application is restricted. Available for enrolled students."
                        >
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Campus Only</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveApplyingDrive(drive)}
                          className="px-3.5 py-1 bg-[#2e6c00] hover:bg-[#255700] text-white font-bold rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to view all drives */}
        <div className="pt-2 text-center">
          <a
            href="#/upcoming-drives"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            <span>View All Upcoming Placement Drives</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2e6c00]" />
          </a>
        </div>

      </div>

      {/* Details Modal */}
      {detailDrive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <button 
              onClick={() => setDetailDrive(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              {detailDrive.companyLogo ? (
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shrink-0">
                  <img src={detailDrive.companyLogo} alt={detailDrive.companyName} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{detailDrive.companyName || 'Corporate Partner'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    detailDrive.driveType === 'on-campus'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {detailDrive.driveType === 'on-campus' ? 'On-Campus (Exclusive)' : 'Off-Campus (Open)'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-0.5">{detailDrive.title}</h2>
                {detailDrive.salary && (
                  <span className="inline-block mt-1 font-bold text-sm text-[#2e6c00] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Package: {detailDrive.salary}
                  </span>
                )}
              </div>
            </div>

            {/* On-Campus Information Alert */}
            {detailDrive.driveType === 'on-campus' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900">
                <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-amber-800 block">
                    On-Campus Recruitment Opportunity
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This drive is conducted exclusively for candidates enrolled in our corporate partner programs and internal LMS. Direct public web registration is closed. Enrolled students should log in to their student LMS portal to access assessments and interview schedules.
                  </p>
                </div>
              </div>
            )}

            {/* Eligibility & Specification Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Eligible Degree & Branch</span>
                <span className="font-semibold text-slate-800">{detailDrive.eligibleDegree || 'Any Graduate'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Eligible Batch</span>
                <span className="font-semibold text-slate-800">{detailDrive.eligibleBatch || 'All Batches'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Location / Work Mode</span>
                <span className="font-semibold text-slate-800">{detailDrive.location || 'On-Site / Remote'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Application Deadline</span>
                <span className="font-bold text-rose-600">{detailDrive.deadline || 'Open'}</span>
              </div>
            </div>

            {/* Job Description */}
            {detailDrive.description && (
              <div className="space-y-1.5 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Role Description</h4>
                <p className="leading-relaxed whitespace-pre-line">{detailDrive.description}</p>
              </div>
            )}

            {/* Selection Process */}
            {detailDrive.selectionProcess && (
              <div className="space-y-1.5 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Selection Process</h4>
                <p className="leading-relaxed">{detailDrive.selectionProcess}</p>
              </div>
            )}

            {/* Required Skills */}
            {detailDrive.skills && (
              <div className="space-y-1.5 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Required Competencies</h4>
                <p className="leading-relaxed font-semibold">{detailDrive.skills}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-bold text-emerald-700">Zero Application Fee • Verified Corporate Partner</span>

              {detailDrive.driveType === 'on-campus' ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 border border-slate-300 text-slate-500 font-bold rounded-lg text-xs cursor-not-allowed flex items-center justify-center gap-1.5 shadow-none"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enrolled Students Only (Public Apply Closed)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const driveToApply = detailDrive;
                    setDetailDrive(null);
                    setActiveApplyingDrive(driveToApply);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2e6c00] hover:bg-[#255700] text-white font-bold rounded-lg text-xs shadow transition-colors"
                >
                  Apply for this Drive (Free)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {activeApplyingDrive && (
        <DriveApplicationModal
          drive={activeApplyingDrive}
          onClose={() => setActiveApplyingDrive(null)}
          onApplicationSuccess={() => {
            // Keep state clean
          }}
        />
      )}
    </section>
  );
}
