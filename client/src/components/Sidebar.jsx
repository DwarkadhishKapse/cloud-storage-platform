import React, { useEffect, useState } from "react";
import { FiFolder, FiClock, FiStar, FiTrash2, FiShare2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import useStorageStore from "../store/useStorageStore";

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
    icon: FiShare2,
    label: "Shared with me",
    path: "/shared-with-me",
  },
  {
    icon: FiTrash2,
    label: "Trash",
    path: "/trash",
  },
];

const formatStorageSize = (bytes) => {
  if (!bytes || bytes <= 0) {
    return "0 B";
  }

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes < MB) {
    return `${(bytes / KB).toFixed(2)} KB`;
  }

  if (bytes < GB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  }

  return `${(bytes / GB).toFixed(2)} GB`;
};

const Sidebar = ({ onNewFolder, onUploadFile }) => {
  const [showNewMenu, setShowNewMenu] = useState(false);

  const {
    used,
    limit,
    usedPercentage,
    loading: storageLoading,
    fetchStorage,
  } = useStorageStore();

  useEffect(() => {
    fetchStorage();
  }, [fetchStorage]);

  const storagePercentage = Math.min(usedPercentage || 0, 100);

  const isNearLimit = storagePercentage >= 80;
  const isFull = storagePercentage >= 95;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-6 py-6">
      <div>
        <h1 className="mb-8 text-4xl font-bold text-emerald-600">ClouD</h1>

        <div className="relative mb-8">
          <button
            onClick={() => setShowNewMenu((prev) => !prev)}
            className="w-full rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            + New
          </button>

          {showNewMenu && (
            <div className="absolute left-0 top-14 z-50 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button
                onClick={() => {
                  onNewFolder?.();
                  setShowNewMenu(false);
                }}
                className="flex w-full items-center rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
              >
                Create Folder
              </button>

              <button
                onClick={() => {
                  onUploadFile?.();
                  setShowNewMenu(false);
                }}
                className="flex w-full items-center rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
              >
                Upload File
              </button>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Storage</h3>

          <span className="text-xs text-slate-400">15 GB</span>
        </div>

        {storageLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm text-slate-600">
              <span className="font-medium text-slate-800">
                {formatStorageSize(used)}
              </span>{" "}
              of {formatStorageSize(limit)}
            </p>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull
                    ? "bg-red-500"
                    : isNearLimit
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.max(storagePercentage, 0.5)}%`,
                }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span
                className={`text-xs ${
                  isFull
                    ? "text-red-500"
                    : isNearLimit
                      ? "text-amber-500"
                      : "text-slate-400"
                }`}
              >
                {storagePercentage.toFixed(2)}% used
              </span>

              <span className="text-xs text-slate-400">
                {formatStorageSize(Math.max(limit - used, 0))} left
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
