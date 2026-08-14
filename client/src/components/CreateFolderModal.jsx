import React, { useEffect, useState } from "react";
import useFolderStore from "../store/useFolderStore";
import { createFolder } from "../services/folder.service";

const CreateFolderModal = ({ isOpen, onClose, parentId, onFolderCreated }) => {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const { addFolder } = useFolderStore();

  useEffect(() => {
    if (!isOpen) {
      setFolderName("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateFolder = async () => {
    const name = folderName.trim();

    if (!name || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await createFolder({
        name,
        parentId,
      });

      if (!parentId) {
        addFolder(response.folder);
      }

      onFolderCreated?.();

      setFolderName("");
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreateFolder();
    }
  };

  const handleCancel = () => {
    if (loading) return;

    setFolderName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Create new folder
        </h2>

        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={loading}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-2xl px-5 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateFolder}
            disabled={loading || !folderName.trim()}
            className="rounded-2xl bg-emerald-600 px-5 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Creating..." : "Create new Folder"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
