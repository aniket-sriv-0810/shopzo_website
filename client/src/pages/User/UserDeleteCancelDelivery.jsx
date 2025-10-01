import React from "react";
import { authAxios } from "../../utils/auth";
import { MdDeleteForever } from "react-icons/md";
import { useUser } from "../../components/UserContext/userContext";

const UserDeleteCancelledDelivery = ({ deliveryId, onDeleted }) => {
  const { user } = useUser();

  const handleDelete = async () => {
    try {
      await authAxios.delete(`/api/user/${user._id}/account/deliveries/${deliveryId}`);
      onDeleted?.();
    } catch (err) {
      console.log("error => ", err);
      alert(err.response?.data?.message || "Error deleting cancelled delivery");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-3 rounded-full hover:scale-110 hover:cursor-pointer"
    >
      <MdDeleteForever className="text-2xl" />
    </button>
  );
};

export default UserDeleteCancelledDelivery;