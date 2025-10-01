import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VendorCard from "../../components/Vendors/VendorCard.jsx/VendorCard";
import UserNavbar from "../../components/Navbars/UserNavbar/UserNavbar";
import SkeletonList from '../../components/LoadingSkeleton/SkeletonList';
import NotAvailable from "../Loaders/NotAvailable";
import { authAxios } from "../../utils/auth";

const UserVendorWishlists = () => {
  const { id } = useParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchVendorWishlist = async () => {
      try {
        const response = await authAxios.get(`/api/user/${id}/vendor-wishlists`);
        const vendorList = res?.data?.data?.vendorWishlists || [];
console.log(vendorList);

        setVendors(res?.data?.data?.vendorWishlists || []);
      } catch (err) {
        setError("Failed to fetch vendor wishlists");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorWishlist();
  }, [id]);

  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <UserNavbar />
      </div>
      <div className="bg-gray-100 h-max">
        {loading ? (
          <div className="flex-col justify-center items-center mt-10 md:flex-row">
            <SkeletonList />
          </div>
        ) : (
          <div className="overflow-x-hidden">
            <h2 className="text-center text-3xl font-bold text-gray-900 mt-10 mb-6">My Favorite Vendors</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full px-6 md:px-10 lg:px-20 py-10">
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <VendorCard key={vendor._id} vendor={vendor} />
                ))
              ) : (
                <div className="col-span-full text-center text-lg font-semibold text-gray-700">
                  <NotAvailable
                    content={"No Vendor Found"}
                    tagline={
                      "Oops! You haven't added any vendors yet. Start exploring and discover your favorites!"
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserVendorWishlists;
