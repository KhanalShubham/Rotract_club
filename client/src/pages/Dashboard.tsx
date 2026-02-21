import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { getStoredUser, isSuperAdmin, isAdmin, clearStoredUser } from "../utils/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const user = getStoredUser();
  const nav = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    clearStoredUser();
    nav("/login");
  }

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    MEMBER: "Member",
  };

  const roleColor: Record<string, string> = {
    SUPER_ADMIN: "#7c3aed",
    ADMIN: "#1d4ed8",
    MEMBER: "#065f46",
  };

  const roleTag = user?.role ?? "MEMBER";

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.greeting}>Welcome back, {user?.username || user?.email}! 👋</h1>
            <span
              style={{
                ...styles.badge,
                backgroundColor: (roleColor[roleTag] ?? "#555") + "18",
                color: roleColor[roleTag] ?? "#555",
                border: `1px solid ${roleColor[roleTag] ?? "#555"}40`,
              }}
            >
              {roleLabel[roleTag] ?? roleTag}
            </span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>

        <div style={styles.grid}>
          {/* Cards visible to all authenticated users */}
          <a href="/dashboard/manage-projects" style={styles.card}>
            <div style={styles.cardIcon}>📋</div>
            <h3 style={styles.cardTitle}>Projects</h3>
            <p style={styles.cardDesc}>Manage and create projects</p>
          </a>

          <a href="/dashboard/manage-events" style={styles.card}>
            <div style={styles.cardIcon}>📅</div>
            <h3 style={styles.cardTitle}>Events</h3>
            <p style={styles.cardDesc}>Add / Edit upcoming events</p>
          </a>

          <a href="/dashboard/settings" style={styles.card}>
            <div style={styles.cardIcon}>⚙️</div>
            <h3 style={styles.cardTitle}>Site Settings</h3>
            <p style={styles.cardDesc}>Leadership team &amp; About Us</p>
          </a>

          {/* Visible to ADMIN and SUPER_ADMIN */}
          {isAdmin() && (
            <a href="/dashboard/members" style={styles.card}>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Manage Members</h3>
              <p style={styles.cardDesc}>Create &amp; delete member accounts</p>
            </a>
          )}

          {/* Visible only to SUPER_ADMIN */}
          {isSuperAdmin() && (
            <a href="/dashboard/admins" style={{ ...styles.card, borderColor: "#7c3aed33" }}>
              <div style={styles.cardIcon}>🛡️</div>
              <h3 style={{ ...styles.cardTitle, color: "#7c3aed" }}>Manage Admins</h3>
              <p style={styles.cardDesc}>Create &amp; remove admin accounts</p>
            </a>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 20px",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    flexWrap: "wrap" as const,
    gap: 12,
  } as React.CSSProperties,
  greeting: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: 0,
    marginBottom: 8,
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  logoutBtn: {
    padding: "9px 20px",
    backgroundColor: "transparent",
    border: "1.5px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#555",
    cursor: "pointer",
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 18,
  } as React.CSSProperties,
  card: {
    display: "block",
    padding: "24px 20px",
    backgroundColor: "white",
    border: "1.5px solid #eee",
    borderRadius: 14,
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.2s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 6px",
  } as React.CSSProperties,
  cardDesc: {
    fontSize: 13,
    color: "#888",
    margin: 0,
  } as React.CSSProperties,
};
