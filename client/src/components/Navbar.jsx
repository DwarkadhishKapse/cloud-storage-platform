import React from "react";
import { FiGrid, FiList } from "react-icons/fi";
import useViewStore from "../store/useViewStore";

const Navbar = () => {
  const { view, setView } = useViewStore();

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
      <input
        type="text"
        placeholder="Search files and folders..."
        className="w-96 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("grid")}
          className={`rounded-2xl p-2 transition-all duration-200 ${
            view === "grid"
              ? "bg-emerald-100 text-emerald-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FiGrid size={20} />
        </button>

        <button
          onClick={() => setView("list")}
          className={`rounded-2xl p-2 transition-all duration-200 ${
            view === "list"
              ? "bg-emerald-100 text-emerald-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FiList size={20} />
        </button>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
        D
      </div>
    </div>
  );
};

export default Navbar;
