import React, { useState } from "react";
import useFolderStore from "../store/useFolderStore";

const CreateFolderModal = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState("");

  const { createFolder } = useFolderStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Create new folder
        </h2>

        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl px-5 py-2 text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!folderName.trim()) {
                alert("Folder name is required");
                return;
              }

              createFolder(folderName);

              setFolderName("");
              onClose();
            }}
            className="rounded-2xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
          >
            Create new Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
