import { create } from "zustand";
import api from "../services/api";

const useStorageStore = create((set) => ({
  used: 0,
  limit: 0,
  available: 0,
  usedPercentage: 0,
  loading: false,

  fetchStorage: async () => {
    try {
      set({ loading: true });

      const response = await api.get("/storage");

      const storage = response.data.storage;

      set({
        used: storage.used,
        limit: storage.limit,
        available: storage.available,
        usedPercentage: storage.usedPercentage,
      });
    } catch (error) {
      console.error("Failed to fetch storage:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useStorageStore;
