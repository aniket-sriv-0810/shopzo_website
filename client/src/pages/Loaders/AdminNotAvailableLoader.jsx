import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { IoIosHome } from "react-icons/io";
import { FaTags } from 'react-icons/fa';
const AdminNotAvailableLoader = ({content , tagline}) => {
      const navigate = useNavigate();
    
  return (
    <>
    <div className='bg-gray-100 mx-auto h-max mb-10 sm:flex md:mt-20 md:justify-evenly md:gap-6'>
<div className='w-80 h-80' >

           <DotLottieReact
src="https://lottie.host/daef6ef4-3dd8-4c0e-8506-37b5d17fff5d/iaLY4K914e.lottie"
autoplay
/> 
</div>
<div className='flex flex-col w-80 overflow-hidden md:mt-5 md:w-[28rem]' >
<h1 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-gray-700  animate-pulse py-2 ">
    {content}
</h1>
<h1 className="text-gray-500 font-normal text-center  sm:text-lg md:text-xl mt-2 ">
    {tagline}
</h1>
 <span className='flex justify-center mb-10'>
      <button
        className="mt-6 flex justify-center hover:cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-t from-red-600 to-purple-600 text-white text-sm sm:text-base md:text-lg rounded-lg hover:scale-110 transition-all duration-300"
        onClick={() => navigate('/')}
      >
         Explore Products
        <FaTags />
      </button>
      </span>

</div>
    </div>
    </>
  )
}

export default AdminNotAvailableLoader
