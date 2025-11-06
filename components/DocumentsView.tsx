import React, { useState, useEffect, useMemo } from 'react';
import Card from './common/Card';
import { getDocuments } from '../services/db';
import { Document, DocumentStatus } from '../types';
import { CheckCircleIcon } from '../constants';

type DocumentTypeTab = 'Ordinance' | 'Resolution';

const DocumentsView: React.FC = () => {
    const [approvedDocuments, setApprovedDocuments] = useState<Document[]>([]);
    const [activeTab, setActiveTab] = useState<DocumentTypeTab>('Ordinance');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const allDocs = getDocuments();
        const approved = allDocs.filter(doc => doc.status === DocumentStatus.APPROVED);
        setApprovedDocuments(approved);
    }, []);

    const filteredDocuments = useMemo(() => {
        return approvedDocuments
            .filter(doc => doc.type === activeTab)
            .filter(doc => {
                if (!dateFilter) return true;
                // Filter for documents updated on or after the selected date
                return new Date(doc.lastUpdated) >= new Date(dateFilter);
            });
    }, [approvedDocuments, activeTab, dateFilter]);
    
    const renderTabs = () => (
         <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('Ordinance')}
                    className={`${
                        activeTab === 'Ordinance'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
                >
                    Ordinances ({approvedDocuments.filter(d => d.type === 'Ordinance').length})
                </button>
                <button
                    onClick={() => setActiveTab('Resolution')}
                    className={`${
                        activeTab === 'Resolution'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
                >
                    Resolutions ({approvedDocuments.filter(d => d.type === 'Resolution').length})
                </button>
            </nav>
        </div>
    );

    const renderFilterBar = () => (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
                 <label htmlFor="date-filter" className="text-sm font-medium text-text-secondary">Approved on or after:</label>
                 <input 
                    type="date"
                    id="date-filter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                 />
                 <button
                    onClick={() => setDateFilter('')}
                    className="text-sm text-primary hover:underline"
                 >
                    Clear Filter
                 </button>
            </div>
        </div>
    );

    const renderDocumentList = () => (
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Document ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date Approved</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc: Document) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{doc.id}</td>
                            <td className="px-6 py-4 whitespace-normal max-w-lg text-sm text-text-primary">{doc.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.lastUpdated}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-primary hover:text-primary-focus">View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {filteredDocuments.length === 0 && (
                <div className="text-center py-16">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-text-primary">
                       No Documents Found
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                       There are no approved {activeTab.toLowerCase()}s matching your filter.
                    </p>
                </div>
            )}
        </div>
    );


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Approved Documents Repository</h1>
            </div>
            <Card className="p-0 overflow-hidden">
               {renderTabs()}
               {renderFilterBar()}
               {renderDocumentList()}
            </Card>
        </div>
    );
};

export default DocumentsView;