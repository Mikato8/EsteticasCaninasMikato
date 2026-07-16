import { useMemo, useState } from 'react'
import { Modal } from '../../components/common/Modal'
import { gid } from '../../utils/id'

const initialForm = {
  id: null,
  fecha: '',
  hora: '10:00',
  clienteId: '',
  mascota: '',
  servicioId: '',
  notas: '',
  estado: 'pendiente',
}

export function AppointmentsPage({ account, updateAccount, notify }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)

  const clients = account.clients || []
  const services = [...(account.services || []), ...(account.products || []), ...(account.packages || [])]

  const rows = useMemo(
    () =>
      (account.appointments || [])
        .filter((item) => {
          const text = `${item.clienteName} ${item.mascota}`.toLowerCase()
          const byText = !search || text.includes(search.toLowerCase())
          const byStatus = statusFilter === 'all' || item.estado === statusFilter
          return byText && byStatus
        })
        .sort((a, b) => `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`)),
    [account.appointments, search, statusFilter],
  )

  const saveAppointment = () => {
    if (!form.fecha || !form.hora || !form.mascota) {
      notify('Completa fecha, hora y mascota', 'e')
      return
    }

    const client = clients.find((c) => c.id === form.clienteId)
    const service = services.find((s) => s.id === form.servicioId)

    updateAccount((prev) => {
      const list = [...(prev.appointments || [])]
      const payload = {
        ...form,
        id: form.id || gid(),
        clienteName: client?.name || 'Cliente',
        servicioName: service?.name || 'Servicio',
      }
      const index = list.findIndex((it) => it.id === payload.id)
      if (index >= 0) list[index] = payload
      else list.push(payload)
      return { ...prev, appointments: list }
    })

    notify(form.id ? 'Cita actualizada' : 'Cita creada')
    setModalOpen(false)
    setForm(initialForm)
  }

  return (
    <div className='page active'>
      <div className='tc'>
        <div className='th'>
          <h3>Citas</h3>
          <div className='tf'>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Buscar...' />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value='all'>Todos</option>
              <option value='pendiente'>Pendiente</option>
              <option value='confirmada'>Confirmada</option>
              <option value='completada'>Completada</option>
              <option value='cancelada'>Cancelada</option>
            </select>
            <button
              className='btn btn-p btn-sm'
              type='button'
              onClick={() => {
                setForm({
                  ...initialForm,
                  fecha: new Date().toISOString().slice(0, 10),
                  clienteId: clients[0]?.id || '',
                  servicioId: services[0]?.id || '',
                  mascota: clients[0]?.mascota || '',
                })
                setModalOpen(true)
              }}
            >
              <i className='fa-solid fa-plus'></i> Nueva
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Mascota</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td>{item.fecha}</td>
                  <td>{item.hora}</td>
                  <td>{item.clienteName}</td>
                  <td>{item.mascota}</td>
                  <td>{item.servicioName}</td>
                  <td>
                    <span className='badge bp'>{item.estado}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className='btn-icon' onClick={() => { setForm(item); setModalOpen(true) }} type='button'>
                        <i className='fa-solid fa-pen-to-square'></i>
                      </button>
                      <button
                        className='btn-icon'
                        type='button'
                        onClick={() => {
                          updateAccount((prev) => ({
                            ...prev,
                            appointments: (prev.appointments || []).filter((x) => x.id !== item.id),
                          }))
                          notify('Cita eliminada', 'i')
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

      <Modal open={modalOpen} title={form.id ? 'Editar Cita' : 'Nueva Cita'} onClose={() => setModalOpen(false)}>
        <div className='mb'>
          <div className='form-row'>
            <div className='fg'>
              <label>Fecha</label>
              <input type='date' value={form.fecha} onChange={(event) => setForm((prev) => ({ ...prev, fecha: event.target.value }))} />
            </div>
            <div className='fg'>
              <label>Hora</label>
              <input type='time' value={form.hora} onChange={(event) => setForm((prev) => ({ ...prev, hora: event.target.value }))} />
            </div>
          </div>
          <div className='fg'>
            <label>Cliente</label>
            <select
              value={form.clienteId}
              onChange={(event) => {
                const client = clients.find((c) => c.id === event.target.value)
                setForm((prev) => ({ ...prev, clienteId: event.target.value, mascota: client?.mascota || prev.mascota }))
              }}
            >
              <option value=''>Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} — {client.mascota}
                </option>
              ))}
            </select>
          </div>
          <div className='fg'>
            <label>Mascota</label>
            <input value={form.mascota} onChange={(event) => setForm((prev) => ({ ...prev, mascota: event.target.value }))} />
          </div>
          <div className='fg'>
            <label>Servicio</label>
            <select value={form.servicioId} onChange={(event) => setForm((prev) => ({ ...prev, servicioId: event.target.value }))}>
              <option value=''>Seleccionar</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className='fg'>
            <label>Notas</label>
            <textarea rows='2' value={form.notas} onChange={(event) => setForm((prev) => ({ ...prev, notas: event.target.value }))}></textarea>
          </div>
          <div className='fg'>
            <label>Estado</label>
            <select value={form.estado} onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}>
              <option value='pendiente'>Pendiente</option>
              <option value='confirmada'>Confirmada</option>
              <option value='completada'>Completada</option>
              <option value='cancelada'>Cancelada</option>
            </select>
          </div>
        </div>
        <div className='mf'>
          <button className='btn btn-s' onClick={() => setModalOpen(false)} type='button'>
            Cancelar
          </button>
          <button className='btn btn-p' onClick={saveAppointment} type='button' style={{ width: 'auto' }}>
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  )
}
