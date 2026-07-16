import { useMemo, useState } from 'react'
import { gid } from '../../utils/id'

const tabs = [
  ['servicio', 'Servicios'],
  ['producto', 'Productos'],
  ['paquete', 'Paquetes'],
]

const money = (value) => `$${value.toFixed(2)}`

export function PosPage({ account, user, updateAccount, notify }) {
  const [cart, setCart] = useState([])
  const [tab, setTab] = useState('servicio')
  const [discountRate, setDiscountRate] = useState(0)
  const [clientName, setClientName] = useState('')
  const [selectedClient, setSelectedClient] = useState('')

  const items = useMemo(() => {
    if (tab === 'servicio') return account.services || []
    if (tab === 'producto') return account.products || []
    return account.packages || []
  }, [account.packages, account.products, account.services, tab])

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === item.id)
      if (found) return prev.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x))
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discount = subtotal * (discountRate / 100)
  const taxable = Math.max(0, subtotal - discount)
  const iva = taxable * 0.16
  const total = taxable + iva

  const checkout = () => {
    if (!cart.length) {
      notify('Carrito vacío', 'e')
      return
    }
    const client = (account.clients || []).find((c) => c.id === selectedClient)
    const sale = {
      id: gid(),
      folio: `V-${String((account.sales || []).length + 1).padStart(4, '0')}`,
      date: new Date().toISOString(),
      client: clientName || client?.name || 'Cliente general',
      items: cart.map((it) => ({ name: it.name, price: it.price, qty: it.qty, subtotal: it.qty * it.price })),
      subtotal,
      discountRate,
      discount,
      iva,
      total,
      user: user.name,
    }
    updateAccount((prev) => ({ ...prev, sales: [...(prev.sales || []), sale] }))
    setCart([])
    setDiscountRate(0)
    setClientName('')
    setSelectedClient('')
    notify('Venta procesada')
  }

  return (
    <div className='page active'>
      <div className='tabs'>
        {tabs.map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)} type='button'>
            {label}
          </button>
        ))}
      </div>
      <div className='pos-l'>
        <div className='pos-g'>
          {items.map((item) => (
            <button key={item.id} className='pc' onClick={() => addToCart(item)} type='button'>
              <div className='pn'>{item.name}</div>
              <div className='pp'>{money(item.price)}</div>
            </button>
          ))}
        </div>
        <div className='pos-cart'>
          <div className='pch'>
            Carrito <span id='cartCt'>({cart.reduce((sum, item) => sum + item.qty, 0)})</span>
          </div>
          <div className='pci'>
            {cart.length ? (
              cart.map((item) => (
                <div className='ci' key={item.id}>
                  <div className='ci-i'>
                    <div className='ci-n'>{item.name}</div>
                    <div className='ci-p'>{money(item.price)} c/u</div>
                  </div>
                  <div className='ci-q'>
                    <button
                      type='button'
                      onClick={() => {
                        setCart((prev) =>
                          prev
                            .map((it) => (it.id === item.id ? { ...it, qty: it.qty - 1 } : it))
                            .filter((it) => it.qty > 0),
                        )
                      }}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type='button'
                      onClick={() => setCart((prev) => prev.map((it) => (it.id === item.id ? { ...it, qty: it.qty + 1 } : it)))}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className='es'>
                <p>Agrega servicios o productos</p>
              </div>
            )}
          </div>
          <div className='pcf'>
            <div className='ct'>
              <div className='cr'>
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className='cr'>
                <span>Descuento ({discountRate}%)</span>
                <span>-{money(discount)}</span>
              </div>
              <div className='cr'>
                <span>IVA (16%)</span>
                <span>{money(iva)}</span>
              </div>
              <div className='cr total'>
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <div className='fg' style={{ marginBottom: 8 }}>
              <label>Descuento</label>
              <input type='number' min='0' max='100' value={discountRate} onChange={(event) => setDiscountRate(Number(event.target.value) || 0)} />
            </div>
            <div className='fg' style={{ marginBottom: 8 }}>
              <label>Cliente registrado</label>
              <select
                value={selectedClient}
                onChange={(event) => {
                  const client = (account.clients || []).find((c) => c.id === event.target.value)
                  setSelectedClient(event.target.value)
                  setClientName(client?.name || '')
                }}
              >
                <option value=''>Cliente general</option>
                {(account.clients || []).map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} — {client.mascota}
                  </option>
                ))}
              </select>
            </div>
            <div className='fg' style={{ marginBottom: 8 }}>
              <input placeholder='Nombre para ticket' value={clientName} onChange={(event) => setClientName(event.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className='btn btn-s' style={{ flex: 1 }} type='button' onClick={() => setCart([])}>
                Limpiar
              </button>
              <button className='btn btn-p' style={{ flex: 2 }} type='button' onClick={checkout}>
                Cobrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
