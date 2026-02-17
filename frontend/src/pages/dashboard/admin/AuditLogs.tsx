import React from 'react';
import { FileText, Clock, User, Filter } from 'lucide-react';

export const AuditLogs: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
                <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-slate-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i} className="p-4 hover:bg-slate-50 sm:p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                            <FileText size={20} />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-900">
                                            Booking Approved <span className="text-slate-400">#REQ-2024-{100 + i}</span>
                                        </p>
                                        <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                Admin User
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                Oct {28 - i}, 10:3{i} AM
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                            INFO
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
