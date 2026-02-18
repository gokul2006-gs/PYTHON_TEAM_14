import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { format, addDays, startOfToday } from 'date-fns';
import { resourceService, type Resource } from '../../services/resourceService';
import { bookingService } from '../../services/bookingService';
import { Loader2, ChevronLeft, ChevronRight, Clock, Info, ShieldCheck, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const bookingSchema = z.object({
    justification: z.string().min(10, 'Justification must be detailed (at least 10 chars)'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const ResourceCalendar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [resource, setResource] = useState<Resource | null>(null);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [availability, setAvailability] = useState<{ start_time: string; end_time: string }[]>([]);
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
                    bookingService.checkAvailability(parseInt(id), format(selectedDate, 'yyyy-MM-dd'))
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
        if (!id || !resource) return;
        setIsSubmitting(true);
        setMessage(null);
        try {
            const isMeeting = resource.type === 'MEETING_ROOM';
            await bookingService.create({
                resource: parseInt(id),
                booking_date: format(selectedDate, 'yyyy-MM-dd'),
                start_time: `${data.startTime}:00`,
                end_time: `${data.endTime}:00`,
                justification: data.justification,
                booking_type: isMeeting ? 'MEETING' : 'NORMAL'
            });
            setMessage({ type: 'success', text: 'Secure access request dispatched. Pending faculty review.' });
            reset();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.error || error.response?.data?.message || 'Authorization request failed.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;
    if (!resource) return <div className="p-20 text-center font-bold italic text-slate-400">Resource Protocol Error: Not Found</div>;

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Header: Resource Identity */}
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-college-navy p-6 sm:p-10 text-white shadow-2xl">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-college-gold border border-white/20 shadow-inner">
                            {resource?.type === 'LAB' ? <ShieldCheck size={32} /> : <MapPin size={32} />}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase">
                                {isLoading ? 'Acquiring Resource...' : resource?.name}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 overflow-hidden">
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary-300">
                                    <Info size={12} /> {resource?.type} Control
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                    <Users size={12} /> Max Capacity: {resource?.capacity || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
                {/* Left Side: Calendar Orchestrator */}
                <div className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm">
                    <div className="mb-6 sm:mb-8 flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-black text-college-navy italic leading-none">Date Selection</h2>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="p-2 sm:p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 sm:p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-7 gap-2 sm:gap-4">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = addDays(startOfToday(), i);
                            const isActive = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl py-3 sm:py-5 transition-all ${isActive ? 'bg-college-navy text-white shadow-xl shadow-college-navy/20 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                        }`}
                                >
                                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2">{format(date, 'EEE')}</span>
                                    <span className="text-base sm:text-xl font-black">{format(date, 'd')}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Live Availability Index</h3>
                        {availability.length === 0 ? (
                            <div className="rounded-2xl bg-emerald-50/50 p-4 sm:p-6 border border-emerald-100 flex items-center gap-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-emerald-700 italic">This slot is currently uncontested. Full availability granted.</p>
                            </div>
                        ) : (
                            availability.map((slot, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Clock size={16} className="text-rose-400" />
                                        <span className="text-xs sm:text-sm font-bold text-slate-600">{slot.start_time} - {slot.end_time}</span>
                                    </div>
                                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded-md">Occupied</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Side: Booking Form */}
                <div className="rounded-[2rem] sm:rounded-[3rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-college-navy italic leading-tight">Protocol Request</h2>
                                <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Submit your session justification</p>
                            </div>
                            <Link
                                to={`/dashboard/${user?.role.toLowerCase()}/special-booking/${id}`}
                                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-2 rounded-xl transition-all"
                            >
                                Special Request?
                            </Link>
                        </div>

                        {message && (
                            <div className={`mb-6 sm:mb-8 rounded-2xl p-4 text-[10px] sm:text-xs font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} className="text-rose-500" />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Start Phase</label>
                                    <input
                                        type="time"
                                        {...register('startTime')}
                                        className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-100 p-3 sm:p-4 text-sm font-bold focus:border-primary-500 focus:outline-none transition-all hover:border-slate-200"
                                    />
                                    {errors.startTime && <p className="text-[10px] font-bold text-rose-500 pl-2 italic">{errors.startTime.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">End Phase</label>
                                    <input
                                        type="time"
                                        {...register('endTime')}
                                        className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-100 p-3 sm:p-4 text-sm font-bold focus:border-primary-500 focus:outline-none transition-all hover:border-slate-200"
                                    />
                                    {errors.endTime && <p className="text-[10px] font-bold text-rose-500 pl-2 italic">{errors.endTime.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Session Justification</label>
                                <textarea
                                    {...register('justification')}
                                    rows={4}
                                    placeholder="Briefly state the academic or research objective for this session..."
                                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-100 p-3 sm:p-4 text-sm font-bold focus:border-primary-500 focus:outline-none transition-all hover:border-slate-200 resize-none"
                                />
                                {errors.justification && <p className="text-[10px] font-bold text-rose-500 pl-2 italic">{errors.justification.message}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-premium flex w-full items-center justify-center gap-3 py-4 sm:py-5 shadow-lg shadow-college-navy/20"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Submit Protocol
                                            <ShieldCheck size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlertTriangle = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
);
