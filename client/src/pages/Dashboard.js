import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navbar } from "../components/Navbar";
import { getStoredUser } from "../utils/auth";
export default function Dashboard() {
    const user = getStoredUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsxs("h1", { children: ["Welcome back, ", user?.fullName, "! \uD83D\uDC4B"] }), _jsxs("p", { style: styles.role, children: ["Role: ", _jsx("b", { children: user?.role })] }), _jsxs("div", { style: styles.grid, children: [_jsxs("a", { href: "/dashboard/projects", style: styles.linkCard, children: [_jsx("h3", { children: "\uD83D\uDCCB Projects" }), _jsx("p", { children: "Manage and create projects" })] }), isAdmin && (_jsxs(_Fragment, { children: [_jsxs("a", { href: "/dashboard/users", style: styles.linkCard, children: [_jsx("h3", { children: "\uD83D\uDC65 Users" }), _jsx("p", { children: "Manage team members" })] }), _jsxs("a", { href: "/dashboard/suggestions", style: styles.linkCard, children: [_jsx("h3", { children: "\uD83D\uDCAC Suggestions" }), _jsx("p", { children: "Review public suggestions" })] })] }))] })] }) })] }));
}
const styles = {
    container: {
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
    },
    card: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    role: {
        color: "#666",
        marginBottom: 24,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        marginTop: 20,
    },
    linkCard: {
        display: "block",
        padding: 20,
        border: "1px solid #eee",
        borderRadius: 8,
        transition: "all 0.2s",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
    },
};
