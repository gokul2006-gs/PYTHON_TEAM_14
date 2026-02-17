import React from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
                <Link
                    to="/dashboard/student/book"
                    className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Booking
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Stat Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Upcoming Bookings</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>

                {/* Quick Stat Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                </div>
                <div className="p-6 text-center text-slate-500">
                    No recent activity found.
                </div>
            </div>
        </div>
    );
};
