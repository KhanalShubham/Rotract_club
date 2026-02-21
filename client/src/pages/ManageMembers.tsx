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

export default function ManageMembers() {
  const currentUser = getStoredUser();
  const [members, setMembers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ username: string; email: string; password: string } | null>(null);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const list = await getUsers("MEMBER");
      setMembers(list);
    } catch (e: any) {
      setError("Failed to load members: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    setError("");
    setSuccess("");
    setCreatedCreds(null);
    setCreating(true);

    try {
      const adminEmail = currentUser.email;

      // Create Firebase Auth account for new member
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const newUid = cred.user.uid;

      // Write role to Firestore
      await createUserRecord(newUid, {
        email,
        username,
        role: "MEMBER",
        createdBy: currentUser.uid,
      });

      // Re-sign in as admin
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      // Show credentials so admin can hand them to the member
      setCreatedCreds({ username, email, password });
      setShowForm(false);
      resetForm();
      await loadMembers();
    } catch (e: any) {
      setError("Error: " + e.message);
      try {
        await signInWithEmailAndPassword(auth, currentUser.email, adminPassword);
      } catch {}
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(member: AppUser) {
    if (!window.confirm(`Remove member "${member.username}"? They will lose access.`)) return;
    try {
      await deleteUserRecord(member.uid);
      setSuccess(`Member "${member.username}" removed.`);
      setMembers((prev) => prev.filter((m) => m.uid !== member.uid));
    } catch (e: any) {
      setError("Failed to delete: " + e.message);
    }
  }

  function resetForm() {
    setUsername("");
    setEmail("");
    setPassword("");
    setAdminPassword("");
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>👥 Manage Members</h1>
            <p style={styles.pageSubtitle}>
              Create member accounts and hand credentials to them in person.
            </p>
          </div>
          <button
            style={styles.primaryBtn}
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
              setCreatedCreds(null);
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add Member"}
          </button>
        </div>

        {error && <div style={styles.alert("error")}>{error}</div>}
        {success && !createdCreds && <div style={styles.alert("success")}>{success}</div>}

        {/* Credential slip shown after creation */}
        {createdCreds && (
          <div style={styles.credCard}>
            <div style={styles.credHeader}>
              ✅ Member created! Hand these credentials to <strong>{createdCreds.username}</strong>:
            </div>
            <div style={styles.credBody}>
              <div style={styles.credRow}>
                <span style={styles.credLabel}>Email</span>
                <code style={styles.credValue}>{createdCreds.email}</code>
              </div>
              <div style={styles.credRow}>
                <span style={styles.credLabel}>Password</span>
                <code style={styles.credValue}>{createdCreds.password}</code>
              </div>
            </div>
            <p style={styles.credNote}>
              ⚠️ This is the only time the password is shown. Please note it down.
            </p>
            <button style={styles.dismissBtn} onClick={() => setCreatedCreds(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Member</h3>
            <form onSubmit={handleCreate} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Username</label>
                  <input
                    style={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. ram_shrestha"
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
                    placeholder="member@example.com"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Password (for member)</label>
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
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Your admin password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                style={{ ...styles.primaryBtn, opacity: creating ? 0.6 : 1 }}
              >
                {creating ? "Creating..." : "Create Member"}
              </button>
            </form>
          </div>
        )}

        {/* Member list */}
        {loading ? (
          <p style={styles.empty}>Loading members…</p>
        ) : members.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>👥</p>
            <p style={styles.emptyText}>No members yet. Add one above.</p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Username</span>
              <span>Email</span>
              <span>UID</span>
              <span>Action</span>
            </div>
            {members.map((member) => (
              <div key={member.uid} style={styles.tableRow}>
                <span style={styles.bold}>{member.username}</span>
                <span style={styles.muted}>{member.email}</span>
                <span style={{ ...styles.muted, fontSize: 11 }}>{member.uid.slice(0, 12)}…</span>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(member)}
                >
                  Remove
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
    backgroundColor: "#B71C1C",
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
  credCard: {
    backgroundColor: "#f0fff4",
    border: "1.5px solid #bbf7d0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  } as React.CSSProperties,
  credHeader: {
    fontSize: 15,
    fontWeight: 600,
    color: "#166534",
    marginBottom: 12,
  } as React.CSSProperties,
  credBody: {
    display: "grid",
    gap: 8,
    marginBottom: 10,
  } as React.CSSProperties,
  credRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } as React.CSSProperties,
  credLabel: {
    width: 80,
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
  } as React.CSSProperties,
  credValue: {
    backgroundColor: "white",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 14,
    border: "1px solid #d1fae5",
    color: "#065f46",
    userSelect: "all" as const,
  } as React.CSSProperties,
  credNote: {
    fontSize: 12,
    color: "#888",
    margin: "8px 0 12px",
  } as React.CSSProperties,
  dismissBtn: {
    padding: "7px 18px",
    backgroundColor: "white",
    border: "1.5px solid #bbf7d0",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#166534",
  } as React.CSSProperties,
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
  bold: { fontWeight: 600 } as React.CSSProperties,
  muted: { color: "#666" } as React.CSSProperties,
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
  emptyText: { color: "#888", fontSize: 15 } as React.CSSProperties,
  empty: {
    color: "#888",
    textAlign: "center" as const,
    padding: 40,
  } as React.CSSProperties,
};
