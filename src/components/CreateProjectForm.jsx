function CreateProjectForm() {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null,  // File object
    });
  
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
        await axios.post(`${API_BASE_URL}/projects/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Project created successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to create project.");
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
        <input type="file" name="image" onChange={handleImageChange} />
        <button type="submit">Create Project</button>
      </form>
    );
  }
  