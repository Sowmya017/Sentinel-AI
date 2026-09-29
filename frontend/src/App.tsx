import React, { useState } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/command-center/CommandCenter';
import {
  LiveSurveillanceView,
  ThreatCenterView,
  VehicleIntelligenceView,
  EventLogView,
  AiInvestigationView,
  SettingsView,
} from './components/pages/OtherPages';

const PAGE_TITLES: Record<PageId, string> = {
  'command-center':       'Command Center',
  'live-surveillance':    'Live Surveillance',
  'threat-center':        'Threat Center',
  'vehicle-intelligence': 'Vehicle Intelligence',
  'event-log':            'Event Log',
  'ai-investigation':     'AI Investigation',
  'settings':             'Settings',
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('command-center');
  const [isLockedDown, setIsLockedDown] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [layoutMode, setLayoutMode] = useState<'columns' | 'stacked'>('columns');

  const handleNavigate = (page: PageId) => setCurrentPage(page);
  const handleTriggerLivePayload = () => setCurrentPage('command-center');
  const handleDispatchIntercept = () => setCurrentPage('command-center');
  const handleToggleLockdown = () => setIsLockedDown((p) => !p);
  const handleToggleStreaming = () => setIsStreaming((p) => !p);
  const handleToggleLayoutMode = () => setLayoutMode((p) => (p === 'columns' ? 'stacked' : 'columns'));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F8FB] text-[#172033] font-sans">

      {/* Persistent sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        threatCount={1}
      />

      {/* Main workspace */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

        {/* Top header */}
        <Header
          onTriggerLivePayload={handleTriggerLivePayload}
          onDispatchIntercept={handleDispatchIntercept}
          isLockedDown={isLockedDown}
          onToggleLockdown={handleToggleLockdown}
          isStreaming={isStreaming}
          onToggleStreaming={handleToggleStreaming}
          layoutMode={layoutMode}
          onToggleLayoutMode={handleToggleLayoutMode}
          pageTitle={PAGE_TITLES[currentPage]}
        />

        {/* Page content */}
        <main className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">

          {currentPage === 'command-center' && (
            <CommandCenter
              onNavigateToVehicle={() => setCurrentPage('vehicle-intelligence')}
              isLockedDown={isLockedDown}
              onToggleLockdown={handleToggleLockdown}
              layoutMode={layoutMode}
            />
          )}

          {currentPage === 'live-surveillance' && (
            <LiveSurveillanceView
              onBackToCommandCenter={() => setCurrentPage('command-center')}
            />
          )}

          {currentPage === 'threat-center' && (
            <ThreatCenterView
              onBackToCommandCenter={() => setCurrentPage('command-center')}
            />
          )}

          {currentPage === 'vehicle-intelligence' && (
            <VehicleIntelligenceView
              onBackToCommandCenter={() => setCurrentPage('command-center')}
            />
          )}

          {currentPage === 'event-log' && (
            <EventLogView
              onBackToCommandCenter={() => setCurrentPage('command-center')}
            />
          )}

          {currentPage === 'ai-investigation' && (
            <AiInvestigationView
              onBackToCommandCenter={() => setCurrentPage('command-center')}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              onBackToCommandCenter={() => setCurrentPage('command-center')}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
