import React from "react";
import { FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div className="relative group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 w-full h-[370px]">
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

        {/* Content on image */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-5">
          <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md mb-4">
            {category.title}
          </h3>
          <button
  onClick={() => navigate(`/category/${category._id}/${category.tag}/products`)}
  className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-l from-red-600 to-fuchsia-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:cursor-pointer"
>
  View Products
  <FaTags className="text-white mt-.5"/>
</button>


        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
