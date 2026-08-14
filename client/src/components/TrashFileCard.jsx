import React from "react";
import { FiFileText, FiRotateCcw, FiXCircle } from "react-icons/fi";

const TrashFileCard = ({ name, size, onClick, onRestore, onDeleteForever }) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-4">
        <FiFileText size={28} className="shrink-0 text-slate-500" />

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{size}</p>
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-2">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onRestore();
          }}
          title="Restore"
          className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
        >
          <FiRotateCcw size={18} />
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDeleteForever();
          }}
          title="Delete Forever"
          className="rounded-xl p-2 text-red-600 transition hover:bg-red-50"
        >
          <FiXCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default TrashFileCard;
