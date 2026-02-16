import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx("nav", { style: styles.navbar, children: _jsxs("div", { style: styles.container, children: [_jsx("h3", { style: styles.logo, children: "\uD83D\uDD17 Rotaract Lamahi" }), user && (_jsxs("div", { style: styles.userSection, children: [_jsxs("span", { style: styles.userName, children: [user.fullName, " (", user.role, ")"] }), _jsx("button", { onClick: logout, style: styles.logoutBtn, children: "Logout" })] }))] }) }));
}
const styles = {
    navbar: {
        backgroundColor: "#B71C1C",
        color: "white",
        padding: "16px 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    container: {
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        margin: 0,
    },
    userSection: {
        display: "flex",
        gap: 12,
        alignItems: "center",
    },
    userName: {
        fontSize: 14,
    },
    logoutBtn: {
        backgroundColor: "white",
        color: "#B71C1C",
        padding: "8px 12px",
        fontSize: 12,
    },
};
