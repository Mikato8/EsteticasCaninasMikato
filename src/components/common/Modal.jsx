export function Modal({ open, title, onClose, children, width = 520 }) {
  if (!open) return null

  return (
    <div className='mo active' onClick={onClose}>
      <div className='md' style={{ width }} onClick={(event) => event.stopPropagation()}>
        <div className='mh'>
          <h3>{title}</h3>
          <button className='btn-icon' onClick={onClose} type='button'>
            <i className='fa-solid fa-xmark'></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
