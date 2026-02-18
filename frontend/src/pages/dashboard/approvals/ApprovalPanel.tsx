import React, { useEffect, useState } from 'react';
import { approvalService } from '../../../services/approvalService';
import type { Booking } from '../../../services/bookingService';
import { Loader2, XCircle, Clock, Calendar, User, ShieldCheck, AlertCircle, Eraser } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';

export const ApprovalPanel: React.FC = () => {
    const [requests, setRequests] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Filter States
    const [filterDate, setFilterDate] = useState('');
    const [filterTimeStart, setFilterTimeStart] = useState('');
    const [filterTimeEnd, setFilterTimeEnd] = useState('');

    const fetchRequests = async () => {
        setIsLoading(true);
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

    const clearFilters = () => {
        setFilterDate('');
        setFilterTimeStart('');
        setFilterTimeEnd('');
    };

    const filteredRequests = requests.filter(request => {
        // Date Filter
        if (filterDate && !isSameDay(parseISO(request.booking_date), new Date(filterDate))) {
            return false;
        }

        // Time Filter (using string comparison on HH:mm:ss or HH:mm)
        if (filterTimeStart || filterTimeEnd) {
            const startTime = request.start_time.substring(0, 5); // HH:mm
            if (filterTimeStart && startTime < filterTimeStart) return false;
            if (filterTimeEnd && startTime > filterTimeEnd) return false;
        }

        return true;
    });

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        setProcessingId(id);
        try {
            if (action === 'approve') {
                await approvalService.approve(id);
            } else {
                await approvalService.reject(id, 'Rejected by authority');
            }
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error(`Failed to ${action}`, error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-black text-college-navy tracking-tight italic">Security & Approvals</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Review and manage pending resource access requests.</p>
                </div>
                <div className="flex items-center gap-3 self-center sm:self-auto">
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-rose-500 transition-all shadow-sm h-11"
                    >
                        <Eraser size={14} />
                        Clear
                    </button>
                    <button
                        onClick={fetchRequests}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 shadow-lg shadow-primary-500/10 hover:bg-primary-200 transition-all"
                        title="Refresh Requests"
                    >
                        <ShieldCheck size={20} />
                    </button>
                </div>
            </div>

            {/* Premium Filter Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-200/60 shadow-inner">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Filter by Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Start Time Threshold</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="time"
                            value={filterTimeStart}
                            onChange={(e) => setFilterTimeStart(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">End Time Threshold</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="time"
                            value={filterTimeEnd}
                            onChange={(e) => setFilterTimeEnd(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:gap-6">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`group overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-white bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/5 ${request.booking_type === 'SPECIAL' ? 'border-l-8 border-l-college-gold' : 'border-l-8 border-l-primary-500'
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row items-stretch">
                                <div className="flex-1 p-6 sm:p-8">
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                                        <span className={`rounded-full px-3 sm:px-4 py-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${request.booking_type === 'SPECIAL' ? 'bg-college-gold/10 text-college-gold' : 'bg-primary-50 text-primary-600'
                                            }`}>
                                            {request.booking_type} Access
                                        </span>
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                                        <h3 className="text-lg sm:text-xl font-bold text-college-navy italic leading-snug">{request.resource_name}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <User size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">Requester</div>
                                                <div className="text-sm font-bold text-college-navy truncate">{request.user_name}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">
                                                    {request.user_role} • {request.user_dept || 'General'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">ID Reference</div>
                                                <div className="text-sm font-bold text-college-navy truncate">
                                                    {request.user_id_ref}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <Calendar size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">Date</div>
                                                <div className="text-sm font-bold text-college-navy truncate">
                                                    {format(parseISO(request.booking_date), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <Clock size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">Duration</div>
                                                <div className="text-sm font-bold text-college-navy truncate">
                                                    {request.start_time.substring(0, 5)}—{request.end_time.substring(0, 5)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {request.justification && (
                                        <div className="relative rounded-[1.25rem] sm:rounded-[1.5rem] bg-slate-50 p-5 sm:p-6 border border-slate-100 italic text-slate-600 text-sm">
                                            <AlertCircle size={14} className="absolute top-5 left-5 text-slate-300 hidden xs:block" />
                                            <div className="xs:pl-6 sm:pl-8">
                                                <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] sm:text-[10px] block mb-1">Statement of Need</span>
                                                <span className="leading-relaxed">"{request.justification}"</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-100 p-6 sm:p-8 flex flex-row lg:flex-col justify-center gap-3 sm:gap-4 lg:min-w-[220px]">
                                    <button
                                        onClick={() => handleAction(request.id, 'approve')}
                                        disabled={!!processingId}
                                        className="btn-premium flex-1 sm:flex-none flex items-center justify-center gap-2 !bg-emerald-600 shadow-emerald-500/20 text-xs sm:text-sm py-3 lg:py-4 px-2 sm:px-4"
                                    >
                                        {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                        <span className="hidden xs:inline">Verify &</span> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(request.id, 'reject')}
                                        disabled={!!processingId}
                                        className="btn-premium-outline flex-1 sm:flex-none flex items-center justify-center gap-2 !border-red-500 !text-red-600 hover:!bg-red-500 hover:!text-white text-xs sm:text-sm py-3 lg:py-4 px-2 sm:px-4"
                                    >
                                        <XCircle size={16} />
                                        Deny <span className="hidden xs:inline">Access</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 py-32 bg-white/50 backdrop-blur-sm">
                        <div className="h-24 w-24 rounded-[2rem] bg-slate-100 text-slate-300 flex items-center justify-center mb-6 shadow-sm">
                            <Clock size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-college-navy italic">No Pending Requests</h3>
                        <p className="text-slate-500 font-medium">Try clearing your filters to see more results.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

