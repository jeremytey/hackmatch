import { useEffect, useState, type SVGProps } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfileById } from '../../api/user.service';
import type { UserProfile } from '../../types/user.types';

const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserProfileById(Number(userId));
        setProfile(data);
      } catch (err) {
        console.error("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div className="p-20 text-center text-slate-500 italic">Loading hacker profile...</div>;
  
  if (!profile) return (
    <div className="p-20 text-center">
      <p className="text-red-400 mb-4 font-medium">User not found.</p>
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Back Button positioned at the top */}
      <div className="flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Participants
        </button>
      </div>

      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-cyan-500/10 blur-[100px] rounded-full" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-5xl font-black text-cyan-500 border border-slate-700 shadow-2xl rotate-3">
            <span className="-rotate-3">{profile.username?.[0]?.toUpperCase() ?? '?'}</span>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight">{profile.username}</h1>
              {profile.role && (
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  {profile.role.replace('_', ' ')}
                </span>
              )}
            </div>
            <p className="text-lg text-slate-400 font-medium">{profile.university || 'Independent Hacker'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* About Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-500 tracking-[0.2em]">About</h3>
            <p className="text-slate-300 leading-relaxed text-lg italic">
              {profile.bio || "This hacker is a person of few words. No bio provided."}
            </p>
          </div>

          {/* Skills Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-500 tracking-[0.2em]">Skills & Stack</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length > 0 ? (
                profile.skills.map(skill => (
                  <span key={skill.id} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium">
                    {skill.name}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No skills listed yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Socials & Contact */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            <h3 className="text-sm font-black uppercase text-slate-500 tracking-[0.2em]">Connect</h3>
            <div className="space-y-3">
              {profile.githubURL && (
                <a href={profile.githubURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700">🐙</div>
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {profile.linkedinURL && (
                <a href={profile.linkedinURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700">💼</div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {!profile.githubURL && !profile.linkedinURL && (
                <p className="text-slate-500 text-xs italic text-center">No social links provided.</p>
              )}
            </div>
            
            {/* Reach out logic */}
            {profile.preferredContact && (
              <div className="mt-6 w-full py-3 px-4 rounded-xl bg-slate-800/50 text-center text-xs text-slate-300 border border-slate-700/50">
                Reach out via: <br/>
                <span className="text-cyan-400 font-bold text-sm block mt-1 break-all">{profile.preferredContact}</span>
              </div>
            )}
          </div>

          <div className="p-4 text-center">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
              Joined {new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}