import React from 'react';
import { CMSPage, GlobalSettings, HiringPartner } from '../../../types';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import PublicPartnersPage from '../../../public/partners';
import VisualEditorSidebar from '../../../components/dashboard/VisualEditorSidebar';

interface VisualEditorPartnersPageProps {
  page: CMSPage;
  settings: GlobalSettings;
  hiringPartners: HiringPartner[];
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  onEditField: (sectionId: string, fieldPath: string, value: any) => void;
  onUpdateSectionDesign: (sectionId: string, designUpdates: any) => void;
  onMoveSection: (direction: 'up' | 'down', sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (type: string) => void;
}

export default function VisualEditorPartnersPage({
  page,
  settings,
  hiringPartners,
  selectedSectionId,
  setSelectedSectionId,
  onEditField,
  onUpdateSectionDesign,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onAddSection
}: VisualEditorPartnersPageProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-[calc(100vh-60px)]">
      {/* Interactive visual canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100 p-4 md:p-8">
        <div className="w-full max-w-[1300px] mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
          <Header
            settings={settings}
            pages={[page]}
            currentPageId={page.id}
            setCurrentPageId={() => {}}
          />

          <main className="flex-1">
            <PublicPartnersPage
              page={page}
              settings={settings}
              hiringPartners={hiringPartners}
              isVisualMode={true}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onEditField={onEditField}
            />
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
