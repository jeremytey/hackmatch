import { useEffect, useState } from 'react';
import { getMyProfile, updateProfile, getAllSkills} from '../../api/user.service';
import type { UserProfile, UpdateUserDto } from '../../types/user.types';
import type { Skill } from '../../types/skill.types';

export default function MyProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateUserDto>({});
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch both profile and master skills list
        const [data, skillsList] = await Promise.all([getMyProfile(), getAllSkills()]);
        
        setProfile(data);
        setAllSkills(skillsList);
        
        setFormData({
          university: data.university || '',
          role: (data.role as UpdateUserDto['role']) || 'DEVELOPER',
          bio: data.bio || '',
          skills: data.skills?.map(s => s.id) || [],
        });
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Toggle skill selection in the form data
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
      setSkillSearch(''); 
    } catch (err) {
      alert("Update failed. Please check your connection.");
    }
  };

  // Filter skills for the suggestion list
  const suggestedSkills = allSkills
    .filter(s => 
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) && 
      !formData.skills?.includes(s.id)
    )
    .slice(0, 8);

  if (loading) return <div className="p-20 text-center text-slate-500 font-medium italic">Loading your profile...</div>;
  if (!profile) return <div className="p-20 text-center text-red-400 font-medium">Unable to load profile data.</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-all border border-slate-700 shadow-lg active:scale-95"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-10 shadow-2xl backdrop-blur-md">
        {/* User Header */}
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-cyan-900/20">
            {profile?.username ? profile.username[0].toUpperCase() : '?'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
            <p className="text-slate-500 font-medium tracking-wide">{profile.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">University</label>
            {isEditing ? (
              <input 
                className="w-full rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Sunway University"
                value={formData.university || ''}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
            ) : (
              <p className="text-slate-200 font-semibold bg-slate-800/20 p-3 rounded-xl border border-transparent">{profile.university || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Primary Role</label>
            {isEditing ? (
              <select 
                className="w-full rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all appearance-none cursor-pointer"
                value={formData.role || 'DEVELOPER'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UpdateUserDto['role']  })}
              >
                <option value="DEVELOPER">Developer</option>
                <option value="DESIGNER">Designer</option>
                <option value="PRODUCT_MANAGER">Product Manager</option>
                <option value="RESEARCHER">Researcher</option>
              </select>
            ) : (
              <p className="text-slate-200 font-semibold bg-slate-800/20 p-3 rounded-xl border border-transparent">{profile.role || 'Not set'}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Short Bio</label>
          {isEditing ? (
            <textarea 
              rows={4}
              className="w-full rounded-xl bg-slate-800/50 border border-slate-700 p-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none placeholder:text-slate-600"
              placeholder="What are you building? What's your stack?"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          ) : (
            <p className="text-slate-300 leading-relaxed italic bg-slate-800/20 p-5 rounded-2xl border border-slate-800/50">
              {profile.bio || 'Share a little about yourself...'}
            </p>
          )}
        </div>

        <div className="space-y-4 pt-4">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Tech Stack</label>
          
          <div className="flex flex-wrap gap-2">
            {allSkills.filter(s => formData.skills?.includes(s.id)).map(skill => (
              <button
                key={skill.id}
                type="button"
                disabled={!isEditing}
                onClick={() => toggleSkill(skill.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isEditing 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                {skill.name} {isEditing && <span className="ml-1 opacity-50">×</span>}
              </button>
            ))}
            {!formData.skills?.length && !isEditing && <p className="text-slate-600 text-sm italic">No skills listed.</p>}
          </div>

          {isEditing && (
            <div className="space-y-3 mt-4">
              <input
                type="text"
                placeholder="Search skills to add..."
                className="w-full rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map(skill => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    + {skill.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}