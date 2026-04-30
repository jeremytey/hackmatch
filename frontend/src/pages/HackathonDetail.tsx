import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getHackathonById, getParticipantsByHackathonId, joinHackathon, leaveHackathon } 
from '../api/hackathon.service';
import type { Hackathon, Participant } from '../types/hackathon.types';

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
      try {
        const hData = await getHackathonById(Number(id));
        setHackathon(hData);

        try {
          const pData = await getParticipantsByHackathonId(Number(id));
          setParticipants(pData);
        } catch (participantsErr) {
          console.warn("Failed to load participants teaser:", participantsErr);
          setParticipants([]);
        }
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

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
    <div className="grid gap-8 lg:grid-cols-3">
      {/* LEFT: Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white">{hackathon.name}</h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">📅 {new Date(hackathon.startDate).toLocaleDateString('en-GB')}</span>
            <span className="flex items-center gap-2">👥 Max Team: {hackathon.maxTeamSize}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">About this Hackathon</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{hackathon.description}</p>
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm shadow-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Registration</h3>
          
          <div className="space-y-3">
            {user ? (
              <button
                onClick={handleJoinLeave}
                disabled={actionLoading}
                className={`w-full rounded-xl py-3 font-bold transition-all ${
                  isParticipant 
                    ? 'bg-slate-800 text-red-400 hover:bg-slate-700 border border-red-500/20' 
                    : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'
                }`}
              >
                {actionLoading ? 'Processing...' : isParticipant ? 'Leave Hackathon' : 'Join Hackathon'}
              </button>
            ) : (
              <Link to="/login" className="block w-full rounded-xl bg-slate-800 py-3 text-center font-bold text-white hover:bg-slate-700">
                Login to Join
              </Link>
            )}

            {hackathon.externalUrl && (
              <a
                href={hackathon.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full rounded-xl border border-slate-700 py-2.5 text-center text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Official Site →
              </a>
            )}

            {user?.userRole === 'ADMIN' && (
              <Link to={`/admin/edit/${id}`} className="block w-full rounded-xl border border-dashed border-cyan-500/30 py-2.5 text-center text-sm font-medium text-cyan-500 hover:bg-cyan-500/5 transition-colors">
                Edit Hackathon
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <h4 className="text-sm font-semibold text-slate-200">Participants</h4>
          <div className="mt-4 space-y-3">
            {participants.length === 0 ? (
              <p className="text-xs text-slate-500">No participants yet.</p>
            ) : (
              participants.slice(0, 5).map((participant) => (
                <div key={participant.id} className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2">
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
          <div className="mt-4">
            {isParticipant && (
              <Link
                to={`/hackathons/${id}/participants`}
                className="block w-full rounded-xl border border-cyan-500/30 bg-cyan-500/5 py-2.5 text-center text-sm font-bold text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                Find Teammates →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}