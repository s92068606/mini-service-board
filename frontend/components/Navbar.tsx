"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));

    const onAuthChange = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("authChange", onAuthChange);

    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  const showDashboard = isLoggedIn;
  const showNewRequest = isLoggedIn && pathname !== "/new";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between p-4">
        <Link href="/" className="font-bold text-lg">
          🛠 ServiceBoard
        </Link>

        <div className="flex gap-3 items-center">
          {showDashboard && (
            <Link href="/" className="btn btn-outline text-sm flex items-center gap-2">
              <span className="text-lg">🏠</span>
              Dashboard
            </Link>
          )}

          {showNewRequest && (
            <Link href="/new" className="btn btn-outline text-sm flex items-center gap-2">
              <span className="text-lg">➕</span>
              New Request
            </Link>
          )}

          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-ghost text-sm">Logout</button>
          ) : (
            <Link href="/login" className="btn btn-ghost text-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}