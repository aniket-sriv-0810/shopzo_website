import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUpload, FaBoxOpen, FaTag, FaRupeeSign, FaImage } from 'react-icons/fa';
import logo from '../../assets/black-website-logo.png';
import { useUser } from '../../components/UserContext/userContext';
import SizeFormatSelector, { sizeFormats } from '../../components/Products/AddProduct/SizeFormatSelector';

const AddProduct = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    sizes: [],
    sizeFormat: '',
    category: '',
    tag: 'male',
    images: []
  });

  const { user } = useUser();

  useEffect(() => {
    fetchCategories();
    fetchVendor();
  }, []);

  const fetchCategories = async () => {
    try {
      // Mock categories for demo purposes
      const mockCategories = [
        {
          _id: '1',
          title: 'T-Shirts',
          description: 'Comfortable cotton t-shirts',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          tag: 'male'
        },
        {
          _id: '2',
          title: 'Dresses',
          description: 'Elegant women\'s dresses',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          tag: 'female'
        },
        {
          _id: '3',
          title: 'Jeans',
          description: 'Classic denim jeans',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          tag: 'male'
        },
        {
          _id: '4',
          title: 'Shirts',
          description: 'Formal and casual shirts',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          tag: 'male'
        },
        {
          _id: '5',
          title: 'Skirts',
          description: 'Stylish women\'s skirts',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          tag: 'female'
        },
        {
          _id: '6',
          title: 'Hoodies',
          description: 'Comfortable hooded sweatshirts',
          image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png',
          tag: 'male'
        }
      ];

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/intern/categories`,
          { withCredentials: true }
        );
        setCategories(response.data.data);
      } catch (apiError) {
        console.log('API not available, using mock categories');
        setCategories(mockCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchVendor = async () => {
    try {
      // Mock vendor for demo purposes
      const mockVendor = {
        _id: vendorId,
        name: 'Demo Vendor',
        username: 'demo_vendor',
        email: 'vendor@demo.com',
        phone: '1234567890',
        image: 'https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png'
      };

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/intern/vendors`,
          { withCredentials: true }
        );
        const vendorData = response.data.data.find(v => v._id === vendorId);
        setVendor(vendorData || mockVendor);
      } catch (apiError) {
        console.log('API not available, using mock vendor');
        setVendor(mockVendor);
      }
    } catch (err) {
      console.error('Error fetching vendor:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter(size => size !== value)
      }));
    }
  };

  const handleSizeFormatChange = (format) => {
    setFormData(prev => ({ 
      ...prev, 
      sizeFormat: format,
      sizes: [] // Reset sizes when format changes
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 7) {
      setError('Maximum 7 images allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.images.length === 0) {
      setError('At least one image is required');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.discountedPrice) >= parseFloat(formData.originalPrice)) {
      setError('Discounted price must be less than original price');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('originalPrice', formData.originalPrice);
      submitData.append('discountedPrice', formData.discountedPrice);
      submitData.append('sizes', JSON.stringify(formData.sizes));
      submitData.append('category', formData.category);
      submitData.append('tag', formData.tag);
      
      formData.images.forEach((image, index) => {
        submitData.append('images', image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/intern/vendors/${vendorId}/products`,
        submitData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        navigate(`/intern/vendors/${vendorId}/products`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate(`/intern/vendors/${vendorId}/products`)}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 justify-between w-full">
              <Link to="/">
                <img src={logo} alt="Shopzo" className="h-8 w-auto" />
              </Link>
              <div className="flex-1 ml-2">
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600">
                  Add product for {vendor?.name || 'vendor'}
                </p>
              </div>
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

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBoxOpen className="inline w-4 h-4 mr-2" />
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRupeeSign className="inline w-4 h-4 mr-2" />
                    Original Price *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter original price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRupeeSign className="inline w-4 h-4 mr-2" />
                    Discounted Price *
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter discounted price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTag className="inline w-4 h-4 mr-2" />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title} ({category.tag})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Tag *
                  </label>
                  <select
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Size Format Selection */}
            <div>
              <SizeFormatSelector 
                selectedFormat={formData.sizeFormat} 
                onFormatChange={handleSizeFormatChange} 
              />
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Sizes</h3>
              {!formData.sizeFormat ? (
                <p className="text-gray-500 text-sm">Please select a size format first to choose sizes.</p>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                  {sizeFormats[formData.sizeFormat]?.sizes?.map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        checked={formData.sizes.includes(size)}
                        onChange={handleSizeChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
              <div className="space-y-4">
                <div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <FaUpload className="w-4 h-4 mr-2" />
                      Upload Images (Max 7)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG or GIF (max 5MB each)
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(`/intern/vendors/${vendorId}/products`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
