import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import styles from "./HomePage.module.css";
import "./HomePage.css";

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
    error
  } = useProjects();

  console.log("Projects data:", projects);

  const visibleProjects = projects?.slice(0, 6); // Limit to 6 projects

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

          {error && <ErrorState message={error.message} onRetry={() => window.location.reload()} />}

          {!isLoading && !error && visibleProjects?.length > 0 ? (
            visibleProjects.map((projectData) => (
                  <div
                    key={projectData.id}
                    role="listitem"
                    className={styles.projectCard}
                  >
                    <ProjectCard projectData={projectData} />
                  </div>
                ))
            ) : (
              !isLoading && !error && visibleProjects.length === 0 && (
              <p>No projects available. Check back later!</p>
              )
            )}
          </div>
        </div>

        <footer className={styles.footer}>
          <Link to="/projects" className={styles.viewAllButton}>
            View All Projects
          </Link>
        </footer>
      </div>
  );
}

export default HomePage;
