import React from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiFolder,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";
import { formatFileSize } from "../utils/formatFileSize";

const TrashFolderCard = ({
  name,
  folders = [],
  files = [],
  onRestore,
  onDeleteForever,
  isNested = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(!isNested);

  const hasChildren = folders.length > 0 || files.length > 0;

  return (
    <div
      className={
        isNested
          ? "rounded-2xl border border-slate-200 bg-slate-50"
          : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      }
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              {isExpanded ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronRight size={18} />
              )}
            </button>
          ) : (
            <div className="w-7" />
          )}

          <FiFolder size={26} className="shrink-0 text-emerald-600" />

          <h3 className="truncate font-semibold text-slate-800">{name}</h3>
        </div>

        {!isNested && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onRestore}
              className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              <FiRotateCcw size={16} />
              Restore
            </button>

            <button
              onClick={onDeleteForever}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <FiTrash2 size={16} />
              Delete Forever
            </button>
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
          <div className="ml-4 space-y-3 border-l-2 border-slate-100 pl-4">
            {folders.map((folder) => (
              <TrashFolderCard
                key={folder.id}
                name={folder.name}
                folders={folder.children}
                files={folder.files}
                isNested
              />
            ))}

            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FiFileText size={20} className="shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashFolderCard;
