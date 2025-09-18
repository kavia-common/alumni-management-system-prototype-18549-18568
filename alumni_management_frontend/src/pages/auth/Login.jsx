import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { email as emailValidator, required, minLen, combine } from "../../utils/validators";

const validateEmail = combine(required, emailValidator);
const validatePassword = (v) => minLen(v, 6, "Password");

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {
      email: validateEmail(form.email, "Email"),
      password: validatePassword(form.password),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 400)); // mimic network
      login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="w-full max-w-md card">
        <div className="card-header">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary text-white grid place-items-center font-bold">AM</div>
        </div>
        <div className="card-body">
          {serverError && (
            <div className="mb-3 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">{serverError}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Your password"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <button className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link className="text-primary font-medium" to="/register">
              Create one
            </Link>
          </p>

          <div className="mt-6">
            <p className="text-xs text-gray-500">Quick logins (all use password: pass1234)</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { email: "student@example.com", label: "Student" },
                { email: "alumni@example.com", label: "Alumni" },
                { email: "mentor@example.com", label: "Mentor" },
                { email: "placement@example.com", label: "Placement" },
                { email: "admin@example.com", label: "Admin" },
              ].map((u) => (
                <button
                  key={u.email}
                  className="btn btn-muted"
                  onClick={() => setForm({ email: u.email, password: "pass1234" })}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
