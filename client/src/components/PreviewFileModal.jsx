import React, { useEffect } from "react";
import { FiX, FiFileText } from "react-icons/fi";

const PreviewFileModal = ({ file, onClose }) => {
  useEffect(() => {
    if (!file) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [file, onClose]);

  if (!file) return null;

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-xl font-semibold text-slate-900">{file.name}</h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-colors hover:bg-slate-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-50 p-6">
          {isImage && (
            <img
              src={file.previewUrl}
              alt={file.name}
              className="max-h-full max-w-full rounded-2xl shadow-lg"
            />
          )}

          {isPdf && (
            <iframe
              src={file.previewUrl}
              title={file.name}
              className="h-full w-full rounded-2xl border"
            />
          )}

          {!isImage && !isPdf && (
            <div className="text-center">
              <FiFileText size={72} className="mx-auto text-slate-400" />

              <h3 className="mt-6 text-2xl font-semibold text-slate-800">
                {file.name}
              </h3>

              <p className="mt-3 text-slate-500">
                No preview available for this file type.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Click Download to open it locally.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFileModal;
