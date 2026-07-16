const fmt = (dateStr) =>
  new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export function SalesPage({ account }) {
  const rows = [...(account.sales || [])].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className='page active'>
      <div className='tc'>
        <div className='th'>
          <h3>Historial de Ventas</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Artículos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.folio}</td>
                  <td>{fmt(sale.date)}</td>
                  <td>{sale.client || 'Cliente general'}</td>
                  <td>{sale.items?.reduce((sum, item) => sum + item.qty, 0)}</td>
                  <td>${sale.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <div className='es'>
            <p>Sin ventas</p>
          </div>
        )}
      </div>
    </div>
  )
}
