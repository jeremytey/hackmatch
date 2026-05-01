import { useEffect, useState, type SVGProps } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getHackathonById, getParticipantsByHackathonId, joinHackathon, leaveHackathon } 
from '../api/hackathon.service';
import type { Hackathon, Participant } from '../types/hackathon.types';

const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const UsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function HackathonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isParticipant = participants.some(p => p.user.id === user?.id);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const hackathonId = Number(id);

      try {
        const hData = await getHackathonById(hackathonId);
        setHackathon(hData);
      } catch (err) {
        console.error("Failed to load details:", err);
        return;
      }

      if (user) {
        try {
          const pData = await getParticipantsByHackathonId(hackathonId);
          setParticipants(pData);
        } catch (participantsErr) {
          console.warn("Failed to load participants teaser:", participantsErr);
          setParticipants([]);
        }
      } else {
        setParticipants([]);
      }
    };
    loadData().finally(() => setIsLoading(false));
  }, [id, user]);

  const handleJoinLeave = async () => {
    if (!user) return navigate('/login');
    if (!id) return;

    setActionLoading(true);
    try {
      if (isParticipant) {
        await leaveHackathon(Number(id));
      } else {
        await joinHackathon(Number(id));
      }
      const updatedParticipants = await getParticipantsByHackathonId(Number(id));
      setParticipants(updatedParticipants);
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center text-slate-500">Loading details...</div>;
  if (!hackathon) return <div className="p-20 text-center text-slate-500">Hackathon not found.</div>;

  return (
    <div className="space-y-4 font-sans tracking-tight">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-5 lg:grid-cols-3">
      {/* LEFT: Main Content */}
      <div className="space-y-5 lg:col-span-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">{hackathon.name}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400 font-sans">
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-slate-500" />
              {new Date(hackathon.startDate).toLocaleDateString('en-GB')}
            </span>
            <span className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-slate-500" />
              Up to {hackathon.maxTeamSize} members
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5">
          <h3 className="mb-3 text-base font-semibold text-white">About this Hackathon</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-400">{hackathon.description}</p>
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm shadow-xl">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Registration</h3>
          
          <div className="space-y-3">
            {user ? (
              <button
                onClick={handleJoinLeave}
                disabled={actionLoading}
                className={`w-full rounded-lg py-2.5 text-sm font-bold transition-all ${
                  isParticipant 
                    ? 'bg-slate-800 text-red-400 hover:bg-slate-700 border border-red-500/20' 
                    : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'
                }`}
              >
                {actionLoading ? 'Processing...' : isParticipant ? 'Leave Hackathon' : 'Join Hackathon'}
              </button>
            ) : (
              <Link to="/login" className="block w-full rounded-lg bg-slate-800 py-2.5 text-center text-sm font-bold text-white hover:bg-slate-700">
                Login to Join
              </Link>
            )}

            {hackathon.externalUrl && (
              <a
                href={hackathon.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block w-full rounded-lg border border-slate-700 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Official Site →
              </a>
            )}

            {user?.userRole === 'ADMIN' && (
              <Link to={`/admin/edit/${id}`} className="block w-full rounded-lg border border-dashed border-cyan-500/30 py-2 text-center text-xs font-medium text-cyan-500 hover:bg-cyan-500/5 transition-colors">
                Edit Hackathon
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
          <h4 className="text-sm font-semibold text-white">Participants</h4>
          <div className="mt-3 space-y-2">
            {participants.length === 0 ? (
              <p className="text-xs text-slate-500">No participants yet.</p>
            ) : (
              participants.slice(0, 5).map((participant) => (
                <div key={participant.id} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2">
                  <p className="text-sm font-medium text-white">{participant.user.username}</p>
                  <p className="text-xs text-slate-400">
                    {participant.user.role?.replace('_', ' ') ?? 'No role'}
                  </p>
                </div>
              ))
            )}
            {participants.length > 5 && (
              <p className="text-xs text-slate-500">+ {participants.length - 5} more</p>
            )}
          </div>
          <div className="mt-3">
            {isParticipant && (
              <Link
                to={`/hackathons/${id}/participants`}
                className="block w-full rounded-lg border border-cyan-500/30 bg-cyan-500/5 py-2 text-center text-xs font-bold uppercase tracking-wide text-cyan-400 transition-colors hover:bg-cyan-500/10"
              >
                Find Teammates →
              </Link>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}