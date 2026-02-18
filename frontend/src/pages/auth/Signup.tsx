import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { signupSchema, type SignupFormData } from '../../utils/validation';
import { authService } from '../../services/authService';
import { AlertCircle, Loader2, ArrowRight, User, Mail, Phone, Lock, GraduationCap, Briefcase, UserCircle2, Cpu } from 'lucide-react';

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: 'STUDENT'
        }
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.register(data);
            navigate('/login', { state: { message: 'Enrollment successful. Please verify access.' } });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Enrollment failed. Please check network protocols.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="University Enrollment"
            subtitle="Initialize your institutional identity."
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                        <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
                        <div>
                            <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest">Protocol Error</h3>
                            <p className="mt-1 text-xs font-medium text-red-700 leading-relaxed">{error}</p>
                        </div>
                    </div>
                )}

                {/* Identity Cards */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Select Identity</label>
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-4">
                        {[
                            { id: 'STUDENT', label: 'Student', icon: GraduationCap },
                            { id: 'STAFF', label: 'Faculty', icon: UserCircle2 },
                            { id: 'LAB_INCHARGE', label: 'In-Charge', icon: Briefcase },
                        ].map((role) => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setValue('role', role.id as any)}
                                className={`flex flex-col items-center justify-center rounded-2xl border p-3 sm:p-4 transition-all ${selectedRole === role.id
                                    ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-lg shadow-primary-500/10'
                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                <role.icon size={20} className="sm:w-6 sm:h-6" />
                                <span className="mt-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{role.label}</span>
                            </button>
                        ))}
                    </div>
                    {errors.role && <p className="mt-2 text-xs font-bold text-red-600 px-1">{errors.role.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Legal Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                {...register('name')}
                                placeholder="Gokul"
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        {errors.name && <p className="text-xs font-bold text-red-600 px-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Stream</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="email"
                                {...register('email')}
                                placeholder="gokul@edu.in"
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        {errors.email && <p className="text-xs font-bold text-red-600 px-1">{errors.email.message}</p>}
                    </div>
                </div>

                {/* Role Specific Fields */}
                <div className="animate-fade-in-up space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Department / Branch</label>
                        <div className="relative">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                {...register('department')}
                                placeholder="Computer Science Engineering"
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {selectedRole === 'STUDENT' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Roll Number</label>
                            <div className="relative">
                                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    {...register('roll_number')}
                                    placeholder="21CS001"
                                    className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {(selectedRole === 'STAFF' || selectedRole === 'LAB_INCHARGE') && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                    {selectedRole === 'STAFF' ? 'Designation' : 'Employee ID'}
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        {...register(selectedRole === 'STAFF' ? 'designation' : 'employee_id')}
                                        placeholder={selectedRole === 'STAFF' ? 'Assistant Professor' : 'EMP123'}
                                        className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                    {selectedRole === 'STAFF' ? 'Lab Preference (Optional)' : 'Assigned Lab'}
                                </label>
                                <div className="relative">
                                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        placeholder={selectedRole === 'STAFF' ? 'Electronics Lab' : 'Computer Lab 01'}
                                        className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Institutional Contact</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="+91 1234567890"
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>
                    {errors.phone && <p className="text-xs font-bold text-red-600 px-1">{errors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">New Passkey</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="••••••••"
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        {errors.password && <p className="text-xs font-bold text-red-600 px-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirm Path</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                placeholder="••••••••"
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-xs font-bold text-red-600 px-1">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-premium flex w-full items-center justify-center gap-2 py-4 mt-4"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Complete Enrollment
                            <ArrowRight size={18} className="ml-1" />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-10 text-center text-xs font-bold text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-primary-600 hover:underline underline-offset-4">
                    Authenticate Account
                </Link>
            </p>
        </AuthLayout>
    );
};
