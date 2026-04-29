import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { logout as logoutApi } from '../../api/auth.service';


export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    // POST /auth/logout to clear httpOnly cookie on backend
    await logoutApi();
  } catch (err) {
    // We swallow errors here because even if the network fails, 
    // we MUST clear the local session for the user's safety.
    console.error("Logout backend call failed:", err);
  } finally {
    logout(); // Clear Zustand + LocalStorage
    navigate('/login'); 
  }
};

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo home redirect */}
        <Link to="/" className="text-xl font-bold tracking-tighter text-white hover:text-cyan-400 transition-colors">
          HACK<span className="text-cyan-500">PARTNER</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Conditional admin button mirroring backend requireAdmin logic */}
              {user.userRole === 'ADMIN' && (
                <Link to="/admin/create" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                  + Create
                </Link>
              )}
              <Link to="/profile/me" className="text-sm font-medium text-slate-300 hover:text-white">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}