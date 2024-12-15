# React + Vite

Here is the link to Culture4Kids:
https://sparkling-torte-d2718c.netlify.app/
"username": "test2organisation",
"password": "newpassword123"

### You will only be able to create projects (and see the create projects button) when you login as an organisation.
### Anyone who is signed in can make pledges.

Logical Flow of my project:

1. Homepage:

Purpose: Provide a quick overview of the platform, showcasing popular or recent projects.
Key Elements:
Featured projects (e.g., "Popular" or "Recently Added").
Previous and next buttons for project browsing.
Navigation to individual project details via project tiles.

2. Projects Page:

Purpose: Allow users to explore all projects in detail.
Key Elements:
A list of all project categories (e.g., Aboriginal Art, Aboriginal Dancing, etc.).
Option to filter or browse projects by category.
A full project list showing all open projects.
A "Create New Project" button (visible to organizations only).
Navigation to individual project details via project tiles.

3. Individual Project Page:

Purpose: Provide detailed information about a project and allow users to make pledges.
Key Elements:
Full project details (title, description, target amount, amount pledged, remaining amount, etc.).
List of pledges made (if applicable).
A form to make a pledge (available to logged-in users only).
Navigation back to the Projects Page or Homepage.

4. Authentication-Restricted Features:

Logged-in organisations can create new projects.
Logged-in users can make pledges to projects.

## Key take aways
- Although you use Bearer Token in Insomnia, you need to write in your authentication header in the frontend Authorization: `Token ${authToken}` and sometimes the page requires you to write .token, or authToken or just token - go with the flow
- Order matters! When auth.token and formData were in a different order, well it tried to use formData as token and the token as formData... e.g., updateProjectApi(projectId, auth.token, formData);
- Your base URL matters, does it have a / or not? This will determine if fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`) works, or if it only works without / before api-token-auth/
- Pagination is a thing! When you are wondering why your projects that you are updating disappear (if you have more than 10 projects) but you can call the disappeared project directly via their ID - it's because the backend uses pagination of 10 and you need to tell the frontend to check out the next page when you are refetching data. And yes, this was a scenario where I could use a WHILE loop: 
    const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    let allProjects = [];
    let nextPage = `${import.meta.env.VITE_API_URL}/projects/`;

    try {
        while (nextPage) {
            const response = await fetch(nextPage);
            const data = await response.json();

            if (Array.isArray(data.results)) {
                allProjects = [...allProjects, ...data.results];
                nextPage = data.next; // URL for the next page
            } else {
                console.error("Unexpected data format:", data);
                break;
            }
        }

        setProjects(allProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error);
    } finally {
        setIsLoading(false);
    }
};