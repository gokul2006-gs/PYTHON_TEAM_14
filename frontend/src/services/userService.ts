import api from '../lib/axios';

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'STUDENT' | 'STAFF' | 'LAB_INCHARGE' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE';
}

export const userService = {
    getAll: async (): Promise<User[]> => {
        return (await api.get<User[]>('/users/')).data;
    },

    getByRole: async (role: string): Promise<User[]> => {
        const users = await userService.getAll();
        return users.filter(u => u.role === role);
    },

    getStats: async (): Promise<{ total_users: number, active_bookings: number, pending_approvals: number, total_resources: number }> => {
        return (await api.get('/users/dashboard_stats/')).data;
    },

    getStudentStats: async (): Promise<{ upcoming: number, pending: number, completed: number }> => {
        return (await api.get('/users/student_stats/')).data;
    }
};
