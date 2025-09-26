import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaBoxOpen, FaDollarSign, FaStore, FaTags } from 'react-icons/fa';
import logo from '../../assets/white-website-logo.png';
import { useUser } from '../../components/UserContext/userContext';

const VendorProducts = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchVendor();
  }, [vendorId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/intern/vendors/${vendorId}/products`,
        { withCredentials: true }
      );
      setProducts(response.data.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendor = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/intern/vendors`,
        { withCredentials: true }
      );
      const vendorData = response.data.data.find(v => v._id === vendorId);
      setVendor(vendorData);
    } catch (err) {
      console.error('Error fetching vendor:', err);
    }
  };

  const handleDeleteVendor = async () => {
    if (!vendorId) return;
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/intern/vendors/${vendorId}`,
          { withCredentials: true }
        );
        navigate('/intern/dashboard');
      } catch (err) {
        setError('Failed to delete vendor');
        console.error('Error deleting vendor:', err);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Note: You'll need to add a delete product endpoint to the intern controller
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/intern/vendors/${vendorId}/products/${productId}`,
          { withCredentials: true }
        );
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/intern/dashboard')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center gap-4">
              <Link to="/">
                <img src={logo} alt="Shopzo" className="h-8 w-auto" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vendor?.name || 'Vendor'} Products
                </h1>
                <p className="text-gray-600">Manage products for this vendor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/intern/vendors/${vendorId}/add-product`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
              <button
                onClick={handleDeleteVendor}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-1"
                title="Delete Vendor"
              >
                <FaTrash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaStore className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendor</p>
                <p className="text-base font-semibold text-gray-900">{vendor?.name || '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaBoxOpen className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaTags className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(products.map(p => p.category?._id || p.category)).size}
                </p>
              </div>
            </div>
          </div>

          
        </div>
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new product for this vendor.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate(`/intern/vendors/${vendorId}/add-product`)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    className="w-full h-48 object-cover"
                    src={product.images[0]}
                    alt={product.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        ₹{product.discountedPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {product.tag}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">
                      Category: {product.category?.title}
                    </span>
                    <span className="text-sm text-gray-600">
                      Sizes: {product.sizes.join(', ')}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;
