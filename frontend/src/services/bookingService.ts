import api from '../lib/axios';
import type { Resource } from './resourceService';

export interface Booking {
    id: string;
    resourceId: string;
    userId: string;
    startTime: string; // ISO String
    endTime: string;
    status: 'pending' | 'approved' | 'rejected';
    purpose: string;
    resource?: Resource; // Joined details
}

export interface BookingRequest {
    resourceId: string;
    startTime: string;
    endTime: string;
    purpose: string;
}

export const bookingService = {
    create: async (data: BookingRequest): Promise<Booking> => {
        return (await api.post<Booking>('/bookings/', data)).data;
    },

    getMyBookings: async (): Promise<Booking[]> => {
        return (await api.get<Booking[]>('/bookings/my/')).data;
    },

    checkAvailability: async (resourceId: string, date: string): Promise<{ start: string, end: string }[]> => {
        return (await api.get<{ start: string, end: string }[]>(`/bookings/availability/?resourceId=${resourceId}&date=${date}`)).data;
    }
};
