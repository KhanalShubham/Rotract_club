import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            nav("/dashboard");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Network error");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsx("h1", { style: styles.title, children: "Rotaract Club Lamahi" }), _jsx("p", { style: styles.subtitle, children: "Member Portal" }), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [_jsxs("div", { style: styles.formGroup, children: [_jsx("label", { style: styles.label, children: "Username" }), _jsx("input", { type: "text", placeholder: "Enter username", value: username, onChange: (e) => setUsername(e.target.value), disabled: loading, style: styles.input })] }), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { style: styles.label, children: "Password" }), _jsx("input", { type: "password", placeholder: "Enter password", value: password, onChange: (e) => setPassword(e.target.value), disabled: loading, style: styles.input })] }), error && _jsx("div", { style: styles.error, children: error }), _jsx("button", { type: "submit", disabled: loading, style: {
                                ...styles.button,
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? "not-allowed" : "pointer",
                            }, children: loading ? "Signing in..." : "Sign in" })] }), _jsx("p", { style: styles.hint, children: "\uD83D\uDCA1 No public signup. Contact admin to create your account." })] }) }));
}
const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: "white",
        padding: 40,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 400,
    },
    title: {
        fontSize: 28,
        marginBottom: 8,
        color: "#B71C1C",
    },
    subtitle: {
        color: "#666",
        marginBottom: 24,
        fontSize: 14,
    },
    form: {
        display: "grid",
        gap: 16,
    },
    formGroup: {
        display: "grid",
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: "#333",
    },
    input: {
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 4,
        fontSize: 14,
    },
    error: {
        backgroundColor: "#fee",
        color: "#c00",
        padding: 12,
        borderRadius: 4,
        fontSize: 14,
    },
    button: {
        padding: "12px 16px",
        backgroundColor: "#B71C1C",
        color: "white",
        border: "none",
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 600,
        marginTop: 8,
    },
    hint: {
        fontSize: 13,
        color: "#666",
        marginTop: 16,
        textAlign: "center",
    },
};
