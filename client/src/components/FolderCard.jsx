import { FiFolder, FiTrash2, FiEdit2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const FolderCard = ({
  name,
  isFavorite,
  onClick,
  onDelete,
  onEdit,
  onFavorite,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <FiFolder size={28} className="text-emerald-600" />
        <h3 className="font-semibold text-slate-800">{name}</h3>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onFavorite) {
              onFavorite();
            }
          }}
        >
          {isFavorite ? (
            <FaStar size={18} className="text-yellow-500" />
          ) : (
            <FaRegStar size={18} className="text-slate-400" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) {
              onEdit();
            }
          }}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) {
              onDelete();
            }
          }}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FolderCard;
