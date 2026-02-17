import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-green-50 p-3 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Approved This Week</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Pending Student Requests</h2>
                </div>
                <div className="p-6 text-center text-slate-500">
                    No pending requests.
                </div>
            </div>
        </div>
    );
};
