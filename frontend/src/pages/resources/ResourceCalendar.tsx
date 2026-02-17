import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, startOfToday, parseISO, isSameDay } from 'date-fns';
import { resourceService, type Resource } from '../../services/resourceService';
import { bookingService } from '../../services/bookingService';
import { Loader2, ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation Schema for Booking
const bookingSchema = z.object({
    purpose: z.string().min(10, 'Purpose must be detailed (at least 10 chars)'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const ResourceCalendar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [resource, setResource] = useState<Resource | null>(null);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [availability, setAvailability] = useState<{ start: string; end: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema)
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [res, avail] = await Promise.all([
                    resourceService.getById(id),
                    bookingService.checkAvailability(id, format(selectedDate, 'yyyy-MM-dd'))
                ]);
                setResource(res);
                setAvailability(avail);
            } catch (error) {
                console.error('Failed to load resource data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, selectedDate]);

    const onSubmit = async (data: BookingFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        setMessage(null);
        try {
            await bookingService.create({
                resourceId: id,
                startTime: `${format(selectedDate, 'yyyy-MM-dd')}T${data.startTime}:00`,
                endTime: `${format(selectedDate, 'yyyy-MM-dd')}T${data.endTime}:00`,
                purpose: data.purpose
            });
            setMessage({ type: 'success', text: 'Booking request submitted successfully! Pending approval.' });
            reset();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit booking.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!resource) return <div>Resource not found</div>;

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Resource Info & Calendar */}
            <div className="space-y-6 lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">{resource.name}</h1>
                    <p className="text-slate-600">{resource.location} • Capacity: {resource.capacity}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                            className="rounded-full p-2 hover:bg-slate-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
                        <button
                            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                            className="rounded-full p-2 hover:bg-slate-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Availability Visualization (Simple List for MVP) */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-semibold text-slate-900">Occupied Slots</h3>
                    {availability.length > 0 ? (
                        <div className="space-y-2">
                            {availability.map((slot, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-md bg-red-50 p-3 text-red-700">
                                    <Clock size={16} />
                                    <span>{slot.start} - {slot.end}</span>
                                    <span className="ml-auto text-xs font-bold uppercase tracking-wider text-red-600">Booked</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-md bg-green-50 p-4 text-green-700">
                            All slots available for this day.
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-1">
                <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Book This Resource</h3>

                    {message && (
                        <div className={`mb-4 rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Start Time</label>
                            <input
                                type="time"
                                {...register('startTime')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.startTime && <p className="text-xs text-red-600">{errors.startTime.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">End Time</label>
                            <input
                                type="time"
                                {...register('endTime')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.endTime && <p className="text-xs text-red-600">{errors.endTime.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Purpose</label>
                            <textarea
                                rows={3}
                                {...register('purpose')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Class, Project work, Event..."
                            />
                            {errors.purpose && <p className="text-xs text-red-600">{errors.purpose.message}</p>}
                        </div>

                        <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700">
                            <div className="flex gap-2">
                                <Info size={16} className="shrink-0" />
                                <p>Requests are subject to approval. Admin has conflict override authority.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Request'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                        <p className="text-sm text-slate-500">Need to organize a seminar or special event?</p>
                        <button
                            // Use a relative path or construct it safely. 
                            // Example: /dashboard/student/resources/1/special
                            // We need the role.
                            onClick={() => {
                                const pathParts = window.location.pathname.split('/');
                                // pathParts = ['', 'dashboard', 'student', 'resources', '1']
                                const role = pathParts[2];
                                navigate(`/dashboard/${role}/resources/${id}/special`);
                            }}
                            className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Request Special Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
