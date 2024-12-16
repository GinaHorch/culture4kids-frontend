import { useState } from "react";
import updateProjectApi from "../api/update-project";
import { useAuth } from "./use-auth";


function useUpdateProject(updateProjectLocally) {
    const { auth } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateProject = async (projectId, formData) => {
        setIsUpdating(true);
        setError(null);

        try {
            console.log("Token in use-update-project:", auth.token);
            console.log("FormData in use-update-project:", Array.from(formData.entries()));
            // Call the API to update the project
            const updatedProject = await updateProjectApi(projectId, auth.token, formData);
            console.log("Updated Project from API:", updatedProject);
            
            updateProjectLocally(updatedProject); // Ensure the local state is updated
            return updatedProject;
            
          } catch (error) {
            setError(error);
            console.error("Error updating project:", error);
          } finally {
            setIsUpdating(false);
          }
    };

    return { updateProject, isUpdating, error };
}

export default useUpdateProject;