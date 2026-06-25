import React from "react";
import { FiFolder, FiClock, FiStar, FiTrash2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    icon: FiFolder,
    label: "My Files",
    path: "/files",
  },

  {
    icon: FiClock,
    label: "Recent",
    path: "/recent",
  },

  {
    icon: FiStar,
    label: "Favorites",
    path: "/favorites",
  },

  {
    icon: FiTrash2,
    label: "Trash",
    path: "/trash",
  },
];

const Sidebar = ({ onNewFolder }) => {
  return (
    <div className="flex w-64 flex-col border-r border-slate-200 bg-white p-6">
      <div>
        <h1 className="mb-8 text-4xl font-bold text-emerald-600">ClouD</h1>

        <button
          onClick={onNewFolder}
          className="mb-8 w-full rounded-2xl bg-emerald-600 px-5 py-3 text-white transition-all duration-200 hover:bg-emerald-700"
        >
          + New
        </button>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-6">
        <h3 className="mb-2 font-semibold text-slate-800">Storage</h3>

        <p className="mb-3 text-sm text-slate-500">2.1 GB / 15 GB</p>

        <div className="h-2 w-full rounded-full bg-slate-200">
          <div className="h-2 w-1/3 rounded-full bg-emerald-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
