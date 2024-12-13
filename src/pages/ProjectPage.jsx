import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { useParams } from "react-router-dom";
import useProject from "../hooks/use-project";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import updateProject from "../api/update-project";
import { calculatePledges } from "../utils/projectUtils";
import MakePledgeForm from "../components/MakePledgeForm";
import "./ProjectPage.css";
import UpdateProject from "../components/UpdateProject";
import getProject from "../api/get-project";

function ProjectPage() {
      const { auth } = useAuth();
      const navigate = useNavigate();
      const { id } = useParams();
      // useProject returns three pieces of info, so we need to grab them all here
      const { project, isLoading, error, refetch } = useProject(id); 
      const [localError, setError] = useState(null);
      const [isUpdating, setIsUpdating] = useState(false);
      const [updatedProject, setUpdatedProject] = useState(project);
      console.log("ProjectPage ID:", id);

      useEffect(() => {
        setUpdatedProject(project);
      }, [project]);

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

      const handleCreateProject = () => {
        if (!auth?.token || auth?.role !== "organisation") {
          alert("Only organisations can create projects.");
          navigate("/login"); // Redirect to login if unauthenticated
          return;
        }
        navigate("/projects/create"); // Redirect to create project page
      };

      const updateProjectData = (updatedData) => {
        console.log("Updating project with data:", updateData);
        setUpdatedProject((prevProject) => ({ ...prevProject, ...updatedData }));
      };

      const handleUpdateSuccess = async (updatedProjectData) => {
        console.log("Project updated successfully:", updatedProjectData);
        setUpdatedProject(updatedProjectData); // Update the state with new data
        await refetch(); // Refetch the project data
        // Update the project state
        // setProject(updatedProjectData);
      };

      // Calculate pledges
      const { totalPledges, remaining } = calculatePledges(project);

      return (
        <div className="project-details">
          <header className="project-header">
            <h2>Project Details</h2>           
          </header>
          {updatedProject ? (
            <>
            <p>Title: {updatedProject ? updatedProject.title : project.title}</p>
            <p>Description: {updatedProject ? updatedProject.description : project.description}</p> 
            <p>Location: {updatedProject ? updatedProject.location : project.location}</p>
            <p>Category: {updatedProject ?updatedProject.category : project.category}</p>
            <p>Goal: ${updatedProject ? updatedProject.target_amount : project.target_amount}</p>
            <p>Total Pledged: ${totalPledges}</p>
            <p>Remaining: ${remaining}</p>
            <p className="project-status">
            {updatedProject ? (updatedProject.is_open ? "Status: Open for Pledges" : "Status: Closed") : (project.is_open ? "Status: Open for Pledges" : "Status: Closed")}
            </p>
            <p className="project-date">
            Created at: {new Date(updatedProject ? updatedProject.date_created : project.date_created).toLocaleDateString()}
            </p>
            <img
              src={updatedProject ? updatedProject.image : project.image || "placeholder.jpg"} // Use placeholder if no image is provided
              alt={`${updatedProject ? updatedProject.title : project.title} main image`}
              className="project-main-image"
            />
            </>
          ) : (
            <p>Loading project details...</p>
          )}
            <button className="update-project-btn" onClick={() => setIsUpdating(true)}>Update Project</button>
            
            {isUpdating && project && <UpdateProject project={updatedProject} updateProjectData={handleUpdateSuccess} />}
              
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