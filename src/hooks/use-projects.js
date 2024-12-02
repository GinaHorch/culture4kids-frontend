import { useState, useEffect, useRef } from "react"; // Added useRef for caching

import getProjects from "../api/get-projects";

export default function useProjects() {
  // Here we use the useState hook to create a state variable called projects and a function to update it called setProjects. We initialize the state variable with an empty array.
  const [projects, setProjects] = useState([]);

  // We also create a state variable called isLoading and error to keep track of the loading state and any errors that might occur.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  // Cache reference to store API response
  const cacheRef = useRef(null);

  // Function to fetch projects with caching
  const fetchProjects = () => {
    // Check if data is already cached
    if (cacheRef.current) {
      console.log("Using cached projects data");
      setProjects(cacheRef.current); // Use cached data
      setIsLoading(false);
      return;
    }
  
  // Make API call if no cache
    setIsLoading(true);
    getProjects()
        .then((response) => {
          console.log("Full response from backend:", response); // Log the full response
          if (response?.results && Array.isArray(response.results)) {
            cacheRef.current = response.results; // Cache the results
            setProjects(response.results); // Use the `results` key
          } else {
            console.error("Unexpected response format:", response);
            setProjects([]); // Fallback to an empty array
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
          setError(error);
          setIsLoading(false);
        });
    };
  
// Debounce mechanism (if needed for rapid re-fetch scenarios)
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
  cacheRef.current = null; // Clear cache before re-fetching
  fetchProjects();
}, 300); // Adjust debounce delay as needed

  // We use the useEffect hook to fetch the projects from the API and update the state variables accordingly.
  // This useEffect will only run once, when the component this hook is used in is mounted.
  useEffect(() => {
    fetchProjects()
      .then((response) => {
        console.log("Full response from backend:", response); // Log the full response
        if (response?.results && Array.isArray(response.results)) {
          setProjects(response.results); // Use the `results` key
        } else {
          console.error("Unexpected response format:", response);
          setProjects([]); // Fallback to an empty array
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  // Finally, we return the state variables and the error. As the state in this hook changes it will update these values and the component using this hook will re-render.
  return { projects, isLoading, error, refetch };
}