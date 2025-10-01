import React, { useState } from "react";
import InputField from "./InputField";
import { validateForm } from "./validateForm";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../components/UserContext/userContext";
import { authAxios } from "../../../utils/auth";

const Signup = () => {
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateForm(formData, ["name", "email", "phone", "password"]);
    if (!agreeToTerms) validationErrors.agreeToTerms = "You must agree to the terms.";

    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }

    try {
      setLoading(true);
      const res = await authAxios.post(
        `/api/user/register`,
        formData
      );
      setUser(res.data.data.user);
      navigate("/auth/successfully");
    } catch (err) {
      const details = err.response?.data?.details;
    
      // If server returns specific field errors
      if (Array.isArray(details)) {
        const fieldErrors = {};
        details.forEach((msg) => {
          if (msg.toLowerCase().includes("email")) {
            fieldErrors.email = msg;
          } else if (msg.toLowerCase().includes("phone")) {
            fieldErrors.phone = msg;
          } else {
            fieldErrors.general = msg;
          }
        });
    
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      } else {
        setServerError(err.response?.data?.message || "Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-700 via-purple-800 to-gray-800 px-4">
      <div className="w-full max-w-lg bg-white/18 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/20 p-8 sm:p-10">
        <h2 className="text-2xl font-extrabold text-white text-center mb-6 tracking-tight">
          Create your Account
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={FaUser}
            error={errors.name}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={FaEnvelope}
            error={errors.email}
          />
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={FaPhoneAlt}
            error={errors.phone}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Set a 6 digit strong password"
            icon={FaLock}
            error={errors.password}
          />

          {/* Terms & Conditions */}
          <div className="flex items-start gap-2 text-sm text-white">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 accent-blue-500 scale-125"
            />
            <label htmlFor="agreeToTerms">
              I agree to all the{" "}
              <Link
                to="/policies"
                target="_blank"
                className="text-yellow-400 font-semibold hover:underline"
              >
                Terms & Conditions
              </Link>
              {" "}of The Shopzo
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.agreeToTerms}</p>
          )}

          {serverError && (
            <p className="text-red-500 text-center text-sm font-medium">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-3 rounded-xl font-bold tracking-wide shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? ( 
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing up...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
