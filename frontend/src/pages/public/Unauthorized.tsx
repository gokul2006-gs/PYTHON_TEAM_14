import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="flex min-h-[70vh] flex-col items-center justify-center text-center py-12">
                <div className="mb-8 rounded-[2rem] bg-rose-50 p-8 text-rose-500 shadow-xl shadow-rose-500/10 animate-fade-in-up">
                    <ShieldAlert size={80} strokeWidth={1.5} />
                </div>
                <h1 className="mb-4 text-4xl font-black text-college-navy tracking-tight italic uppercase animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    Access Denied
                </h1>
                <p className="mb-10 max-w-md text-lg font-medium text-slate-500 italic leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Your current authorization level is insufficient to access this protocol. Please contact structural administration if you believe this is an error.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <Link
                        to="/login"
                        className="btn-premium flex items-center justify-center gap-2"
                    >
                        Authenticate Again
                    </Link>
                    <Link
                        to="/"
                        className="btn-premium-outline flex items-center justify-center"
                    >
                        Return to Portal
                    </Link>
                </div>
            </div>
        </div>
    );
};
