import { useEffect, useState, type SVGProps } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyProfile, updateProfile, getAllSkills} from '../../api/user.service';
import type { UserProfile, UpdateUserDto } from '../../types/user.types';
import type { Skill } from '../../types/skill.types';

const UserCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.66C7.82 19.09 9.55 18 12 18s4.18 1.09 5 2.66" />
  </svg>
);

export default function MyProfile() {
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(
    Boolean((location.state as { editing?: boolean } | null)?.editing)
  );
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateUserDto>({});
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [data, skillsList] = await Promise.all([getMyProfile(), getAllSkills()]);

        setProfile(data);
        setAllSkills(skillsList);
        setExpandedCategories(
          skillsList.reduce<Record<string, boolean>>((acc, skill) => {
            acc[skill.category] = true;
            return acc;
          }, {})
        );
        
        setFormData({
          university: data.university || '',
          role: (data.role as UpdateUserDto['role']) || 'DEVELOPER',
          bio: data.bio || '',
          skills: data.skills?.map(s => s.id) || [],
          githubURL: data.githubURL || '',
          linkedinURL: data.linkedinURL || '',
          preferredContact: data.preferredContact || '',
          yearOfStudy: data.yearOfStudy || 1,
        });
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const toggleSkill = (skillId: number) => {
    const currentIds = formData.skills || [];
    const newIds = currentIds.includes(skillId)
      ? currentIds.filter(id => id !== skillId)
      : [...currentIds, skillId];

    setFormData({ ...formData, skills: newIds });
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      alert("Update failed. Check your connection or field formats.");
    }
  };

  const selectedSkillIds = formData.skills || [];
  const skillsByCategory = allSkills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryNames = Object.keys(skillsByCategory).sort();

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const formatCategoryLabel = (category: string) =>
    category
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');

  if (loading) return <div className="p-20 text-center text-slate-500 font-medium italic">Loading your profile...</div>;
  if (!profile) return <div className="p-20 text-center text-red-400 font-medium">Unable to load profile data.</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 font-sans tracking-tight">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">Account Settings</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-200 shadow-lg transition-all hover:bg-slate-700 active:scale-95"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-md md:p-5">
        {/* User Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 ring-2 ring-cyan-500/20">
            <UserCircleIcon className="h-10 w-10 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{profile.username}</h1>
            <p className="text-xs text-slate-500">{profile.email}</p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* University */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">University</label>
            {isEditing ? (
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                value={formData.university || ''}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
            ) : (
              <p className="rounded-lg bg-slate-800/20 p-2.5 text-sm font-semibold text-slate-200">{profile.university || 'Not set'}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Primary Role</label>
            {isEditing ? (
              <select
                className="w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                value={formData.role || 'DEVELOPER'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UpdateUserDto['role']  })}
              >
                <option value="DEVELOPER">Developer</option>
                <option value="DESIGNER">Designer</option>
                <option value="PRODUCT_MANAGER">Product Manager</option>
                <option value="RESEARCHER">Researcher</option>
              </select>
            ) : (
              <p className="rounded-lg bg-slate-800/20 p-2.5 text-sm font-semibold text-slate-200">{profile.role || 'Not set'}</p>
            )}
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">GitHub URL</label>
            {isEditing ? (
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                placeholder="https://github.com/..."
                value={formData.githubURL || ''}
                onChange={(e) => setFormData({ ...formData, githubURL: e.target.value })}
              />
            ) : (
              <p className="truncate rounded-lg bg-slate-800/20 p-2.5 text-sm font-semibold text-slate-200">{profile.githubURL || 'None'}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">LinkedIn URL</label>
            {isEditing ? (
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedinURL || ''}
                onChange={(e) => setFormData({ ...formData, linkedinURL: e.target.value })}
              />
            ) : (
              <p className="truncate rounded-lg bg-slate-800/20 p-2.5 text-sm font-semibold text-slate-200">{profile.linkedinURL || 'None'}</p>
            )}
          </div>

          {/* Preferred Contact  */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Preferred Contact (e.g., +60 or Discord Username)</label>
            {isEditing ? (
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500"
                value={formData.preferredContact || ''}
                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
              />
            ) : (
              <p className="rounded-lg bg-slate-800/20 p-2.5 text-sm font-semibold text-slate-200">{profile.preferredContact || 'No contact info provided'}</p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Short Bio</label>
          {isEditing ? (
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          ) : (
            <p className="rounded-lg bg-slate-800/20 p-3 text-sm italic leading-relaxed text-slate-300">
              {profile.bio || 'Tell potential teammates about your experience...'}
            </p>
          )}
        </div>

        {/* Skills Section */}
        <div className="mt-6 space-y-3">
          <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Skills</label>

          <div className="flex flex-wrap gap-1.5">
            {allSkills.filter(s => selectedSkillIds.includes(s.id)).map(skill => (
              <button
                key={skill.id}
                type="button"
                disabled={!isEditing}
                onClick={() => toggleSkill(skill.id)}
                className={`rounded-md border px-2.5 py-1 text-[11px] font-bold transition-all ${
                  isEditing
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                {skill.name} {isEditing && <span className="ml-1 opacity-50">×</span>}
              </button>
            ))}
          </div>

          {isEditing && (
            <div className="mt-4 space-y-3">
              {categoryNames.map((category) => {
                const availableSkills = skillsByCategory[category].filter(
                  (skill) => !selectedSkillIds.includes(skill.id)
                );

                return (
                  <div key={category} className="rounded-lg border border-slate-800 bg-slate-900/30">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-bold text-slate-300"
                    >
                      <span>{formatCategoryLabel(category)}</span>
                      <span className="text-slate-500">{expandedCategories[category] ? '−' : '+'}</span>
                    </button>

                    {expandedCategories[category] && (
                      <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                        {availableSkills.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                            className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                          >
                            + {skill.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}