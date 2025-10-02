import React, { useEffect, useState } from "react";
import axios from "axios";
import DeliveryCard from "../../components/User/UserDelivery/UserDeliveryCard";
import { useUser } from "../../components/UserContext/userContext";
import SkeletonList from "../../components/LoadingSkeleton/SkeletonList";
import NotAvailable from "../Loaders/NotAvailable";
import { authAxios } from "../../utils/auth";

const UserDeliveryOrders = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchDeliveries = async () => {
    try {
      const res = await authAxios.get(`/api/user/${user._id}/delivery`);
      setDeliveries(res.data.data);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDeliveries();
    }
  }, [user]);

  // Function to handle successful delivery cancellation or deletion
  const handleSuccess = (deliveryId) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.filter((delivery) => delivery._id !== deliveryId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <SkeletonList />
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center text-lg font-semibold text-gray-700">
        <NotAvailable
          content={"No Delivery Orders Found"}
          tagline={
            "Oops! You haven't placed any delivery orders yet. Time to shop and get your items delivered!"
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {deliveries.map((delivery) => (
        <DeliveryCard
          key={delivery._id}
          delivery={delivery}
          userId={user._id}
          onCancelSuccess={handleSuccess}
        />
      ))}
    </div>
  );
};

export default UserDeliveryOrders;