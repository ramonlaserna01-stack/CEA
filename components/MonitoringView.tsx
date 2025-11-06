import React, { useState, useEffect, useMemo } from 'react';
import Card from './common/Card';
import { getDocuments } from '../services/db';
import { Document, DocumentStatus, ReadingStage } from '../types';

const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
        case DocumentStatus.APPROVED: return 'bg-green-100 text-green-800';
        case DocumentStatus.REVIEW: return 'bg-yellow-100 text-yellow-800';
        case DocumentStatus.DRAFT: return 'bg-blue-100 text-blue-800';
        case DocumentStatus.REJECTED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStageColor = (stage: ReadingStage) => {
    switch (stage) {
        case ReadingStage.PASSED: return 'bg-green-100 text-green-800';
        case ReadingStage.MAYOR: return 'bg-purple-100 text-purple-800';
        case ReadingStage.SECOND:
        case ReadingStage.THIRD: return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const FILTERS: { label: string, status: DocumentStatus | 'All' }[] = [
    { label: 'All', status: 'All' },
    { label: 'Approved', status: DocumentStatus.APPROVED },
    { label: 'In Review', status: DocumentStatus.REVIEW },
    { label: 'Draft', status: DocumentStatus.DRAFT },
    { label: 'Rejected', status: DocumentStatus.REJECTED },
];

const MonitoringView: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeFilter, setActiveFilter] = useState<DocumentStatus | 'All'>('All');

    useEffect(() => {
        setDocuments(getDocuments().filter(d => d.status !== DocumentStatus.ARCHIVED));
    }, []);

    const filteredDocuments = useMemo(() => {
        if (activeFilter === 'All') {
            return documents;
        }
        return documents.filter(doc => doc.status === activeFilter);
    }, [documents, activeFilter]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Monitoring</h1>
            <Card>
                <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px space-x-4">
                        {FILTERS.map(filter => (
                            <button 
                                key={filter.label}
                                onClick={() => setActiveFilter(filter.status)}
                                className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                                    activeFilter === filter.status
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Document ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Stage</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Progress</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDocuments.map((doc: Document) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{doc.id}</td>
                                    <td className="px-6 py-4 whitespace-normal max-w-sm text-sm text-text-primary">{doc.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(doc.stage)}`}>
                                            {doc.stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${doc.progress}%` }}></div>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-text-secondary">{doc.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.lastUpdated}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredDocuments.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-text-secondary">No documents match the selected filter.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MonitoringView;