const validate = (values) => {
  const errors = {};
  if (!values.userType) errors.userType = "User type is required";
  if (!values.firstName) errors.firstName = "First name is required";
  if (!values.lastName) errors.lastName = "Last name is required";
  if (!values.email) errors.email = "Email is required";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
    errors.email = "Invalid email";
  if (!values.address) errors.address = "Address is required";
  if (!values.phone) errors.phone = "Phone is required";
  else if (values.phone.length < 13)
    errors.phone = "Phone number must be at least 11 characters";
  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 5)
    errors.password = "Password must be at least 5 characters";
  if (!values.confirmPassword) errors.confirmPassword = "Confirm your password";
  else if (values.password !== values.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  if (!values.bio) errors.bio = "Bio is required";
  else if (values.bio.length < 10)
    errors.bio = "Bio must be at least 10 characters";
  if (!values.terms) errors.terms = "You must agree to the terms";

  // Profile picture validation
  if (!values.profilePicture) {
    errors.profilePicture = "Profile picture is required";
  }

  return errors;
};
export default validate;
