import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../components/UserContext/userContext";
import UserProfileImage from "../../components/User/UserAccountEdit/UserProfileImage";
import UserAccountForm from "../../components/User/UserAccountEdit/UserAccountForm";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import  validateEditForm  from "../../components/User/UserAccountEdit/editValidator";
import { authAxios } from "../../utils/auth";
const UserAccountEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [orgImage, setOrgImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await authAxios.get(`/api/user/${id}/account`);
        const userInfo = response.data.data.userInfo;
        setUserData({
          name: userInfo.name || "",
          phone: userInfo.phone || "",
          email: userInfo.email || "",
        });
        setOrgImage(userInfo.image || "/default-avatar.png");
      } catch (err) {
        setError("Unable to fetch user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOrgImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setError("");
  
    const validationErrors = validateEditForm(userData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }
  
    setSubmitLoading(true);
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (image) formData.append("image", image);
  
    try {
      await authAxios.put(`/api/user/${id}/account/edit`, formData);
      navigate(`/user/${id}/account`);
    } catch (err) {
      const message = err?.response?.data?.message;
    
      if (message) {
        // Map specific backend error messages to field errors
        if (message.toLowerCase().includes("email")) {
          setFieldErrors({ email: message });
        } else if (message.toLowerCase().includes("phone")) {
          setFieldErrors({ phone: message });
        } else {
          setError(message);
        }
      } else {
        setError("Failed to update user. Please try again.");
      }
    }finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 bg-gray-100">
        <SkeletonForm/>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-100 to-zinc-300 px-4 py-10">
    <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-center">
        <h1 className="text-4xl font-bold text-white">Edit Your Profile</h1>
        <p className="text-sm text-indigo-100 mt-1">Keep your information up-to-date</p>
      </div>
  
      <UserProfileImage orgImage={orgImage} handleImageChange={handleImageChange} />
  
      <UserAccountForm
        userData={userData}
        handleChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={submitLoading}
        fieldErrors={fieldErrors}
      />
  
      {error && (
        <div className="text-center text-red-600 font-semibold text-sm pb-4">{error}</div>
      )}
    </div>
  </div>
  );
};

export default UserAccountEdit;
