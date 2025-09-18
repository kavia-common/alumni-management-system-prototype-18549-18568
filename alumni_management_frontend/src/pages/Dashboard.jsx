import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const Stat = ({ label, value, tone = "blue" }) => {
  const toneMap = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
    gray: "bg-gray-50 text-gray-700",
  };
  return (
    <div className="card">
      <div className="card-body">
        <div className={`badge ${toneMap[tone]} mb-2`}>{label}</div>
        <div className="text-3xl font-semibold">{value}</div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const { webinars, mentorships, jobs, applications } = useData();

  const myApplications = applications.filter((a) => user.role === "student" ? a.applicant === user.name : true).length;
  const openWebinars = webinars.filter((w) => w.status !== "Completed").length;
  const activeMentorships = mentorships.filter((m) => m.status === "Active").length;
  const openJobs = jobs.filter((j) => j.status === "Open").length;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, <span className="capitalize">{user.role}</span> {user.name ? `— ${user.name}` : ""}
          </h1>
          <p className="text-gray-600 mt-1">Here’s a quick overview of your portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Open Webinars" value={openWebinars} tone="blue" />
        <Stat label="Active Mentorships" value={activeMentorships} tone="green" />
        <Stat label="Open Jobs" value={openJobs} tone="amber" />
        <Stat label="Applications" value={myApplications} tone="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Recent Webinars</h2>
          </div>
          <div className="card-body">
            <ul className="divide-y divide-gray-100">
              {webinars.slice(0, 5).map((w) => (
                <li key={w.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{w.title}</div>
                    <div className="text-sm text-gray-600">Host: {w.host} · {w.date}</div>
                  </div>
                  <span className="badge badge-blue">{w.status}</span>
                </li>
              ))}
              {webinars.length === 0 && <p className="text-sm text-gray-600">No webinar data.</p>}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Open Jobs</h2>
          </div>
          <div className="card-body">
            <ul className="divide-y divide-gray-100">
              {jobs.slice(0, 5).map((j) => (
                <li key={j.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{j.role}</div>
                    <div className="text-sm text-gray-600">{j.company} · Posted by {j.postedBy}</div>
                  </div>
                  <span className="badge badge-amber">{j.status}</span>
                </li>
              ))}
              {jobs.length === 0 && <p className="text-sm text-gray-600">No jobs available.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
