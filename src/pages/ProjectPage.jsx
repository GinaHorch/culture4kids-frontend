import React from "react";
import { useParams } from "react-router-dom";
import useProject from "../hooks/use-project";
import { calculatePledges } from "../utils/projectUtils";
import { projects } from "../data";
import "./ProjectPage.css";

function ProjectPage() {
      // Here we use a hook that comes for free in react router called `useParams` to get the id from the URL so that we can pass it to our useProject hook.
      const { id } = useParams();
      // useProject returns three pieces of info, so we need to grab them all here
      const { project, isLoading, error } = useProject(id);    

      if (isLoading) {
            return (<p>loading project details...</p>)
      }
        
      if (error) {
            return (<p>Error: {error.message}</p>)
      }

      // Safely handle cases where project data might be undefined
      if (!project) {
            return <p>Project not found.</p>;
      }

      // Calculate pledges
      const { totalPledges, remaining } = calculatePledges(project);

      return (
        <div className="project-page">
          <header className="project-header">
            <h1 className="project-title">{project.title}</h1>
            <p className="project-status">
              {project.is_open ? "Status: Open for Pledges" : "Status: Closed"}
            </p>
            <p className="project-date">Created at: {new Date(project.date_created).toLocaleDateString()}</p>
          </header>
    
          <section className="project-details">
            <h2>Project Details</h2>
            <p>Goal: ${project.target_amount}</p>
            <p>Total Pledged: ${totalPledges}</p>
            <p>Remaining: ${remaining}</p>
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