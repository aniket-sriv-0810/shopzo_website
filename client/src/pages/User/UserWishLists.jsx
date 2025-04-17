import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserWishlistProductCard from "../../components/User/UserWishlist/UserWishlistProductCard";
import UserNavbar from "../../components/Navbars/UserNavbar/UserNavbar";
import SkeletonList from '../../components/LoadingSkeleton/SkeletonList'
import NotAvailable from "../Loaders/NotAvailable";
const UserWishlists = () => {
  const { id } = useParams();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist
  useEffect(() => {
    if (!id) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${id}/account/wishlists`, {
          withCredentials: true,
        });

        const products = res?.data?.data?.wishlists || [];
        setWishlists(products);
      } catch (err) {
        setError("Failed to fetch wishlists");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [id]);



  if (error) return <div className="text-center">Error !</div>;

  return (
    <>
  <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
    <UserNavbar/>
  </div>
    <div className="bg-gray-100 h-max">


      {loading ? (
        <div className="flex-col justify-center items-center mt-10  md:flex-row">
         <SkeletonList/>
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <h2 className="text-center text-3xl font-bold text-gray-900 mt-10 mb-6">My Product Wishlists</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full px-6 md:px-10 lg:px-20 py-10">
            {wishlists.length > 0 ? (
              wishlists.map((product) => (
                <UserWishlistProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full  text-center text-lg font-semibold text-gray-700">
              <NotAvailable content={"No Product Found"} tagline={" Oops! It looks like your wishlist is empty . Why not explore our amazing collection and add something special to your list?"} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default UserWishlists;
