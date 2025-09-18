import React, { createContext, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

// Utilities to generate IDs
let idCounter = 1000;
const nextId = () => (idCounter += 1);

/**
 * PUBLIC_INTERFACE
 * DataContext stores in-memory data sets for the app: webinars, mentorships, jobs, and reports stats.
 */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  const [webinars, setWebinars] = useState([
    { id: 1, title: "Resume Mastery", date: "2025-09-30", host: "Eva Mentor", status: "Scheduled", attendees: 42 },
    { id: 2, title: "Tech Interview 101", date: "2025-10-10", host: "Bob Alumni", status: "Draft", attendees: 0 },
  ]);

  const [mentorships, setMentorships] = useState([
    { id: 1, mentor: "Eva Mentor", mentee: "Alice Student", topic: "Career Guidance", status: "Active", meetings: 3 },
    { id: 2, mentor: "Bob Alumni", mentee: "—", topic: "Open Slot", status: "Available", meetings: 0 },
  ]);

  const [jobs, setJobs] = useState([
    { id: 1, role: "Frontend Developer", company: "BlueWave Tech", postedBy: "Dan Placement", status: "Open", applicants: 7 },
    { id: 2, role: "Data Analyst Intern", company: "Ocean Analytics", postedBy: "Dan Placement", status: "Open", applicants: 3 },
  ]);

  const [applications, setApplications] = useState([
    { id: 1, jobId: 1, applicant: "Alice Student", status: "Submitted", appliedOn: "2025-09-12" },
  ]);

  const createWebinar = (payload) => {
    const w = { id: nextId(), attendees: 0, status: "Draft", ...payload };
    setWebinars((prev) => [w, ...prev]);
  };

  const updateWebinar = (id, patch) => setWebinars((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const deleteWebinar = (id) => setWebinars((prev) => prev.filter((w) => w.id !== id));

  const createMentorship = (payload) => {
    const m = { id: nextId(), meetings: 0, status: "Available", ...payload };
    setMentorships((prev) => [m, ...prev]);
  };
  const updateMentorship = (id, patch) =>
    setMentorships((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const deleteMentorship = (id) => setMentorships((prev) => prev.filter((m) => m.id !== id));

  const createJob = (payload) => {
    const j = { id: nextId(), status: "Open", applicants: 0, ...payload };
    setJobs((prev) => [j, ...prev]);
  };
  const updateJob = (id, patch) => setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  const deleteJob = (id) => setJobs((prev) => prev.filter((j) => j.id !== id));

  const applyJob = ({ jobId, applicant }) => {
    setApplications((prev) => [{ id: nextId(), jobId, applicant, status: "Submitted", appliedOn: new Date().toISOString().slice(0, 10) }, ...prev]);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j)));
  };

  const value = useMemo(
    () => ({
      user,
      webinars,
      mentorships,
      jobs,
      applications,
      createWebinar,
      updateWebinar,
      deleteWebinar,
      createMentorship,
      updateMentorship,
      deleteMentorship,
      createJob,
      updateJob,
      deleteJob,
      applyJob,
    }),
    [user, webinars, mentorships, jobs, applications]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Access in-memory data store and actions
 */
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
