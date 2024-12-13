import { useState } from "react";
import updateProject from "../api/update-project";
import { useAuth } from "./use-auth";


export default function useUpdateProject() {
    const { authToken } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateProjectHandler = async (projectId, updatedData) => {
        setIsUpdating(true);
        setError(null);

        try {
            console.log("Auth Token:", authToken)
            const response = await updateProject(projectId, authToken, updatedData);
            return response;
        } catch (error) {
            setError(error);
            console.error("Error updating project:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateProject: updateProjectHandler, isUpdating, error };
}
