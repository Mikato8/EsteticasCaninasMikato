export function ToastContainer({ toasts }) {
  return (
    <div className='toast-c'>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast t-${toast.type}`}>
          <i
            className={`fa-solid ${
              toast.type === 's' ? 'fa-check-circle' : toast.type === 'e' ? 'fa-circle-exclamation' : 'fa-circle-info'
            }`}
          ></i>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
