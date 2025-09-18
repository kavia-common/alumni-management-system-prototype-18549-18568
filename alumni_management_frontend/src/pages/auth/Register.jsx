import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { required, minLen, combine, email as emailValidator } from "../../utils/validators";

const validateEmail = combine(required, emailValidator);
const validatePassword = (v) => minLen(v, 6, "Password");

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
    confirm: "",
    meta: { graduationYear: "", department: "", company: "" },
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    if (["graduationYear", "department", "company"].includes(name)) {
      setForm((f) => ({ ...f, meta: { ...f.meta, [name]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {
      name: required(form.name, "Name"),
      email: validateEmail(form.email, "Email"),
      role: required(form.role, "Role"),
      password: validatePassword(form.password),
      confirm: form.password !== form.confirm ? "Passwords do not match" : null,
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 400));
      await register(form);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="w-full max-w-2xl card">
        <div className="card-header">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500">Register as a Student, Alumni, Mentor, Placement, or Admin</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-secondary text-white grid place-items-center font-bold">AM</div>
        </div>
        <div className="card-body">
          {serverError && <div className="mb-3 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">{serverError}</div>}
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Full Name</label>
              <input className="input" name="name" value={form.name} onChange={onChange} />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" name="email" value={form.email} onChange={onChange} />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" name="role" value={form.role} onChange={onChange}>
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="mentor">Mentor</option>
                <option value="placement">Placement</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Role-specific optional fields */}
            {form.role === "student" && (
              <>
                <div>
                  <label className="label">Graduation Year</label>
                  <input className="input" name="graduationYear" value={form.meta.graduationYear} onChange={onChange} />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input className="input" name="department" value={form.meta.department} onChange={onChange} />
                </div>
              </>
            )}
            {form.role === "alumni" && (
              <>
                <div>
                  <label className="label">Graduation Year</label>
                  <input className="input" name="graduationYear" value={form.meta.graduationYear} onChange={onChange} />
                </div>
                <div>
                  <label className="label">Current Company</label>
                  <input className="input" name="company" value={form.meta.company} onChange={onChange} />
                </div>
              </>
            )}

            <div>
              <label className="label">Password</label>
              <input className="input" type="password" name="password" value={form.password} onChange={onChange} />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input className="input" type="password" name="confirm" value={form.confirm} onChange={onChange} />
              {errors.confirm && <p className="text-sm text-red-600 mt-1">{errors.confirm}</p>}
            </div>

            <div className="md:col-span-2">
              <button className="btn btn-secondary w-full" disabled={submitting}>
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="text-primary font-medium" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
