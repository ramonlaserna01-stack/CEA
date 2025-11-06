import React from 'react';
import { Section } from '../../types';
import RichTextEditor from './RichTextEditor';
import { LockIcon, UnlockIcon } from '../../constants';

interface SectionEditorProps {
    section: Section;
    onChange: (newContent: string) => void;
    onToggleLock: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onChange, onToggleLock }) => {
    const isLocked = section.status === 'locked';

    return (
        <div className={`border rounded-lg transition-all ${isLocked ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
            <div className="flex justify-between items-center p-3 bg-gray-100 border-b rounded-t-lg">
                <h3 className="text-md font-semibold text-text-primary">{section.title}</h3>
                <button 
                    onClick={onToggleLock}
                    className={`flex items-center text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                        isLocked 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                >
                    {isLocked ? <UnlockIcon className="w-4 h-4 mr-2" /> : <LockIcon className="w-4 h-4 mr-2" />}
                    {isLocked ? 'Unlock to Edit' : 'Lock Section'}
                </button>
            </div>
            <div className="p-1">
                <RichTextEditor 
                    value={section.content}
                    onChange={onChange}
                    readOnly={isLocked}
                />
            </div>
        </div>
    );
};

export default SectionEditor;