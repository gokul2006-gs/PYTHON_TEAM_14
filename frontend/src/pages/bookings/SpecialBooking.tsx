import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { bookingService } from '../../services/bookingService';

const specialBookingSchema = z.object({
    eventType: z.string().min(3, 'Event type is required'),
    attendees: z.number().min(1, 'Number of attendees is required'),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    justification: z.string().min(20, 'Please provide a detailed justification (min 20 chars)'),
});

type SpecialBookingFormData = z.infer<typeof specialBookingSchema>;

export const SpecialBooking: React.FC = () => {
    const { id, role } = useParams<{ id: string; role: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<SpecialBookingFormData>({
        resolver: zodResolver(specialBookingSchema)
    });

    const onSubmit = async (data: SpecialBookingFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await bookingService.create({
                resource: parseInt(id),
                booking_date: data.date,
                start_time: `${data.startTime}:00`,
                end_time: `${data.endTime}:00`,
                booking_type: 'SPECIAL',
                justification: `[EVENT: ${data.eventType}] ${data.justification} (Attendees: ${data.attendees})`
            });
            navigate(`/dashboard/${role}/resources/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit special request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-6 px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-college-navy hover:shadow-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Priority Protocol</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Special resource allocation for institutional events.</p>
                </div>
            </div>

            <div className="rounded-[2.5rem] border border-amber-100 bg-amber-50/50 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldAlert size={120} className="text-amber-600" />
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-amber-900 uppercase tracking-widest text-xs mb-1">Authorization Guard</h3>
                        <p className="text-sm font-medium text-amber-800 leading-relaxed italic">
                            Priority requests bypass standard algorithmic constraints but require formal validation from the administrative oversight committee.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[3rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {error && (
                        <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100 text-xs font-bold text-rose-700 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-8 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Session Nature</label>
                            <input
                                type="text"
                                {...register('eventType')}
                                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 px-5 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner"
                                placeholder="e.g. Research Symposium"
                            />
                            {errors.eventType && <p className="text-[10px] font-bold text-rose-600 px-2 uppercase tracking-wide">{errors.eventType.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Headcount Proj.</label>
                            <input
                                type="number"
                                {...register('attendees', { valueAsNumber: true })}
                                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 px-5 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner"
                                placeholder="50"
                            />
                            {errors.attendees && <p className="text-[10px] font-bold text-rose-600 px-2 uppercase tracking-wide">{errors.attendees.message}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Date</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 px-4 text-sm font-bold text-college-navy focus:border-primary-500 focus:bg-white outline-none transition-all"
                            />
                            {errors.date && <p className="text-[10px] font-bold text-rose-600 px-2 italic">{errors.date.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Synchronize (In)</label>
                            <input
                                type="time"
                                {...register('startTime')}
                                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 px-4 text-sm font-bold text-college-navy focus:border-primary-500 focus:bg-white outline-none transition-all"
                            />
                            {errors.startTime && <p className="text-[10px] font-bold text-rose-600 px-2 italic">{errors.startTime.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Synchronize (Out)</label>
                            <input
                                type="time"
                                {...register('endTime')}
                                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/30 py-4 px-4 text-sm font-bold text-college-navy focus:border-primary-500 focus:bg-white outline-none transition-all"
                            />
                            {errors.endTime && <p className="text-[10px] font-bold text-rose-600 px-2 italic">{errors.endTime.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Case Justification</label>
                        <textarea
                            rows={5}
                            {...register('justification')}
                            className="block w-full rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 py-5 px-6 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner resize-none"
                            placeholder="Provide exhaustive reasoning for priority resource bypass..."
                        />
                        {errors.justification && <p className="text-[10px] font-bold text-rose-600 px-2 uppercase tracking-wide">{errors.justification.message}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Abort Request
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-premium flex items-center justify-center gap-2 px-10 py-4 shadow-xl shadow-college-navy/20"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Initialize Priority Protocol
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
