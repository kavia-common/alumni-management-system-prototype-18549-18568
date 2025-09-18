import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { required } from "../../utils/validators";

function SlotForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ mentor: "", topic: "" });
  const [errors, setErrors] = useState({});
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const errs = {
      mentor: required(form.mentor, "Mentor"),
      topic: required(form.topic, "Topic"),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(form);
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Mentor</label>
        <input className="input" name="mentor" value={form.mentor} onChange={onChange} />
        {errors.mentor && <p className="text-sm text-red-600 mt-1">{errors.mentor}</p>}
      </div>
      <div>
        <label className="label">Topic</label>
        <input className="input" name="topic" value={form.topic} onChange={onChange} />
        {errors.topic && <p className="text-sm text-red-600 mt-1">{errors.topic}</p>}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary">Save</button>
        <button className="btn btn-muted" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function Mentorship() {
  const { user } = useAuth();
  const { mentorships, createMentorship, updateMentorship, deleteMentorship } = useData();
  const [creating, setCreating] = useState(false);

  const canCreateSlot = ["mentor", "admin"].includes(user.role);
  const canManage = ["mentor", "admin"].includes(user.role);
  const canRequest = ["student", "alumni"].includes(user.role);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h1 className="font-semibold">Mentorship</h1>
          {canCreateSlot && (
            <button className="btn btn-primary" onClick={() => setCreating(true)}>+ New Slot</button>
          )}
        </div>
        <div className="card-body">
          {creating && (
            <div className="mb-6 card">
              <div className="card-header">
                <span className="font-semibold">Create Mentorship Slot</span>
              </div>
              <div className="card-body">
                <SlotForm
                  onSubmit={(f) => {
                    createMentorship({ mentor: f.mentor, mentee: "—", topic: f.topic, status: "Available" });
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
                  <th>Mentor</th>
                  <th>Mentee</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Meetings</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mentorships.map((m) => (
                  <tr key={m.id}>
                    <td>{m.mentor}</td>
                    <td>{m.mentee}</td>
                    <td>{m.topic}</td>
                    <td>
                      <span className={`badge ${m.status === "Active" ? "badge-blue" : m.status === "Available" ? "badge-green" : "badge-gray"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>{m.meetings}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {canRequest && m.status === "Available" && (
                          <button className="btn btn-secondary" onClick={() => updateMentorship(m.id, { status: "Requested", mentee: user.name })}>
                            Request
                          </button>
                        )}
                        {canManage && m.status === "Requested" && (
                          <button className="btn btn-primary" onClick={() => updateMentorship(m.id, { status: "Active" })}>
                            Accept
                          </button>
                        )}
                        {canManage && m.status === "Active" && (
                          <button className="btn btn-muted" onClick={() => updateMentorship(m.id, { meetings: m.meetings + 1 })}>
                            + Meeting
                          </button>
                        )}
                        {canManage && (
                          <button className="btn btn-muted" onClick={() => updateMentorship(m.id, { status: "Closed" })}>
                            Close
                          </button>
                        )}
                        {canManage && (
                          <button className="btn btn-muted" onClick={() => deleteMentorship(m.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {mentorships.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">No mentorship slots yet.</td>
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
