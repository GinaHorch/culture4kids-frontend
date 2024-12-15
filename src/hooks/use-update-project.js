import { useState } from "react";
import updateProjectApi from "../api/update-project";
import { useAuth } from "./use-auth";


function useUpdateProject(refetchProjects) {
    const { auth } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateProject = async (projectId, formData) => {
        setIsUpdating(true);
        setError(null);

        try {
            console.log("Token in use-update-project:", auth.token);
            console.log("FormData in use-update-project:", Array.from(formData.entries()));
            return await updateProjectApi(projectId, auth.token, formData);
            
            if (refetchProjects) {
                await refetchProjects();
            }

          } catch (error) {
            setError(error);
            console.error("Error updating project:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateProject, isUpdating, error };
}

export default useUpdateProject;