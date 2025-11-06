
import React, { useState, useCallback } from 'react';
import { SparklesIcon } from '../../constants';
import { callGeminiApi } from '../../services/geminiService';

interface AIAssistantProps {
    onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const documentContext = `
        Context: The following is a draft for a city ordinance about "Zoning Regulation Update for Commercial Districts".
        Section 3.2: Operating hours for businesses adjacent to residential zones shall be limited to "reasonable hours", typically defined as 7:00 AM to 10:00 PM, unless a special permit is obtained.
    `;
    
    const handleGenerate = useCallback(async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const fullPrompt = `${documentContext}\n\nUser Request: ${prompt}`;
            const responseText = await callGeminiApi(fullPrompt);
            setResult(responseText);
        } catch (err) {
            setError('Failed to get response from AI. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, documentContext]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center">
                        <SparklesIcon className="w-6 h-6 text-primary mr-3" />
                        <h2 className="text-xl font-bold text-text-primary">AI Assistant</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                
                <div className="p-6 flex-grow overflow-y-auto">
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
                    
                    {result ? (
                        <div className="bg-gray-50 p-4 rounded-md border prose max-w-none">
                           <p>{result}</p>
                        </div>
                    ) : (
                         <div className="text-center text-text-secondary">
                           <p className="mb-4">What can I help you with? Ask me to summarize, check for clarity, or suggest improvements.</p>
                           <div className="grid grid-cols-2 gap-2 text-sm">
                                <button onClick={() => setPrompt('Summarize the key points of this document.')} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left">Summarize key points</button>
                                <button onClick={() => setPrompt('Suggest a clearer wording for Section 3.2.')} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left">Improve clarity of Section 3.2</button>
                                <button onClick={() => setPrompt('Identify potential legal ambiguities.')} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left">Find ambiguities</button>
                                <button onClick={() => setPrompt('Translate the summary into plain language for the public.')} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left">Simplify for public</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask for assistance..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !prompt}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing
                                </>
                            ) : "Generate"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
