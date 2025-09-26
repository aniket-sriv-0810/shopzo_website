import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbars/Navbar/Navbar';
import WelcomeMsg from '../components/Home/WelcomeMsg/WelcomeMsg';
import SlideShow from '../components/Home/SlideShow/SlideShow';
import SearchBox from '../components/Home/SearchBox/SearchBox';
import Footer from '../components/Footer/Footer';
import AllCategories from '../components/Category/AllCategory/AllCategory';
import Counter from '../components/Home/Counter/Counter';
import ScrollComponent from '../components/Home/ScrollComponent/ScrollComponent';
import AllVendors from './Vendor/AllVendors';
import FAQs from '../components/FAQs/FAQs';

import {driver} from 'driver.js';
import "driver.js/dist/driver.css";
import './driver.css'
import { IoMdHelpCircle } from 'react-icons/io';
import {
  FaUsers,
  FaStore,
  FaTags,
  FaBoxOpen,
  FaClipboardList
} from 'react-icons/fa';
import AllCategoryCard from '../components/Category/CategoryCircle/AllCategoryCard';
import MainLayout from '../components/Home/MainLayout/MainLayout';

const Home = () => {
  const driverRef = useRef(null);

  useEffect(() => {
    const driverInstance = new driver({
      showProgress: true,
      overlayColor: "rgba(0, 0, 0, 0.75)",
      popoverClass: "custom-driver-popover",
      allowClose: false,
      animate: true,
      keyboardControl: true,
      opacity: 0.85,
      steps: [
        {
          element: '#search-box',
          popover: {
            title: 'Smart Search 🔍',
            description: 'Easily find products using this search bar!',
            side: 'bottom',
          },
        },
        {
          element: '#category-section',
          popover: {
            title: 'Categories 🎯',
            description: 'Explore various product categories here.',
            side: 'bottom',
          },
        },
        {
          element: '#vendor-section',
          popover: {
            title: 'Our Vendors 🏪',
            description: 'Discover top listed vendors available for you.',
            side: 'bottom',
          },
        },
        {
          element: '#counter-section',
          popover: {
            title: 'Stats 🔢',
            description: 'Live count of users, products, and bookings!',
            side: 'top',
          },
        },
        {
          element: '#faq-section',
          popover: {
            title: 'FAQs 💡',
            description: 'Have questions? Check out frequently asked ones here.',
            side: 'top',
          },
        },
        {
          element: '#navbar',
         popover: {
            title: "🧭 Effortless Navigation",
            description: "Quickly access key sections like categories user account products vendors from one place.",
            side: "top",
          },
        },
        
      ],
    });
  
    driverRef.current = driverInstance;
  
    if (localStorage.getItem("startTour") === "true") {
      driverRef.current.drive();
      localStorage.removeItem("startTour");
    }
  
    return () => {
      driverRef.current = null;
    };
  }, []);
  

  return (
    <div className='bg-gray-100'>
      {/* Fixed Top Banner */}
      <div className="top-0 left-0 right-0 z-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 shadow-lg">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
          <div className="relative py-3 sm:py-4">
            <div
              className="whitespace-nowrap flex items-center gap-16 sm:gap-24"
              style={{
                animation: 'marquee 12s linear infinite',
              }}
            >
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                Launching soon
              </span>
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                Launching soon
              </span>
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                Launching soon
              </span>
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                Launching soon
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Spacer to avoid overlap with fixed banner */}
      <div className="h-0 sm:h-0"></div>
      <div className="-mb-2 bg-gray-100" id="navbar">
        <Navbar />
      </div>
      <MainLayout/>
      <div className="my-0">
       <AllCategoryCard/>
      </div>


      <div id="category-section" className="my-0">
        <AllCategories />
      </div>
      <div className="bg-[url('/assets/header-img.png')] bg-cover h-72 bg-no-repeat sm:h-[30rem]  md:h-[40rem] lg:h-[48rem]"></div>
      <div id="vendor-section" className="my-0">
        <AllVendors />
      </div>

      <div className="my-0">
        <ScrollComponent />
      </div>

      <div
        id="counter-section"
        className="my-0 flex flex-col flex-wrap justify-evenly items-center sm:flex-row gap-6 sm:gap-3 py-10 px-5 sm:px-5"
      >
        {/* <Counter
          start={0}
          end={300}
          duration={2000}
          value="Users Registered"
          color="blue"
          icon={<FaUsers className="text-blue-500 text-2xl md:text-3xl lg:text-5xl" />}
        /> */}
        <Counter
          start={0}
          end={100}
          duration={2000}
          value="Vendors Listed"
          color="red"
          icon={<FaStore className="text-red-500 text-2xl md:text-3xl lg:text-5xl" />}
        />
        <Counter
          start={0}
          end={50}
          duration={2000}
          value="Categories Available"
          color="teal"
          icon={<FaTags className="text-teal-500 text-2xl md:text-3xl lg:text-5xl" />}
        />
        <Counter
          start={0}
          end={600}
          duration={2000}
          value="Products Available"
          color="orange"
          icon={<FaBoxOpen className="text-orange-500 text-2xl md:text-3xl lg:text-5xl" />}
        />
        <Counter
          start={0}
          end={100}
          duration={2000}
          value="Orders Accomplished"
          color="green"
          icon={<FaClipboardList className="text-green-500 text-2xl md:text-3xl lg:text-5xl" />}
        />
      </div>

      <div id="faq-section" className="my-0">
        <FAQs />
      </div>

      {/* Help / Tour Button */}
      <button
        onClick={() => driverRef.current?.drive()}
        className="fixed bottom-25 right-6 md:bottom-10 md:right-5 bg-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50"
      >
        <IoMdHelpCircle className="w-8 h-8 text-blue-500 md:w-10 md:h-10" />
      </button>

      <div className="mt-0">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
