import { test } from 'node:test'
import assert from 'node:assert/strict'
import { defaultDataSnapshot } from '../backend/src/utils/default-data.js'

test('defaultDataSnapshot exposes all expected collections', () => {
  const data = defaultDataSnapshot()
  for (const key of ['clients', 'services', 'products', 'packages', 'appointments', 'sales']) {
    assert.ok(Array.isArray(data[key]), `${key} should be an array`)
  }
})

test('defaultDataSnapshot seeds items with unique ids', () => {
  const data = defaultDataSnapshot()
  const items = [...data.clients, ...data.services, ...data.products, ...data.packages]
  const ids = items.map((item) => item.id)
  assert.ok(ids.every((id) => typeof id === 'string' && id.length > 0))
  assert.equal(new Set(ids).size, ids.length)
})
