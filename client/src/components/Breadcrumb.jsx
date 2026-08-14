import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const label = typeof item === "string" ? item : item.label;
        const path = typeof item === "string" ? (index === 0 ? "/" : null) : item.path;
        const isClickable = Boolean(path);

        return (
          <React.Fragment key={`${label}-${index}`}>
            <span
              onClick={() => {
                if (isClickable) {
                  navigate(path);
                }
              }}
              className={`transition-all duration-200 ${
                isClickable
                  ? "cursor-pointer text-slate-500 hover:text-emerald-600"
                  : "text-slate-700"
              }`}
            >
              {label}
            </span>

            {index < items.length - 1 && (
              <FiChevronRight className="text-slate-400" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
