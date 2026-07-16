export function notFoundMiddleware(req, res) {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  })
}

export function errorMiddleware(err, req, res, _next) {
  console.error('[API ERROR]', err)
  res.status(err.statusCode || 500).json({
    ok: false,
    message: err.message || 'Error interno del servidor',
  })
}
