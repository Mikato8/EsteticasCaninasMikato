import { useEffect, useMemo, useRef, useState } from 'react'
import { searchBreeds, formatPeso, formatVida } from '../../constants/breeds'

const especieLabel = { perro: 'Perro', gato: 'Gato' }

// Campo de búsqueda de razas con lista desplegable filtrable.
// Permite escribir una raza libre o elegir una del catálogo; al elegir
// una del catálogo dispara onSelect con el registro completo (talla/peso/vida).
export function BreedSearch({ value, onChange, onSelect, especie = 'all', placeholder = 'Buscar raza...' }) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const wrapRef = useRef(null)

  const results = useMemo(() => searchBreeds(value, especie), [value, especie])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const choose = (breed) => {
    onChange(breed.nombre)
    onSelect?.(breed)
    setOpen(false)
  }

  const onKeyDown = (event) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true)
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (event.key === 'Enter' && open && results[highlight]) {
      event.preventDefault()
      choose(results[highlight])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className='breed-search' ref={wrapRef}>
      <input
        value={value}
        placeholder={placeholder}
        autoComplete='off'
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setHighlight(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && results.length > 0 && (
        <ul className='breed-list' role='listbox'>
          {results.map((breed, index) => (
            <li key={`${breed.especie}-${breed.nombre}`} role='option' aria-selected={index === highlight}>
              <button
                type='button'
                className={`breed-option${index === highlight ? ' active' : ''}`}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => choose(breed)}
              >
                <span className='breed-name'>
                  <i className={`fa-solid ${breed.especie === 'gato' ? 'fa-cat' : 'fa-dog'}`}></i> {breed.nombre}
                </span>
                <span className='breed-meta'>
                  {especieLabel[breed.especie]} · {breed.tamano} · {formatPeso(breed)} · {formatVida(breed)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
