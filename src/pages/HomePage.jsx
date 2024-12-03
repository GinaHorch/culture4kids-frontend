import React from "react";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import styles from "./HomePage.module.css";

function LoadingState() {
  return <p>Loading projects...</p>;
}

function ErrorState({ message, onRetry }) {
  return (
    <div>
      <p>Error loading projects: {message}</p>;
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

function HomePage() {
    const { projects, isLoading, error, refetch } = useProjects();    
    
    console.log("Projects data:", projects);

    return (
      // Container for the project list
        <div id="project-list" role="list" className={styles.projectList}>
          {isLoading && <LoadingState />}

          {error && <ErrorState message={error.message} onRetry={refetch}/>} 

          {!isLoading && !error ? (
            Array.isArray(projects) && projects.length > 0 ? (
            projects.map((projectData) => (
              <div 
                 key={projectData.id} 
                 role="listitem" 
                 className={styles.projectCard}
                 >
                  <ProjectCard projectData={projectData} />
                </div>
              ))
            ) : (
            <p>No projects available</p> // Fallback in case `projects` is not an array
          )
        ) : null} 
      </div>
    );
  }

export default HomePage;