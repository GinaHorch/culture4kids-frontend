export default async function postCreateProject(data, authToken) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: data, // Assuming `data` is a `FormData` object
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create project.");
      }
  
      return await response.json(); // Return the created project data
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }
  