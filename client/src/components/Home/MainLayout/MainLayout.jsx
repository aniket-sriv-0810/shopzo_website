import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import img1 from '../../../assets/hero-img-1.jpg'
import img2 from '../../../assets/hero-img-2.jpg'
import img3 from '../../../assets/hero-img-3.jpg'
import img4 from '../../../assets/hero-img-4.jpg'
import img5 from '../../../assets/hero-img-5.jpg'
import img6 from '../../../assets/hero-img-6.jpg'
import img7 from '../../../assets/hero-img-7.jpg'
import img8 from '../../../assets/hero-img-8.jpg'
import img9 from '../../../assets/img1.jpg'
import img10 from '../../../assets/hero-img-10.jpeg'
import img11 from '../../../assets/img2.jpg'
const slideshowImages = [
 img4,
 img9,
 img3,
 img8,
 img6,
];

const MainLayout = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Slideshow every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === slideshowImages.length - 1 ? 0 : prev + 1
      );
    },3000 );
    return () => clearInterval(interval);
  }, []);
 useEffect(() => {
      AOS.init({
        duration: 1500, // Animation duration
        easing: "ease-in-out", // Smooth effect
        mirror: true,
        once: false, // Animation repeats on scroll
      });
    }, []);
  return (
    <div className="bg-gradient-to-tr from-pink-400 to-slate-800 p-4 sm:p-6 space-y-10 max-w-screen-2xl mx-auto">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center" data-aos="fade-down">
        {/* Slideshow */}
        <div className="w-full h-[250px] sm:h-[380px] rounded-xl overflow-hidden shadow-md">
          <img
            src={slideshowImages[currentIndex]}
            alt="Slideshow"
            className="w-full h-full object-cover  transition-all duration-700"
          />
        </div>

        {/* Static Image with Button */}
        <div className="relative w-full h-[250px] sm:h-[350px] rounded-xl overflow-hidden shadow-md" >
          <img
            src={img11}
            alt="Promo"
            className="w-full h-full object-cover"
            data-aos="fade-up"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button onClick={() => navigate('/categories')} className="bg-gradient-to-bl from-red-600 to-purple-700 hover:from-indigo-700 hover:to-pink-600 hover:cursor-pointer text-white font-semibold py-2 px-6 rounded-full shadow-md">
              Explore Now
            </button> 
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Landscape */}
        <div className="md:col-span-2 w-full h-[200px] sm:h-[360px] rounded-xl overflow-hidden shadow-md" data-aos="fade-up">
          <img
            src={img5}
            alt="Landscape"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Portraits */}
        <div className="flex gap-6">
          <div className="w-full  rounded-xl overflow-hidden shadow-md" data-aos="fade-down">
            <img
              src={img7}
              alt="Portrait 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full  rounded-xl overflow-hidden shadow-md" data-aos="fade-up">
            <img
              src={img10}
              alt="Portrait 2"
              className="w-full h-full object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
