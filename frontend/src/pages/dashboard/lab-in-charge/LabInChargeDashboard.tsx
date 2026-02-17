import React from 'react';
import { Settings, AlertTriangle } from 'lucide-react';

export const LabInChargeDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Lab In-Charge Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Resources</p>
                            <h3 className="text-2xl font-bold text-slate-900">12</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Maintenance Needed</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lab Schedule View Placeholder */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Today's Lab Schedule</h2>
                </div>
                <div className="p-6 text-center text-slate-500">
                    No bookings for today.
                </div>
            </div>
        </div>
    );
};
