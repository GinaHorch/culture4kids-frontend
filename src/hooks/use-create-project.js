import { useState } from "react";
import postProject from "../api/post-project";

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
    console.log('projectData in use-create-project:', projectData);
    try {
      const createdProject = await postProject(projectData, authToken);
      console.log("Created Project in use-create-project:", createdProject);
      return createdProject;
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
