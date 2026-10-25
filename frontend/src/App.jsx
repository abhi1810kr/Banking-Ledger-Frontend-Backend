import { useAppStore } from './store/AppStore'
import AuthPage from './components/AuthPage'
import OverviewPage from './components/OverviewPage'
import Sidebar from './components/Sidebar'
import TransactionsPage from './components/TransactionsPage'

function App() {
  const {
    token,
    user,
    page,
    setPage,
    accounts,
    selectedAccountId,
    balance,
    notice,
    dismissNotice,
    loadingAccounts,
    creatingAccount,
    checkingBalance,
    transferBusy,
    transferForm,
    setTransferForm,
    authenticate,
    signOut,
    createAccount,
    checkBalance,
    selectAccount,
    copyAccountId,
    submitTransfer,
  } = useAppStore()

  if (!token) {
    return <AuthPage onAuthenticated={authenticate} />
  }

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        page={page}
        onNavigate={setPage}
        onSignOut={signOut}
      />

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{page === 'home' ? 'Overview' : 'Transactions'}</strong>
          </div>
          <div className="secure-label"><span /> Secure session</div>
        </header>

        <div className="page-content">
          {notice && (
            <div className={`notice ${notice.type}`} role="status">
              <span>{notice.type === 'success' ? '✓' : '!'}</span>{notice.text}
              <button aria-label="Dismiss message" onClick={dismissNotice}>×</button>
            </div>
          )}

          {page === 'home' ? (
            <OverviewPage
              user={user}
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={selectAccount}
              balance={balance}
              checkingBalance={checkingBalance}
              onCheckBalance={checkBalance}
              creatingAccount={creatingAccount}
              onCreateAccount={createAccount}
              loadingAccounts={loadingAccounts}
              onCopyAccountId={copyAccountId}
            />
          ) : (
            <TransactionsPage
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={selectAccount}
              transferForm={transferForm}
              onTransferFormChange={setTransferForm}
              transferBusy={transferBusy}
              onSubmitTransfer={submitTransfer}
              onManageAccounts={() => setPage('home')}
            />
          )}

          <footer className="page-footer">
            <span>© {new Date().getFullYear()} Ledger</span>
            <span>Built for clarity <span className="footer-heart">♥</span></span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
