import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gid } from '../src/utils/id.js'

test('gid returns a string with the expected prefix', () => {
  const id = gid()
  assert.equal(typeof id, 'string')
  assert.match(id, /^id_\d+_[a-z0-9]+$/)
})

test('gid returns unique values', () => {
  const ids = new Set(Array.from({ length: 100 }, () => gid()))
  assert.equal(ids.size, 100)
})
