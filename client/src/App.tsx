import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProjects from "./pages/ManageProjects";
import ManageEvents from "./pages/ManageEvents";
import ManageSettings from "./pages/ManageSettings";
import ManageAdmins from "./pages/ManageAdmins";
import ManageMembers from "./pages/ManageMembers";
import SetupSuperAdmin from "./pages/SetupSuperAdmin";
import { RequireAuth, RequireRole } from "./components/RequireAuth";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup-super-admin" element={<SetupSuperAdmin />} />

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
            <ManageProjects />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard/manage-projects"
        element={
          <RequireAuth>
            <ManageProjects />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard/manage-events"
        element={
          <RequireAuth>
            <ManageEvents />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard/settings"
        element={
          <RequireAuth>
            <ManageSettings />
          </RequireAuth>
        }
      />

      {/* Admin + Super Admin: manage members */}
      <Route
        path="/dashboard/members"
        element={
          <RequireRole allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <ManageMembers />
          </RequireRole>
        }
      />

      {/* Super Admin only: manage admins */}
      <Route
        path="/dashboard/admins"
        element={
          <RequireRole allowedRoles={["SUPER_ADMIN"]}>
            <ManageAdmins />
          </RequireRole>
        }
      />
    </Routes>
  );
}
