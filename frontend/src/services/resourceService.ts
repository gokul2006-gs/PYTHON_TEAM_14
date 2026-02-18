import api from '../lib/axios';

export interface Resource {
    id: number;
    name: string;
    type: 'LAB' | 'CLASSROOM' | 'EVENT_HALL' | 'COMPUTER' | 'MEETING_ROOM';
    capacity: number;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    lab_in_charge?: number;
    lab_in_charge_name?: string;
    assigned_staff?: number;
    assigned_staff_name?: string;
}

export const resourceService = {
    getAll: async (): Promise<Resource[]> => {
        return (await api.get<Resource[]>('/resources/')).data;
    },

    getById: async (id: string): Promise<Resource> => {
        return (await api.get<Resource>(`/resources/${id}/`)).data;
    },

    create: async (data: Partial<Resource>): Promise<Resource> => {
        return (await api.post<Resource>('/resources/', data)).data;
    },

    update: async (id: number, data: Partial<Resource>): Promise<Resource> => {
        return (await api.put<Resource>(`/resources/${id}/`, data)).data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/resources/${id}/`);
    }
};
