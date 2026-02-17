import React from 'react';
import { Users, BookOpen, Shield, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>

            <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-slate-900">450</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Bookings</p>
                            <h3 className="text-2xl font-bold text-slate-900">24</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-red-50 p-3 text-red-600">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Conflicts</p>
                            <h3 className="text-2xl font-bold text-slate-900">1</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">System Status</p>
                            <h3 className="text-sm font-bold text-green-600">Operational</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Audit Logs</h2>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">User Login (admin@campus.edu)</span>
                                <span className="text-slate-400">2 mins ago</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Booking Approved (ID: 1024)</span>
                                <span className="text-slate-400">15 mins ago</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
