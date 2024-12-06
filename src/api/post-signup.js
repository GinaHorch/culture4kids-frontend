import axios from "axios"; // Use axios for making HTTP requests

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

async function postSignup(signupData) {
  try {
    // Send the signup request to the backend
    const response = await axios.post(`${API_BASE_URL}/signup/`, signupData);
     

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors (e.g., user already exists, invalid data)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Signup failed");
    } else {
      throw new Error("An error occurred during signup");
    }
  }
}

export default postSignup;
