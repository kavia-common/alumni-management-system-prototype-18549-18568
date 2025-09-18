import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navConfig = {
  common: [
    { to: "/", label: "Dashboard", roles: ["student", "alumni", "admin", "placement", "mentor"] },
    { to: "/profile", label: "Profile", roles: ["student", "alumni", "admin", "placement", "mentor"] },
  ],
  features: [
    { to: "/webinars", label: "Webinars", roles: ["student", "alumni", "admin", "mentor"] },
    { to: "/mentorship", label: "Mentorship", roles: ["student", "alumni", "mentor", "admin"] },
    { to: "/jobs", label: "Jobs", roles: ["student", "alumni", "placement", "admin"] },
    { to: "/reports", label: "Reports", roles: ["admin", "placement"] },
  ],
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = [...navConfig.common, ...navConfig.features].filter((l) =>
    l.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">AM</div>
            <div>
              <div className="text-sm text-gray-500">Alumni Management</div>
              <div className="text-lg font-semibold text-gray-900">Ocean Professional</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex text-sm text-gray-600">
              Signed in as <span className="ml-1 font-medium">{user.name}</span> ·
              <span className="ml-1 capitalize">{user.role}</span>
            </span>
            <button onClick={logout} className="btn btn-muted">Logout</button>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <nav className="card">
            <div className="card-header">
              <span className="font-semibold text-gray-800">Navigation</span>
            </div>
            <div className="card-body">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                          isActive || location.pathname === l.to
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <span>{l.label}</span>
                      {(location.pathname === l.to) && (
                        <span className="badge badge-blue">Here</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        <main className="col-span-12 md:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}
