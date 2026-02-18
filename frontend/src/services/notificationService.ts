import api from '../lib/axios';

export interface Notification {
    id: number;
    message: string;
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    getAll: async (): Promise<Notification[]> => {
        return (await api.get<Notification[]>('/notifications/')).data;
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.patch(`/notifications/${id}/`, { is_read: true });
    },

    markAllRead: async (): Promise<void> => {
        await api.post('/notifications/mark_all_read/');
    }
};
