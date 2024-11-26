"use client";
import { useState } from "react";

const AuthForm = ({ handleSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form 
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      onSubmit={(e) => handleSubmit(e, email, password)}
    >
      <label className="block mb-4">
        <span className="block text-gray-700 text-sm font-bold mb-2">Email:</span>
        <input 
          type="email" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      <label className="block mb-6">
        <span className="block text-gray-700 text-sm font-bold mb-2">Password:</span>
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200">
        Submit
      </button>
    </form>
  );
};

export default AuthForm;
