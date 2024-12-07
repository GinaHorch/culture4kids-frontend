import { Link } from "react-router-dom";
import { calculatePledges } from "../utils/projectUtils";
import "./ProjectCard.css";

function ProjectCard(props) {
  const { projectData } = props;

  if (!projectData) {
    console.error("Missing project data:", props);
    return null; // Don't render anything if there's no project data
  }

  const projectLink = `/projects/${projectData.id}`;
  console.log("ProjectCard data:", projectData);

  // Calculate pledges
  const { totalPledges, remaining } = calculatePledges(projectData);

  return (
    <div className="project-card">
      <Link to={projectLink} onClick={() => console.log("Navigating to:", projectLink)}>
        <img 
          src={projectData.image || "placeholder.jpg"} 
          alt={`${projectData.title} thumbnail`}
          className="project-image" 
        />
        <h3>{projectData.title}</h3>
        <p>Goal: ${projectData.target_amount}</p>
        <p>Total Pledged: ${totalPledges}</p>
        <p>Remaining: ${remaining}</p>
      </Link>
    </div>
  );
}

export default ProjectCard;