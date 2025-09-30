import React from "react";
import FormGroup from "../../FormGroup/FormGroup";
import { FaIdCard, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

const UserDetailsForm = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormGroup
          label="User ID"
          type="text"
          value={user._id || ""}
          readOnly
          icon={<FaIdCard className="text-gray-400" />}
          className="text-sm font-mono"
        />
        <FormGroup
          label="Full Name"
          type="text"
          value={user.name || ""}
          readOnly
          icon={<FaUser className="text-gray-400" />}
          className="capitalize"
        />
        <FormGroup
          label="Phone Number"
          type="tel"
          value={user.phone || "Not provided"}
          readOnly
          icon={<FaPhone className="text-gray-400" />}
        />
        <FormGroup
          label="Email Address"
          type="email"
          value={user.email || ""}
          readOnly
          icon={<FaEnvelope className="text-gray-400" />}
          className="lowercase"
        />
      </div>
      
      {/* Additional user information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Account Status
            </label>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {user.role || 'User'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
