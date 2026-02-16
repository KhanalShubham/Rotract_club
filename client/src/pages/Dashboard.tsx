import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { getStoredUser } from "../utils/auth";

export default function Dashboard() {
  const user = getStoredUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>Welcome back, {user?.fullName}! 👋</h1>
          <p style={styles.role}>Role: <b>{user?.role}</b></p>

          <div style={styles.grid}>
            <a href="/dashboard/projects" style={styles.linkCard}>
              <h3>📋 Projects</h3>
              <p>Manage and create projects</p>
            </a>

            {isAdmin && (
              <>
                <a href="/dashboard/users" style={styles.linkCard}>
                  <h3>👥 Users</h3>
                  <p>Manage team members</p>
                </a>

                <a href="/dashboard/suggestions" style={styles.linkCard}>
                  <h3>💬 Suggestions</h3>
                  <p>Review public suggestions</p>
                </a>
              </>
            )}
          </div>
        </div>
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
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  role: {
    color: "#666",
    marginBottom: 24,
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginTop: 20,
  } as React.CSSProperties,
  linkCard: {
    display: "block",
    padding: 20,
    border: "1px solid #eee",
    borderRadius: 8,
    transition: "all 0.2s",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  } as React.CSSProperties,
};
