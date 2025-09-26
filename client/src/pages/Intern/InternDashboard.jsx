import React, { useState, useEffect } from 'react';
import { useUser } from '../../components/UserContext/userContext';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStore, FaBoxOpen, FaTags } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/white-website-logo.png';

// Mock user for testing without authentication
const mockUser = {
  _id: 'mock-intern-id',
  name: 'Test Intern',
  email: 'intern@test.com',
  role: 'intern'
};

const InternDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      // For demo purposes, create mock data when API fails
      const mockVendors = [
        {
          _id: '1',
          name: 'Demo Vendor 1',
          username: 'demo_vendor_1',
          email: 'vendor1@demo.com',
          phone: '1234567890',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          products: [],
          categories: []
        },
        {
          _id: '2',
          name: 'Demo Vendor 2',
          username: 'demo_vendor_2',
          email: 'vendor2@demo.com',
          phone: '0987654321',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          products: [],
          categories: []
        }
      ];
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/intern/vendors`,
          { withCredentials: true }
        );
        setVendors(response.data.data);
      } catch (apiError) {
        console.log('API not available, using mock data');
        setVendors(mockVendors);
      }
    } catch (err) {
      setError('Failed to fetch vendors');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/intern/vendors/${vendorId}`,
          { withCredentials: true }
        );
        fetchVendors(); // Refresh the list
      } catch (err) {
        setError('Failed to delete vendor');
        console.error('Error deleting vendor:', err);
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

  const filteredVendors = vendors.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [v.name, v.username, v.email]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link to="/">
                <img src={logo} alt="Shopzo" className="h-10 w-auto" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Intern Dashboard</h1>
                <p className="text-gray-600">Manage vendors and their products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => navigate('/logout')}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm"
                >
                  <span>Logout</span>
                </button>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm">Login</Link>
              )}
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm"
              >
                Home
              </Link>
              <Link
                to="/intern/vendors/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Vendor</span>
              </Link>
              <Link to={user ? `/user/${user._id}/account` : '/login'}>
                {user ? (
                  <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full border" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* removed toolbar - search moved to table header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaStore className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-semibold text-gray-900">{vendors.length}</p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {vendors.reduce((total, vendor) => total + (vendor.products?.length || 0), 0)}
                </p>
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
                  {new Set(vendors.flatMap(vendor => vendor.categories?.map(cat => cat._id) || [])).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">Vendors Management</h3>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-xs text-gray-500">
                Showing {filteredVendors.length} of {vendors.length}
              </div>
              <div className="relative w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vendors..."
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/intern/vendors/${vendor._id}/products`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={vendor.image}
                            alt={vendor.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{vendor.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.email}</div>
                      <div className="text-sm text-gray-500">{vendor.phone}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
