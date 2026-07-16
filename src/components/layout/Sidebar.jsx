const items = [
  ['dashboard', 'Panel', 'fa-chart-pie'],
  ['citas', 'Citas', 'fa-calendar-days'],
  ['pos', 'Punto de Venta', 'fa-cash-register'],
  ['clientes', 'Clientes', 'fa-dog'],
  ['historial', 'Ventas', 'fa-receipt'],
  ['usuarios', 'Usuarios', 'fa-users-gear'],
  ['settings', 'Configuración', 'fa-gear'],
]

export function Sidebar({ businessName, currentUser, activePage, onPageChange, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className='sidebar-hd'>
        <div className='si'>
          <i className='fa-solid fa-paw'></i>
        </div>
        <div>
          <h2>{businessName || 'Mikato'}</h2>
          <span>Software de Gestión</span>
        </div>
      </div>
      <nav className='sidebar-nav'>
        {items.map(([id, label, icon]) => (
          <button
            key={id}
            className={`ni ${activePage === id ? 'active' : ''}`}
            onClick={() => {
              onPageChange(id)
              setMobileOpen(false)
            }}
            type='button'
          >
            <i className={`fa-solid ${icon}`}></i> <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className='sidebar-ft'>
        <div className='ub'>
          <div className='ua'>{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
          <div className='ui'>
            <div className='n'>{currentUser?.name || 'Admin'}</div>
            <div className='r'>{currentUser?.role === 'admin' ? 'Administrador' : 'Empleado'}</div>
          </div>
          <button className='btn-icon' onClick={onLogout} type='button'>
            <i className='fa-solid fa-right-from-bracket'></i>
          </button>
        </div>
      </div>
    </aside>
  )
}
