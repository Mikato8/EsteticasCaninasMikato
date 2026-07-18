import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeEmail, validateRecoverPayload } from '../backend/src/utils/recovery.js'

test('normalizeEmail trims, lowercases and handles nullish', () => {
  assert.equal(normalizeEmail('  Correo@Negocio.COM '), 'correo@negocio.com')
  assert.equal(normalizeEmail(null), '')
  assert.equal(normalizeEmail(undefined), '')
})

test('validateRecoverPayload requires all fields', () => {
  assert.equal(validateRecoverPayload({ email: '', username: 'ana', password: '1234' }).ok, false)
  assert.equal(validateRecoverPayload({ email: 'a@b.com', username: '', password: '1234' }).ok, false)
  assert.equal(validateRecoverPayload({ email: 'a@b.com', username: 'ana', password: '' }).ok, false)
})

test('validateRecoverPayload enforces minimum password length', () => {
  const short = validateRecoverPayload({ email: 'a@b.com', username: 'ana', password: '12' })
  assert.equal(short.ok, false)
  assert.match(short.message, /mínimo/)
})

test('validateRecoverPayload accepts a valid payload', () => {
  assert.deepEqual(validateRecoverPayload({ email: 'a@b.com', username: 'ana', password: '1234' }), { ok: true })
})
