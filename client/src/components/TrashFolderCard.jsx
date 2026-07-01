import React from "react";
import { FiFolder, FiRotateCcw } from "react-icons/fi";

const TrashFolderCard = ({ name, onRestore }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <FiFolder size={28} className="text-slate-400" />

        <h3 className="font-semibold text-slate-800">{name}</h3>
      </div>
      <button
        onClick={onRestore}
        className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700 transition hover:bg-emerald-100"
      >
        <FiRotateCcw size={16}/>
        Restore
      </button>
    </div>
  );
};

export default TrashFolderCard;
