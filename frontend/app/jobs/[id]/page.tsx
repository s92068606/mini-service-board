"use client";

import { useEffect, useState } from "react";
import API from "../../../lib/api";
import { useParams, useRouter } from "next/navigation";

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<any>(null);

  const fetchJob = async () => {
    const res = await API.get(`/jobs/${id}`);
    setJob(res.data);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const updateStatus = async (status: string) => {
    await API.patch(`/jobs/${id}`, { status });
    fetchJob();
  };

  const deleteJob = async () => {
    await API.delete(`/jobs/${id}`);
    router.push("/");
  };

  if (!job) return <p>Loading...</p>;

  // Render as a centered modal overlay so dropdowns are not clipped.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => router.push("/")}
      />

      <div className="relative bg-white p-6 rounded-xl shadow max-w-2xl w-full mx-auto overflow-visible">
        {/* Close icon top-right */}
        <button
          aria-label="Close"
          onClick={() => router.push("/")}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold">{job.title}</h1>

        <p className="text-gray-600 mt-2">{job.description}</p>

        <div className="mt-4 space-y-2 text-sm">
          <p>📍 {job.location}</p>
          <p>🏷 {job.category}</p>
        </div>

        <div className="mt-4">
          <div className="relative z-10 inline-block">
            <select
              className="border p-2 rounded bg-white z-50"
              value={job.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          <button
            onClick={deleteJob}
            className="ml-3 bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}