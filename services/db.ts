import { Document, AuditLog } from '../types';
import { initialMockDocuments, initialMockArchivedDocuments, initialMockAuditLogs } from '../constants';

const DOCUMENTS_KEY = 'legislateflow_documents';
const AUDIT_LOGS_KEY = 'legislateflow_audit_logs';

// Helper functions
const readFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const writeToStorage = <T>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key “${key}”:`, error);
    }
};

export const initDB = () => {
    // Initialize documents if not present
    if (window.localStorage.getItem(DOCUMENTS_KEY) === null) {
        const allDocuments = [...initialMockDocuments, ...initialMockArchivedDocuments];
        writeToStorage(DOCUMENTS_KEY, allDocuments);
    }
    // Initialize audit logs if not present
    if (window.localStorage.getItem(AUDIT_LOGS_KEY) === null) {
        writeToStorage(AUDIT_LOGS_KEY, initialMockAuditLogs);
    }
};

// Documents API
export const getDocuments = (): Document[] => {
    return readFromStorage<Document[]>(DOCUMENTS_KEY, []);
};

export const saveDocuments = (documents: Document[]): void => {
    writeToStorage(DOCUMENTS_KEY, documents);
};

// Audit Logs API
export const getAuditLogs = (): AuditLog[] => {
    return readFromStorage<AuditLog[]>(AUDIT_LOGS_KEY, []);
};

export const saveAuditLogs = (logs: AuditLog[]): void => {
    writeToStorage(AUDIT_LOGS_KEY, logs);
};
