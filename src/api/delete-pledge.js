async function deletePledge(pledgeId, token) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/pledges/${pledgeId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete the pledge.");
    }
  
    return true; // Return success
  }

  export default deletePledge;