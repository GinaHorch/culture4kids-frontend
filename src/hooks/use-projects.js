import { useState, useEffect } from "react"; // Added useRef for caching
import getProjects from "../api/get-projects";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [nextPage, setNextPage] = useState(null); // Tracks next page URL
  const [previousPage, setPreviousPage] = useState(null); // Tracks previous page URL
  
  // Function to fetch projects from the backend with caching logic. 
  const fetchProjects = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
        console.log("Fetching projects from:", url || "default endpoint");
        const response = await getProjects(url); // Pass URL for pagination

        if (response?.results && Array.isArray(response.results)) {
          setProjects(response.results); // Update project data
          setNextPage(response.next); // Set next page URL
          setPreviousPage(response.previous); // Set previous page URL
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

  // Navigation functions for pagination
  const fetchNextPage = () => {
    if (nextPage) {
      fetchProjects(nextPage);
    }
  };

  const fetchPreviousPage = () => {
    if (previousPage) {
      fetchProjects(previousPage);
    }
  };
 
  // Finally, we return the state variables and functions for external use
  return { 
    projects, 
    nextPage,
    previousPage,
    isLoading, 
    error, 
    fetchNextPage, // Expose for "Next" button
    fetchPreviousPage, // Expose for "Previous" button
  };
}