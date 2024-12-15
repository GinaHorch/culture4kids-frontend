import React, { useState } from "react";
import useUpdateProject from "../hooks/use-update-project";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import "./UpdateProject.css";

function UpdateProject({ project }) {
    if (!project) {
        return <p>Project not found.</p>;
    }
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateProject, isUpdating, error } = useUpdateProject();
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
        setFormData((prevFormData) => ({
            ...prevFormData,
            image: e.target.files[0],
          })); 
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
        console.log("Token in UpdateProject:", auth.token);
        try {
            await updateProject(id, updatedFormData); // auth.token is passed automatically
            alert("Project updated successfully!");
            navigate(`/projects/${id}`); // Redirect to the updated project page
          } catch (err) {
            console.error("Error updating project:", err);
        }
    };
            // Add only changed fields to updatedData
        // if (title !== originalProject.title) updatedData.title = formData.title;
        // if (description !== originalProject.description) updatedData.description = formData.description;
        // if (image !== originalProject.image) updatedData.image = formData.image;
        // if (location !== originalProject.location) updatedData.location = formData.location;
        // if (category !== originalProject.category) updatedData.category = formData.category;
        // if (goal !== originalProject.goal) updatedData.goal = formData.goal;
        
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
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                <label>
                    Pledged:
                    <input
                        type="number"
                        name="pledged"
                        value={formData.pledged}
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