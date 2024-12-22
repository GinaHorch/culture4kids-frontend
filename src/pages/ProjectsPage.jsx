import React, { useState } from "react";
import useProjects from "../hooks/use-projects";
import useUpdateProject from "../hooks/use-update-project";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";
import "./ProjectsPage.css";

function ProjectsPage() {
  const { projects, isLoading, error, updateProjectLocally } = useProjects();
  console.log("Projects in ProjectsPage:", projects);
  const { updateProject } = useUpdateProject(updateProjectLocally);
  const { auth } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState(""); 
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCreateFeedback = () => {
    if (!auth?.user?.is_organization) {
      setFeedbackMessage("You must be logged in as an organisation to create a project.");
      return;
    }
    navigate("/projects/create");
  };
  
  // Map numeric category values to category names
  const categoryMap = {
    1: "Aboriginal Art",
    2: "Aboriginal Dancing",
    3: "Aboriginal Languages",
    4: "Bush Camps",
    5: "Trips on Country",
  };

  // Filter projects based on selected category
  const filteredProjects = Array.isArray(projects)
    ? selectedCategory === "All Categories"
      ? projects
      : projects.filter((project) => {
          const categoryName = categoryMap[project.category]; // Map numeric category to name
          return categoryName === selectedCategory;
      })
    : [];
    console.log("Filtered Project Data in ProjectsPage:", filteredProjects);

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>Browse Projects</h1>
        <p>Browse and pledge to amazing community projects.</p>
      </header>
      
      <section className="categories-section">
        <div className="categories">
          <button
            className={selectedCategory === "All Categories" ? "category-button active" : "category-button"}
            onClick={() => handleCategoryClick("All Categories")}
          >
            All Categories
          </button>
          {Object.entries(categoryMap).map(([key, value]) => (
            <button
              key={key}
              className={selectedCategory === value ? "category-button active" : "category-button"}
              onClick={() => handleCategoryClick(value)}
            >
              {value}
            </button>
          ))}
      </div>
      </section>

      <h2 className="category-title">{selectedCategory}</h2>

      <section className="project-list">
                {isLoading && <p>Loading projects...</p>}
                {error && <p className="error">Error loading projects: {error.message}</p>}
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <ProjectCard 
                          key={project.id} 
                          projectData={project} 
                          onUpdate={(formData) => updateProject(project.id, formData)}
                        />
                    ))
                ) : (
                    <p>No projects available for this category.</p>
                )}
      </section>

      {feedbackMessage && <p className="feedback">{feedbackMessage}</p>}
      
      {auth?.role === "organisation" && (
        <div className="create-project-container">
          <Link to="/projects/create">
            <button className="create-project-button" onClick={(e) => {handleCreateFeedback();
            }}>Create New Project</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
