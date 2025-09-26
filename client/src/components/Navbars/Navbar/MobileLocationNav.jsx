import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEdit } from 'react-icons/fa';

const MobileLocationNav = () => {
  const [currentLocation, setCurrentLocation] = useState('Sultanpur, UP');

  const handleUpdateLocation = () => {
    // For now, just show an alert - can be enhanced with location picker modal
    const newLocation = prompt('Enter your location:', currentLocation);
    if (newLocation && newLocation.trim()) {
      setCurrentLocation(newLocation.trim());
    }
  };

  return (
    // Only show on mobile devices (hidden on md and larger screens)
    <div className="w-full bg-white border-b border-gray-100 shadow-sm md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Location Display */}
        <div className="flex items-center space-x-2 flex-1">
          <FaMapMarkerAlt className="text-indigo-600 text-sm" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Deliver to</span>
            <span className="text-sm font-semibold text-gray-800 truncate">
              {currentLocation}
            </span>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateLocation}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors duration-200 border border-indigo-200"
        >
          <FaEdit className="text-xs" />
          <span>Update</span>
        </button>
      </div>
    </div>
  );
};

export default MobileLocationNav;