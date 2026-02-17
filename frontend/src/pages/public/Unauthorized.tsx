import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PublicLayout } from '../../layouts/PublicLayout';

export const Unauthorized: React.FC = () => {
    return (
        <PublicLayout>
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600">
                    <ShieldAlert size={64} />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-slate-900">Access Denied</h1>
                <p className="mb-8 max-w-md text-slate-600">
                    You do not have permission to access this resource. If you believe this is an error, please contact the administrator.
                </p>
                <Link
                    to="/dashboard"
                    className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                    Return to Dashboard
                </Link>
            </div>
        </PublicLayout>
    );
};
