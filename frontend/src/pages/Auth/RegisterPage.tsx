import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await register({ 
        username: formData.username, 
        email: formData.email, 
        password: formData.password 
      });
      
      // Auto-login after register
      setAuth(response.user, response.accessToken);
      navigate('/'); 
    } catch (err: unknown) {
      const maybeAxiosError = err as { response?: { data?: { message?: string } } };
      setError(maybeAxiosError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white">Join HackMatch</h2>
        <p className="mt-2 text-slate-400">Start building your team today.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => {
              setError('');
              setFormData({ ...formData, password: e.target.value });
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => {
              setError('');
              setFormData({ ...formData, confirmPassword: e.target.value });
            }}
          />

          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-cyan-600 py-3 font-bold text-white hover:bg-cyan-500 disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}