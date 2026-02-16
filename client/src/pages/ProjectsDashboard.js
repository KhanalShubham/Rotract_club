import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { apiFetch } from "../services/api";
import { getStoredUser } from "../utils/auth";
export default function ProjectsDashboard() {
    const user = getStoredUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    const [projects, setProjects] = useState([]);
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load projects");
        }
    }
    useEffect(() => {
        loadProjects();
    }, []);
    async function handleCreateProject(e) {
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create project");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleApprove(id) {
        try {
            setError("");
            await apiFetch(`/projects/${id}/approve`, { method: "PATCH" });
            setSuccessMsg("✅ Project approved");
            await loadProjects();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to approve");
        }
    }
    async function handleReject(id) {
        try {
            setError("");
            await apiFetch(`/projects/${id}/reject`, { method: "PATCH" });
            setSuccessMsg("✅ Project rejected");
            await loadProjects();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reject");
        }
    }
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsxs("div", { style: styles.container, children: [_jsxs("div", { style: styles.header, children: [_jsx("h2", { children: "\uD83D\uDCCB Projects" }), _jsx("button", { onClick: () => setShowForm(!showForm), style: styles.btn, children: showForm ? "Cancel" : "+ Create Project" })] }), error && _jsx("div", { style: styles.error, children: error }), successMsg && _jsx("div", { style: styles.success, children: successMsg }), showForm && (_jsxs("div", { style: styles.formSection, children: [_jsx("h3", { children: "Create New Project" }), _jsxs("form", { onSubmit: handleCreateProject, style: styles.form, children: [_jsxs("div", { style: styles.grid2, children: [_jsx("input", { placeholder: "Slug (URL-friendly)", value: form.slug, onChange: (e) => setForm({ ...form, slug: e.target.value }), disabled: loading }), _jsx("input", { type: "number", placeholder: "Year", value: form.year, onChange: (e) => setForm({ ...form, year: Number(e.target.value) }), disabled: loading })] }), _jsxs("div", { style: styles.grid2, children: [_jsx("input", { placeholder: "Title (English)", value: form.titleEn, onChange: (e) => setForm({ ...form, titleEn: e.target.value }), disabled: loading }), _jsx("input", { placeholder: "Title (Nepali)", value: form.titleNp, onChange: (e) => setForm({ ...form, titleNp: e.target.value }), disabled: loading })] }), _jsx("input", { placeholder: "Category", value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), disabled: loading }), _jsx("textarea", { placeholder: "Summary (English)", rows: 2, value: form.summaryEn, onChange: (e) => setForm({ ...form, summaryEn: e.target.value }), disabled: loading }), _jsx("textarea", { placeholder: "Summary (Nepali)", rows: 2, value: form.summaryNp, onChange: (e) => setForm({ ...form, summaryNp: e.target.value }), disabled: loading }), _jsx("textarea", { placeholder: "Content (English)", rows: 4, value: form.contentEn, onChange: (e) => setForm({ ...form, contentEn: e.target.value }), disabled: loading }), _jsx("textarea", { placeholder: "Content (Nepali)", rows: 4, value: form.contentNp, onChange: (e) => setForm({ ...form, contentNp: e.target.value }), disabled: loading }), _jsx("button", { type: "submit", disabled: loading, style: styles.submitBtn, children: loading ? "Creating..." : "Create Project" })] })] })), _jsxs("div", { style: styles.projectsSection, children: [_jsxs("h3", { children: ["All Projects (", projects.length, ")"] }), projects.length === 0 ? (_jsx("p", { style: styles.empty, children: "No projects yet" })) : (_jsx("div", { style: styles.projectsList, children: projects.map((p) => (_jsxs("div", { style: styles.projectCard, children: [_jsxs("div", { style: styles.projectHeader, children: [_jsxs("div", { children: [_jsx("h4", { children: p.title?.en }), _jsxs("p", { style: styles.meta, children: [p.year, " \u2022 ", p.category] })] }), _jsx("span", { style: {
                                                        ...styles.badge,
                                                        ...(p.status === "APPROVED"
                                                            ? styles.badgeGreen
                                                            : p.status === "REJECTED"
                                                                ? styles.badgeRed
                                                                : styles.badgeYellow),
                                                    }, children: p.status })] }), isAdmin && (_jsx("div", { style: styles.actions, children: p.status === "PENDING" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleApprove(p._id), style: styles.approveBtn, children: "\u2713 Approve" }), _jsx("button", { onClick: () => handleReject(p._id), style: styles.rejectBtn, children: "\u2717 Reject" })] })) }))] }, p._id))) }))] })] })] }));
}
const styles = {
    container: {
        maxWidth: 1000,
        margin: "0 auto",
        padding: 20,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    btn: {
        padding: "10px 16px",
        backgroundColor: "#B71C1C",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
    },
    error: {
        backgroundColor: "#fee",
        color: "#c00",
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
    },
    success: {
        backgroundColor: "#efe",
        color: "#0a0",
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
    },
    formSection: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    form: {
        display: "grid",
        gap: 12,
        marginTop: 16,
    },
    grid2: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
    },
    submitBtn: {
        padding: "12px 16px",
        backgroundColor: "#B71C1C",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        marginTop: 8,
    },
    projectsSection: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    empty: {
        textAlign: "center",
        color: "#999",
        padding: 20,
    },
    projectsList: {
        display: "grid",
        gap: 12,
        marginTop: 16,
    },
    projectCard: {
        border: "1px solid #eee",
        padding: 16,
        borderRadius: 6,
    },
    projectHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    meta: {
        fontSize: 13,
        color: "#666",
        margin: 0,
    },
    badge: {
        padding: "4px 8px",
        borderRadius: 3,
        fontSize: 12,
        fontWeight: 600,
    },
    badgeGreen: {
        backgroundColor: "#efe",
        color: "#0a0",
    },
    badgeRed: {
        backgroundColor: "#fee",
        color: "#c00",
    },
    badgeYellow: {
        backgroundColor: "#ffe",
        color: "#aa0",
    },
    actions: {
        display: "flex",
        gap: 8,
        marginTop: 12,
    },
    approveBtn: {
        padding: "8px 12px",
        backgroundColor: "#0a0",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 12,
    },
    rejectBtn: {
        padding: "8px 12px",
        backgroundColor: "#c00",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 12,
    },
};
