import React, { useEffect } from "react";
import useProjects from "../hooks/use-projects";
import useUpdateProject from "../hooks/use-update-project";
import ProjectCard from "../components/ProjectCard";
import styles from "./HomePage.module.css";

function LoadingState() {
  return <p>Loading projects...</p>;
}

function ErrorState({ message, onRetry }) {
  return (
    <div>
      <p>Error loading projects: {message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

function HomePage() {
  const {
    projects,
    isLoading,
    error,
    updateProjectLocally,
  } = useProjects();

  console.log("Projects data:", projects);

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Culture4Kids</h1>
          <p>
            Support grassroots programs to connect kids with their culture. Make
            a pledge and be part of the change.
          </p>
        </div>
      </header>

      {/* Projects Section */}
      <div className={styles.projectsSection}>
        <h2>Explore Projects</h2>
        <div id="project-list" role="list" className={styles.projectList}>
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error.message} />}
          {!isLoading && !error ? (
            Array.isArray(projects) && projects.length > 0 ? (
              <>
                {projects.map((projectData) => (
                  <div
                    key={projectData.id}
                    role="listitem"
                    className={styles.projectCard}
                  >
                    <ProjectCard projectData={projectData} />
                  </div>
                ))}
              </>
            ) : (
              <p>No projects available</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
