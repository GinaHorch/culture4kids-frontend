import { API_BASE_URL } from "./api";

async function getProject(projectId) {
   try {    
    const response = await fetch(`${API_BASE_URL}projects/${projectId}`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const fallbackError = `Error fetching project with id ${projectId}`;
  
      const data = await response.json().catch(() => {
        throw new Error(fallbackError);
      });
  
      const errorMessage = data?.detail ?? fallbackError;
      throw new Error(errorMessage);
    }
  
    return await response.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}
  
  export default getProject;