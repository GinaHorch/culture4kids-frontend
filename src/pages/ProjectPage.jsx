import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import useProject from "../hooks/use-project";
import UpdateProject from "../components/UpdateProject";
import { calculatePledges } from "../utils/projectUtils";
import MakePledgeForm from "../components/MakePledgeForm";
import placeholderImage from "../assets/Artpaintingimage.webp"; 
import deletePledge from "../api/delete-pledge";
import "./ProjectPage.css";

function ProjectPage() {
    const { id } = useParams();
    console.log("ProjectPage ID from route:", id);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { project, isLoading, error } = useProject(id); 
      
    const [isUpdating, setIsUpdating] = useState(false);
    const [pledges, setPledges] = useState(project?.pledges || []);
    const [deleteError, setDeleteError] = useState(null);
    
    console.log("ProjectPage ID:", id);

    if (!id) {
        console.error("ProjectPage: Missing project ID.");
        return <p>Invalid project ID.</p>;
    }
      
    useEffect(() => {
      if (project) {
        setPledges(project.pledges || []);
      }    
    }, [project]);

    useEffect(() => {
      if (project && project.end_date) {
        const currentDate = new Date();
        const endDate = new Date(project.end_date);
    
        if (currentDate > endDate && project.is_open) {
          // Update project status locally
          project.is_open = false; // Note: This won't persist the status to the backend
        }
      }
    }, [project]);

      if (isLoading) {
        return (<p>Loading project details...</p>)
      }
      if (error) {
        return (<p>Error: {error.message}</p>)
      }
      if (!project) {
        return <p>Project not found.</p>;
      }
  
      // Calculate pledges
    const { totalPledges, remaining } = calculatePledges(project);

    console.log("project.image:", project.image);
    console.log("placeholderImage:", placeholderImage);

    // Handle pledge deletion
    const handleDeletePledge = async (pledgeId) => {
      setDeleteError(null); // Reset any previous error
      try {
        await deletePledge(pledgeId, auth.token);
        setPledges((prevPledges) => prevPledges.filter((pledge) => pledge.id !== pledgeId));
      } catch (err) {
        setDeleteError(err.message);
      }
    };

    return (
        <div className="project-details">
          <header className="project-header">
            <h2>Project Details</h2>           
          </header>
          
          <div className="project-info-tile">
            <p><strong>Title:</strong> {project.title}</p>
            <p><strong>Description:</strong> {project.description}</p> 
            <p><strong>Location:</strong> {project.location}</p>
            <p><strong>Category:</strong> {project.category}</p>
            <p><strong>Target Amount:</strong> ${project.target_amount}</p>
            <p><strong>Total Pledged:</strong> ${calculatePledges(project).totalPledges}</p>
            <p><strong>Remaining:</strong> ${calculatePledges(project).remaining}</p>
            <p><strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}</p>
            <p className={`project-status ${project.is_open ? "open" : "closed"}`}>
              <strong>Status:</strong> {project.is_open ? "Open for Pledges" : "Closed"}
            </p>  
            <p className="project-date">
            <strong>Created at:</strong> {new Date(project.date_created).toLocaleDateString()}    
            </p>            
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
          </div>
          
          <img
            src={project.image || placeholderImage} // Use placeholder if no image is provided
            alt={project.title || "Placeholder image"}
            className="project-main-image"
          />

          <section className={`project-pledges ${project.is_open ? "" : "disabled"}`}>
            <h3>Pledges</h3>
            {deleteError && <p className="error-message">{deleteError}</p>}
            {pledges.length > 0 ? (
              <ul>
                {pledges.map((pledge) => (
                  <li key={pledge.id}>
                    <div className="pledge-details">
                      <p>
                        <strong>Amount:</strong> ${pledge.amount}
                      </p>
                      <p>
                        <strong>Supporter:</strong>{" "}
                        {pledge.anonymous ? "Anonymous" : pledge.supporter}
                      </p>
                      {pledge.comment && (
                        <p>
                          <strong>Comment:</strong> {pledge.comment}
                        </p>
                      )}
                    </div>
                    {pledge.supporter_id === auth?.user?.id && (
                      <button
                        className="delete-pledge-btn"
                        onClick={() => handleDeletePledge(pledge.id)}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pledges yet. Be the first to contribute!</p>
            )}
           {project.is_open ? ( 
            <MakePledgeForm projectId={id} remainingAmount={remaining} />
          ) : (
            <p className="closed-message">This project is closed for pledges.</p>
          )}
          </section>
        </div>
    );
  }
    
export default ProjectPage;