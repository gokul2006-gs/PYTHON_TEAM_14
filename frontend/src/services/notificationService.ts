import api from '../lib/axios';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    timestamp: string;
}

export const notificationService = {
    getAll: async (): Promise<Notification[]> => {
        return (await api.get<Notification[]>('/notifications/')).data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.post(`/notifications/${id}/read/`);
    }
};
