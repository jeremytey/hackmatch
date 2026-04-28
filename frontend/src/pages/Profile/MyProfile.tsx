import { useEffect, useState } from 'react';
import { getMyProfile, updateProfile } from '../../api/user.service';
import type { UserProfile, UpdateUserDto } from '../../types/user.types';

export default function MyProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateUserDto>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setFormData({
          university: data.university || '',
          role: (data.role as UpdateUserDto['role']) || 'DEVELOPER',
          bio: data.bio || '',
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      alert("Update failed. Please check your connection.");
    }
  };

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
          {/* The Fix: Safe navigation + Fallback character */}
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
              {profile.bio || 'Share a little about yourself to attract the right teammates...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}