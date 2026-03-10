import React, { useState, useEffect } from 'react';
import { bookingService, type Booking } from '../../../services/bookingService';
import { resourceService, type Resource } from '../../../services/resourceService';
import { Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

export const LabSchedule: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [myLabs, setMyLabs] = useState<Resource[]>([]);
    const [selectedLab, setSelectedLab] = useState<number | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [allBookings, allResources] = await Promise.all([
                bookingService.getMyBookings(),
                resourceService.getAll()
            ]);
            
            setBookings(allBookings);
            setMyLabs(allResources.filter((r: Resource) => r.type === 'LAB'));
            
        } catch (error) {
            console.error('Failed to fetch schedule', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

    const filteredBookings = bookings.filter((b: Booking) => {
        if (selectedLab !== 'all' && b.resource !== selectedLab) return false;
        return weekDays.some(day => isSameDay(parseISO(b.booking_date), day));
    });

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic leading-tight">Laboratory Schedule</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm">Monitor laboratory utilization and student sessions.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-black text-college-navy px-2 min-w-[140px] text-center italic">
                        {format(weekStart, 'MMM dd')} - {format(addDays(weekStart, 6), 'MMM dd')}
                    </span>
                    <button 
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        onClick={() => setSelectedLab('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            selectedLab === 'all' 
                            ? 'bg-college-navy text-white shadow-lg shadow-college-navy/20' 
                            : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                        }`}
                    >
                        All Facilities
                    </button>
                    {myLabs.map((lab: Resource) => (
                        <button
                            key={lab.id}
                            onClick={() => setSelectedLab(lab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                selectedLab === lab.id 
                                ? 'bg-college-navy text-white shadow-lg shadow-college-navy/20' 
                                : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                            }`}
                        >
                            {lab.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day, idx) => {
                    const dayBookings = filteredBookings.filter((b: Booking) => isSameDay(parseISO(b.booking_date), day));
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={idx} className="space-y-4">
                            <div className={`text-center p-3 rounded-2xl border transition-all ${
                                isToday ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-200' : 'bg-white text-slate-400 border-slate-100'
                            }`}>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em]">{format(day, 'EEE')}</div>
                                <div className="text-xl font-black italic">{format(day, 'dd')}</div>
                            </div>

                            <div className="space-y-3">
                                {dayBookings.length > 0 ? (
                                    dayBookings.map((booking: Booking) => (
                                        <div 
                                            key={booking.id}
                                            className={`p-3 rounded-2xl border-2 bg-white transition-all hover:scale-[1.03] shadow-sm ${
                                                booking.status === 'APPROVED' ? 'border-emerald-100' : 'border-slate-100'
                                            }`}
                                        >
                                            <div className="text-[10px] font-black text-college-navy truncate uppercase tracking-tight italic mb-1">
                                                {booking.user_name || 'Anonymous User'}
                                            </div>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 gap-1.5 mb-2">
                                                <Clock size={10} className="text-primary-500" />
                                                {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </div>
                                                {booking.booking_type === 'SPECIAL' && (
                                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" title="Special Event" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Free Slot</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
                </div>
            )}
        </div>
    );
};
