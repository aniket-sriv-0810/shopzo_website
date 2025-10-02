import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from "axios";
import { useUser } from "../UserContext/userContext";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../../utils/auth";

const VendorLikeBtn = ({ vendorId }) => {
    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch vendor wishlist status
    useEffect(() => {
        const fetchVendorWishlistStatus = async () => {
            if (!user || !user._id) {
                setLoading(false);
                return;
            }

            try {
                const res = await authAxios.get(
                    `/api/user/${user._id}/account/vendor-wishlists`
                );

                const vendorWishlist = res.data?.data?.vendors || [];
                setIsLiked(vendorWishlist.some(v => v._id === vendorId));
            } catch (error) {
                console.error("Error checking vendor wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorWishlistStatus();
    }, [user, vendorId]);

    // Toggle vendor like
    const toggleVendorWishlist = async () => {
        if (!user || !user._id) {
            navigate("/user/login");
            return;
        }

        // Optimistic UI update
        setIsLiked(prev => !prev);

        try {
            await authAxios.post(`/api/user/${user._id}/account/wishlist`, { vendorId });
        } catch (error) {
            console.error("Error toggling vendor wishlist:", error);
            setIsLiked(prev => !prev); // Revert on error
        }
    };

    if (loading) return <FaRegHeart className="w-6 h-6 text-white animate-pulse" />;

    return (
        <button
            onClick={toggleVendorWishlist}
            className="cursor-pointer hover:scale-110 transition-all duration-150"
            title={isLiked ? "Remove from Favourites" : "Add to Favourites"}
        >
            {isLiked ? (
                <FaHeart className="text-red-600 w-6 h-6" />
            ) : (
                <FaRegHeart className="text-white w-6 h-6" />
            )}
        </button>
    );
};

export default VendorLikeBtn;
