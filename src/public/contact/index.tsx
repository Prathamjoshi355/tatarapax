import React from 'react';
import { CMSPage, GlobalSettings, PlacedStudent, HiringPartner, Course, BlogPost, Lead } from '../../types';
import DynamicSection from '../../components/sections/DynamicSection';

interface PublicContactPageProps {
  page: CMSPage;
  settings: GlobalSettings;
  placedStudents: PlacedStudent[];
  hiringPartners: HiringPartner[];
  courses: Course[];
  blogs: BlogPost[];
  onAddLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
}

export default function PublicContactPage({
  page,
  settings,
  placedStudents,
  hiringPartners,
  courses,
  blogs,
  onAddLead,
  onEditField
}: PublicContactPageProps) {
  return (
    <div className="w-full flex flex-col">
      {page.sections.map((section) => (
        <div key={section.id}>
          <DynamicSection
            section={section}
            viewMode="live"
            onEditField={onEditField}
            allPlacedStudents={placedStudents}
            allHiringPartners={hiringPartners}
            allCourses={courses}
            allBlogs={blogs}
            onAddLead={onAddLead}
            settings={settings}
          />
        </div>
      ))}
    </div>
  );
}
