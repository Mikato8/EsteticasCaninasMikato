import { test } from 'node:test'
import assert from 'node:assert/strict'
import { breeds, dogBreeds, catBreeds, searchBreeds, formatPeso, formatVida } from '../src/constants/breeds.js'

const TAMANOS = new Set(['Pequeño', 'Mediano', 'Grande', 'Gigante'])

test('breeds combina perros y gatos ordenados por nombre', () => {
  assert.equal(breeds.length, dogBreeds.length + catBreeds.length)
  assert.ok(dogBreeds.length > 50)
  assert.ok(catBreeds.length > 20)
  const names = breeds.map((b) => b.nombre)
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'es'))
  assert.deepEqual(names, sorted)
})

test('cada raza tiene talla, peso y esperanza de vida coherentes', () => {
  for (const breed of breeds) {
    assert.ok(['perro', 'gato'].includes(breed.especie), `${breed.nombre} especie inválida`)
    assert.ok(TAMANOS.has(breed.tamano), `${breed.nombre} talla inválida`)
    assert.ok(breed.pesoMin > 0 && breed.pesoMax >= breed.pesoMin, `${breed.nombre} peso inválido`)
    assert.ok(breed.vidaMin > 0 && breed.vidaMax >= breed.vidaMin, `${breed.nombre} vida inválida`)
  }
})

test('searchBreeds ignora acentos y mayúsculas', () => {
  const res = searchBreeds('caniche', 'perro')
  assert.ok(res.length > 0)
  assert.ok(res.every((b) => b.especie === 'perro'))

  const conAcento = searchBreeds('poodle')
  assert.ok(conAcento.some((b) => b.nombre.toLowerCase().includes('caniche')))
})

test('searchBreeds filtra por especie', () => {
  const gatos = searchBreeds('', 'gato', 500)
  assert.ok(gatos.length > 0)
  assert.ok(gatos.every((b) => b.especie === 'gato'))
})

test('formatPeso y formatVida devuelven rangos legibles', () => {
  const breed = breeds[0]
  assert.match(formatPeso(breed), /kg/)
  assert.match(formatVida(breed), /años/)
})
