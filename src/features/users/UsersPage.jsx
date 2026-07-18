import { useMemo, useState } from 'react'
import { Modal } from '../../components/common/Modal'
import { gid } from '../../utils/id'

const emptyUser = { id: null, name: '', username: '', password: '', role: 'user' }

export function UsersPage({ account, currentUser, updateAccount, notify }) {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyUser)

  const users = useMemo(
    () => (account.users || []).filter((u) => !search || `${u.name} ${u.username}`.toLowerCase().includes(search.toLowerCase())),
    [account.users, search],
  )

  const saveUser = () => {
    if (!form.name || !form.username) {
      notify('Nombre y usuario obligatorios', 'e')
      return
    }
    if (!form.id && form.password.length < 4) {
      notify('Contraseña mínimo 4 caracteres', 'e')
      return
    }
    const username = form.username.trim().toLowerCase()
    const clash = (account.users || []).some((item) => item.id !== form.id && (item.username || '').trim().toLowerCase() === username)
    if (clash) {
      notify('Ese usuario ya existe en este negocio', 'e')
      return
    }
    updateAccount((prev) => {
      const list = [...(prev.users || [])]
      const payload = {
        ...form,
        id: form.id || gid(),
        createdAt: form.createdAt || new Date().toISOString(),
      }
      const index = list.findIndex((item) => item.id === payload.id)
      if (index >= 0) {
        list[index] = {
          ...list[index],
          ...payload,
          password: payload.password ? payload.password : list[index].password,
        }
      } else {
        list.push(payload)
      }
      return { ...prev, users: list }
    })
    notify(form.id ? 'Usuario actualizado' : 'Usuario creado')
    setModalOpen(false)
    setForm(emptyUser)
  }

  return (
    <div className='page active'>
      <div className='tc'>
        <div className='th'>
          <h3>Usuarios del Negocio</h3>
          <div className='tf'>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Buscar...' />
            <button className='btn btn-p btn-sm' type='button' onClick={() => setModalOpen(true)}>
              <i className='fa-solid fa-user-plus'></i> Nuevo
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.role === 'admin' ? 'Administrador' : 'Empleado'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('es-MX')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className='btn-icon' type='button' onClick={() => { setForm({ ...user, password: '' }); setModalOpen(true) }}>
                        <i className='fa-solid fa-pen-to-square'></i>
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          className='btn-icon'
                          type='button'
                          onClick={() => {
                            updateAccount((prev) => ({ ...prev, users: (prev.users || []).filter((u) => u.id !== user.id) }))
                            notify('Usuario eliminado', 'i')
                          }}
                        >
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={modalOpen} title={form.id ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={() => setModalOpen(false)}>
        <div className='mb'>
          <div className='fg'>
            <label>Nombre completo</label>
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div className='fg'>
            <label>Usuario</label>
            <input value={form.username} onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))} />
          </div>
          <div className='fg'>
            <label>Contraseña</label>
            <input type='password' value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
          </div>
          <div className='fg'>
            <label>Rol</label>
            <select value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
              <option value='user'>Empleado</option>
              <option value='admin'>Administrador</option>
            </select>
          </div>
        </div>
        <div className='mf'>
          <button className='btn btn-s' onClick={() => setModalOpen(false)} type='button'>
            Cancelar
          </button>
          <button className='btn btn-p' onClick={saveUser} type='button' style={{ width: 'auto' }}>
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  )
}
