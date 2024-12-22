import { API_BASE_URL } from "./api";

async function postSignup(signupData) {
  try {
    const response = await fetch(`${API_BASE_URL}signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("API Response:", responseData);
      throw new Error(responseData.detail || "Signup failed. Please check your input.");
  }

    return responseData; // Return the parsed JSON response
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}

export default postSignup;