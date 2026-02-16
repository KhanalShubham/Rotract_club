import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      nav("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Rotaract Club Lamahi</h1>
        <p style={styles.subtitle}>Member Portal</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.hint}>
          💡 No public signup. Contact admin to create your account.
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
    backgroundColor: "#f5f5f5",
  } as React.CSSProperties,
  card: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 400,
  } as React.CSSProperties,
  title: {
    fontSize: 28,
    marginBottom: 8,
    color: "#B71C1C",
  } as React.CSSProperties,
  subtitle: {
    color: "#666",
    marginBottom: 24,
    fontSize: 14,
  } as React.CSSProperties,
  form: {
    display: "grid",
    gap: 16,
  } as React.CSSProperties,
  formGroup: {
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
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
  } as React.CSSProperties,
  error: {
    backgroundColor: "#fee",
    color: "#c00",
    padding: 12,
    borderRadius: 4,
    fontSize: 14,
  } as React.CSSProperties,
  button: {
    padding: "12px 16px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    marginTop: 8,
  } as React.CSSProperties,
  hint: {
    fontSize: 13,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  } as React.CSSProperties,
};
