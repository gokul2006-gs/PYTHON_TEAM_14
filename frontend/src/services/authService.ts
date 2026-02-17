import api from '../lib/axios';
import type { LoginResponse } from '../types/auth';
import type { LoginFormData, SignupFormData } from '../utils/validation';

export const authService = {
    login: async (data: LoginFormData): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login/', data);
        return response.data;
    },

    register: async (data: SignupFormData): Promise<void> => {
        await api.post('/auth/register/', data);
    },

    logout: async () => {
        await api.post('/auth/logout/');
    }
};
