"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import API from "../../lib/api";

const categories = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];

export default function NewJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};

    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    if (!form.location.trim()) errors.location = "Location is required.";
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      errors.contactEmail = "Please enter a valid email address.";
    }

    setFieldErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) setError("Please fix the highlighted fields.");
    else setError("");

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await API.post("/jobs", form);
      setSuccess("Service request submitted successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
      setForm({
        title: "",
        description: "",
        category: "",
        location: "",
        contactName: "",
        contactEmail: "",
      });
      setFieldErrors({});
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-16">
      <div className="card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Service Request</h1>
            <p className="text-gray-600 mt-2">Tell tradespeople what you need and where.</p>
          </div>
        </div>

        {error && <div className="mb-4 text-red-700 bg-red-100 p-3 rounded">{error}</div>}
        {success && showToast && (
          <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2 text-sm ${fieldErrors.title ? "input-error" : ""}`}
              placeholder="Need a plumber for a leaking tap"
            />
            {fieldErrors.title && <p className="error-text">{fieldErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2 text-sm min-h-[140px] ${fieldErrors.description ? "input-error" : ""}`}
              placeholder="Describe the issue and any helpful details"
            />
            {fieldErrors.description && <p className="error-text">{fieldErrors.description}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`w-full border rounded-xl px-3 py-2 text-sm ${fieldErrors.location ? "input-error" : ""}`}
                placeholder="Glasgow"
              />
              {fieldErrors.location && <p className="error-text">{fieldErrors.location}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Name</label>
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                className={`w-full border rounded-xl px-3 py-2 text-sm ${fieldErrors.contactEmail ? "input-error" : ""}`}
                placeholder="name@example.com"
              />
              {fieldErrors.contactEmail && <p className="error-text">{fieldErrors.contactEmail}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-secondary disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Create Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
