import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { ArchiveIcon } from '../constants';
import { getDocuments } from '../services/db';
import { Document, DocumentStatus } from '../types';

const ArchiveView: React.FC = () => {
  const [allArchivedDocs, setAllArchivedDocs] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allDocs = getDocuments();
    const archived = allDocs.filter(doc => doc.status === DocumentStatus.ARCHIVED);
    setAllArchivedDocs(archived);
    setFilteredDocs(archived);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDocs(allArchivedDocs);
    } else {
      const results = allArchivedDocs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocs(results);
    }
  }, [searchTerm, allArchivedDocs]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Document Archive</h1>
      <Card>
        <div className="flex items-center mb-4">
            <input 
                type="search" 
                placeholder="Search archived documents by title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
        </div>
        {filteredDocs.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
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
        ) : (
          <div className="text-center py-12">
            <ArchiveIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-text-primary">
              {searchTerm ? 'No Documents Found' : 'Archive is Empty'}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {searchTerm ? `Your search for "${searchTerm}" did not return any results.` : 'Archived documents will appear here.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArchiveView;
