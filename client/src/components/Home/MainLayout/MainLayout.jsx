import React, { useEffect, useState } from "react";

const slideshowImages = [
  "https://source.unsplash.com/random/800x400?fashion",
  "https://source.unsplash.com/random/800x400?clothes",
  "https://source.unsplash.com/random/800x400?style",
];

const MainLayout = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slideshow every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === slideshowImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-10 max-w-screen-xl mx-auto">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Slideshow */}
        <div className="w-full h-[250px] sm:h-[320px] rounded-xl overflow-hidden shadow-md">
          <img
            src={slideshowImages[currentIndex]}
            alt="Slideshow"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>

        {/* Static Image with Button */}
        <div className="relative w-full h-[250px] sm:h-[320px] rounded-xl overflow-hidden shadow-md">
          <img
            src="https://source.unsplash.com/random/500x400?shopping"
            alt="Promo"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button className="bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-md">
              Explore Now
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Landscape */}
        <div className="md:col-span-2 w-full h-[200px] sm:h-[260px] rounded-xl overflow-hidden shadow-md">
          <img
            src="https://source.unsplash.com/random/800x400?lookbook"
            alt="Landscape"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Portraits */}
        <div className="flex flex-col gap-6">
          <div className="w-full h-[120px] sm:h-[130px] rounded-xl overflow-hidden shadow-md">
            <img
              src="https://source.unsplash.com/random/400x600?model"
              alt="Portrait 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-[120px] sm:h-[130px] rounded-xl overflow-hidden shadow-md">
            <img
              src="https://source.unsplash.com/random/400x600?designer"
              alt="Portrait 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
