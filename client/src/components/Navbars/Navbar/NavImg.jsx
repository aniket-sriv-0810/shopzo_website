import React from 'react'
import { NavLink } from 'react-router-dom';
import WebsiteLogo from '../../../assets/black-website-logo.png';

const NavImg = () => {
  return (
    <NavLink 
      to="/" 
      className="flex items-center justify-center transition-transform duration-200 hover:scale-105"
    >
      <img
        src={WebsiteLogo}
        alt="The Shopzo"
        className="h-16 w-auto lg:h-20 object-contain"
        data-aos="fade-down"
      />
    </NavLink>
  )
}

export default NavImg
