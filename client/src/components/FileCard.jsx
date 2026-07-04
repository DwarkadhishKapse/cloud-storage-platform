import React from "react";
import { FiFileText } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const FileCard = ({ name, size, isFavorite, onFavorite }) => {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
      <FiFileText size={28} className="text-emerald-600" />

      <div>
        <h3 className="font-semibold text-slate-800">{name}</h3>
        <p className="text-sm text-slate-500">{size}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite?.();
        }}
      >
        {isFavorite ? (
          <FaStar size={18} className="text-yellow-500" />
        ) : (
          <FaRegStar size={18} className="text-slate-400" />
        )}
      </button>
    </div>
  );
};

export default FileCard;
