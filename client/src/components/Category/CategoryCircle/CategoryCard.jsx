import React from "react";
import {useNavigate} from 'react-router-dom'
const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col items-center py-2.5 space-y-2 min-w-[90px] sm:min-w-[120px]">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border-2 border-gray-300 hover:scale-110" onClick={() =>  navigate(`/category/${category._id}/${category.tag}/products`)}>
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover  hover:cursor-pointer "
        />
      </div>
      <p className="text-xs sm:text-sm font-medium text-center capitalize text-gray-700">
        {category.title}
      </p>
    </div>
  );
};

export default CategoryCard;
