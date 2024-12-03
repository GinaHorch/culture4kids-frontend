import { useState, useEffect } from "react";

import getProject from "../api/get-project";

export default function useProject(projectId) {
  const [project, setProject] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  console.log("Project data:", project);
  
  useEffect(() => {
    // Reset loading and error state when projectId changes
    setIsLoading(true);
    setError(undefined);

    const fetchProject = async () => {
      try {
        const project = await getProject(projectId); // Fetch the project data
        setProject(project); // Update project state
      } catch (error) {
        setError(error); // Capture errors
      } finally {
        setIsLoading(false); // End the loading state
      }
    };

    fetchProject();

    // This time we pass the projectId to the dependency array so that the hook will re-run if the projectId changes.
  }, [projectId]);

  return { project, isLoading, error };
}
