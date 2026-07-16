const fmtDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export function DashboardPage({ account }) {
  const today = new Date().toISOString().slice(0, 10)
  const appointments = account.appointments || []
  const sales = account.sales || []
  const todayAppointments = appointments.filter((a) => a.fecha === today && a.estado !== 'cancelada')
  const todaySales = sales.filter((s) => s.date?.startsWith(today))
  const salesTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  const upcoming = appointments
    .filter((a) => a.fecha >= today && a.estado !== 'cancelada')
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
    .slice(0, 5)

  const recentSales = [...sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div className='page active'>
      <div className='sg'>
        <div className='sc'>
          <div className='sv'>{todayAppointments.length}</div>
          <div className='sl'>Citas Hoy</div>
        </div>
        <div className='sc'>
          <div className='sv'>${salesTotal.toFixed(2)}</div>
          <div className='sl'>Ventas Hoy</div>
        </div>
        <div className='sc'>
          <div className='sv'>{appointments.filter((a) => a.estado === 'pendiente').length}</div>
          <div className='sl'>Pendientes</div>
        </div>
        <div className='sc'>
          <div className='sv'>{(account.clients || []).length}</div>
          <div className='sl'>Clientes</div>
        </div>
      </div>
      <div className='dash-two-col'>
        <div className='tc'>
          <div className='th'>
            <h3>Próximas Citas</h3>
          </div>
          <div style={{ padding: 16 }}>
            {upcoming.length ? (
              upcoming.map((item) => (
                <div key={item.id} style={{ marginBottom: 10, fontSize: 13 }}>
                  <strong>{item.mascota}</strong> — {item.clienteName} · {item.fecha} {item.hora}
                </div>
              ))
            ) : (
              <div className='es'>
                <p>Sin citas próximas</p>
              </div>
            )}
          </div>
        </div>
        <div className='tc'>
          <div className='th'>
            <h3>Ventas Recientes</h3>
          </div>
          <div style={{ padding: 16 }}>
            {recentSales.length ? (
              recentSales.map((sale) => (
                <div key={sale.id} style={{ marginBottom: 10, fontSize: 13 }}>
                  <strong>{sale.client || 'General'}</strong> — ${sale.total.toFixed(2)} · {fmtDateTime(sale.date)}
                </div>
              ))
            ) : (
              <div className='es'>
                <p>Sin ventas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
