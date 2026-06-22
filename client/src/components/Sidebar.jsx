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

const Sidebar = () => {
  return (
    <div className="flex w-64 flex-col border-r border-gray-200 bg-white p-6">
      <h1 className="mb-8 text-3xl font-bold text-blue-600">ClouD</h1>

      <button className="mb-8 rounded-xl bg-blue-600 px-5 py-3 text-white">
        + New
      </button>

      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="mt-auto border-t border-gray-200 pt-6">
        <h3 className="mb-2 font-semibold text-gray-700">Storage</h3>
        <p className="mb-3 text-sm text-gray-500">2.1 GB / 15 GB</p>

        <div className="h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-1/3 rounded-full bg-blue-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
