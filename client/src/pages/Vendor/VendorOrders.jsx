import React, { useState } from "react";
import VendorNavbar from "../../components/Navbars/VendorNavbar/VendorNavbar";
import VendorBookings from "./VendorBookings/VendorBookings";
import VendorDeliveries from "./VendorDelivery/VendorDeliveries";

const VendorOrders = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <VendorNavbar />
      </div>

      <div className="p-6">
        <h2 className="text-2xl text-center font-bold mb-9">
          All Orders Received
        </h2>

        {/* Tab Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleTabChange("bookings")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "bookings"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            In-Store Orders
          </button>
          <button
            onClick={() => handleTabChange("deliveries")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "deliveries"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Delivery Orders
          </button>
        </div>

        {/* Conditionally render the active component */}
        {activeTab === "bookings" ? <VendorBookings /> : <VendorDeliveries />}
      </div>
    </>
  );
};

export default VendorOrders;
