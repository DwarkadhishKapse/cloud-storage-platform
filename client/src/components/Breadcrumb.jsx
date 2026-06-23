import React from "react";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumb = ({ items }) => {
  return (
    <div className="mb-8 flex items-center gap-2 text-sm">
      {items.map((item) => (
        <React.Fragment key={item}>
          <span className="cursor-pointer text-slate-500 transition-all duration-200 hover:text-emerald-600">
            {item}
          </span>

          {item !== item.length - 1 && (
            <FiChevronRight className="text-slate-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
