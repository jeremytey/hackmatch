import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getParticipantsByHackathonId, getHackathonById } from '../api/hackathon.service';
import type { Participant, Hackathon, ParticipantFilters } from '../types/hackathon.types';

const ROLES = ['DEVELOPER', 'DESIGNER', 'PRODUCT_MANAGER', 'RESEARCHER'];
const STATUSES = ['LOOKING', 'NEED_MEMBERS', 'FULL'] as const;

export default function HackathonParticipants() {
  const { id } = useParams<{ id: string }>();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ParticipantFilters>({});

  useEffect(() => {
    if (!id) return;
    getHackathonById(Number(id)).then(setHackathon);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getParticipantsByHackathonId(Number(id), filters)
      .then(setParticipants)
      .finally(() => setLoading(false));
  }, [id, filters]);

  const updateFilter = (key: keyof ParticipantFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/hackathons/${id}`} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to {hackathon?.name ?? 'Hackathon'}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            Find Your Team
          </h1>
          <p className="text-slate-400 text-sm mt-1">{participants.length} registered participants</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <select
          className="bg-slate-800 text-white text-sm px-3 py-2 rounded-xl border border-slate-700 outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => updateFilter('role', e.target.value)}
        >
          <option value="">All Roles</option>
          {ROLES.map(r => (
            <option key={r} value={r}>{r.replace('_', ' ')}</option>
          ))}
        </select>

        <select
          className="bg-slate-800 text-white text-sm px-3 py-2 rounded-xl border border-slate-700 outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => updateFilter('teamStatus', e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>

        <button
          onClick={() => setFilters({})}
          className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-2"
        >
          Clear filters
        </button>
      </div>

      {/* Participant Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      ) : participants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-20 text-center">
          <p className="text-slate-400 font-medium">No participants match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {participants.map(p => (
            <div key={p.id} className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-cyan-500/50 transition-all">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xl font-black text-white">
                  {p.user.username[0].toUpperCase()}
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                  p.teamStatus === 'LOOKING' ? 'bg-green-500/10 text-green-400' :
                  p.teamStatus === 'NEED_MEMBERS' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {p.teamStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {p.user.username}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.user.role?.replace('_', ' ') ?? 'No role'} · {p.user.university ?? 'University not set'}
                </p>
                {p.user.bio && (
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {p.user.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.user.skills.slice(0, 4).map(s => (
                    <span key={s.id} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-md">
                      {s.name}
                    </span>
                  ))}
                  {p.user.skills.length > 4 && (
                    <span className="text-[10px] text-slate-600 px-2 py-0.5">
                      +{p.user.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <Link
                to={`/profile/${p.user.id}`}
                className="mt-6 block w-full rounded-xl bg-slate-800 py-2.5 text-center text-xs font-bold text-slate-300 hover:bg-cyan-600 hover:text-white transition-colors"
              >
                View Profile & Contact →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}