import React, { useState } from 'react';
import AdminBooking from './AdminBooking';
import AdminDelivery from './AdminDelivery';

const AdminOrders = () => {
    const [activeTab, setActiveTab] = useState('bookings');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-6">
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => handleTabChange('bookings')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === 'bookings'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    In-Store Orders
                </button>
                <button
                    onClick={() => handleTabChange('deliveries')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === 'deliveries'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Delivery Orders
                </button>
            </div>

            {/* Conditionally render the active component */}
            {activeTab === 'bookings' ? <AdminBooking /> : <AdminDelivery />}
        </div>
    );
};

export default AdminOrders;