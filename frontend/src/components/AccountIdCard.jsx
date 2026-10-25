export default function AccountIdCard({ account, onCopy }) {
  if (!account?._id) return null

  return (
    <section className="account-id-card" aria-label="Selected account ID">
      <div className="account-id-copy">
        <span className="eyebrow">ACCOUNT DETAILS</span>
        <strong>Account ID</strong>
        <code>{account._id}</code>
      </div>
      <button className="copy-account-button" onClick={() => onCopy(account._id)}>
        <span aria-hidden="true">▢</span> Copy ID
      </button>
    </section>
  )
}
