
async function updateProjectApi(projectId, authToken, formData) {
       
    try {
        console.log("FormData being sent:", Array.from(formData.entries())); // Log formData
        console.log("Auth Token in updateProjectApi:", authToken); // Log the token

        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${authToken}`, 
            },
            body: formData,
            credentials: "include",
        });
        console.log("Response Status:", response.status);
        console.log("Endpoint:", `${import.meta.env.VITE_API_URL}/projects/${projectId}/`);

        if (!response.ok) {
            try {
              const errorData = await response.json();
              console.error("Error response from backend:", errorData);
            } catch {
              throw new Error(errorData.detail || "Failed to update project.");
            }
          }
        
          return await response.json();
        } catch (error) {
            console.error("Error in updateProjectApi:", error);
            throw error;
          }
    }
    
    export default updateProjectApi;