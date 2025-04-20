import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { IoIosHome } from "react-icons/io";
const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-t from-cyan-200 to-purple-500 px-6 overflow-hidden">
      <div className="w-[80%] h-[50%]  ">
        <DotLottieReact
          src="https://lottie.host/75b5b431-d05c-4a40-85ed-7532a408c15b/LHAf2ivdT9.lottie"
          loop
          autoplay
        />
      </div>
      <div className='relative -top-10 sm:top-0 text-center -mt-4 '>
      <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-700  animate-pulse py-2 ">
      404 - Page Not Found
      </h1>
      <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-2 ">
        Oops! The page you are looking for does not exist.
      </p>

      <span className='flex justify-center'>
      <button
        className="mt-6 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-t from-cyan-600 to-purple-600 text-white text-sm sm:text-base md:text-lg rounded-lg hover:scale-110 transition-all duration-300 hover:cursor-pointer"
        onClick={() => navigate('/')}
      >
         Home
        <IoIosHome />
      </button>
      </span>
      </div>
    </div>
  );
};

export default PageNotFound;
