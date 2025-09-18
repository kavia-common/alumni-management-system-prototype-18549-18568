import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { required } from "../../utils/validators";

function WebinarForm({ onSubmit, initial = { title: "", date: "", host: "" }, submitting, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {
      title: required(form.title, "Title"),
      date: required(form.date, "Date"),
      host: required(form.host, "Host"),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Title</label>
        <input className="input" name="title" value={form.title} onChange={handleChange} />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="label">Date</label>
        <input className="input" type="date" name="date" value={form.date} onChange={handleChange} />
        {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
      </div>
      <div>
        <label className="label">Host</label>
        <input className="input" name="host" value={form.host} onChange={handleChange} />
        {errors.host && <p className="text-sm text-red-600 mt-1">{errors.host}</p>}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save"}</button>
        {onCancel && <button type="button" className="btn btn-muted" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default function Webinars() {
  const { user } = useAuth();
  const { webinars, createWebinar, updateWebinar, deleteWebinar } = useData();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const canManage = ["admin", "mentor"].includes(user.role) || (user.role === "alumni");
  const canRegister = ["student", "alumni"].includes(user.role);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h1 className="font-semibold">Webinars</h1>
          {canManage && (
            <button className="btn btn-primary" onClick={() => setCreating(true)}>
              + New Webinar
            </button>
          )}
        </div>
        <div className="card-body">
          {creating && (
            <div className="mb-6 card">
              <div className="card-header">
                <span className="font-semibold">Create Webinar</span>
              </div>
              <div className="card-body">
                <WebinarForm
                  onSubmit={(f) => {
                    createWebinar({ ...f, status: "Draft" });
                    setCreating(false);
                  }}
                  onCancel={() => setCreating(false)}
                />
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Host</th>
                  <th>Status</th>
                  <th>Attendees</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {webinars.map((w) => (
                  <tr key={w.id}>
                    <td>{w.title}</td>
                    <td>{w.date}</td>
                    <td>{w.host}</td>
                    <td>
                      <span className="badge badge-blue">{w.status}</span>
                    </td>
                    <td>{w.attendees}</td>
                    <td className="text-right">
                      {editingId === w.id ? (
                        <div className="p-3">
                          <WebinarForm
                            initial={{ title: w.title, date: w.date, host: w.host }}
                            onSubmit={(f) => {
                              updateWebinar(w.id, f);
                              setEditingId(null);
                            }}
                            onCancel={() => setEditingId(null)}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {canRegister && (
                            <button
                              className="btn btn-secondary"
                              onClick={() => updateWebinar(w.id, { attendees: w.attendees + 1 })}
                            >
                              Register
                            </button>
                          )}
                          {canManage && (
                            <>
                              <button className="btn btn-muted" onClick={() => setEditingId(w.id)}>
                                Edit
                              </button>
                              {w.status !== "Scheduled" && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => updateWebinar(w.id, { status: "Scheduled" })}
                                >
                                  Publish
                                </button>
                              )}
                              <button className="btn btn-muted" onClick={() => deleteWebinar(w.id)}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {webinars.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No webinars yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
