import { create } from "zustand";

const useViewStore = create((set) => ({
  view: "grid",

  setView: (newView) =>
    set({
      view: newView,
    }),
}));

export default useViewStore