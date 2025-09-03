import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorDeliveryTable from '../../../components/Vendors/VendorDelivery/VendorDeliveryTable';
import SkeletonTable from '../../../components/LoadingSkeleton/SkeletonTable';
import NotAvailable from '../../Loaders/NotAvailable';
import ErrorPopup from '../../../components/Popups/ErrorPopUp';
import { useNavigate, useParams } from 'react-router-dom';
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import AdminSearchBar from "../../../components/Admin/AdminSearchBar/AdminSearchBar";

const VendorDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: vendorId } = useParams();
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/account/all-deliveries`,
        { withCredentials: true }
      );
      setDeliveries(res.data.data);
      setFilteredDeliveries(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch delivery details');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredDeliveries(deliveries);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = deliveries.filter(
      (d) =>
        d.user?.name?.toLowerCase().includes(lower) ||
        d.deliveryId?.toLowerCase().includes(lower)
    );
    setFilteredDeliveries(filtered);
  };

  const handleDeleteSuccess = (deletedId) => {
    const updatedDeliveries = deliveries.filter(d => d.deliveryId !== deletedId);
    setDeliveries(updatedDeliveries);
    setFilteredDeliveries(updatedDeliveries);
  };

  useEffect(() => {
    if (vendorId) fetchDeliveries();
  }, [vendorId]);

  return (
    <>
      <div className="p-6">

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <SkeletonTable />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium">
            <ErrorPopup
              message={error}
              onClose={() => {
                setError('');
                navigate('/vendor');
              }}
            />
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center text-gray-600 font-medium">
            <NotAvailable
              content={'No Delivery data Found'}
              tagline={'Oops! It looks like your delivery data is empty'}
            />
          </div>
        ) : (
          <>
            <AdminSearchBar
              placeholder="Search deliveries by customer or Delivery ID..."
              onSearch={handleSearch}
            />
            <VendorDeliveryTable
              deliveries={filteredDeliveries}
              onDelete={handleDeleteSuccess}
            />
          </>
        )}
      </div>
    </>
  );
};

export default VendorDeliveries;
