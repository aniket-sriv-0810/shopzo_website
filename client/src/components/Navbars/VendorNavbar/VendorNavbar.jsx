import React  , {useEffect}from 'react'
import DesktopNavbar from './DesktopNavbar'
import NavImg from './NavImg'
import MobileNavbar from './MobileNavbar'
import AOS from "aos";
import "aos/dist/aos.css";
const Navbar = () => {
    useEffect(() => {
      AOS.init({
        duration: 1500, // Animation duration
        easing: "ease-in-out", // Smooth effect
        mirror: true,
        once: false, // Animation repeats on scroll
      });
    }, []);
  return (
    <div>

      <div className=" flex justify-center items-center px-6 2xl:justify-between  lg:px-8">
        <div className="flex  items-center  xs:-ml-5 space-x-5">
          <NavImg />
        </div>

        <DesktopNavbar />

        <MobileNavbar />
      </div>
        </div>
  )
}

export default Navbar
