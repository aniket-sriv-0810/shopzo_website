import React from "react";

const VendorDetailsForm = ({ vendor }) => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-4" data-aos="fade-up">
      <FormGroup label="Vendor ID" value={vendor?._id} />
      <FormGroup label="Name" value={vendor?.name} />
      <FormGroup label="Email" value={vendor?.email} />
      <FormGroup label="Phone" value={vendor?.phone} />
    </form>
  );
};

const FormGroup = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

export default VendorDetailsForm;
