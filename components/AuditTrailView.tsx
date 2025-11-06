import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { getAuditLogs } from '../services/db';
import { AuditLog } from '../types';

const AuditTrailView: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        setLogs(getAuditLogs());
    }, []);
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Audit Trail</h1>
            <Card>
                <ul className="divide-y divide-gray-200">
                    {logs.map((log: AuditLog) => (
                        <li key={log.id} className="py-4">
                            <div className="flex space-x-3">
                                <img className="h-10 w-10 rounded-full" src={log.userAvatar} alt={`${log.user}'s avatar`} />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-text-primary">{log.user}</h3>
                                        <p className="text-sm text-text-secondary">{log.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-text-secondary">
                                        {log.action} <span className="font-semibold text-primary">{log.target}</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default AuditTrailView;
