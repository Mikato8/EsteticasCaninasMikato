import { useState } from 'react'
import { LoginScreen } from './components/auth/LoginScreen'
import { ToastContainer } from './components/common/ToastContainer'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { useApp } from './hooks/useApp'
import { AppointmentsPage } from './features/appointments/AppointmentsPage'
import { ClientsPage } from './features/clients/ClientsPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { PosPage } from './features/pos/PosPage'
import { SalesPage } from './features/sales/SalesPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { UsersPage } from './features/users/UsersPage'
import { useClock } from './hooks/useClock'
import { gid } from './utils/id'

function App() {
  const { currentAccount, currentUser, activePage, setActivePage, login, registerBusiness, logout, patchCurrentAccount } = useApp()
  const [toasts, setToasts] = useState([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const clock = useClock('es-MX')

  const notify = (message, type = 's') => {
    const id = gid()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 3000)
  }

  const handleLogin = async ({ username, password }) => {
    const result = await login(username, password)
    if (!result.ok) notify(result.message, 'e')
    else notify('Sesión iniciada')
  }
  const handleRegister = async (payload) => {
    const result = await registerBusiness(payload)
    if (!result.ok) notify(result.message, 'e')
    else notify('Negocio creado correctamente')
  }

  const handleLogout = () => {
    logout()
    notify('Sesión cerrada', 'i')
  }

  if (!currentAccount || !currentUser) {
    return (
      <>
        <ToastContainer toasts={toasts} />
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
      </>
    )
  }

  return (
    <>
      <div className='bg-decor'>
        <div className='blob b1'></div>
        <div className='blob b2'></div>
      </div>
      <ToastContainer toasts={toasts} />
      <div className='app active'>
        <Sidebar
          businessName={currentAccount.businessName}
          currentUser={currentUser}
          activePage={activePage}
          onPageChange={setActivePage}
          onLogout={handleLogout}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />
        <div className='main'>
          <Topbar activePage={activePage} clock={clock} onToggleSidebar={() => setMobileSidebarOpen((v) => !v)} />
          {activePage === 'dashboard' && <DashboardPage account={currentAccount} />}
          {activePage === 'citas' && <AppointmentsPage account={currentAccount} updateAccount={patchCurrentAccount} notify={notify} />}
          {activePage === 'pos' && (
            <PosPage account={currentAccount} user={currentUser} updateAccount={patchCurrentAccount} notify={notify} />
          )}
          {activePage === 'clientes' && <ClientsPage account={currentAccount} updateAccount={patchCurrentAccount} notify={notify} />}
          {activePage === 'historial' && <SalesPage account={currentAccount} />}
          {activePage === 'usuarios' && (
            <UsersPage account={currentAccount} currentUser={currentUser} updateAccount={patchCurrentAccount} notify={notify} />
          )}
          {activePage === 'settings' && <SettingsPage account={currentAccount} updateAccount={patchCurrentAccount} notify={notify} />}
        </div>
      </div>
    </>
  )
}

export default App
