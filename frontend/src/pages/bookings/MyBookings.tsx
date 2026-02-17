import React, { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../services/bookingService';
import { Loader2, Calendar, Clock, MapPin, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch bookings for the current user
        // For now, let's mock some data if the service returns empty
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getMyBookings();
                if (data.length === 0) {
                    // Mock data for demo
                    setBookings([
                        {
                            id: '1', resourceId: '1', userId: 'me',
                            startTime: '2023-10-25T10:00:00', endTime: '2023-10-25T12:00:00',
                            status: 'approved', purpose: 'Project Work',
                            resource: { id: '1', name: 'Computer Lab 1', location: 'Block A', type: 'lab', capacity: 30, status: 'active' }
                        },
                        {
                            id: '2', resourceId: '2', userId: 'me',
                            startTime: '2023-10-26T14:00:00', endTime: '2023-10-26T15:00:00',
                            status: 'pending', purpose: 'Thesis Research',
                            resource: { id: '2', name: 'Physics Lab', location: 'Block B', type: 'lab', capacity: 40, status: 'active' }
                        }
                    ]);
                } else {
                    setBookings(data);
                }
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {bookings.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-slate-900">{booking.resource?.name || 'Unknown Resource'}</h3>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {format(parseISO(booking.startTime), 'MMM d, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {booking.resource?.location}
                                        </div>
                                    </div>

                                    <p className="mt-2 text-sm text-slate-600">
                                        <span className="font-medium">Purpose: </span>
                                        {booking.purpose}
                                    </p>
                                </div>

                                {booking.status === 'pending' && (
                                    <button className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                                        <XCircle size={16} />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        You don't have any bookings yet.
                    </div>
                )}
            </div>
        </div>
    );
};
