import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { authAxios } from "../../utils/auth";
const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "", // can be URL or File
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState(null);
  // Fetch existing category data
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await authAxios.get(`/api/admin/category/${id}`);
        const { title, description, image } = response.data?.data?.category || {};
        setFormData({ title, description, image });
        setPreviewImage(image);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch category details");
      }finally{
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit updated category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = new FormData();
      if (formData.title) updatedData.append("title", formData.title);
      if (formData.description) updatedData.append("description", formData.description);
      if (formData.image && formData.image instanceof File) {
        updatedData.append("image", formData.image);
      }
      

      const res = await authAxios.put(`/api/admin/category/${id}/edit`, updatedData);

      navigate("/admin/categories"); // adjust path as needed
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    {
      loading ? (

      <div className='flex justify-center items-center mt-10'>
      <SkeletonForm/>
    </div>
      )
    :
    error ? (
        <div className="text-center text-red-600 font-medium"><ErrorPopup
            message={error}
            onClose={() => {
              setError("");
              navigate("/admin"); // Optional: redirect or reload logic
            }}
          /></div>
    ) :
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-12 px-4 flex justify-center items-center">
    <div className="w-full max-w-2xl p-8 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Edit Category</h2>
  
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 shadow-sm"
            placeholder="Enter category title"
          />
        </div>
  
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 shadow-sm"
            placeholder="Enter category description"
          ></textarea>
        </div>
  
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-3 w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          )}
        </div>
  
        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Updating...
              </div>
            ) : (
              "Update Category"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
  }
    </>
  
);
};

export default EditCategory;
