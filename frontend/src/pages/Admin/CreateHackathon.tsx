import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHackathon } from '../../api/hackathon.service';
import type { HackathonFormData } from '../../types/hackathon.types';

export default function CreateHackathon() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HackathonFormData>({
    name: '',
    description: '',
    startDate: '',
    registrationDeadline: '',
    maxTeamSize: 4,
    externalUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createHackathon(formData);
      navigate('/'); 
    } catch (err) {
      alert("Failed to create hackathon. Ensure you have Admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Launch New Hackathon</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Event Name</label>
          <input
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            placeholder="e.g. Varshney Hack 2026"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Start Date</label>
            <input
              type="date"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Registration Deadline</label>
            <input
              type="date"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Max Team Size</label>
            <input
              type="number"
              min="1"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              value={formData.maxTeamSize}
              onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">External URL (Optional)</label>
            <input
              type="url"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="https://devpost.com/..."
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Description</label>
          <textarea
            required
            rows={8}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none transition-all"
            placeholder="Themes, prizes, and rules..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-cyan-600 py-4 font-bold text-white hover:bg-cyan-500 shadow-xl shadow-cyan-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Publishing Event...' : 'Publish Hackathon'}
        </button>
      </form>
    </div>
  );
}