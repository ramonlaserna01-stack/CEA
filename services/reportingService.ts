import { Document, DocumentStatus } from '../types';
import { getDocuments } from './db';

export interface ReportFilters {
  startDate: string;
  endDate: string;
  types: Array<'Ordinance' | 'Resolution'>;
  statuses: DocumentStatus[];
}

export interface ReportData {
  totalDocs: number;
  filteredDocs: Document[];
  countsByType: { Ordinance: number; Resolution: number };
  countsByStatus: Record<DocumentStatus, number>;
}

export const generateReportData = (filters: ReportFilters): ReportData => {
  const allDocuments = getDocuments();

  const filteredDocs = allDocuments.filter(doc => {
    const docDate = new Date(doc.lastUpdated);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    // Date range check
    if (startDate && docDate < startDate) return false;
    if (endDate && docDate > endDate) return false;

    // Type check
    if (filters.types.length > 0 && !filters.types.includes(doc.type)) {
      return false;
    }

    // Status check
    if (filters.statuses.length > 0 && !filters.statuses.includes(doc.status)) {
      return false;
    }

    return true;
  });

  const reportData: ReportData = {
    totalDocs: filteredDocs.length,
    filteredDocs,
    countsByType: { Ordinance: 0, Resolution: 0 },
    countsByStatus: {
      [DocumentStatus.DRAFT]: 0,
      [DocumentStatus.REVIEW]: 0,
      [DocumentStatus.APPROVED]: 0,
      [DocumentStatus.REJECTED]: 0,
      [DocumentStatus.ARCHIVED]: 0,
    },
  };

  for (const doc of filteredDocs) {
    reportData.countsByType[doc.type]++;
    reportData.countsByStatus[doc.status]++;
  }

  return reportData;
};
