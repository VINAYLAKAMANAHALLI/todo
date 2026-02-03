import React, { useState, useEffect, useRef } from "react";
import { loginUser } from "../auth";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.warn("Please fill all fields");
    }

    try {
      await loginUser({ email, password });
      toast.success("Login successful");

      setTimeout(() => {
        navigate("/todos");
      }, 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div
        ref={formRef}
        className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-700 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-700 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
          >
            Login
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
