// src/components/vendor/VendorProducts.jsx
import React, { useEffect, useState } from "react";
import axios from 'axios';
const VendorProduct = ({ vendorId, categoryTitle, tag }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/products`,
          {
            params: {
              categoryTitle,
              tag,
            },
        },
        {withCredentials :true},
        );
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {

        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId && categoryTitle && tag) {
      fetchVendorProducts();
    }
  }, [vendorId, categoryTitle, tag]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded shadow p-4 hover:shadow-lg transition"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-500 capitalize">
            {product.category.title} • {product.tag}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VendorProduct;
