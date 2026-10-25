import { useState } from 'react'
import { apiRequest } from '../api'

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const route = mode === 'login' ? 'login' : 'register'
      const result = await apiRequest(`/api/auth/${route}`, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      onAuthenticated(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <a className="brand brand-light" href="/" aria-label="Ledger home">
          <span className="brand-mark">L</span>
          <span>ledger<span className="brand-period">.</span></span>
        </a>
        <div className="story-copy">
          <span className="eyebrow">A clearer way to bank</span>
          <h1>Your money,<br />in good order.</h1>
          <p>Keep your accounts organized and move money with confidence.</p>
        </div>
        <div className="story-foot">
          <span className="story-dot" />
          <span>Simple tools. Clear records.</span>
        </div>
        <div className="story-decoration decoration-one" />
        <div className="story-decoration decoration-two" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand"><span className="brand-mark">L</span> ledger<span className="brand-period">.</span></div>
          <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
          <h2>{mode === 'login' ? 'Sign in to Ledger' : 'Create your account'}</h2>
          <p className="form-intro">
            {mode === 'login'
              ? 'Enter your details to access your account.'
              : 'A few details and your Ledger account is ready.'}
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Authentication">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }} role="tab" aria-selected={mode === 'login'}>Sign in</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError('') }} role="tab" aria-selected={mode === 'signup'}>Create account</button>
          </div>

          <form className="form-stack" onSubmit={submit}>
            {mode === 'signup' && (
              <label>
                Full name
                <input
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your name"
                  required
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength="6"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="At least 6 characters"
                required
              />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary button-full" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </form>
          <p className="auth-note">By continuing, you agree to use Ledger responsibly.</p>
        </div>
      </section>
    </main>
  )
}
