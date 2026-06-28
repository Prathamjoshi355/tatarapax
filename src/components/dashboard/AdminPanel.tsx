import React, { useState } from 'react';
import { 
  CMSPage, GlobalSettings, MediaItem, BlogPost, PlacedStudent, HiringPartner, Course, Lead 
} from '../../types';
import { 
  LayoutDashboard, FileText, Users, Award, BookOpen, Newspaper, FormInput, Image, Settings,
  TrendingUp, HelpCircle, CheckCircle, Clock, Trash2, Plus, Edit, Download, Check, RefreshCw, X, LogOut
} from 'lucide-react';

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
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  onLogout?: () => void;
  onReset?: () => void;
}

export default function AdminPanel({
  pages, setPages,
  settings, setSettings,
  media, setMedia,
  placedStudents, setPlacedStudents,
  hiringPartners, setHiringPartners,
  courses, setCourses,
  blogs, setBlogs,
  leads, setLeads,
  onLogout,
  onReset
}: AdminPanelProps) {

  const [activeTab, setActiveTab] = useState<'dashboard' | 'pages' | 'students' | 'partners' | 'courses' | 'blogs' | 'leads' | 'media' | 'settings'>('dashboard');

  // Interactive Form State Holders
  const [selectedStudent, setSelectedStudent] = useState<PlacedStudent | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form edit fields
  const [studentForm, setStudentForm] = useState<Omit<PlacedStudent, 'id'>>({
    name: '', avatar: '', college: '', branch: '', year: '2024', company: '', packageLpa: ''
  });

  const [blogForm, setBlogForm] = useState<Omit<BlogPost, 'id' | 'date'>>({
    title: '', slug: '', category: 'Resume Tips', excerpt: '', content: '', image: '', readTime: '5 mins read', status: 'published'
  });

  const [courseForm, setCourseForm] = useState<Omit<Course, 'id'>>({
    name: '', category: 'programming', description: '', duration: '', topics: []
  });
  const [newTopicStr, setNewTopicStr] = useState('');

  // Media Library states
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'pdf' | 'svg'>('image');

  // CSV Exporter Simulation
  const handleExportCSV = (type: string) => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Phone,Type,Date,Status\n" 
      + leads.map(l => `${l.id},${l.name},${l.email},${l.phone},${l.type},${l.date},${l.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tentrapax_leads_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              { id: 'students', label: 'Placed Students CRM', icon: Users },
              { id: 'partners', label: 'Hiring Partners', icon: Award },
              { id: 'courses', label: 'Courses Syllabus', icon: BookOpen },
              { id: 'blogs', label: 'Blog Articles CMS', icon: Newspaper },
              { id: 'leads', label: 'Form Leads submissions', icon: FormInput },
              { id: 'media', label: 'Media asset library', icon: Image },
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
            <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Atlas Cluster Online</span>
            </div>
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
                  setSelectedStudent({ id: `stud-${Date.now()}`, name: '', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', college: '', branch: '', year: '2024', company: '', packageLpa: '' });
                  setStudentForm({ name: '', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', college: '', branch: '', year: '2024', company: '', packageLpa: '' });
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
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
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
                    <th className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {placedStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={st.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover shrink-0" />
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
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setSelectedStudent(st);
                              setStudentForm({
                                name: st.name, avatar: st.avatar, college: st.college, branch: st.branch, year: st.year, company: st.company, packageLpa: st.packageLpa
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
                <p className="text-slate-500">Edit or introduce corporate brand partners that actively recruit Tentrapax alumni.</p>
              </div>
              <button 
                onClick={() => {
                  const name = prompt("Enter Hiring Company Brand Name:");
                  if (name) {
                    setHiringPartners([...hiringPartners, { id: `partner-${Date.now()}`, name, logoUrl: name }]);
                  }
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add Partner brand</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {hiringPartners.map((partner) => (
                <div key={partner.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="font-bold text-slate-900 text-sm">{partner.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Linked Placement</span>
                  </div>
                  <button 
                    onClick={() => setHiringPartners(hiringPartners.filter(p => p.id !== partner.id))}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    title="Remove Partner link"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
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
                  setSelectedCourse({ id: `course-${Date.now()}`, name: '', category: 'programming', description: '', duration: '8 Weeks', topics: [] });
                  setCourseForm({ name: '', category: 'programming', description: '', duration: '8 Weeks', topics: [] });
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
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
                      <option value="programming">Programming</option>
                      <option value="aptitude">Quantitative Aptitude</option>
                      <option value="soft-skills">Soft Skills</option>
                      <option value="interview">Interview Bootcamp</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Duration (e.g. 12 Weeks)</label>
                    <input 
                      type="text" 
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[9px]">Brief Description</label>
                  <input 
                    type="text" 
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                  />
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
                                name: course.name, category: course.category, description: course.description, duration: course.duration, topics: course.topics
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
                    <label className="font-bold text-slate-400 uppercase text-[9px]">Featured Image URL</label>
                    <input 
                      type="text" 
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono" 
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

        {/* TAB 8: MEDIA asset library */}
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
              {media.map((file) => (
                <div key={file.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-3 shadow-sm flex flex-col gap-2 justify-between">
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
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, linkedin: e.target.value } })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">Twitter Profile Handle</label>
                  <input 
                    type="text" 
                    value={settings.socialMedia.twitter}
                    onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, twitter: e.target.value } })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">Admin Editor Password</label>
                  <input 
                    type="text" 
                    value={settings.adminPassword || 'admin123'}
                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                    placeholder="e.g. admin123"
                  />
                  <span className="text-[10px] text-slate-400">
                    This password is required to switch the website into "Visual Editor" or "Admin Dashboard" modes. Keep it safe!
                  </span>
                </div>
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
