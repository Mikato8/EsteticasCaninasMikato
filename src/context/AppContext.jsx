import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_COLOR } from '../constants/defaults'
import { DEFAULT_THEME_ID } from '../constants/themes'
import { apiGet, apiPost, apiPut } from '../services/api'
import { clearSession, loadSession, saveSession } from '../services/storage'
import { AppContext } from './context'

const normalizeAccount = (acc) => ({
  ...acc,
  language: acc.language || 'es',
  businessColor: acc.businessColor || DEFAULT_COLOR,
  businessTheme: acc.businessTheme || DEFAULT_THEME_ID,
  businessColors: acc.businessColors || {},
  businessLogo: acc.businessLogo || '',
  clients: acc.clients || [],
  users: acc.users || [],
  services: acc.services || [],
  products: acc.products || [],
  packages: acc.packages || [],
  appointments: acc.appointments || [],
  sales: acc.sales || [],
})

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [session, setSession] = useState(() => loadSession())
  const [currentAccount, setCurrentAccount] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const hydrateAccount = async (businessId) => {
    const response = await apiGet(`/api/businesses/${businessId}/data`)
    if (!response.ok) {
      throw new Error(response.message || 'No se pudo cargar la información del negocio')
    }
    setCurrentAccount(normalizeAccount(response.account))
  }

  useEffect(() => {
    if (!session?.accId) {
      setCurrentAccount(null)
      setCurrentUser(null)
      return
    }

    hydrateAccount(session.accId).catch(() => {
      setCurrentAccount(null)
      setCurrentUser(null)
      setSession(null)
      clearSession()
    })
  }, [session?.accId])

  const patchCurrentAccount = (updater) => {
    setCurrentAccount((prev) => {
      if (!prev) return prev
      const next = normalizeAccount(typeof updater === 'function' ? updater(prev) : { ...prev, ...updater })

      apiPut(`/api/businesses/${prev.id}/data`, next).catch((error) => {
        console.error('Error guardando datos en backend:', error)
      })

      return next
    })
  }

  const login = async (username, password) => {
    const response = await apiPost('/api/auth/login', { username, password })
    if (!response.ok) return response

    const nextSession = { accId: response.user.business_id, usrId: response.user.id }
    setSession(nextSession)
    saveSession(nextSession)
    setCurrentUser({
      id: response.user.id,
      business_id: response.user.business_id,
      name: response.user.name,
      username: response.user.username,
      role: response.user.role,
    })

    await hydrateAccount(response.user.business_id)
    return { ok: true, user: response.user }
  }

  const registerBusiness = async (payload) => {
    const response = await apiPost('/api/auth/register', payload)
    if (!response.ok) return response

    const nextSession = { accId: response.user.business_id, usrId: response.user.id }
    setSession(nextSession)
    saveSession(nextSession)
    setCurrentUser({
      id: response.user.id,
      business_id: response.user.business_id,
      name: response.user.name,
      username: response.user.username,
      role: response.user.role,
    })

    await hydrateAccount(response.user.business_id)
    return { ok: true, user: response.user }
  }

  const logout = () => {
    setCurrentAccount(null)
    setCurrentUser(null)
    setSession(null)
    clearSession()
  }

  const value = useMemo(
    () => ({
      currentAccount,
      currentUser,
      activePage,
      setActivePage,
      login,
      registerBusiness,
      logout,
      patchCurrentAccount,
    }),
    [activePage, currentAccount, currentUser],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}