import api from '../lib/axios';

export interface PendingRequest {
    id: string;
    resourceName: string;
    userName: string;
    userRole: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: 'pending';
    type: 'standard' | 'special';
}

export const approvalService = {
    getPendingRequests: async (): Promise<PendingRequest[]> => {
        return (await api.get<PendingRequest[]>('/approvals/pending/')).data;
    },

    approve: async (id: string, comment?: string): Promise<void> => {
        await api.post(`/approvals/${id}/approve/`, { comment });
    },

    reject: async (id: string, comment?: string): Promise<void> => {
        await api.post(`/approvals/${id}/reject/`, { comment });
    }
};
