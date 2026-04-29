import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllHackathons } from '../api/hackathon.service';
import type { Hackathon } from '../types/hackathon.types';

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
    <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
          Find your next <span className="text-cyan-500 underline decoration-cyan-500/30 underline-offset-8">Hackathon</span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 leading-relaxed">
          The hub for students to team up, ship projects, and dominate the Malaysian tech scene. 
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hackathons.length > 0 ? (
          hackathons.map((h) => (
            <Link 
              key={h.id} 
              to={`/hackathons/${h.id}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-900/80"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                    Max Team: {h.maxTeamSize}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {h.name}
                </h3>
                
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
                  {h.description}
                </p>
              </div>
              
              <div className="mt-8 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    <p>Starts</p>
                    <p className="font-medium text-slate-300">{new Date(h.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right text-red-400">
                    <p>Deadline</p>
                    <p className="font-medium">{new Date(h.registrationDeadline).toLocaleDateString()}</p>
                  </div>
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