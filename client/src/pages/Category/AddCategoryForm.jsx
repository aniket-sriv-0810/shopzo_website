import React, { useState } from "react";
import axios from "axios";
import InputField from "../../components/Category/AddCategory/InputField";
import ErrorMessage from "../../components/Category/AddCategory/ErrorMessage";
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.tag) errors.tag = "Tag is required.";
    if (!formData.image) errors.image = "Image is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tag", formData.tag);
    data.append("image", formData.image);

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/add-category`,
        data,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setSuccessMsg("✅ Category added successfully!");
        setFormData({ title: "", description: "", tag: "", image: null });
        setImagePreview(null);
        setTimeout(() => navigate("/saved/successfully"), 1000);
      }
    } catch (err) {
      const details = err.response?.data?.details;
      const msg = err.response?.data?.message || "Failed to add category!";
      const backendErrors = details
        ? details.reduce((acc, curr) => {
            if (curr.toLowerCase().includes("title")) acc.title = curr;
            else if (curr.toLowerCase().includes("tag")) acc.tag = curr;
            else acc.global = curr;
            return acc;
          }, {})
        : { global: msg };
      setFormErrors(backendErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-3xl shadow-2xl space-y-10 transition-all duration-300 border border-gray-100"
  >
    <h2 className="text-3xl sm:text-4xl font-bold text-center text-green-700 tracking-tight">
      Create New Category
    </h2>
  
    {formErrors.global && <ErrorMessage message={formErrors.global} />}
    {successMsg && (
      <div className="flex items-center justify-center bg-green-50 border border-green-300 text-green-700 py-3 px-5 rounded-lg shadow-sm text-sm font-medium transition-all">
        {successMsg}
      </div>
    )}
  
    <div className="space-y-6">
      <InputField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={formErrors.title}
      />
  
      <InputField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={formErrors.description}
        textarea
      />
  
      {/* Tag Selector */}
      <div className="flex flex-col gap-1">
        <label htmlFor="tag" className="text-gray-800 font-medium mb-1">
          Tag <span className="text-red-500">*</span>
        </label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          className={`p-3 rounded-lg shadow-sm bg-white border focus:outline-none focus:ring-2 focus:ring-green-500 ${
            formErrors.tag ? "border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">Select a tag</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {formErrors.tag && <p className="text-sm text-red-500">{formErrors.tag}</p>}
      </div>
  
      {/* Image Upload */}
      <div className="flex flex-col gap-3">
        <label htmlFor="image" className="text-gray-800 font-medium">
          Upload Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleChange}
          className="file:px-4 file:py-2 file:border-0 file:rounded file:bg-green-100 file:text-green-800 hover:file:bg-green-200 transition duration-300 border border-gray-300 rounded-md p-2 bg-white"
        />
        {formErrors.image && <p className="text-sm text-red-500">{formErrors.image}</p>}
  
        {imagePreview && (
          <div className="mt-3 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl border border-gray-200 shadow-lg w-48 h-48 object-cover object-center"
            />
          </div>
        )}
      </div>
    </div>
  
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-3 rounded-xl font-semibold text-lg transition duration-300 shadow-lg ${
        isSubmitting
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-gradient-to-r from-teal-600 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 hover:cursor-pointer"
      }`}
    >
      {isSubmitting ? "Adding Category..." : "Add Category"}
    </button>
  </form>
  
  );
};

export default AddCategoryForm;
