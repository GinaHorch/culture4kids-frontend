import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { useParams } from "react-router-dom";
import useProject from "../hooks/use-project";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import { calculatePledges } from "../utils/projectUtils";
import "./ProjectPage.css";

function ProjectPage() {
      const { auth } = useAuth();
      const navigate = useNavigate();
      // Here we use a hook that comes for free in react router called `useParams` to get the id from the URL so that we can pass it to our useProject hook.
      const { id } = useParams();
      // useProject returns three pieces of info, so we need to grab them all here
      const { project, isLoading, error } = useProject(id);    

      if (isLoading) {
            return (<p>Loading project details...</p>)
      }
        
      if (error) {
            return (<p>Error: {error.message}</p>)
      }

      // Safely handle cases where project data might be undefined
      if (!project) {
            return <p>Project not found.</p>;
      }

      const handleCreateProject = () => {
        if (!auth?.token || auth?.role !== "organisation") {
          alert("Only organisations can create projects.");
          navigate("/login"); // Redirect to login if unauthenticated
          return;
        }
        navigate("/create-project"); // Redirect to create project page
      };

      // Calculate pledges
      const { totalPledges, remaining } = calculatePledges(project);

      return (
        <div className="project-page">
          <header className="project-header">
            <h1>Projects</h1>
            <p>Browse and pledge to amazing community projects.</p>
            {auth?.role === "organisation" && (
              <button onClick={handleCreateProject} className="create-project-btn">
              Create Project
              </button>
            )}
          </header>
          <section className="project-list">
            {/* placeholder */}
            <p>All projects will be listed here.</p>
          </section>

          <section className="project-details">
            <h2 className="project-title">{project.title}</h2>
            <p>Goal: ${project.target_amount}</p>
            <p>Total Pledged: ${totalPledges}</p>
            <p>Remaining: ${remaining}</p>
            <p className="project-status">
              {project.is_open ? "Status: Open for Pledges" : "Status: Closed"}
            </p>
            <p className="project-date">
              Created at: {new Date(project.date_created).toLocaleDateString()}
            </p>
            <img
              src={project.image || "placeholder.jpg"} // Use placeholder if no image is provided
              alt={`${project.title} main image`}
              className="project-main-image"
            />
          </section>
    
          <section className="project-pledges">
            <h2>Pledges</h2>
            {project.pledges.length > 0 ? (
              <ul>
                {project.pledges.map((pledge, index) => (
                  <li key={index}>
                    ${pledge.amount} from {pledge.supporter || "Anonymous"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pledges yet. Be the first to contribute!</p>
            )}
          </section>
        </div>
      );
    }
    
export default ProjectPage;