import React from "react";
import { FiFileText } from "react-icons/fi";

const FileCard = ({ name, size, type }) => {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
      <FiFileText size={28} className="text-emerald-600" />

      <div>
        <h3 className="font-semibold text-slate-800">{name}</h3>
        <p className="text-sm text-slate-500">{size}</p>
      </div>
    </div>
  );
};

export default FileCard;
