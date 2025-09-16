import React from 'react';

const TopBanner = () => {
  return (
    <>
      <div
        className="top-0 left-0 right-0 w-full"
        style={{ position: 'relative', top: 0, left: 0, right: 0, zIndex: 2147483647 }}
      >
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
              style={{ animation: 'marquee 12s linear infinite' }}
            >
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Launching soon</span>
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Launching soon</span>
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Launching soon</span>
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Launching soon</span>
            </div>
          </div>
        </div>
      </div>
      {/* Spacer to avoid overlap with fixed banner */}
      <div className="h-0 sm:h-0"></div>
    </>
  );
};

export default TopBanner;


