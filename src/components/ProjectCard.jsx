import { Link } from "react-router-dom";
import "./ProjectCard.css";

function ProjectCard(props) {
  const { projectData } = props;
  const projectLink = `/projects/${projectData.id}`;
  console.log("ProjectCard data:", projectData);

  return (
    <div className="project-card">
      <Link to={projectLink}>
        <img src={projectData.image} />
        <h3>{projectData.title}</h3>
      </Link>
    </div>
  );
}

export default ProjectCard;