import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Loader2, ArrowLeft, ShieldCheck,
    Calendar, Clock, Target, AlertCircle,
    UserCheck, Send
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';

const meetingSchema = z.object({
    staffId: z.string().min(3, 'Valid Faculty ID is required'),
    date: z.string().min(1, 'Meeting date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    justification: z.string().min(20, 'Please provide a detailed justification (min 20 chars)'),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

export const FacultyMeeting: React.FC = () => {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<MeetingFormData>({
        resolver: zodResolver(meetingSchema)
    });

    const onSubmit = async (data: MeetingFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await bookingService.create({
                staff_id: data.staffId,
                booking_date: data.date,
                start_time: `${data.startTime}:00`,
                end_time: `${data.endTime}:00`,
                booking_type: 'MEETING',
                justification: data.justification
            });
            setSuccess(true);
            reset();
            setTimeout(() => navigate(`/dashboard/${role}/bookings`), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to dispatch meeting request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
                <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10">
                    <UserCheck size={48} />
                </div>
                <h2 className="text-3xl font-black text-college-navy italic mb-4">Request Dispatched!</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                    Your meeting request has been securely sent to the respective faculty. Redirecting to your schedule...
                </p>
                <div className="mt-8 h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-progress" style={{ width: '100%' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-6 px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-college-navy hover:shadow-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Faculty Consultation</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Direct bridge for scholarly collaboration and guidance.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="rounded-[3rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {error && (
                                <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100 flex items-center gap-3 text-xs font-bold text-rose-700 uppercase tracking-widest">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Institutional Faculty ID</label>
                                <div className="relative">
                                    <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        {...register('staffId')}
                                        className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4.5 pl-14 pr-5 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner"
                                        placeholder="e.g. EMP-2024-001"
                                    />
                                </div>
                                {errors.staffId && <p className="text-[10px] font-bold text-rose-600 px-2 mt-1">{errors.staffId.message}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Proposed Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="date"
                                            {...register('date')}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 pl-12 pr-4 text-sm font-bold text-college-navy focus:border-primary-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Commences</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="time"
                                            {...register('startTime')}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 pl-12 pr-4 text-sm font-bold text-college-navy focus:border-primary-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Concluding</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="time"
                                            {...register('endTime')}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 pl-12 pr-4 text-sm font-bold text-college-navy focus:border-primary-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Consultation Objective</label>
                                <textarea
                                    rows={4}
                                    {...register('justification')}
                                    className="block w-full rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 py-5 px-6 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner resize-none"
                                    placeholder="Briefly explain the purpose of this meeting request..."
                                />
                                {errors.justification && <p className="text-[10px] font-bold text-rose-600 px-2 mt-1">{errors.justification.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-premium flex w-full items-center justify-center gap-3 py-5 shadow-xl shadow-college-navy/10"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Dispatch Meeting Request
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2.5rem] bg-college-navy p-8 text-white shadow-xl shadow-college-navy/20 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-white/5 rounded-full blur-2xl" />
                        <h3 className="text-lg font-black italic tracking-tight mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-college-gold" size={20} />
                            Protocol Rules
                        </h3>
                        <div className="space-y-4">
                            {[
                                'Direct peer-to-staff synchronization.',
                                'Requires valid Employee ID.',
                                'Subject to faculty availability.',
                                'Auto-dispatched via secure link.'
                            ].map((text, i) => (
                                <div key={i} className="flex gap-3 text-xs font-bold text-slate-300">
                                    <div className="h-1.5 w-1.5 rounded-full bg-college-gold mt-1.5 shrink-0" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8">
                        <h3 className="text-sm font-black text-college-navy uppercase tracking-widest mb-4">Support</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Can't find the Staff ID? Check the departmental directory or contact your HOD.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
