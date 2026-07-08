import { FiFolder } from "react-icons/fi";
import FolderActionsMenu from "./FolderActionsMenu";

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
      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-4">
        <FiFolder size={28} className="shrink-0 text-emerald-600" />
        <h3 className="truncate font-semibold text-slate-800">{name}</h3>
      </div>

      <FolderActionsMenu
        isFavorite={isFavorite}
        onFavorite={onFavorite}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default FolderCard;
