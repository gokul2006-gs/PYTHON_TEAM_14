import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap, Shield } from 'lucide-react';

export const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Premium Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-college-navy text-white shadow-lg shadow-college-navy/20">
                            <GraduationCap size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black leading-none tracking-tight text-college-navy">
                                CAMPUS<span className="text-primary-600">CORE</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                Institutional Portal
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link
                            to="/login"
                            className="text-xs sm:text-sm font-bold text-slate-600 transition-colors hover:text-college-navy"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="btn-premium flex items-center gap-2 !py-2 sm:!py-2.5 !px-3 sm:!px-5 text-[10px] sm:text-sm"
                        >
                            <span className="hidden sm:inline">Join Organization</span>
                            <span className="sm:hidden">Join</span>
                            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Premium Footer */}
            <footer className="border-t border-slate-200 bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2 text-slate-400">
                            <GraduationCap className="h-5 w-5" />
                            <span className="text-sm font-semibold uppercase tracking-widest">CampusCore Systems</span>
                        </div>
                        <div className="text-center text-sm text-slate-500">
                            <p>© {new Date().getFullYear()} Modernize Education Initiative. All rights reserved.</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                            <span className="cursor-pointer hover:text-college-navy transition-colors">Privacy</span>
                            <span className="cursor-pointer hover:text-college-navy transition-colors">Terms</span>
                            <span className="cursor-pointer hover:text-college-navy transition-colors">Support</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
