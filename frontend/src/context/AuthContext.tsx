import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios';
import type { User, AuthState, LoginResponse } from '../types/auth';

interface AuthContextType extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token and get user details from backend
                    // tailored for Django backend usually /auth/me or /users/me
                    // detailed implementation will depend on actual backend route
                    // For now, we assume valid if token exists, but ideally we fetch user
                    // const response = await api.get('/auth/me'); 
                    // setState({ user: response.data, token, isAuthenticated: true, isLoading: false });

                    // Placeholder: We need the backend to give us the user. 
                    // If we stored user in localStorage, we could recover it, but that's insecure for roles.
                    // We will mark as loading until we have a real backend endpoint to verify.
                    // For this architecture step, we'll assume we can't verify without backend yet.
                    setState(prev => ({ ...prev, isLoading: false }));
                } catch (error) {
                    console.error("Session verification failed", error);
                    localStorage.removeItem('token');
                    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initializeAuth();
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });
        // Optional: api.post('/auth/logout') if backend requires it
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
