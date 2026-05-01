import { useEffect, useState, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { getAllHackathons } from '../api/hackathon.service';
import type { Hackathon } from '../types/hackathon.types';

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

export default function HackathonFeed() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await getAllHackathons();
        setHackathons(data);
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 font-sans tracking-tight">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight md:text-5xl">
          Find your next <span className="text-cyan-500 underline decoration-cyan-500/30 underline-offset-8">Hackathon</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
          The hub for you to team up, ship projects, and dominate the Malaysian tech scene. 
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {hackathons.length > 0 ? (
          hackathons.map((h) => (
            <Link
              key={h.id}
              to={`/hackathons/${h.id}`}
              className="group flex flex-col justify-between rounded-xl border border-white/10 bg-slate-900/50 p-4 transition-all hover:-translate-y-1 hover:border-cyan-500/50"
            >
              {(() => {
                const now = new Date();
                const registrationDeadline = new Date(h.registrationDeadline);
                const startDate = new Date(h.startDate);
                const status = registrationDeadline > now
                  ? { dot: 'bg-emerald-400', label: 'Registration Open' }
                  : startDate > now
                    ? { dot: 'bg-cyan-400', label: 'Upcoming' }
                    : { dot: 'bg-slate-500', label: 'Closed' };

                return (
                  <div className="mb-3 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-300">
                      <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                );
              })()}

              <div>
                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-cyan-400">
                  {h.name}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400 font-sans">
                  {h.description}
                </p>
              </div>

              <div className="mt-5 space-y-1.5 border-t border-white/10 pt-3 text-xs text-slate-400 font-sans">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                  <span>Starts {new Date(h.startDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-slate-500" />
                  <span>Up to {h.maxTeamSize} members</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-20 text-center">
            <h3 className="text-xl font-medium text-slate-300">No hackathons live yet</h3>
            <p className="mt-2 text-slate-500 text-sm">Be the first to create one from the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}