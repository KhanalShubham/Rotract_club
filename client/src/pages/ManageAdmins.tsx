import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  getUsers,
  createUserRecord,
  deleteUserRecord,
  type AppUser,
} from "../services/firestore";
import { getStoredUser } from "../utils/auth";
import { Navbar } from "../components/Navbar";

export default function ManageAdmins() {
  const currentUser = getStoredUser();
  const [admins, setAdmins] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    try {
      const list = await getUsers("ADMIN");
      setAdmins(list);
    } catch (e: any) {
      setError("Failed to load admins: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      // Step 1: Remember super admin credentials to re-login
      const superAdminEmail = currentUser.email;

      // Step 2: Create Firebase Auth account for new admin
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const newUid = cred.user.uid;

      // Step 3: Write role to Firestore
      await createUserRecord(newUid, {
        email,
        username,
        role: "ADMIN",
        createdBy: currentUser.uid,
      });

      // Step 4: Sign the super admin back in
      await signInWithEmailAndPassword(auth, superAdminEmail, superAdminPassword);

      setSuccess(`Admin "${username}" created successfully!`);
      setShowForm(false);
      resetForm();
      await loadAdmins();
    } catch (e: any) {
      setError("Error: " + e.message);
      // Attempt to restore super admin session
      try {
        await signInWithEmailAndPassword(auth, currentUser.email, superAdminPassword);
      } catch {}
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(admin: AppUser) {
    if (!window.confirm(`Delete admin "${admin.username}"? They will lose access immediately.`)) return;
    try {
      await deleteUserRecord(admin.uid);
      setSuccess(`Admin "${admin.username}" removed.`);
      setAdmins((prev) => prev.filter((a) => a.uid !== admin.uid));
    } catch (e: any) {
      setError("Failed to delete: " + e.message);
    }
  }

  function resetForm() {
    setUsername("");
    setEmail("");
    setPassword("");
    setSuperAdminPassword("");
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>🛡️ Manage Admins</h1>
            <p style={styles.pageSubtitle}>
              Only you (Super Admin) can create or remove admin accounts.
            </p>
          </div>
          <button
            style={styles.primaryBtn}
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add Admin"}
          </button>
        </div>

        {error && <div style={styles.alert("error")}>{error}</div>}
        {success && <div style={styles.alert("success")}>{success}</div>}

        {/* Create form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Admin</h3>
            <form onSubmit={handleCreate} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Username</label>
                  <input
                    style={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. ram_admin"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Password (for new admin)</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>
                    Your Password{" "}
                    <span style={{ color: "#888", fontWeight: 400 }}>
                      (to restore your session)
                    </span>
                  </label>
                  <input
                    type="password"
                    style={styles.input}
                    value={superAdminPassword}
                    onChange={(e) => setSuperAdminPassword(e.target.value)}
                    placeholder="Your super admin password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                style={{ ...styles.primaryBtn, opacity: creating ? 0.6 : 1 }}
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
            </form>
          </div>
        )}

        {/* Admin list */}
        {loading ? (
          <p style={styles.empty}>Loading admins…</p>
        ) : admins.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🛡️</p>
            <p style={styles.emptyText}>No admins yet. Add one above.</p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Username</span>
              <span>Email</span>
              <span>UID</span>
              <span>Action</span>
            </div>
            {admins.map((admin) => (
              <div key={admin.uid} style={styles.tableRow}>
                <span style={styles.bold}>{admin.username}</span>
                <span style={styles.muted}>{admin.email}</span>
                <span style={{ ...styles.muted, fontSize: 11 }}>{admin.uid.slice(0, 12)}…</span>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(admin)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 20px",
  } as React.CSSProperties,
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap" as const,
    gap: 12,
  } as React.CSSProperties,
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 4px",
    color: "#1a1a1a",
  } as React.CSSProperties,
  pageSubtitle: {
    fontSize: 14,
    color: "#888",
    margin: 0,
  } as React.CSSProperties,
  primaryBtn: {
    padding: "10px 22px",
    backgroundColor: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  } as React.CSSProperties,
  alert: (type: "error" | "success") =>
    ({
      padding: "12px 16px",
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 14,
      backgroundColor: type === "error" ? "#fff0f0" : "#f0fff4",
      color: type === "error" ? "#c00" : "#166534",
      border: `1px solid ${type === "error" ? "#ffc5c5" : "#bbf7d0"}`,
    } as React.CSSProperties),
  formCard: {
    backgroundColor: "white",
    border: "1.5px solid #e5e5e5",
    borderRadius: 14,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  } as React.CSSProperties,
  formTitle: {
    fontSize: 17,
    fontWeight: 700,
    margin: "0 0 18px",
  } as React.CSSProperties,
  form: {
    display: "grid",
    gap: 16,
  } as React.CSSProperties,
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  } as React.CSSProperties,
  field: {
    display: "grid",
    gap: 6,
  } as React.CSSProperties,
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
  } as React.CSSProperties,
  input: {
    padding: "10px 12px",
    border: "1.5px solid #e5e5e5",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
  } as React.CSSProperties,
  table: {
    backgroundColor: "white",
    border: "1.5px solid #e5e5e5",
    borderRadius: 14,
    overflow: "hidden",
  } as React.CSSProperties,
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1.5fr 100px",
    padding: "12px 20px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e5e5",
    fontSize: 12,
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1.5fr 100px",
    padding: "14px 20px",
    borderBottom: "1px solid #f0f0f0",
    alignItems: "center",
    fontSize: 14,
  } as React.CSSProperties,
  bold: {
    fontWeight: 600,
  } as React.CSSProperties,
  muted: {
    color: "#666",
  } as React.CSSProperties,
  deleteBtn: {
    padding: "6px 14px",
    backgroundColor: "#fff0f0",
    color: "#c00",
    border: "1px solid #ffc5c5",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  emptyState: {
    textAlign: "center" as const,
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: 14,
    border: "1.5px solid #e5e5e5",
  } as React.CSSProperties,
  emptyIcon: {
    fontSize: 48,
    margin: "0 0 12px",
  } as React.CSSProperties,
  emptyText: {
    color: "#888",
    fontSize: 15,
  } as React.CSSProperties,
  empty: {
    color: "#888",
    textAlign: "center" as const,
    padding: 40,
  } as React.CSSProperties,
};
