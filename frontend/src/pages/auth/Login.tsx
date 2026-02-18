import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { loginSchema, type LoginFormData } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader2, ArrowRight, UserCircle2, GraduationCap, ShieldCheck, Briefcase } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'STAFF' | 'LAB_INCHARGE' | 'ADMIN'>('STUDENT');

    const successMessage = location.state?.message;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(data);
            const user = { ...response.user, role: response.user.role.toLowerCase() as any };
            login(response.token, user);

            const role = user.role.toUpperCase();
            switch (role) {
                case 'STUDENT':
                    navigate('/dashboard/student');
                    break;
                case 'STAFF':
                    navigate('/dashboard/staff');
                    break;
                case 'LAB_INCHARGE':
                    navigate('/dashboard/lab-incharge');
                    break;
                case 'ADMIN':
                    navigate('/dashboard/admin');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Institutional Access"
            subtitle="Secure gateway to the CampusCore ecosystem."
        >
            {/* Role Switcher */}
            <div className="mb-8 grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { id: 'STUDENT', icon: GraduationCap },
                    { id: 'STAFF', icon: UserCircle2 },
                    { id: 'LAB_INCHARGE', icon: Briefcase },
                    { id: 'ADMIN', icon: ShieldCheck },
                ].map((role) => (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`flex flex-col items-center justify-center rounded-2xl border py-3.5 sm:py-4 transition-all ${selectedRole === role.id
                            ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-lg shadow-primary-500/10'
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                            }`}
                    >
                        <role.icon size={18} className="sm:w-5 sm:h-5" />
                        <span className="mt-1.5 text-[7px] sm:text-[9px] font-black uppercase tracking-tighter sm:tracking-widest">{role.id.replace('_', ' ')}</span>
                    </button>
                ))}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {successMessage && !error && (
                    <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        <p className="text-xs font-bold text-emerald-800">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                        <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
                        <div>
                            <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest">Access Denied</h3>
                            <p className="mt-1 text-xs font-medium text-red-700 leading-relaxed">{error}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Institutional Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="e.g. gokul@campus.edu"
                        className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all hover:bg-white"
                    />
                    {errors.email && <p className="mt-2 text-xs font-bold text-red-600 px-1">{errors.email.message}</p>}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Phrase</label>
                        <Link to="/forgot-password" title="Recover access" className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700">
                            Lost Key?
                        </Link>
                    </div>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all hover:bg-white"
                    />
                    {errors.password && <p className="mt-2 text-xs font-bold text-red-600 px-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-premium flex w-full items-center justify-center gap-2 py-4"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Authenticate Access
                            <ArrowRight size={18} className="ml-1" />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-10 text-center text-xs font-bold text-slate-400">
                New to the system?{' '}
                <Link to="/signup" className="text-primary-600 hover:underline underline-offset-4">
                    Initialize Enrollment
                </Link>
            </p>
        </AuthLayout>
    );
};
