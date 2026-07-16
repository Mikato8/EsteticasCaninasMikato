const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = { ok: false, message: 'Respuesta inválida del servidor' }
  }

  if (!response.ok) {
    return {
      ok: false,
      message: data.message || 'Error en la petición',
      status: response.status,
    }
  }

  return data
}

export const apiGet = (url) => request(url)
export const apiPost = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) })
export const apiPut = (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) })
