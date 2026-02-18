import React, { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../services/bookingService';
import { Loader2, Calendar, Clock, XCircle, Hourglass, CheckCircle2, History, Ban } from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';

type TabType = 'WAITING' | 'UPCOMING' | 'COMPLETED' | 'REJECTED';

export const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getMyBookings();
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const isBookingCompleted = (booking: Booking) => {
        if (booking.status !== 'APPROVED') return false;

        const now = new Date();
        const dateStr = booking.booking_date;
        const timeStr = booking.end_time;

        const bookingEnd = new Date(`${dateStr}T${timeStr}`);
        return isBefore(bookingEnd, now);
    };

    const isBookingUpcoming = (booking: Booking) => {
        if (booking.status !== 'APPROVED') return false;
        return !isBookingCompleted(booking);
    };

    const filteredBookings = bookings.filter(b => {
        switch (activeTab) {
            case 'WAITING': return b.status === 'PENDING';
            case 'UPCOMING': return isBookingUpcoming(b);
            case 'COMPLETED': return isBookingCompleted(b);
            case 'REJECTED': return b.status === 'REJECTED';
            default: return true;
        }
    });

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

    const tabs = [
        { id: 'WAITING', label: 'Waiting List', icon: Hourglass, count: bookings.filter(b => b.status === 'PENDING').length },
        { id: 'UPCOMING', label: 'Upcoming', icon: Calendar, count: bookings.filter(isBookingUpcoming).length },
        { id: 'COMPLETED', label: 'Completed', icon: CheckCircle2, count: bookings.filter(isBookingCompleted).length },
        { id: 'REJECTED', label: 'Rejected', icon: Ban, count: bookings.filter(b => b.status === 'REJECTED').length },
    ];

    const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || Calendar;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">My Bookings</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Manage and track your resource utilization.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/60 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`
                            flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all
                            ${activeTab === tab.id
                                ? 'bg-white text-primary-600 shadow-md border-b-2 border-primary-500'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        <span className={`
                            ml-1.5 px-2 py-0.5 rounded-full text-[10px] 
                            ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'bg-slate-200 text-slate-600'}
                        `}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid gap-6">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <div key={booking.id} className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl hover:border-slate-100">
                            {activeTab === 'COMPLETED' && (
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <History size={120} />
                                </div>
                            )}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="space-y-4 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-xl font-bold text-college-navy italic">{booking.resource_name}</h3>
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        {activeTab === 'COMPLETED' && (
                                            <span className="bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                                FINISHED
                                            </span>
                                        )}
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
                                    {activeTab === 'UPCOMING' && (
                                        <div className="flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                                            <div className="h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
                                            Confirmed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 py-32 bg-white/50 backdrop-blur-sm px-6 text-center">
                        <div className="h-20 w-20 rounded-[2rem] bg-slate-100 text-slate-400 flex items-center justify-center mb-6">
                            <ActiveIcon size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-college-navy italic">No Records Found</h3>
                        <p className="text-slate-500 font-medium max-w-sm">
                            {activeTab === 'WAITING' ? "You don't have any pending requests at the moment." :
                                activeTab === 'UPCOMING' ? "You don't have any upcoming scheduled sessions." :
                                    activeTab === 'COMPLETED' ? "No session history available yet." :
                                        "No rejected requests found."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

