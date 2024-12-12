import React, { useState } from "react";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";
import "./ProjectsPage.css";

function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const { auth } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState(""); 
  const navigate = useNavigate();

  const handleCreateFeedback = () => {
    if (!auth?.user?.is_organization) {
      setFeedbackMessage("You must be logged in as an organisation to create a project.");
      return;
    }
    navigate("/projects/create");
  };

  return (
    <div>
      <h1>Browse Projects</h1>
      <p>Browse and pledge to amazing community projects.</p>
      
      <div className="categories">
        <button>Aboriginal Art</button>
        <button>Aboriginal Dancing</button>
        <button>Aboriginal Languages </button>
        <button>Bush Camps</button>
        <button>Trips on Country</button>
      </div>

      <div className="project-list">
        {isLoading && <p>Loading projects...</p>}
        {error && <p className="error">Error loading projects: {error.message}</p>}
        {projects
        .filter((project) => project) // Ensure valid project data
        .map((project) => (
          <ProjectCard key={project.id} projectData={project} />
        ))}
      </div>

      {feedbackMessage && <p className="feedback">{feedbackMessage}</p>}
      
      {auth?.role === "organisation" && (
        <Link to="/projects/create">
          <button className="create-project-button" onClick={handleCreateFeedback}>Create New Project</button>
        </Link>
      )}
    </div>
  );
}

export default ProjectsPage;
