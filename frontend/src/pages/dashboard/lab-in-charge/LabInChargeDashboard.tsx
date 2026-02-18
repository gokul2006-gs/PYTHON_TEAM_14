import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Microscope, Activity, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { approvalService } from '../../../services/approvalService';
import { ApprovalPanel } from '../approvals/ApprovalPanel';

export const LabInChargeDashboard: React.FC = () => {
    const { user } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await approvalService.getPendingRequests();
                setPendingCount(data.length);
            } catch (error) {
                console.error('Failed to fetch lab stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header: Laboratory Authority Welcome */}
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-slate-900 p-6 sm:p-10 text-white shadow-2xl">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md text-emerald-400">
                        <Microscope size={48} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight italic">
                            Custodian, <span className="text-emerald-400">{user?.name}</span>
                        </h1>
                        <p className="mt-2 text-sm sm:text-lg font-medium text-slate-400 italic">
                            Chief Laboratory In-Charge • Technical Research Wing
                        </p>
                    </div>
                </div>
            </div>

            {/* Scientific Analytics */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                {[
                    { label: 'Awaiting Authorization', val: pendingCount, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Active Assets', val: '8', icon: Cpu, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Utilization Index', val: '94%', icon: Activity, color: 'text-college-gold', bg: 'bg-primary-50' },
                ].map((stat, i) => (
                    <div key={i} className="group relative rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className={`rounded-xl sm:rounded-2xl ${stat.bg} p-3 sm:p-4 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-3xl sm:text-4xl font-black text-college-navy">{stat.val}</span>
                        </div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Validation Panel: Approvals */}
            <section className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-college-navy italic leading-none">Security Validation</h2>
                        <p className="text-slate-500 font-medium italic mt-2 text-sm">Authorize or restrict access to laboratory specialized resources.</p>
                    </div>
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <ShieldCheck size={24} />
                    </div>
                </div>

                <ApprovalPanel />
            </section>
        </div>
    );
};
