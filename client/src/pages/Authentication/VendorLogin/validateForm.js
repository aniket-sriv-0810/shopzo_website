 const validateLoginForm = (formData) => {
    const errors = {};
    const { username, password } = formData;
  
    if (!username.trim()) errors.username = "Username is required!";
    
    if (!password.trim()) errors.password = "Password is required!";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters!";
  
    return errors;
  };
  
  export default validateLoginForm;