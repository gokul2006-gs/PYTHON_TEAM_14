import api from '../lib/axios';

export interface Resource {
    id: string;
    name: string;
    type: 'lab' | 'equipment' | 'venue';
    location: string;
    capacity: number;
    status: 'active' | 'maintenance';
}

export const resourceService = {
    getAll: async (): Promise<Resource[]> => {
        return (await api.get<Resource[]>('/resources/')).data;
    },

    getById: async (id: string): Promise<Resource> => {
        return (await api.get<Resource>(`/resources/${id}/`)).data;
    }
};
