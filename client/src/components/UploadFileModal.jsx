import React, { useRef, useState } from "react";

import useFileStore from "../store/useFileStore";
import useStorageStore from "../store/useStorageStore";
import { formatFileSize } from "../utils/formatFileSize";
import { uploadFile } from "../services/file.service";

const UploadFileModal = ({ isOpen, onClose, parentId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const { addFile } = useFileStore();
  const { fetchStorage } = useStorageStore();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      if (parentId) {
        formData.append("folderId", parentId);
      }

      const response = await uploadFile(formData);

      if (!parentId) {
        addFile(response.file);
      }

      await fetchStorage();

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onClose();
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Upload File</h2>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="mb-4 rounded-2xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Choose File
        </button>

        {selectedFile && (
          <div className="mb-6 rounded-lg border bg-slate-50 p-4">
            <p className="font-medium">{selectedFile.name}</p>

            <p className="text-sm text-slate-500">
              {formatFileSize(selectedFile.size)}
            </p>

            <p className="text-sm text-slate-500">
              {selectedFile.type || "Unknown file type"}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-2xl px-5 py-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="rounded-2xl bg-emerald-600 px-5 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
