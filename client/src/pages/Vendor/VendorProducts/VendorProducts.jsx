import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VendorProductTable from "../../../components/Vendors/VendorProducts/VendorProductTable";
import SkeletonTable from "../../../components/LoadingSkeleton/SkeletonTable";
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import axios from "axios";

const VendorProducts = () => {
  const { id } = useParams(); // vendor ID
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendorProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/products-listed`, {
        withCredentials: true,
      });

      if (res.data?.status === "success") {
        setProducts(res.data.products);
      } else {
        setError("No products found.");
      }
    } catch (err) {
      setError("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [id]);

  return (
    <>
        <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
    <VendorNavbar/>
  </div>
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Vendor Products
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <SkeletonTable />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <VendorProductTable
  products={products}
  vendorId={id}
  onPriceUpdate={() => fetchVendorProducts()}
/>
      )}
    </div>
    </>
  );
};

export default VendorProducts;
