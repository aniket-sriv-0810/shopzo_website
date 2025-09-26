import React from 'react';
import { sizeFormats } from './SizeFormatSelector';

const SizeCheckbox = ({ selectedSizes, onChange, sizeFormat }) => {
  // Get sizes based on selected format
  const availableSizes = sizeFormat && sizeFormats[sizeFormat] 
    ? sizeFormats[sizeFormat].sizes 
    : [];

  if (!sizeFormat) {
    return (
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">Select Sizes</label>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            Please select a size format first before choosing individual sizes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block font-medium mb-2 text-gray-700">
        Select Sizes for {sizeFormats[sizeFormat].name}
      </label>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {availableSizes.map((size) => (
          <label 
            key={size} 
            className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              name="sizes"
              checked={selectedSizes.includes(size)}
              onChange={() => onChange(size)}
              className="sr-only"
            />
            <span 
              className={`text-sm font-medium ${
                selectedSizes.includes(size) 
                  ? 'text-blue-600 bg-blue-100 border-blue-300' 
                  : 'text-gray-700'
              } px-2 py-1 rounded border transition-colors`}
            >
              {size}
            </span>
          </label>
        ))}
      </div>
      
      {selectedSizes.length > 0 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 font-medium mb-1">
            Selected sizes ({selectedSizes.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedSizes.map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeCheckbox;
