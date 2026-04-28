import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHackathonById, updateHackathon } from '../../api/hackathon.service';
import type { HackathonFormData} from '../../types/hackathon.types';

export default function EditHackathon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HackathonFormData>({
    name: '',
    description: '',
    startDate: '',
    registrationDeadline: '',
    maxTeamSize: 4,
    externalUrl: '',
  });

  useEffect(() => {
    const fetchHackathon = async () => {
      if (!id) return;
      try {
        const data = await getHackathonById(Number(id));
        // Format dates to YYYY-MM-DD for HTML input compatibility
        setFormData({
          name: data.name,
          description: data.description,
          startDate: new Date(data.startDate).toISOString().split('T')[0],
          registrationDeadline: new Date(data.registrationDeadline).toISOString().split('T')[0],
          maxTeamSize: data.maxTeamSize,
          externalUrl: data.externalUrl || '',
        });
      } catch (err) {
        console.error("Failed to load hackathon");
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await updateHackathon(Number(id), formData);
      navigate(`/hackathons/${id}`); // Redirect to detail page to see changes
    } catch (err) {
      alert("Failed to update hackathon.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 italic">Loading event data...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Hackathon</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Event Name</label>
          <input
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
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
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">External URL</label>
            <input
              type="url"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="https://..."
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
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          disabled={saving}
          className="w-full rounded-xl bg-cyan-600 py-4 font-bold text-white hover:bg-cyan-500 shadow-xl shadow-cyan-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Update Hackathon'}
        </button>
      </form>
    </div>
  );
}