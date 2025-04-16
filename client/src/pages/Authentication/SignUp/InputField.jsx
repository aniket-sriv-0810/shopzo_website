import React from "react";

const InputField = React.memo(({ label, name, type, value, onChange, error, placeholder, icon: Icon }) => {
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm text-white mb-1 font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 text-lg" />
        )}
        <input
          type={type}
          required
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-white/10 text-white placeholder:text-sm placeholder:text-gray-300 backdrop-blur-md px-4 py-2 pl-10 rounded-xl border ${
            error ? "border-red-500" : "border-white/20"
          } focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200`}
        />
      </div>
      {error && <p className="text-red-400 font-medium text-center text-xs mt-1 animate-fadeIn">{error}</p>}
    </div>
  );
});

export default InputField;
