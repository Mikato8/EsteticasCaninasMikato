import { useMemo, useState } from 'react'
import { Modal } from '../../components/common/Modal'
import { getTheme, themes } from '../../constants/themes'
import { gid } from '../../utils/id'

const tabs = [
  ['biz', 'Mi Negocio'],
  ['apariencia', 'Apariencia'],
  ['servicio', 'Servicios'],
  ['producto', 'Productos'],
  ['paquete', 'Paquetes'],
  ['data', 'Datos'],
]

const itemSeed = { id: null, name: '', cost: 0, price: 0, icon: 'fa-paw', color: '#60a5fa', desc: '', type: 'servicio' }

export function SettingsPage({ account, updateAccount, notify }) {
  const [tab, setTab] = useState('biz')
  const [businessDraft, setBusinessDraft] = useState({
    businessName: account.businessName || '',
    businessPhone: account.businessPhone || '',
    businessEmail: account.businessEmail || '',
    businessAddress: account.businessAddress || '',
  })
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemDraft, setItemDraft] = useState(itemSeed)

  const list = useMemo(() => {
    if (tab === 'servicio') return account.services || []
    if (tab === 'producto') return account.products || []
    if (tab === 'paquete') return account.packages || []
    return []
  }, [account.packages, account.products, account.services, tab])

  const persistBusiness = () => {
    updateAccount((prev) => ({ ...prev, ...businessDraft }))
    notify('Datos del negocio guardados')
  }

  const saveItem = () => {
    if (!itemDraft.name || Number(itemDraft.price) <= 0) {
      notify('Nombre y precio válidos son obligatorios', 'e')
      return
    }
    updateAccount((prev) => {
      const key = `${itemDraft.type}s`
      const source = [...(prev[key] || [])]
      const payload = { ...itemDraft, id: itemDraft.id || gid(), price: Number(itemDraft.price), cost: Number(itemDraft.cost) }
      const index = source.findIndex((item) => item.id === payload.id)
      if (index >= 0) source[index] = payload
      else source.push(payload)
      return { ...prev, [key]: source }
    })
    notify(itemDraft.id ? 'Elemento actualizado' : 'Elemento creado')
    setItemModalOpen(false)
    setItemDraft(itemSeed)
  }

  const activeTheme = getTheme(account.businessTheme)
  const colors = account.businessColors || {}
  const accentValue = account.businessColor || activeTheme.vars['--accent']
  const accent2Value = colors.accent2 || activeTheme.vars['--accent2']
  const bgValue = colors.bg || activeTheme.vars['--bg']

  const selectTemplate = (theme) => {
    updateAccount((prev) => ({
      ...prev,
      businessTheme: theme.id,
      businessColor: theme.vars['--accent'],
      businessColors: { accent2: theme.vars['--accent2'], bg: theme.vars['--bg'] },
    }))
    notify(`Plantilla "${theme.name}" aplicada`)
  }

  const setAccent = (value) => updateAccount((prev) => ({ ...prev, businessColor: value }))
  const setColorOverride = (key, value) =>
    updateAccount((prev) => ({ ...prev, businessColors: { ...(prev.businessColors || {}), [key]: value } }))

  const resetToTemplate = () => {
    updateAccount((prev) => ({
      ...prev,
      businessColor: activeTheme.vars['--accent'],
      businessColors: { accent2: activeTheme.vars['--accent2'], bg: activeTheme.vars['--bg'] },
    }))
    notify('Colores restablecidos a la plantilla', 'i')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(account, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mikato_backup_${(account.businessName || 'negocio').replace(/\s+/g, '_')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    notify('Respaldo descargado')
  }

  return (
    <div className='page active'>
      <div className='tabs'>
        {tabs.map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? 'active' : ''}`} type='button' onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'biz' && (
        <div className='set-grid'>
          <div className='set-card'>
            <h3>Información del Negocio</h3>
            <div className='fg'>
              <label>Nombre del Negocio</label>
              <input
                value={businessDraft.businessName}
                onChange={(event) => setBusinessDraft((prev) => ({ ...prev, businessName: event.target.value }))}
              />
            </div>
            <div className='fg'>
              <label>Teléfono</label>
              <input
                value={businessDraft.businessPhone}
                onChange={(event) => setBusinessDraft((prev) => ({ ...prev, businessPhone: event.target.value }))}
              />
            </div>
            <div className='fg'>
              <label>Email</label>
              <input
                type='email'
                value={businessDraft.businessEmail}
                onChange={(event) => setBusinessDraft((prev) => ({ ...prev, businessEmail: event.target.value }))}
              />
            </div>
            <div className='fg'>
              <label>Dirección</label>
              <textarea
                rows='2'
                value={businessDraft.businessAddress}
                onChange={(event) => setBusinessDraft((prev) => ({ ...prev, businessAddress: event.target.value }))}
              ></textarea>
            </div>
            <button className='btn btn-p' type='button' onClick={persistBusiness}>
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {tab === 'apariencia' && (
        <div className='set-grid'>
          <div className='set-card'>
            <h3>Plantilla de diseño</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
              {themes.map((theme) => {
                const isActive = theme.id === account.businessTheme
                return (
                  <button
                    key={theme.id}
                    type='button'
                    onClick={() => selectTemplate(theme)}
                    style={{
                      textAlign: 'left',
                      background: 'var(--bg2)',
                      border: `2px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10,
                      padding: 12,
                      cursor: 'pointer',
                      color: 'var(--fg)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                      {['--bg', '--accent', '--accent2'].map((key) => (
                        <span
                          key={key}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: theme.vars[key],
                            border: '1px solid var(--border)',
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {theme.name}
                      {isActive && <i className='fa-solid fa-circle-check' style={{ color: 'var(--accent)' }}></i>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className='set-card'>
            <h3>Colores personalizados</h3>
            <p style={{ fontSize: 12, color: 'var(--fg2)', marginBottom: 14 }}>
              Ajusta los colores sobre la plantilla seleccionada. Los cambios se aplican al instante.
            </p>
            <div className='fg'>
              <label>Acento principal</label>
              <input type='color' value={accentValue} onChange={(event) => setAccent(event.target.value)} />
            </div>
            <div className='fg'>
              <label>Acento secundario</label>
              <input type='color' value={accent2Value} onChange={(event) => setColorOverride('accent2', event.target.value)} />
            </div>
            <div className='fg'>
              <label>Fondo</label>
              <input type='color' value={bgValue} onChange={(event) => setColorOverride('bg', event.target.value)} />
            </div>
            <button className='btn btn-s' type='button' onClick={resetToTemplate}>
              Restablecer a la plantilla
            </button>
          </div>
        </div>
      )}

      {['servicio', 'producto', 'paquete'].includes(tab) && (
        <div className='tc'>
          <div className='th'>
            <h3>{tab === 'servicio' ? 'Servicios' : tab === 'producto' ? 'Productos' : 'Paquetes'}</h3>
            <button
              className='btn btn-p btn-sm'
              type='button'
              onClick={() => {
                setItemDraft({ ...itemSeed, type: tab })
                setItemModalOpen(true)
              }}
            >
              Nuevo
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Costo</th>
                  <th>Precio</th>
                  <th>Ganancia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${Number(item.cost).toFixed(2)}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>${(Number(item.price) - Number(item.cost)).toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className='btn-icon' type='button' onClick={() => { setItemDraft(item); setItemModalOpen(true) }}>
                          <i className='fa-solid fa-pen-to-square'></i>
                        </button>
                        <button
                          className='btn-icon'
                          type='button'
                          onClick={() => {
                            const key = `${tab}s`
                            updateAccount((prev) => ({ ...prev, [key]: (prev[key] || []).filter((x) => x.id !== item.id) }))
                            notify('Elemento eliminado', 'i')
                          }}
                        >
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'data' && (
        <div className='set-grid'>
          <div className='set-card'>
            <h3>Exportar Datos</h3>
            <button className='btn btn-s' type='button' onClick={exportData}>
              Descargar respaldo
            </button>
          </div>
        </div>
      )}

      <Modal open={itemModalOpen} title={itemDraft.id ? 'Editar elemento' : 'Nuevo elemento'} onClose={() => setItemModalOpen(false)}>
        <div className='mb'>
          <div className='fg'>
            <label>Nombre</label>
            <input value={itemDraft.name} onChange={(event) => setItemDraft((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div className='form-row'>
            <div className='fg'>
              <label>Costo</label>
              <input
                type='number'
                value={itemDraft.cost}
                onChange={(event) => setItemDraft((prev) => ({ ...prev, cost: event.target.value }))}
              />
            </div>
            <div className='fg'>
              <label>Precio</label>
              <input
                type='number'
                value={itemDraft.price}
                onChange={(event) => setItemDraft((prev) => ({ ...prev, price: event.target.value }))}
              />
            </div>
          </div>
          {itemDraft.type === 'paquete' && (
            <div className='fg'>
              <label>Descripción</label>
              <textarea rows='2' value={itemDraft.desc || ''} onChange={(event) => setItemDraft((prev) => ({ ...prev, desc: event.target.value }))}></textarea>
            </div>
          )}
        </div>
        <div className='mf'>
          <button className='btn btn-s' type='button' onClick={() => setItemModalOpen(false)}>
            Cancelar
          </button>
          <button className='btn btn-p' type='button' onClick={saveItem} style={{ width: 'auto' }}>
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  )
}
