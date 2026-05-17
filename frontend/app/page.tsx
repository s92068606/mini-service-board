"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import API from "../lib/api";
import JobCard from "../components/JobCard";

type Job = {
  _id: string;
  title: string;
  category: string;
  status: string;
  location: string;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  const fetchJobs = async (cat?: string, query?: string) => {
    try {
      setNeedsLogin(false);
      const params = new URLSearchParams();
      if (cat) params.append("category", cat);
      if (query) params.append("search", query);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await API.get(`/jobs${queryString}`);
      setJobs(res.data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // Keep any already-loaded jobs visible, but show a login prompt.
        setNeedsLogin(true);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchJobs();
    const onAuthChange = () => fetchJobs(filter, search);
    window.addEventListener("authChange", onAuthChange);

    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Service Requests Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Filter by category or search keywords.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <input
            type="text"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              fetchJobs(filter, e.target.value);
            }}
            placeholder="Search title or description"
            className="border rounded-xl px-3 py-2 text-sm w-full md:w-80"
          />

          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              fetchJobs(e.target.value, search);
            }}
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      {needsLogin && (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded">
          You need to <a href="/login" className="underline">login</a> to view service requests.
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}