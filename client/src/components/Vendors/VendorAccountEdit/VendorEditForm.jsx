import React from "react";
import { FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const VendorEditForm = ({ vendorData, handleChange, handleSubmit, isLoading, fieldErrors }) => {
  const fields = [
    { name: "name", label: "Name", icon: <FaUser /> },
    { name: "username", label: "Username", icon: <FaUser /> },
    { name: "email", label: "Email", icon: <FaEnvelope /> },
    { name: "phone", label: "Phone", icon: <FaPhone /> },
  ];

  const addressFields = [
    "area", "city", "pincode", "state", "country"
  ];

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {fields.map(({ name, label, icon }) => (
        <div key={name}>
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
            <span className="mr-3 text-indigo-600">{icon}</span>
            <input
              type="text"
              name={name}
              value={vendorData[name]}
              onChange={handleChange}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
          {fieldErrors[name] && <p className="text-red-500 text-xs">{fieldErrors[name]}</p>}
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addressFields.map((field) => (
          <div key={field}>
            <label className="text-sm font-semibold text-gray-700 capitalize">{field}</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
              <FaMapMarkerAlt className="text-indigo-600 mr-3" />
              <input
                type="text"
                name={field}
                value={vendorData.address[field]}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>
            {fieldErrors[`address.${field}`] && (
              <p className="text-red-500 text-xs">{fieldErrors[`address.${field}`]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-xl text-white font-semibold flex justify-center items-center gap-2 shadow-lg ${
          isLoading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FaCheckCircle /> Save Changes
          </>
        )}
      </button>
    </form>
  );
};

export default VendorEditForm;
