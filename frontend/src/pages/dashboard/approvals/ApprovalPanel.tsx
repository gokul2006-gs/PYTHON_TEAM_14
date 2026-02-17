import React, { useEffect, useState } from 'react';
import { approvalService, type PendingRequest } from '../../../services/approvalService';
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock, Calendar, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const ApprovalPanel: React.FC = () => {
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const data = await approvalService.getPendingRequests();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setProcessingId(id);
        try {
            if (action === 'approve') {
                await approvalService.approve(id);
            } else {
                await approvalService.reject(id, 'Rejected by admin/faculty'); // In real app, prompt for comment
            }
            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error(`Failed to ${action}`, error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>

            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div
                            key={request.id}
                            className={`rounded-xl border bg-white p-6 shadow-sm transition-all ${request.type === 'special' ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-slate-200'
                                }`}
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${request.type === 'special' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {request.type} Request
                                        </span>
                                        <h3 className="font-semibold text-slate-900">{request.resourceName}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            {request.userName} <span className="text-xs text-slate-400">({request.userRole})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {request.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {request.startTime} - {request.endTime}
                                        </div>
                                    </div>

                                    <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                                        <span className="font-medium">Justification: </span>
                                        {request.purpose}
                                    </div>
                                </div>

                                <div className="flex gap-3 lg:flex-col">
                                    <button
                                        onClick={() => handleAction(request.id, 'approve')}
                                        disabled={!!processingId}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 lg:w-32"
                                    >
                                        {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(request.id, 'reject')}
                                        disabled={!!processingId}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 lg:w-32"
                                    >
                                        <XCircle size={16} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16">
                        <CheckCircle className="mb-4 h-12 w-12 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
                        <p className="text-slate-500">No pending requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
