import React from "react";

const DeleteFileModal = ({ file, onClose, onConfirm }) => {
  if (!file) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900">
          Move to Trash?
        </h2>

        <p className="mt-4 text-slate-600">
          "{file.name}" will be moved to Trash.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          You can restore it later from Trash.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl px-5 py-2 text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFileModal;