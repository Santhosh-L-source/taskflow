import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, parseFirebaseError } from '../context/AuthContext'
import { isFirebaseConfigured } from '../firebase'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(parseFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <span className="gradient-text">TaskFlow</span>
        </div>

        {/* Firebase setup banner */}
        {!isFirebaseConfigured && (
          <div className="setup-banner">
            <div className="setup-banner-icon">⚙️</div>
            <div>
              <strong>Firebase Setup Required</strong>
              <p>Add your Firebase environment variables to Vercel, then redeploy.</p>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="setup-link"
              >
                Open Firebase Console →
              </a>
            </div>
          </div>
        )}

        <h1 className="auth-title">Welcome back</h1>
        <p className="text-secondary text-sm" style={{ marginBottom: 28 }}>
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email" name="email" type="email"
              className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              required autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password" name="password" type="password"
              className="form-input" placeholder="••••••••"
              value={form.password} onChange={handleChange}
              required autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit" type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', marginTop: 4 }}
            disabled={loading || !isFirebaseConfigured}
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Signing in…</>
              : isFirebaseConfigured ? 'Sign In' : 'Firebase Not Configured'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center;
          padding: 24px; position: relative; z-index: 1;
        }
        .auth-card {
          width: 100%; max-width: 440px;
          border-radius: var(--radius-xl); padding: 44px 40px;
          box-shadow: var(--shadow-lg), 0 0 60px rgba(124,111,247,0.12);
          animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .auth-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 28px; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em;
        }
        .auth-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; box-shadow: 0 4px 16px var(--primary-glow);
        }
        .auth-title { margin-bottom: 6px; font-size: 1.7rem; }
        .auth-footer { margin-top: 24px; text-align: center; font-size: 0.9rem; color: var(--text-secondary); }
        .auth-link { color: var(--primary-light); font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }

        .setup-banner {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 14px 16px; margin-bottom: 20px;
          background: rgba(250, 204, 21, 0.08);
          border: 1px solid rgba(250, 204, 21, 0.2);
          border-radius: var(--radius-md); font-size: 0.85rem;
        }
        .setup-banner-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
        .setup-banner strong { display: block; color: var(--warning); margin-bottom: 4px; }
        .setup-banner p { color: var(--text-secondary); margin-bottom: 8px; line-height: 1.5; }
        .setup-link { color: var(--primary-light); font-weight: 600; text-decoration: none; font-size: 0.82rem; }
        .setup-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
