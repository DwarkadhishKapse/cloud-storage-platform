import React from "react";
import { FiGrid, FiList } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
      <input
        type="text"
        placeholder="Search files and folders..."
        className="w-96 rounded-xl border border-gray-300 px-4 py-2 outline-none"
      />

      <div className="flex items-center gap-3">
        <button>
          <FiGrid size={20} />
        </button>

        <button>
          <FiList size={20} />
        </button>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
        D
      </div>
    </div>
  );
};

export default Navbar;
