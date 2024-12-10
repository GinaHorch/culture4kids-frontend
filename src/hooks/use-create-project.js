import { useState } from "react";

export default function useCreateProject() {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createProject = async (projectData, authToken) => {
    setIsCreating(true);
    setCreateError(null);

    const formData = new FormData();
    Object.keys(projectData).forEach((key) => {
      formData.append(key, projectData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create project.");
      }

      return await response.json(); // Return the created project
    } catch (error) {
      setCreateError(error.message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createProject, isCreating, createError };
}
