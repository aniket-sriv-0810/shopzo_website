import { useEffect, useState } from "react";
import { authAxios } from "../../../utils/auth";

const VendorDropdown = ({ value, onChange }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await authAxios.get('/api/vendor/all-vendors');
        setVendors(response.data.data || []);
      } catch (error) {
        setVendors([]);
      }
    };
    
    fetchVendors();
  }, []);

  return (
    <div className="form-group">
      <label htmlFor="vendor">Vendor:</label>
      <select
        id="vendor"
        name="vendor"
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select a vendor</option>
        {vendors.map((vendor) => (
          <option key={vendor._id} value={vendor._id}>
            {vendor.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VendorDropdown;
