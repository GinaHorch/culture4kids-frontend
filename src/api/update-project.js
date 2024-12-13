import { API_BASE_URL } from "./api";


async function updateProject(projectId, updatedData, authToken) {
    console.log("Auth Token:", authToken); // Log the auth token to ensure it's being passed correctly
    try {
        const response = await fetch(`${API_BASE_URL}projects/${projectId}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${authToken}`, // Remove the whitespace after Token
                "Content-Type": "application/json",
              },
            body: JSON.stringify(updatedData),
            credentials: "include",
        });
        console.log("Token:", authToken);
        console.log("Endpoint:", `${API_BASE_URL}/projects/${projectId}/`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to update project.");
        }

        return await response.json(); // Return the updated project
    } catch (error) {
        console.error("Error in update-project API call:", error);
        throw error;
    }
}

export default updateProject;