import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({
    children,
    title,
    subtitle
}) => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link to="/" className="mx-auto flex h-12 w-auto items-center justify-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            Campus<span className="text-indigo-600">Resource</span>
                        </span>
                    </Link>
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-center text-sm text-slate-600">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                        {children}
                    </div>

                    <p className="mt-10 text-center text-xs text-slate-500">
                        Secure Institutional System • All actions are monitored
                    </p>
                </div>
            </div>
        </div>
    );
};
