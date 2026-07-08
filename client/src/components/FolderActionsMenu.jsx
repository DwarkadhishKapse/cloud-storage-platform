import React, { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiEdit2, FiShare2, FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const FolderActionsMenu = ({
  isFavorite,
  onFavorite,
  onEdit,
  onShare,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100"
      >
        <FiMoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-12 z-10 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <button
            onClick={() => {
              onFavorite?.();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 transition-colors hover:bg-slate-50"
          >
            {isFavorite ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-slate-400" />
            )}
            <span>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </span>
          </button>

          <button
            onClick={() => {
              onEdit?.();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 transition-colors hover:bg-slate-50"
          >
            <FiEdit2 />
            <span>Rename</span>
          </button>

          <button
            onClick={() => {
              onShare?.();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-400 transition-colors hover:bg-slate-50"
          >
            <FiShare2 />
            <span>Share (Coming Soon)</span>
          </button>

          <div className="mx-3 border-t border-slate-100" />

          <button
            onClick={() => {
              onDelete?.();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
          >
            <FiTrash2 />
            <span>Move to Trash</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderActionsMenu;
