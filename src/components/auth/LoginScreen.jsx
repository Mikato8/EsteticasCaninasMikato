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

const initialRecover = {
  email: '',
  username: '',
  password: '',
  confirm: '',
}

function PasswordInput({ value, onChange, placeholder = 'Tu contraseña', autoComplete = 'current-password' }) {
  const [show, setShow] = useState(false)
  return (
    <div className='password-field'>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type='button'
        className='password-toggle'
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <i className={show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
      </button>
    </div>
  )
}

export function LoginScreen({ onLogin, onRegister, onRecover }) {
  const [mode, setMode] = useState('login')
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState(initialRegister)
  const [recoverData, setRecoverData] = useState(initialRecover)

  const submitRecover = () => {
    if (recoverData.password !== recoverData.confirm) return
    onRecover({ email: recoverData.email, username: recoverData.username, password: recoverData.password })
    setRecoverData(initialRecover)
  }

  return (
    <div className='login-screen'>
      <div className='bg-decor'>
        <div className='blob b1'></div>
        <div className='blob b2'></div>
      </div>
      <div className='login-box'>
        {mode === 'login' && (
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
              <PasswordInput
                value={loginData.password}
                onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
              />
            </div>
            <button type='button' className='btn btn-p' onClick={() => onLogin(loginData)}>
              <i className='fa-solid fa-right-to-bracket'></i> Iniciar Sesión
            </button>
            <div className='login-toggle'>
              <a onClick={() => setMode('recover')}>¿Olvidaste tu contraseña?</a>
            </div>
            <div className='login-toggle'>
              ¿No tienes cuenta?{' '}
              <a onClick={() => setMode('register')}>Crear mi negocio</a>
            </div>
          </div>
        )}
        {mode === 'recover' && (
          <div>
            <div className='login-logo'>
              <div className='ico'>
                <i className='fa-solid fa-key'></i>
              </div>
              <h1>Recuperar Cuenta</h1>
              <p>Verifica el e-mail de tu negocio y define una nueva contraseña</p>
            </div>
            <div className='fg'>
              <label>Email del negocio</label>
              <input
                type='email'
                value={recoverData.email}
                onChange={(event) => setRecoverData((prev) => ({ ...prev, email: event.target.value }))}
                placeholder='correo@negocio.com'
              />
            </div>
            <div className='fg'>
              <label>Usuario</label>
              <input
                value={recoverData.username}
                onChange={(event) => setRecoverData((prev) => ({ ...prev, username: event.target.value }))}
                placeholder='Tu usuario'
              />
            </div>
            <div className='fg'>
              <label>Nueva contraseña</label>
              <PasswordInput
                value={recoverData.password}
                onChange={(event) => setRecoverData((prev) => ({ ...prev, password: event.target.value }))}
                placeholder='Mínimo 4 caracteres'
                autoComplete='new-password'
              />
            </div>
            <div className='fg'>
              <label>Confirmar contraseña</label>
              <PasswordInput
                value={recoverData.confirm}
                onChange={(event) => setRecoverData((prev) => ({ ...prev, confirm: event.target.value }))}
                placeholder='Repite la contraseña'
                autoComplete='new-password'
              />
            </div>
            <button
              type='button'
              className='btn btn-p'
              disabled={
                !recoverData.email ||
                !recoverData.username ||
                recoverData.password.length < 4 ||
                recoverData.password !== recoverData.confirm
              }
              onClick={submitRecover}
            >
              <i className='fa-solid fa-rotate'></i> Restablecer Contraseña
            </button>
            <div className='login-toggle'>
              <a onClick={() => setMode('login')}>Volver a iniciar sesión</a>
            </div>
          </div>
        )}
        {mode === 'register' && (
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
                <PasswordInput
                  value={registerData.password}
                  onChange={(event) => setRegisterData((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder='Mínimo 4 caracteres'
                  autoComplete='new-password'
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
