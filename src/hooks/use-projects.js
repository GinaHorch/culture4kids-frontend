import { useState, useEffect, useRef } from "react"; // Added useRef for caching
import getProjects from "../api/get-projects";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  // We also create a state variable called isLoading and error to keep track of the loading state and any errors that might occur.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  // Cache reference to store API response
  const cacheRef = useRef(null);

  // Function to fetch projects from the backend with caching logic. 
  const fetchProjects = async () => {
    // Check if data is already cached
    if (cacheRef.current) {
      console.log("Using cached projects data");
      setProjects(cacheRef.current); // Use cached data
      setIsLoading(false);
      return;
    }
  
    // Make API call if no cache exists
    setIsLoading(true);
    try {
      console.log("Fetching projects from API...");
      const response = await getProjects(); // Fetch projects from backend
      console.log("Full response from backend:", response); // Debug full response

      // Ensure the response has a `results` key and it's an array
      if (response?.results && Array.isArray(response.results)) {
        cacheRef.current = response.results; // Cache the results
        setProjects(response.results); // Update state with project data
      } else {
        console.error("Unexpected response format:", response);
        setProjects([]); // Fallback to an empty array in case of unexpected format
      }
    } catch (error) {
      console.error("Error fetching projects:", error); // Log error
      setError(error); // Update error state
    } finally {
      setIsLoading(false); // Always end the loading state
    }
  };
  
// Debounce mechanism to handle rapid re-fetch scenarios
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Function to refetch projects, wrapped in debounce
const refetch = debounce(() => {
  console.log("Clearing cache and refetching projects...");
  cacheRef.current = null; // Clear cache before re-fetching
  fetchProjects();
}, 300); // Adjust debounce delay as needed

  // We use the useEffect hook to fetch the projects from the API and update the state variables accordingly.
  // This useEffect will only run once, when the component this hook is used in is mounted.
  useEffect(() => {
    fetchProjects();      
  }, []); // Empty dependency array ensures this runs only on mount

  // Finally, we return the state variables and functions for external use
  return { projects, isLoading, error, refetch };
}