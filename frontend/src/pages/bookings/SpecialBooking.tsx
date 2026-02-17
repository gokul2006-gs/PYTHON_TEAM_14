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
            // We prepend [SPECIAL] to purpose or use a specific endpoint
            await bookingService.create({
                resourceId: id,
                startTime: `${data.date}T${data.startTime}:00`,
                endTime: `${data.date}T${data.endTime}:00`,
                purpose: `[SPECIAL: ${data.eventType}] ${data.justification} (Attendees: ${data.attendees})`
            });
            navigate(`/dashboard/${role}/resources/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit special request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full p-2 hover:bg-slate-100"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Special Booking Request</h1>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex gap-3">
                    <ShieldAlert className="h-6 w-6 shrink-0 text-yellow-600" />
                    <div>
                        <h3 className="font-semibold text-yellow-800">Admin Approval Required</h3>
                        <p className="text-sm text-yellow-700">
                            Special booking requests bypass standard slot limits but require strict administrative approval.
                            Please provide detailed justification.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Event Type</label>
                            <input
                                type="text"
                                {...register('eventType')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g. Workshop, Guest Lecture"
                            />
                            {errors.eventType && <p className="text-xs text-red-600">{errors.eventType.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Expected Attendees</label>
                            <input
                                type="number"
                                {...register('attendees', { valueAsNumber: true })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.attendees && <p className="text-xs text-red-600">{errors.attendees.message}</p>}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Date</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.date && <p className="text-xs text-red-600">{errors.date.message}</p>}
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Start Time</label>
                            <input
                                type="time"
                                {...register('startTime')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.startTime && <p className="text-xs text-red-600">{errors.startTime.message}</p>}
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">End Time</label>
                            <input
                                type="time"
                                {...register('endTime')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.endTime && <p className="text-xs text-red-600">{errors.endTime.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Justification</label>
                        <textarea
                            rows={5}
                            {...register('justification')}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Please explain why this booking is necessary and why it requires special consideration..."
                        />
                        {errors.justification && <p className="text-xs text-red-600">{errors.justification.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Special Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
