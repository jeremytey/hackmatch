import { useEffect, useState, type SVGProps } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getParticipantsByHackathonId, getHackathonById } from '../api/hackathon.service';
import { useAuthStore } from '../store/useAuthStore';
import type { Participant, Hackathon, ParticipantFilters } from '../types/hackathon.types';

const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const ROLES = ['DEVELOPER', 'DESIGNER', 'PRODUCT_MANAGER', 'RESEARCHER'];
const STATUSES = ['LOOKING', 'NEED_MEMBERS', 'FULL'] as const;

export default function HackathonParticipants() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [membershipParticipants, setMembershipParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [filters, setFilters] = useState<ParticipantFilters>({});
  const isParticipant = membershipParticipants.some(p => p.user.id === user?.id);

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

  useEffect(() => {
    if (!id) return;
    setMembershipLoading(true);
    getParticipantsByHackathonId(Number(id))
      .then(setMembershipParticipants)
      .finally(() => setMembershipLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || membershipLoading) return;
    if (!isParticipant) {
      navigate(`/hackathons/${id}`, { replace: true });
    }
  }, [id, membershipLoading, isParticipant, navigate]);

  const updateFilter = (key: keyof ParticipantFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  if (membershipLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5 font-sans tracking-tight">
      {/* Header */}
      <div className="space-y-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
        <div>
          <Link to={`/hackathons/${id}`} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            {hackathon?.name ?? 'Hackathon'}
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Find Your Team
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">{participants.length} registered participants</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
        <select
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => updateFilter('role', e.target.value)}
        >
          <option value="">All Roles</option>
          {ROLES.map(r => (
            <option key={r} value={r}>{r.replace('_', ' ')}</option>
          ))}
        </select>

        <select
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => updateFilter('teamStatus', e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>

        <button
          onClick={() => setFilters({})}
          className="ml-auto px-2 py-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
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
        <div className="rounded-xl border border-dashed border-slate-800 p-14 text-center">
          <p className="text-slate-400 font-medium">No participants match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {participants.map(p => (
            <div key={p.id} className="group flex flex-col justify-between rounded-xl border border-white/10 bg-slate-900/40 p-4 transition-all hover:border-cyan-500/50">
              {/* Card Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-base font-black text-white">
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
                <h3 className="text-base font-bold text-white transition-colors group-hover:text-cyan-400">
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
                <div className="mt-3 flex flex-wrap gap-1.5">
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
                {isParticipant && p.user.preferredContact && (
                  <p className="mt-3 text-xs text-slate-300">
                    Contact: <span className="text-cyan-400">{p.user.preferredContact}</span>
                  </p>
                )}
                {p.user.githubURL && (
                  <a
                    href={p.user.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {p.user.linkedinURL && (
                  <a
                    href={p.user.linkedinURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              {/* Card Footer */}
              <Link
                to={`/profile/${p.user.id}`}
                className="mt-4 block w-full rounded-lg bg-slate-800 py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-300 transition-colors hover:bg-cyan-600 hover:text-white"
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