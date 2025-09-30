import React from "react";

const FormGroup = ({ 
  label, 
  type = "text", 
  value, 
  readOnly = false, 
  icon, 
  className = "",
  placeholder,
  onChange,
  name,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value || ""}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${readOnly ? 'cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default FormGroup;