"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AuthForm from "../AuthForm";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setFormError("Invalid email or password. Please try again.");
    } else {
      router.push("/");
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const supabase = createClientComponentClient();
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        },
      });

      setLoading(false);

      if (error) {
        setFormError("Failed to log in with social provider. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setFormError('An error occurred during social login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="\Teams-image.png"
            alt="Login Illustration"
            width={75}
            height={75}
            // className="w-15 h-15"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>
        <form onSubmit={(e) => handleSubmit(e, email, password)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              required 
              className="w-full max-w-xl px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              // style={{ width: "150%" }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              required 
              className="w-full max-w-lg px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="my-6 border-t border-gray-300" />

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Or log in with</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              disabled={loading}
            >
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
              disabled={loading}
            >
              GitHub
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
      </div>
    </div>
  );
};

export default Login;
