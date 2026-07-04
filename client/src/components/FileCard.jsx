import React from "react";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const FileCard = ({ name, size, isFavorite, onFavorite, onDelete }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
      <div className="flex items-center gap-4">
        <FiFileText size={28} className="text-emerald-600" />

        <div>
          <h3 className="font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{size}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
          className="rounded-xl p-2 transition hover:bg-yellow-50"
        >
          {isFavorite ? (
            <FaStar size={18} className="text-yellow-500" />
          ) : (
            <FaRegStar size={18} className="text-slate-400" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
