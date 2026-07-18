export const normalizeUsername = (value) => (value == null ? '' : String(value).trim())

// Devuelve los usernames repetidos dentro de una misma lista de usuarios
// (comparación sin distinguir mayúsculas/minúsculas ni espacios).
export const findDuplicateUsernames = (users = []) => {
  const seen = new Set()
  const duplicates = new Set()
  for (const user of users) {
    const username = normalizeUsername(user?.username).toLowerCase()
    if (!username) continue
    if (seen.has(username)) duplicates.add(username)
    else seen.add(username)
  }
  return [...duplicates]
}
