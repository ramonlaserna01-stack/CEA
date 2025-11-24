import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './common/Card';
import { SparklesIcon } from '../constants';
import { Document, DocumentStatus } from '../types';
import { generateReportData, ReportData, ReportFilters } from '../services/reportingService';
import { callGeminiApi } from '../services/geminiService';

const documentTypes: Array<'Ordinance' | 'Resolution'> = ['Ordinance', 'Resolution'];
const documentStatuses: DocumentStatus[] = [DocumentStatus.APPROVED, DocumentStatus.REJECTED, DocumentStatus.REVIEW, DocumentStatus.DRAFT];

const ReportsView: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    types: [],
    statuses: [],
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (field: 'types' | 'statuses', value: any) => {
    const currentValues = filters[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setFilters(prev => ({ ...prev, [field]: newValues }));
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReportData(null);
    setAiSummary('');

    const data = generateReportData(filters);
    setReportData(data);

    if (data.totalDocs > 0) {
        try {
            // Fix: Changed property access to use enum members for better type safety, resolving a type inference issue.
            const prompt = `
                Generate an executive summary for a legislative report with the following data:
                - Time Period: ${filters.startDate || 'N/A'} to ${filters.endDate || 'N/A'}
                - Total Documents: ${data.totalDocs}
                - Ordinances: ${data.countsByType.Ordinance}
                - Resolutions: ${data.countsByType.Resolution}
                - Approved: ${data.countsByStatus[DocumentStatus.APPROVED]}
                - Rejected: ${data.countsByStatus[DocumentStatus.REJECTED]}
                - In Review: ${data.countsByStatus[DocumentStatus.REVIEW]}
                - Drafts: ${data.countsByStatus[DocumentStatus.DRAFT]}

                Summarize the key trends and statistics in a professional, neutral paragraph.
            `;
            const summary = await callGeminiApi(prompt);
            setAiSummary(summary);
        } catch (error) {
            console.error(error);
            setAiSummary('Error generating AI summary.');
        }
    }
    
    setIsLoading(false);
  };
  
  // Fix: Cast the result of Object.entries to [string, number][] to resolve a type inference issue where the value was treated as 'unknown'.
  const statusChartData = reportData ? (Object.entries(reportData.countsByStatus) as [string, number][])
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Reports & Analytics</h1>

      {/* Filters Card */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
            <input type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
            <input type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Document Type</label>
            <div className="flex space-x-4">
              {documentTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input type="checkbox" checked={filters.types.includes(type)} onChange={() => handleCheckboxChange('types', type)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                  <span className="ml-2 text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
             <div className="flex flex-wrap gap-2">
              {documentStatuses.map(status => (
                <label key={status} className="flex items-center">
                  <input type="checkbox" checked={filters.statuses.includes(status)} onChange={() => handleCheckboxChange('statuses', status)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                  <span className="ml-2 text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleGenerateReport} disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-focus disabled:bg-gray-400">
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </Card>

      {/* Report Results */}
      {isLoading && <div className="text-center p-8">Loading report...</div>}
      
      {!isLoading && reportData && (
         <div className="space-y-6 animate-fade-in">
             {/* AI Summary */}
            <Card>
                <div className="flex items-center mb-3">
                    <SparklesIcon className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-xl font-semibold text-text-primary">AI Executive Summary</h2>
                </div>
                <div className="prose prose-sm max-w-none text-text-secondary">
                   {aiSummary ? <p>{aiSummary}</p> : <div className="italic">Generating summary...</div>}
                </div>
            </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="text-text-secondary font-semibold">Total Documents</h3><p className="text-4xl font-bold text-primary">{reportData.totalDocs}</p></Card>
                <Card><h3 className="text-text-secondary font-semibold">Ordinances</h3><p className="text-4xl font-bold text-blue-600">{reportData.countsByType.Ordinance}</p></Card>
                <Card><h3 className="text-text-secondary font-semibold">Resolutions</h3><p className="text-4xl font-bold text-purple-600">{reportData.countsByType.Resolution}</p></Card>
                 <Card><h3 className="text-text-secondary font-semibold">Approved</h3><p className="text-4xl font-bold text-green-500">{reportData.countsByStatus.Approved}</p></Card>
            </div>
            
            <Card>
                 <h2 className="text-xl font-semibold text-text-primary mb-4">Documents by Status</h2>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusChartData}>
                       <CartesianGrid strokeDasharray="3 3" />
                       <XAxis dataKey="name" />
                       <YAxis />
                       <Tooltip />
                       <Legend />
                       <Bar dataKey="value" fill="#42A5F5" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            
            <Card>
                 <h2 className="text-xl font-semibold text-text-primary mb-4">Detailed Data</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">Title</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.filteredDocs.map(doc => (
                                <tr key={doc.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary">{doc.id}</td>
                                    <td className="px-4 py-3 text-sm">{doc.title}</td>
                                    <td className="px-4 py-3 text-sm">{doc.type}</td>
                                    <td className="px-4 py-3 text-sm">{doc.status}</td>
                                    <td className="px-4 py-3 text-sm">{doc.lastUpdated}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
         </div>
      )}

      {!isLoading && !reportData && (
          <Card>
              <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-text-primary">Generate a report</h3>
                  <p className="mt-1 text-sm text-text-secondary">Select your filters above and click "Generate Report" to see data and insights.</p>
              </div>
          </Card>
      )}

    </div>
  );
};

export default ReportsView;