import React, { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../../services/bookingService';
import {
    Loader2, Calendar, Clock, User, Filter,
    Search, AlertCircle,
    ArrowRight, MapPin, Eraser, Shield
} from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';

export const AllBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState<Booking['status'] | 'ALL'>('ALL');
    const [filterType, setFilterType] = useState<Booking['booking_type'] | 'ALL'>('ALL');

    const fetchAllBookings = async () => {
        setIsLoading(true);
        try {
            const data = await bookingService.getMyBookings(); // For ADMIN, this returns all
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch master booking record:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterDate('');
        setFilterStatus('ALL');
        setFilterType('ALL');
    };

    const filteredBookings = bookings.filter(b => {
        // Search Filter (User or Resource)
        const matchesSearch =
            b.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.resource_name.toLowerCase().includes(searchTerm.toLowerCase());

        // Date Filter
        const matchesDate = !filterDate || isSameDay(parseISO(b.booking_date), new Date(filterDate));

        // Status Filter
        const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;

        // Type Filter
        const matchesType = filterType === 'ALL' || b.booking_type === filterType;

        return matchesSearch && matchesDate && matchesStatus && matchesType;
    });

    const getStatusStyles = (status: Booking['status']) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic">Global Master Schedule</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Comprehensive oversight of all institutional resource allocations.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Eraser size={14} />
                        Reset Filters
                    </button>
                    <button
                        onClick={fetchAllBookings}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 border border-primary-100 shadow-sm hover:bg-primary-100 transition-all"
                    >
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Premium Multi-Filter Panel */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Search Records</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder="Search User or Resource..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Filter by Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Protocol Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending Review</option>
                            <option value="APPROVED">Approved Clearances</option>
                            <option value="REJECTED">Rejected Requests</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Access Level</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-college-navy focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            <option value="NORMAL">Normal Requests</option>
                            <option value="SPECIAL">Special Priority</option>
                            <option value="MEETING">Staff-Student Bridge</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Stream */}
            <div className="grid gap-6">
                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
                        <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Synchronizing Global Stream...</p>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="group relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-2xl hover:border-slate-100"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="space-y-6 flex-1">
                                    {/* Top Row: Resource & Status */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className={`
                                            h-12 w-12 rounded-2xl flex items-center justify-center text-primary-600
                                            ${booking.booking_type === 'SPECIAL' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50'}
                                        `}>
                                            {booking.booking_type === 'SPECIAL' ? <Shield size={22} /> : <MapPin size={22} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-college-navy italic leading-none">{booking.resource_name}</h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    Type: {booking.booking_type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Row: User & Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Requester</div>
                                                <div className="text-sm font-bold text-college-navy">{booking.user_name}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Date</div>
                                                <div className="text-sm font-bold text-college-navy">
                                                    {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interval</div>
                                                <div className="text-sm font-bold text-college-navy">
                                                    {booking.start_time.substring(0, 5)}—{booking.end_time.substring(0, 5)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Justification if exists */}
                                    {booking.justification && (
                                        <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100/50 italic text-slate-500 text-xs leading-relaxed">
                                            "{booking.justification}"
                                        </div>
                                    )}
                                </div>

                                {/* Right Side Actions */}
                                <div className="flex flex-row lg:flex-col gap-3 min-w-[140px]">
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 text-xs font-bold transition-all hover:bg-black hover:shadow-xl hover:shadow-slate-900/10 group">
                                        Details
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 py-32 bg-white/50 backdrop-blur-sm px-6 text-center">
                        <div className="h-24 w-24 rounded-[3rem] bg-slate-100 text-slate-300 flex items-center justify-center mb-6">
                            <AlertCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-college-navy italic">No Matching Sessions</h3>
                        <p className="text-slate-500 font-medium max-w-sm">No bookings found within the active systemic constraints. Try adjusting your filter parameters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
