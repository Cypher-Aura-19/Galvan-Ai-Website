"use client";

import { useState } from "react";
import { loginAdmin } from "@/lib/auth";

export default function TestBackend() {
  const [email, setEmail] = useState("admin@galvanai.com");
  const [password, setPassword] = useState("admin123");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const response = await loginAdmin(email, password);
      setResult(`✅ Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>
        
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
            
            <button
              onClick={handleTest}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Login"}
            </button>
          </div>
        </div>
        
        {result && (
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="whitespace-pre-wrap text-sm bg-zinc-800 p-4 rounded-lg overflow-auto">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-8 text-sm text-zinc-400">
          <p>Make sure the Flask backend is running on http://localhost:5000</p>
          <p>Default credentials: admin@galvanai.com / admin123</p>
        </div>
      </div>
    </div>
  );
} 