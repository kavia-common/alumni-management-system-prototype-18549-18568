import React from "react";
import { useData } from "../../context/DataContext";

function Bar({ label, value, max }) {
  const width = Math.max(4, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded">
        <div className="h-2 bg-blue-500 rounded" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function Reports() {
  const { webinars, mentorships, jobs, applications } = useData();

  const webinarByStatus = Object.entries(
    webinars.reduce((acc, w) => ({ ...acc, [w.status]: (acc[w.status] || 0) + 1 }), {})
  );
  const mentorshipByStatus = Object.entries(
    mentorships.reduce((acc, m) => ({ ...acc, [m.status]: (acc[m.status] || 0) + 1 }), {})
  );
  const jobApplicants = jobs.map((j) => ({ label: `${j.role} @ ${j.company}`, value: j.applicants }));
  const maxApplicants = Math.max(1, ...jobApplicants.map((j) => j.value));

  const totalApplications = applications.length;
  const totalOpenJobs = jobs.filter((j) => j.status === "Open").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Total Webinars</div><div className="text-2xl font-semibold">{webinars.length}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Active Mentorships</div><div className="text-2xl font-semibold">{mentorships.filter(m=>m.status==="Active").length}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Open Jobs</div><div className="text-2xl font-semibold">{totalOpenJobs}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-600">Applications</div><div className="text-2xl font-semibold">{totalApplications}</div></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <div className="card-header"><h2 className="font-semibold">Webinars by Status</h2></div>
          <div className="card-body">
            {webinarByStatus.length === 0 && <p className="text-sm text-gray-600">No data</p>}
            {webinarByStatus.map(([status, count]) => (
              <Bar key={status} label={status} value={count} max={Math.max(...webinarByStatus.map(([, c]) => c))} />
            ))}
          </div>
        </div>
        <div className="card lg:col-span-1">
          <div className="card-header"><h2 className="font-semibold">Mentorship by Status</h2></div>
          <div className="card-body">
            {mentorshipByStatus.length === 0 && <p className="text-sm text-gray-600">No data</p>}
            {mentorshipByStatus.map(([status, count]) => (
              <Bar key={status} label={status} value={count} max={Math.max(...mentorshipByStatus.map(([, c]) => c))} />
            ))}
          </div>
        </div>
        <div className="card lg:col-span-1">
          <div className="card-header"><h2 className="font-semibold">Applicants per Job</h2></div>
          <div className="card-body">
            {jobApplicants.length === 0 && <p className="text-sm text-gray-600">No data</p>}
            {jobApplicants.map((j) => (
              <Bar key={j.label} label={j.label} value={j.value} max={maxApplicants} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
