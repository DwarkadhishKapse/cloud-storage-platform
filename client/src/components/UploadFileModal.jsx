import React, { useRef, useState } from "react";
import useFileStore from "../store/useFileStore";

const UploadFileModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const { addFile } = useFileStore();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    addFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
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
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="mb-4 rounded-2xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
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
            className="rounded-2xl px-5 py-2 text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="rounded-2xl bg-emerald-600 px-5 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
