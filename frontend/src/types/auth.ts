export type UserRole = 'STUDENT' | 'STAFF' | 'LAB_INCHARGE' | 'ADMIN';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    user: User;
    token: string;
}
