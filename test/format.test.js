import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterSalesByDate, itemCount, money, salesToCsv } from '../src/utils/format.js'

test('money formats numbers with two decimals and handles nullish', () => {
  assert.equal(money(10), '$10.00')
  assert.equal(money(1.5), '$1.50')
  assert.equal(money(null), '$0.00')
})

test('itemCount sums quantities of a sale', () => {
  assert.equal(itemCount({ items: [{ qty: 2 }, { qty: 3 }] }), 5)
  assert.equal(itemCount({}), 0)
})

test('salesToCsv includes a header and escapes special characters', () => {
  const csv = salesToCsv([
    { folio: 'V-0001', date: '2026-01-01T10:00:00.000Z', client: 'Doe, John', items: [{ qty: 2 }], subtotal: 100, discount: 0, iva: 16, total: 116, user: 'Ana' },
  ])
  const lines = csv.split('\n')
  assert.equal(lines[0], 'Folio,Fecha,Cliente,Articulos,Subtotal,Descuento,IVA,Total,Cajero')
  assert.match(lines[1], /"Doe, John"/)
  assert.match(lines[1], /116\.00/)
})

test('filterSalesByDate filters inclusively by day', () => {
  const sales = [
    { date: '2026-01-01T10:00:00.000Z' },
    { date: '2026-01-05T10:00:00.000Z' },
    { date: '2026-01-10T10:00:00.000Z' },
  ]
  assert.equal(filterSalesByDate(sales, '2026-01-02', '2026-01-09').length, 1)
  assert.equal(filterSalesByDate(sales, '', '2026-01-05').length, 2)
  assert.equal(filterSalesByDate(sales, '2026-01-05', '').length, 2)
  assert.equal(filterSalesByDate(sales).length, 3)
})
