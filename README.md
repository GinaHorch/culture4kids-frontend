# React Project: Crowdfunding App (Part 2)

## Project Description

The crowdfunding platform Culture4Kids connects Aboriginal and Torres Strait Islander kids who have been taken into State care with their culture, country and community through supporting grassroots cultural programs like dance, art, traditional practices, language classes, cultural camps, on country trips, boys cultural pathways, or girls cultural pathways. Aboriginal led organisations who are looking to crowdfund existing cultural programs or would like to add new cultural programs, can add/create the cultural program as a project to raise funds. There will be an indication if the organisation is a registered charity with the option to receive tax invoices for donations of more than $2AUD.

## Project Requirements
Here's a reminder of the required features. Your crowdfunding project must:

- [X] Be separated into two distinct projects: an API built using the Django Rest Framework and a website built using React. 
- [X] Have a cool name, bonus points if it includes a pun and/or missing vowels. See https://namelix.com/ for inspiration. <sup><sup>(Bonus Points are meaningless)</sup></sup>
- [X] Have a clear target audience.
- [X] Have user accounts. A user should have at least the following attributes:
  - [X] Username
  - [X] Email address
  - [X] Password
- [X] Ability to create a “project” to be crowdfunded which will include at least the following attributes:
  - [X] Title
  - [X] Owner (a user)
  - [X] Description
  - [X] Image
  - [X] Target amount to fundraise
  - [X] Whether it is currently open to accepting new supporters or not
  - [X] When the project was created
- [X] Ability to “pledge” to a project. A pledge should include at least the following attributes:
  - [X] An amount
  - [X] The project the pledge is for
  - [X] The supporter/user (i.e. who created the pledge)
  - [X] Whether the pledge is anonymous or not
  - [X] A comment to go along with the pledge
- [X] Implement suitable update/delete functionality, e.g. should a project owner be allowed to update a project description? Project owners will be able to make changes, however, for transparency and accountability, projects cannot be deleted, they will be archived as inactive projects instead.
- [X] Implement suitable permissions, e.g. who is allowed to delete a pledge?
- [X] Return the relevant status codes for both successful and unsuccessful requests to the API.
- [X] Handle failed requests gracefully (e.g. you should have a custom 404 page rather than the default error page).
- [X] Use Token Authentication.
- [X] Implement responsive design.

## Additional Notes
No additional libraries or frameworks, other than what we use in class, are allowed unless approved by the Lead Mentor.
Note that while this is a crowdfunding website, actual money transactions are out of scope for this project.
You can browse projects by category

    ### Only organisations are able to create projects and see the create project button. 
    Please sign up as an organisation to test create/update functionality.
        
    ### Anyone who is signed in can make pledges, however, you can choose to be anonymous.

    ### I have not yet invested in cloud options, so uploaded project images are not stable and disappear eventually.

## Submission
To submit, fill out [this Google form](https://forms.gle/34ymxgPhdT8YXDgF6), including a link to your Github repo. Your lead mentor will respond with any feedback they can offer, and you can approach the mentoring team if you would like help to make improvements based on this feedback!

Please include the following in your readme doc:
- [X] A link to the deployed project. https://sparkling-torte-d2718c.netlify.app/
- [X] A screenshot of the homepage
- [ ] A screenshot of the project creation page
- [ ] A screenshot of the project creation form
- [ ] A screenshot of a project with pledges
- [ ] A screenshot of the resulting page when an unauthorized user attempts to edit a project

### Screenshots
![Homepage](/screenshots/HomePage-top.png)
![Homepage](/screenshots/HomePage-bottom.png)
![Homepage](/screenshots/HomePage-responsive-burger.png)

### Key take aways
- Optimistic updates are not so optimistic! After many attempts (2 days) of not so optimistic updates with having to manually refresh the page after updates there is the useNavigation function as alternative.
- Pillow and pillow - we are case-sensitive - but only sometimes, it depends, and we are not an installed app, so don't add Pillow to settings.py at INSTALLED_APPS.
- Static and media don't like to mix, even just for the purposes of an assignment! Keep them separate in settings.py!
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
- Brackets matter! All of a sudden your projects no longer appear, and all it was, was a missing set of brackets. Yes, not the obvious not closed bracket which linting picks up, the brackets inside brackets that make all the difference if what you think you are sending is actually being send.
- I have a new best friend, it is no longer ChatGPT, Claude or Codeium Pro, instead I am appreciating console logs and errors - they get you there eventually, just be patient and follow the bouncing ball!