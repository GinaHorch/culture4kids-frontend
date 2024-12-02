import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import "./HomePage.css";

function HomePage() {
    const { projects } = useProjects();    
    
    console.log("Projects data:", projects);

    return (
        <div id="project-list">
          {Array.isArray(projects) ? (
            projects.map((projectData, key) => {
              return <ProjectCard key={key} projectData={projectData} />;
            })
          ) : (
            <p>No projects available</p> // Fallback in case `projects` is not an array
          )}
        </div>
      );
  }
  
  export default HomePage;