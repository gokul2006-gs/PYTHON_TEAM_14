import api from '../lib/axios';

export interface AuditLog {
    id: number;
    user: number;
    user_name: string;
    action: string;
    details: string;
    timestamp: string;
}

export const auditService = {
    getAll: async (): Promise<AuditLog[]> => {
        return (await api.get<AuditLog[]>('/audit/')).data;
    }
};
