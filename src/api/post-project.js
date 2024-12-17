import { API_BASE_URL } from './api';

async function postProject(formData, authToken) {
    console.log("formData in postProject prior to creating the FormData object:", formData);
  try {
    const response = await fetch(`${API_BASE_URL}projects/create/`, {
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
    console.error("Error creating project:", error);
    throw error;
  }
}

export default postProject;