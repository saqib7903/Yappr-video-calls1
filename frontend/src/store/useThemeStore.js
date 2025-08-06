import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("yappr-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("yappr-theme", theme);
    set({ theme});
  },
}));