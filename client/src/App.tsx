import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import { RequireAuth } from "./components/RequireAuth";

import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard/projects"
        element={
          <RequireAuth>
            <ProjectsDashboard />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
