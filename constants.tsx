import React from 'react';
import { View, Document, DocumentStatus, AuditLog, DocumentVersion, Comment, ReadingStage, Section } from './types';

export const NAV_ITEMS: View[] = ['Dashboard', 'Drafting', 'Consensus', 'Monitoring', 'Audit Trail', 'Archive'];

export const mockDocuments: Document[] = [
  { 
    id: 'ORD-2023-001', 
    title: 'Zoning Regulation Update for Commercial Districts', 
    type: 'Ordinance', 
    status: DocumentStatus.REVIEW, 
    stage: ReadingStage.SECOND, 
    sections: [
        { id: 'sec1-1', title: 'Section 1: Preamble', content: '<p>Whereas, the City Council has identified a need to modernize zoning regulations to foster <strong>economic growth</strong> while preserving community character...</p>', status: 'locked' },
        { id: 'sec1-2', title: 'Section 2: Definitions', content: '<p>Key terms used within this ordinance are defined as follows...</p>', status: 'locked' },
        { id: 'sec1-3', title: 'Section 3: Permitted Uses', content: '<p>3.2: Operating hours for businesses adjacent to residential zones shall be limited to <u>"reasonable hours"</u>, typically defined as 7:00 AM to 10:00 PM, unless a special permit is obtained.</p>', status: 'editing' },
    ],
    votes: { approve: 4, disapprove: 2, abstain: 1, absent: 3, totalMembers: 10 }, 
    lastUpdated: '2023-10-26', 
    createdBy: 'Alice Johnson', 
    progress: 75 
  },
  { 
    id: 'RES-2023-015', 
    title: 'Resolution for Public Park Renovation Initiative', 
    type: 'Resolution', 
    status: DocumentStatus.APPROVED, 
    stage: ReadingStage.PASSED, 
    sections: [
        { id: 'sec2-1', title: 'Section 1: Purpose', content: '<p>This resolution authorizes the allocation of funds for the renovation of <strong>City Central Park</strong>, including the installation of new playground equipment and landscaping.</p>', status: 'locked' },
    ],
    votes: { approve: 9, disapprove: 1, abstain: 0, absent: 0, totalMembers: 10 }, 
    lastUpdated: '2023-10-22', 
    createdBy: 'Bob Williams', 
    progress: 100 
  },
  { 
    id: 'ORD-2023-002', 
    title: 'Plastic Bag Ban Implementation Act', 
    type: 'Ordinance', 
    status: DocumentStatus.DRAFT, 
    stage: ReadingStage.FIRST, 
    sections: [
      { id: 'sec3-1', title: 'Section 1: Definitions', content: '<p>For the purposes of this ordinance, a "single-use plastic bag" is defined as...</p>', status: 'editing' },
    ],
    votes: { approve: 0, disapprove: 0, abstain: 0, absent: 10, totalMembers: 10 }, 
    lastUpdated: '2023-10-27', 
    createdBy: 'Charlie Brown', 
    progress: 25 
  },
  { 
    id: 'ORD-2023-003', 
    title: 'Updated Noise Control Ordinance', 
    type: 'Ordinance', 
    status: DocumentStatus.REJECTED, 
    stage: ReadingStage.THIRD, 
    sections: [
      { id: 'sec4-1', title: 'Section 1: Preamble', content: '<p>Introduction to the noise control ordinance.</p>', status: 'locked' },
      { id: 'sec4-2', title: 'Section 2: Noise Limits', content: '<p>Maximum permissible noise levels are hereby established for residential and commercial zones...</p>', status: 'locked' },
    ],
    votes: { approve: 4, disapprove: 6, abstain: 0, absent: 0, totalMembers: 10 }, 
    lastUpdated: '2023-09-15', 
    createdBy: 'Diana Prince', 
    progress: 90 
  },
  { 
    id: 'RES-2023-016', 
    title: 'Community Garden Establishment Grant', 
    type: 'Resolution', 
    status: DocumentStatus.REVIEW, 
    stage: ReadingStage.FIRST, 
    sections: [
      { id: 'sec5-1', title: 'Section 1: Grant Program', content: '<p>A grant program is established to support the creation of new community gardens on city-owned land.</p>', status: 'editing' },
    ],
    votes: { approve: 0, disapprove: 0, abstain: 0, absent: 10, totalMembers: 10 }, 
    lastUpdated: '2023-10-25', 
    createdBy: 'Eve Adams', 
    progress: 60 
  },
  { 
    id: 'ORD-2023-004', 
    title: 'Bicycle Lane Expansion Project', 
    type: 'Ordinance', 
    status: DocumentStatus.APPROVED, 
    stage: ReadingStage.PASSED, 
    sections: [
        { id: 'sec6-1', title: 'Article I: Expansion Plan', content: '<p>The Department of Transportation shall expand bicycle lanes on the following streets...</p>', status: 'locked' },
    ],
    votes: { approve: 8, disapprove: 1, abstain: 1, absent: 0, totalMembers: 10 }, 
    lastUpdated: '2023-10-20', 
    createdBy: 'Frank Castle', 
    progress: 100 
  },
  { 
    id: 'RES-2023-017', 
    title: 'City Arts Festival Funding', 
    type: 'Resolution', 
    status: DocumentStatus.DRAFT, 
    stage: ReadingStage.FIRST, 
    sections: [
      { id: 'sec7-1', title: 'Preamble', content: '<p>A resolution to approve funding for the annual City Arts Festival.</p>', status: 'editing' }
    ],
    votes: { approve: 0, disapprove: 0, abstain: 0, absent: 10, totalMembers: 10 }, 
    lastUpdated: '2023-10-28', 
    createdBy: 'Grace Lee', 
    progress: 10 
  },
];

export const mockArchivedDocuments: Document[] = [
    { id: 'ORD-2022-051', title: 'Previous Year Budget Allocation', type: 'Ordinance', status: DocumentStatus.ARCHIVED, stage: ReadingStage.PASSED, sections: [{id: 'arc1', title: 'Final Budget', content: '<h2>Final Budget</h2><p>This document outlines the final budget allocations for the fiscal year 2022.</p>', status: 'locked'}], votes: { approve: 10, disapprove: 0, abstain: 0, absent: 0, totalMembers: 10 }, lastUpdated: '2022-12-15', createdBy: 'Admin', progress: 100 },
    { id: 'RES-2022-112', title: 'Historical Landmark Designation', type: 'Resolution', status: DocumentStatus.ARCHIVED, stage: ReadingStage.PASSED, sections: [{id: 'arc2', title: 'Resolution', content: '<p>A resolution to designate the Old City Hall as a historical landmark.</p>', status: 'locked'}], votes: { approve: 10, disapprove: 0, abstain: 0, absent: 0, totalMembers: 10 }, lastUpdated: '2022-11-01', createdBy: 'Admin', progress: 100 },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 1, user: 'Alice Johnson', userAvatar: 'https://i.pravatar.cc/150?u=alice', action: 'Voted on', target: 'ORD-2023-001', timestamp: '2023-10-27 11:05 AM' },
  { id: 2, user: 'Alice Johnson', userAvatar: 'https://i.pravatar.cc/150?u=alice', action: 'Locked Section 2 of', target: 'ORD-2023-001', timestamp: '2023-10-27 10:45 AM' },
  { id: 3, user: 'Bob Williams', userAvatar: 'https://i.pravatar.cc/150?u=bob', action: 'Approved', target: 'RES-2023-015', timestamp: '2023-10-27 09:30 AM' },
  { id: 4, user: 'Charlie Brown', userAvatar: 'https://i.pravatar.cc/150?u=charlie', action: 'Created Draft', target: 'ORD-2023-002', timestamp: '2023-10-27 08:15 AM' },
  { id: 5, user: 'Alice Johnson', userAvatar: 'https://i.pravatar.cc/150?u=alice', action: 'Commented on', target: 'ORD-2023-001', timestamp: '2023-10-26 05:20 PM' },
  { id: 6, user: 'Diana Prince', userAvatar: 'https://i.pravatar.cc/150?u=diana', action: 'Voted on', target: 'ORD-2023-003', timestamp: '2023-10-26 01:10 PM' },
];

export const mockDocumentVersions: DocumentVersion[] = [
    { id: 1, version: 4, author: 'Alice Johnson', timestamp: '2023-10-27 10:45 AM', summary: 'Incorporated feedback from legal team.' },
    { id: 2, version: 3, author: 'Bob Williams', timestamp: '2023-10-26 02:00 PM', summary: 'Added environmental impact section.' },
    { id: 3, version: 2, author: 'Alice Johnson', timestamp: '2023-10-25 11:10 AM', summary: 'Minor grammatical corrections.' },
    { id: 4, version: 1, author: 'Alice Johnson', timestamp: '2023-10-24 09:30 AM', summary: 'Initial draft creation.' },
];

export const mockComments: Comment[] = [
    { id: 1, user: 'Bob Williams', userAvatar: 'https://i.pravatar.cc/150?u=bob', text: 'Section 3.2 seems a bit ambiguous. Can we clarify the wording on "reasonable hours"?', timestamp: '3 hours ago'},
    { id: 2, user: 'Diana Prince', userAvatar: 'https://i.pravatar.cc/150?u=diana', text: 'I agree with Bob. Also, we should consider the impact on small businesses mentioned in Appendix A.', timestamp: '1 hour ago'},
];

// Icons
export const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);
export const DraftingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
);
export const MonitoringIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.54 11.23c.25.82.25 1.71 0 2.54l-2.32 7.64A2 2 0 0 1 17.39 23H6.61a2 2 0 0 1-1.83-1.59L2.46 13.77a2.54 2.54 0 0 1 0-2.54l2.32-7.64A2 2 0 0 1 6.61 1h10.78a2 2 0 0 1 1.83 1.59z" /><line x1="12" x2="12" y1="1" y2="23" /></svg>
);
export const AuditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 21h8" /><path d="M6 18h12" /><path d="M10 3h4" /><path d="M12 3v15" /><path d="M18 6 7 17" /><path d="m6 6 11 11" /></svg>
);
export const ArchiveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
);
export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9Z"/></svg>
);
export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
export const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
export const DotsVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);
export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
export const UnlockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
);