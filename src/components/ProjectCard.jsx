import { Link } from "react-router-dom";
import { calculatePledges } from "../utils/projectUtils";
import "./ProjectCard.css";

function ProjectCard({projectData }) {
  
  if (!projectData) {
    console.error("Missing project data:", projectData);
    return null; // Don't render anything if there's no project data
  }

  const projectLink = `/projects/${projectData.id}`;
  console.log("Rendering ProjectCard data:", projectData);

  // Calculate pledges
  const { totalPledges, remaining } = calculatePledges(projectData);

  return (
    <div className="project-card">
      <Link to={projectLink} onClick={() => console.log("Navigating to:", projectLink)}>
        <img 
          src={projectData.image_url || "src/assets/Artpaintingimage.webp"} // Use placeholder if no image is provided
          alt={projectData.title} 
          className="project-image" 
        />
        <h3>{projectData.title}</h3>
        <p>Target Amount: ${projectData.target_amount || 0}</p>
        <p>Total Pledged: ${totalPledges}</p>
        <p>Remaining: ${remaining}</p>
      </Link>
    </div>
  );
}

export default ProjectCard;