import axios from "axios";
import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { FaEnvelope, FaUser, FaIdBadge, FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import { useUser } from "../../UserContext/userContext";
import { authAxios } from "../../../utils/auth";
const VendorInfo = () => {
 const [vendor, setVendor] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const { id } = useParams();
   const {user} = useUser();
  const fetchVendorDetails = async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get(`/api/vendor/${id}/account`);
      setVendor(data.data.vendorInfo);
    } catch (err) {
      setError("Error fetching vendor details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 text-center">
        Vendor Profile
      </h2>

      <div className="space-y-5 text-gray-700">
        <div className="flex items-center gap-4">
          <div className="text-blue-600 bg-blue-100 p-2 rounded-full">
            <FaUser />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Name</p>
            <p className="text-lg font-medium">{user.name || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-orange-600 bg-green-100 p-2 rounded-full">
            <FaUserAlt />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Username</p>
            <p className="text-lg font-medium">{user.username || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-green-600 bg-green-100 p-2 rounded-full">
            <FaEnvelope />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Email</p>
            <p className="text-lg font-medium">{user.email || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-pink-600 bg-pink-100 p-2 rounded-full">
            <FaPhoneAlt />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Phone</p>
            <p className="text-lg font-medium">{user.phone || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-yellow-600 bg-yellow-100 p-2 rounded-full">
            <FaIdBadge />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Vendor ID</p>
            <p className="text-lg font-medium break-all">{user._id || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorInfo;
