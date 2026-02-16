import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { apiFetch } from "../services/api";
import { getStoredUser } from "../utils/auth";

interface Project {
  _id: string;
  slug: string;
  status: string;
  year: number;
  category: string;
  title: { en: string; np?: string };
}

export default function ProjectsDashboard() {
  const user = getStoredUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    titleNp: "",
    summaryEn: "",
    summaryNp: "",
    contentEn: "",
    contentNp: "",
    year: new Date().getFullYear(),
    category: "General",
  });

  const [showForm, setShowForm] = useState(false);

  async function loadProjects() {
    try {
      setError("");
      const data = await apiFetch("/projects/_dashboard/all");
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccessMsg("✅ Project created successfully (Pending Approval)");
      setForm({
        slug: "",
        titleEn: "",
        titleNp: "",
        summaryEn: "",
        summaryNp: "",
        contentEn: "",
        contentNp: "",
        year: new Date().getFullYear(),
        category: "General",
      });
      setShowForm(false);

      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      setError("");
      await apiFetch(`/projects/${id}/approve`, { method: "PATCH" });
      setSuccessMsg("✅ Project approved");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    }
  }

  async function handleReject(id: string) {
    try {
      setError("");
      await apiFetch(`/projects/${id}/reject`, { method: "PATCH" });
      setSuccessMsg("✅ Project rejected");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject");
    }
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>📋 Projects</h2>
          <button onClick={() => setShowForm(!showForm)} style={styles.btn}>
            {showForm ? "Cancel" : "+ Create Project"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        {showForm && (
          <div style={styles.formSection}>
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject} style={styles.form}>
              <div style={styles.grid2}>
                <input
                  placeholder="Slug (URL-friendly)"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  disabled={loading}
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                  disabled={loading}
                />
              </div>

              <div style={styles.grid2}>
                <input
                  placeholder="Title (English)"
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm({ ...form, titleEn: e.target.value })
                  }
                  disabled={loading}
                />
                <input
                  placeholder="Title (Nepali)"
                  value={form.titleNp}
                  onChange={(e) =>
                    setForm({ ...form, titleNp: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={loading}
              />

              <textarea
                placeholder="Summary (English)"
                rows={2}
                value={form.summaryEn}
                onChange={(e) =>
                  setForm({ ...form, summaryEn: e.target.value })
                }
                disabled={loading}
              />

              <textarea
                placeholder="Summary (Nepali)"
                rows={2}
                value={form.summaryNp}
                onChange={(e) =>
                  setForm({ ...form, summaryNp: e.target.value })
                }
                disabled={loading}
              />

              <textarea
                placeholder="Content (English)"
                rows={4}
                value={form.contentEn}
                onChange={(e) =>
                  setForm({ ...form, contentEn: e.target.value })
                }
                disabled={loading}
              />

              <textarea
                placeholder="Content (Nepali)"
                rows={4}
                value={form.contentNp}
                onChange={(e) =>
                  setForm({ ...form, contentNp: e.target.value })
                }
                disabled={loading}
              />

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>
        )}

        <div style={styles.projectsSection}>
          <h3>All Projects ({projects.length})</h3>
          {projects.length === 0 ? (
            <p style={styles.empty}>No projects yet</p>
          ) : (
            <div style={styles.projectsList}>
              {projects.map((p) => (
                <div key={p._id} style={styles.projectCard}>
                  <div style={styles.projectHeader}>
                    <div>
                      <h4>{p.title?.en}</h4>
                      <p style={styles.meta}>
                        {p.year} • {p.category}
                      </p>
                    </div>
                    <span
                      style={{
                        ...styles.badge,
                        ...(p.status === "APPROVED"
                          ? styles.badgeGreen
                          : p.status === "REJECTED"
                          ? styles.badgeRed
                          : styles.badgeYellow),
                      }}
                    >
                      {p.status}
                    </span>
                  </div>

                  {isAdmin && (
                    <div style={styles.actions}>
                      {p.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(p._id)}
                            style={styles.approveBtn}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(p._id)}
                            style={styles.rejectBtn}
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  } as React.CSSProperties,
  btn: {
    padding: "10px 16px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  } as React.CSSProperties,
  error: {
    backgroundColor: "#fee",
    color: "#c00",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  } as React.CSSProperties,
  success: {
    backgroundColor: "#efe",
    color: "#0a0",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  } as React.CSSProperties,
  formSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  form: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  } as React.CSSProperties,
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  } as React.CSSProperties,
  submitBtn: {
    padding: "12px 16px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 8,
  } as React.CSSProperties,
  projectsSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  empty: {
    textAlign: "center",
    color: "#999",
    padding: 20,
  } as React.CSSProperties,
  projectsList: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  } as React.CSSProperties,
  projectCard: {
    border: "1px solid #eee",
    padding: 16,
    borderRadius: 6,
  } as React.CSSProperties,
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  } as React.CSSProperties,
  meta: {
    fontSize: 13,
    color: "#666",
    margin: 0,
  } as React.CSSProperties,
  badge: {
    padding: "4px 8px",
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 600,
  } as React.CSSProperties,
  badgeGreen: {
    backgroundColor: "#efe",
    color: "#0a0",
  } as React.CSSProperties,
  badgeRed: {
    backgroundColor: "#fee",
    color: "#c00",
  } as React.CSSProperties,
  badgeYellow: {
    backgroundColor: "#ffe",
    color: "#aa0",
  } as React.CSSProperties,
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  } as React.CSSProperties,
  approveBtn: {
    padding: "8px 12px",
    backgroundColor: "#0a0",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  } as React.CSSProperties,
  rejectBtn: {
    padding: "8px 12px",
    backgroundColor: "#c00",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  } as React.CSSProperties,
};
