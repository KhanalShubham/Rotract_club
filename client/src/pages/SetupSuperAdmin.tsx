import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createUserRecord, superAdminExists } from "../services/firestore";
import { setStoredUser } from "../utils/auth";

/**
 * One-time setup page for the very first Super Admin.
 * After the super admin Firestore record exists, this page redirects to /login.
 */
export default function SetupSuperAdmin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check that no super admin exists yet
      const exists = await superAdminExists();
      if (exists) {
        setError("A Super Admin already exists. This setup page is disabled.");
        setLoading(false);
        return;
      }

      // Create Firebase Auth account + sign in
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Create the Firestore user record with SUPER_ADMIN role
      await createUserRecord(uid, {
        email,
        username,
        role: "SUPER_ADMIN",
        createdBy: uid,
      });

      // Store user in localStorage
      setStoredUser({ uid, email, username, role: "SUPER_ADMIN" });

      setDone(true);
      setTimeout(() => nav("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message || "Setup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>First-Time Setup</div>
        <h1 style={styles.title}>🛡️ Super Admin Setup</h1>
        <p style={styles.subtitle}>
          Run this once to register your Firebase account as the Super Admin.
          This page will be inaccessible once a Super Admin exists.
        </p>

        {done ? (
          <div style={styles.successBox}>
            ✅ Super Admin registered! Redirecting to dashboard…
          </div>
        ) : (
          <form onSubmit={handleSetup} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Display Name / Username</label>
              <input
                style={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Super Admin"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Firebase Email</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@example.com"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Firebase Password</label>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Firebase password"
                required
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Setting up…" : "Register as Super Admin"}
            </button>
          </form>
        )}

        <p style={styles.note}>
          ⚠️ Only run this once. After setup, log in via the normal{" "}
          <a href="/login" style={{ color: "#7c3aed" }}>login page</a>.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #3b0764 0%, #6d28d9 100%)",
  } as React.CSSProperties,
  card: {
    backgroundColor: "white",
    padding: "40px 44px",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    width: "100%",
    maxWidth: 460,
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    backgroundColor: "#ede9fe",
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.5px",
    padding: "4px 12px",
    borderRadius: 999,
    marginBottom: 12,
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#1a1a1a",
    margin: "0 0 8px",
  } as React.CSSProperties,
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 24,
    lineHeight: 1.6,
  } as React.CSSProperties,
  form: {
    display: "grid",
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
    padding: "11px 14px",
    border: "1.5px solid #e5e5e5",
    borderRadius: 8,
    fontSize: 14,
  } as React.CSSProperties,
  error: {
    backgroundColor: "#fff0f0",
    color: "#c00",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    border: "1px solid #ffc5c5",
  } as React.CSSProperties,
  btn: {
    padding: "13px 16px",
    backgroundColor: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  } as React.CSSProperties,
  successBox: {
    backgroundColor: "#f0fff4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: 8,
    padding: "14px 18px",
    fontSize: 15,
    fontWeight: 600,
    margin: "8px 0",
  } as React.CSSProperties,
  note: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 20,
    lineHeight: 1.6,
  } as React.CSSProperties,
};
