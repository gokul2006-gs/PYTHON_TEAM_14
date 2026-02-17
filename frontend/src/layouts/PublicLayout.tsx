import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Campus<span className="text-indigo-600">Resource</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Campus Resource Management System. All rights reserved.</p>
                    <p className="mt-2">Secure • Reliable • Institutional</p>
                </div>
            </footer>
        </div>
    );
};
