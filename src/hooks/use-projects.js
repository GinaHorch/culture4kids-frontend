import { useState, useEffect } from "react"; // Added useRef for caching
import getProjects from "../api/get-projects";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  
  // Function to fetch projects from the backend with caching logic. 
  const fetchProjects = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
        console.log("Fetching projects from:", url || "default endpoint");
        const response = await getProjects(url); // Pass URL for pagination

        if (response?.results && Array.isArray(response.results)) {
          setProjects(Array.isArray(response?.results) ? response.results : []);
          console.log("Fetched projects response:", response);
        } else {
          console.error("Unexpected response format:", response);
          setProjects([]); // Fallback for empty results
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
   // We use the useEffect hook to fetch the projects from the API and update the state variables accordingly.
   useEffect(() => {
    const initialUrl = `${import.meta.env.VITE_API_URL}/projects/`;
    fetchProjects(initialUrl);      
}, []); // Empty dependency array ensures this runs only on mount

   // Finally, we return the state variables and functions for external use
  return { 
    projects, 
    isLoading, 
    error, 
  };
}