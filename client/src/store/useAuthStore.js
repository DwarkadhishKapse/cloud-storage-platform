import { create } from "zustand";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/auth.service";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  register: async (userData) => {
    const response = await registerUser(userData);

    return response;
  },

  login: async (userData) => {
    const response = await loginUser(userData);

    set({
      user: response.user,
      isAuthenticated: true,
    });

    return response;
  },

  logout: async () => {
    await logoutUser();

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    try {
      const response = await getCurrentUser();

      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;