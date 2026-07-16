import { useState } from 'react'

const initialRegister = {
  businessName: '',
  name: '',
  businessPhone: '',
  businessEmail: '',
  username: '',
  password: '',
  businessAddress: '',
}

export function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState(initialRegister)

  return (
    <div className='login-screen'>
      <div className='bg-decor'>
        <div className='blob b1'></div>
        <div className='blob b2'></div>
      </div>
      <div className='login-box'>
        {mode === 'login' ? (
          <div>
            <div className='login-logo'>
              <div className='ico'>
                <i className='fa-solid fa-paw'></i>
              </div>
              <h1>Mikato Software</h1>
              <p>Sistema de Gestión para Estética Canina</p>
            </div>
            <div className='fg'>
              <label>Usuario</label>
              <input
                value={loginData.username}
                onChange={(event) => setLoginData((prev) => ({ ...prev, username: event.target.value }))}
                placeholder='Tu usuario'
              />
            </div>
            <div className='fg'>
              <label>Contraseña</label>
              <input
                type='password'
                value={loginData.password}
                onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
                placeholder='Tu contraseña'
              />
            </div>
            <button type='button' className='btn btn-p' onClick={() => onLogin(loginData)}>
              <i className='fa-solid fa-right-to-bracket'></i> Iniciar Sesión
            </button>
            <div className='login-toggle'>
              ¿No tienes cuenta?{' '}
              <a onClick={() => setMode('register')}>Crear mi negocio</a>
            </div>
          </div>
        ) : (
          <div>
            <div className='login-logo'>
              <div className='ico'>
                <i className='fa-solid fa-building'></i>
              </div>
              <h1>Crear Negocio</h1>
              <p>Registra tu estética canina en Mikato</p>
            </div>
            <div className='fg'>
              <label>Nombre del Negocio</label>
              <input
                value={registerData.businessName}
                onChange={(event) => setRegisterData((prev) => ({ ...prev, businessName: event.target.value }))}
              />
            </div>
            <div className='fg'>
              <label>Tu Nombre Completo</label>
              <input value={registerData.name} onChange={(event) => setRegisterData((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className='form-row'>
              <div className='fg'>
                <label>Teléfono del Negocio</label>
                <input
                  value={registerData.businessPhone}
                  onChange={(event) => setRegisterData((prev) => ({ ...prev, businessPhone: event.target.value }))}
                />
              </div>
              <div className='fg'>
                <label>Email</label>
                <input
                  type='email'
                  value={registerData.businessEmail}
                  onChange={(event) => setRegisterData((prev) => ({ ...prev, businessEmail: event.target.value }))}
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='fg'>
                <label>Usuario</label>
                <input
                  value={registerData.username}
                  onChange={(event) => setRegisterData((prev) => ({ ...prev, username: event.target.value }))}
                />
              </div>
              <div className='fg'>
                <label>Contraseña</label>
                <input
                  type='password'
                  value={registerData.password}
                  onChange={(event) => setRegisterData((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>
            </div>
            <div className='fg'>
              <label>Dirección</label>
              <input
                value={registerData.businessAddress}
                onChange={(event) => setRegisterData((prev) => ({ ...prev, businessAddress: event.target.value }))}
              />
            </div>
            <button type='button' className='btn btn-p' onClick={() => onRegister(registerData)}>
              <i className='fa-solid fa-rocket'></i> Crear Mi Negocio
            </button>
            <div className='login-toggle'>
              ¿Ya tienes cuenta?{' '}
              <a onClick={() => setMode('login')}>Iniciar sesión</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
