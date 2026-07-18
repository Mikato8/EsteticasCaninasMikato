export const normalizeEmail = (value) => (value == null ? '' : String(value).trim().toLowerCase())

export const MIN_PASSWORD_LENGTH = 4

export const validateRecoverPayload = ({ email, username, password } = {}) => {
  if (!email || !username || !password) {
    return { ok: false, message: 'email, username y password son obligatorios' }
  }
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: `Contraseña mínimo ${MIN_PASSWORD_LENGTH} caracteres` }
  }
  return { ok: true }
}
