import React, { useState } from "react";
import UserNavbar from "../../components/Navbars/UserNavbar/UserNavbar";
import UserStoreOrders from "./UserBooking";
import UserDeliveryOrders from "./UserDelivery";

const UserOrders = () => {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <UserNavbar />
      </div>

      <div className="bg-gray-100 min-h-screen px-4 py-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mt-10 mb-7">
          My Orders
        </h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("store")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "store"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            In-Store Orders
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "delivery"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Delivery Orders
          </button>
        </div>

        {activeTab === "store" ? <UserStoreOrders /> : <UserDeliveryOrders />}
      </div>
    </>
  );
};

export default UserOrders;