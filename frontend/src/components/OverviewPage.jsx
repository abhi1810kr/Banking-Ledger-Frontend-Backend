import AccountIdCard from './AccountIdCard'
import { formatMoney } from '../api'

export default function OverviewPage({
  user,
  accounts,
  selectedAccountId,
  onSelectAccount,
  balance,
  checkingBalance,
  onCheckBalance,
  creatingAccount,
  onCreateAccount,
  loadingAccounts,
  onCopyAccountId,
}) {
  const selectedAccount = accounts.find((account) => account._id === selectedAccountId)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  const date = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date())

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">YOUR FINANCIAL HOME</span>
          <h1>Good {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
          <p>Here’s a clear view of your Ledger accounts.</p>
        </div>
        <span className="date-pill">{date}</span>
      </section>

      <section className="overview-grid">
        <article className="balance-card">
          <div className="balance-top">
            <span className="balance-icon">₹</span>
            <span className="card-kicker">ACCOUNT BALANCE</span>
            <span className="balance-status"><span /> LIVE</span>
          </div>
          <div className="balance-amount">{balance === null ? '••••••' : formatMoney(balance)}</div>
          <div className="balance-bottom">
            <label className="account-select-wrap">
              <span>Account</span>
              <select
                value={selectedAccountId}
                onChange={(event) => onSelectAccount(event.target.value)}
                disabled={!accounts.length}
              >
                {!accounts.length && <option value="">No accounts yet</option>}
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account._id.slice(-8).toUpperCase()} · {account.currency || 'INR'}
                  </option>
                ))}
              </select>
            </label>
            <button className="balance-action" onClick={onCheckBalance} disabled={checkingBalance || !accounts.length}>
              {checkingBalance ? 'Checking…' : 'Check balance'} <span>→</span>
            </button>
          </div>
          <div className="balance-decoration" />
        </article>

        <article className="account-card">
          <div className="section-label">
            <span className="small-icon">▤</span> YOUR ACCOUNTS
            <span className="count-pill">{accounts.length}</span>
          </div>
          <h2>{accounts.length ? `${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'} with Ledger` : 'Start with an account'}</h2>
          <p>{accounts.length ? 'Create another account whenever you need one.' : 'Create your first account to check your balance and send money.'}</p>
          <button className="button button-dark" onClick={onCreateAccount} disabled={creatingAccount}>
            {creatingAccount ? 'Creating…' : <><span>＋</span> Create account</>}
          </button>
        </article>
      </section>

      <section className="accounts-section">
        <div className="section-heading">
          <div><span className="eyebrow">AT A GLANCE</span><h2>Your accounts</h2></div>
          <span className="section-meta">{loadingAccounts ? 'Refreshing…' : `${accounts.length} total`}</span>
        </div>
        {accounts.length ? (
          <div className="account-list">
            {accounts.map((account, index) => (
              <button
                className={`account-row ${selectedAccountId === account._id ? 'account-row-active' : ''}`}
                key={account._id}
                onClick={() => onSelectAccount(account._id)}
              >
                <span className={`account-symbol symbol-${index % 3}`}>₹</span>
                <span className="account-info">
                  <strong>Everyday account</strong>
                  <span>•••• {account._id.slice(-8).toUpperCase()}</span>
                </span>
                <span className="account-currency">{account.currency || 'INR'}</span>
                <span className={`status-pill ${account.status?.toLowerCase() || 'active'}`}>
                  <span />{account.status || 'ACTIVE'}
                </span>
                <span className="row-arrow">→</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-art">▤</div>
            <strong>No accounts yet</strong>
            <span>Your accounts will appear here after you create one.</span>
          </div>
        )}
      </section>

      <AccountIdCard account={selectedAccount} onCopy={onCopyAccountId} />
    </>
  )
}
