"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Ensure this is in a client component
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (isRegistering) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Registration successful. Please log in.");
        setIsRegistering(false);
        setIsLoading(false);
      } else {
        setError(data.error || "Registration failed.");
        setIsLoading(false);
      }
    } else {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/secret-page-1"); // Ensure navigation uses useRouter
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg shadow-blue-100 border border-gray-200 py-16 px-10 rounded-lg w-fit flex flex-col items-center gap-8">
        <h1 className="font-bold">{isRegistering ? "Register" : "Login"}</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 w-[300px] "
        >
          <input
            className="p-2 border border-gray-300 rounded-md"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-2 border border-gray-300 rounded-md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-5 rounded-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>
        {error && (
          <p style={{ color: "red" }}>
            {error.includes("duplicate")
              ? "Account is already registered"
              : error}
          </p>
        )}
        <button
          className="font-thin"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don’t have an account? Register"}
        </button>
      </div>
    </div>
  );
}
