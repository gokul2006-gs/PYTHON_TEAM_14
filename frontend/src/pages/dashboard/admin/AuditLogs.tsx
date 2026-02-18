import React, { useEffect, useState } from 'react';
import { FileText, Clock, User, Filter, Loader2, AlertCircle } from 'lucide-react';
import { auditService, type AuditLog } from '../../../services/auditService';

export const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Registry Surveillance</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Complete immutable record of all institutional resource operations.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm"
                >
                    <Filter size={14} />
                    Refresh Stream
                </button>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flow-root">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Decrypting Audit Stream...</p>
                        </div>
                    ) : error ? (
                        <div className="py-24 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
                            <p className="text-rose-600 font-bold">{error}</p>
                            <button onClick={fetchLogs} className="mt-4 text-sm font-black text-primary-600 uppercase hover:underline">Retry Connection</button>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-24 text-center">
                            <FileText className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">No entries recorded in current epoch.</p>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-slate-50">
                            {logs.map((log) => (
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
                                                    {new Date(log.timestamp).toLocaleString()}
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

