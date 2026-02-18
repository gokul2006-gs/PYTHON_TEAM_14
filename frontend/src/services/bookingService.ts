import api from '../lib/axios';

export interface Booking {
    id: number;
    user: number;
    user_name: string;
    user_role: string;
    user_dept: string;
    user_id_ref: string;
    resource: number;
    resource_name: string;
    booking_date: string; // YYYY-MM-DD
    start_time: string; // HH:MM:SS
    end_time: string; // HH:MM:SS
    booking_type: 'NORMAL' | 'SPECIAL' | 'MEETING';
    justification?: string;
    remarks?: string;
    priority_level: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;
}

export interface BookingRequest {
    resource: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    booking_type?: 'NORMAL' | 'SPECIAL' | 'MEETING';
    justification?: string;
}

export const bookingService = {
    create: async (data: BookingRequest): Promise<Booking> => {
        return (await api.post<Booking>('/bookings/', data)).data;
    },

    getMyBookings: async (): Promise<Booking[]> => {
        return (await api.get<Booking[]>('/bookings/')).data; // The viewset filters by user automatically
    },

    checkAvailability: async (resourceId: number, date: string): Promise<{ start_time: string, end_time: string }[]> => {
        return (await api.get<{ start_time: string, end_time: string }[]>(`/bookings/availability/?resource=${resourceId}&date=${date}`)).data;
    }
};
