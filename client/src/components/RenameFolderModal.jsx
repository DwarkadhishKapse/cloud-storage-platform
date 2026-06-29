import React, { useEffect, useState } from "react";

const RenameFolderModal = ({ folder, onClose, onConfirm }) => {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);

  if (!folder) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900">Rename Folder</h2>

        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl px-5 py-2 text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(folderName)}
            className="rounded-2xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderModal;
