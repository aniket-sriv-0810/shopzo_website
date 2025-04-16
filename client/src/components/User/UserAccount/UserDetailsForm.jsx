import React from "react";

const UserDetailsForm = ({ user }) => {
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-4"
      data-aos="fade-up"
    >
      {/* ID */}
      <FormGroup label="User ID" value={user?._id} />

      {/* Name */}
      <FormGroup label="Name" value={user?.name} />

      {/* Phone */}
      <FormGroup label="Phone" value={user?.phone} />

      {/* Email */}
      <FormGroup label="Email" value={user?.email} />
    </form>
  );
};

const FormGroup = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

export default UserDetailsForm;
