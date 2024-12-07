import React from "react";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../hooks/use-auth";
import { Link } from "react-router-dom";

function ProjectsPage() {
  const { projects } = useProjects();
  const { auth } = useAuth();

  return (
    <div>
      <h1>Browse Projects</h1>
      <div className="categories">
        <button>Aboriginal Art</button>
        <button>Aboriginal Dancing</button>
        {/* Add more categories */}
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} projectData={project} />
        ))}
      </div>
      {auth?.user?.is_organization && (
        <Link to="/projects/create">
          <button>Create New Project</button>
        </Link>
      )}
    </div>
  );
}

export default ProjectsPage;
