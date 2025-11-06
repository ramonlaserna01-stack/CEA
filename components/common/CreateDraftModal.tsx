import React, { useState } from 'react';

interface CreateDraftModalProps {
    onClose: () => void;
    onCreate: (draft: { title: string; type: 'Ordinance' | 'Resolution' }) => void;
}

const CreateDraftModal: React.FC<CreateDraftModalProps> = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'Ordinance' | 'Resolution' | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && type) {
            onCreate({ title, type });
        }
    };
    
    const handleTypeChange = (selectedType: 'Ordinance' | 'Resolution') => {
        setType(selectedType);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-text-primary">Create New Draft</h2>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Step 1: Choose Document Type</label>
                            <div className="flex space-x-4">
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer flex-1 transition-all ${type === 'Ordinance' ? 'bg-blue-50 border-primary ring-2 ring-primary' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="draft-type" value="Ordinance" checked={type === 'Ordinance'} onChange={() => handleTypeChange('Ordinance')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300"/>
                                    <span className="ml-3 text-sm font-medium text-text-primary">Ordinance</span>
                                </label>
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer flex-1 transition-all ${type === 'Resolution' ? 'bg-blue-50 border-primary ring-2 ring-primary' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="draft-type" value="Resolution" checked={type === 'Resolution'} onChange={() => handleTypeChange('Resolution')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300"/>
                                    <span className="ml-3 text-sm font-medium text-text-primary">Resolution</span>
                                </label>
                            </div>
                        </div>

                        {type && (
                            <div className="animate-fade-in">
                                <label htmlFor="draft-title" className="block text-sm font-medium text-text-secondary mb-1">Step 2: Provide a Title</label>
                                <input
                                    id="draft-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={`e.g., New ${type} for Public Park Renovation`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    required
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={!title.trim() || !type} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Create Draft
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                
                @keyframes fadeInScale {
                    from { transform: scale(.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CreateDraftModal;
