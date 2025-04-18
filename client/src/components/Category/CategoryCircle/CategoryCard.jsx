import React from "react";

const CategoryCard = ({ category }) => {
  return (
    <div className="flex flex-col items-center space-y-2 min-w-[90px] sm:min-w-[120px]">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border-2 border-gray-300">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs sm:text-sm font-medium text-center capitalize text-gray-700">
        {category.title}
      </p>
    </div>
  );
};

export default CategoryCard;
