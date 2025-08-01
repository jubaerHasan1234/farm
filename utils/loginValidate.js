const loginValidate = (data) => {
  const newErrors = {};

  // Custom validation for email
  if (!data.email) {
    newErrors.email = "Email is required";
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    newErrors.email = "Invalid email";
  }

  // Custom validation for password
  if (!data.password) {
    newErrors.password = "Password is required";
  } else if (data.password.length < 5) {
    newErrors.password = "Password must be at least 5 characters";
  }

  // Custom validation for remember me checkbox
  // Assuming you want to require it to be checked for this validation
  if (!data.remember) {
    newErrors.remember = "You must agree to remember me";
  }

  return newErrors;
};

export default loginValidate;
