import React, { useState } from "react";
import useUpdateProject from "../hooks/use-update-project";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import useProjects from "../hooks/use-projects";
import useProject from "../hooks/use-project.js";
import "./UpdateProject.css";

function UpdateProject({ project }) {
    if (!project) {
        return <p>Project not found.</p>;
    }
    const { updateProjectImageUrl } = useProject();
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, updateProjectLocally } = useProjects();
    const { currentProject, isLoading } = useProject(id, projects, updateProjectLocally);
    const { updateProject, isUpdating, error } = useUpdateProject(updateProjectLocally);
    const { auth } = useAuth();
    console.log("Auth object from useAuth hook:", auth);
    
    const [formData, setFormData] = useState({
        title: project.title || "",
        description: project.description || "",
        image: null,
        target_amount: project.target_amount || "",
        location: project.location || "",
        is_open: project.is_open || true,
        end_date: project.end_date || "",
        category: project.category || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        console.log("handleImageChange called");
        console.log("Selected image file:", e.target.files[0]);
        setFormData((prevFormData) => ({ ...prevFormData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const updatedFormData = new FormData(); 
        // Add only changed fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                updatedFormData.append(key, value); // Append non-null fields
              }
        });

        console.log("Constructed FormData:", Array.from(updatedFormData.entries()));
        try {
            await updateProject(id, updatedFormData); // auth.token is passed automatically
            alert("Project updated successfully!");
            navigate(`/projects`); // Redirect to the updated project page

            // Call the updateProjectImageUrl function
            updateProjectImageUrl(id, formData.image);
          } catch (err) {
            console.error("Error updating project:", err);
        }
    };
        
        console.log("Token in UpdateProject:", auth?.token)
        if (!auth?.token) {
            console.error("UpdateProject: auth.token is missing or invalid.")
            return <p>You must be the owner of the project to update it.</p>;
        }

        return (
        <form className="update-project-form" onSubmit={handleSubmit}>
            {/* {apiError && <p className="error" style={{ color: "red" }}>{apiError}</p>} */}

            <h2>Update Project</h2>
            
            <div className="update-project-form">
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={formData.location}                        
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Category:
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >    
                        <option value="">Select a category</option>
                        <option value="1">Aboriginal Art</option>
                        <option value="2">Aboriginal Dancing</option>
                        <option value="3">Aboriginal Languages</option>
                        <option value="4">Bush Camps</option>
                        <option value="5">Trips on Country</option>
                    </select>
                </label>
                <label>
                    Target Amount:
                    <input
                        type="number"
                        name="target_amount"
                        value={formData.target_amount}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Update Image:
                    <input
                        type="file"
                        name="image"
                        // accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Submit"}</button>
            </div>
        </form>
        );
}

export default UpdateProject;