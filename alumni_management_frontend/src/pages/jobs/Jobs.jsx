import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { required } from "../../utils/validators";

function JobForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ role: "", company: "" });
  const [errors, setErrors] = useState({});
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const errs = { role: required(form.role, "Role"), company: required(form.company, "Company") };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(form);
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Role</label>
        <input className="input" name="role" value={form.role} onChange={onChange} />
        {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
      </div>
      <div>
        <label className="label">Company</label>
        <input className="input" name="company" value={form.company} onChange={onChange} />
        {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary">Save</button>
        <button className="btn btn-muted" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function Jobs() {
  const { user } = useAuth();
  const { jobs, createJob, updateJob, deleteJob, applyJob, applications } = useData();
  const [creating, setCreating] = useState(false);

  const canPost = ["placement", "admin"].includes(user.role);
  const canApply = ["student", "alumni"].includes(user.role);

  const myApplications = applications.filter((a) => a.applicant === user.name);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h1 className="font-semibold">Jobs</h1>
          {canPost && <button className="btn btn-primary" onClick={() => setCreating(true)}>+ Post Job</button>}
        </div>
        <div className="card-body">
          {creating && (
            <div className="mb-6 card">
              <div className="card-header">
                <span className="font-semibold">New Job</span>
              </div>
              <div className="card-body">
                <JobForm
                  onSubmit={(f) => {
                    createJob({ ...f, postedBy: user.name });
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
                  <th>Role</th>
                  <th>Company</th>
                  <th>Posted By</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td>{j.role}</td>
                    <td>{j.company}</td>
                    <td>{j.postedBy}</td>
                    <td><span className="badge badge-amber">{j.status}</span></td>
                    <td>{j.applicants}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {canApply && j.status === "Open" && (
                          <button className="btn btn-secondary" onClick={() => applyJob({ jobId: j.id, applicant: user.name })}>
                            Apply
                          </button>
                        )}
                        {canPost && (
                          <>
                            <button className="btn btn-muted" onClick={() => updateJob(j.id, { status: j.status === "Open" ? "Closed" : "Open" })}>
                              {j.status === "Open" ? "Close" : "Reopen"}
                            </button>
                            <button className="btn btn-muted" onClick={() => deleteJob(j.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">No jobs posted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {canApply && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">My Applications</h2>
              <div className="card">
                <div className="card-body">
                  <ul className="divide-y divide-gray-100">
                    {myApplications.map((a) => {
                      const job = jobs.find((j) => j.id === a.jobId);
                      return (
                        <li key={a.id} className="py-2 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{job?.role} @ {job?.company}</div>
                            <div className="text-sm text-gray-600">Applied on {a.appliedOn}</div>
                          </div>
                          <span className="badge badge-blue">{a.status}</span>
                        </li>
                      );
                    })}
                    {myApplications.length === 0 && <p className="text-sm text-gray-600">No applications yet.</p>}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
