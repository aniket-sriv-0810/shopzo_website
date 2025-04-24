import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import InputField from "./InputField";
import { useUser } from "../../../components/UserContext/userContext";
import { FaUser } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import  validateLoginForm  from "./validateForm";

const VendorLoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [loginVendor, setLoginVendor] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginVendor((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validateLoginForm(loginVendor);
    if (Object.keys(errors).length > 0) {
      return setFormErrors(errors);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/login`,
        loginVendor,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const vendorData = response.data.data.vendor;
        setUser(vendorData);
        localStorage.setItem("vendor", JSON.stringify(vendorData));
        window.open(`/vendor/${vendorData._id}/account`, "_blank");
        setLoginVendor({ username: "", password: "" });
      }
    } catch (error) {
      const details = error.response?.data?.details;

      if (Array.isArray(details)) {
        const fieldErrors = {};
        details.forEach((msg) => {
          if (msg.toLowerCase().includes("username")) fieldErrors.username = msg;
          else if (msg.toLowerCase().includes("password")) fieldErrors.password = msg;
          else fieldErrors.general = msg;
        });
        setFormErrors((prev) => ({ ...prev, ...fieldErrors }));
      } else {
        setServerError(error.response?.data?.message || "Login failed. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-700 via-purple-800 to-gray-800 px-4">
      <div className="w-full max-w-lg bg-white/18 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/20 p-8 sm:p-10">
        <h2 className="text-2xl font-extrabold text-white text-center mb-6 tracking-tight">
          Welcome Back, Vendor
        </h2>
        <p className="text-sm text-center text-gray-300 mb-4">
          Please login to manage your store
        </p>

        {serverError && (
          <p className="text-red-500 text-center text-sm font-medium mb-2">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmitForm} noValidate className="space-y-6">
          <InputField
            label="Username"
            name="username"
            type="text"
            value={loginVendor.username}
            onChange={handleChange}
            placeholder="Enter your username"
            icon={FaUser}
            error={formErrors.username}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={loginVendor.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={BsShieldLockFill}
            error={formErrors.password}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-3 rounded-xl font-bold tracking-wide shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link to="/register/vendor" className="text-green-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorLoginForm;
