import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Calendar, ArrowRight, Settings, LayoutDashboard, Shield, ArrowUpRight, Loader2 } from 'lucide-react';
import { ApprovalPanel } from '../approvals/ApprovalPanel';
import { MeetingScheduler } from './MeetingScheduler';
import { userService } from '../../../services/userService';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'scheduler'>('overview');
    const [stats, setStats] = useState({
        total_users: 0,
        active_bookings: 0,
        pending_approvals: 0,
        total_resources: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await userService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        { label: 'Total Scholars', val: stats.total_users.toLocaleString(), icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Active Sessions', val: stats.active_bookings.toLocaleString(), icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Clearances', val: stats.pending_approvals.toLocaleString(), icon: ShieldCheck, color: 'text-college-gold', bg: 'bg-primary-50' },
        { label: 'Total Assets', val: stats.total_resources.toLocaleString(), icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header: Institutional Metadata */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-4xl font-black text-college-navy tracking-tighter italic">
                        SYSTEM<span className="text-primary-600">ORCHESTRATOR</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic mt-1">Institutional Administration & Security Hub</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                        <Settings size={20} />
                    </button>
                    <div className="flex h-12 px-6 items-center gap-3 rounded-2xl bg-college-navy text-white shadow-xl shadow-college-navy/20">
                        <ShieldCheck size={18} className="text-college-gold" />
                        <span className="text-xs font-black uppercase tracking-widest">HOD Level Access</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 sm:gap-4 border-b border-slate-100 pb-px px-2 overflow-x-auto no-scrollbar">
                {[
                    { id: 'overview', label: 'Overview', fullLabel: 'System Overview', icon: LayoutDashboard },
                    { id: 'approvals', label: 'Security', fullLabel: 'Security Clearances', icon: ShieldCheck },
                    { id: 'scheduler', label: 'Orchestration', fullLabel: 'Meeting Orchestration', icon: Calendar },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-primary-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.fullLabel}</span>
                        <span className="sm:hidden">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Analytics Grid */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="rounded-[2rem] border border-slate-50 bg-white p-8 flex items-center justify-center min-h-[160px]">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
                                </div>
                            ))
                        ) : (
                            statItems.map((stat, i) => (
                                <div key={i} className="group relative rounded-3xl sm:rounded-[2rem] border border-slate-50 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-2xl hover:shadow-primary-500/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`rounded-2xl ${stat.bg} p-3 sm:p-4 ${stat.color} transition-transform group-hover:scale-110`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <ArrowRight size={16} className="text-slate-200 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-college-navy tracking-tight">{stat.val}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-xl sm:text-2xl font-black text-college-navy italic leading-none">System Operational Pulse</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">Live Telemetry</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-sm font-bold text-college-navy">API Gateway Status: Operational</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600">99.9% Uptime</span>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-sm font-bold text-college-navy">Institutional DB Sync: Synchronized</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600">Locked</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm h-fit">
                            <h2 className="text-lg sm:text-xl font-bold text-college-navy mb-6 sm:mb-8 italic">Administrative Tools</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'User Access Control', desc: 'Manage roles & permissions', icon: Shield, link: '/dashboard/admin/users' },
                                    { title: 'Asset Inventory', desc: 'Resource orchestration', icon: Settings, link: '/dashboard/admin/resources' },
                                    { title: 'Security Audits', desc: 'Immutable log stream', icon: ShieldCheck, link: '/dashboard/admin/audit' },
                                ].map((tool, i) => (
                                    <a key={i} href={tool.link} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <tool.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-bold text-college-navy">{tool.title}</div>
                                                <div className="text-[9px] sm:text-[10px] font-medium text-slate-400">{tool.desc}</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'approvals' && (
                <section className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm min-h-[400px]">
                    <ApprovalPanel />
                </section>
            )}

            {activeTab === 'scheduler' && (
                <div className="max-w-4xl mx-auto px-1 sm:px-2">
                    <MeetingScheduler />
                </div>
            )}
        </div>
    );
};

