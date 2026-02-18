import React, { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../services/bookingService';
import { Loader2, Calendar, Clock, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getMyBookings();
                // Filter out any potential mock data if needed, but since we are moving towards 
                // real backend integration, let's just use the returned data.
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusStyles = (status: Booking['status']) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
        }
    };

    if (isLoading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Resource Timeline</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Track your institutional resource utilization history.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl hover:border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-xl font-bold text-college-navy italic">{booking.resource_name}</h3>
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                            <Calendar size={16} className="text-primary-500" />
                                            {format(parseISO(booking.booking_date), 'EEEE, MMM d, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                            <Clock size={16} className="text-primary-500" />
                                            {booking.start_time.substring(0, 5)} — {booking.end_time.substring(0, 5)}
                                        </div>
                                    </div>

                                    {booking.justification && (
                                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 italic text-slate-600 text-sm">
                                            <span className="font-black text-slate-400 uppercase tracking-widest text-[10px] block mb-1">Session Objective</span>
                                            "{booking.justification}"
                                        </div>
                                    )}

                                    {booking.remarks && (
                                        <div className="mt-2 text-sm text-amber-600 font-medium italic">
                                            <span className="font-bold uppercase tracking-widest text-[10px] opacity-70">Authority Remarks: </span>
                                            {booking.remarks}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {booking.status === 'PENDING' && (
                                        <button className="flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 active:scale-95">
                                            <XCircle size={16} />
                                            Cancel Request
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 py-32 bg-white/50 backdrop-blur-sm px-6 text-center">
                        <div className="h-20 w-20 rounded-[2rem] bg-slate-100 text-slate-400 flex items-center justify-center mb-6">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-college-navy italic">No Active Records</h3>
                        <p className="text-slate-500 font-medium max-w-sm">You haven't initiated any resource requests yet. Head over to the catalog to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
