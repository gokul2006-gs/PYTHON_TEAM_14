import React from 'react';
import { CalendarCheck, ShieldCheck, GraduationCap, Building2, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay?: string }> = ({ icon, title, description, delay = '0' }) => (
    <div
        className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/40 p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-2xl hover:shadow-college-navy/10 animate-fade-in-up"
        style={{ animationDelay: delay }}
    >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-50/50 blur-3xl transition-colors group-hover:bg-primary-100/50" />
        <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-primary-100/50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            {icon}
        </div>
        <h3 className="relative mb-4 text-2xl font-bold text-college-navy">{title}</h3>
        <p className="relative text-slate-600 leading-relaxed">{description}</p>
    </div>
);

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center">
        <div className="text-4xl font-black text-college-navy mb-1">{value}</div>
        <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">{label}</div>
    </div>
);

export const LandingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-slate-50">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary-200/20 blur-[120px] animate-float" />
                <div className="absolute top-[40%] -right-[5%] h-[400px] w-[400px] rounded-full bg-college-gold/10 blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute -bottom-[5%] left-[20%] h-[300px] w-[300px] rounded-full bg-primary-300/20 blur-[80px] animate-float" style={{ animationDelay: '-1.5s' }} />
            </div>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-college-gold/30 bg-college-gold/5 px-4 py-2 text-sm font-bold text-college-gold mb-8 animate-fade-in-up">
                            <GraduationCap className="h-4 w-4" />
                            Official Campus Resource Portal
                        </div>

                        <h1 className="mb-8 max-w-5xl text-5xl font-black tracking-tight text-college-navy sm:text-6xl lg:text-8xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Modernizing <span className="premium-gradient-text">Academic Excellence</span>
                        </h1>

                        <p className="mb-12 max-w-3xl text-xl text-slate-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            The unified ecosystem for students and faculty to orchestrate labs, venues, and research equipment with unprecedented ease and security.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <Link to="/login" className="btn-premium flex items-center gap-2">
                                Access Portal <Building2 className="h-5 w-5" />
                            </Link>
                            <Link to="/signup" className="btn-premium-outline">
                                Join Organization
                            </Link>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-24 grid w-full max-w-4xl grid-cols-2 gap-12 border-t border-slate-200 pt-16 md:grid-cols-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <StatCard value="250+" label="Resources" />
                            <StatCard value="5k+" label="Monthly Bookings" />
                            <StatCard value="12" label="Departments" />
                            <StatCard value="100%" label="Security" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative bg-white/50 py-32 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="mb-20 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-college-navy">Smart Infrastructure</h2>
                        <p className="mx-auto max-w-2xl text-lg text-slate-600">
                            Our platform provides the heavy lifting, so you can focus on innovation and research.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <FeatureCard
                            delay="0.1s"
                            icon={<ShieldCheck className="h-8 w-8 text-primary-600" />}
                            title="Enterprise Security"
                            description="Military-grade role-based access control protecting your institution's vital assets."
                        />
                        <FeatureCard
                            delay="0.2s"
                            icon={<CalendarCheck className="h-8 w-8 text-primary-600" />}
                            title="Dynamic Booking"
                            description="Intelligent conflict resolution and live availability updates for all campus venues."
                        />
                        <FeatureCard
                            delay="0.3s"
                            icon={<BookOpen className="h-8 w-8 text-primary-600" />}
                            title="Research First"
                            description="Dedicated workflows for lab equipment and specialized research facilities."
                        />
                        <FeatureCard
                            delay="0.4s"
                            icon={<Award className="h-8 w-8 text-primary-600" />}
                            title="Quality Assurance"
                            description="Comprehensive audit logs and performance tracking for all organizational resources."
                        />
                    </div>
                </div>
            </section>

            {/* Footer handled by PublicLayout */}
        </div>
    );
};
