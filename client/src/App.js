import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import { RequireAuth } from "./components/RequireAuth";
import LandingPage from "./pages/LandingPage";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(RequireAuth, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/dashboard/projects", element: _jsx(RequireAuth, { children: _jsx(ProjectsDashboard, {}) }) })] }));
}
