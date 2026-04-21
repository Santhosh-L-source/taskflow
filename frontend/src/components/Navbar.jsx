import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Firebase user has .displayName (camelCase)
  const name = user?.displayName || user?.email?.split('@')[0] || 'User'
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav className="navbar glass">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo">✦</div>
          <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            TaskFlow
          </span>
        </div>

        <div className="navbar-user">
          <span className="navbar-name">{name}</span>
          <div className="avatar" title={user?.email}>{initials}</div>
          <button id="logout-btn" onClick={handleLogout} className="btn btn-ghost btn-sm">
            Sign out
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 50;
          border-radius: 0;
          border-left: none; border-right: none; border-top: none;
          border-bottom: 1px solid var(--border);
        }
        .navbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar-brand { display: flex; align-items: center; gap: 10px; }
        .navbar-logo {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          box-shadow: 0 3px 12px var(--primary-glow);
        }
        .navbar-user { display: flex; align-items: center; gap: 14px; }
        .navbar-name { font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
        .avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 700; color: #fff;
          box-shadow: 0 2px 10px var(--primary-glow);
          cursor: default;
        }
        @media (max-width: 480px) { .navbar-name { display: none; } }
      `}</style>
    </nav>
  )
}
