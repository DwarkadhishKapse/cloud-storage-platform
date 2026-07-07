import React from "react";
import FileActionsMenu from "./FileActionsMenu";
import { FiFileText } from "react-icons/fi";

const FileCard = ({
  name,
  size,
  onClick,
  isFavorite,
  onFavorite,
  onDelete,
  onDownload,
  onDetail,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4 min-w-0">
        <FiFileText size={28} className="text-emerald-600" />

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{size}</p>
        </div>
      </div>

      <FileActionsMenu
        isFavorite={isFavorite}
        onFavorite={onFavorite}
        onDownload={onDownload}
        onDelete={onDelete}
        onDetail={onDetail}
      />
    </div>
  );
};

export default FileCard;
