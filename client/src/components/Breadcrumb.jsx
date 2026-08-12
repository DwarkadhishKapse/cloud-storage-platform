import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={`${item}-${index}`}>
          <span
            onClick={() => {
              if (index === 0) {
                navigate("/");
              }
            }}
            className={`transition-all duration-200 ${
              index === 0
                ? "cursor-pointer text-slate-500 hover:text-emerald-600"
                : "text-slate-700"
            }`}
          >
            {item}
          </span>

          {index < items.length - 1 && (
            <FiChevronRight className="text-slate-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
