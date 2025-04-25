import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import { GrInstagram } from "react-icons/gr";
import Logo from "../../assets/white-website-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-black to-gray-900 text-gray-300 py-12 px-4 sm:px-8 lg:px-20 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        
        {/* 🌐 About Section */}
        <div className="flex flex-col items-center sm:items-start space-y-4 text-center sm:text-left">
          <img
            src={Logo}
            alt="The Shopzo Logo"
            className="w-24 sm:w-28 object-contain transition-transform duration-300 hover:scale-105 mx-auto sm:mx-0"
          />
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto sm:mx-0">
            The Shopzo is your one-stop platform to book offline products from trusted vendors, categorized by products for a seamless shopping experience.
          </p>
        </div>

        {/* 🔗 Links Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className=" text-sm flex justify-center items-center flex-wrap md:space-y-2 sm:flex-col sm:items-start sm:ml-2 gap-3">
            {["Home", "Vendors", "About", "Contact", "Categories", "Policies"].map((item, i) => (
              <li key={i}>
                <NavLink
                  to={`/${item.toLowerCase()}`}
                  className="hover:text-blue-400 transition-colors duration-300 "
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 📍 Location Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Our Location</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
             Knowledge Park 3<br />
            Greater Noida, Uttar Pradesh, India - 201306
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Email:{" "}
            <a
              href="mailto: theshopzo.team@gmail.com"
              className="text-blue-400 hover:underline"
            >
              theshopzo.team@gmail.com
            </a>
          </p>
        </div>

        {/* 📱 Social Section */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4 justify-center sm:justify-start">
            {[ 
              {
                icon: FaLinkedin,
                url: "#",
                hover: "hover:bg-blue-600",
              },
              {
                icon: CgMail,
                url: "mailto: theshopzo.team@gmail.com",
                hover: "hover:bg-red-600",
              },
              {
                icon: GrInstagram,
                url: "https://www.instagram.com/shobhiitttt_fs?igsh=MWVjdWxqbm0wYzMyMg==",
                hover: "hover:bg-pink-600",
              },
            ].map(({ icon: Icon, url, hover }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 bg-zinc-700 rounded-full transition-all duration-300 ${hover}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-10 border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link to="/about" className="text-blue-400 hover:text-cyan-500 transition">
            The Shopzo
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
