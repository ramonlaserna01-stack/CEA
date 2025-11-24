
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Card from './common/Card';
import { mockDocumentVersions, mockComments } from '../constants';
import { SparklesIcon, ClockIcon, UserIcon, PlusIcon, ArrowLeftIcon, DraftingIcon, DotsVerticalIcon, ArchiveIcon, TrashIcon } from '../constants';
import AIAssistant from './common/AIAssistant';
import CreateDraftModal from './common/CreateDraftModal';
import { Document, DocumentStatus, ReadingStage, Section } from '../types';
import SectionEditor from './common/SectionEditor';
import { getDocuments, saveDocuments } from '../services/db';

// Action Menu for Draft Table Rows
const DraftActionsMenu: React.FC<{ onArchive: () => void; onDelete: () => void; }> = ({ onArchive, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-2 rounded-full hover:bg-gray-200 text-gray-500">
                <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <button onClick={(e) => { e.stopPropagation(); onArchive(); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <ArchiveIcon className="w-4 h-4 mr-3" /> Archive
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <TrashIcon className="w-4 h-4 mr-3" /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// Editor component
const DocumentEditor: React.FC<{ document: Document; onBack: () => void; onUpdate: (updatedDoc: Document) => void; }> = ({ document, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('discussion');
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    
    const handleSectionChange = (sectionId: string, newContent: string) => {
        const updatedSections = document.sections.map(sec => 
            sec.id === sectionId ? { ...sec, content: newContent } : sec
        );
        onUpdate({ ...document, sections: updatedSections, lastUpdated: new Date().toISOString().split('T')[0] });
    };

    const handleToggleLock = (sectionId: string) => {
        const updatedSections = document.sections.map(sec =>
            sec.id === sectionId ? { ...sec, status: (sec.status === 'editing' ? 'locked' : 'editing') as Section['status'] } : sec
        );
        onUpdate({ ...document, sections: updatedSections, lastUpdated: new Date().toISOString().split('T')[0] });
    };

    const handleAddSection = () => {
        const newSection: Section = {
            id: `sec-${document.id}-${document.sections.length + 1}`,
            title: `Section ${document.sections.length + 1}: New Section`,
            content: `<p>Start writing content for this new section.</p>`,
            status: 'editing',
        };
        onUpdate({ ...document, sections: [...document.sections, newSection], lastUpdated: new Date().toISOString().split('T')[0] });
    };

    return (
        <>
            {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Column: Editor */}
                <div className="lg:col-span-2">
                    <div className="h-full flex flex-col">
                        <Card className="flex-grow">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b">
                                <div className="flex items-center gap-4">
                                    <button onClick={onBack} className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        All Drafts
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-text-primary">{document.title}</h1>
                                        <p className="text-sm text-text-secondary">{document.id} - Last updated {document.lastUpdated}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/150?u=alice" alt="User 1"/>
                                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/150?u=bob" alt="User 2"/>
                                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/150?u=charlie" alt="User 3"/>
                                    </div>
                                     <button onClick={() => setShowAIAssistant(true)} className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                        <SparklesIcon className="w-5 h-5 mr-2"/>
                                        AI Assistant
                                    </button>
                                </div>
                            </div>
                             {/* Section-based Editor */}
                            <div className="space-y-6">
                                {document.sections.map(section => (
                                    <SectionEditor 
                                        key={section.id}
                                        section={section}
                                        onChange={(newContent) => handleSectionChange(section.id, newContent)}
                                        onToggleLock={() => handleToggleLock(section.id)}
                                    />
                                ))}
                                <div className="pt-4">
                                    <button 
                                        onClick={handleAddSection}
                                        className="w-full flex justify-center items-center text-sm font-semibold text-primary border-2 border-dashed border-primary rounded-lg py-3 hover:bg-blue-50 transition-colors"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Add New Section
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                {/* Right Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                <button onClick={() => setActiveTab('discussion')} className={`${activeTab === 'discussion' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    Discussion
                                </button>
                                <button onClick={() => setActiveTab('versions')} className={`${activeTab === 'versions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    Version History
                                </button>
                            </nav>
                        </div>
                         {/* Discussion Tab */}
                        <div className={`${activeTab !== 'discussion' && 'hidden'} mt-4 space-y-4`}>
                            <h2 className="font-semibold text-text-primary">Comments</h2>
                            {mockComments.map(comment => (
                                <div key={comment.id} className="flex space-x-3">
                                    <img src={comment.userAvatar} alt={comment.user} className="h-8 w-8 rounded-full" />
                                    <div className="flex-1">
                                        <div className="bg-gray-100 rounded-lg p-3">
                                            <p className="text-sm text-text-primary">{comment.text}</p>
                                        </div>
                                        <div className="text-xs text-text-secondary mt-1 flex items-center">
                                            <span className="font-semibold mr-2">{comment.user}</span>
                                            <span>{comment.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Version History Tab */}
                        <div className={`${activeTab !== 'versions' && 'hidden'} mt-4`}>
                            <h2 className="font-semibold text-text-primary mb-2">Revisions</h2>
                            <ul className="space-y-4">
                                {mockDocumentVersions.map(v => (
                                    <li key={v.id} className="relative pl-8 border-l-2 border-gray-200">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-2 border-primary rounded-full"></div>
                                        <p className="font-semibold text-primary">Version {v.version}</p>
                                        <p className="text-sm text-text-secondary">{v.summary}</p>
                                        <div className="flex text-xs text-gray-500 mt-1 space-x-4">
                                            <span className="flex items-center"><UserIcon className="w-3 h-3 mr-1"/>{v.author}</span>
                                            <span className="flex items-center"><ClockIcon className="w-3 h-3 mr-1"/>{v.timestamp}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

// Main View component
const DraftingView: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<DocumentStatus | 'All'>('All');

    useEffect(() => {
        setDocuments(getDocuments());
    }, []);

    const handleCreateDraft = (newDraftData: { title: string; type: 'Ordinance' | 'Resolution' }) => {
        const initialSection: Section = {
            id: 'sec-initial',
            title: 'Section 1: Purpose',
            content: `<p>Provide the main purpose of this ${newDraftData.type.toLowerCase()} here.</p>`,
            status: 'editing'
        };
        const newDoc: Document = {
            id: `${newDraftData.type.substring(0, 3).toUpperCase()}-2023-${String(Math.floor(Math.random() * 900) + 100)}`,
            title: newDraftData.title,
            type: newDraftData.type,
            status: DocumentStatus.DRAFT,
            stage: ReadingStage.FIRST,
            sections: [initialSection],
            createdBy: 'Current User',
            lastUpdated: new Date().toISOString().split('T')[0],
            progress: 5,
            votes: { approve: 0, disapprove: 0, abstain: 0, absent: 10, totalMembers: 10 },
        };
        const updatedDocuments = [newDoc, ...documents];
        saveDocuments(updatedDocuments);
        setDocuments(updatedDocuments);
        setCreateModalOpen(false);
        setSelectedDocument(newDoc);
    };

    const handleUpdateDocument = (updatedDoc: Document) => {
        const updatedDocuments = documents.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc);
        saveDocuments(updatedDocuments);
        setDocuments(updatedDocuments);
        if (selectedDocument && selectedDocument.id === updatedDoc.id) {
            setSelectedDocument(updatedDoc);
        }
    };

    const handleDeleteDraft = (docId: string) => {
        const updatedDocuments = documents.filter(doc => doc.id !== docId);
        saveDocuments(updatedDocuments);
        setDocuments(updatedDocuments);
    };

    const handleArchiveDraft = (docId: string) => {
        const updatedDocuments = documents.map(doc => doc.id === docId ? { ...doc, status: DocumentStatus.ARCHIVED } : doc);
        saveDocuments(updatedDocuments);
        setDocuments(updatedDocuments);
    };
    
    const FILTERS: { label: string, status: DocumentStatus | 'All' }[] = [
        { label: 'All', status: 'All' },
        { label: 'Drafts', status: DocumentStatus.DRAFT },
        { label: 'In-Progress', status: DocumentStatus.REVIEW },
        { label: 'Approved', status: DocumentStatus.APPROVED },
        { label: 'Rejected', status: DocumentStatus.REJECTED },
    ];

    const displayedDocuments = useMemo(() => {
        const nonArchived = documents.filter(doc => doc.status !== DocumentStatus.ARCHIVED);
        if (activeFilter === 'All') {
            return nonArchived;
        }
        return nonArchived.filter(doc => doc.status === activeFilter);
    }, [documents, activeFilter]);
    
    const getStatusColor = (status: DocumentStatus) => {
        switch (status) {
            case DocumentStatus.APPROVED: return 'bg-green-100 text-green-800';
            case DocumentStatus.REVIEW: return 'bg-yellow-100 text-yellow-800';
            case DocumentStatus.DRAFT: return 'bg-blue-100 text-blue-800';
            case DocumentStatus.REJECTED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (selectedDocument) {
        return <DocumentEditor document={selectedDocument} onBack={() => setSelectedDocument(null)} onUpdate={handleUpdateDocument} />;
    }

    return (
        <>
            {isCreateModalOpen && <CreateDraftModal onClose={() => setCreateModalOpen(false)} onCreate={handleCreateDraft} />}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-text-primary">Drafting</h1>
                    <button 
                        onClick={() => setCreateModalOpen(true)}
                        className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-focus transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create New Draft
                    </button>
                </div>

                <div className="border-b border-gray-200">
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
                                <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${activeFilter === filter.status ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                                    {filter.status === 'All' 
                                        ? documents.filter(d => d.status !== DocumentStatus.ARCHIVED).length 
                                        : documents.filter(d => d.status === filter.status).length
                                    }
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Author</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Last Updated</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayedDocuments.length > 0 ? displayedDocuments.map((doc) => (
                                    <tr key={doc.id} onClick={() => setSelectedDocument(doc)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-normal max-w-sm">
                                            <div className="font-semibold text-text-primary">{doc.title}</div>
                                            <div className="text-xs text-text-secondary">{doc.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.createdBy}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.lastUpdated}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <DraftActionsMenu 
                                                onArchive={() => handleArchiveDraft(doc.id)} 
                                                onDelete={() => handleDeleteDraft(doc.id)} 
                                            />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="text-center py-12">
                                                <DraftingIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <h3 className="mt-2 text-lg font-medium text-text-primary">No Documents Found</h3>
                                                <p className="mt-1 text-sm text-text-secondary">
                                                  There are no documents with the status "{activeFilter}".
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default DraftingView;
