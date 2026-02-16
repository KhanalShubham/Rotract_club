import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

export function Navbar() {
  const user = getStoredUser();
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <h3 style={styles.logo}>🔗 Rotaract Lamahi</h3>
        {user && (
          <div style={styles.userSection}>
            <span style={styles.userName}>
              {user.fullName} ({user.role})
            </span>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#0066cc",
    color: "white",
    padding: "16px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,
  logo: {
    margin: 0,
  } as React.CSSProperties,
  userSection: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  } as React.CSSProperties,
  userName: {
    fontSize: 14,
  } as React.CSSProperties,
  logoutBtn: {
    backgroundColor: "white",
    color: "#0066cc",
    padding: "8px 12px",
    fontSize: 12,
  } as React.CSSProperties,
};
