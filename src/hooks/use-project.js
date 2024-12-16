import { useState, useEffect } from "react";
import getProject from "../api/get-project";

function useProject(projectId, projects = [], updateProjectLocally) {
  const [project, setProject] = useState(() => {
    const foundProject = projects.find((proj) => proj.id === projectId);
    console.log("Initial project found in local state:", foundProject);
    return foundProject;
  });
  
  const [isLoading, setIsLoading] = useState(!project); // Avoid loading if project is already in state
  const [error, setError] = useState();

  console.log("Current project state in use-project:", project);
  
  useEffect(() => {
    const updatedProject = projects.find((proj) => proj.id === projectId);
    if (updatedProject) {
      setProject(updatedProject);
    }
  }, [project, projects, projectId]);
  
  useEffect(() => {
    if (!project) {   // Fetch the project data if not available locally
      console.log("Fetching project from API, project not found locally:", projectId);
  
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProject(projectId); // Fetch the project data
        console.log("Project fetched from API in use-project:", fetchedProject);
        setProject(fetchedProject); // Update project state

        if (updateProjectLocally) {
          console.log("Updating local state with fetched project in use-project:", fetchedProject);
          updateProjectLocally(fetchedProject); // Update the local state
        }

      } catch (error) {
        console.error("Error fetching project:", error);
        setError(error); // Capture errors
      } finally {
        setIsLoading(false); // End the loading state
      }
    };

    fetchProject();
  } else {
    setIsLoading(false); // Ensure loading state is updated if project is found locally
   }
  }, [project, projectId, updateProjectLocally]);

  return { project, isLoading, error};
}

export default useProject;