// utils/editValidator.js

 const validateEditForm = ({ name, phone, email }) => {
    const errors = {};
  
    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.length < 3 || name.length > 30) {
      errors.name = "Name must be between 3 and 30 characters";
    }
  
    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      errors.phone = "Invalid phone number format";
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }
  
    return errors;
  };
  export default validateEditForm