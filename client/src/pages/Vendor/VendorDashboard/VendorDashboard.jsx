import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/UserContext/userContext";
import VendorInfo from "../../../components/Vendors/VendorDashboard/VendorInfo";
import VendorStat from "../../../components/Vendors/VendorDashboard/VendorStat";
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import { useParams } from "react-router-dom";
const VendorDashboard = () => {
  const { user } = useUser();
  const {id} = useParams();
  const [vendorData, setVendorData] = useState({
    productCount: 0,
    categoryCount: 0,
    bookingCount: 0,
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/dashboard`, {
        withCredentials: true,
      })
      .then((res) => setVendorData(res.data.data))
      .catch((err) => console.error("Error fetching vendor dashboard:", err));
  }, [user]);

  return (
    <>
  <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
    <VendorNavbar/>
  </div>
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 py-10 px-4 sm:px-10 space-y-10">
      <VendorInfo user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <VendorStat vendorData={vendorData} />
        </div>
      </div>
    </div>
    </>
  );
};

export default VendorDashboard;
