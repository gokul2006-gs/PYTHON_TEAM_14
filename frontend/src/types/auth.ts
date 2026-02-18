export type UserRole = 'student' | 'staff' | 'lab_incharge' | 'admin';

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
