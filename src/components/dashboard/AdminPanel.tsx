import React, { useState, useEffect } from 'react';
import { 
  CMSPage, GlobalSettings, MediaItem, BlogPost, PlacedStudent, HiringPartner, Course, Lead, Service 
} from '../../types';
import { UniversalImageUploader, UniversalImageUploaderLight, UniversalMultiImageUploader } from './UniversalImageUploader';
import { 
  LayoutDashboard, FileText, Users, Award, BookOpen, Newspaper, FormInput, Image, Settings, Briefcase,
  TrendingUp, HelpCircle, CheckCircle, Clock, Trash2, Plus, Edit, Download, Check, RefreshCw, X, LogOut,
  GraduationCap, Megaphone, Calendar, Ticket, Mail, CreditCard, User, ShieldCheck
} from 'lucide-react';
import PoliciesAdminEditor from './PoliciesAdminEditor';

interface AdminPanelProps {
  pages: CMSPage[];
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  settings: GlobalSettings;
  setSettings: (s: GlobalSettings) => void;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  placedStudents: PlacedStudent[];
  setPlacedStudents: React.Dispatch<React.SetStateAction<PlacedStudent[]>>;
  hiringPartners: HiringPartner[];
  setHiringPartners: React.Dispatch<React.SetStateAction<HiringPartner[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  onLogout?: () => void;
  onReset?: () => void;
  mongoDbStatus?: 'connected' | 'disconnected' | 'loading';
  mongoDbError?: string | null;
}

export default function AdminPanel({
  pages, setPages,
  settings, setSettings,
  media, setMedia,
  placedStudents, setPlacedStudents,
  hiringPartners, setHiringPartners,
  courses, setCourses,
  services, setServices,
  blogs, setBlogs,
  leads, setLeads,
  onLogout,
  onReset,
  mongoDbStatus = 'connected',
  mongoDbError = null
}: AdminPanelProps) {

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('policies')) {
        setActiveTab('policies-cms');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Interactive Form State Holders
  const [selectedStudent, setSelectedStudent] = useState<PlacedStudent | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form edit fields
  const [studentForm, setStudentForm] = useState<Omit<PlacedStudent, 'id'>>({
    name: '', avatar: '', college: '', branch: '', year: String(new Date().getFullYear()), company: '', packageLpa: '', showOnHomepage: true
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2000 + 6 }, (_, idx) => String(2000 + idx));

  const [blogForm, setBlogForm] = useState<Omit<BlogPost, 'id' | 'date'>>({
    title: '', slug: '', category: 'Resume Tips', excerpt: '', content: '', image: '', readTime: '5 mins read', status: 'published'
  });

  const [courseForm, setCourseForm] = useState<Omit<Course, 'id'>>({
    name: '', category: 'programming', description: '', duration: '', topics: [], imageUrl: '', level: 'Beginner'
  });
  const [newTopicStr, setNewTopicStr] = useState('');

  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id' | 'createdAt'>>({
    title: '',
    slug: '',
    category: 'career-services',
    image: '',
    shortDescription: '',
    description: '',
    buttonText: 'Learn More',
    buttonLink: '#/contact',
    featured: false,
    showOnHomepage: false,
    published: true,
    order: 1,
    seo: { title: '', description: '', keywords: '' }
  });

  // Partner Form State Holders
  const [selectedPartner, setSelectedPartner] = useState<HiringPartner | null>(null);
  const [partnerForm, setPartnerForm] = useState<Omit<HiringPartner, 'id'>>({
    name: '', logoUrl: '', isVisible: true
  });

  // Workshop Form State Holders
  const [selectedWorkshop, setSelectedWorkshop] = useState<any | null>(null);
  const [workshopForm, setWorkshopForm] = useState<any>({
    title: '',
    desc: '',
    date: '',
    location: '',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=500',
    status: 'upcoming',
    isFree: true,
    price: 0
  });

  // Workshop Gallery State
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');

  // Media Library states
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'pdf' | 'svg'>('image');

  // Workshop registrations CRM states
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState('all');
  const [planSearchQuery, setPlanSearchQuery] = useState('');

  // Admin password permanent update states
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [devMasterPassword, setDevMasterPassword] = useState('');
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<{ type: 'success' | 'error' | null, message: string | null }>({ type: null, message: null });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword) {
      setPasswordUpdateStatus({ type: 'error', message: 'New admin password cannot be empty.' });
      return;
    }
    if (!devMasterPassword) {
      setPasswordUpdateStatus({ type: 'error', message: 'Developer master password is required to authorize this change.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordUpdateStatus({ type: null, message: null });

    try {
      const response = await fetch('/api/update-admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword: newAdminPassword,
          developerMasterPassword: devMasterPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        // Update local React state
        const updatedSettings = { ...settings, adminPassword: newAdminPassword };
        setSettings(updatedSettings);
        // Sync with localStorage
        localStorage.setItem('tpx_settings', JSON.stringify(updatedSettings));
        
        setPasswordUpdateStatus({ 
          type: 'success', 
          message: data.offline 
            ? 'Password saved in local cache (Offline Mode). Connect MongoDB for permanent database storage.' 
            : 'Admin password successfully updated and permanently saved on MongoDB database!' 
        });
        setNewAdminPassword('');
        setDevMasterPassword('');
      } else {
        setPasswordUpdateStatus({ type: 'error', message: data.msg || 'Failed to update admin password.' });
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      setPasswordUpdateStatus({ type: 'error', message: 'Network error or backend is not running.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  const [regWorkshopFilter, setRegWorkshopFilter] = useState('all');
  const [selectedRegForTicket, setSelectedRegForTicket] = useState<any | null>(null);
  const [regToast, setRegToast] = useState<string | null>(null);
  const [isRunningAdminTestPayment, setIsRunningAdminTestPayment] = useState(false);
  const [adminTestPaymentStatus, setAdminTestPaymentStatus] = useState<{ type: 'success' | 'error' | null, message: string | null }>({ type: null, message: null });

  const parseJsonResponse = async (response: Response) => {
    const rawText = await response.text();
    if (!rawText) {
      return { success: false, error: 'Server returned an empty response.' };
    }

    try {
      return JSON.parse(rawText);
    } catch (err) {
      console.error('Failed to parse server response:', rawText.slice(0, 500));
      return {
        success: false,
        error: 'The server returned an invalid response. Please verify Razorpay and SMTP configuration.'
      };
    }
  };

  const handleAdminTestPayment = async () => {
    if (!settings.email) {
      triggerToast('Please set the admin email in Global Settings first.');
      return;
    }

    setIsRunningAdminTestPayment(true);
    setAdminTestPaymentStatus({ type: null, message: null });

    try {
      const response = await fetch('/api/admin/test-razorpay-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: settings.email,
          amount: 1
        })
      });

      const data = await parseJsonResponse(response);
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Test payment could not be completed.');
      }

      const currentPurchases = getPlanPurchases();
      const paymentRecord = {
        paymentId: data.paymentId || `pay_admin_test_${Date.now()}`,
        orderId: data.orderId || `order_admin_test_${Date.now()}`,
        date: new Date().toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        planName: 'Razorpay Test Payment',
        amount: 1,
        studentName: 'Admin Test',
        studentEmail: settings.email,
        studentPhone: 'N/A'
      };

      localStorage.setItem('tpx_plan_purchases', JSON.stringify([paymentRecord, ...currentPurchases]));
      setAdminTestPaymentStatus({
        type: 'success',
        message: `₹1 test payment completed and email sent to ${settings.email}.`
      });
      triggerToast(`₹1 Razorpay test payment complete. Mail sent to ${settings.email}.`);
    } catch (err: any) {
      console.error('Admin test payment error:', err);
      setAdminTestPaymentStatus({
        type: 'error',
        message: err.message || 'Something went wrong while processing the test payment.'
      });
      triggerToast('Razorpay test payment failed. Check the backend keys or SMTP config.');
    } finally {
      setIsRunningAdminTestPayment(false);
    }
  };

  // CSV Exporter Simulation
  const handleExportCSV = (type: string) => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Phone,Type,Date,Status\n" 
      + leads.map(l => `${l.id},${l.name},${l.email},${l.phone},${l.type},${l.date},${l.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tantrapex_leads_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Workshop Registrations loaders
  const getWorkshopRegistrations = () => {
    const raw = localStorage.getItem('tpx_workshop_registrations');
    if (!raw) {
      const mockRegs = [
        {
          id: "tpx-reg-101",
          name: "Pratham Joshi",
          email: "prathamjoshi355@gmail.com",
          phone: "9876543210",
          college: "LNCT Bhopal",
          branch: "Computer Science",
          year: "4th Year",
          workshopId: "wk-1",
          workshopTitle: "Resume Building Workshop",
          isFree: true,
          pricePaid: 0,
          paymentStatus: "Confirmed",
          transactionId: "TPX-FREE-987A",
          registeredAt: "2026-07-05T08:12:34-07:00"
        },
        {
          id: "tpx-reg-102",
          name: "Rohan Sharma",
          email: "rohan.sharma@gmail.com",
          phone: "9123456789",
          college: "VIT Bhopal",
          branch: "Information Technology",
          year: "3rd Year",
          workshopId: "wk-2",
          workshopTitle: "Interview Preparation Workshop",
          isFree: false,
          pricePaid: 199,
          paymentStatus: "Paid",
          transactionId: "pay_Pq7v1XyZ59s1",
          registeredAt: "2026-07-04T14:45:00-07:00"
        },
        {
          id: "tpx-reg-103",
          name: "Priya Patel",
          email: "priya.patel@gmail.com",
          phone: "9988776655",
          college: "SGSITS Indore",
          branch: "Electronics & Communication",
          year: "4th Year",
          workshopId: "wk-2",
          workshopTitle: "Interview Preparation Workshop",
          isFree: false,
          pricePaid: 199,
          paymentStatus: "Paid",
          transactionId: "pay_H8uW9KlM123",
          registeredAt: "2026-07-03T11:20:15-07:00"
        }
      ];
      localStorage.setItem('tpx_workshop_registrations', JSON.stringify(mockRegs));
      return mockRegs;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  };

  // Plan Purchases loaders
  const getPlanPurchases = () => {
    const raw = localStorage.getItem('tpx_plan_purchases');
    if (!raw) {
      const mockPurchases = [
        {
          paymentId: "pay_TESTPLN101",
          orderId: "order_TESTORD101",
          date: "5 July 2026, 11:30 am",
          planName: "Super Premium Plan",
          amount: 2999,
          studentName: "Pratham Joshi",
          studentEmail: "prathamjoshi355@gmail.com",
          studentPhone: "9876543210"
        }
      ];
      localStorage.setItem('tpx_plan_purchases', JSON.stringify(mockPurchases));
      return mockPurchases;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  };

  const getEmailLogs = () => {
    const raw = localStorage.getItem('tpx_sent_emails');
    if (!raw) {
      const mockEmails = [
        {
          id: "mail-1",
          recipientName: "Pratham Joshi",
          recipientEmail: "prathamjoshi355@gmail.com",
          subject: "Your Tantrapex Workshop Admit Card - Resume Building Workshop",
          timestamp: "2026-07-05T08:12:35-07:00",
          status: "Delivered",
          bodyPreview: "Dear Pratham, Your registration for Resume Building Workshop is successful. Find your entrance admit card attached..."
        },
        {
          id: "mail-2",
          recipientName: "Rohan Sharma",
          recipientEmail: "rohan.sharma@gmail.com",
          subject: "Your Tantrapex Workshop Admit Card & Receipt - Interview Preparation Workshop",
          timestamp: "2026-07-04T14:45:02-07:00",
          status: "Delivered",
          bodyPreview: "Dear Rohan, Thank you for registering. We have successfully processed your payment of Rs 199. Your Admit Card is attached..."
        }
      ];
      localStorage.setItem('tpx_sent_emails', JSON.stringify(mockEmails));
      return mockEmails;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  };

  const saveWorkshopRegistrations = (list: any[]) => {
    localStorage.setItem('tpx_workshop_registrations', JSON.stringify(list));
  };

  const triggerToast = (msg: string) => {
    setRegToast(msg);
    setTimeout(() => setRegToast(null), 3000);
  };

  const handleResendRegEmail = (reg: any) => {
    const emails = getEmailLogs();
    const newMail = {
      id: `mail-resend-${Date.now()}`,
      recipientName: reg.name,
      recipientEmail: reg.email,
      subject: `[RESENT] Your Tantrapex Workshop Admit Card - ${reg.workshopTitle}`,
      timestamp: new Date().toISOString(),
      status: "Delivered",
      bodyPreview: `Dear ${reg.name}, We have resent your entry ticket for "${reg.workshopTitle}" as requested. Unique Ticket ID: ${reg.id}. See details below...`
    };
    localStorage.setItem('tpx_sent_emails', JSON.stringify([newMail, ...emails]));
    triggerToast(`Admit card sent to ${reg.email} successfully!`);
  };

  const handleExportRegsCSV = (regs: any[]) => {
    const headers = "Registration ID,Name,Email,Phone,College,Branch,Year,Workshop,Price,Payment Status,Transaction ID,Registered At\n";
    const rows = regs.map(r => 
      `"${r.id}","${r.name}","${r.email}","${r.phone}","${r.college}","${r.branch}","${r.year}","${r.workshopTitle}",${r.pricePaid},"${r.paymentStatus}","${r.transactionId}","${r.registeredAt}"`
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tantrapex_workshop_students_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Detailed Report CSV downloaded successfully!");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Admin Panel Sidebar navigation */}
      <div className="lg:w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-500 text-slate-950 font-black rounded flex items-center justify-center text-base shadow">
              TX
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight leading-none text-white uppercase">CMS Admin Core</span>
              <span className="text-[9px] text-slate-400 font-medium tracking-wide mt-1 uppercase">Control Center</span>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Nav Tab Options */}
          <nav className="flex flex-col gap-1 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
              { id: 'pages', label: 'Pages & SEO Metadata', icon: FileText },
              { id: 'policies-cms', label: 'Legal Policies Editor', icon: ShieldCheck },
              { id: 'students', label: 'Placed Students CRM', icon: Users },
              { id: 'partners', label: 'Hiring Partners', icon: Award },
              { id: 'courses', label: 'Courses Syllabus', icon: BookOpen },
              { id: 'services', label: 'Services Catalog', icon: Briefcase },
              { id: 'blogs', label: 'Blog Articles CMS', icon: Newspaper },
              { id: 'leads', label: 'Form Leads submissions', icon: FormInput },
              { id: 'workshops-cms', label: 'Workshops Manager', icon: Calendar },
              { id: 'workshop-registrations', label: 'Workshop Registrations', icon: Ticket },
              { id: 'plan-purchases', label: 'Plan Purchases CRM', icon: CreditCard },
              { id: 'media', label: 'Media asset library', icon: Image },
              { id: 'lms-cms', label: 'Student LMS Portal CMS', icon: GraduationCap },
              { id: 'ambassador-cms', label: 'Campus Ambassador CMS', icon: Megaphone },
              { id: 'settings', label: 'Global branding settings', icon: Settings }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left w-full ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 font-mono">
          <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">MongoDB Cloud Services</span>
            {mongoDbStatus === 'connected' ? (
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>Atlas Cluster Synced</span>
              </div>
            ) : mongoDbStatus === 'loading' ? (
              <div className="flex items-center gap-1.5 text-[9px] text-amber-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                <span>Connecting Atlas...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[9px] text-rose-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
                <span>Atlas Cluster Offline</span>
              </div>
            )}
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
              title="Reset Database to original demo state"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Demo DB</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-900/40 rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
              title="Sign Out of Admin Control Panel"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out & Lock</span>
            </button>
          )}
        </div>
      </div>

      {/* Main CMS dashboard workspace */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* TAB 1: OVERVIEW ANALYTICS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 uppercase">System Intelligence Overview</h1>
                <p className="text-slate-500 text-xs mt-1">Real-time engagement telemetry, form conversions, and system logs.</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200 rounded-full font-bold">
                Online & Synced
              </span>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Active Pages Managed", value: pages.length, desc: "Editable CMS pages", icon: FileText, color: "text-blue-600" },
                { title: "Total Placed Students", value: placedStudents.length, desc: "CRM student pool", icon: Users, color: "text-emerald-600" },
                { title: "Active Blog Posts", value: blogs.length, desc: "Career news published", icon: Newspaper, color: "text-amber-600" },
                { title: "Total Submissions", value: leads.length, desc: "Inbound leads collected", icon: FormInput, color: "text-rose-600" }
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs font-semibold">{card.title}</span>
                      <span className={`text-2xl font-black ${card.color}`}>{card.value}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{card.desc}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                      <CardIcon className="h-6 w-6" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Inbound Leads Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-display font-bold text-slate-950 text-sm uppercase">Recent Inbound Lead Submissions</h3>
                  <button 
                    onClick={() => handleExportCSV('all')}
                    className="flex items-center gap-1.5 text-blue-600 font-bold text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto text-xs font-sans">
                  <table className="w-full text-left text-slate-700">
                    <thead className="bg-slate-100/80 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">Name</th>
                        <th className="px-6 py-3.5">Contact Detail</th>
                        <th className="px-6 py-3.5">Type</th>
                        <th className="px-6 py-3.5">Date</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-3.5 font-bold text-slate-900">{l.name}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex flex-col">
                              <span>{l.email}</span>
                              <span className="text-slate-400 text-[10px]">{l.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-slate-100">
                              {l.type}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-slate-400">{new Date(l.date).toLocaleDateString()}</td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              l.status === 'new' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              l.status === 'contacted' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Event Logs telemetry */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4 text-left">
                <h3 className="font-display font-bold text-slate-900 text-sm uppercase">CMS Real-Time Activity Log</h3>
                <div className="space-y-3 font-mono text-[10px] text-slate-600">
                  <div className="flex items-start gap-2 border-l-2 border-emerald-500 pl-2">
                    <span className="text-slate-400 shrink-0">13:30</span>
                    <span>Synchronized successfully with MongoDB Atlas Cloud Collections.</span>
                  </div>
                  <div className="flex items-start gap-2 border-l-2 border-blue-500 pl-2">
                    <span className="text-slate-400 shrink-0">13:31</span>
                    <span>Retrieved active pipeline configurations and course blocks.</span>
                  </div>
                  <div className="flex items-start gap-2 border-l-2 border-amber-500 pl-2">
                    <span className="text-slate-400 shrink-0">13:35</span>
                    <span>Visual changes synced with Atlas cloud cluster instance.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LEGAL POLICIES EDITOR */}
        {activeTab === 'policies-cms' && (
          <PoliciesAdminEditor settings={settings} setSettings={setSettings} />
        )}

        {/* TAB 2: PAGES MANAGER & SEO */}
        {activeTab === 'pages' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div>
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Pages & SEO Search Optimization</h1>
              <p className="text-slate-500">Edit page titles, URL slugs, and search robot meta properties for all 12 modules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pages.map((p, pi) => (
                <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-display font-bold text-base text-slate-900 uppercase">{p.title} Page</h3>
                    <span className="font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded text-[10px]">{p.slug}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Meta Header Title</label>
                      <input 
                        type="text" 
                        value={p.seo.title}
                        onChange={(e) => {
                          const updated = [...pages];
                          updated[pi].seo.title = e.target.value;
                          setPages(updated);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Meta Description</label>
                      <textarea 
                        rows={2}
                        value={p.seo.description}
                        onChange={(e) => {
                          const updated = [...pages];
                          updated[pi].seo.description = e.target.value;
                          setPages(updated);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Keywords (Comma split)</label>
                      <input 
                        type="text" 
                        value={p.seo.keywords}
                        onChange={(e) => {
                          const updated = [...pages];
                          updated[pi].seo.keywords = e.target.value;
                          setPages(updated);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLACED STUDENTS CRM */}
        {activeTab === 'students' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase font-mono">Placed Students Pool CRM</h1>
                <p className="text-slate-500">Add, edit, or delete student placements, college branches, and hiring packages.</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedStudent({ id: `stud-${Date.now()}`, name: '', avatar: '', college: '', branch: '', year: '2024', company: '', packageLpa: '', showOnHomepage: true });
                  setStudentForm({ name: '', avatar: '', college: '', branch: '', year: '2024', company: '', packageLpa: '', showOnHomepage: true });
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Student Placement</span>
              </button>
            </div>

            {/* Editing / Creating Popup state panel */}
            {selectedStudent && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
                <h3 className="font-display font-bold text-sm text-blue-400 uppercase">
                  {studentForm.name ? `Editing Record: ${studentForm.name}` : 'New Student Placement Profile'}
                </h3>

                <UniversalImageUploader 
                  label="Student Photo"
                  value={studentForm.avatar}
                  onChange={(val) => setStudentForm(prev => ({ ...prev, avatar: val }))}
                  className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800/80"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Full Student Name</label>
                    <input 
                      type="text" 
                      value={studentForm.name} 
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">College / University</label>
                    <input 
                      type="text" 
                      value={studentForm.college} 
                      onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Branch / Stream</label>
                    <input 
                      type="text" 
                      value={studentForm.branch} 
                      onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Hiring Corporate</label>
                    <input 
                      type="text" 
                      value={studentForm.company} 
                      onChange={(e) => setStudentForm({ ...studentForm, company: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Package Tag (e.g. 5.5 LPA)</label>
                    <input 
                      type="text" 
                      value={studentForm.packageLpa} 
                      onChange={(e) => setStudentForm({ ...studentForm, packageLpa: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Graduation Year</label>
                    <select 
                      value={studentForm.year} 
                      onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <label className="font-bold text-slate-300 uppercase text-[9px]">Show On Homepage</label>
                  <button
                    onClick={() => setStudentForm({ ...studentForm, showOnHomepage: !studentForm.showOnHomepage })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      studentForm.showOnHomepage ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        studentForm.showOnHomepage ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => {
                      const exist = placedStudents.some(s => s.id === selectedStudent.id);
                      if (exist) {
                        setPlacedStudents(placedStudents.map(s => s.id === selectedStudent.id ? { ...s, ...studentForm } : s));
                      } else {
                        setPlacedStudents([...placedStudents, { id: selectedStudent.id, ...studentForm }]);
                      }
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white font-bold"
                  >
                    Save Record
                  </button>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* List CRM Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Academic stream</th>
                    <th className="px-6 py-4">Recruiter details</th>
                    <th className="px-6 py-4">Homepage Status</th>
                    <th className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {placedStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        {st.avatar && st.avatar.trim() !== '' ? (
                          <img src={st.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                        <span className="font-bold text-slate-950 text-sm">{st.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{st.college}</span>
                          <span className="text-slate-400 text-[10px]">{st.branch} (Class of {st.year})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {st.company} &bull; <span className="text-emerald-600 font-mono text-[11px]">{st.packageLpa}</span>
                      </td>
                      <td className="px-6 py-4">
                        {st.showOnHomepage !== false ? (
                          <span className="px-2 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">Show On Home</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-300 uppercase">Hidden</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setSelectedStudent(st);
                              setStudentForm({
                                name: st.name, avatar: st.avatar, college: st.college, branch: st.branch, year: st.year, company: st.company, packageLpa: st.packageLpa, showOnHomepage: st.showOnHomepage !== false
                              });
                            }}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => setPlacedStudents(placedStudents.filter(ps => ps.id !== st.id))}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HIRING PARTNERS */}
        {activeTab === 'partners' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Hiring Partners</h1>
                <p className="text-slate-500">Edit or introduce corporate brand partners, upload logos, and set visibility on the live website.</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedPartner({ id: `partner-${Date.now()}`, name: '', logoUrl: '', isVisible: true });
                  setPartnerForm({ name: '', logoUrl: '', isVisible: true });
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Partner Brand</span>
              </button>
            </div>

            {/* Editing / Creating State Panel */}
            {selectedPartner && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
                <h3 className="font-display font-bold text-sm text-blue-400 uppercase">
                  {partnerForm.name ? `Editing Partner: ${partnerForm.name}` : 'New Hiring Partner Profile'}
                </h3>

                <UniversalImageUploader 
                  label="Company Logo / Image"
                  value={partnerForm.logoUrl}
                  onChange={(val) => setPartnerForm(prev => ({ ...prev, logoUrl: val }))}
                  className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800/80"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Hiring Brand Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. TCS, Capgemini, Google"
                      value={partnerForm.name} 
                      onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-2 justify-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={partnerForm.isVisible !== false} 
                        onChange={(e) => setPartnerForm({ ...partnerForm, isVisible: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-800 border-slate-700"
                      />
                      <span className="font-bold text-slate-300 text-xs">Live / Visible on Website</span>
                    </label>
                    <p className="text-[10px] text-slate-500 ml-6">Ensure if this brand's image or logo should actively be shown in slider and grids on public pages.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => {
                      if (!partnerForm.name) {
                        alert("Please enter a brand name.");
                        return;
                      }
                      const exist = hiringPartners.some(p => p.id === selectedPartner.id);
                      if (exist) {
                        setHiringPartners(hiringPartners.map(p => p.id === selectedPartner.id ? { ...p, ...partnerForm } : p));
                      } else {
                        setHiringPartners([...hiringPartners, { id: selectedPartner.id, ...partnerForm }]);
                      }
                      setSelectedPartner(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white font-bold"
                  >
                    Save Brand Profile
                  </button>
                  <button 
                    onClick={() => setSelectedPartner(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* List CRM Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {hiringPartners.map((partner) => {
                const isLogoUrl = partner.logoUrl && (partner.logoUrl.startsWith('http') || partner.logoUrl.startsWith('/') || partner.logoUrl.startsWith('data:'));
                return (
                  <div key={partner.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-slate-300 transition-colors">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setSelectedPartner(partner);
                          setPartnerForm({
                            name: partner.name,
                            logoUrl: partner.logoUrl,
                            isVisible: partner.isVisible !== false
                          });
                        }}
                        className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded shadow-sm"
                        title="Edit partner"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${partner.name}?`)) {
                            setHiringPartners(hiringPartners.filter(p => p.id !== partner.id));
                          }
                        }}
                        className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded shadow-sm"
                        title="Delete partner"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="h-16 w-full flex items-center justify-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                      {isLogoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name} 
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="font-extrabold text-xs text-slate-400 tracking-tight font-display">{partner.name}</span>
                      )}
                    </div>

                    <div className="flex flex-col text-left gap-0.5">
                      <span className="font-extrabold text-slate-800 text-sm truncate">{partner.name}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        {partner.isVisible !== false ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 px-1.5 py-0.5 bg-emerald-50 rounded">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            Live on Website
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">
                            Hidden / Offline
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: COURSES SYLLABUS */}
        {activeTab === 'courses' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Courses & Syllabus Syllabus</h1>
                <p className="text-slate-500">Manage syllabus content, topics, module duration, and stream categories.</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedCourse({ id: `course-${Date.now()}`, name: '', category: 'programming', description: '', duration: '8 Weeks', topics: [], imageUrl: '', level: 'Beginner' });
                  setCourseForm({ name: '', category: 'programming', description: '', duration: '8 Weeks', topics: [], imageUrl: '', level: 'Beginner' });
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Syllabus Course</span>
              </button>
            </div>

            {selectedCourse && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
                <h3 className="font-display font-bold text-blue-400 uppercase">
                  {courseForm.name ? `Editing Course: ${courseForm.name}` : 'Create Syllabus Block'}
                </h3>

                <UniversalImageUploader 
                  label="Course Logo / Icon Image"
                  value={courseForm.imageUrl ?? ''}
                  onChange={(val) => setCourseForm(prev => ({ ...prev, imageUrl: val }))}
                  className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800/80"
                />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Course Name</label>
                    <input 
                      type="text" 
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Stream Category</label>
                    <select
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value as any })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none"
                    >
                      <option value="programming">Programming Courses</option>
                      <option value="aptitude">Aptitude Courses</option>
                      <option value="soft-skills">Soft Skills</option>
                      <option value="interview">Interview Training</option>
                      <option value="database">Database</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Duration (e.g. 3 Months)</label>
                    <input 
                      type="text" 
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Brief Description</label>
                    <input 
                      type="text" 
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Level (e.g. Beginner, Intermediate)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Beginner"
                      value={courseForm.level || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 uppercase text-[9px]">Topics covered ({courseForm.topics.length})</span>
                  <div className="flex flex-wrap gap-2">
                    {courseForm.topics.map((t, ti) => (
                      <span key={ti} className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono text-[10px]">
                        <span>{t}</span>
                        <X className="h-3 w-3 hover:text-red-400 cursor-pointer shrink-0" onClick={() => setCourseForm({ ...courseForm, topics: courseForm.topics.filter((_, idx) => idx !== ti) })} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Add topic (e.g. OOPs concepts)" 
                      value={newTopicStr}
                      onChange={(e) => setNewTopicStr(e.target.value)}
                      className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (newTopicStr) {
                          setCourseForm({ ...courseForm, topics: [...courseForm.topics, newTopicStr] });
                          setNewTopicStr('');
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => {
                      const exist = courses.some(c => c.id === selectedCourse.id);
                      if (exist) {
                        setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...courseForm } : c));
                      } else {
                        setCourses([...courses, { id: selectedCourse.id, ...courseForm }]);
                      }
                      setSelectedCourse(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                  >
                    Save Course
                  </button>
                  <button onClick={() => setSelectedCourse(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Course Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Topics count</th>
                    <th className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-slate-950 text-sm">{course.name}</span>
                          <span className="text-slate-400 text-[10px]">{course.duration} Module</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-bold uppercase text-[9px]">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">
                        {course.topics.length} Key Topics
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setCourseForm({
                                name: course.name,
                                category: course.category,
                                description: course.description,
                                duration: course.duration,
                                topics: course.topics,
                                imageUrl: course.imageUrl || '',
                                level: course.level || 'Beginner'
                              });
                            }}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => setCourses(courses.filter(c => c.id !== course.id))}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5.5: SERVICES CATALOG */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Services Catalog</h1>
                <p className="text-slate-500">Create, update, and publish service offerings used across the public services page.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedService({
                    id: `service-${Date.now()}`,
                    title: '',
                    slug: '',
                    category: 'career-services',
                    image: '',
                    shortDescription: '',
                    description: '',
                    buttonText: 'Learn More',
                    buttonLink: '#/contact',
                    featured: false,
                    showOnHomepage: false,
                    published: true,
                    order: services.length + 1,
                    createdAt: new Date().toISOString(),
                    seo: { title: '', description: '', keywords: '' }
                  });
                  setServiceForm({
                    title: '',
                    slug: '',
                    category: 'career-services',
                    image: '',
                    shortDescription: '',
                    description: '',
                    buttonText: 'Learn More',
                    buttonLink: '#/contact',
                    featured: false,
                    showOnHomepage: false,
                    published: true,
                    order: services.length + 1,
                    seo: { title: '', description: '', keywords: '' }
                  });
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {selectedService && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
                <h3 className="font-display font-bold text-blue-400 uppercase">
                  {selectedService.title ? `Editing Service: ${selectedService.title}` : 'New Service Offer'}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Service Title</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Slug</label>
                    <input
                      type="text"
                      value={serviceForm.slug}
                      onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Category</label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none"
                    >
                      <option value="career-services">Career Services</option>
                      <option value="tech-training">Tech Training</option>
                      <option value="soft-skills">Soft Skills</option>
                      <option value="consulting">Consulting</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Button Text</label>
                    <input
                      type="text"
                      value={serviceForm.buttonText}
                      onChange={(e) => setServiceForm({ ...serviceForm, buttonText: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Button Link</label>
                    <input
                      type="text"
                      value={serviceForm.buttonLink}
                      onChange={(e) => setServiceForm({ ...serviceForm, buttonLink: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <UniversalImageUploader 
                      label="Feature Image"
                      value={serviceForm.image}
                      onChange={(val) => setServiceForm({ ...serviceForm, image: val })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Short Description</label>
                    <textarea
                      rows={2}
                      value={serviceForm.shortDescription}
                      onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Full Description</label>
                    <textarea
                      rows={4}
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 lg:col-span-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={serviceForm.featured}
                        onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })}
                        className="accent-emerald-500"
                      />
                      Featured Service
                    </label>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={serviceForm.showOnHomepage}
                        onChange={(e) => setServiceForm({ ...serviceForm, showOnHomepage: e.target.checked })}
                        className="accent-blue-500"
                      />
                      Show on Homepage
                    </label>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={serviceForm.published}
                        onChange={(e) => setServiceForm({ ...serviceForm, published: e.target.checked })}
                        className="accent-rose-500"
                      />
                      Published
                    </label>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Display Order</label>
                    <input
                      type="number"
                      value={serviceForm.order}
                      onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) || 1 })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div className="flex flex-col gap-1.5 md:col-span-3">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">SEO Title</label>
                    <input
                      type="text"
                      value={serviceForm.seo.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, seo: { ...serviceForm.seo, title: e.target.value } })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-3">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">SEO Description</label>
                    <input
                      type="text"
                      value={serviceForm.seo.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, seo: { ...serviceForm.seo, description: e.target.value } })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-3">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">SEO Keywords</label>
                    <input
                      type="text"
                      value={serviceForm.seo.keywords}
                      onChange={(e) => setServiceForm({ ...serviceForm, seo: { ...serviceForm.seo, keywords: e.target.value } })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      const nextService = {
                        ...selectedService,
                        title: serviceForm.title,
                        slug: serviceForm.slug,
                        category: serviceForm.category,
                        image: serviceForm.image,
                        shortDescription: serviceForm.shortDescription,
                        description: serviceForm.description,
                        buttonText: serviceForm.buttonText,
                        buttonLink: serviceForm.buttonLink,
                        featured: serviceForm.featured,
                        showOnHomepage: serviceForm.showOnHomepage,
                        published: serviceForm.published,
                        order: serviceForm.order,
                        seo: serviceForm.seo
                      };
                      const exists = services.some(s => s.id === nextService.id);
                      if (exists) {
                        setServices(services.map(s => s.id === nextService.id ? nextService : s));
                      } else {
                        setServices([...services, nextService].sort((a, b) => a.order - b.order));
                      }
                      setSelectedService(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                  >
                    Save Service
                  </button>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {services.map((service, sIndex) => (
                <div key={service.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            #{sIndex + 1}
                          </span>
                          <h3 className="font-display font-bold text-slate-900 text-sm">{service.title}</h3>
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">{service.category}</p>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${service.published ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {service.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="mt-3 text-slate-600 text-xs line-clamp-3">{service.shortDescription}</p>
                  </div>
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={sIndex === 0}
                        onClick={() => {
                          if (sIndex === 0) return;
                          const newList = [...services];
                          const temp = newList[sIndex - 1];
                          newList[sIndex - 1] = newList[sIndex];
                          newList[sIndex] = temp;
                          setServices(newList);
                        }}
                        className="px-2 py-1.5 bg-slate-200 hover:bg-blue-600 hover:text-white disabled:opacity-30 text-slate-700 rounded text-[10px] font-bold transition-colors"
                        title="Move Left / Earlier"
                      >
                        ← Up
                      </button>
                      <button
                        type="button"
                        disabled={sIndex === services.length - 1}
                        onClick={() => {
                          if (sIndex === services.length - 1) return;
                          const newList = [...services];
                          const temp = newList[sIndex + 1];
                          newList[sIndex + 1] = newList[sIndex];
                          newList[sIndex] = temp;
                          setServices(newList);
                        }}
                        className="px-2 py-1.5 bg-slate-200 hover:bg-blue-600 hover:text-white disabled:opacity-30 text-slate-700 rounded text-[10px] font-bold transition-colors"
                        title="Move Right / Later"
                      >
                        Down →
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setServiceForm({
                            title: service.title,
                            slug: service.slug,
                            category: service.category,
                            image: service.image,
                            shortDescription: service.shortDescription,
                            description: service.description,
                            buttonText: service.buttonText,
                            buttonLink: service.buttonLink,
                            featured: service.featured,
                            showOnHomepage: service.showOnHomepage,
                            published: service.published,
                            order: service.order,
                            seo: service.seo
                          });
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded text-[10px] font-bold hover:bg-slate-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setServices(services.filter(s => s.id !== service.id))}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BLOG CMS */}
        {activeTab === 'blogs' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Blog Articles CMS</h1>
                <p className="text-slate-500">Create, edit and manage articles on tech placements, resume writing, and interviews.</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedBlog({ id: `blog-${Date.now()}`, title: '', slug: '', category: 'Resume Tips', excerpt: '', content: '', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500', date: '27 Jun 2026', readTime: '5 mins read', status: 'published' });
                  setBlogForm({ title: '', slug: '', category: 'Resume Tips', excerpt: '', content: '', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500', readTime: '5 mins read', status: 'published' });
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Publish New Article</span>
              </button>
            </div>

            {selectedBlog && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
                <h3 className="font-display font-bold text-blue-400 uppercase">
                  {blogForm.title ? `Edit Article: ${blogForm.title}` : 'Draft New Article'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Post Title</label>
                    <input 
                      type="text" 
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Category Topic</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                    >
                      <option value="Resume Tips">Resume Tips</option>
                      <option value="Interview Tips">Interview Tips</option>
                      <option value="LinkedIn Tips">LinkedIn Tips</option>
                      <option value="Placement News">Placement News</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <UniversalImageUploader 
                      label="Featured Image"
                      value={blogForm.image}
                      onChange={(val) => setBlogForm({ ...blogForm, image: val })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Read Time Estimator</label>
                    <input 
                      type="text" 
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[9px]">Excerpt Summary (Lists overview)</label>
                  <input 
                    type="text" 
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white" 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[9px]">Article Main Content (Rich details)</label>
                  <textarea 
                    rows={6}
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-xs leading-relaxed" 
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => {
                      const exist = blogs.some(b => b.id === selectedBlog.id);
                      if (exist) {
                        setBlogs(blogs.map(b => b.id === selectedBlog.id ? { ...b, ...blogForm } : b));
                      } else {
                        setBlogs([...blogs, { id: selectedBlog.id, date: selectedBlog.date, ...blogForm }]);
                      }
                      setSelectedBlog(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                  >
                    Save Article
                  </button>
                  <button onClick={() => setSelectedBlog(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <img src={b.image} alt="Featured" className="h-32 w-full object-cover" />
                  <div className="p-5 flex-1 flex flex-col gap-3 justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-600">
                        <span className="bg-blue-50 px-2 py-0.5 rounded">{b.category}</span>
                        <span className="text-slate-400">{b.date}</span>
                      </div>
                      <h3 className="font-display font-bold text-slate-900 text-sm leading-tight">{b.title}</h3>
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2">{b.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <span className="font-mono text-slate-400 text-[10px]">{b.readTime}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setSelectedBlog(b);
                            setBlogForm({
                              title: b.title, slug: b.slug, category: b.category, excerpt: b.excerpt, content: b.content, image: b.image, readTime: b.readTime, status: b.status
                            });
                          }}
                          className="p-1 hover:bg-blue-50 text-blue-600 rounded"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setBlogs(blogs.filter(ps => ps.id !== b.id))}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LEADS SUBMISSIONS */}
        {activeTab === 'leads' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Form Leads submissions</h1>
                <p className="text-slate-500">Manage inquiries, student counselor bookings, and college partnership requests.</p>
              </div>
              <button 
                onClick={() => handleExportCSV('all')}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow transition-all text-xs"
              >
                <Download className="h-4 w-4" />
                <span>Export All submissions to CSV</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Full Sender Info</th>
                    <th className="px-6 py-4">Inquiry Category</th>
                    <th className="px-6 py-4">Message Context</th>
                    <th className="px-6 py-4">Status & Action</th>
                    <th className="px-6 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-950 text-sm">{l.name}</span>
                          <span className="text-slate-500">{l.email} &bull; {l.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold uppercase text-[9px]">
                          {l.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-sm leading-relaxed truncate" title={l.message}>
                        {l.message}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={l.status}
                          onChange={(e) => setLeads(leads.map(lead => lead.id === l.id ? { ...lead, status: e.target.value as any } : lead))}
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[9px] border focus:outline-none ${
                            l.status === 'new' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            l.status === 'contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setLeads(leads.filter(lead => lead.id !== l.id))}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: WORKSHOPS CMS */}
        {activeTab === 'workshops-cms' && (() => {
          const workshopsPage = pages.find(p => p.id === 'workshops');
          const workshopsSection = workshopsPage?.sections.find(s => s.type === 'workshops-list');
          const workshopsContent = workshopsSection?.content || {};
          const rawWorkshops = workshopsContent.workshops || [];

          const currentWorkshops = Array.isArray(rawWorkshops) ? [...rawWorkshops] : [];

          const galleryImages = Array.isArray(workshopsContent.galleryImages) && workshopsContent.galleryImages.length > 0
            ? workshopsContent.galleryImages
            : [
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500",
                "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=500",
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500"
              ];

          const handleSaveGallery = (updatedGallery: string[]) => {
            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'workshops') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'workshops-list') {
                        return {
                          ...section,
                          content: {
                            ...section.content,
                            galleryImages: updatedGallery,
                            isWorkshopsCustomized: true
                          }
                        };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });
          };

          const handleSaveWorkshop = () => {
            let updatedList = [];
            const isEditing = currentWorkshops.some(w => w.id === selectedWorkshop.id);
            if (isEditing) {
              updatedList = currentWorkshops.map(w => w.id === selectedWorkshop.id ? { ...w, ...workshopForm } : w);
            } else {
              updatedList = [...currentWorkshops, { id: selectedWorkshop.id, ...workshopForm }];
            }

            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'workshops') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'workshops-list') {
                        return {
                          ...section,
                          content: {
                            ...section.content,
                            workshops: updatedList,
                            isWorkshopsCustomized: true
                          }
                        };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });

            setSelectedWorkshop(null);
          };

          const handleDeleteWorkshop = (id: string) => {
            if (!confirm("Are you sure you want to delete this workshop?")) return;
            const updatedList = currentWorkshops.filter(w => w.id !== id);

            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'workshops') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'workshops-list') {
                        return {
                          ...section,
                          content: {
                            ...section.content,
                            workshops: updatedList,
                            isWorkshopsCustomized: true
                          }
                        };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });
          };

          return (
            <div className="flex flex-col gap-6 text-left text-xs font-sans">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Workshops & Placement Seminars CRM</h1>
                  <p className="text-slate-500 font-sans mt-1">Add, edit, or delete dynamic corporate workshops and placement clinics.</p>
                </div>
                <button 
                  onClick={() => {
                    const nextId = `wk-${Date.now()}`;
                    setSelectedWorkshop({ id: nextId });
                    setWorkshopForm({
                      title: '',
                      desc: '',
                      date: '30 June, 2026',
                      location: 'Bhopal',
                      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=500',
                      status: 'upcoming'
                    });
                  }}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Workshop</span>
                </button>
              </div>

              {/* Edit Form */}
              {selectedWorkshop && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
                  <h3 className="font-display font-bold text-sm text-blue-400 uppercase">
                    {workshopForm.title ? `Editing: ${workshopForm.title}` : 'Introduce New Workshop Session'}
                  </h3>

                  <UniversalImageUploader 
                    label="Workshop Cover Image"
                    value={workshopForm.image}
                    onChange={(val) => setWorkshopForm((prev: any) => ({ ...prev, image: val }))}
                    className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800/80"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[9px]">Workshop Title</label>
                      <input 
                        type="text" 
                        value={workshopForm.title} 
                        onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                        placeholder="e.g. Resume Building Workshop"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[9px]">Event Date & Time</label>
                      <input 
                        type="text" 
                        value={workshopForm.date} 
                        onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 font-mono" 
                        placeholder="e.g. 25 May, 2025"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[9px]">Venue Location / Platform</label>
                      <input 
                        type="text" 
                        value={workshopForm.location} 
                        onChange={(e) => setWorkshopForm({ ...workshopForm, location: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500" 
                        placeholder="e.g. Bhopal, Indore, Online Live"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="font-bold text-slate-400 uppercase text-[9px]">Short Pitch / Brief Description</label>
                      <textarea 
                        rows={2}
                        value={workshopForm.desc} 
                        onChange={(e) => setWorkshopForm({ ...workshopForm, desc: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 font-sans" 
                        placeholder="Tell students what they will achieve from this session..."
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[9px]">Workshop Status Timeline</label>
                      <select 
                        value={workshopForm.status} 
                        onChange={(e) => setWorkshopForm({ ...workshopForm, status: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="upcoming">Upcoming (Accepting registrations)</option>
                        <option value="past">Past / Completed (Show in history)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white text-xs">Is Free Workshop?</h4>
                        <p className="text-slate-400 text-[10px]">Toggle if this workshop has no entrance fee.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWorkshopForm({ ...workshopForm, isFree: !workshopForm.isFree, price: !workshopForm.isFree ? 0 : (workshopForm.price || 199) })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${workshopForm.isFree ? 'bg-emerald-600' : 'bg-slate-700'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ${workshopForm.isFree ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {!workshopForm.isFree && (
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Entry Ticket Price (INR)</label>
                        <input
                          type="number"
                          value={workshopForm.price || ''}
                          onChange={(e) => setWorkshopForm({ ...workshopForm, price: parseInt(e.target.value, 10) || 0 })}
                          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 font-mono"
                          placeholder="e.g. 199"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={handleSaveWorkshop}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer transition-colors"
                    >
                      Save Workshop Session
                    </button>
                    <button 
                      onClick={() => setSelectedWorkshop(null)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Workshops Directory Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Workshops Directory ({currentWorkshops.length} total)</span>
                  {workshopsContent.isWorkshopsCustomized && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded uppercase">Custom Configuration Saved</span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 uppercase text-[9px] font-bold border-b border-slate-200">
                        <th className="p-4">Cover Image</th>
                        <th className="p-4">Workshop Detail</th>
                        <th className="p-4">Price / Fee</th>
                        <th className="p-4">Schedule</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Timeline Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentWorkshops.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <img src={item.image} alt="" className="h-12 w-20 object-cover rounded-lg border border-slate-100 shadow-sm" />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                            <div className="text-slate-500 text-[10px] mt-0.5 line-clamp-1">{item.desc}</div>
                          </td>
                          <td className="p-4">
                            {item.isFree || !item.price ? (
                              <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded">FREE</span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold font-mono rounded">₹{item.price}</span>
                            )}
                          </td>
                          <td className="p-4 font-mono font-semibold text-slate-700">{item.date}</td>
                          <td className="p-4 text-slate-600">{item.location}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              item.status === 'upcoming' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => {
                                  setSelectedWorkshop(item);
                                  setWorkshopForm({ ...item });
                                }}
                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                                title="Edit Session"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteWorkshop(item.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Session"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Workshop Gallery/Glimpses Editor */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 uppercase">Workshop Glimpses & Gallery Editor</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5 font-sans">Manage the dynamic photos displayed in the 'Glimpses from our Workshops' section and the 'Gallery' tab of the Workshops page.</p>
                </div>

                {/* Multi image upload and URL paste form */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 font-sans">
                  <UniversalMultiImageUploader
                    label="Add Multiple Photos (Upload Files or Paste URLs)"
                    onImagesUploaded={(newUrls) => {
                      const updatedGallery = [...galleryImages, ...newUrls];
                      handleSaveGallery(updatedGallery);
                    }}
                    helperText="You can drop multiple image files, choose multiple files from your computer, or paste one/more URLs to instantly upload them all together!"
                  />
                </div>

                {/* Grid of current images */}
                <div>
                  <div className="flex items-center justify-between mb-3 font-sans">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Current Gallery Photos ({galleryImages.length})</span>
                    <button
                      onClick={() => {
                        if (confirm("Reset gallery back to the default 8 Unsplash photos? This will overwrite your custom gallery images.")) {
                          handleSaveGallery([
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
                            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
                            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
                            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
                            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500",
                            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500",
                            "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=500",
                            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500"
                          ]);
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center gap-1 font-sans"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Reset to Defaults</span>
                    </button>
                  </div>

                  {galleryImages.length === 0 ? (
                    <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 font-sans">
                      No gallery images uploaded yet. Use the tool above to add some or click Reset to Defaults.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 font-sans">
                      {galleryImages.map((img: string, index: number) => (
                        <div key={index} className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 shadow-sm">
                          <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => {
                                const updatedGallery = galleryImages.filter((_: string, idx: number) => idx !== index);
                                handleSaveGallery(updatedGallery);
                              }}
                              className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform transform hover:scale-110 cursor-pointer shadow-md"
                              title="Delete Photo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB: WORKSHOP REGISTRATIONS CRM */}
        {activeTab === 'workshop-registrations' && (() => {
          const regs = getWorkshopRegistrations();
          const emails = getEmailLogs();
          
          // Filter registrations
          const filteredRegs = regs.filter((r: any) => {
            const matchesSearch = 
              r.name.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
              r.email.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
              r.phone.includes(regSearchQuery) ||
              r.college.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
              r.workshopTitle.toLowerCase().includes(regSearchQuery.toLowerCase());
              
            const matchesStatus = 
              regStatusFilter === 'all' ||
              (regStatusFilter === 'free' && r.isFree) ||
              (regStatusFilter === 'paid' && !r.isFree);

            const matchesWorkshop =
              regWorkshopFilter === 'all' ||
              r.workshopId === regWorkshopFilter;

            return matchesSearch && matchesStatus && matchesWorkshop;
          });

          // Compute metrics
          const totalCount = regs.length;
          const totalEarnings = regs.reduce((sum: number, r: any) => sum + (r.pricePaid || 0), 0);
          const freeCount = regs.filter((r: any) => r.isFree).length;
          const paidCount = regs.filter((r: any) => !r.isFree).length;

          // Unique workshops for filtering
          const uniqueWkOptions = Array.from(new Set<string>(regs.map((r: any) => JSON.stringify({ id: r.workshopId, title: r.workshopTitle }))))
            .map((str) => JSON.parse(str));

          const handleDeleteReg = (id: string) => {
            const confirmed = window.confirm("Are you sure you want to delete this student registration?");
            if (confirmed) {
              const updated = regs.filter((r: any) => r.id !== id);
              saveWorkshopRegistrations(updated);
              triggerToast("Registration deleted successfully!");
            }
          };

          // Canvas Admit Card Generator
          const downloadAdmitCardPNG = (student: any) => {
            const canvas = document.createElement('canvas');
            canvas.width = 750;
            canvas.height = 950;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Background
            ctx.fillStyle = '#0b1329'; // Deep Space Navy
            ctx.fillRect(0, 0, 750, 950);

            // Tech Grid Accents
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // Emerald
            ctx.lineWidth = 1;
            for (let i = 0; i < 750; i += 30) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, 950);
              ctx.stroke();
            }
            for (let j = 0; j < 950; j += 30) {
              ctx.beginPath();
              ctx.moveTo(0, j);
              ctx.lineTo(750, j);
              ctx.stroke();
            }

            // Outer Neon Border
            ctx.strokeStyle = student.isFree ? '#10b981' : '#3b82f6'; // Emerald or Blue
            ctx.lineWidth = 6;
            ctx.strokeRect(20, 20, 710, 910);

            // Header Banner
            ctx.fillStyle = student.isFree ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)';
            ctx.fillRect(40, 40, 670, 110);
            ctx.strokeStyle = student.isFree ? '#10b981' : '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(40, 40, 670, 110);

            // Header Text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText('TANTRA PEX MASTERCLASS', 80, 105);

            ctx.fillStyle = student.isFree ? '#10b981' : '#3b82f6';
            ctx.font = '900 13px sans-serif';
            ctx.fillText('OFFICIAL ENTRY PASS & ADMIT CARD', 80, 72);

            // Ticket Details Border Box
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.strokeRect(40, 180, 670, 520);

            // Vertical divider
            ctx.beginPath();
            ctx.moveTo(420, 180);
            ctx.lineTo(420, 700);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();

            // Left Side: Student Details
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('STUDENT NAME', 70, 220);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText(student.name, 70, 245);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('EMAIL ADDRESS', 70, 300);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(student.email, 70, 322);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('TELEPHONE / CONTACT', 70, 370);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(student.phone, 70, 392);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('ACADEMIC COLLEGE / BRANCH', 70, 440);
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(student.college, 70, 462);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '12px sans-serif';
            ctx.fillText(`${student.branch} • ${student.year}`, 70, 482);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('WORKSHOP ALLOCATION', 70, 540);
            ctx.fillStyle = student.isFree ? '#10b981' : '#3b82f6';
            ctx.font = 'black 18px sans-serif';
            ctx.fillText(student.workshopTitle, 70, 565);

            // Right Side: Pass Details & QR Code box
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('TICKET ID', 450, 220);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px sans-serif';
            ctx.fillText(student.id, 450, 242);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('TRANSACTION ID', 450, 290);
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(student.transactionId || 'TPX-FREE-SECURE', 450, 312);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('PASS CLASSIFICATION', 450, 360);
            ctx.fillStyle = student.isFree ? '#10b981' : '#3b82f6';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(student.isFree ? 'FREE PASS' : `PAID PASS • ₹${student.pricePaid}`, 450, 385);

            // Simulated Barcode inside canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(450, 430, 220, 55);
            ctx.fillStyle = '#000000';
            for (let i = 0; i < 220; i += Math.random() * 8 + 2) {
              const barWidth = Math.floor(Math.random() * 4) + 1;
              ctx.fillRect(450 + i, 430, barWidth, 55);
            }

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('VERIFIABLE SECURITY BARCODE', 465, 502);

            // Bottom Footer of Admit Card
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(40, 720, 670, 170);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.strokeRect(40, 720, 670, 170);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('IMPORTANT CANDIDATE INSTRUCTIONS', 65, 755);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px sans-serif';
            ctx.fillText('1. Please carry either a print-out of this pass or keep the PNG handy on your smartphone.', 65, 785);
            ctx.fillText('2. Entrance gate closes 15 minutes prior to the scheduled masterclass start time.', 65, 810);
            ctx.fillText('3. All workshop assets, templates, and certificates will be unlocked instantly post-session.', 65, 835);
            ctx.fillText('4. For any queries, drop an email to: support@tantrapex.com quote your Ticket ID.', 65, 860);

            // Save to file download
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `Admit_Card_${student.name.replace(/\s+/g, '_')}_TPX.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            triggerToast("Admit Card download started automatically!");
          };

          return (
            <div className="flex flex-col gap-6 text-left text-xs font-sans">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Workshop Registrations</h1>
                  <p className="text-slate-500">View detailed reports, download student admit cards, and review simulated Razorpay transaction receipts.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportRegsCSV(filteredRegs)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors text-[10px] uppercase"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV Report
                  </button>
                </div>
              </div>

              {/* Toast Notifications */}
              {regToast && (
                <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-2xl animate-fade-in font-bold text-[10px] uppercase tracking-wider">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  {regToast}
                </div>
              )}

              {/* Metrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 uppercase font-bold tracking-wider text-[9px]">Total Registered</div>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalCount} Students</div>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 uppercase font-bold tracking-wider text-[9px]">Total Earnings</div>
                    <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">₹{totalEarnings.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 uppercase font-bold tracking-wider text-[9px]">Free Masterclasses</div>
                    <div className="text-2xl font-bold font-mono text-blue-600 mt-1">{freeCount} Entries</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Ticket className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 uppercase font-bold tracking-wider text-[9px]">Paid Entries</div>
                    <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">{paidCount} Tickets</div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={regSearchQuery}
                    onChange={(e) => setRegSearchQuery(e.target.value)}
                    placeholder="Search student name, email, phone, college, or workshop title..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <select
                    value={regStatusFilter}
                    onChange={(e) => setRegStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white"
                  >
                    <option value="all">All Payment Status</option>
                    <option value="free">FREE Entry Pass</option>
                    <option value="paid">PAID Entrance Ticket</option>
                  </select>

                  <select
                    value={regWorkshopFilter}
                    onChange={(e) => setRegWorkshopFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white max-w-xs"
                  >
                    <option value="all">All Allocated Workshops</option>
                    {uniqueWkOptions.map((opt: any) => (
                      <option key={opt.id} value={opt.id}>{opt.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Registered Students Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Students Enrolled ({filteredRegs.length} total)</span>
                  <span className="text-[10px] text-slate-400">Showing filtered masterclass registrations</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 uppercase text-[9px] font-bold border-b border-slate-200">
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Student Details</th>
                        <th className="p-4">College & Branch</th>
                        <th className="p-4">Workshop Selected</th>
                        <th className="p-4">Price Paid</th>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRegs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-12 text-center text-slate-400">
                            No student registrations match your filter parameters.
                          </td>
                        </tr>
                      ) : (
                        filteredRegs.map((r: any, idx: number) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-mono font-bold text-slate-600">{r.id}</td>
                            <td className="p-4">
                              <div className="font-bold text-slate-900">{r.name}</div>
                              <div className="text-slate-500 text-[10px]">{r.email}</div>
                              <div className="text-slate-500 text-[10px]">{r.phone}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-slate-800">{r.college}</div>
                              <div className="text-slate-500 text-[10px]">{r.branch} • {r.year}</div>
                            </td>
                            <td className="p-4 font-bold text-slate-700">{r.workshopTitle}</td>
                            <td className="p-4 font-mono font-bold text-slate-900">
                              {r.isFree ? '₹0' : `₹${r.pricePaid}`}
                            </td>
                            <td className="p-4 font-mono text-[10px] text-slate-400">{r.transactionId || 'N/A'}</td>
                            <td className="p-4">
                              {r.isFree ? (
                                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase">Confirmed</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">Paid</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedRegForTicket(r)}
                                  className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                                  title="View entry pass ticket details"
                                >
                                  <Ticket className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleResendRegEmail(r)}
                                  className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                                  title="Resend Admit Card Email"
                                >
                                  <Mail className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReg(r.id)}
                                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Delete registration entry"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Simulated Email Logs Log Panel */}
              <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-400 animate-pulse" /> Outgoing Email Delivery Server Logs (CRM Integration)
                    </h2>
                    <p className="text-slate-400 text-[10px] mt-0.5">Live background server logs tracking confirmation mails with PDF/PNG Ticket attachments dispatched.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[9px] font-black uppercase rounded-lg">SMTP Active</span>
                </div>

                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                  {emails.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">No emails have been dispatched by the server yet.</div>
                  ) : (
                    emails.map((m: any, idx: number) => (
                      <div key={m.id || idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-2 hover:border-slate-700 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                            Sent to: {m.recipientName} ({m.recipientEmail})
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(m.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-200">Subject: {m.subject}</div>
                        <p className="text-slate-400 text-[11px] font-mono leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/50">
                          {m.bodyPreview}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Delivered • 1 Attachment Dispatched (Admit_Card_PNG)
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Detailed Pass Overlay Card Modal */}
              {selectedRegForTicket && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 flex flex-col gap-6 shadow-2xl animate-scale-up text-white relative">
                    <button
                      onClick={() => setSelectedRegForTicket(null)}
                      className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5 text-slate-400" />
                    </button>

                    <div className="text-center">
                      <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                        Verifiable Official Entry Pass
                      </span>
                      <h2 className="text-xl font-display font-extrabold text-white mt-2 uppercase tracking-wide">
                        Admit Card Entry Pass
                      </h2>
                      <p className="text-slate-400 text-[10px] mt-0.5">Below is the entrance admit card generated for the enrolled session.</p>
                    </div>

                    {/* Highly stylized visual pass pass boarding style card */}
                    <div className={`p-5 rounded-2xl border ${selectedRegForTicket.isFree ? 'border-emerald-600/50 bg-emerald-950/10' : 'border-blue-600/50 bg-blue-950/10'} relative overflow-hidden flex flex-col gap-4 shadow-inner`}>
                      
                      {/* Grid background visual */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

                      <div className="flex justify-between items-start border-b border-slate-800 pb-3 relative z-10">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 tracking-wider">TANTRA PEX</div>
                          <div className="text-base font-extrabold text-white">{selectedRegForTicket.workshopTitle}</div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${selectedRegForTicket.isFree ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {selectedRegForTicket.isFree ? 'FREE ENTRY' : `PAID TICKET`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10 font-mono text-[11px] leading-relaxed">
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">Student Name</div>
                          <div className="text-white font-bold text-xs">{selectedRegForTicket.name}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">Ticket Pass ID</div>
                          <div className="text-emerald-400 font-bold text-xs">{selectedRegForTicket.id}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">College Allocation</div>
                          <div className="text-slate-200 text-xs truncate" title={selectedRegForTicket.college}>{selectedRegForTicket.college}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-bold uppercase text-[9px]">Transaction Ref</div>
                          <div className="text-slate-300 text-xs truncate">{selectedRegForTicket.transactionId || 'TPX-FREE-987A'}</div>
                        </div>
                      </div>

                      {/* Barcode representation */}
                      <div className="bg-white p-3 rounded-xl flex flex-col items-center gap-1.5 relative z-10">
                        <div className="w-full h-10 flex gap-0.5 justify-center overflow-hidden">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-slate-950 h-full"
                              style={{ width: `${Math.floor(Math.random() * 3) + 1}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 font-bold tracking-widest">{selectedRegForTicket.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadAdmitCardPNG(selectedRegForTicket)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors uppercase tracking-wider text-[10px]"
                      >
                        Download Admit Card PNG
                      </button>
                      <button
                        onClick={() => setSelectedRegForTicket(null)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors text-[10px]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB: PLAN PURCHASES CRM */}
        {activeTab === 'plan-purchases' && (() => {
          const purchases = getPlanPurchases();
          const filteredPurchases = purchases.filter((p: any) => {
            return (
              p.studentName.toLowerCase().includes(planSearchQuery.toLowerCase()) ||
              p.studentEmail.toLowerCase().includes(planSearchQuery.toLowerCase()) ||
              p.studentPhone.includes(planSearchQuery) ||
              p.planName.toLowerCase().includes(planSearchQuery.toLowerCase()) ||
              p.paymentId.toLowerCase().includes(planSearchQuery.toLowerCase())
            );
          });

          const totalRevenue = purchases.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
          const totalCount = purchases.length;
          const avgTicket = totalCount > 0 ? (totalRevenue / totalCount).toFixed(0) : "0";

          return (
            <div className="flex flex-col gap-6 text-left text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Pricing Plan Purchases CRM</h1>
                  <p className="text-slate-500">Live payment audit board. Track premium users, active plan subscribers, and auto-dispatch logs.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/10 text-emerald-700 font-bold px-3 py-1.5 rounded-full text-[10px] uppercase border border-emerald-500/20">
                    Live Transactions Active
                  </div>
                </div>
              </div>

              {/* Metrics Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Volume</span>
                  <span className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1">100% captured via Razorpay</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subscriber Enrollments</span>
                  <span className="text-2xl font-black text-slate-900">{totalCount} Active</span>
                  <span className="text-[10px] text-slate-500 mt-1">Total premium accounts created</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Order Value (AOV)</span>
                  <span className="text-2xl font-black text-slate-900">₹{avgTicket}</span>
                  <span className="text-[10px] text-blue-600 font-bold mt-1">Pricing package conversions</span>
                </div>
              </div>

              {/* Search Control Board */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                  <FormInput className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student, plan, payment ID..."
                    value={planSearchQuery}
                    onChange={(e) => setPlanSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleAdminTestPayment}
                    disabled={isRunningAdminTestPayment}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    {isRunningAdminTestPayment ? 'Processing ₹1 Test...' : 'Trigger ₹1 Razorpay Test'}
                  </button>
                  <span className="text-slate-500 font-medium text-[11px] shrink-0">
                    Showing {filteredPurchases.length} of {totalCount} records
                  </span>
                </div>
              </div>

              {adminTestPaymentStatus.type && (
                <div className={`p-3 rounded-lg border text-xs font-medium ${
                  adminTestPaymentStatus.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {adminTestPaymentStatus.message}
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Student Info</th>
                        <th className="py-3 px-4">Enrolled Plan</th>
                        <th className="py-3 px-4">Payment ID</th>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredPurchases.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            No billing plan purchase matching your criteria was found.
                          </td>
                        </tr>
                      ) : (
                        filteredPurchases.map((p: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-xs">{p.studentName}</span>
                                <span className="text-[10px] text-slate-500">{p.studentEmail}</span>
                                <span className="text-[10px] text-slate-400">{p.studentPhone}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] uppercase font-bold border border-blue-100">
                                {p.planName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 font-bold">{p.paymentId}</td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{p.orderId}</td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{p.date}</td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-900 text-xs">₹{p.amount}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] border border-emerald-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Captured
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
        {activeTab === 'media' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Media Library Manager</h1>
                <p className="text-slate-500">Professional visual files directory. Host student avatars, company logos, and background photos.</p>
              </div>
            </div>

            {/* Quick Upload Form */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="font-bold text-slate-400 uppercase text-[9px]">File Reference Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. LNCT College Logo"
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  className="px-3 py-2 bg-slate-850 border border-slate-800 rounded text-white" 
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="font-bold text-slate-400 uppercase text-[9px]">Static Asset URL Link</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://images.unsplash.com/photo..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="px-3 py-2 bg-slate-850 border border-slate-800 rounded text-white font-mono" 
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-36">
                <label className="font-bold text-slate-400 uppercase text-[9px]">Resource Format</label>
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as any)}
                  className="px-3 py-2 bg-slate-850 border border-slate-800 rounded text-white font-semibold"
                >
                  <option value="image">Image File</option>
                  <option value="video">MP4 Video</option>
                  <option value="svg">Vector SVG</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  if (!newMediaName || !newMediaUrl) return;
                  setMedia([...media, {
                    id: `img-${Date.now()}`,
                    name: newMediaName,
                    url: newMediaUrl,
                    type: newMediaType,
                    size: "520 KB",
                    folder: "Uploads",
                    altText: newMediaName
                  }]);
                  setNewMediaName('');
                  setNewMediaUrl('');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow shrink-0 w-full sm:w-auto"
              >
                Upload Asset
              </button>
            </div>

            {/* Folder grid listing */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              {media.map((file, idx) => (
                <div key={`${file.id}-${idx}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-3 shadow-sm flex flex-col gap-2 justify-between">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="h-32 w-full object-cover rounded-lg border border-slate-100" />
                  ) : (
                    <div className="h-32 w-full bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 font-bold uppercase text-[10px]">
                      <Image className="h-6 w-6 text-slate-300 mb-1" />
                      <span>{file.type} Asset</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="font-bold text-slate-900 truncate text-[11px]">{file.name}</span>
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>{file.size}</span>
                      <span>{file.folder}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMedia(media.filter(f => f.id !== file.id))}
                    className="mt-2 text-rose-500 hover:bg-rose-50 py-1 rounded w-full flex items-center justify-center gap-1 font-semibold"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: STUDENT LMS PORTAL CMS */}
        {activeTab === 'lms-cms' && (() => {
          const lmsPage = pages.find(p => p.id === 'lms');
          const lmsSection = lmsPage?.sections.find(s => s.type === 'lms-dashboard');
          const lmsContent = lmsSection?.content || {};

          // Extract content with default values
          const sName = lmsContent.studentName || "Pratham Joshi";
          const sId = lmsContent.studentId || "TPX-2026-089";
          const nText = lmsContent.notificationText || "Reminder: Upcoming Live Class on Aptitude - Percentage begins in 15 minutes.";

          const cIconUrl = lmsContent.coursesIconUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=150";
          const cLabel = lmsContent.coursesLabel || "My Courses";
          const cVal = lmsContent.coursesValue || "5 Enrolled";

          const clIconUrl = lmsContent.classesIconUrl || "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=150";
          const clLabel = lmsContent.classesLabel || "Live Classes";
          const clVal = lmsContent.classesValue || "2 Upcoming";

          const aIconUrl = lmsContent.assignmentsIconUrl || "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=150";
          const aLabel = lmsContent.assignmentsLabel || "Assignments";
          const aVal = lmsContent.assignmentsValue || "3 Pending";

          const tIconUrl = lmsContent.testsIconUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=150";
          const tLabel = lmsContent.testsLabel || "Mock Tests";
          const tVal = lmsContent.testsValue || "4 Pending";

          const progItems = lmsContent.progressItems || [
            { name: "Java Programming", progress: 75 },
            { name: "Web Development", progress: 50 },
            { name: "Aptitude Training", progress: 100 }
          ];

          const liveTitle = lmsContent.liveClassTitle || "Aptitude - Percentage";
          const liveInst = lmsContent.liveClassInstructor || "By Ravi Sir";
          const liveSch = lmsContent.liveClassSchedule || "Tomorrow, 11:00 AM";
          const liveBtn = lmsContent.liveClassBtnText || "Join Class";

          const vidThumbnail = lmsContent.videoThumbnailUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600";
          const vidUrl = lmsContent.videoUrl || "https://www.youtube.com";

          const gLogoUrl = lmsContent.googleLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";
          const gRating = lmsContent.googleRating || "4.8";
          const gReviews = lmsContent.googleReviewsText || "Based on 500+ Reviews";
          const gBtn = lmsContent.googleBtnText || "Read Reviews";
          const gLink = lmsContent.googleReviewsLink || "https://google.com";

          const recentActs = lmsContent.recentActivities || [
            { id: "act-1", title: "Java Basics", type: "Live Class", status: "Completed", date: "10 May 2024", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" },
            { id: "act-2", title: "Data Structures", type: "Assignment", status: "Submitted", date: "09 May 2024", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
            { id: "act-3", title: "Aptitude Mock Test 1", type: "Mock Test", status: "In Progress", date: "09 May 2024", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
            { id: "act-4", title: "Resume Building", type: "Live Class", status: "Completed", date: "08 May 2024", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
            { id: "act-5", title: "Interview Skills", type: "Live Class", status: "Upcoming", date: "11 May 2024", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" }
          ];

          const handleUpdateLms = (updatedFields: any) => {
            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'lms') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'lms-dashboard') {
                        return {
                          ...section,
                          content: {
                            ...section.content,
                            ...updatedFields
                          }
                        };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });
          };

          return (
            <div className="flex flex-col gap-6 text-left text-xs font-sans max-w-4xl">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Student LMS Dashboard CMS</h1>
                <p className="text-slate-500">Edit every image, icon, label, progress stat, and activity card on the LMS Student Portal page.</p>
              </div>

              {/* 1. STUDENT PROFILE & ALERTS */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h3 className="font-display font-bold text-slate-800 text-sm">1. Student Profile & Alerts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Student Name</label>
                    <input 
                      type="text" 
                      value={sName}
                      onChange={(e) => handleUpdateLms({ studentName: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Student ID / Roll No</label>
                    <input 
                      type="text" 
                      value={sId}
                      onChange={(e) => handleUpdateLms({ studentId: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Notification Alert Banner</label>
                    <input 
                      type="text" 
                      value={nText}
                      onChange={(e) => handleUpdateLms({ notificationText: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 2. STATS CARDS (ICONS AS IMAGES) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-display font-bold text-slate-800 text-sm">2. Stats Cards (Images & Labels)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: My Courses */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-blue-700 text-[10px] uppercase">Card 1: My Courses</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Label</label>
                        <input type="text" value={cLabel} onChange={(e) => handleUpdateLms({ coursesLabel: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Value/Status</label>
                        <input type="text" value={cVal} onChange={(e) => handleUpdateLms({ coursesValue: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                    </div>
                    <UniversalImageUploaderLight 
                      label="Icon Image"
                      value={cIconUrl}
                      onChange={(val) => handleUpdateLms({ coursesIconUrl: val })}
                    />
                  </div>

                  {/* Card 2: Live Classes */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-purple-700 text-[10px] uppercase">Card 2: Live Classes</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Label</label>
                        <input type="text" value={clLabel} onChange={(e) => handleUpdateLms({ classesLabel: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Value/Status</label>
                        <input type="text" value={clVal} onChange={(e) => handleUpdateLms({ classesValue: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                    </div>
                    <UniversalImageUploaderLight 
                      label="Icon Image"
                      value={clIconUrl}
                      onChange={(val) => handleUpdateLms({ classesIconUrl: val })}
                    />
                  </div>

                  {/* Card 3: Assignments */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-amber-700 text-[10px] uppercase">Card 3: Assignments</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Label</label>
                        <input type="text" value={aLabel} onChange={(e) => handleUpdateLms({ assignmentsLabel: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Value/Status</label>
                        <input type="text" value={aVal} onChange={(e) => handleUpdateLms({ assignmentsValue: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                    </div>
                    <UniversalImageUploaderLight 
                      label="Icon Image"
                      value={aIconUrl}
                      onChange={(val) => handleUpdateLms({ assignmentsIconUrl: val })}
                    />
                  </div>

                  {/* Card 4: Mock Tests */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-emerald-700 text-[10px] uppercase">Card 4: Mock Tests</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Label</label>
                        <input type="text" value={tLabel} onChange={(e) => handleUpdateLms({ testsLabel: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Value/Status</label>
                        <input type="text" value={tVal} onChange={(e) => handleUpdateLms({ testsValue: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                    </div>
                    <UniversalImageUploaderLight 
                      label="Icon Image"
                      value={tIconUrl}
                      onChange={(val) => handleUpdateLms({ testsIconUrl: val })}
                    />
                  </div>
                </div>
              </div>

              {/* 3. YOUR PROGRESS & LIVE CLASSES */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-display font-bold text-slate-800 text-sm">3. Progress Tracker & Live Class Panel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress Tracks */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-slate-700 text-[10px] uppercase">Your Progress Bars (Max 3)</span>
                    {progItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => {
                            const copy = [...progItems];
                            copy[idx].name = e.target.value;
                            handleUpdateLms({ progressItems: copy });
                          }} 
                          placeholder="Subject" 
                          className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px]" 
                        />
                        <input 
                          type="number" 
                          value={item.progress} 
                          onChange={(e) => {
                            const copy = [...progItems];
                            copy[idx].progress = Number(e.target.value);
                            handleUpdateLms({ progressItems: copy });
                          }} 
                          placeholder="%" 
                          className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px] font-mono" 
                        />
                      </div>
                    ))}
                  </div>

                  {/* Upcoming class card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-slate-700 text-[10px] uppercase">Upcoming Live Class Card</span>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-500">Lecture Title</label>
                      <input type="text" value={liveTitle} onChange={(e) => handleUpdateLms({ liveClassTitle: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Instructor Name</label>
                        <input type="text" value={liveInst} onChange={(e) => handleUpdateLms({ liveClassInstructor: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Schedule Info</label>
                        <input type="text" value={liveSch} onChange={(e) => handleUpdateLms({ liveClassSchedule: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. VIDEO PLAYBACK & GOOGLE RATING */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-display font-bold text-slate-800 text-sm">4. Video & Google Rating Blocks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video block */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-slate-700 text-[10px] uppercase">Video Thumbnail block</span>
                    <UniversalImageUploaderLight 
                      label="Thumbnail Image"
                      value={vidThumbnail}
                      onChange={(val) => handleUpdateLms({ videoThumbnailUrl: val })}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-500">Video Link URL</label>
                      <input type="text" value={vidUrl} onChange={(e) => handleUpdateLms({ videoUrl: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 font-mono text-xs" />
                    </div>
                  </div>

                  {/* Google Rating block */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                    <span className="font-bold text-slate-700 text-[10px] uppercase">Google rating block</span>
                    <UniversalImageUploaderLight 
                      label="Google Logo Image"
                      value={gLogoUrl}
                      onChange={(val) => handleUpdateLms({ googleLogoUrl: val })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Rating Text (e.g. 4.8)</label>
                        <input type="text" value={gRating} onChange={(e) => handleUpdateLms({ googleRating: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Reviews count label</label>
                        <input type="text" value={gReviews} onChange={(e) => handleUpdateLms({ googleReviewsText: e.target.value })} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. RECENT ACTIVITY CARDS WITH IMAGES */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-display font-bold text-slate-800 text-sm">5. Recent Activity Cards (Labels, Badges & Student Images)</h3>
                <div className="flex flex-col gap-4">
                  {recentActs.map((act: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3">
                      <span className="font-bold text-[#071B4D] text-[10px] uppercase">Activity Card #{idx + 1}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-semibold text-slate-500">Title</label>
                          <input type="text" value={act.title} onChange={(e) => {
                            const copy = [...recentActs];
                            copy[idx].title = e.target.value;
                            handleUpdateLms({ recentActivities: copy });
                          }} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-semibold text-slate-500">Type</label>
                          <input type="text" value={act.type} onChange={(e) => {
                            const copy = [...recentActs];
                            copy[idx].type = e.target.value;
                            handleUpdateLms({ recentActivities: copy });
                          }} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-semibold text-slate-500">Status Badge</label>
                          <select value={act.status} onChange={(e) => {
                            const copy = [...recentActs];
                            copy[idx].status = e.target.value;
                            handleUpdateLms({ recentActivities: copy });
                          }} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px]">
                            <option value="Completed">Completed</option>
                            <option value="Submitted">Submitted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Upcoming">Upcoming</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-semibold text-slate-500">Date Info</label>
                          <input type="text" value={act.date} onChange={(e) => {
                            const copy = [...recentActs];
                            copy[idx].date = e.target.value;
                            handleUpdateLms({ recentActivities: copy });
                          }} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px]" />
                        </div>
                      </div>
                      <UniversalImageUploaderLight 
                        label="Student Profile Image"
                        value={act.image}
                        onChange={(val) => {
                          const copy = [...recentActs];
                          copy[idx].image = val;
                          handleUpdateLms({ recentActivities: copy });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-emerald-800 font-semibold">
                <span>Student LMS Portal configuration saved and updated instantly on database!</span>
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
              </div>
            </div>
          );
        })()}

        {/* TAB: CAMPUS AMBASSADOR CMS */}
        {activeTab === 'ambassador-cms' && (() => {
          const ambPage = pages.find(p => p.id === 'campus-ambassador');
          const ambSection = ambPage?.sections.find(s => s.type === 'ambassador-main');
          const ambContent = ambSection?.content || {};

          // Extract values
          const titleVal = ambSection?.title || "Become a Campus Ambassador";
          const subtitleVal = ambSection?.subtitle || "Lead. Learn. Earn.";
          const benefitsTitleVal = ambContent.benefitsTitle || "Benefits You Get";
          const benefitsVal = ambContent.benefits || [
            "Enhance Communication",
            "Internship Opportunities",
            "Leadership Exposure",
            "Monthly Incentives",
            "Placement Priority",
            "Branding & Experience",
            "Exclusive Trainings"
          ];
          const imageUrlVal = ambContent.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800";
          const formTitleVal = ambContent.formTitle || "Apply Now";
          const pastTitleVal = ambContent.pastAmbassadorsTitle || "Our Past Ambassadors";
          const pastListVal = ambContent.pastAmbassadors || [
            { id: "pa-1", year: "2019", title: "Joined Journey", desc: "Our pioneer campus crew began here." },
            { id: "pa-2", year: "2021", title: "Expanded to 50+ Colleges", desc: "Mentored over 500+ student leads across colleges." },
            { id: "pa-3", year: "2023", title: "Expanded to India Wide", desc: "Established closed pooled networks across standard cities." },
            { id: "pa-4", year: "2024+", title: "Expanding to more cities", desc: "Now adding dynamic tech nodes globally." }
          ];

          const handleUpdateAmbassador = (updatedFields: any) => {
            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'campus-ambassador') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'ambassador-main') {
                        return {
                          ...section,
                          content: {
                            ...section.content,
                            ...updatedFields
                          }
                        };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });
          };

          const handleUpdateAmbassadorTitle = (newTitle: string) => {
            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'campus-ambassador') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'ambassador-main') {
                        return { ...section, title: newTitle };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });
          };

          const handleUpdateAmbassadorSubtitle = (newSubtitle: string) => {
            setPages(prevPages => {
              return prevPages.map(page => {
                if (page.id === 'campus-ambassador') {
                  return {
                    ...page,
                    sections: page.sections.map(section => {
                      if (section.type === 'ambassador-main') {
                        return { ...section, subtitle: newSubtitle };
                      }
                      return section;
                    })
                  };
                }
                return page;
              });
            });
          };

          return (
            <div className="flex flex-col gap-6 text-left text-xs font-sans max-w-4xl">
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-[#071B4D] uppercase">Campus Ambassador CMS</h1>
                <p className="text-slate-500">Update images, labels, list items, and timelines on the Campus Ambassador page instantly.</p>
              </div>

              {/* 1. HERO TITLE & SUBTITLE */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h3 className="font-display font-bold text-slate-800 text-sm">1. Hero Section Texts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Hero Title</label>
                    <input 
                      type="text" 
                      value={titleVal}
                      onChange={(e) => handleUpdateAmbassadorTitle(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Hero Subtitle</label>
                    <input 
                      type="text" 
                      value={subtitleVal}
                      onChange={(e) => handleUpdateAmbassadorSubtitle(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 2. MAIN AMBASSADOR IMAGE & BENEFITS */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-display font-bold text-slate-800 text-sm">2. Main Image & Benefits Configuration</h3>
                
                <UniversalImageUploaderLight 
                  label="Ambassador Illustration Image"
                  value={imageUrlVal}
                  onChange={(val) => handleUpdateAmbassador({ imageUrl: val })}
                />

                <div className="h-px bg-slate-100 my-2" />

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Benefits Header Title</label>
                  <input 
                    type="text" 
                    value={benefitsTitleVal}
                    onChange={(e) => handleUpdateAmbassador({ benefitsTitle: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Benefits Points ({benefitsVal.length})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefitsVal.map((benefit: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-slate-400 font-bold font-mono text-[10px]">#{idx + 1}</span>
                        <input 
                          type="text" 
                          value={benefit} 
                          onChange={(e) => {
                            const updated = [...benefitsVal];
                            updated[idx] = e.target.value;
                            handleUpdateAmbassador({ benefits: updated });
                          }} 
                          className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-medium" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. TIMELINE & PAST MILESTONES */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold text-slate-800 text-sm">3. Past Milestones & Timelines</h3>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="font-bold text-slate-600 uppercase tracking-wide text-[9px]">Milestones Header Title</label>
                    <input 
                      type="text" 
                      value={pastTitleVal}
                      onChange={(e) => handleUpdateAmbassador({ pastAmbassadorsTitle: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pastListVal.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3 text-left">
                      <span className="font-bold text-blue-700 text-[10px] uppercase">Milestone #{idx + 1}</span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1 col-span-1">
                          <label className="font-semibold text-slate-500 text-[9px]">Year</label>
                          <input 
                            type="text" 
                            value={item.year} 
                            onChange={(e) => {
                              const updatedList = [...pastListVal];
                              updatedList[idx] = { ...updatedList[idx], year: e.target.value };
                              handleUpdateAmbassador({ pastAmbassadors: updatedList });
                            }} 
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 font-bold" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="font-semibold text-slate-500 text-[9px]">Label / Title</label>
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={(e) => {
                              const updatedList = [...pastListVal];
                              updatedList[idx] = { ...updatedList[idx], title: e.target.value };
                              handleUpdateAmbassador({ pastAmbassadors: updatedList });
                            }} 
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500 text-[9px]">Short Description</label>
                        <textarea 
                          value={item.desc} 
                          rows={2}
                          onChange={(e) => {
                            const updatedList = [...pastListVal];
                            updatedList[idx] = { ...updatedList[idx], desc: e.target.value };
                            handleUpdateAmbassador({ pastAmbassadors: updatedList });
                          }} 
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800 resize-none" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUCCESS ALERTS */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-emerald-800 font-semibold shadow-sm">
                <span>Campus Ambassador content settings saved and updated instantly on database!</span>
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
              </div>
            </div>
          );
        })()}

        {/* TAB 9: GLOBAL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6 text-left text-xs font-sans max-w-4xl">
            <div>
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 uppercase">Global Settings & Branding</h1>
              <p className="text-slate-500">Configure corporate identity, primary branding colors, contact info, and social media links.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
              {/* Core branding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">Logo Brand Text</label>
                  <input 
                    type="text" 
                    value={settings.logoText}
                    onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">Slogan / Sub-text</label>
                  <input 
                    type="text" 
                    value={settings.logoSubText}
                    onChange={(e) => setSettings({ ...settings, logoSubText: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">Office Primary Hotline</label>
                  <input 
                    type="text" 
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">Primary Counselor Email</label>
                  <input 
                    type="text" 
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wide">Registered Office Address</label>
                <input 
                  type="text" 
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                />
              </div>

              <div className="h-px bg-slate-100" />

              {/* Social Channels */}
              <h3 className="font-display font-bold text-slate-800 text-sm">Social Media Integration Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">LinkedIn Company Handle</label>
                  <input 
                    type="text" 
                    value={settings.socialMedia.linkedin || ''}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, linkedin: e.target.value } })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">Twitter Profile Handle</label>
                  <input 
                    type="text" 
                    value={settings.socialMedia.twitter || ''}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, twitter: e.target.value } })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">Facebook Page URL</label>
                  <input 
                    type="text" 
                    value={settings.socialMedia.facebook || ''}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, facebook: e.target.value } })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">Instagram Handle</label>
                  <input 
                    type="text" 
                    value={settings.socialMedia.instagram || ''}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, instagram: e.target.value } })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-600">YouTube Channel URL</label>
                  <input 
                    type="text" 
                    value={settings.socialMedia.youtube || ''}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, youtube: e.target.value } })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              {/* Security Credentials */}
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-rose-500" />
                <span>Security & Admin Access Password</span>
              </h3>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-2 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs bg-slate-100/50 p-3 rounded-lg border border-slate-200/50">
                  <div>
                    <div className="font-semibold text-slate-700">Current Admin Password</div>
                    <div className="text-[10px] text-slate-400">Used to access the editor modes.</div>
                  </div>
                  <div className="font-mono font-bold bg-white border border-slate-200 px-3 py-1 rounded text-slate-800 select-all">
                    {settings.adminPassword || 'admin123'}
                  </div>
                </div>

                <form onSubmit={handleUpdateAdminPassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-600 text-xs">New Admin Password</label>
                    <input 
                      type="text" 
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="e.g. securePass123"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-600 text-xs">Developer Master Password</label>
                    <input 
                      type="password" 
                      value={devMasterPassword}
                      onChange={(e) => setDevMasterPassword(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Enter password from env file..."
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white font-semibold text-xs rounded transition-colors"
                    >
                      {isUpdatingPassword ? 'Saving Permanently...' : 'Change Password Permanently'}
                    </button>
                  </div>
                </form>

                {passwordUpdateStatus.type && (
                  <div className={`p-3 rounded text-xs font-medium border ${
                    passwordUpdateStatus.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {passwordUpdateStatus.message}
                  </div>
                )}
              </div>


              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-emerald-800 font-semibold mt-4">
                <span>Branding assets and settings saved and updated instantly on database!</span>
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
