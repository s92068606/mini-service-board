"use client";

import { useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", form);
      setSuccess("Registration successful! Redirecting to login...");
      console.log("REGISTER SUCCESS:", res.data);

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMsg);
      console.error("REGISTER ERROR:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={register}
        className="p-6 grid gap-3 border rounded bg-white"
      >
        <h2 className="text-2xl font-bold">Register</h2>

        {error && <p className="text-red-600 bg-red-50 p-3 rounded">{error}</p>}
        {success && (
          <p className="text-green-600 bg-green-50 p-3 rounded">{success}</p>
        )}

        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          className="border p-2 rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          disabled={loading}
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}