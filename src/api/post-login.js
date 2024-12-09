async function postLogin(username, password) {
    const url = `${import.meta.env.VITE_API_URL}/api-token-auth/`;
    console.log("Sending login request to:", url);

    const response = await fetch(url, {
      method: "POST", // We need to tell the server that we are sending JSON data so we set the Content-Type header to application/json
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": username,
        "password": password,
      }),
    });
  
    console.log("Login response status:", response.status);

    if (!response.ok) {
      const fallbackError = `Error trying to login`;
  
      const data = await response.json().catch(() => {
        console.error("Error parsing login error response.");
        throw new Error(fallbackError);
      });
  
      console.error("Login error response:", data);
      const errorMessage = data?.detail ?? fallbackError;
      throw new Error(errorMessage);
    }
  
    const data = await response.json();
    console.log("Login response data:", data);
    console.log("Token from response:", data.token);
    console.log("User from response:", data.user);    
    return data;
  }
  
  export default postLogin;