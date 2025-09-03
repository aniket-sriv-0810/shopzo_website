import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa6";
import { FaTag  } from "react-icons/fa";
import { IoPersonAdd , IoBagAdd  } from "react-icons/io5";

const DesktopNavbar = () => {
  const navigate = useNavigate();


  const navItems = [
    { to: "/admin", label: "Admin", tooltip: "Admin" },
    { to: "users", label: "Users", tooltip: "Users" },
    { to: "vendors", label: "Vendors", tooltip: "Vendors" },
    { to: "categories", label: "Categories", tooltip: "Categories" },
    { to: "products", label: "Products", tooltip: "Products" },
    { to: "bookings", label: "Orders", tooltip: "Orders" },
    { to: "feedbacks", label: "Feedbacks", tooltip: "Feedbacks" },
  ];



  return (
    <ul className="text-white hidden capitalize  2xl:flex absolute right-9 gap-6 items-center" data-aos="fade-up">

      {navItems.map(({ to, label, tooltip }) => (
        <li key={to} className="  hover:scale-110 hover:font-semibold">
            <NavLink to={to} className="hover:text-amber-300  ">
              {label}
            </NavLink>
        </li>
      ))}
  {/* Button Group */}

  <button
  onClick={() => navigate("add-category")}
  className="group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-purple-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-purple-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 hover:cursor-pointer hover:scale-110"
>
  <span className="z-10">Add Categories</span>
  <FaTag className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />

  {/* Optional subtle glow on hover */}
  <span className="absolute inset-0 rounded-xl bg-fuchsia-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />

</button>
  <button
  onClick={() => navigate("add-vendor")}
  className="group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-green-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-green-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 hover:cursor-pointer hover:scale-110"
>
  <span className="z-10">Add Vendors</span>
  <IoPersonAdd className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />

  {/* Optional subtle glow on hover */}
  <span className="absolute inset-0 rounded-xl bg-green-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
</button>
  <button
  onClick={() => navigate("add-product")}
  className="group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-red-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-red-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 hover:cursor-pointer hover:scale-110"
>
  <span className="z-10">Add Products</span>
  <IoBagAdd  className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />

  {/* Optional subtle glow on hover */}
  <span className="absolute inset-0 rounded-xl bg-red-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
</button>

        <button
      onClick={() => navigate("/logout")}
      className=" bg-transparent px-4 py-3 rounded-lg hover:shadow-md hover:cursor-pointer hover:bg-amber-600 hover:bg-opacity-60 flex items-center gap-2 group transition-all duration-100 hover:scale-110"
    >
      <span className="text-white group-hover:text-white">Logout</span>
      <FaPowerOff className="text-white w-5 h-5 group-hover:text-white transition-all duration-200" />
    </button>
     
    </ul>
  );
};

export default DesktopNavbar;
