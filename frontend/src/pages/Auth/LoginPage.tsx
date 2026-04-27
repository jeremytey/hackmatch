import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { login } from '../../api/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Capture where the user was trying to go before being redirected here
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      
      // Update our global state (Zustand)
      setAuth(data.user, data.accessToken);
      
      // Navigate back to intended page or home
      navigate(from, { replace: true });
    } catch (err: any) {
      // Pull error message from backend response if it exists
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <h2 className="mb-6 text-3xl font-bold text-white">Welcome Back</h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="jeremy@sunway.edu.my"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-cyan-600 p-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-900/20"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}