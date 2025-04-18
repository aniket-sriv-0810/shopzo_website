// utils/editValidator.js

const editValidator = (vendorData) => {
    const errors = {};
  
    // Validate Name
    if (!vendorData.name.trim()) {
      errors.name = "Name is required";
    } else if (vendorData.name.length < 3 || vendorData.name.length > 30) {
      errors.name = "Name must be between 3 and 30 characters";
    }
  
    // Validate Username
    if (!vendorData.username.trim()) {
      errors.username = "Username is required";
    } else if (vendorData.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }
  
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!vendorData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(vendorData.email)) {
      errors.email = "Invalid email format";
    }
  
    // Validate Phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!vendorData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(vendorData.phone)) {
      errors.phone = "Phone must be a valid 10-digit number";
    }
  
    // Address Validation
    const address = vendorData.address || {};
    if (!address.area || !address.area.trim()) {
      errors["address.area"] = "Area is required";
    }
    if (!address.city || !address.city.trim()) {
      errors["address.city"] = "City is required";
    }
    if (!address.pincode || !address.pincode.trim()) {
      errors["address.pincode"] = "Pincode is required";
    }
    if (!address.state || !address.state.trim()) {
      errors["address.state"] = "State is required";
    }
    if (!address.country || !address.country.trim()) {
      errors["address.country"] = "Country is required";
    }
  
    return errors;
  };
  
  export default editValidator;
  