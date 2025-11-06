import React from 'react';

export type View = 'Dashboard' | 'Drafting' | 'Consensus' | 'Monitoring' | 'Audit Trail' | 'Archive' | 'Reports' | 'Documents';

export enum DocumentStatus {
  DRAFT = 'Draft',
  REVIEW = 'In Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ARCHIVED = 'Archived',
}

export enum ReadingStage {
    FIRST = '1st Reading',
    SECOND = '2nd Reading',
    THIRD = '3rd Reading',
    MAYOR = "Mayor's Review",
    PASSED = 'Passed',
}

export interface Section {
  id: string;
  title: string;
  content: string; // Rich text HTML
  status: 'editing' | 'locked';
}

export interface Document {
  id: string;
  title: string;
  type: 'Ordinance' | 'Resolution';
  status: DocumentStatus;
  stage: ReadingStage;
  sections: Section[]; // Changed from content: string
  votes: {
    approve: number;
    disapprove: number;
    abstain: number;
    absent: number;
    totalMembers: number;
  };
  lastUpdated: string;
  createdBy: string;
  progress: number;
}

export interface AuditLog {
  id: number;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface DocumentVersion {
  id: number;
  version: number;
  author: string;
  timestamp: string;
  summary: string;
}

export interface Comment {
    id: number;
    user: string;
    userAvatar: string;
    text: string;
    timestamp: string;
}