import React from 'react';
import { CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost } from '../../../types';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import DynamicSection from '../../../components/sections/DynamicSection';
import VisualEditorSidebar from '../../../components/dashboard/VisualEditorSidebar';

interface VisualEditorBlogPageProps {
  page: CMSPage;
  settings: GlobalSettings;
  placedStudents: PlacedStudent[];
  hiringPartners: HiringPartner[];
  courses: Course[];
  blogs: BlogPost[];
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onUpdateSectionDesign: (sectionId: string, designUpdates: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (type: string) => void;
}

export default function VisualEditorBlogPage({
  page,
  settings,
  placedStudents,
  hiringPartners,
  courses,
  blogs,
  selectedSectionId,
  setSelectedSectionId,
  onEditField,
  onUpdateSectionDesign,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onAddSection
}: VisualEditorBlogPageProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-[calc(100vh-60px)]">
      
      {/* Interactive visual canvas of Webflow/Framer style */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100 p-4 md:p-8">
        <div className="w-full max-w-[1300px] mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
          
          {/* Header inside simulated design system viewport */}
          <Header
            settings={settings}
            pages={[page]}
            currentPageId={page.id}
            setCurrentPageId={() => {}}
          />

          <main className="flex-1">
            {page.sections.map((section) => (
              <div 
                key={section.id} 
                onClick={() => setSelectedSectionId(section.id)}
                className={`relative transition-all duration-200 cursor-pointer ${
                  selectedSectionId === section.id
                    ? 'ring-4 ring-blue-500 ring-offset-2 rounded-lg shadow-lg z-20'
                    : 'hover:ring-2 hover:ring-slate-300'
                }`}
              >
                <div className="absolute top-2 left-2 bg-blue-600 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow z-30 opacity-70 hover:opacity-100 pointer-events-none">
                  Click to Design: {section.type}
                </div>
                <DynamicSection
                  section={section}
                  viewMode="visual"
                  onEditField={onEditField}
                  allPlacedStudents={placedStudents}
                  allHiringPartners={hiringPartners}
                  allCourses={courses}
                  allBlogs={blogs}
                  onAddLead={() => {}}
                  settings={settings}
                />
              </div>
            ))}
          </main>

          <Footer
            settings={settings}
            pages={[page]}
            setCurrentPageId={() => {}}
            viewMode="visual"
          />

        </div>
      </div>

      {/* Property designer sidebar panel */}
      <VisualEditorSidebar
        page={page}
        selectedSectionId={selectedSectionId}
        setSelectedSectionId={setSelectedSectionId}
        onUpdateSectionDesign={onUpdateSectionDesign}
        onMoveSection={onMoveSection}
        onDuplicateSection={onDuplicateSection}
        onDeleteSection={onDeleteSection}
        onAddSection={onAddSection}
      />

    </div>
  );
}
