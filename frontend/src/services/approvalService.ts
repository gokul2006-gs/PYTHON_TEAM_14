import api from '../lib/axios';
import type { Booking } from './bookingService';

export const approvalService = {
    getPendingRequests: async (): Promise<Booking[]> => {
        const response = await api.get<Booking[]>('/bookings/');
        return response.data.filter(b => b.status === 'PENDING');
    },

    approve: async (id: number, remarks?: string): Promise<void> => {
        await api.post(`/bookings/${id}/approve/`, { remarks });
    },

    reject: async (id: number, remarks: string): Promise<void> => {
        await api.post(`/bookings/${id}/reject/`, { remarks });
    }
};
