import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import useCreateProject from "../hooks/use-create-project";
import "./CreateProjectForm.css";

function CreateProjectForm() {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null,  // File object
      target_amount: "", // Numeric input
      location: "",
      is_open: true, // Boolean checkbox
      end_date: "", // Date input
      category: "", // Numeric dropdown
    });
  
    const { createProject, isCreating, createError } = useCreateProject(); 
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const { auth } = useAuth(); // Access the logged-in user's details
    const navigate = useNavigate(); // For navigation after project creation

    if (!auth?.token) {
      return <p>You must be logged in as an organisation to create a project.</p>;
    }

    if (auth.role !== "organisation") {
      return <p>Only organisations can create projects.</p>;
    }

    const validateForm = () => {
      const validationErrors = {};
      const requiredFields = ["title", "description", "target_amount", "location", "end_date", "category"];

      requiredFields.forEach((field) => {
        if (!formData[field]) {
          validationErrors[field] = `${field.replace("_", " ")} is required.`;
     }
   });

      if (formData.target_amount && isNaN(formData.target_amount)) {
        validationErrors.target_amount = "Target amount must be a valid number.";
      }

      if (!formData.category || isNaN(Number(formData.category))) {
        validationErrors.category = "Category must be a valid number.";
      }

      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleImageChange = (e) => {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };
  
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors({});
      
      if (!validateForm()) return;

      console.log("Submitting project with auth token:", auth.token);
      console.log("Form data being submitted:", formData);
  
      try {
        await createProject(formData, auth.token); // Call the hook to create a project
        alert("Project created successfully!");
        navigate("/projects"); // Redirect to the projects page
      } catch (error) {
        console.error("Error creating project:", error);
        setApiError(error.message); // Show error message
      }
  }; 
  
  return (
    <form className="create-project-form" onSubmit={handleSubmit}>
      {apiError && <p className="error" style={{ color: "red" }}>{apiError}</p>}

      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </label>
  
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        {errors.description && <p className="error">{errors.description}</p>}
      </label>

      <label>
        Target Amount:
        <input
          type="number"
          name="target_amount"
          value={formData.target_amount}
          onChange={handleChange}
          required
        />
        {errors.target_amount && <p className="error">{errors.target_amount}</p>}
      </label>

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        {errors.location && <p className="error">{errors.location}</p>}
      </label>

      <label>
        End Date:
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        {errors.end_date && <p className="error">{errors.end_date}</p>}
      </label>

      <label>
        Category:
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
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
        Is the project open for pledges?:
        <input
          type="checkbox"
          name="is_open"
          checked={formData.is_open}
          onChange={handleCheckboxChange}
        />
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
