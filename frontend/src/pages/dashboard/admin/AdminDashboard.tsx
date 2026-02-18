import React, { useState } from 'react';
import { ShieldCheck, Users, Calendar, AlertTriangle, ArrowRight, Settings, LayoutDashboard, Bell, Shield, ArrowUpRight } from 'lucide-react';
import { ApprovalPanel } from '../approvals/ApprovalPanel';
import { MeetingScheduler } from './MeetingScheduler';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'scheduler'>('overview');

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
                        {[
                            { label: 'Total Scholars', val: '1,248', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
                            { label: 'Active Sessions', val: '14', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Pending Clearances', val: '5', icon: ShieldCheck, color: 'text-college-gold', bg: 'bg-primary-50' },
                            { label: 'System Conflicts', val: '0', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
                        ].map((stat, i) => (
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
                        ))}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Operational Logs Placeholder */}
                            <div className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-xl sm:text-2xl font-black text-college-navy italic leading-none">System Audit Logs</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 cursor-pointer hover:underline">Export Report</span>
                                </div>
                                <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-slate-300">
                                    <ShieldCheck size={48} className="opacity-20 mb-4" />
                                    <p className="font-bold italic text-xs sm:text-sm text-center px-4">No protocol violations or critical logs recorded in the current epoch.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm h-fit">
                            <h2 className="text-lg sm:text-xl font-bold text-college-navy mb-6 sm:mb-8 italic">Administrative Tools</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'User Access Control', desc: 'Manage roles & permissions', icon: Shield },
                                    { title: 'System Configuration', desc: 'Portal & API settings', icon: Settings },
                                    { title: 'Notification Center', desc: 'Broadcast announcements', icon: Bell },
                                ].map((tool, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all cursor-pointer group">
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
                                    </div>
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
