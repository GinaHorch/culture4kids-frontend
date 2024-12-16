import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import useProject from "../hooks/use-project";
import UpdateProject from "../components/UpdateProject";
import { calculatePledges } from "../utils/projectUtils";
import MakePledgeForm from "../components/MakePledgeForm";
import "./ProjectPage.css";

function ProjectPage() {
    const { id } = useParams();
    console.log("ProjectPage ID from route:", id);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { project, isLoading, error } = useProject(id); 
      
    const [isUpdating, setIsUpdating] = useState(false);
    console.log("ProjectPage ID:", id);

    if (!id) {
        console.error("ProjectPage: Missing project ID.");
        return <p>Invalid project ID.</p>;
    }
      
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

  
      // Calculate pledges
    const { totalPledges, remaining } = calculatePledges(project);

    return (
        <div className="project-details">
          <header className="project-header">
            <h2>Project Details</h2>           
          </header>
          
            <p>Title: {project.title}</p>
            <p>Description: {project.description}</p> 
            <p>Location: {project.location}</p>
            <p>Category: {project.category}</p>
            <p>Target Amount: ${project.target_amount}</p>
            <p>Total Pledged: ${calculatePledges(project).totalPledges}</p>
            <p>Remaining: ${calculatePledges(project).remaining}</p>
            <p>End Date: {new Date(project.end_date).toLocaleDateString()}</p>
            <p className="project-status">
            {project.is_open ? "Status: Open for Pledges" : "Status: Closed"}
            </p>  
            <p className="project-date">
            Created at: {new Date(project.date_created).toLocaleDateString()}
            </p>
            <img
              src={project.image || "../src/assets/Artpaintingimage.webp"} // Use placeholder if no image is provided
              alt={`${project.title} main image`}
              className="project-main-image"
            />
            {auth?.role === "organisation" && (
              <>
                <button 
                  className="update-project-btn" 
                  onClick={() => setIsUpdating((prev) => !prev)}>
                  Update Project
                </button>
                {isUpdating && <UpdateProject project={project}/>}
              </>
            )}
              
          <section className="project-pledges">
            <h3>Pledges</h3>
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
            <MakePledgeForm projectId={id} remainingAmount={remaining} />
          </section>
        </div>
    );
  }
    
export default ProjectPage;