import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/utils/mockData';

interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  selectedRole: UserRole | null;
  login: (role: UserRole, simulateFaceScan?: boolean) => Promise<boolean>;
  logout: () => void;
  setSelectedRole: (role: UserRole | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  selectedRole: null,

  setSelectedRole: (role) => set({ selectedRole: role }),

  login: async (role: UserRole, simulateFaceScan: boolean = true) => {
    if (simulateFaceScan) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      set({ isLoggedIn: true, currentUser: user, selectedRole: null });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isLoggedIn: false, currentUser: null, selectedRole: null });
  },
}));
