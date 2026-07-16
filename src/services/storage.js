const ACCOUNTS_KEY = 'mikato_accounts'
const SESSION_KEY = 'mikato_sess'

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const loadAccounts = () => safeParse(localStorage.getItem(ACCOUNTS_KEY), [])
export const saveAccounts = (accounts) => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))

export const loadSession = () => safeParse(localStorage.getItem(SESSION_KEY), null)
export const saveSession = (session) => localStorage.setItem(SESSION_KEY, JSON.stringify(session))
export const clearSession = () => localStorage.removeItem(SESSION_KEY)
