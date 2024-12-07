import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import "./CreateProjectForm.css";

function CreateProjectForm() {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null,  // File object
    });
  
    const { auth } = useAuth(); // Access the logged-in user's details
    const navigate = useNavigate(); // For navigation after project creation

    if (!auth?.token) {
      return <p>You must be logged in as an organisation to create a project.</p>;
    }

    if (auth.role !== "organisation") {
      return <p>Only organisations can create projects.</p>;
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleImageChange = (e) => {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`, // Include the token in headers
          },
          body: data,
      });
    
      if (!response.ok) {
        throw new Error("Failed to create project.");
      }
    
      alert("Project created successfully!");
      navigate("/projects"); // Redirect to the projects page
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  }; 
  
  return (
    <form className="create-project-form" onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>
  
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </label>
  
      <label>
        Upload Image:
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
  
      <button type="submit">Create Project</button>
    </form>
  );
}

export default CreateProjectForm;
