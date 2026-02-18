import React, { useState, useEffect } from 'react';
import { UserCircle2, BookOpen, Clock, CalendarCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { approvalService } from '../../../services/approvalService';
import { ApprovalPanel } from '../approvals/ApprovalPanel';

export const FacultyDashboard: React.FC = () => {
    const { user } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await approvalService.getPendingRequests();
                setPendingCount(data.length);
            } catch (error) {
                console.error('Failed to fetch faculty stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Faculty Welcome Section */}
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-college-navy p-6 sm:p-10 text-white shadow-2xl transition-all">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-primary-500/10 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                        <div className="relative">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-college-gold border border-white/20">
                                <UserCircle2 size={40} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-emerald-500 border-4 border-college-navy flex items-center justify-center">
                                <ShieldCheck size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase">
                                Welcome, <span className="text-primary-400">{user?.name}</span>
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest italic flex items-center justify-center sm:justify-start gap-2">
                                <BookOpen size={14} className="text-college-gold" />
                                Senior Academic Faculty • Computer Science
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                {[
                    { label: 'Pending Validations', val: pendingCount, icon: Clock, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Academic Sessions', val: '8', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Research Slots', val: '4', icon: ShieldCheck, color: 'text-college-gold', bg: 'bg-primary-50' },
                ].map((stat, i) => (
                    <div key={i} className="group relative rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className={`rounded-xl sm:rounded-2xl ${stat.bg} p-3 sm:p-4 ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-3xl sm:text-4xl font-black text-college-navy">{stat.val}</span>
                        </div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Operational Center: Approvals */}
            <section className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-college-navy italic leading-none">Access Protocol Center</h2>
                        <p className="text-slate-500 font-medium italic mt-2 text-sm">Review and authorize institutional resource requests.</p>
                    </div>
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <ShieldCheck size={24} />
                    </div>
                </div>

                <ApprovalPanel />
            </section>
        </div>
    );
};
