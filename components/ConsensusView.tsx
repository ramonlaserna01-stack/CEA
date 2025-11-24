
import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { getDocuments, saveDocuments } from '../services/db';
import { Document, ReadingStage } from '../types';

type VoteOption = 'approve' | 'disapprove' | 'abstain';

const VoteCounter: React.FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
    <div className="text-center">
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
    </div>
);

const VotingCard: React.FC<{ doc: Document, onVote: (updatedDoc: Document) => void }> = ({ doc, onVote }) => {
    const [selectedVote, setSelectedVote] = useState<VoteOption | null>(null);
    const [lockedVote, setLockedVote] = useState<VoteOption | null>(null);

    const handleSelectVote = (voteType: VoteOption) => {
        if (lockedVote) return; // Don't allow selection if vote is locked
        setSelectedVote(voteType);
    };

    const handleCastVote = () => {
        if (!selectedVote) return;

        // Increment the new vote
        const updatedDoc = {
            ...doc,
            votes: {
                ...doc.votes,
                [selectedVote]: doc.votes[selectedVote] + 1,
            }
        };
        
        setLockedVote(selectedVote);
        onVote(updatedDoc);
    };

    const handleEditVote = () => {
        if (!lockedVote) return;

        // Decrement the old vote
        const updatedDoc = {
            ...doc,
            votes: {
                ...doc.votes,
                [lockedVote]: doc.votes[lockedVote] - 1,
            }
        };

        setSelectedVote(lockedVote); // Pre-select their old choice
        setLockedVote(null);
        onVote(updatedDoc);
    };

    const getButtonClasses = (voteType: VoteOption) => {
        const baseClasses = "w-full font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
        
        if (lockedVote) {
             return `${baseClasses} ${lockedVote === voteType ? `ring-4 ring-offset-2 ring-primary` : 'bg-gray-300 text-gray-500'}`;
        }

        if (selectedVote === voteType) {
            const colorClass = voteType === 'approve' ? 'bg-green-500' : voteType === 'disapprove' ? 'bg-red-500' : 'bg-yellow-500';
            return `${baseClasses} ring-4 ring-offset-2 ring-primary ${colorClass} text-white`;
        }

        switch (voteType) {
            case 'approve': return `${baseClasses} bg-green-500 text-white hover:bg-green-600`;
            case 'disapprove': return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
            case 'abstain': return `${baseClasses} bg-yellow-500 text-white hover:bg-yellow-600`;
        }
    };
    
    return (
        <Card>
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-text-primary">{doc.title}</h2>
                <p className="text-sm text-text-secondary">{doc.id} - {doc.stage}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                <VoteCounter label="Approve" count={doc.votes.approve} color="text-green-500" />
                <VoteCounter label="Disapprove" count={doc.votes.disapprove} color="text-red-500" />
                <VoteCounter label="Abstain" count={doc.votes.abstain} color="text-yellow-500" />
                <VoteCounter label="Absent" count={doc.votes.absent} color="text-gray-500" />
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button onClick={() => handleSelectVote('approve')} disabled={!!lockedVote} className={getButtonClasses('approve')}>
                        Approve
                    </button>
                    <button onClick={() => handleSelectVote('disapprove')} disabled={!!lockedVote} className={getButtonClasses('disapprove')}>
                        Disapprove
                    </button>
                    <button onClick={() => handleSelectVote('abstain')} disabled={!!lockedVote} className={getButtonClasses('abstain')}>
                        Abstain
                    </button>
                </div>

                <div className="pt-2 text-center">
                    {lockedVote ? (
                        <div className="flex items-center justify-center space-x-4">
                            <p className="font-semibold text-green-600">✓ Vote Cast!</p>
                            <button 
                                onClick={handleEditVote} 
                                className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-50"
                            >
                                Edit Vote
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCastVote}
                            disabled={!selectedVote}
                            className="w-full md:w-auto px-10 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Cast Final Vote
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
};

const ConsensusView: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        setDocuments(getDocuments());
    }, []);

    const handleVote = (updatedDoc: Document) => {
        const updatedDocuments = documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
        saveDocuments(updatedDocuments);
        setDocuments(updatedDocuments);
    };

    const documentsForVoting = documents.filter(
        doc => doc.stage === ReadingStage.SECOND || doc.stage === ReadingStage.THIRD
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Consensus & Voting</h1>
            {documentsForVoting.length > 0 ? (
                <div className="space-y-6">
                    {documentsForVoting.map(doc => (
                        <VotingCard key={doc.id} doc={doc} onVote={handleVote} />
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-text-primary">No Active Voting Sessions</h3>
                        <p className="mt-1 text-sm text-text-secondary">
                          There are currently no ordinances or resolutions open for voting.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ConsensusView;
