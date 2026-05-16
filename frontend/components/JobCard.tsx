import Link from "next/link";

type Job = {
  _id: string;
  title: string;
  category: string;
  status: string;
  location: string;
};

const statusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Closed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100";
  }
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="card p-5 transition hover:shadow-lg">
      <h2 className="font-semibold text-lg mb-2">{job.title}</h2>

      <p className="text-sm muted">{job.category} • 📍 {job.location}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full ${statusColor(job.status)}`}>{job.status}</span>

        <Link
          href={`/jobs/${job._id}`}
          className="text-slate-900 hover:text-black text-sm font-semibold"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}