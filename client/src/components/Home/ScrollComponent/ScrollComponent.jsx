import React from "react";

const ScrollComponent = () => {
  return (
    <div className="relative h-screen w-full mt-5 mb-5 p-5">
      {/* Background Image with Parallax Effect */}
      <div
        className="bg-[url('/assets/model1.png')] absolute inset-0 bg-fixed bg-center  bg-cover bg-no-repeat"
      ></div>

      {/* Dark Overlay with Glass Effect */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 text-center text-white">
        <h1 className="text-xl sm:text-4xl lg:text-6xl font-extrabold leading-tight drop-shadow-md">
          Welcome to <span className="text-yellow-400">The Shopzo</span>
        </h1>
        <p className="text-base sm:text-xl max-w-2xl mt-4 leading-relaxed opacity-90">
          Step into a world of fashion with <span className="text-yellow-400">The Shopzo</span>. 
          Explore a wide range of clothing from local vendors, all categorized for your convenience. 
          Whether you're after the latest trends, timeless classics, or exclusive pieces, 
          <span className="text-yellow-400">The Shopzo</span> connects you with the best in offline fashion. 
          Browse, order, and pick up your favorite outfits—your wardrobe upgrade is just a click away.
        </p>
      </div>
    </div>
  );
};

export default ScrollComponent;
