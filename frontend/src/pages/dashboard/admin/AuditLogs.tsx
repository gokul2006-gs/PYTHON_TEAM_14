import React from 'react';
import { FileText, Clock, User, Filter } from 'lucide-react';

export const AuditLogs: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Registry Surveillance</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Complete immutable record of all institutional resource operations.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-all">
                    <Filter size={14} />
                    Refine Stream
                </button>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-slate-50">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <li key={i} className="p-6 transition-all hover:bg-slate-50/50 group">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <p className="text-sm font-black text-college-navy italic leading-snug">
                                                Booking Session Authorization <span className="opacity-40 font-bold ml-1 text-xs">#INT-{2024}-{100 + i * 7}</span>
                                            </p>
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                                REGISTRY_INFO
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 group-hover:text-primary-600 transition-colors">
                                                <User size={12} className="opacity-50" />
                                                Auth ID: ADM-293{i}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={12} className="opacity-50" />
                                                Timestamp: Oct {28 - i}, 10:3{i} AM
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                            SUCCESS
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
