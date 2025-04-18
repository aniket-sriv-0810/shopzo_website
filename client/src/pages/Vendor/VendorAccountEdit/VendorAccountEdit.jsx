import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VendorEditForm from "../../../components/Vendors/VendorAccountEdit/VendorEditForm";
import VendorImageUpload from "../../../components/Vendors/VendorAccountEdit/VendorImageUpload";
import editValidator from "../../../components/Vendors/VendorAccountEdit/editValidator";
import SkeletonForm from "../../../components/LoadingSkeleton/SkeletonForm";

const VendorAccountEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendorData, setVendorData] = useState({
    name: "", username: "", email: "", phone: "",
    address: { area: "", city: "", pincode: "", state: "", country: "" }
  });

  const [orgImage, setOrgImage] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/${id}/account`, {
          withCredentials: true,
        });
        const v = data.data.vendorInfo;
        setVendorData({ ...v, address: { ...v.address } });
        setOrgImage(v.image);
      } catch (err) {
        setError("Error fetching vendor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in vendorData.address) {
      setVendorData({ ...vendorData, address: { ...vendorData.address, [name]: value } });
    } else {
      setVendorData({ ...vendorData, [name]: value });
    }
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
    setError("");
    setFieldErrors({});

    const validationErrors = editValidator(vendorData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setSubmitLoading(true);
    const formData = new FormData();
    for (const key in vendorData) {
      if (key === "address") {
        for (const a in vendorData.address) {
          formData.append(`address[${a}]`, vendorData.address[a]);
        }
      } else {
        formData.append(key, vendorData[key]);
      }
    }
    if (image) formData.append("image", image);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/edit`,
        formData,
        { withCredentials: true }
      );
      navigate(`/vendor/${id}/account`);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update.";
      if (message.toLowerCase().includes("email")) setFieldErrors({ email: message });
      else if (message.toLowerCase().includes("phone")) setFieldErrors({ phone: message });
      else setError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <SkeletonForm />;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">Edit Vendor Profile</h1>
          <p className="text-sm">Update your information below</p>
        </div>

        <VendorImageUpload orgImage={orgImage} handleImageChange={handleImageChange} />
        <VendorEditForm
          vendorData={vendorData}
          handleChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={submitLoading}
          fieldErrors={fieldErrors}
        />

        {error && <p className="text-center text-red-600 pb-4">{error}</p>}
      </div>
    </div>
  );
};

export default VendorAccountEdit;
