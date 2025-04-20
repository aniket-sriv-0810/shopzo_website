import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AllCategories from "../../components/Category/AllCategory/AllCategory";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ShowVendorCategory from "../../components/Vendors/VendorShow/ShowVendorCategory";
import Review from "../../components/Review/Review";
import AllReviews from "../../components/Review/AllReviews";
import ReviewCount from '../../components/Review/ReviewCount'
const ShowVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchVendorDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account`,
        {
          withCredentials: true,
        }
      );
      console.log("vendor => " ,res.data.data.vendorInfo.reviews);
      setVendor(res.data.data.vendorInfo);
    } catch (err) {
      console.error("❌ Error fetching vendor:", err);
      setError(err.response?.data?.message || "Failed to fetch vendor.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-10">
          <SkeletonForm/>
        </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <>
    <div className="bg-gray-100">
      <Navbar/>
    </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 border-b-4 border-indigo-600 inline-block pb-2">
          Vendor Profile
        </h1>

        {/* Profile Section */}
        <div className="bg-white shadow-gray-500 border border-gray-300 rounded-2xl shadow-lg p-8 grid md:grid-cols-2 gap-12">
          {/* Vendor Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-40 h-40 rounded-full object-cover shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105 shadow-gray-500"
              />
             
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-800">{vendor.name}</h2>
              <p className="text-lg text-gray-500">@{vendor.username}</p>
              <div className="mx-3">
              <ReviewCount id={id}/>
              </div>
            </div>
          </div>

          {/* Vendor Details */}
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-800">{vendor.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium text-gray-800">{vendor.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Address</p>
              <p className="text-base font-medium text-gray-800">
                {vendor.address.area}, {vendor.address.city}, {vendor.address.pincode}, {vendor.address.state}, {vendor.address.country}
              </p>
            </div>
          </div>
        </div>
      </div>

       {/* Vendor's Categories */}
       <section className=" mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Categories Listed by this Vendor
        </h2>
        <ShowVendorCategory />
      </section>
      

    <Review/>

      <AllReviews vendorId={id} />
      <div className="mt-20">
        <Footer/>
      </div>
    </>
  );
};

export default ShowVendor;
