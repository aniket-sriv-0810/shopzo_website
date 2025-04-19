import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountedPrice: "",
    sizes: [],
    tag: "male",
    images: [], // Default to empty array to avoid .map crash
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const sizeOptions = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
      const product = data.data.product;
  
      setFormData({
        title: product.title || "",
        description: product.description || "",
        discountedPrice: product.discountedPrice || "",
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        tag: product.tag || "male",
        images: Array.isArray(product.images) ? product.images : [],
      });
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = new FormData();
      sendData.append("title", formData.title);
      sendData.append("description", formData.description);
      sendData.append("discountedPrice", formData.discountedPrice);
      sendData.append("tag", formData.tag);
      formData.sizes.forEach((size) => sendData.append("sizes", size));
      newImages.forEach((img) => sendData.append("images", img));

      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/product/${id}/edit`, sendData, {
        withCredentials: true,
      });

      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) return <p className="text-center">Loading product...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium">Price (₹)</label>
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <label key={size} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium">Tag</label>
          <select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Current Images</label>
          <div className="grid grid-cols-3 gap-2">
            {(formData.images || []).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`product-${i}`}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium">Upload New Images (Max 7)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
