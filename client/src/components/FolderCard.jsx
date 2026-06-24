import { FiFolder } from "react-icons/fi";

const FolderCard = ({ name, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
    >
      <FiFolder size={28} className="text-emerald-600" />

      <div>
        <h3 className="font-semibold text-slate-800">{name}</h3>
      </div>
    </div>
  );
};

export default FolderCard;
