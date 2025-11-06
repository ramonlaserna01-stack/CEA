import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from './common/Card';
import { getDocuments } from '../services/db';
import { Document, DocumentStatus } from '../types';

const Dashboard: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        setDocuments(getDocuments());
    }, []);

    const statusCounts = documents.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
    }, {} as Record<DocumentStatus, number>);

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    
    // New mock data for the 6-month trend
    const monthlyTrendData = [
        { month: 'May', Ordinances: 2, Resolutions: 3 },
        { month: 'Jun', Ordinances: 3, Resolutions: 5 },
        { month: 'Jul', Ordinances: 4, Resolutions: 4 },
        { month: 'Aug', Ordinances: 3, Resolutions: 6 },
        { month: 'Sep', Ordinances: 5, Resolutions: 7 },
        { month: 'Oct', Ordinances: 4, Resolutions: 6 },
    ];

    const COLORS = {
        [DocumentStatus.DRAFT]: '#90CAF9', // blue
        [DocumentStatus.REVIEW]: '#FFB74D', // orange
        [DocumentStatus.APPROVED]: '#81C784', // green
        [DocumentStatus.REJECTED]: '#E57373', // red
        [DocumentStatus.ARCHIVED]: '#BDBDBD', // grey
    };
    const TYPE_COLORS = { 'Ordinances': '#0D47A1', 'Resolutions': '#42A5F5' };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="text-text-secondary font-semibold">Total Documents</h3>
                    <p className="text-4xl font-bold text-primary">{documents.length}</p>
                </Card>
                <Card>
                    <h3 className="text-text-secondary font-semibold">In Review</h3>
                    <p className="text-4xl font-bold text-orange-500">{statusCounts[DocumentStatus.REVIEW] || 0}</p>
                </Card>
                <Card>
                    <h3 className="text-text-secondary font-semibold">Approved</h3>
                    <p className="text-4xl font-bold text-green-500">{statusCounts[DocumentStatus.APPROVED] || 0}</p>
                </Card>
                <Card>
                    <h3 className="text-text-secondary font-semibold">Pending Drafts</h3>
                    <p className="text-4xl font-bold text-blue-400">{statusCounts[DocumentStatus.DRAFT] || 0}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Documents by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                 <Card className="lg:col-span-3">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">6-Month Approval Trend</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrendData}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis dataKey="month" />
                           <YAxis />
                           <Tooltip />
                           <Legend />
                           <Line type="monotone" dataKey="Ordinances" stroke={TYPE_COLORS['Ordinances']} strokeWidth={2} activeDot={{ r: 8 }} />
                           <Line type="monotone" dataKey="Resolutions" stroke={TYPE_COLORS['Resolutions']} strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
