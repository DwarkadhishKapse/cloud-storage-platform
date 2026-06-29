import { FiFolder, FiTrash2, FiEdit2 } from "react-icons/fi";

const FolderCard = ({ name, onClick, onDelete, onEdit }) => {
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
            onEdit();
          }}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
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
