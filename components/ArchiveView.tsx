
import React from 'react';
import Card from './common/Card';
import { mockArchivedDocuments } from '../constants';
import { ArchiveIcon } from '../constants';

const ArchiveView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Document Archive</h1>
      <Card>
        <div className="flex items-center mb-4">
            <input 
                type="search" 
                placeholder="Search archived documents..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
        </div>
        <ul className="divide-y divide-gray-200">
          {mockArchivedDocuments.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 rounded-md">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-full mr-4">
                    <ArchiveIcon className="w-6 h-6 text-text-secondary" />
                </div>
                <div>
                  <p className="text-md font-semibold text-primary">{doc.title}</p>
                  <p className="text-sm text-text-secondary">
                    {doc.id} &bull; {doc.type} &bull; Archived on: {doc.lastUpdated}
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-primary hover:text-primary-focus">
                Preview
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ArchiveView;
