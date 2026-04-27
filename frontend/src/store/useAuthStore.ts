// zustand store for authentication state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// user role for authorization in frontend
interface User {
    id: string;
    username: string;
    email: string;
    userRole: 'USER' | 'ADMIN';
    }

// authentication state and actions for zustand store
interface AuthState {
    user: User | null;
    accessToken: string | null;
    _hasHydrated: boolean;
    
    // Actions
    setAuth: (user: User, token: string) => void;
    setAccessToken: (token: string) => void;
    setHasHydrated: (state: boolean) => void;
    logout: () => void;
}

// persist saves the auth state to localStorage and rehydrates it on app refresh or load
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            _hasHydrated: false, //internal flag to track if the store has been rehydrated from storage

            setAuth: (user, accessToken) => set({ user, accessToken }),
            setAccessToken: (accessToken) => set({ accessToken }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            logout: () => set({ user: null, accessToken: null }),
        }),
        {
            name: 'auth-storage', // name of the item in storage
            partialize: (state) => ({ user:state.user}), // only persist the user object, not the access token
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);