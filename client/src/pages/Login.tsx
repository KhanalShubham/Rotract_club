import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getUserByUid } from "../services/firestore";
import { setStoredUser } from "../utils/auth";

type RoleChoice = "SUPER_ADMIN" | "ADMIN" | "MEMBER" | null;

const roles = [
  {
    key: "SUPER_ADMIN" as RoleChoice,
    icon: "🛡️",
    label: "Super Admin",
    desc: "Complete control over the entire system",
    accent: "#fff",
    cardBg: "rgba(255,255,255,0.08)",
    hoverBg: "rgba(255,255,255,0.16)",
    border: "rgba(255,255,255,0.18)",
  },
  {
    key: "ADMIN" as RoleChoice,
    icon: "👤",
    label: "Admin",
    desc: "Manage members and club content",
    accent: "#ffd6d6",
    cardBg: "rgba(255,255,255,0.08)",
    hoverBg: "rgba(255,255,255,0.16)",
    border: "rgba(255,255,255,0.18)",
  },
  {
    key: "MEMBER" as RoleChoice,
    icon: "🌟",
    label: "Member",
    desc: "Access your member dashboard",
    accent: "#ffd6d6",
    cardBg: "rgba(255,255,255,0.08)",
    hoverBg: "rgba(255,255,255,0.16)",
    border: "rgba(255,255,255,0.18)",
  },
];

export default function Login() {
  const nav = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleChoice>(null);
  const [hoveredRole, setHoveredRole] = useState<RoleChoice>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const appUser = await getUserByUid(cred.user.uid);
      if (!appUser) {
        setError("No role assigned to this account. Contact the super admin.");
        await auth.signOut();
        setLoading(false);
        return;
      }
      setStoredUser({
        uid: cred.user.uid,
        email: cred.user.email || email,
        username: appUser.username,
        role: appUser.role,
      });
      nav("/dashboard");
    } catch {
      setError("Invalid email or password. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  const selectedCfg = roles.find((r) => r.key === selectedRole);

  return (
    <div style={styles.page}>
      {/* Decorative circles */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />
      <div style={styles.circle3} />

      <div style={styles.wrapper}>
        {/* Left — branding */}
        <div style={styles.leftPane}>
          <div style={styles.logoRing}>
            <span style={styles.logoLetter}>R</span>
          </div>
          <h1 style={styles.brand}>Rotaract Club</h1>
          <p style={styles.brandSub}>Lamahi</p>
          <div style={styles.divider} />
          <p style={styles.brandTagline}>
            "Service Above Self" — connecting, leading, and empowering youth.
          </p>
        </div>

        {/* Right — role picker or login form */}
        <div style={styles.rightPane}>
          {!selectedRole ? (
            /* ── Role Selection ── */
            <>
              <p style={styles.stepLabel}>STEP 1 OF 2</p>
              <h2 style={styles.formTitle}>Who are you?</h2>
              <p style={styles.formSubtitle}>
                Choose your role to continue to the login portal.
              </p>

              <div style={styles.roleGrid}>
                {roles.map((r) => (
                  <button
                    key={r.key as string}
                    style={{
                      ...styles.roleCard,
                      background:
                        hoveredRole === r.key ? r.hoverBg : r.cardBg,
                      borderColor:
                        hoveredRole === r.key
                          ? "rgba(255,255,255,0.45)"
                          : r.border,
                      transform:
                        hoveredRole === r.key
                          ? "translateY(-4px)"
                          : "translateY(0)",
                    }}
                    onClick={() => setSelectedRole(r.key)}
                    onMouseEnter={() => setHoveredRole(r.key)}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <span style={styles.roleEmoji}>{r.icon}</span>
                    <span style={styles.roleCardTitle}>{r.label}</span>
                    <span style={styles.roleCardDesc}>{r.desc}</span>
                    <span style={styles.arrow}>→</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* ── Login Form ── */
            <>
              <p style={styles.stepLabel}>STEP 2 OF 2</p>
              <h2 style={styles.formTitle}>
                {selectedCfg?.icon} Sign in as{" "}
                <span style={{ color: "rgba(255,220,220,1)" }}>
                  {selectedCfg?.label}
                </span>
              </h2>
              <p style={styles.formSubtitle}>
                Enter the credentials provided by your admin.
              </p>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    style={styles.input}
                  />
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.65 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Signing in…" : "Sign In →"}
                </button>
              </form>

              <button
                style={styles.backBtn}
                onClick={() => {
                  setSelectedRole(null);
                  setError("");
                }}
              >
                ← Change role
              </button>
            </>
          )}

          <p style={styles.footNote}>
            🔒 No public sign-up · Credentials provided by admin
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #5a0000 0%, #8b0000 40%, #b71c1c 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  /* Decorative blurred circles */
  circle1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    top: -160,
    right: -100,
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    bottom: -120,
    left: -80,
    pointerEvents: "none",
  },
  circle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    bottom: 80,
    right: 120,
    pointerEvents: "none",
  },
  wrapper: {
    display: "flex",
    width: "min(960px, 96vw)",
    minHeight: "min(540px, 90vh)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(2px)",
  },

  /* ── Left pane ── */
  leftPane: {
    flex: "0 0 36%",
    background: "rgba(0,0,0,0.28)",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 36px",
    textAlign: "center",
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    background: "rgba(255,255,255,0.08)",
    boxShadow: "0 0 32px rgba(255,255,255,0.1)",
  },
  logoLetter: {
    fontSize: 36,
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1,
  },
  brand: {
    fontSize: 26,
    fontWeight: 800,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  brandSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
    marginBottom: 0,
    letterSpacing: "3px",
    textTransform: "uppercase",
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
    margin: "24px auto",
    borderRadius: 2,
  },
  brandTagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.7,
    fontStyle: "italic",
    maxWidth: 200,
  },

  /* ── Right pane ── */
  rightPane: {
    flex: 1,
    background: "rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "48px 44px",
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,200,200,0.7)",
    letterSpacing: "2px",
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 8px",
    lineHeight: 1.2,
  },
  formSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 28,
  },

  /* Role cards */
  roleGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  roleCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 20px",
    borderRadius: 14,
    border: "1.5px solid rgba(255,255,255,0.18)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
  },
  roleEmoji: {
    fontSize: 26,
    flexShrink: 0,
  },
  roleCardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
    minWidth: 100,
  },
  roleCardDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    flex: 1,
  },
  arrow: {
    fontSize: 16,
    color: "rgba(255,255,255,0.4)",
    flexShrink: 0,
  },

  /* Login form */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  input: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },
  errorBox: {
    backgroundColor: "rgba(0,0,0,0.25)",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    border: "1px solid rgba(252,165,165,0.3)",
  },
  submitBtn: {
    padding: "14px",
    backgroundColor: "#fff",
    color: "#8b0000",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: "0.3px",
    marginTop: 4,
    transition: "opacity 0.2s",
  },
  backBtn: {
    marginTop: 16,
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "left",
    padding: 0,
  },
  footNote: {
    marginTop: 28,
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
  },
};
