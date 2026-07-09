import React from "react";
import { FiX } from "react-icons/fi";
import { formatDate } from "../utils/formatDate";

const FolderDetailsPanel = ({ folder, onClose }) => {
  if (!folder) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/30">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-900">Folder Details</h2>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <h3 className="mb-8 text-xl font-semibold text-slate-900">
            {folder.name}
          </h3>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="mt-2 text-base text-slate-900">Folder</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="mt-2 text-base text-slate-900">
                {formatDate(folder.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Favorite</p>
              <p className="mt-2 text-base text-slate-900">
                {folder.isFavorite ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderDetailsPanel;
