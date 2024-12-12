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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/create/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
        },
        body: formData,
        credentials: "include",
      });
      console.log('Body:', formData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create project.");
      }

      return await response.json(); // Return the created project
    } catch (error) {
      setCreateError(error.message);
      console.error("Error creating project:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createProject, isCreating, createError };
}
