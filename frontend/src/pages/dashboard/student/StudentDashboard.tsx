import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, ArrowRight, Zap, Target, BookOpen, Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/userService';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        upcoming: 0,
        pending: 0,
        completed: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await userService.getStudentStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch student stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const statItems = [
        { label: 'Waitlisted', val: stats.pending.toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Upcoming', val: stats.upcoming.toString(), icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Completed', val: stats.completed.toString(), icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header / Welcome Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 text-2xl sm:text-3xl font-black border-4 border-white shadow-xl">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-college-navy tracking-tight">{getGreeting()}, {user?.name}!</h1>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">Ready to manage your campus resources for today?</p>
                    </div>
                </div>
                <div className="flex flex-wrap w-full md:w-auto gap-4">
                    <Link
                        to="/dashboard/student/resources"
                        className="btn-premium flex flex-1 sm:flex-none items-center justify-center gap-2 py-3 px-6 shadow-xl shadow-primary-500/20"
                    >
                        <Plus size={20} />
                        New Booking
                    </Link>
                    <Link
                        to="/dashboard/student/faculty-meeting"
                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl bg-white border-2 border-slate-100 py-3 px-6 text-sm font-bold text-college-navy hover:bg-slate-50 transition-all"
                    >
                        <Users size={20} />
                        Faculty Meeting
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="rounded-[2rem] border border-slate-50 bg-white p-8 flex items-center justify-center min-h-[140px]">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
                        </div>
                    ))
                ) : (
                    statItems.map((stat, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl">
                            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${stat.bg} transition-transform group-hover:scale-150 opacity-20`} />
                            <div className="relative flex items-center gap-4">
                                <div className={`rounded-2xl ${stat.bg} p-4 ${stat.color}`}>
                                    <stat.icon size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-college-navy">{stat.val}</h3>
                                </div>
                            </div>
                            <Link to="/dashboard/student/bookings" className={`relative mt-6 flex items-center text-xs font-bold ${stat.color} hover:underline`}>
                                View Details <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </div>
                    ))
                )}
            </div>

            {/* Recommendations Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <Target className="text-primary-600" />
                            <h2 className="text-xl font-bold text-college-navy">Smart Recommendations</h2>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">AI Powered</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'IoT Research Lab', dept: 'Computer Science', space: 'High Availability' },
                            { title: 'Main Conference Hall', dept: 'Administration', space: 'Limited Slots' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-hover hover:border-primary-200 hover:bg-white gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-college-navy">{item.title}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.dept}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full w-fit">
                                    {item.space}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-college-navy">System Announcements</h2>
                    </div>
                    <div className="p-6 sm:p-8 text-center rounded-[1.5rem] bg-indigo-50 border border-indigo-100">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-md">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-college-navy mb-2">New Lab Equipment</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                            Three new 3D Printers are now available in the Mechanical Engineering Wing. Book your slots now!
                        </p>
                        <button className="text-xs sm:text-sm font-black text-primary-600 hover:underline px-4 py-2 hover:bg-white rounded-xl transition-all">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

