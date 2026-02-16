import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  Project,
} from "../services/firestore";

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    year: "",
    summary: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({ title: "", category: "", image: "", year: "", summary: "" });
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await addProject(formData);
      }
      await loadProjects();
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  }

  function handleEdit(project: Project) {
    setFormData({
      title: project.title,
      category: project.category,
      image: project.image,
      year: project.year,
      summary: project.summary,
    });
    setEditingId(project.id!);
    setShowForm(true);
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Manage Projects</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addBtn}
          >
            {showForm ? "Cancel" : "+ Add Project"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
            
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={styles.input}
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={styles.input}
            >
              <option value="">Select Category</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Sports">Sports</option>
              <option value="Awareness">Awareness</option>
              <option value="Environment">Environment</option>
            </select>

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Year (e.g., 2024)"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
              style={styles.input}
            />

            <textarea
              placeholder="Project Summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              required
              style={styles.textarea}
              rows={4}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? "Update" : "Create"} Project
              </button>
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div style={styles.grid}>
            {projects.map((project) => (
              <div key={project.id} style={styles.card}>
                <img src={project.image} alt={project.title} style={styles.cardImage} />
                <div style={styles.cardContent}>
                  <h3>{project.title}</h3>
                  <p style={styles.category}>{project.category} • {project.year}</p>
                  <p>{project.summary}</p>
                  <div style={styles.cardActions}>
                    <button onClick={() => handleEdit(project)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project.id!)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && !showForm && (
          <p style={styles.emptyState}>No projects yet. Click "Add Project" to create one.</p>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: 20,
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  } as React.CSSProperties,
  addBtn: {
    padding: "12px 24px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  } as React.CSSProperties,
  form: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: 30,
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "inherit",
  } as React.CSSProperties,
  formActions: {
    display: "flex",
    gap: 12,
  } as React.CSSProperties,
  submitBtn: {
    padding: "12px 24px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  } as React.CSSProperties,
  cancelBtn: {
    padding: "12px 24px",
    backgroundColor: "#666",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  } as React.CSSProperties,
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  cardImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  } as React.CSSProperties,
  cardContent: {
    padding: 16,
  } as React.CSSProperties,
  category: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  } as React.CSSProperties,
  cardActions: {
    display: "flex",
    gap: 8,
    marginTop: 16,
  } as React.CSSProperties,
  editBtn: {
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  emptyState: {
    textAlign: "center",
    color: "#999",
    padding: 40,
  } as React.CSSProperties,
};
