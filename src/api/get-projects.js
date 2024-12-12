import { API_BASE_URL } from './api';

async function getProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}projects/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
          if (!response.ok) {
          const fallbackError = "Error fetching projects";

          // Attempt to parse the error response into JSON
          const data = await response.json().catch(() => {
            // If the response is not JSON then we will throw a generic error.
            throw new Error(fallbackError);
          });

      // If the error response *is* JSON, then we will include the info from that JSON in the error we throw. 
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
      }

      // Parse the response as JSON and return it
      return await response.json();
  } catch (error) {
      console.error("Error in getProjects:", error);
      throw error;
  }
}

export default getProjects;