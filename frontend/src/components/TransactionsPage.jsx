export default function TransactionsPage({
  accounts,
  selectedAccountId,
  onSelectAccount,
  transferForm,
  onTransferFormChange,
  transferBusy,
  onSubmitTransfer,
  onManageAccounts,
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">MOVE MONEY</span>
          <h1>Make a transfer.</h1>
          <p>Send money from one of your accounts to another Ledger account.</p>
        </div>
        <span className="transfer-heading-icon">↗</span>
      </section>

      <section className="transfer-layout">
        <div className="transfer-card">
          <div className="transfer-card-heading">
            <span className="transfer-icon">↗</span>
            <div><h2>New transfer</h2><p>Transfers are recorded securely, with an email confirmation after each completed transfer.</p></div>
          </div>
          <form className="form-stack transfer-form" onSubmit={onSubmitTransfer}>
            <label>
              From account
              <select
                value={selectedAccountId}
                onChange={(event) => onSelectAccount(event.target.value)}
                required
                disabled={!accounts.length}
              >
                {!accounts.length && <option value="">Create an account first</option>}
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account._id.slice(-8).toUpperCase()} · {account.currency || 'INR'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Recipient account ID
              <input
                value={transferForm.toAccount}
                onChange={(event) => onTransferFormChange({ ...transferForm, toAccount: event.target.value })}
                placeholder="Paste the recipient's account ID"
                required
              />
              <span className="field-hint">Ask the recipient for their account ID.</span>
            </label>
            <label>
              Amount
              <div className="amount-input">
                <span>₹</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={transferForm.amount}
                  onChange={(event) => onTransferFormChange({ ...transferForm, amount: event.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </label>
            <button className="button button-primary button-full" type="submit" disabled={transferBusy || !accounts.length}>
              {transferBusy ? 'Sending transfer…' : <>Review and send <span>→</span></>}
            </button>
          </form>
        </div>

        <aside className="transfer-aside">
          <div className="aside-info-icon">i</div>
          <h3>Before you send</h3>
          <ul>
            <li>Double-check the recipient’s account ID.</li>
            <li>Make sure you have enough funds available.</li>
            <li>Transfers cannot be undone from this screen.</li>
          </ul>
          <div className="aside-divider" />
          <span className="aside-secure"><span /> Protected by your secure session</span>
        </aside>
      </section>

      <section className="accounts-section transaction-accounts">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR ACCOUNTS</span><h2>Choose a sending account</h2></div>
          <button className="text-button" onClick={onManageAccounts}>Manage accounts →</button>
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
                <span className="row-arrow">{selectedAccountId === account._id ? '✓' : '→'}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>No sending accounts</strong>
            <span>Create an account on the overview page to get started.</span>
          </div>
        )}
      </section>
    </>
  )
}
