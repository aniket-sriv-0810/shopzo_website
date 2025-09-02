import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddVendor = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    area: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    image: null,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (["area", "city", "pincode", "state", "country"].includes(key)) {
        payload.append(`address[${key}]`, value);
      } else if (key === "image" && value) {
        payload.append("image", value);
      } else if (key !== "image") {
        payload.append(key, value);
      }
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/add-vendor`,
        payload,
        { withCredentials: true }
      );

      setMessage("Vendor added successfully!");
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        area: "",
        city: "",
        pincode: "",
        state: "",
        country: "",
        image: null,
      });
      setImagePreview(null);
      navigate("/saved/successfully");
    } catch (err) {
      const backendErrors = err?.response?.data?.errors || [];
      const newErrors = {};
      backendErrors.forEach((msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes("email")) newErrors.email = msg;
        else if (lower.includes("username")) newErrors.username = msg;
        else if (lower.includes("phone")) newErrors.phone = msg;
        else if (lower.includes("password")) newErrors.password = msg;
        else if (lower.includes("image")) newErrors.image = msg;
        else if (lower.includes("area")) newErrors.area = msg;
        else if (lower.includes("city")) newErrors.city = msg;
        else if (lower.includes("pincode")) newErrors.pincode = msg;
        else if (lower.includes("state")) newErrors.state = msg;
        else if (lower.includes("country")) newErrors.country = msg;
      });

      setErrors(newErrors);
      setMessage(err?.response?.data?.message || "Failed to add vendor.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
        placeholder={placeholder}
        className={`w-full p-3 rounded-lg border ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
      />
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-slate-100 px-4">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 sm:p-12 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Vendor</h2>

        {message && (
          <div
            className={`text-center text-sm font-semibold p-2 rounded ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderInput("Full Name", "name", "text", "Enter full name")}
          {renderInput("Username", "username", "text", "Choose a unique username")}
          {renderInput("Email", "email", "email", "Enter vendor email")}
          {renderInput("Phone", "phone", "tel", "e.g. +1 123 456 7890")}
          {renderInput("Set Password", "password", "password", "Create a password")}
          {renderInput("Area", "area", "text", "Enter area/street")}
          {renderInput("City", "city", "text", "Enter city")}
          {renderInput("Pincode", "pincode", "text", "Enter postal code")}
          {renderInput("State", "state", "text", "Enter state")}
          {renderInput("Country", "country", "text", "Enter country")}

          {/* Image Upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border ${
                errors.image ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            />
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 rounded-lg max-h-48 border shadow"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Add Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
