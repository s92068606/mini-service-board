"use client";

import { useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      // Store token
      localStorage.setItem("token", res.data.token);

      // Notify other components and navigate to home
      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      console.error("LOGIN ERROR:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={login} className="p-6 grid gap-3 border rounded bg-white">
        <h2 className="text-2xl font-bold">Login</h2>

        {error && <p className="text-red-600 bg-red-50 p-3 rounded">{error}</p>}

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
          placeholder="Password"
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}