export type UserRole = 'student' | 'faculty' | 'lab_in_charge' | 'admin';

export interface User {
    id: string;
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
