import React from "react";
import { FiFileText, FiRotateCcw, FiXCircle } from "react-icons/fi";

const TrashFileCard = ({ name, size, onRestore, onDeleteForever }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <FiFileText size={28} className="text-slate-500" />

        <div>
          <h3 className="font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{size}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRestore}
          className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
        >
          <FiRotateCcw size={18} />
        </button>

        <button
          onClick={onDeleteForever}
          className="rounded-xl p-2 text-red-600 transition hover:bg-red-50"
        >
          <FiXCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default TrashFileCard;
