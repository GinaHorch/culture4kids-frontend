import React, { useState, useEffect } from "react";
import useUpdateProject from "../hooks/use-update-project";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import getProject from "../api/get-project";
import "./UpdateProject.css";

function UpdateProject({ project, updateProjectData }) {
    if (!project) {
        return <p>Project not found.</p>;
    }
    const { id } = useParams();
    const { updateProject } = useUpdateProject();
    
    const { auth } = useAuth();
    
    const navigate = useNavigate();

    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const [image, setImage] = useState(project.image);
    const [location, setLocation] = useState(project.location);
    const [category, setCategory] = useState(project.category);
    const [goal, setGoal] = useState(project.goal);
    const [pledged, setPledged] = useState(project.pledged);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});
    const [originalProject, setOriginalProject] = useState(project);
    
    
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project = await getProject(id);
                setOriginalProject(project);
                setTitle(project.title);
                setDescription(project.description);
                setImage(project.image);
                setLocation(project.location);
                setCategory(project.category);
                setGoal(project.goal);
                setPledged(project.pledged);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        fetchProject();
    }, []);

    const handleImageChange = (e) => {
        setImage((prev) => ({ ...prev, image: e.target.files[0] })); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiError(null);

        const updatedData = {};

            if (title !== originalProject.title) updatedData.title = title;

            if (description !== originalProject.description) updatedData.description = description;

            if (image !== originalProject.image) updatedData.image = image;
           
            if (location !== originalProject.location) updatedData.location = location;

            if (category !== originalProject.category) updatedData.category = category;
    
            if (goal !== originalProject.goal) updatedData.goal = goal;
           
        try {
            const updatedProject = await updateProject(id, auth.token, updatedData);
            updateProjectData(updatedProject) // Call updateProjectData with updated project data
            alert("Project updated successfully.");
            navigate("/projects");
          } catch (error) {
                console.error("Error updating project:", error);
                setApiError("Failed to update project. Please try again.");
            }
        };

        if (!auth?.token) {
            return <p>You must be the owner of the project to update it.</p>;
        }

        return (
        <form className="update-project-form" onSubmit={handleSubmit}>
            {apiError && <p className="error" style={{ color: "red" }}>{apiError}</p>}

            <h2>Update Project</h2>
            <div className="update-project-form">
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
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
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </label>
                <label>
                    Category:
                    <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >    
                        <option value="">Select a category</option>
                        <option value="1">Aboriginal Art</option>
                        <option value="2">Aboriginal Dancing</option>
                        <option value="3">Aboriginal Languages</option>
                        <option value="4">Bush Camps</option>
                        <option value="5">Trips on Country</option>
                    </select>
                    {errors.category && <p className="error">{errors.category}</p>}
                </label>
                <label>
                    Goal:
                    <input
                        type="number"
                        name="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </label>
                <label>
                    Pledged:
                    <input
                        type="number"
                        name="pledged"
                        value={pledged}
                        onChange={(e) => setPledged(e.target.value)}
                    />
                </label>
                <button type="submit">Submit Update Project</button>
            </div>
        </form>
        );
}

export default UpdateProject;