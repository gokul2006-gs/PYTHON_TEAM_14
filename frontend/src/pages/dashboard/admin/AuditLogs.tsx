import React, { useEffect, useState } from 'react';
import { FileText, Clock, User, Filter, Loader2, AlertCircle, Calendar, Eraser } from 'lucide-react';
import { auditService, type AuditLog } from '../../../services/auditService';
import { format, isSameDay, parseISO } from 'date-fns';

export const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter States
    const [filterDate, setFilterDate] = useState('');
    const [filterTimeStart, setFilterTimeStart] = useState('');
    const [filterTimeEnd, setFilterTimeEnd] = useState('');

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await auditService.getAll();
            setLogs(data);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
            setError('Failed to synchronize registry surveillance stream.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const clearFilters = () => {
        setFilterDate('');
        setFilterTimeStart('');
        setFilterTimeEnd('');
    };

    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp);

        // Date Filter
        if (filterDate && !isSameDay(logDate, new Date(filterDate))) {
            return false;
        }

        // Time Filter
        if (filterTimeStart || filterTimeEnd) {
            const logTimeStr = format(logDate, 'HH:mm');
            if (filterTimeStart && logTimeStr < filterTimeStart) return false;
            if (filterTimeEnd && logTimeStr > filterTimeEnd) return false;
        }

        return true;
    });

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Registry Surveillance</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Complete immutable record of all institutional resource operations.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-rose-500 transition-all shadow-sm"
                    >
                        <Eraser size={14} />
                        Clear
                    </button>
                    <button
                        onClick={fetchLogs}
                        className="flex items-center gap-2 rounded-xl border-2 border-primary-100 bg-primary-50 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:bg-primary-100 transition-all shadow-sm"
                    >
                        <Filter size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Premium Filter Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200/60 shadow-sm">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Operation Date</label>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Start Threshold</label>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">End Threshold</label>
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

            <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden min-h-[400px]">
                <div className="flow-root">
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Decrypting Audit Stream...</p>
                        </div>
                    ) : error ? (
                        <div className="py-32 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
                            <p className="text-rose-600 font-bold">{error}</p>
                            <button onClick={fetchLogs} className="mt-4 text-sm font-black text-primary-600 uppercase hover:underline">Retry Connection</button>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="py-32 text-center">
                            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 text-slate-200 flex items-center justify-center mx-auto mb-6">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-black text-college-navy italic">No Matching Records</h3>
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-[10px] mt-2">No entries found for the selected time horizon.</p>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-slate-50">
                            {filteredLogs.map((log) => (
                                <li key={log.id} className="p-6 transition-all hover:bg-slate-50/50 group">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-sm font-black text-college-navy italic leading-snug">
                                                    {log.action.replace(/_/g, ' ')} <span className="opacity-40 font-bold ml-1 text-xs">#INT-{log.id}</span>
                                                </p>
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                                    {log.details.slice(0, 30)}...
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5 group-hover:text-primary-600 transition-colors">
                                                    <User size={12} className="opacity-50" />
                                                    Actor: {log.user_name}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} className="opacity-50" />
                                                    {format(parseISO(log.timestamp), 'MMM d, yyyy • HH:mm:ss')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                SUCCESS
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-1 sm:ml-[72px]">
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{log.details}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};


