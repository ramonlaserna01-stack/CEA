
import React, { useState, useRef, useEffect } from 'react';
import Card from './common/Card';
import { mockDocumentVersions, mockComments } from '../constants';
import { SparklesIcon, ClockIcon, UserIcon, PlusIcon, ArrowLeftIcon, DraftingIcon, DotsVerticalIcon, ArchiveIcon, TrashIcon } from '../constants';
import AIAssistant from './common/AIAssistant';
import CreateDraftModal from './common/CreateDraftModal';
import { Document, DocumentStatus, ReadingStage, Section } from '../types';
import SectionEditor from './common/SectionEditor';
import { getDocuments, saveDocuments } from '../services/db';

// Action Menu for Draft Cards
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

// Draft Card Component
const DraftCard: React.FC<{ doc: Document; onSelect: (doc: Document) => void; onArchive: (id: string) => void; onDelete: (id: string) => void;}> = ({ doc, onSelect, onArchive, onDelete }) => (
    <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col justify-between group"
        onClick={() => onSelect(doc)}
    >
        <div>
            <div className="flex justify-between items-start">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${doc.type === 'Ordinance' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {doc.type}
                </span>
                <DraftActionsMenu onArchive={() => onArchive(doc.id)} onDelete={() => onDelete(doc.id)} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary">{doc.title}</h3>
            <p className="text-sm text-text-secondary">ID: {doc.id}</p>
        </div>
        <div className="mt-4 pt-4 border-t">
             <p className="text-xs text-text-secondary">Last Updated: {doc.lastUpdated}</p>
             <p className="text-xs text-text-secondary">Status: <span className="font-semibold">{doc.status}</span></p>
        </div>
    </Card>
);

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
            sec.id === sectionId ? { ...sec, status: sec.status === 'editing' ? 'locked' : 'editing' } : sec
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

    useEffect(() => {
        setDocuments(getDocuments());
    }, []);

    const handleCreateDraft = (newDraftData: { title: string; type: 'Ordinance' | 'Resolution' }) => {
        // Fix: Explicitly typing `initialSection` as `Section` ensures that TypeScript
        // infers the `status` property as the literal type 'editing' rather than the
        // wider `string` type, resolving the assignment error.
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

    if (selectedDocument) {
        return <DocumentEditor document={selectedDocument} onBack={() => setSelectedDocument(null)} onUpdate={handleUpdateDocument} />;
    }
    
    const visibleDrafts = documents.filter(d => d.status !== DocumentStatus.ARCHIVED);
    const draftDocs = visibleDrafts.filter(d => d.status === DocumentStatus.DRAFT);
    const inProgressDocs = visibleDrafts.filter(d => d.status === DocumentStatus.REVIEW);
    const approvedDocs = visibleDrafts.filter(d => d.status === DocumentStatus.APPROVED);
    const rejectedDocs = visibleDrafts.filter(d => d.status === DocumentStatus.REJECTED);

    const renderDraftSection = (title: string, docs: Document[]) => {
        if (docs.length === 0) return null;
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text-primary border-b pb-2">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map(doc => (
                        <DraftCard 
                            key={doc.id} 
                            doc={doc} 
                            onSelect={setSelectedDocument}
                            onArchive={handleArchiveDraft}
                            onDelete={handleDeleteDraft}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {isCreateModalOpen && <CreateDraftModal onClose={() => setCreateModalOpen(false)} onCreate={handleCreateDraft} />}
            <div className="space-y-8">
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
                
                {visibleDrafts.length > 0 ? (
                    <div className="space-y-8">
                        {renderDraftSection('Drafts', draftDocs)}
                        {renderDraftSection('In-Progress', inProgressDocs)}
                        {renderDraftSection('Approved', approvedDocs)}
                        {renderDraftSection('Rejected', rejectedDocs)}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center py-12">
                            <DraftingIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-text-primary">No Active Documents</h3>
                            <p className="mt-1 text-sm text-text-secondary">
                              Get started by creating a new ordinance or resolution.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </>
    );
};

export default DraftingView;