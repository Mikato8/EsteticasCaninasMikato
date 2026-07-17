export const money = (value) => `$${Number(value || 0).toFixed(2)}`

export const itemCount = (sale) => (sale.items || []).reduce((sum, item) => sum + (item.qty || 0), 0)

const csvEscape = (value) => {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const salesToCsv = (sales = []) => {
  const header = ['Folio', 'Fecha', 'Cliente', 'Articulos', 'Subtotal', 'Descuento', 'IVA', 'Total', 'Cajero']
  const rows = sales.map((sale) => [
    sale.folio,
    sale.date,
    sale.client || 'Cliente general',
    itemCount(sale),
    Number(sale.subtotal || 0).toFixed(2),
    Number(sale.discount || 0).toFixed(2),
    Number(sale.iva || 0).toFixed(2),
    Number(sale.total || 0).toFixed(2),
    sale.user || '',
  ])
  return [header, ...rows].map((cols) => cols.map(csvEscape).join(',')).join('\n')
}

export const filterSalesByDate = (sales = [], from = '', to = '') =>
  sales.filter((sale) => {
    const day = (sale.date || '').slice(0, 10)
    if (from && day < from) return false
    if (to && day > to) return false
    return true
  })
