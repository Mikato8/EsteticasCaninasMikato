import { useMemo, useState } from 'react'
import { Modal } from '../../components/common/Modal'
import { gid } from '../../utils/id'

const emptyClient = {
  id: null,
  name: '',
  tel: '',
  email: '',
  mascota: '',
  raza: '',
  tamano: 'Mediano',
  edad: '',
  notas: '',
}

export function ClientsPage({ account, updateAccount, notify }) {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyClient)

  const rows = useMemo(
    () =>
      (account.clients || []).filter((client) => {
        const text = `${client.name} ${client.mascota} ${client.raza}`.toLowerCase()
        return !search || text.includes(search.toLowerCase())
      }),
    [account.clients, search],
  )

  const saveClient = () => {
    if (!form.name || !form.mascota) {
      notify('Nombre y mascota obligatorios', 'e')
      return
    }
    updateAccount((prev) => {
      const list = [...(prev.clients || [])]
      const payload = { ...form, id: form.id || gid() }
      const index = list.findIndex((item) => item.id === payload.id)
      if (index >= 0) list[index] = payload
      else list.push(payload)
      return { ...prev, clients: list }
    })
    notify(form.id ? 'Cliente actualizado' : 'Cliente agregado')
    setModalOpen(false)
    setForm(emptyClient)
  }

  return (
    <div className='page active'>
      <div className='tc'>
        <div className='th'>
          <h3>Clientes y Mascotas</h3>
          <div className='tf'>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Buscar...' />
            <button className='btn btn-p btn-sm' type='button' onClick={() => setModalOpen(true)}>
              <i className='fa-solid fa-plus'></i> Nuevo
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Mascota</th>
                <th>Raza</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.tel || '—'}</td>
                  <td>{client.mascota}</td>
                  <td>{client.raza || '—'}</td>
                  <td>{client.notas || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className='btn-icon'
                        type='button'
                        onClick={() => {
                          setForm(client)
                          setModalOpen(true)
                        }}
                      >
                        <i className='fa-solid fa-pen-to-square'></i>
                      </button>
                      <button
                        className='btn-icon'
                        type='button'
                        onClick={() => {
                          updateAccount((prev) => ({
                            ...prev,
                            clients: (prev.clients || []).filter((item) => item.id !== client.id),
                          }))
                          notify('Cliente eliminado', 'i')
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

      <Modal open={modalOpen} title={form.id ? 'Editar Cliente' : 'Nuevo Cliente'} onClose={() => setModalOpen(false)}>
        <div className='mb'>
          <div className='fg'>
            <label>Nombre del dueño</label>
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div className='form-row'>
            <div className='fg'>
              <label>Teléfono</label>
              <input value={form.tel} onChange={(event) => setForm((prev) => ({ ...prev, tel: event.target.value }))} />
            </div>
            <div className='fg'>
              <label>Email</label>
              <input type='email' value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            </div>
          </div>
          <div className='form-row'>
            <div className='fg'>
              <label>Mascota</label>
              <input value={form.mascota} onChange={(event) => setForm((prev) => ({ ...prev, mascota: event.target.value }))} />
            </div>
            <div className='fg'>
              <label>Raza</label>
              <input value={form.raza} onChange={(event) => setForm((prev) => ({ ...prev, raza: event.target.value }))} />
            </div>
          </div>
          <div className='form-row'>
            <div className='fg'>
              <label>Tamaño</label>
              <select value={form.tamano} onChange={(event) => setForm((prev) => ({ ...prev, tamano: event.target.value }))}>
                <option>Pequeño</option>
                <option>Mediano</option>
                <option>Grande</option>
                <option>Gigante</option>
              </select>
            </div>
            <div className='fg'>
              <label>Edad</label>
              <input value={form.edad} onChange={(event) => setForm((prev) => ({ ...prev, edad: event.target.value }))} />
            </div>
          </div>
          <div className='fg'>
            <label>Notas</label>
            <textarea rows='2' value={form.notas} onChange={(event) => setForm((prev) => ({ ...prev, notas: event.target.value }))}></textarea>
          </div>
        </div>
        <div className='mf'>
          <button className='btn btn-s' onClick={() => setModalOpen(false)} type='button'>
            Cancelar
          </button>
          <button className='btn btn-p' onClick={saveClient} type='button' style={{ width: 'auto' }}>
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  )
}
