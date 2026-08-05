import { create } from 'zustand';
import { authApi } from '../api/authApi';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the provider has reported its first session (app load/refresh). */
  initializing: boolean;
  logout: () => void;
}

// The store is a pure reflection of `authApi`'s session: it subscribes once,
// at creation, and never decodes tokens or builds `User` itself — that logic
// lives entirely behind the `AuthProvider` interface. No persist middleware
// here: the provider (Firebase) already persists the session itself, so
// caching it a second time in localStorage would just risk drifting from it.
export const useAuthStore = create<AuthState>()((set) => {
  authApi.onSessionChanged((session) => {
    set({ user: session?.user ?? null, isAuthenticated: !!session, initializing: false });
  });

  return {
    user: null,
    isAuthenticated: false,
    initializing: true,
    logout: () => {
      // Clear optimistically so the UI reacts immediately; onSessionChanged
      // will confirm it once the provider actually completes sign-out.
      set({ user: null, isAuthenticated: false });
      void authApi.logout();
    },
  };
});
