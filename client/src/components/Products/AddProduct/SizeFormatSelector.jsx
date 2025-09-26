import React from 'react';

// Predefined size formats for different product categories
const sizeFormats = {
  clothing: {
    name: "Clothing (Shirts, T-shirts, Tops)",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
  },
  pants: {
    name: "Pants & Trousers (Waist Size)",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46"]
  },
  shoes: {
    name: "Shoes & Footwear",
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"]
  },
  jeans: {
    name: "Jeans (Waist Size)",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"]
  },
  dress: {
    name: "Dresses & Skirts",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  underwear: {
    name: "Underwear & Innerwear",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  accessories: {
    name: "Accessories (Belts, Caps)",
    sizes: ["S", "M", "L", "XL", "Free Size"]
  },
  kids_clothing: {
    name: "Kids Clothing (Age-based)",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y", "14-15Y"]
  },
  bra: {
    name: "Bras & Lingerie",
    sizes: ["32A", "32B", "32C", "34A", "34B", "34C", "36A", "36B", "36C", "38A", "38B", "38C"]
  }
};

const SizeFormatSelector = ({ selectedFormat, onFormatChange, disabled = false }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <span className="text-red-500">*</span> Select Size Format First
      </label>
      <select
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value)}
        disabled={disabled}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Choose a size format for this product...</option>
        {Object.entries(sizeFormats).map(([key, format]) => (
          <option key={key} value={key}>
            {format.name}
          </option>
        ))}
      </select>
      
      {selectedFormat && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Available sizes for {sizeFormats[selectedFormat].name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {sizeFormats[selectedFormat].sizes.map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <p className="mt-2 text-xs text-gray-500">
        You must select a size format before you can choose individual sizes for your product.
      </p>
    </div>
  );
};

// Export the size formats for use in other components
export { sizeFormats };
export default SizeFormatSelector;