import React from "react";
import { FaBoxOpen, FaTags, FaClipboardList } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";

const VendorStat = ({ vendorData }) => {
    const {id} = useParams();
  const stats = [
    
    {
      id: "categories",
      count: vendorData.categoryCount,
      label: "Categories Listed",
      icon: <FaTags className="text-indigo-500 text-4xl" />,
      link: `/vendor/${id}/account/categories-listed`,
    },
    {
        id: "products",
        count: vendorData.productCount,
        label: "Products Available",
        icon: <FaBoxOpen className="text-orange-500 text-4xl" />,
        link:  `/vendor/${id}/account/products-listed` ,
      },
    {
      id: "bookings",
      count: vendorData.bookingCount,
      label: "Orders Received",
      icon: <FaClipboardList className="text-pink-500 text-4xl" />,
      link: `/vendor/${id}/account/bookings`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 m-auto gap-8">
      {stats.map(({ id, count, label, icon, link }) => (
        <div
          key={id}
          id={id}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition hover:scale-105 flex flex-col justify-center items-center"
        >
          <div className="bg-gray-100 p-4 rounded-full shadow">{icon}</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-1">
            {count !== 0 ? count : (
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
              </div>
            )}
          </h2>
          <p className="text-gray-600 mb-3 font-medium text-lg">{label}</p>
          <NavLink to={link}>
            <button className="w-60 group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-purple-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-purple-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 hover:cursor-pointer hover:scale-110">
              <span className="z-10">Check Now</span>
              <span className="absolute inset-0 rounded-xl bg-fuchsia-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
            </button>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default VendorStat;
