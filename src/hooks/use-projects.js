import { useState, useEffect } from "react"; // Added useRef for caching
import getProjects from "../api/get-projects";

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  console.log("Projects State in useProjects:", projects);
  
  // Function to fetch projects from the backend with caching logic. 
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    let allProjects = [];
    let nextPage = `${import.meta.env.VITE_API_URL}/projects/`;

    try {
      while (nextPage) {
        const response = await fetch(nextPage);
        const data = await response.json();

        console.log("Data from fetchProjects in use-projects:", data);  

        if (Array.isArray(data.results)) {
          allProjects = [...allProjects, ...data.results];
          nextPage = data.next; // URL for the next page
        } else {
          console.error("Unexpected data format in use-projects Hook", data);
          break;
        }
      }
        setProjects(allProjects);
        console.log("Check if all projects have been fetched:", allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectLocally = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? { ...project, ...updatedProject } : project
        )
      );
    };

useEffect(() => {
  fetchProjects(); // Initial fetch when component mounts
}, []);

console.log("useProjects returning:", { 
  projects, 
  isLoading, 
  error, 
  fetchProjects,
  updateProjectLocally, 
});

   // Finally, we return the state variables and functions for external use
  return { 
    projects, 
    isLoading, 
    error, 
    fetchProjects,
    updateProjectLocally,
  };
}

export default useProjects;