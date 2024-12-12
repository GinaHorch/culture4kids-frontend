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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Signup failed");
    }

    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error("Error during signup:", error);
    throw error; // Re-throw the error for the SignupForm to handle
  }
}

export default postSignup;