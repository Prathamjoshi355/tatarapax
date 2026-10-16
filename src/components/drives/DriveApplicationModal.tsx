import React, { useState, useMemo } from 'react';
import { PlacementDrive, DriveFormField, DEFAULT_DRIVE_FORM_FIELDS } from '../../types';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Building2,
  MapPin,
  Calendar,
  Award,
  Lock,
  RefreshCw,
  Paperclip
} from 'lucide-react';

interface DriveApplicationModalProps {
  drive: PlacementDrive | null;
  onClose: () => void;
  onApplicationSuccess?: (refId: string) => void;
}

interface UploadedDocState {
  url: string;
  fileName: string;
  publicId?: string;
  uploading?: boolean;
  error?: string;
}

export default function DriveApplicationModal({
  drive,
  onClose,
  onApplicationSuccess
}: DriveApplicationModalProps) {
  if (!drive) return null;

  // Active & Configured Form Fields
  const activeFields: DriveFormField[] = useMemo(() => {
    const fields = (drive.formFields && drive.formFields.length > 0)
      ? drive.formFields
      : DEFAULT_DRIVE_FORM_FIELDS;
    return fields.filter(f => f.enabled !== false);
  }, [drive.formFields]);

  // Initial Form Values
  const initialValues = useMemo(() => {
    const defaults: Record<string, any> = {
      fullName: '',
      phone: '',
      email: '',
      city: '',
      college: '',
      degree: '',
      branch: '',
      passingYear: drive.eligibleBatch?.includes('2024') ? '2024' : '2025',
      cgpa: '',
      sgpa: '',
      tenthMarks: '',
      twelfthMarks: '',
      experienceStatus: 'fresher',
      experienceDuration: '',
      experienceUnit: 'years',
      designation: '',
      previousOrganization: '',
      experienceSummary: '',
      skills: '',
      agreedToTerms: false
    };

    activeFields.forEach(f => {
      if (f.type !== 'file' && defaults[f.id] === undefined) {
        defaults[f.id] = f.type === 'select' && f.options && f.options.length > 0 ? f.options[0] : '';
      }
    });

    return defaults;
  }, [activeFields, drive.eligibleBatch]);

  // Form State
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  // Uploaded Documents State (keyed by field id: 'resume', 'photo', custom file fields)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocState>>({});

  // Status & Feedback States
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  // File Upload Handler (Strict 10MB limit enforcement per user instruction)
  const handleFileUpload = async (
    field: DriveFormField,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxMb = 10; // Exactly 10MB maximum limit
    if (file.size > maxMb * 1024 * 1024) {
      setUploadedDocs(prev => ({
        ...prev,
        [field.id]: {
          ...(prev[field.id] || { url: '', fileName: '' }),
          uploading: false,
          error: `File size exceeds the ${maxMb}MB limit. Please upload a smaller file.`
        }
      }));
      return;
    }

    // Validate file extension if allowedFileTypes is specified
    if (field.allowedFileTypes && field.allowedFileTypes.length > 0) {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      const isAllowed = field.allowedFileTypes.some(t => {
        const clean = t.trim().toLowerCase();
        return clean.startsWith('.') ? ext === clean : file.type.includes(clean);
      });

      if (!isAllowed) {
        setUploadedDocs(prev => ({
          ...prev,
          [field.id]: {
            ...(prev[field.id] || { url: '', fileName: '' }),
            uploading: false,
            error: `Invalid file format. Allowed formats: ${field.allowedFileTypes?.join(', ')}`
          }
        }));
        return;
      }
    }

    setUploadedDocs(prev => ({
      ...prev,
      [field.id]: {
        ...(prev[field.id] || { url: '', fileName: '' }),
        uploading: true,
        error: undefined
      }
    }));
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Data,
            fileName: file.name,
            folder: `Tantrapex/Drives/${drive.id || 'Documents'}`
          })
        });

        const data = await res.json();
        if (data.success && data.url) {
          setUploadedDocs(prev => ({
            ...prev,
            [field.id]: {
              url: data.url,
              fileName: file.name,
              publicId: data.public_id,
              uploading: false,
              error: undefined
            }
          }));
        } else {
          setUploadedDocs(prev => ({
            ...prev,
            [field.id]: {
              ...(prev[field.id] || { url: '', fileName: '' }),
              uploading: false,
              error: data.message || `Failed to upload ${field.label}.`
            }
          }));
        }
      } catch (err: any) {
        setUploadedDocs(prev => ({
          ...prev,
          [field.id]: {
            ...(prev[field.id] || { url: '', fileName: '' }),
            uploading: false,
            error: 'Server connection error during upload. Please try again.'
          }
        }));
      }
    };

    reader.onerror = () => {
      setUploadedDocs(prev => ({
        ...prev,
        [field.id]: {
          ...(prev[field.id] || { url: '', fileName: '' }),
          uploading: false,
          error: 'Could not read selected file from your computer.'
        }
      }));
    };

    reader.readAsDataURL(file);
  };

  // Group active fields into logical sections
  const personalFields = useMemo(() =>
    activeFields.filter(f => f.section === 'personal' && f.type !== 'file'),
    [activeFields]
  );

  const academicFields = useMemo(() =>
    activeFields.filter(f => f.section === 'academic' && f.type !== 'file'),
    [activeFields]
  );

  const experienceFields = useMemo(() =>
    activeFields.filter(f => f.section === 'experience' && f.type !== 'file'),
    [activeFields]
  );

  const customFields = useMemo(() =>
    activeFields.filter(f =>
      (f.section === 'custom' || (!f.section && !['fullName', 'phone', 'email', 'city', 'college', 'degree', 'branch', 'passingYear', 'cgpa', 'sgpa', 'tenthMarks', 'twelfthMarks', 'skills', 'experienceStatus', 'experienceSummary', 'resume', 'photo'].includes(f.id))) &&
      f.type !== 'file'
    ),
    [activeFields]
  );

  const fileFields = useMemo(() =>
    activeFields.filter(f => f.type === 'file' || f.section === 'documents'),
    [activeFields]
  );

  // Field Input Change Helper
  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Render a Generic Form Input
  const renderFieldInput = (field: DriveFormField) => {
    const value = formValues[field.id] ?? '';

    if (field.type === 'select') {
      return (
        <select
          value={value}
          required={field.required}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-xs"
        >
          <option value="">Select {field.label}...</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          rows={3}
          required={field.required}
          placeholder={field.placeholder || `Enter ${field.label}...`}
          value={value}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
        />
      );
    }

    return (
      <input
        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : field.type === 'date' ? 'date' : 'text'}
        required={field.required}
        placeholder={field.placeholder || `Enter ${field.label}...`}
        value={value}
        onChange={(e) => handleInputChange(field.id, e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 text-xs"
      />
    );
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate any active file uploads currently in progress
    const isAnyFileUploading = Object.values(uploadedDocs).some(doc => doc.uploading);
    if (isAnyFileUploading) {
      setErrorMessage("Please wait until all files finish uploading before submitting.");
      return;
    }

    // Dynamic Validation across all configured active fields
    for (const field of activeFields) {
      if (field.required) {
        if (field.type === 'file') {
          const doc = uploadedDocs[field.id];
          if (!doc || !doc.url) {
            setErrorMessage(`Please upload the mandatory document: ${field.label}`);
            return;
          }
        } else {
          const val = formValues[field.id];
          if (val === undefined || val === null || String(val).trim() === '') {
            setErrorMessage(`Please provide a value for mandatory field: ${field.label}`);
            return;
          }
        }
      }
    }

    // Additional specific sanity checks
    if (formValues.phone && formValues.phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (formValues.email && (!formValues.email.includes('@') || !formValues.email.includes('.'))) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formValues.agreedToTerms) {
      setErrorMessage("Please check and accept the candidate declaration to submit.");
      return;
    }

    setSubmitting(true);

    try {
      // Collect custom dynamic answers (excluding file fields)
      const dynamicResponses: Record<string, any> = {};
      activeFields.forEach(f => {
        if (f.type !== 'file' && formValues[f.id] !== undefined) {
          dynamicResponses[f.id] = formValues[f.id];
        }
      });

      // Collect all uploaded documents
      const uploadedFiles = fileFields
        .map(f => {
          const doc = uploadedDocs[f.id];
          if (doc && doc.url) {
            return {
              fieldId: f.id,
              label: f.label,
              url: doc.url,
              fileName: doc.fileName,
              publicId: doc.publicId
            };
          }
          return null;
        })
        .filter(Boolean);

      const resumeDoc = uploadedDocs['resume'];
      const photoDoc = uploadedDocs['photo'];

      const payload = {
        driveId: drive.id,
        companyId: drive.companyId,
        companyName: drive.companyName || '',
        driveTitle: drive.title,
        fullName: formValues.fullName || 'Candidate',
        phone: formValues.phone || '',
        email: formValues.email || '',
        city: formValues.city || '',
        college: formValues.college || '',
        degree: formValues.degree || '',
        branch: formValues.branch || '',
        passingYear: formValues.passingYear || '',
        cgpa: formValues.cgpa || '',
        sgpa: formValues.sgpa || '',
        tenthMarks: formValues.tenthMarks || '',
        twelfthMarks: formValues.twelfthMarks || '',
        experienceStatus: formValues.experienceStatus || 'fresher',
        experienceDuration: formValues.experienceDuration || '',
        experienceUnit: formValues.experienceUnit || 'years',
        designation: formValues.designation || '',
        previousOrganization: formValues.previousOrganization || '',
        experienceSummary: formValues.experienceSummary || '',
        skills: formValues.skills || '',
        resumeUrl: resumeDoc?.url || '',
        resumeFileName: resumeDoc?.fileName || '',
        resumePublicId: resumeDoc?.publicId || '',
        photoUrl: photoDoc?.url || '',
        photoPublicId: photoDoc?.publicId || '',
        dynamicResponses,
        uploadedFiles,
        agreedToTerms: true
      };

      const response = await fetch('/api/placement-applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let resJson: any = {};
      try {
        resJson = await response.json();
      } catch (parseErr) {
        const errText = await response.text().catch(() => '');
        resJson = { success: false, msg: errText || `Server responded with HTTP ${response.status} ${response.statusText}` };
      }

      if (resJson.success) {
        setSubmittedRefId(resJson.applicationReferenceId);
        if (onApplicationSuccess) onApplicationSuccess(resJson.applicationReferenceId);
      } else {
        setErrorMessage(resJson.msg || "Failed to submit application. Please check details and try again.");
      }
    } catch (err: any) {
      setErrorMessage("Network error: Unable to connect to placement server. Please verify your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // If this drive is marked On-Campus, keep exclusive enrolled notice
  if (drive.driveType === 'on-campus') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-center my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 inline-block">
              On-Campus Recruitment Drive
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              {drive.title} ({drive.companyName || 'Corporate Partner'})
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              This recruitment drive is strictly conducted for students enrolled in our partner training programs and LMS platform. Public online registrations are not open for this drive.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Hiring Partner:</span>
              <span className="font-bold text-slate-800">{drive.companyName || 'Partner'}</span>
            </div>
            {drive.salary && (
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Package (CTC):</span>
                <span className="font-bold text-[#2e6c00]">{drive.salary}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Eligibility:</span>
              <span className="font-semibold text-slate-700">{drive.eligibleDegree} ({drive.eligibleBatch})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Drive Type:</span>
              <span className="font-bold text-amber-700">On-Campus / Enrolled Only</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow"
          >
            Close Notice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">

        {/* Header Ribbon */}
        <div className="bg-[#071B4D] text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {drive.companyLogo ? (
              <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-slate-200">
                <img src={drive.companyLogo} alt={drive.companyName} className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Corporate Placement Application</span>
              <h2 className="text-xl font-extrabold text-white leading-tight font-display">{drive.title}</h2>
              <span className="text-xs text-slate-300 font-semibold">{drive.companyName || 'Corporate Partner'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Modal View */}
        {submittedRefId ? (
          <div className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verified Application Submitted</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">Application Received Successfully!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your application for <strong>{drive.title}</strong> at <strong>{drive.companyName}</strong> has been registered with zero application charges.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-md my-2 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Application Reference ID:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{submittedRefId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Candidate:</span>
                <span className="font-bold text-slate-800">{formValues.fullName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Registered Email:</span>
                <span className="font-medium text-slate-800">{formValues.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Application Fee:</span>
                <span className="font-bold text-emerald-600">₹0 (100% Free Placement Drive)</span>
              </div>
            </div>

            {/* WhatsApp Community Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 w-full max-w-md text-center space-y-2">
              <p className="text-xs font-bold text-emerald-900">
                Join the Official TantraPex Placement Updates Community (Optional)
              </p>
              <p className="text-[11px] text-emerald-700">
                Receive instant schedule announcements, screening notifications, and interview tips directly on WhatsApp.
              </p>
              <a
                href="https://chat.whatsapp.com/tantrapex-placements"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2e6c00] hover:bg-[#255700] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Join WhatsApp Community
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Done / Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

            {/* Drive Quick Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {drive.location || 'Pan India'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Eligible Batch</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {drive.eligibleBatch || '2024 & 2025'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Min. CGPA</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {drive.minCgpa || '60% / 6.0 CGPA'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Package (CTC)</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">
                  {drive.salary || 'As per Industry Standards'}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: Personal Details */}
            {personalFields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                  1. Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {personalFields.map(field => (
                    <div key={field.id}>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: Academic Details */}
            {academicFields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                  2. Academic Details & Eligibility
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {academicFields.map(field => {
                    const isFullSpan = field.id === 'college' || field.type === 'textarea';
                    return (
                      <div key={field.id} className={isFullSpan ? 'sm:col-span-2' : ''}>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        {renderFieldInput(field)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: Documents & File Uploads (Strictly max 10MB per user requirement) */}
            {fileFields.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    3. Documents & File Uploads
                  </h3>
                  <span className="text-[10px] text-amber-600 font-semibold font-mono">
                    Max File Size: 10MB each
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {fileFields.map(field => {
                    const doc = uploadedDocs[field.id];
                    const isResume = field.id === 'resume';
                    const isPhoto = field.id === 'photo';
                    const allowedTypes = field.allowedFileTypes || (isResume ? ['.pdf'] : isPhoto ? ['.jpg', '.png', '.jpeg', '.webp'] : ['.pdf', '.jpg', '.png', '.docx']);
                    const acceptAttr = allowedTypes.join(',');

                    return (
                      <div
                        key={field.id}
                        className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 transition-all hover:border-slate-400"
                      >
                        {isResume ? (
                          <FileText className="w-8 h-8 text-emerald-600 mb-2" />
                        ) : isPhoto ? (
                          <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                        ) : (
                          <Paperclip className="w-8 h-8 text-blue-600 mb-2" />
                        )}

                        <span className="font-bold text-slate-800">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </span>
                        <span className="text-[10px] text-slate-500 mb-3">
                          {field.helpText || `${allowedTypes.join(', ')} • Max 10MB`}
                        </span>

                        {doc?.url ? (
                          <div className="flex flex-col items-center gap-2 w-full">
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 max-w-full">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                              <span className="font-semibold truncate max-w-[150px] text-xs">
                                {doc.fileName || 'Uploaded File'}
                              </span>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] underline ml-1 font-bold shrink-0"
                              >
                                View
                              </a>
                            </div>

                            <label className="cursor-pointer text-[11px] text-emerald-700 hover:text-emerald-800 font-bold underline">
                              <span>Change File</span>
                              <input
                                type="file"
                                accept={acceptAttr}
                                onChange={(e) => handleFileUpload(field, e)}
                                disabled={doc.uploading}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 font-bold rounded-lg text-slate-700 shadow-sm transition-colors">
                              {doc?.uploading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Choose File</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept={acceptAttr}
                                onChange={(e) => handleFileUpload(field, e)}
                                disabled={doc?.uploading}
                                className="hidden"
                              />
                            </label>
                            {doc?.error && (
                              <span className="text-[10px] text-rose-600 font-semibold mt-1">
                                {doc.error}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 4: Work Experience Status */}
            {experienceFields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                  4. Work Experience Status
                </h3>

                {activeFields.some(f => f.id === 'experienceStatus') && (
                  <div className="flex items-center gap-6 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="expStatus"
                        value="fresher"
                        checked={formValues.experienceStatus === 'fresher'}
                        onChange={() => handleInputChange('experienceStatus', 'fresher')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-800">Fresher Candidate</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="expStatus"
                        value="experienced"
                        checked={formValues.experienceStatus === 'experienced'}
                        onChange={() => handleInputChange('experienceStatus', 'experienced')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-800">Experienced (Internship / Full-time)</span>
                    </label>
                  </div>
                )}

                {formValues.experienceStatus === 'experienced' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Total Experience Duration</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 6"
                          value={formValues.experienceDuration || ''}
                          onChange={(e) => handleInputChange('experienceDuration', e.target.value)}
                          className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                        />
                        <select
                          value={formValues.experienceUnit || 'years'}
                          onChange={(e) => handleInputChange('experienceUnit', e.target.value)}
                          className="w-1/3 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                        >
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Most Recent Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Trainee / Intern"
                        value={formValues.designation || ''}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Organization / Employer Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Tech Solutions Pvt Ltd"
                        value={formValues.previousOrganization || ''}
                        onChange={(e) => handleInputChange('previousOrganization', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Other non-status experience fields (e.g. experienceSummary) */}
                {experienceFields
                  .filter(f => f.id !== 'experienceStatus')
                  .map(field => (
                    <div key={field.id}>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderFieldInput(field)}
                    </div>
                  ))}
              </div>
            )}

            {/* SECTION 5: Additional / Custom Fields Configured by Admin */}
            {customFields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                  5. Additional Information & Specific Requirements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {customFields.map(field => {
                    const isFullSpan = field.type === 'textarea';
                    return (
                      <div key={field.id} className={isFullSpan ? 'sm:col-span-2' : ''}>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        {renderFieldInput(field)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 6: Skills & Declaration */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                {customFields.length > 0 ? '6' : '5'}. Relevant Skills & Declaration
              </h3>
              <div className="text-xs space-y-3">
                {activeFields.some(f => f.id === 'skills') && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Key Technical & Analytical Skills {activeFields.find(f => f.id === 'skills')?.required && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      required={activeFields.find(f => f.id === 'skills')?.required}
                      placeholder="e.g. Java, Python, SQL, React, REST APIs, Problem Solving"
                      value={formValues.skills || ''}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consentCheckbox"
                    required
                    checked={formValues.agreedToTerms || false}
                    onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="consentCheckbox" className="text-[11px] text-slate-600 leading-relaxed cursor-pointer select-none">
                    I confirm that the personal, educational, and academic marks submitted are accurate and verifiable. I authorize TantraPex Technologies to process and share my credentials with the hiring team of <strong>{drive.companyName || 'the hiring company'}</strong> for placement drive evaluation.
                  </label>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% Free Drive • Zero Platform Charge
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || Object.values(uploadedDocs).some(d => d.uploading)}
                  className="px-6 py-2.5 bg-[#2e6c00] hover:bg-[#255700] disabled:bg-slate-400 text-white font-bold rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application (Free)'}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
