import React from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({
    children,
    title,
    subtitle
}) => {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side: Brand/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-college-navy items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-college-gold rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 p-12 text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-college-navy shadow-2xl">
                        <GraduationCap size={48} />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">
                        CAMPUS<span className="text-college-gold">CORE</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-sm mx-auto italic">
                        The definitive hub for academic excellence and resource orchestration.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">4.8k+</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Scholars</span>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">320+</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Institutions</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <span>© 2026 Institutional Systems</span>
                    <span className="flex items-center gap-2">
                        <ShieldCheck size={12} />
                        Military Grade Logic
                    </span>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 xl:px-32">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="lg:hidden text-center mb-12">
                        <h1 className="text-3xl font-black text-college-navy tracking-tighter italic">
                            CAMPUS<span className="text-college-gold">CORE</span>
                        </h1>
                    </div>

                    <h2 className="text-4xl font-black tracking-tight text-college-navy italic">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-lg font-medium text-slate-500 italic">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white">
                        {children}
                    </div>

                    <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span>Trusted by leading universities</span>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>
                </div>
            </div>
        </div>
    );
};
