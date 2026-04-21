import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, parseFirebaseError } from '../context/AuthContext'

export default function Signup() {
  const { signup }  = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]       = useState({ displayName: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8)            s++
    if (/[A-Z]/.test(p))         s++
    if (/[0-9]/.test(p))         s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#f87171', '#facc15', '#a89cf8', '#4ade80'][strength]

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signup(form.email, form.password, form.displayName)
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

        <h1 className="auth-title">Create account</h1>
        <p className="text-secondary text-sm" style={{ marginBottom: 28 }}>
          Join TaskFlow and start managing your tasks
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Display Name</label>
            <input
              id="signup-name"
              name="displayName"
              type="text"
              className="form-input"
              placeholder="Your name"
              value={form.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            {form.password && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(strength / 4) * 100}%`,
                    background: strengthColor,
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.78rem', color: strengthColor, fontWeight: 600, minWidth: 40 }}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          <button
            id="signup-submit"
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', marginTop: 4 }}
            disabled={loading}
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Creating account…</>
              : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          z-index: 1;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-xl);
          padding: 44px 40px;
          box-shadow: var(--shadow-lg), 0 0 60px rgba(124,111,247,0.12);
          animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .auth-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 28px;
          font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em;
        }
        .auth-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 4px 16px var(--primary-glow);
        }
        .auth-title { margin-bottom: 6px; font-size: 1.7rem; }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .auth-link { color: var(--primary-light); font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
