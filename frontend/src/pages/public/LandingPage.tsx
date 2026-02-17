import React from 'react';

import { CalendarCheck, ShieldCheck, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-lg">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
            {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

export const LandingPage: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Streamlining Campus Resources with <span className="text-indigo-600">Security & Precision</span>
                        </h1>
                        <p className="mb-10 text-lg text-slate-600 sm:text-xl">
                            The centralized platform for students, faculty, and administrators to manage labs, equipment, and venues efficiently. Secure, role-based, and always reliable.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Access Portal
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white opacity-70"></div>
            </section>

            {/* Features Grid */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                        <FeatureCard
                            icon={<ShieldCheck className="h-8 w-8 text-indigo-600" />}
                            title="Secure Access"
                            description="Role-based authentication ensures only authorized personnel access sensitive resources."
                        />
                        <FeatureCard
                            icon={<CalendarCheck className="h-8 w-8 text-indigo-600" />}
                            title="Smart Booking"
                            description="Real-time availability checks and conflict resolution for labs and equipment."
                        />
                        <FeatureCard
                            icon={<Users className="h-8 w-8 text-indigo-600" />}
                            title="Multi-Role Support"
                            description="Tailored dashboards for Students, Faculty, Lab In-Charges, and Administrators."
                        />
                        <FeatureCard
                            icon={<Clock className="h-8 w-8 text-indigo-600" />}
                            title="Instant Approvals"
                            description="Streamlined workflow for booking approvals and automated notifications."
                        />
                    </div>
                </div>
            </section>
        </>
    );
};
