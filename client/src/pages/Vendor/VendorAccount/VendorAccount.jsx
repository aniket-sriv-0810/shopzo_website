import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import VendorProfile from "../../../components/Vendors/VendorAccount/VendorProfile";
import VendorDetailsForm from "../../../components/Vendors/VendorAccount/VendorDetailsForm";
import VendorActions from "../../../components/Vendors/VendorAccount/VendorActions";
import SkeletonForm from "../../../components/LoadingSkeleton/SkeletonForm";
import ErrorPopup from "../../../components/Popups/ErrorPopUp";

const VendorAccount = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchVendorDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account`,
        { withCredentials: true }
      );
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
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <VendorNavbar />
      </div>
      <div className="bg-gray-50 h-max">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <SkeletonForm />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
            <VendorProfile vendor={vendor} />
            <div className="flex-1 px-4 md:px-10 py-8 bg-white">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 tracking-wide">
                  Vendor Account
                </h2>
                {vendor ? (
                  <>
                    <VendorDetailsForm vendor={vendor} />
                    <div className="mt-8">
                      <VendorActions navigate={navigate} />
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 text-lg">Vendor details not found.</p>
                )}

                {error && !loading && (
                  <ErrorPopup
                    message={error}
                    onClose={() => {
                      setError("");
                      navigate("/");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorAccount;
