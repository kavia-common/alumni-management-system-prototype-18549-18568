import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

// Simple in-memory "database"
const mockUsersKey = "am_mock_users";
const sessionKey = "am_session";

// Seed with a few users across roles for convenience
const seedUsers = [
  { id: 1, name: "Alice Student", email: "student@example.com", password: "pass1234", role: "student" },
  { id: 2, name: "Bob Alumni", email: "alumni@example.com", password: "pass1234", role: "alumni" },
  { id: 3, name: "Cara Admin", email: "admin@example.com", password: "pass1234", role: "admin" },
  { id: 4, name: "Dan Placement", email: "placement@example.com", password: "pass1234", role: "placement" },
  { id: 5, name: "Eva Mentor", email: "mentor@example.com", password: "pass1234", role: "mentor" },
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(mockUsersKey);
    if (!raw) {
      localStorage.setItem(mockUsersKey, JSON.stringify(seedUsers));
      return seedUsers;
    }
    return JSON.parse(raw);
  } catch {
    return seedUsers;
  }
}

function saveUsers(users) {
  localStorage.setItem(mockUsersKey, JSON.stringify(users));
}

/**
 * PUBLIC_INTERFACE
 * Provides authentication state and actions. Uses localStorage as persistence for mock data only.
 */
export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(sessionKey);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setUser(u);
      } catch {}
    }
  }, []);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    localStorage.setItem(sessionKey, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const register = (payload) => {
    const exists = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) throw new Error("Email already registered");
    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      meta: payload.meta || {},
    };
    const updated = [...users, newUser];
    setUsers(updated);
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    localStorage.setItem(sessionKey, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(sessionKey);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, users, login, register, logout }),
    [user, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Access authentication context
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
