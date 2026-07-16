const titles = {
  dashboard: 'Panel',
  citas: 'Citas',
  pos: 'Punto de Venta',
  clientes: 'Clientes y Mascotas',
  historial: 'Historial de Ventas',
  usuarios: 'Usuarios',
  settings: 'Configuración',
}

export function Topbar({ activePage, clock, onToggleSidebar }) {
  return (
    <div className='topbar'>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className='menu-tog' type='button' onClick={onToggleSidebar}>
          <i className='fa-solid fa-bars'></i>
        </button>
        <h2>{titles[activePage] || 'Panel'}</h2>
      </div>
      <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{clock}</span>
    </div>
  )
}
