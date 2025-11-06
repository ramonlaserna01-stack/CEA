import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DraftingView from './components/DraftingView';
import MonitoringView from './components/MonitoringView';
import AuditTrailView from './components/AuditTrailView';
import ArchiveView from './components/ArchiveView';
import ConsensusView from './components/ConsensusView';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Drafting':
        return <DraftingView />;
      case 'Consensus':
        return <ConsensusView />;
      case 'Monitoring':
        return <MonitoringView />;
      case 'Audit Trail':
        return <AuditTrailView />;
      case 'Archive':
        return <ArchiveView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;