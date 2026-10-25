import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiRequest, TOKEN_KEY, USER_KEY } from '../api'

const AppStoreContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function AppStoreProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readStoredUser)
  const [page, setPage] = useState('home')
  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [balance, setBalance] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [checkingBalance, setCheckingBalance] = useState(false)
  const [transferBusy, setTransferBusy] = useState(false)
  const [transferForm, setTransferForm] = useState({ toAccount: '', amount: '' })

  const loadAccounts = useCallback(async (authToken = token) => {
    if (!authToken) return
    setLoadingAccounts(true)
    try {
      const result = await apiRequest('/api/accounts', { token: authToken })
      const nextAccounts = result.accounts || []
      setAccounts(nextAccounts)
      setSelectedAccountId((current) =>
        nextAccounts.some((account) => account._id === current)
          ? current
          : nextAccounts[0]?._id || '',
      )
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoadingAccounts(false)
    }
  }, [token])

  useEffect(() => {
    if (token) loadAccounts(token)
  }, [token, loadAccounts])

  const authenticate = useCallback((result) => {
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    setToken(result.token)
    setUser(result.user)
    setPage('home')
    setNotice({ type: 'success', text: `Welcome${result.user?.name ? `, ${result.user.name}` : ''}.` })
  }, [])

  const signOut = useCallback(async () => {
    try {
      if (token) {
        await apiRequest('/api/auth/logout', { method: 'POST', token })
      }
    } catch {
      // Clear the local session even if the server is unavailable.
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setAccounts([])
    setSelectedAccountId('')
    setBalance(null)
    setPage('home')
    setNotice(null)
  }, [token])

  const createAccount = useCallback(async () => {
    setCreatingAccount(true)
    setNotice(null)
    try {
      const result = await apiRequest('/api/accounts', { method: 'POST', token })
      setNotice({ type: 'success', text: 'Your new account is ready.' })
      setBalance(null)
      await loadAccounts()
      setSelectedAccountId(result.account._id)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setCreatingAccount(false)
    }
  }, [loadAccounts, token])

  const checkBalance = useCallback(async () => {
    if (!selectedAccountId) {
      setNotice({ type: 'error', text: 'Create an account first to check its balance.' })
      return
    }
    setCheckingBalance(true)
    setNotice(null)
    try {
      const result = await apiRequest(`/api/accounts/balance/${selectedAccountId}`, { token })
      setBalance(result.balance)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setCheckingBalance(false)
    }
  }, [selectedAccountId, token])

  const selectAccount = useCallback((accountId) => {
    setSelectedAccountId(accountId)
    setBalance(null)
  }, [])

  const copyAccountId = useCallback(async (accountId) => {
    try {
      await navigator.clipboard.writeText(accountId)
      setNotice({ type: 'success', text: 'Account ID copied to clipboard.' })
    } catch {
      setNotice({ type: 'error', text: 'Could not copy the account ID. Check your browser clipboard permissions.' })
    }
  }, [])

  const submitTransfer = useCallback(async (event) => {
    event.preventDefault()
    const amount = Number(transferForm.amount)
    if (!selectedAccountId) {
      setNotice({ type: 'error', text: 'Create an account before sending a transfer.' })
      return
    }
    if (!transferForm.toAccount.trim() || !Number.isFinite(amount) || amount <= 0) {
      setNotice({ type: 'error', text: 'Enter a valid recipient account ID and an amount greater than zero.' })
      return
    }

    setTransferBusy(true)
    setNotice(null)
    try {
      const result = await apiRequest('/api/transactions', {
        method: 'POST',
        token,
        body: JSON.stringify({
          fromAccount: selectedAccountId,
          toAccount: transferForm.toAccount.trim(),
          amount,
          idempotencyKey: crypto.randomUUID(),
        }),
      })
      setNotice({ type: 'success', text: result.message || 'Transfer completed.' })
      setTransferForm({ toAccount: '', amount: '' })
      setBalance(null)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setTransferBusy(false)
    }
  }, [selectedAccountId, token, transferForm])

  const store = {
    token,
    user,
    page,
    setPage,
    accounts,
    selectedAccountId,
    balance,
    notice,
    dismissNotice: () => setNotice(null),
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
  }

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error('useAppStore must be used within an AppStoreProvider')
  }
  return store
}
