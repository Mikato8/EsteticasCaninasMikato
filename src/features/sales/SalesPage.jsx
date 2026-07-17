import { useMemo, useState } from 'react'
import { Modal } from '../../components/common/Modal'
import { filterSalesByDate, itemCount, money, salesToCsv } from '../../utils/format'

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export function SalesPage({ account }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selected, setSelected] = useState(null)

  const rows = useMemo(
    () => filterSalesByDate(account.sales || [], from, to).sort((a, b) => b.date.localeCompare(a.date)),
    [account.sales, from, to],
  )

  const totals = useMemo(
    () => ({
      count: rows.length,
      revenue: rows.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
    }),
    [rows],
  )

  const exportCsv = () => {
    const blob = new Blob([salesToCsv(rows)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ventas_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className='page active'>
      <div className='tc'>
        <div className='th'>
          <h3>Historial de Ventas</h3>
          <div className='tf'>
            <input type='date' value={from} onChange={(event) => setFrom(event.target.value)} aria-label='Desde' />
            <input type='date' value={to} onChange={(event) => setTo(event.target.value)} aria-label='Hasta' />
            <button className='btn btn-s btn-sm' type='button' onClick={() => { setFrom(''); setTo('') }}>
              Limpiar
            </button>
            <button className='btn btn-p btn-sm' type='button' onClick={exportCsv} disabled={!rows.length}>
              <i className='fa-solid fa-file-csv'></i> Exportar CSV
            </button>
          </div>
        </div>
        <div style={{ padding: '8px 16px', display: 'flex', gap: 24, fontSize: 13, color: 'var(--fg2)' }}>
          <span>Ventas: <strong>{totals.count}</strong></span>
          <span>Ingresos: <strong>{money(totals.revenue)}</strong></span>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.folio}</td>
                  <td>{fmt(sale.date)}</td>
                  <td>{sale.client || 'Cliente general'}</td>
                  <td>{itemCount(sale)}</td>
                  <td>{money(sale.total)}</td>
                  <td>
                    <button className='btn-icon' type='button' onClick={() => setSelected(sale)} aria-label='Ver detalle'>
                      <i className='fa-solid fa-eye'></i>
                    </button>
                  </td>
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

      <Modal open={Boolean(selected)} title={selected ? `Venta ${selected.folio}` : ''} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <div className='mb'>
              <div style={{ fontSize: 13, color: 'var(--fg2)', marginBottom: 12 }}>
                <div>Cliente: <strong>{selected.client || 'Cliente general'}</strong></div>
                <div>Fecha: {fmt(selected.date)}</div>
                {selected.user && <div>Cajero: {selected.user}</div>}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Artículo</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{money(item.price)}</td>
                      <td>{money(item.subtotal ?? item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='ct' style={{ marginTop: 12 }}>
                <div className='cr'>
                  <span>Subtotal</span>
                  <span>{money(selected.subtotal)}</span>
                </div>
                <div className='cr'>
                  <span>Descuento ({selected.discountRate || 0}%)</span>
                  <span>-{money(selected.discount)}</span>
                </div>
                <div className='cr'>
                  <span>IVA</span>
                  <span>{money(selected.iva)}</span>
                </div>
                <div className='cr total'>
                  <span>Total</span>
                  <span>{money(selected.total)}</span>
                </div>
              </div>
            </div>
            <div className='mf'>
              <button className='btn btn-p' type='button' onClick={() => setSelected(null)} style={{ width: 'auto' }}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
