import React, { useState } from "react";
import { FiGrid, FiList, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useViewStore from "../store/useViewStore";
import useSearchStore from "../store/useSearchStore";
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { view, setView } = useViewStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { user, logout } = useAuthStore();

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    "U";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <input
        type="text"
        placeholder="Search files and folders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-96 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <div className="flex items-center gap-4">
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

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700"
          >
            {initials}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {firstName} {lastName}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <FiUser size={18} />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;