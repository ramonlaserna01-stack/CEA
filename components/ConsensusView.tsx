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
    const [document, setDocument] = useState(doc);
    const [userVote, setUserVote] = useState<VoteOption | null>(null);

    const handleVote = (voteType: VoteOption) => {
        if (userVote) return; // Can't vote twice

        const updatedDoc = {
            ...document,
            votes: {
                ...document.votes,
                [voteType]: document.votes[voteType] + 1,
            }
        };

        setDocument(updatedDoc);
        setUserVote(voteType);
        onVote(updatedDoc);
    };

    const getButtonClasses = (voteType: VoteOption) => {
        const baseClasses = "w-full font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
        if (userVote) {
            return `${baseClasses} ${userVote === voteType ? `ring-4 ring-offset-2 ring-primary` : 'bg-gray-300 text-gray-500'}`;
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
                <h2 className="text-xl font-bold text-text-primary">{document.title}</h2>
                <p className="text-sm text-text-secondary">{document.id} - {document.stage}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                <VoteCounter label="Approve" count={document.votes.approve} color="text-green-500" />
                <VoteCounter label="Disapprove" count={document.votes.disapprove} color="text-red-500" />
                <VoteCounter label="Abstain" count={document.votes.abstain} color="text-yellow-500" />
                <VoteCounter label="Absent" count={document.votes.absent} color="text-gray-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => handleVote('approve')} disabled={!!userVote} className={getButtonClasses('approve')}>
                    Approve
                </button>
                <button onClick={() => handleVote('disapprove')} disabled={!!userVote} className={getButtonClasses('disapprove')}>
                    Disapprove
                </button>
                <button onClick={() => handleVote('abstain')} disabled={!!userVote} className={getButtonClasses('abstain')}>
                    Abstain
                </button>
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
