import React from 'react';
import { NAV_ITEMS, DashboardIcon, DraftingIcon, MonitoringIcon, AuditIcon, ArchiveIcon, UsersIcon, ReportsIcon, DocumentIcon } from '../constants';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const ICONS: { [key in View]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'Dashboard': DashboardIcon,
  'Reports': ReportsIcon,
  'Drafting': DraftingIcon,
  'Consensus': UsersIcon,
  'Monitoring': MonitoringIcon,
  'Documents': DocumentIcon,
  'Audit Trail': AuditIcon,
  'Archive': ArchiveIcon
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-surface flex flex-col border-r border-gray-200">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
        <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
        <span className="font-bold text-xl ml-2 text-primary">ORDTS</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item];
          return (
            <button
              key={item}
              onClick={() => setCurrentView(item)}
              className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                currentView === item
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{item}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;