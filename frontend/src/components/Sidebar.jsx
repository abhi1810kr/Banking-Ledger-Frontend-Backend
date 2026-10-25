export default function Sidebar({ user, page, onNavigate, onSignOut }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onNavigate('home') }}>
        <span className="brand-mark">L</span><span>ledger<span className="brand-period">.</span></span>
      </a>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        <button className={page === 'home' ? 'nav-item selected' : 'nav-item'} onClick={() => onNavigate('home')}>
          <span className="nav-icon">⌂</span> Overview
        </button>
        <button className={page === 'transactions' ? 'nav-item selected' : 'nav-item'} onClick={() => onNavigate('transactions')}>
          <span className="nav-icon">↗</span> Transactions
        </button>
      </nav>
      <button className="mobile-signout" onClick={onSignOut}>
        <span className="nav-icon" aria-hidden="true">↪</span> Logout
      </button>
      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon">i</span>
          <div><strong>Need a hand?</strong><span>Your accounts, all in one place.</span></div>
        </div>
        <button className="profile-button" onClick={onSignOut}>
          <span className="avatar">{(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}</span>
          <span className="profile-text"><strong>{user?.name || 'Your profile'}</strong><span>{user?.email || ''}</span></span>
          <span className="sign-out-icon" aria-hidden="true">↪</span>
        </button>
      </div>
    </aside>
  )
}
