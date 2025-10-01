import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VendorProductTable from "../../../components/Vendors/VendorProducts/VendorProductTable";
import SkeletonTable from "../../../components/LoadingSkeleton/SkeletonTable";
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import { authAxios } from "../../../utils/auth";
import AdminSearchBar from "../../../components/Admin/AdminSearchBar/AdminSearchBar";

const VendorProducts = () => {
  const { id } = useParams(); // vendor ID
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendorProducts = async () => {
    try {
      const res = await authAxios.get("/api/vendor/products");
      if (res.data?.status === "success") {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
      } else {
        setError("No products found.");
      }
    } catch (err) {
      setError("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(lower) ||
        p._id?.toLowerCase().includes(lower)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [id]);

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <VendorNavbar />
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
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <>
            <AdminSearchBar
              placeholder="Search products by name or ID..."
              onSearch={handleSearch}
            />
            <VendorProductTable
              products={filteredProducts}
              vendorId={id}
              onPriceUpdate={() => fetchVendorProducts()}
            />
          </>
        )}
      </div>
    </>
  );
};

export default VendorProducts;
