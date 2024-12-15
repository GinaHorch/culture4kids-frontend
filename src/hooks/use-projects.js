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
    console.log("Updating project locally:", updatedProject);
    setProjects((prevProjects) =>
      Array.isArray(prevProjects)
        ? prevProjects.map((project) =>
            project.id === updatedProject.id 
            ? { ...project, ...updatedProject }
            : project
        )
      : [] // Fallback to prevent non-array issues
    );
};
const refetchProjects = async () => {
  try {
    await fetchProjects(); // Call the existing fetchProjects function
    console.log("Projects successfully refetched.");
  } catch (error) {
    console.error("Error refetching projects:", error);
  }
};

useEffect(() => {
  fetchProjects(); // Initial fetch when component mounts
}, []);

   // Finally, we return the state variables and functions for external use
  return { 
    projects, 
    isLoading, 
    error, 
    fetchProjects,
    updateProjectLocally,
    refetchProjects
  };
}

export default useProjects;