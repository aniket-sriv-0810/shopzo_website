import React  from 'react'
import { NavLink } from 'react-router-dom';
import WebsiteLogo from '../../../assets/white-website-logo.png';

const NavImg = () => {

  return (
    <>
          <NavLink to="/" className="w-max">
            <img
              src={WebsiteLogo}
              alt="The Shopzo"
              className="w-20 ml-4 sm:w-20 lg:w-28"
              data-aos="fade-down"
              />
          </NavLink>

    </>
  )
}

export default NavImg
