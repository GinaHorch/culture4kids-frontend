import React from "react";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";

function ProjectsPage() {
  const { projects } = useProjects();
  const { auth } = useAuth();
  const navigate = useNavigate();

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
        {projects
        .filter((project) => project) // Ensure valid project data
        .map((project) => (
          <ProjectCard key={project.id} projectData={project} />
        ))}
      </div>
      
      {auth?.role === "organisation" && (
        <Link to="/projects/create">
          <button>Create New Project</button>
        </Link>
      )}
    </div>
  );
}

export default ProjectsPage;
